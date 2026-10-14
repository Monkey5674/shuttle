'use strict';
// IPC surface. Two callers: the chrome UI (trusted, our own file) and the
// internal drew:// pages (semi-trusted; every handler checks the sender).
const { ipcMain, dialog, shell, app, clipboard } = require('electron');
const fs = require('fs');
const store = require('./store');
const privacy = require('./privacy');
const windows = require('./windows');
const downloads = require('./downloads');
const appState = require('./app-state');
const urls = require('./urls');
const { exportBookmarksHtml, importBookmarksHtml } = require('./bookmarks-io');

function senderIsUi(event) {
  const ctx = windows.fromWebContents(event.sender);
  return ctx && ctx.tab === null ? ctx.win : null;
}
function senderIsInternalPage(event) {
  const url = event.senderFrame ? event.senderFrame.url : event.sender.getURL();
  if (!url.startsWith('drew://')) return null;
  return windows.fromWebContents(event.sender);
}
function senderCtx(event) {
  const ui = senderIsUi(event);
  if (ui) return { win: ui, tab: null, ui: true };
  const page = senderIsInternalPage(event);
  if (page) return { ...page, ui: false };
  return null;
}

function ui(channel, fn) {
  ipcMain.handle(channel, (event, ...args) => {
    const win = senderIsUi(event);
    if (!win) throw new Error('not allowed');
    return fn(win, ...args);
  });
}
function shared(channel, fn) {
  ipcMain.handle(channel, (event, ...args) => {
    const ctx = senderCtx(event);
    if (!ctx) throw new Error('not allowed');
    return fn(ctx, ...args);
  });
}

function register() {
  // ---- window / tab control (UI only) ----
  ui('tabs:state', (w) => w.snapshot());
  ui('tabs:new', (w, url, opts) => { w.newTab(url || 'drew://newtab', { active: true, ...(opts || {}) }); });
  ui('tabs:close', (w, id) => w.closeTab(id));
  ui('tabs:close-others', (w, id) => w.closeOtherTabs(id));
  ui('tabs:close-right', (w, id) => w.closeTabsToRight(id));
  ui('tabs:activate', (w, id) => w.activate(id));
  ui('tabs:move', (w, id, index) => w.moveTab(id, index));
  ui('tabs:duplicate', (w, id) => w.duplicateTab(id));
  ui('tabs:mute', (w, id) => w.toggleMute(id));
  ui('tabs:reopen', (w) => w.reopenClosedTab());
  ui('nav:go', (w, input) => w.navigate(input));
  ui('nav:back', (w) => w.goBack());
  ui('nav:forward', (w) => w.goForward());
  ui('nav:reload', (w, hard) => w.reload(!!hard));
  ui('nav:stop', (w) => w.stop());
  ui('nav:home', (w) => w.home());
  ui('zoom', (w, delta) => w.zoom(null, delta));
  ui('find', (w, text, opts) => w.find(text, opts));
  ui('find:stop', (w) => w.stopFind());
  ui('ui:chrome-height', (w, px) => w.setChromeHeight(px));
  ui('ui:overlay', (w, open) => w.setOverlay(open));
  ui('ui:focus-page', (w) => { const t = w.activeTab(); if (t) t.view.webContents.focus(); });
  ui('suggest', (w, q) => store.history.suggest(q));
  ui('bookmark:toggle', (w) => w.toggleBookmark());
  ui('shield:toggle', (w) => {
    const t = w.activeTab();
    if (!t) return;
    privacy.setShieldEnabledFor(t.url, privacy.isShieldDisabledFor(t.url));
    w.reload();
  });
  ui('shield:info', (w) => {
    const t = w.activeTab();
    if (!t) return { count: 0, hosts: [], off: false };
    return { ...privacy.getCount(t.view.webContents.id), off: privacy.isShieldDisabledFor(t.url), status: privacy.status() };
  });
  ui('window:new', (w, isPrivate) => { new windows.BrowserWin({ isPrivate: !!isPrivate }); });
  ui('window:close', (w) => w.win.close());
  ui('window:fullscreen', (w) => w.win.setFullScreen(!w.win.isFullScreen()));
  ui('devtools', (w) => w.toggleDevTools());
  ui('print', (w) => { const t = w.activeTab(); if (t) t.view.webContents.print(); });
  ui('quit', () => app.quit());
  ui('clipboard:write', (w, text) => clipboard.writeText(String(text || '')));

  // ---- data shared with internal pages ----
  shared('settings:get', () => ({ ...store.settings.get(), engines: store.SEARCH_ENGINES, version: app.getVersion(), electron: process.versions.electron, chrome: process.versions.chrome }));
  shared('settings:set', (ctx, patch) => {
    const result = store.settings.set(patch);
    for (const w of windows.all()) if (!w.win.isDestroyed()) w.ui.webContents.send('settings:update', result);
    if (patch && patch.remoteBlocklist) privacy.updateRemoteList(false);
    return result;
  });
  shared('bookmarks:list', () => store.bookmarks.all());
  shared('bookmarks:add', (ctx, b) => { const r = store.bookmarks.add(b); ctx.win.broadcastBookmarks(); return r; });
  shared('bookmarks:update', (ctx, id, patch) => { const r = store.bookmarks.update(id, patch); ctx.win.broadcastBookmarks(); return r; });
  shared('bookmarks:remove', (ctx, id) => { const r = store.bookmarks.remove(id); ctx.win.broadcastBookmarks(); return r; });
  shared('bookmarks:move', (ctx, id, index) => { store.bookmarks.move(id, index); ctx.win.broadcastBookmarks(); });
  shared('bookmarks:export', async (ctx) => {
    const { canceled, filePath } = await dialog.showSaveDialog(ctx.win.win, { title: 'Export bookmarks', defaultPath: 'bookmarks.html', filters: [{ name: 'HTML', extensions: ['html'] }] });
    if (canceled || !filePath) return false;
    fs.writeFileSync(filePath, exportBookmarksHtml(store.bookmarks.all()));
    return true;
  });
  shared('bookmarks:import', async (ctx) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(ctx.win.win, { title: 'Import bookmarks (HTML export from any browser)', filters: [{ name: 'HTML', extensions: ['html', 'htm'] }], properties: ['openFile'] });
    if (canceled || !filePaths[0]) return 0;
    const imported = importBookmarksHtml(fs.readFileSync(filePaths[0], 'utf8'));
    let n = 0;
    for (const b of imported) if (store.bookmarks.add(b)) n++;
    ctx.win.broadcastBookmarks();
    return n;
  });
  shared('history:list', (ctx, opts) => {
    const list = store.history.all();
    const q = (opts && opts.query || '').toLowerCase();
    const filtered = q ? list.filter((h) => h.url.toLowerCase().includes(q) || (h.title || '').toLowerCase().includes(q)) : list;
    const limit = (opts && opts.limit) || 500;
    return filtered.slice(-limit).reverse();
  });
  shared('history:remove', (ctx, url) => store.history.remove(url));
  shared('history:clear', (ctx, sinceMs) => store.history.clear(sinceMs));
  shared('history:top', () => {
    const counts = new Map();
    for (const h of store.history.all()) {
      const e = counts.get(h.url) || { url: h.url, title: h.title, count: 0 };
      e.count++; e.title = h.title || e.title; counts.set(h.url, e);
    }
    return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 8);
  });
  shared('downloads:list', () => downloads.api.list());
  shared('downloads:pause', (ctx, id) => downloads.api.pause(id));
  shared('downloads:resume', (ctx, id) => downloads.api.resume(id));
  shared('downloads:cancel', (ctx, id) => downloads.api.cancel(id));
  shared('downloads:remove', (ctx, id) => downloads.api.remove(id));
  shared('downloads:clear', () => downloads.api.clear());
  shared('downloads:open', (ctx, id) => downloads.api.open(id));
  shared('downloads:show', (ctx, id) => downloads.api.showInFolder(id));
  shared('downloads:open-folder', () => shell.openPath(app.getPath('downloads')));
  shared('privacy:status', () => privacy.status());
  shared('privacy:update-list', () => privacy.updateRemoteList(true));
  shared('privacy:allowlist-remove', (ctx, host) => privacy.setShieldEnabledFor('https://' + host + '/', true));
  shared('privacy:clear-data', (ctx, opts) => appState.clearBrowsingData(opts));
  shared('permissions:list', () => store.permissions.all());
  shared('permissions:clear', () => store.permissions.clear());
  shared('page:open', (ctx, url, opts) => {
    // Internal pages may only open the kinds of URLs a user could type.
    const target = urls.fromUserInput(url);
    if (!target || !urls.isAllowedNavigation(target)) return;
    if (opts && opts.newTab) ctx.win.newTab(target, { active: !opts.background });
    else if (ctx.tab) ctx.win.navigate(target, { tabId: ctx.tab.id });
    else ctx.win.navigate(target);
  });
  shared('page:retry', (ctx) => { if (ctx.tab) { const u = ctx.tab.error ? ctx.tab.error.url : ctx.tab.url; ctx.tab.error = null; ctx.tab.view.webContents.loadURL(u).catch(() => {}); } });
  shared('page:back', (ctx) => { if (ctx.tab) ctx.win.goBack(); });
}

module.exports = { register };
