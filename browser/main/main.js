'use strict';
// Drew's Browser – entry point.
const { app, session, nativeTheme, Menu, dialog } = require('electron');
const path = require('path');
const store = require('./store');
const privacy = require('./privacy');
const protocolMod = require('./protocol');
const urls = require('./urls');

// Single instance: a second launch focuses the existing window instead.
if (!app.requestSingleInstanceLock()) { app.quit(); process.exit(0); }

app.setName('Drew\'s Browser');
if (process.env.DREW_USER_DATA) app.setPath('userData', process.env.DREW_USER_DATA);
app.setAppUserModelId('com.drew.browser');
protocolMod.registerPrivileged();

// Chromium hardening / quality-of-life switches.
app.commandLine.appendSwitch('enable-features', 'PartitionedCookies,ThirdPartyStoragePartitioning');
app.commandLine.appendSwitch('disable-features', 'InterestCohort,Topics,PrivacySandboxAdsAPIs,BrowsingTopics,AttributionReporting');

app.on('second-instance', (e, argv) => {
  const windows = require('./windows');
  const w = windows.focused() || windows.all()[0];
  const url = argv.slice(1).find((a) => /^(https?:|drew:|file:)/i.test(a) || urls.fromUserInput(a) !== store.settings.searchUrl(a));
  if (w) {
    if (w.win.isMinimized()) w.win.restore();
    w.win.focus();
    if (url) w.newTab(urls.fromUserInput(url), { active: true });
  } else {
    new (require('./windows').BrowserWin)({ tabs: url ? [{ url: urls.fromUserInput(url) }] : undefined });
  }
});

// Default-deny for every web content we did not create ourselves, and global
// navigation policy for the ones we did.
app.on('web-contents-created', (e, contents) => {
  contents.on('will-attach-webview', (ev) => ev.preventDefault());
  contents.on('will-navigate', (ev, url) => {
    if (!urls.isAllowedNavigation(url)) {
      ev.preventDefault();
      const windows = require('./windows');
      const ctx = windows.fromWebContents(contents);
      if (ctx && ctx.tab) urls.maybeOpenExternal(url, ctx.win.win);
    }
  });
  if (contents.getType() !== 'window' && contents.getType() !== 'browserView' && contents.getType() !== 'webview') return;
});

// Certificate errors are never bypassable; the tab shows an error page instead.
app.on('certificate-error', (event, wc, url, error, cert, callback) => {
  callback(false);
});

app.on('render-process-gone', (e, wc, details) => {
  console.error('renderer gone:', details.reason, wc && wc.getURL());
});

app.on('child-process-gone', (e, details) => {
  if (details.type === 'GPU' && details.reason !== 'clean-exit') console.error('GPU process gone:', details.reason);
});

app.whenReady().then(async () => {
  store.init();
  privacy.loadPersisted();
  protocolMod.handle();
  Menu.setApplicationMenu(null);

  require('./sessions').configure(session.defaultSession, { isPrivate: false });
  require('./ipc').register();
  const appState = require('./app-state');
  appState.install();

  nativeTheme.themeSource = store.settings.get().theme || 'system';

  const windows = require('./windows');
  const argUrl = process.argv.slice(1).find((a) => /^(https?:|drew:|file:)/i.test(a));
  if (argUrl) new windows.BrowserWin({ tabs: [{ url: argUrl }] });
  else appState.restoreOrOpen();

  // Refresh the remote blocklist in the background (no-op when disabled or fresh).
  setTimeout(() => privacy.updateRemoteList(false), 3000);

  app.on('activate', () => { if (windows.all().length === 0) appState.restoreOrOpen(); });

  if (process.env.DREW_SMOKE) require('./smoke').run().catch((err) => { console.error('smoke test crashed:', err); app.exit(2); });
});

process.on('uncaughtException', (err) => {
  console.error('uncaught:', err);
  if (app.isReady()) dialog.showErrorBox('Drew\'s Browser error', String(err && err.stack || err));
});
