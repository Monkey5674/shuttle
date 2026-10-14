'use strict';
// A browser window: a BaseWindow holding one "chrome" WebContentsView (tab
// strip, toolbar, bookmarks bar, find bar, popups) plus one WebContentsView per
// tab. Tab state is owned here and mirrored to the chrome UI over IPC.
const path = require('path');
const { BaseWindow, WebContentsView, session, nativeTheme, shell } = require('electron');
const store = require('./store');
const privacy = require('./privacy');
const urls = require('./urls');

const DEFAULT_CHROME_HEIGHT = 104;
const windows = new Set();
let nextTabId = 1;

const PAGE_PRELOAD = path.join(__dirname, '..', 'preload', 'page-preload.js');
const UI_PRELOAD = path.join(__dirname, '..', 'preload', 'ui-preload.js');

class BrowserWin {
  constructor({ isPrivate = false, bounds, tabs: initialTabs, activeIndex = 0 } = {}) {
    this.isPrivate = isPrivate;
    this.tabs = [];
    this.activeId = null;
    this.chromeHeight = DEFAULT_CHROME_HEIGHT;
    this.overlay = false;
    this.htmlFullscreen = false;
    this.session = isPrivate ? session.fromPartition('private-' + Date.now() + Math.random()) : session.defaultSession;
    if (isPrivate) require('./sessions').configure(this.session, { isPrivate: true });

    const dark = nativeTheme.shouldUseDarkColors;
    this.win = new BaseWindow({
      width: 1200, height: 800, minWidth: 480, minHeight: 300,
      ...(bounds || {}),
      title: isPrivate ? 'Drew\'s Browser (Private)' : 'Drew\'s Browser',
      backgroundColor: dark ? '#202124' : '#f1f3f4',
      titleBarStyle: 'hidden',
      titleBarOverlay: { color: dark ? '#202124' : '#dee1e6', symbolColor: dark ? '#e8eaed' : '#202124', height: 36 },
      icon: path.join(__dirname, '..', 'build', 'icon.png'),
      show: false
    });
    this.win.setMenuBarVisibility(false);
    windows.add(this);

    this.ui = new WebContentsView({
      webPreferences: {
        preload: UI_PRELOAD, contextIsolation: true, sandbox: true, nodeIntegration: false,
        spellcheck: false, backgroundThrottling: false
      }
    });
    this.ui.setBackgroundColor('#00000000');
    this.win.contentView.addChildView(this.ui);
    this.ui.webContents.loadFile(path.join(__dirname, '..', 'ui', 'index.html'), { query: { private: isPrivate ? '1' : '0' } });
    this.ui.webContents.on('before-input-event', (e, input) => this.handleShortcut(e, input, true));
    this.ui.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

    this.win.on('resize', () => this.layout());
    this.win.on('maximize', () => this.layout());
    this.win.on('unmaximize', () => this.layout());
    this.win.on('enter-full-screen', () => this.layout());
    this.win.on('leave-full-screen', () => this.layout());
    this.win.on('focus', () => { const t = this.activeTab(); if (t) t.view.webContents.focus(); });
    this.win.on('app-command', (e, cmd) => {
      if (cmd === 'browser-backward') this.goBack();
      else if (cmd === 'browser-forward') this.goForward();
    });
    this.win.on('close', () => this.persistSession());
    this.win.on('closed', () => {
      windows.delete(this);
      for (const t of this.tabs) this.destroyTab(t);
      this.tabs = [];
      require('./app-state').onWindowClosed(this);
    });

    this.layout();
    // BaseWindow has no 'ready-to-show'; show once the chrome UI has rendered
    // (with a fallback so a broken UI never leaves the window invisible).
    const show = () => { if (!this.win.isDestroyed() && !this.win.isVisible()) this.win.show(); };
    this.ui.webContents.once('did-finish-load', show);
    setTimeout(show, 1500);

    const list = (initialTabs && initialTabs.length) ? initialTabs : [{ url: store.settings.get().homepage || 'drew://newtab' }];
    list.forEach((t, i) => this.newTab(t.url, { active: i === activeIndex, title: t.title }));
    if (!this.activeTab() && this.tabs[0]) this.activate(this.tabs[0].id);
  }

  // ----- layout -----------------------------------------------------------
  layout() {
    if (this.win.isDestroyed()) return;
    const [w, h] = this.win.getContentSize();
    const chrome = this.htmlFullscreen ? 0 : this.chromeHeight;
    this.ui.setBounds({ x: 0, y: 0, width: w, height: this.htmlFullscreen ? 0 : (this.overlay ? h : chrome) });
    for (const t of this.tabs) {
      if (t.id === this.activeId) t.view.setBounds({ x: 0, y: chrome, width: w, height: Math.max(0, h - chrome) });
    }
  }
  setChromeHeight(px) {
    this.chromeHeight = Math.max(40, Math.min(400, Number(px) || DEFAULT_CHROME_HEIGHT));
    this.layout();
  }
  setOverlay(open) {
    this.overlay = !!open;
    this.layout();
    if (open) this.ui.webContents.focus();
  }

  // ----- tabs -------------------------------------------------------------
  activeTab() { return this.tabs.find((t) => t.id === this.activeId) || null; }
  tabById(id) { return this.tabs.find((t) => t.id === id) || null; }
  tabByWebContents(wc) { return this.tabs.find((t) => t.view.webContents === wc) || null; }

  newTab(url, { active = true, index, title } = {}) {
    const view = new WebContentsView({
      webPreferences: {
        preload: PAGE_PRELOAD,
        session: this.session,
        contextIsolation: true,
        sandbox: true,
        nodeIntegration: false,
        webviewTag: false,
        safeDialogs: true,
        spellcheck: true,
        navigateOnDragDrop: false,
        autoplayPolicy: 'document-user-activation-required'
      }
    });
    const tab = {
      id: nextTabId++, view, url: url || 'drew://newtab', title: title || 'New Tab', favicon: '',
      loading: false, canGoBack: false, canGoForward: false, audible: false, muted: false,
      zoom: 100, blocked: 0, error: null, findActive: false
    };
    if (index == null || index < 0 || index > this.tabs.length) this.tabs.push(tab); else this.tabs.splice(index, 0, tab);
    this.wireTab(tab);
    view.setBackgroundColor('#ffffff');
    // Insert page views *below* the chrome UI view (index 0 = bottom of the
    // stack) so menus and dropdowns always render above the page.
    this.win.contentView.addChildView(view, 0);
    view.setVisible(false);
    view.webContents.loadURL(tab.url).catch(() => {});
    if (active) this.activate(tab.id); else this.broadcast();
    return tab;
  }

  wireTab(tab) {
    const wc = tab.view.webContents;
    const update = (patch) => { Object.assign(tab, patch); this.broadcast(); };
    wc.on('did-start-loading', () => update({ loading: true, error: null }));
    wc.on('did-stop-loading', () => update({ loading: false, canGoBack: wc.navigationHistory.canGoBack(), canGoForward: wc.navigationHistory.canGoForward() }));
    wc.on('did-start-navigation', (details) => {
      if (details.isMainFrame && !details.isSameDocument) privacy.resetCount(wc.id);
    });
    wc.on('did-navigate', (e, url) => {
      if (!urls.isErrorPage(url)) tab.error = null;
      update({ url: urls.isErrorPage(url) ? urls.errorPageTarget(url) : url, canGoBack: wc.navigationHistory.canGoBack(), canGoForward: wc.navigationHistory.canGoForward() });
      if (!this.isPrivate && !urls.isErrorPage(url)) store.history.record(url, wc.getTitle());
      if (this.activeId === tab.id) this.win.setTitle(this.windowTitle(tab));
    });
    wc.on('did-navigate-in-page', (e, url, isMainFrame) => {
      if (!isMainFrame) return;
      update({ url, canGoBack: wc.navigationHistory.canGoBack(), canGoForward: wc.navigationHistory.canGoForward() });
      if (!this.isPrivate) store.history.record(url, wc.getTitle());
    });
    wc.on('page-title-updated', (e, title) => {
      update({ title: title || tab.url });
      if (!this.isPrivate) store.history.setTitle(wc.getURL(), title);
      if (this.activeId === tab.id) this.win.setTitle(this.windowTitle(tab));
    });
    wc.on('page-favicon-updated', (e, icons) => update({ favicon: icons && icons[0] ? icons[0] : '' }));
    wc.on('media-started-playing', () => update({ audible: true }));
    wc.on('media-paused', () => update({ audible: wc.isCurrentlyAudible() }));
    wc.on('audio-state-changed', (e) => update({ audible: e.audible }));
    wc.on('zoom-changed', (e, dir) => { this.zoom(tab.id, dir === 'in' ? 1 : -1); });
    wc.on('enter-html-full-screen', () => { this.htmlFullscreen = true; this.layout(); });
    wc.on('leave-html-full-screen', () => { this.htmlFullscreen = false; this.layout(); });
    wc.on('found-in-page', (e, r) => {
      this.ui.webContents.send('find:result', { tabId: tab.id, active: r.activeMatchOrdinal, total: r.matches });
    });
    wc.on('before-input-event', (e, input) => this.handleShortcut(e, input, false));
    wc.on('did-fail-load', (e, code, desc, failedUrl, isMainFrame) => {
      if (!isMainFrame || code === -3 /* aborted */ || code === 0) return;
      // Retry over plain http if we upgraded this navigation ourselves.
      const fallback = privacy.httpsFallbackFor(wc.id, failedUrl);
      if (fallback) { wc.loadURL(fallback); return; }
      tab.error = { code, desc, url: failedUrl };
      tab.url = failedUrl;
      wc.loadURL(urls.errorPage(failedUrl, code, desc)).catch(() => {});
      this.broadcast();
    });
    wc.on('render-process-gone', (e, details) => {
      if (details.reason === 'clean-exit') return;
      tab.error = { code: 0, desc: 'RENDERER_' + details.reason.toUpperCase(), url: tab.url };
      wc.loadURL(urls.errorPage(tab.url, 0, 'The page crashed (' + details.reason + ').')).catch(() => {});
    });
    wc.on('context-menu', (e, params) => require('./context-menu').show(this, tab, params));
    wc.on('focus', () => { if (this.overlay) this.ui.webContents.send('ui:close-popups'); });
    wc.on('destroyed', () => {});
    wc.setWindowOpenHandler(({ url, disposition }) => {
      if (!urls.isWebUrl(url)) { urls.maybeOpenExternal(url, this.win); return { action: 'deny' }; }
      const active = disposition !== 'background-tab';
      this.newTab(url, { active, index: this.tabs.indexOf(tab) + 1 });
      return { action: 'deny' };
    });
  }

  windowTitle(tab) {
    const base = this.isPrivate ? 'Drew\'s Browser (Private)' : 'Drew\'s Browser';
    return tab && tab.title ? `${tab.title} - ${base}` : base;
  }

  activate(id) {
    const tab = this.tabById(id);
    if (!tab) return;
    const prev = this.activeTab();
    if (prev && prev !== tab) {
      prev.view.setVisible(false);
      if (prev.findActive) { prev.view.webContents.stopFindInPage('clearSelection'); prev.findActive = false; prev.findText = ''; }
    }
    this.activeId = id;
    tab.view.setVisible(true);
    this.layout();
    this.win.setTitle(this.windowTitle(tab));
    if (!this.overlay) tab.view.webContents.focus();
    this.broadcast();
  }

  closeTab(id) {
    const idx = this.tabs.findIndex((t) => t.id === id);
    if (idx < 0) return;
    const tab = this.tabs[idx];
    if (this.tabs.length === 1) {
      // Last tab: close the window (the app decides whether that quits).
      this.win.close();
      return;
    }
    if (!this.isPrivate && tab.url && !tab.url.startsWith('drew://newtab')) {
      store.closedTabs.push({ url: tab.url, title: tab.title, index: idx });
    }
    this.tabs.splice(idx, 1);
    if (this.activeId === id) {
      const next = this.tabs[Math.min(idx, this.tabs.length - 1)];
      this.activeId = null;
      this.activate(next.id);
    }
    this.destroyTab(tab);
    this.broadcast();
  }

  destroyTab(tab) {
    try { this.win.contentView.removeChildView(tab.view); } catch {}
    try { tab.view.webContents.close({ waitForBeforeUnload: false }); } catch {}
  }

  closeOtherTabs(id) { for (const t of [...this.tabs]) if (t.id !== id) this.closeTab(t.id); }
  closeTabsToRight(id) {
    const idx = this.tabs.findIndex((t) => t.id === id);
    for (const t of this.tabs.slice(idx + 1)) this.closeTab(t.id);
  }

  reopenClosedTab() {
    const entry = store.closedTabs.pop();
    if (entry) this.newTab(entry.url, { active: true, index: entry.index });
  }

  moveTab(id, toIndex) {
    const from = this.tabs.findIndex((t) => t.id === id);
    if (from < 0) return;
    const [t] = this.tabs.splice(from, 1);
    this.tabs.splice(Math.max(0, Math.min(toIndex, this.tabs.length)), 0, t);
    this.broadcast();
  }

  duplicateTab(id) {
    const t = this.tabById(id);
    if (t) this.newTab(t.url, { active: true, index: this.tabs.indexOf(t) + 1 });
  }

  nextTab(delta) {
    if (this.tabs.length < 2) return;
    const idx = this.tabs.findIndex((t) => t.id === this.activeId);
    const n = (idx + delta + this.tabs.length) % this.tabs.length;
    this.activate(this.tabs[n].id);
  }

  // ----- navigation -------------------------------------------------------
  navigate(input, { tabId } = {}) {
    const tab = tabId ? this.tabById(tabId) : this.activeTab();
    if (!tab) return;
    const url = urls.fromUserInput(input);
    if (!url) return;
    if (!urls.isAllowedNavigation(url)) { urls.maybeOpenExternal(url, this.win); return; }
    tab.url = url;
    tab.error = null;
    tab.view.webContents.loadURL(url).catch(() => {});
    this.broadcast();
  }
  goBack() { const t = this.activeTab(); if (t && t.view.webContents.navigationHistory.canGoBack()) t.view.webContents.navigationHistory.goBack(); }
  goForward() { const t = this.activeTab(); if (t && t.view.webContents.navigationHistory.canGoForward()) t.view.webContents.navigationHistory.goForward(); }
  reload(ignoreCache = false) {
    const t = this.activeTab();
    if (!t) return;
    if (t.error) { t.view.webContents.loadURL(t.error.url).catch(() => {}); return; }
    if (ignoreCache) t.view.webContents.reloadIgnoringCache(); else t.view.webContents.reload();
  }
  stop() { const t = this.activeTab(); if (t) t.view.webContents.stop(); }
  home() { this.navigate(store.settings.get().homepage || 'drew://newtab'); }

  zoom(tabId, delta) {
    const t = tabId ? this.tabById(tabId) : this.activeTab();
    if (!t) return;
    const wc = t.view.webContents;
    const steps = [25, 33, 50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500];
    let i = steps.indexOf(t.zoom);
    if (i < 0) i = steps.indexOf(100);
    if (delta === 0) i = steps.indexOf(100); else i = Math.max(0, Math.min(steps.length - 1, i + delta));
    t.zoom = steps[i];
    wc.setZoomFactor(t.zoom / 100);
    this.broadcast();
  }

  toggleMute(tabId) {
    const t = this.tabById(tabId);
    if (!t) return;
    t.muted = !t.muted;
    t.view.webContents.setAudioMuted(t.muted);
    this.broadcast();
  }

  // Chromium semantics: findNext=true starts a *new* find session, false
  // moves to the next/previous match of the current session.
  find(text, { forward = true } = {}) {
    const t = this.activeTab();
    if (!t) return;
    if (!text) { t.view.webContents.stopFindInPage('clearSelection'); t.findActive = false; t.findText = ''; return; }
    const newSession = !t.findActive || t.findText !== text;
    t.findActive = true;
    t.findText = text;
    t.view.webContents.findInPage(text, { forward, findNext: newSession });
  }
  stopFind() {
    const t = this.activeTab();
    if (t) { t.view.webContents.stopFindInPage('keepSelection'); t.findActive = false; t.findText = ''; t.view.webContents.focus(); }
  }

  toggleBookmark() {
    const t = this.activeTab();
    if (!t || !urls.isBookmarkable(t.url)) return null;
    const existing = store.bookmarks.find(t.url);
    if (existing) { store.bookmarks.remove(existing.id); this.broadcastBookmarks(); return { bookmarked: false }; }
    store.bookmarks.add({ url: t.url, title: t.title });
    this.broadcastBookmarks();
    return { bookmarked: true };
  }

  toggleDevTools() {
    const t = this.activeTab();
    if (!t) return;
    const wc = t.view.webContents;
    if (wc.isDevToolsOpened()) wc.closeDevTools(); else wc.openDevTools({ mode: 'bottom' });
  }

  // ----- keyboard shortcuts (work whether the page or the toolbar has focus)
  handleShortcut(event, input, fromUi) {
    if (input.type !== 'keyDown') return;
    const ctrl = input.control || input.meta;
    const shift = input.shift;
    const alt = input.alt;
    const key = input.key.length === 1 ? input.key.toLowerCase() : input.key;
    const code = input.code;
    const ui = (msg, payload) => this.ui.webContents.send(msg, payload);
    const handled = () => event.preventDefault();

    if (ctrl && !alt) {
      if (key === 't' && !shift) { handled(); return this.newTab(store.settings.get().homepage.startsWith('drew://') ? store.settings.get().homepage : 'drew://newtab', { active: true }), ui('ui:focus-address'); }
      if (key === 't' && shift) { handled(); return this.reopenClosedTab(); }
      if (key === 'w' && !shift) { handled(); return this.closeTab(this.activeId); }
      if (key === 'w' && shift) { handled(); return this.win.close(); }
      if (key === 'n' && !shift) { handled(); return new BrowserWin({ isPrivate: this.isPrivate }); }
      if (key === 'n' && shift) { handled(); return new BrowserWin({ isPrivate: true }); }
      if (key === 'l' || code === 'KeyL') { handled(); return ui('ui:focus-address'); }
      if (key === 'r' && !shift) { handled(); return this.reload(false); }
      if (key === 'r' && shift) { handled(); return this.reload(true); }
      if (key === 'd' && !shift) { handled(); ui('ui:bookmark-toggled', this.toggleBookmark()); return; }
      if (key === 'b' && shift) { handled(); return ui('ui:toggle-bookmarks-bar'); }
      if (key === 'h' && !shift) { handled(); return this.newTab('drew://history', { active: true }); }
      if (key === 'j' && !shift) { handled(); return this.newTab('drew://downloads', { active: true }); }
      if (key === 'f' && !shift) { handled(); return ui('ui:open-find'); }
      if (key === 'p' && !shift) { handled(); const t = this.activeTab(); if (t) t.view.webContents.print(); return; }
      if (key === 'i' && shift) { handled(); return this.toggleDevTools(); }
      if (key === 'Delete' && shift) { handled(); return this.newTab('drew://settings#clear', { active: true }); }
      if (key === 'Tab' || key === 'PageDown') { handled(); return this.nextTab(shift && key === 'Tab' ? -1 : 1); }
      if (key === 'PageUp') { handled(); return this.nextTab(-1); }
      if (key === '=' || key === '+') { handled(); return this.zoom(null, 1); }
      if (key === '-') { handled(); return this.zoom(null, -1); }
      if (key === '0') { handled(); return this.zoom(null, 0); }
      if (/^[1-8]$/.test(key)) { handled(); const t = this.tabs[Number(key) - 1]; if (t) this.activate(t.id); return; }
      if (key === '9') { handled(); return this.activate(this.tabs[this.tabs.length - 1].id); }
    }
    if (alt && !ctrl) {
      if (key === 'ArrowLeft') { handled(); return this.goBack(); }
      if (key === 'ArrowRight') { handled(); return this.goForward(); }
      if (key === 'd') { handled(); return ui('ui:focus-address'); }
      if (key === 'Home') { handled(); return this.home(); }
    }
    if (!ctrl && !alt) {
      if (key === 'F5') { handled(); return this.reload(shift); }
      if (key === 'F6') { handled(); return ui('ui:focus-address'); }
      if (key === 'F11') { handled(); return this.win.setFullScreen(!this.win.isFullScreen()); }
      if (key === 'F12') { handled(); return this.toggleDevTools(); }
      if (key === 'Escape' && !fromUi) { const t = this.activeTab(); if (t && t.loading) { handled(); return this.stop(); } }
    }
  }

  // ----- state sync -------------------------------------------------------
  snapshot() {
    return {
      isPrivate: this.isPrivate,
      activeId: this.activeId,
      tabs: this.tabs.map((t) => ({
        id: t.id, url: t.url, title: t.title, favicon: t.favicon, loading: t.loading,
        canGoBack: t.canGoBack, canGoForward: t.canGoForward, audible: t.audible, muted: t.muted,
        zoom: t.zoom, error: t.error ? { code: t.error.code, desc: t.error.desc } : null,
        blocked: privacy.getCount(t.view.webContents.id).count,
        shieldOff: privacy.isShieldDisabledFor(t.url),
        bookmarked: !!store.bookmarks.find(t.url),
        secure: urls.securityState(t.url, t.error)
      }))
    };
  }
  broadcast() {
    if (this.win.isDestroyed() || this.ui.webContents.isDestroyed()) return;
    this.ui.webContents.send('tabs:update', this.snapshot());
  }
  broadcastBookmarks() {
    for (const w of windows) if (!w.win.isDestroyed()) w.ui.webContents.send('bookmarks:update', store.bookmarks.all());
    this.broadcast();
  }

  persistSession() {
    if (this.isPrivate) return;
    const data = store.session.get();
    const bounds = this.win.isMaximized() ? { ...this.win.getNormalBounds(), maximized: true } : this.win.getBounds();
    const entry = {
      bounds,
      activeIndex: Math.max(0, this.tabs.findIndex((t) => t.id === this.activeId)),
      tabs: this.tabs.map((t) => ({ url: t.url, title: t.title }))
    };
    // Keep the most recently closed normal window as the restore target.
    data.windows = [entry];
    store.session.set(data);
  }
}

function fromWebContents(wc) {
  for (const w of windows) {
    if (w.ui.webContents === wc) return { win: w, tab: null };
    const tab = w.tabByWebContents(wc);
    if (tab) return { win: w, tab };
  }
  return null;
}

function all() { return [...windows]; }
function focused() {
  const fw = BaseWindow.getFocusedWindow();
  for (const w of windows) if (w.win === fw) return w;
  return [...windows][0] || null;
}

module.exports = { BrowserWin, fromWebContents, all, focused, windows };
