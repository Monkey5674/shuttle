'use strict';
// In-app self test, run when DREW_SMOKE=1 (see test/smoke.js). Exercises
// the real window, tabs, internal pages, tracking protection, bookmarks,
// history and downloads against a throwaway local HTTP server, then quits.
const http = require('http');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

const results = [];
const check = (name, ok, info) => { results.push({ name, ok: !!ok, info }); console.log((ok ? 'PASS ' : 'FAIL ') + name + (info ? '  — ' + info : '')); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitFor(fn, ms = 8000, step = 100) { const t0 = Date.now(); while (Date.now() - t0 < ms) { const v = await fn(); if (v) return v; await sleep(step); } return null; }

async function run() {
  const store = require('./store');
  const windows = require('./windows');
  const privacy = require('./privacy');
  const consoleErrors = [];
  app.on('web-contents-created', (e, wc) => {
    wc.on('console-message', (ev) => { if (ev.level === 'error') consoleErrors.push(`${wc.getURL()}: ${ev.message}`); });
  });

  // ---- local server: records headers, serves a page that pulls trackers ----
  const seen = [];
  const server = http.createServer((req, res) => {
    seen.push({ url: req.url, headers: req.headers });
    if (req.url.startsWith('/file.bin')) { res.writeHead(200, { 'Content-Type': 'application/octet-stream', 'Content-Disposition': 'attachment; filename="file.bin"' }); return res.end(Buffer.alloc(5000, 1)); }
    if (req.url.startsWith('/ga.js') || req.url.startsWith('/ok.js')) { res.writeHead(200, { 'Content-Type': 'text/javascript' }); return res.end('window.__loaded = (window.__loaded||[]).concat(["' + req.url + '"]);'); }
    res.writeHead(200, { 'Content-Type': 'text/html', 'Set-Cookie': 'a=1' });
    res.end(`<!doctype html><title>Smoke page</title><h1>hello</h1><p>findme findme</p>
      <script src="/ok.js"></script><script src="/ga.js"></script>
      <script src="https://www.google-analytics.com/analytics.js"></script>
      <img src="https://px.ads.linkedin.com/collect?x=1">
      <a id="l" href="/second?utm_source=abc&keep=1">link</a>`);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;

  const win = windows.all()[0] || new windows.BrowserWin({});
  await waitFor(() => !win.ui.webContents.isLoading() && win.ui.webContents.getURL());
  check('chrome UI loaded', win.ui.webContents.getURL().includes('ui/index.html'));

  // ---- internal pages ----
  for (const page of ['newtab', 'bookmarks', 'history', 'downloads', 'settings', 'about']) {
    const tab = win.newTab('drew://' + page, { active: true });
    const ok = await waitFor(() => !tab.loading && tab.title && tab.title !== 'New Tab' || (page === 'newtab' && !tab.loading && tab.url.startsWith('drew://newtab')), 8000);
    check('internal page drew://' + page, !!ok && !tab.error, tab.title);
  }

  // ---- web page with trackers ----
  const t = win.newTab(base + '/?utm_source=test&utm_campaign=x&real=1', { active: true });
  await waitFor(() => !t.loading && t.title === 'Smoke page', 10000);
  await sleep(500);
  check('page loaded', t.title === 'Smoke page', t.url);
  check('tracking params stripped from address', t.url === base + '/?real=1', t.url);
  const wc = t.view.webContents;
  const loaded = await wc.executeJavaScript('window.__loaded || []');
  check('first-party script allowed', loaded.includes('/ok.js'), JSON.stringify(loaded));
  check('tracker pattern (/ga.js) blocked', !loaded.includes('/ga.js'), JSON.stringify(loaded));
  const blocked = privacy.getCount(wc.id);
  check('tracker domains blocked (google-analytics, linkedin)', blocked.count >= 3, JSON.stringify(blocked));
  const main = seen.find((r) => r.url.startsWith('/?real'));
  check('DNT + Sec-GPC headers sent', main && main.headers.dnt === '1' && main.headers['sec-gpc'] === '1', JSON.stringify(main && { dnt: main.headers.dnt, gpc: main.headers['sec-gpc'] }));
  check('User-Agent hides Electron', main && !/Electron/i.test(main.headers['user-agent']), main && main.headers['user-agent']);
  check('snapshot shows blocked count + secure state', win.snapshot().tabs.find((x) => x.id === t.id).blocked >= 3 && win.snapshot().tabs.find((x) => x.id === t.id).secure === 'insecure');

  // ---- find in page ----
  const found = await new Promise((resolve) => { const to = setTimeout(() => resolve(null), 5000); const h = (e, r) => { if (r.finalUpdate && r.matches) { clearTimeout(to); wc.off('found-in-page', h); resolve(r); } }; wc.on('found-in-page', h); win.find('findme', { forward: true, findNext: false }); });
  check('find in page', found && found.matches === 2 && found.activeMatchOrdinal === 1, JSON.stringify(found));
  const next = await new Promise((resolve) => { const to = setTimeout(() => resolve(null), 5000); wc.once('found-in-page', (e, r) => { clearTimeout(to); resolve(r); }); win.find('findme', { forward: true }); });
  check('find next match', next && next.activeMatchOrdinal === 2, JSON.stringify(next));
  win.stopFind();

  // ---- history + bookmarks ----
  check('history recorded', store.history.all().some((h) => h.url === base + '/?real=1'));
  const bm = win.toggleBookmark();
  check('bookmark added via toggle', bm && bm.bookmarked && store.bookmarks.find(base + '/?real=1'));
  check('suggest finds bookmark', store.history.suggest('127.0.0.1').some((s) => s.type === 'bookmark'));
  check('bookmark removed via toggle', win.toggleBookmark().bookmarked === false && !store.bookmarks.find(base + '/?real=1'));
  const io = require('./bookmarks-io');
  const html = io.exportBookmarksHtml([{ url: 'https://a.example/', title: 'A & B', folder: '' }, { url: 'https://c.example/', title: 'C', folder: 'Work' }]);
  const back = io.importBookmarksHtml(html);
  check('bookmark export/import roundtrip', back.length === 2 && back[0].title === 'A & B' && back[1].folder === 'Work', JSON.stringify(back));

  // ---- navigation: link click, back/forward, error page ----
  await wc.executeJavaScript('document.getElementById("l").click()', true);
  await waitFor(() => t.url.startsWith(base + '/second'), 8000);
  check('in-page link navigation + param strip', t.url === base + '/second?keep=1', t.url);
  win.goBack();
  await waitFor(() => t.url === base + '/?real=1', 8000);
  check('back navigation', t.url === base + '/?real=1', t.url);
  check('canGoForward tracked', t.canGoForward === true);

  const bad = win.newTab('http://no-such-host.invalid/', { active: true });
  await waitFor(() => bad.error && bad.view.webContents.getURL().startsWith('drew://error') && !bad.view.webContents.isLoading(), 15000);
  check('error page for unreachable host', bad.error && bad.view.webContents.getURL().startsWith('drew://error'), JSON.stringify(bad.error));
  check('address bar keeps original url on error', bad.url === 'http://no-such-host.invalid/', bad.url);

  // ---- tab management ----
  const n = win.tabs.length;
  win.moveTab(bad.id, 0);
  check('move tab', win.tabs[0] === bad);
  win.closeTab(bad.id);
  check('close tab', win.tabs.length === n - 1 && !win.tabs.includes(bad));
  win.reopenClosedTab();
  await sleep(300);
  check('reopen closed tab', win.tabs.length === n && win.tabs.some((x) => x.url === 'http://no-such-host.invalid/'));
  win.activate(t.id);
  win.nextTab(1); check('next tab', win.activeId !== t.id);
  win.nextTab(-1); check('previous tab', win.activeId === t.id);
  const uiTabs = await waitFor(async () => { const c = await win.ui.webContents.executeJavaScript('document.querySelectorAll(".tab").length'); return c === win.tabs.length ? c : null; }, 5000);
  check('UI renders one element per tab', uiTabs === win.tabs.length, `${uiTabs} vs ${win.tabs.length}`);
  const addr = await win.ui.webContents.executeJavaScript('document.getElementById("address").value');
  check('UI address bar shows active url', addr === t.url, addr);
  win.zoom(t.id, 1); check('zoom in', t.zoom === 110 && Math.abs(wc.getZoomFactor() - 1.1) < 0.01);
  win.zoom(t.id, 0); check('zoom reset', t.zoom === 100);

  // ---- downloads ----
  wc.downloadURL(base + '/file.bin');
  const done = await waitFor(() => store.downloads.all().find((d) => d.state === 'completed' && d.filename.startsWith('file')), 10000);
  check('download completed', !!done && fs.existsSync(done.path) && fs.statSync(done.path).size === 5000, done && done.path);
  if (done) try { fs.unlinkSync(done.path); } catch {}

  // ---- settings + shield allowlist ----
  store.settings.set({ blockTrackers: false });
  const t2 = win.newTab(base + '/?second=1', { active: true });
  await waitFor(() => !t2.loading && t2.title === 'Smoke page', 10000);
  await sleep(300);
  const loaded2 = await t2.view.webContents.executeJavaScript('window.__loaded || []');
  check('blocking can be disabled in settings', loaded2.includes('/ga.js'), JSON.stringify(loaded2));
  store.settings.set({ blockTrackers: true });
  privacy.setShieldEnabledFor(base + '/', false);
  check('per-site allowlist', privacy.isShieldDisabledFor(base + '/x'));
  privacy.setShieldEnabledFor(base + '/', true);
  check('privacy helpers', privacy.isTrackerHost('cdn.segment.com') && !privacy.isTrackerHost('example.com') && privacy.baseDomain('a.b.co.uk') === 'b.co.uk');

  // ---- private window ----
  const pw = new windows.BrowserWin({ isPrivate: true, tabs: [{ url: base + '/?private=1' }] });
  await waitFor(() => pw.tabs[0] && !pw.tabs[0].loading && pw.tabs[0].title === 'Smoke page', 10000);
  check('private window loads', pw.tabs[0].title === 'Smoke page');
  check('private window does not record history', !store.history.all().some((h) => h.url.includes('private=1')));
  pw.win.close();

  // ---- session persistence ----
  win.persistSession();
  const sess = store.session.get();
  check('session persisted', sess.windows[0] && sess.windows[0].tabs.length === win.tabs.length);

  const urlsMod = require('./urls');
  check('address input: host → url', urlsMod.fromUserInput('example.com/x') === 'http://example.com/x');
  check('address input: words → search', urlsMod.fromUserInput('how to bake bread').startsWith('https://duckduckgo.com/?q=how%20to'));
  check('address input: localhost:3000', urlsMod.fromUserInput('localhost:3000') === 'http://localhost:3000');
  check('address input: internal page', urlsMod.fromUserInput('drew://settings') === 'drew://settings');
  check('address input: unknown drew page → search', urlsMod.fromUserInput('drew://nope').includes('duckduckgo'));

  check('no renderer console errors', consoleErrors.length === 0, consoleErrors.slice(0, 5).join(' | '));

  server.close();
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  fs.writeFileSync(path.join(app.getPath('userData'), 'smoke-results.json'), JSON.stringify(results, null, 1));
  app.exit(failed.length ? 1 : 0);
}

module.exports = { run };
