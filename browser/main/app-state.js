'use strict';
// Window lifecycle glue: session restore on start, quit when the last normal
// window closes, optional data clearing on exit.
const { app, session } = require('electron');
const store = require('./store');

let quitting = false;

function restoreOrOpen() {
  const { BrowserWin } = require('./windows');
  const settings = store.settings.get();
  const saved = store.session.get();
  const entry = settings.restoreSession && saved.windows && saved.windows[0];
  if (entry && entry.tabs && entry.tabs.length) {
    const { maximized, ...bounds } = entry.bounds || {};
    const w = new BrowserWin({ bounds: bounds.width ? bounds : undefined, tabs: entry.tabs, activeIndex: entry.activeIndex || 0 });
    if (maximized) w.win.maximize();
    return w;
  }
  return new BrowserWin({});
}

function onWindowClosed() {
  const windows = require('./windows');
  if (windows.all().length === 0 && process.platform !== 'darwin') app.quit();
}

async function clearBrowsingData({ history = true, cookies = true, cache = true, downloads = false, permissions = false } = {}) {
  if (history) store.history.clear();
  if (downloads) store.downloads.clear();
  if (permissions) store.permissions.clear();
  const s = session.defaultSession;
  if (cache) await s.clearCache();
  if (cookies) {
    await s.clearStorageData({ storages: ['cookies', 'localstorage', 'indexdb', 'serviceworkers', 'cachestorage', 'websql', 'shadercache', 'filesystem'] });
  }
  await s.clearAuthCache();
  await s.clearHostResolverCache();
}

function install() {
  app.on('before-quit', () => { quitting = true; });
  app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
  app.on('will-quit', (e) => {
    store.flushAll();
    if (store.settings.get().clearOnExit && !app._clearedOnExit) {
      e.preventDefault();
      app._clearedOnExit = true;
      clearBrowsingData({ history: true, cookies: true, cache: true }).finally(() => app.quit());
    }
  });
}

module.exports = { restoreOrOpen, onWindowClosed, clearBrowsingData, install, isQuitting: () => quitting };
