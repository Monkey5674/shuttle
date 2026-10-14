'use strict';
/* Browser chrome: renders tab/toolbar state pushed from the main process and
   forwards user actions back over the window.ui bridge. */
const $ = (id) => document.getElementById(id);
const els = {
  tabs: $('tabs'), newtab: $('newtab'), back: $('back'), forward: $('forward'), reload: $('reload'), home: $('home'),
  address: $('address'), security: $('security'), star: $('star'), zoomBadge: $('zoom-badge'), suggestions: $('suggestions'),
  shield: $('shield'), shieldCount: $('shield-count'), downloadsBtn: $('downloads-btn'), menuBtn: $('menu-btn'),
  bookmarksBar: $('bookmarks-bar'), bookmarksList: $('bookmarks-list'), bookmarksEmpty: $('bookmarks-empty'),
  findbar: $('findbar'), findInput: $('find-input'), findCount: $('find-count'),
  backdrop: $('backdrop'), menu: $('menu'), shieldPanel: $('shield-panel'), downloadsPanel: $('downloads-panel'),
  tabMenu: $('tab-menu'), bmMenu: $('bm-menu'), bmDialog: $('bm-dialog'), chrome: $('chrome'), privateBadge: $('private-badge')
};

const state = { tabs: [], activeId: null, isPrivate: false, bookmarks: [], downloads: [], settings: {}, addressFocused: false, suggestions: [], suggIndex: -1, openPopup: null, menuTabId: null, menuBookmark: null };
const isPrivate = new URLSearchParams(location.search).get('private') === '1';
if (isPrivate) els.privateBadge.hidden = false;

const active = () => state.tabs.find((t) => t.id === state.activeId);
function displayUrl(url) {
  if (!url || url === 'drew://newtab' || url === 'drew://newtab/' || url === 'about:blank') return '';
  return url;
}
function hostOf(url) { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; } }
function letterIcon(url, cls = 'fav') {
  const span = document.createElement('span');
  span.className = cls;
  const h = hostOf(url);
  span.textContent = h ? h[0].toUpperCase() : (url && url.startsWith('drew://') ? '★' : '•');
  return span;
}

/* ---------- tabs ---------- */
function renderTabs() {
  const frag = document.createDocumentFragment();
  for (const t of state.tabs) {
    const el = document.createElement('div');
    el.className = 'tab' + (t.id === state.activeId ? ' active' : '');
    el.dataset.id = t.id;
    el.title = t.title + (t.url && !t.url.startsWith('drew://newtab') ? '\n' + t.url : '');
    el.draggable = true;
    if (t.loading) { const s = document.createElement('span'); s.className = 'fav'; s.innerHTML = '<span class="spinner"></span>'; el.appendChild(s); }
    else if (t.favicon && !isPrivate) { const s = document.createElement('span'); s.className = 'fav'; const img = document.createElement('img'); img.src = t.favicon; img.onerror = () => { s.replaceWith(letterIcon(t.url)); }; s.appendChild(img); el.appendChild(s); }
    else el.appendChild(letterIcon(t.url));
    const title = document.createElement('span'); title.className = 'title'; title.textContent = t.title || displayUrl(t.url) || 'New Tab'; el.appendChild(title);
    if (t.audible || t.muted) { const a = document.createElement('button'); a.className = 'audio'; a.textContent = t.muted ? '🔇' : '🔊'; a.title = t.muted ? 'Unmute' : 'Mute'; a.onclick = (e) => { e.stopPropagation(); ui.tabs.mute(t.id); }; el.appendChild(a); }
    const close = document.createElement('button'); close.className = 'close'; close.textContent = '✕'; close.title = 'Close tab (Ctrl+W)';
    close.onclick = (e) => { e.stopPropagation(); ui.tabs.close(t.id); };
    el.appendChild(close);
    el.onmousedown = (e) => { if (e.button === 1) { e.preventDefault(); } };
    el.onauxclick = (e) => { if (e.button === 1) ui.tabs.close(t.id); };
    el.onclick = () => { if (t.id !== state.activeId) ui.tabs.activate(t.id); };
    el.oncontextmenu = (e) => { e.preventDefault(); state.menuTabId = t.id; els.tabMenu.querySelector('[data-act=mute]').textContent = t.muted ? 'Unmute tab' : 'Mute tab'; openPopup(els.tabMenu, e.clientX, e.clientY); };
    el.ondragstart = (e) => { e.dataTransfer.setData('text/tab-id', String(t.id)); e.dataTransfer.effectAllowed = 'move'; el.classList.add('dragging'); };
    el.ondragend = () => el.classList.remove('dragging');
    el.ondragover = (e) => { if (!e.dataTransfer.types.includes('text/tab-id')) return; e.preventDefault(); const before = e.offsetX < el.offsetWidth / 2; el.classList.toggle('drop-before', before); el.classList.toggle('drop-after', !before); };
    el.ondragleave = () => el.classList.remove('drop-before', 'drop-after');
    el.ondrop = (e) => {
      e.preventDefault(); el.classList.remove('drop-before', 'drop-after');
      const id = Number(e.dataTransfer.getData('text/tab-id'));
      if (!id || id === t.id) return;
      const from = state.tabs.findIndex((x) => x.id === id);
      let to = state.tabs.findIndex((x) => x.id === t.id);
      if (e.offsetX >= el.offsetWidth / 2) to++;
      if (from < to) to--;
      ui.tabs.move(id, to);
    };
    frag.appendChild(el);
  }
  els.tabs.replaceChildren(frag);
}

function renderToolbar() {
  const t = active();
  if (!t) return;
  els.back.disabled = !t.canGoBack;
  els.forward.disabled = !t.canGoForward;
  els.reload.innerHTML = t.loading ? '&#x2715;' : '&#x21bb;';
  els.reload.title = t.loading ? 'Stop (Esc)' : 'Reload (F5)';
  if (!state.addressFocused) els.address.value = displayUrl(t.url);
  els.security.className = 'sec ' + (t.secure || 'neutral');
  els.security.title = { secure: 'Connection is secure (HTTPS)', insecure: 'Not secure: this page is loaded over plain HTTP', error: 'This page could not be loaded', internal: 'Drew\'s Browser page', neutral: '' }[t.secure] || '';
  els.star.textContent = t.bookmarked ? '★' : '☆';
  els.star.classList.toggle('on', !!t.bookmarked);
  els.zoomBadge.hidden = t.zoom === 100;
  els.zoomBadge.textContent = t.zoom + '%';
  $('zoom-value').textContent = t.zoom + '%';
  els.shieldCount.hidden = !t.blocked || t.shieldOff;
  els.shieldCount.textContent = t.blocked > 99 ? '99+' : String(t.blocked);
  els.shield.classList.toggle('off', !!t.shieldOff);
  els.shield.title = t.shieldOff ? 'Tracking protection is OFF for this site' : `Tracking protection: ${t.blocked} blocked on this page`;
}

ui.onTabs((snap) => {
  state.tabs = snap.tabs; state.activeId = snap.activeId; state.isPrivate = snap.isPrivate;
  renderTabs(); renderToolbar();
  if (state.openPopup === els.shieldPanel) renderShield();
});
ui.tabs.state().then((snap) => { state.tabs = snap.tabs; state.activeId = snap.activeId; renderTabs(); renderToolbar(); });

els.newtab.onclick = () => ui.tabs.new('drew://newtab').then(() => focusAddress());
els.back.onclick = () => ui.nav.back();
els.forward.onclick = () => ui.nav.forward();
els.reload.onclick = () => { const t = active(); if (t && t.loading) ui.nav.stop(); else ui.nav.reload(false); };
els.home.onclick = () => ui.nav.home();
els.star.onclick = () => ui.bookmarks.toggle().then((r) => { if (r && r.bookmarked && state.settings.showBookmarksBar === false) { /* nothing */ } });

/* ---------- address bar + suggestions ---------- */
function focusAddress() { els.address.focus(); els.address.select(); }
els.address.onfocus = () => { state.addressFocused = true; setTimeout(() => els.address.select(), 0); };
els.address.onblur = () => { state.addressFocused = false; setTimeout(() => { if (state.openPopup === null) renderToolbar(); }, 100); };
let suggTimer = null;
els.address.oninput = () => {
  clearTimeout(suggTimer);
  const q = els.address.value;
  suggTimer = setTimeout(async () => {
    if (!q.trim()) return hideSuggestions();
    const list = await ui.suggest(q);
    const items = [{ type: 'typed', url: q, title: q }];
    for (const s of list) if (s.url !== q) items.push(s);
    state.suggestions = items; state.suggIndex = 0;
    renderSuggestions();
  }, 50);
};
function renderSuggestions() {
  if (!state.suggestions.length) return hideSuggestions();
  els.suggestions.replaceChildren(...state.suggestions.map((s, i) => {
    const d = document.createElement('div');
    d.className = 'sugg' + (i === state.suggIndex ? ' selected' : '');
    const k = document.createElement('span'); k.className = 'k'; k.textContent = s.type === 'bookmark' ? '★' : s.type === 'history' ? '⟲' : '🔍';
    const t = document.createElement('span'); t.className = 't'; t.textContent = s.type === 'typed' ? s.url : (s.title || s.url);
    d.append(k, t);
    if (s.type !== 'typed') { const u = document.createElement('span'); u.className = 'u'; u.textContent = s.url; d.appendChild(u); }
    d.onmousedown = (e) => { e.preventDefault(); go(s.url); };
    return d;
  }));
  els.suggestions.hidden = false;
  setOverlay(true, 'suggestions');
}
function hideSuggestions() { els.suggestions.hidden = true; state.suggestions = []; state.suggIndex = -1; if (state.openPopup === 'suggestions') setOverlay(false); }
function go(input) { hideSuggestions(); els.address.blur(); ui.nav.go(input); ui.focusPage(); }
els.address.onkeydown = (e) => {
  if (e.key === 'Enter') { e.preventDefault(); const s = state.suggestions[state.suggIndex]; go(s && s.type !== 'typed' ? s.url : els.address.value); }
  else if (e.key === 'Escape') { e.preventDefault(); hideSuggestions(); state.addressFocused = false; renderToolbar(); els.address.blur(); ui.focusPage(); }
  else if (e.key === 'ArrowDown' && state.suggestions.length) { e.preventDefault(); state.suggIndex = (state.suggIndex + 1) % state.suggestions.length; renderSuggestions(); }
  else if (e.key === 'ArrowUp' && state.suggestions.length) { e.preventDefault(); state.suggIndex = (state.suggIndex - 1 + state.suggestions.length) % state.suggestions.length; renderSuggestions(); }
};
ui.onFocusAddress(() => focusAddress());

/* ---------- popups ---------- */
function setOverlay(open, which) {
  state.openPopup = open ? (which || state.openPopup) : null;
  els.backdrop.hidden = !open;
  ui.setOverlay(open);
}
function openPopup(el, x, y) {
  closePopups();
  el.hidden = false;
  const w = el.offsetWidth, h = el.offsetHeight;
  el.style.left = Math.max(4, Math.min(x, window.innerWidth - w - 4)) + 'px';
  el.style.top = Math.max(4, Math.min(y, window.innerHeight - h - 4)) + 'px';
  setOverlay(true, el);
}
function anchorPopup(el, button) {
  const r = button.getBoundingClientRect();
  closePopups();
  el.hidden = false;
  el.style.left = Math.max(4, Math.min(r.right - el.offsetWidth, window.innerWidth - el.offsetWidth - 4)) + 'px';
  el.style.top = (r.bottom + 4) + 'px';
  setOverlay(true, el);
}
function closePopups() {
  for (const el of [els.menu, els.shieldPanel, els.downloadsPanel, els.tabMenu, els.bmMenu, els.bmDialog]) el.hidden = true;
  if (!els.suggestions.hidden) hideSuggestions();
  setOverlay(false);
}
els.backdrop.onmousedown = () => { closePopups(); ui.focusPage(); };
ui.onClosePopups(() => { if (state.openPopup) closePopups(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && state.openPopup && document.activeElement !== els.address && document.activeElement !== els.findInput) { closePopups(); ui.focusPage(); } });

/* main menu */
els.menuBtn.onclick = () => anchorPopup(els.menu, els.menuBtn);
els.menu.onclick = (e) => {
  const act = e.target.closest('[data-act]')?.dataset.act;
  if (!act) return;
  const keepOpen = act.startsWith('zoom');
  if (!keepOpen) closePopups();
  switch (act) {
    case 'newtab': ui.tabs.new('drew://newtab').then(focusAddress); break;
    case 'newwindow': ui.window.new(false); break;
    case 'private': ui.window.new(true); break;
    case 'bookmarks': ui.tabs.new('drew://bookmarks'); break;
    case 'history': ui.tabs.new('drew://history'); break;
    case 'downloads': ui.tabs.new('drew://downloads'); break;
    case 'zoomin': ui.zoom(1); break;
    case 'zoomout': ui.zoom(-1); break;
    case 'zoomreset': ui.zoom(0); break;
    case 'find': openFind(); break;
    case 'print': ui.print(); break;
    case 'bookmarksbar': toggleBookmarksBar(); break;
    case 'fullscreen': ui.window.fullscreen(); break;
    case 'settings': ui.tabs.new('drew://settings'); break;
    case 'devtools': ui.devtools(); break;
    case 'about': ui.tabs.new('drew://about'); break;
    case 'quit': ui.quit(); break;
  }
};

/* tab context menu */
els.tabMenu.onclick = (e) => {
  const act = e.target.closest('[data-act]')?.dataset.act; if (!act) return;
  const id = state.menuTabId; closePopups();
  const idx = state.tabs.findIndex((t) => t.id === id);
  switch (act) {
    case 'newright': ui.tabs.new('drew://newtab', { index: idx + 1 }).then(focusAddress); break;
    case 'reload': if (id === state.activeId) ui.nav.reload(false); else ui.tabs.activate(id).then(() => ui.nav.reload(false)); break;
    case 'duplicate': ui.tabs.duplicate(id); break;
    case 'mute': ui.tabs.mute(id); break;
    case 'close': ui.tabs.close(id); break;
    case 'closeothers': ui.tabs.closeOthers(id); break;
    case 'closeright': ui.tabs.closeRight(id); break;
    case 'reopen': ui.tabs.reopen(); break;
  }
};

/* shield */
async function renderShield() {
  const t = active(); if (!t) return;
  const info = await ui.shield.info();
  $('shield-site').textContent = hostOf(t.url) || t.url;
  $('shield-summary').textContent = info.off ? 'Protection is turned off for this site.' : `${info.count} tracker request${info.count === 1 ? '' : 's'} blocked on this page.`;
  $('shield-hosts').replaceChildren(...(info.hosts || []).slice(0, 40).map((h) => { const li = document.createElement('li'); li.textContent = h; return li; }));
  $('shield-toggle').textContent = info.off ? 'Turn protection ON for this site' : 'Turn protection OFF for this site';
  $('shield-toggle').disabled = !/^https?:/.test(t.url);
  const st = info.status || {};
  $('shield-stats').textContent = `Blocklist: ${(st.builtinCount || 0) + (st.remoteCount || 0)} domains` + (st.remoteUpdated ? ` (remote list updated ${new Date(st.remoteUpdated).toLocaleDateString()})` : '');
}
els.shield.onclick = () => { anchorPopup(els.shieldPanel, els.shield); renderShield(); };
$('shield-toggle').onclick = () => { closePopups(); ui.shield.toggle(); };

/* downloads */
function fmtBytes(n) { if (!n && n !== 0) return ''; const u = ['B', 'KB', 'MB', 'GB']; let i = 0; while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; } return (i ? n.toFixed(1) : n) + ' ' + u[i]; }
function renderDownloads() {
  const list = state.downloads.slice(0, 8);
  if (!list.length) { $('downloads-list').innerHTML = '<div class="empty">No downloads yet</div>'; return; }
  $('downloads-list').replaceChildren(...list.map((d) => {
    const el = document.createElement('div'); el.className = 'dl';
    const name = document.createElement('div'); name.className = 'name'; name.textContent = d.filename; name.title = d.path || d.url;
    const meta = document.createElement('div'); meta.className = 'meta';
    meta.textContent = d.state === 'progressing' ? (d.paused ? 'Paused · ' : '') + `${fmtBytes(d.received)}${d.total ? ' / ' + fmtBytes(d.total) : ''}` : d.state === 'completed' ? fmtBytes(d.total || d.received) + ' · Done' : d.state === 'cancelled' ? 'Cancelled' : 'Failed';
    const acts = document.createElement('div'); acts.className = 'acts';
    const btn = (txt, title, fn) => { const b = document.createElement('button'); b.className = 'icon-btn'; b.textContent = txt; b.title = title; b.onclick = fn; return b; };
    if (d.state === 'progressing') {
      acts.appendChild(d.paused ? btn('▶', 'Resume', () => ui.downloads.resume(d.id)) : btn('⏸', 'Pause', () => ui.downloads.pause(d.id)));
      acts.appendChild(btn('✕', 'Cancel', () => ui.downloads.cancel(d.id)));
    } else {
      if (d.state === 'completed') acts.appendChild(btn('📂', 'Show in folder', () => ui.downloads.show(d.id)));
      acts.appendChild(btn('✕', 'Remove from list', () => ui.downloads.remove(d.id)));
    }
    el.append(name, meta, acts);
    if (d.state === 'progressing' && d.total) { const p = document.createElement('progress'); p.max = d.total; p.value = d.received; el.appendChild(p); }
    if (d.state === 'completed') name.onclick = () => ui.downloads.open(d.id);
    return el;
  }));
}
ui.onDownloads((list) => { state.downloads = list; if (state.openPopup === els.downloadsPanel) renderDownloads(); if (list.some((d) => d.state === 'progressing')) els.downloadsBtn.classList.add('busy'); else els.downloadsBtn.classList.remove('busy'); });
ui.downloads.list().then((l) => { state.downloads = l; });
els.downloadsBtn.onclick = () => { anchorPopup(els.downloadsPanel, els.downloadsBtn); renderDownloads(); };
els.downloadsPanel.querySelector('.panel-actions').onclick = (e) => {
  const act = e.target.dataset.act; if (!act) return; closePopups();
  if (act === 'folder') ui.downloads.openFolder(); else ui.tabs.new('drew://downloads');
};

/* ---------- bookmarks bar ---------- */
function renderBookmarks() {
  const bar = state.bookmarks.filter((b) => !b.folder);
  const folders = [...new Set(state.bookmarks.filter((b) => b.folder).map((b) => b.folder))];
  els.bookmarksEmpty.hidden = state.bookmarks.length > 0;
  const mk = (b) => {
    const el = document.createElement('button'); el.className = 'bm'; el.title = b.title + '\n' + b.url;
    el.appendChild(letterIcon(b.url)); const t = document.createElement('span'); t.className = 't'; t.textContent = b.title || hostOf(b.url); el.appendChild(t);
    el.onclick = () => ui.nav.go(b.url);
    el.onauxclick = (e) => { if (e.button === 1) ui.tabs.new(b.url, { active: false }); };
    el.oncontextmenu = (e) => { e.preventDefault(); state.menuBookmark = b; openPopup(els.bmMenu, e.clientX, e.clientY); };
    return el;
  };
  const items = bar.map(mk);
  for (const f of folders) {
    const el = document.createElement('button'); el.className = 'bm folder'; const ic = document.createElement('span'); ic.className = 'fav'; ic.textContent = '📁'; el.appendChild(ic);
    const t = document.createElement('span'); t.className = 't'; t.textContent = f; el.appendChild(t);
    el.onclick = (e) => {
      const menu = document.createElement('div'); menu.className = 'popup'; menu.id = 'folder-menu';
      for (const b of state.bookmarks.filter((x) => x.folder === f)) {
        const it = document.createElement('button'); it.textContent = b.title || b.url; it.title = b.url;
        it.onclick = () => { closePopups(); ui.nav.go(b.url); };
        it.oncontextmenu = (ev) => { ev.preventDefault(); state.menuBookmark = b; openPopup(els.bmMenu, ev.clientX, ev.clientY); };
        menu.appendChild(it);
      }
      document.body.appendChild(menu);
      const r = el.getBoundingClientRect(); closePopups(); menu.hidden = false; menu.style.left = r.left + 'px'; menu.style.top = r.bottom + 'px'; setOverlay(true, menu);
    };
    items.push(el);
  }
  els.bookmarksList.replaceChildren(...items);
}
const origClose = closePopups;
closePopups = function () { document.querySelectorAll('#folder-menu').forEach((m) => m.remove()); origClose(); };
els.bmMenu.onclick = (e) => {
  const act = e.target.closest('[data-act]')?.dataset.act; if (!act) return;
  const b = state.menuBookmark; closePopups(); if (!b) return;
  if (act === 'open') ui.nav.go(b.url);
  else if (act === 'opennew') ui.tabs.new(b.url);
  else if (act === 'delete') ui.bookmarks.remove(b.id);
  else if (act === 'edit') { $('bm-title').value = b.title; $('bm-url').value = b.url; $('bm-folder').value = b.folder || ''; els.bmDialog.hidden = false; els.bmDialog.style.left = '50%'; els.bmDialog.style.transform = 'translateX(-50%)'; els.bmDialog.style.top = '90px'; setOverlay(true, els.bmDialog); $('bm-title').focus(); }
};
els.bmDialog.onclick = (e) => {
  const act = e.target.dataset.act; if (!act) return;
  const b = state.menuBookmark;
  if (act === 'save' && b) ui.bookmarks.update(b.id, { title: $('bm-title').value.trim() || b.title, url: $('bm-url').value.trim() || b.url, folder: $('bm-folder').value.trim() });
  closePopups(); ui.focusPage();
};
els.bmDialog.onkeydown = (e) => { if (e.key === 'Enter') els.bmDialog.querySelector('[data-act=save]').click(); };
ui.onBookmarks((list) => { state.bookmarks = list; renderBookmarks(); renderToolbar(); });
ui.bookmarks.list().then((l) => { state.bookmarks = l; renderBookmarks(); });
ui.onBookmarkToggled(() => {});
function toggleBookmarksBar() { const show = els.bookmarksBar.hidden; els.bookmarksBar.hidden = !show; ui.settings.set({ showBookmarksBar: show }); }
ui.onToggleBookmarksBar(() => toggleBookmarksBar());
ui.settings.get().then((s) => { state.settings = s; els.bookmarksBar.hidden = !s.showBookmarksBar; });
ui.onSettings((s) => { state.settings = s; els.bookmarksBar.hidden = !s.showBookmarksBar; });

/* ---------- find bar ---------- */
function openFind() { els.findbar.hidden = false; els.findInput.focus(); els.findInput.select(); if (els.findInput.value) ui.find(els.findInput.value, { forward: true }); }
function closeFind() { els.findbar.hidden = true; els.findCount.textContent = ''; ui.stopFind(); }
ui.onOpenFind(openFind);
els.findInput.oninput = () => { const v = els.findInput.value; if (v) ui.find(v, { forward: true }); else { els.findCount.textContent = ''; ui.find(''); } };
els.findInput.onkeydown = (e) => {
  if (e.key === 'Enter') { e.preventDefault(); ui.find(els.findInput.value, { forward: !e.shiftKey }); }
  else if (e.key === 'Escape') { e.preventDefault(); closeFind(); }
};
$('find-next').onclick = () => ui.find(els.findInput.value, { forward: true });
$('find-prev').onclick = () => ui.find(els.findInput.value, { forward: false });
$('find-close').onclick = closeFind;
ui.onFindResult(({ active: a, total }) => { els.findCount.textContent = total ? `${a}/${total}` : (els.findInput.value ? '0/0' : ''); });

/* ---------- chrome height sync ---------- */
new ResizeObserver(() => ui.setChromeHeight(els.chrome.offsetHeight)).observe(els.chrome);
ui.setChromeHeight(els.chrome.offsetHeight);

/* Keyboard shortcuts that originate inside the toolbar itself are handled by
   the main process through before-input-event; nothing else to do here. */
