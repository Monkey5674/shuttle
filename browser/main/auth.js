'use strict';
// HTTP authentication (proxy logins and sites protected with basic auth).
// Windows integrated auth (NTLM / Kerberos) is handled by Chromium itself
// thanks to the auth-server-whitelist switch set in main.js; everything else
// gets a small login window.
const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');

const remembered = new Map();   // key -> { username, password } for this run
const pending = new Map();      // id -> { callback, win }
let nextId = 1;

function keyFor(info) { return `${info.isProxy ? 'proxy' : 'site'}|${info.host}:${info.port}|${info.realm || ''}`; }

function install() {
  app.on('login', (event, webContents, details, authInfo, callback) => {
    event.preventDefault();
    const key = keyFor(authInfo);
    const saved = remembered.get(key);
    if (saved && !pending.has(key)) {
      // Use once; if the server asks again right away the password was wrong.
      remembered.delete(key);
      return callback(saved.username, saved.password);
    }
    prompt(webContents, authInfo, (username, password) => {
      if (username !== undefined) remembered.set(key, { username, password });
      callback(username, password);
    });
  });

  ipcMain.handle('auth:submit', (event, id, username, password) => {
    const p = pending.get(id);
    if (!p || p.win.webContents !== event.sender) return;
    pending.delete(id);
    p.callback(String(username || ''), String(password || ''));
    if (!p.win.isDestroyed()) p.win.close();
  });
  ipcMain.handle('auth:cancel', (event, id) => {
    const p = pending.get(id);
    if (!p || p.win.webContents !== event.sender) return;
    pending.delete(id);
    p.callback();
    if (!p.win.isDestroyed()) p.win.close();
  });
}

function prompt(webContents, authInfo, callback) {
  const windows = require('./windows');
  const ctx = webContents ? windows.fromWebContents(webContents) : null;
  const parent = ctx ? ctx.win.win : undefined;
  const id = String(nextId++);
  const win = new BrowserWindow({
    width: 420, height: 300, resizable: false, minimizable: false, maximizable: false,
    parent, modal: !!parent, show: false, autoHideMenuBar: true,
    title: authInfo.isProxy ? 'Proxy sign in' : 'Sign in',
    webPreferences: { preload: path.join(__dirname, '..', 'preload', 'page-preload.js'), contextIsolation: true, sandbox: true, nodeIntegration: false }
  });
  pending.set(id, { callback, win });
  const q = new URLSearchParams({ id, host: `${authInfo.host}:${authInfo.port}`, realm: authInfo.realm || '', proxy: authInfo.isProxy ? '1' : '0', scheme: authInfo.scheme || '' });
  win.loadURL('drew://auth/?' + q.toString());
  win.once('ready-to-show', () => win.show());
  win.on('closed', () => {
    const p = pending.get(id);
    if (p) { pending.delete(id); p.callback(); }
  });
}

module.exports = { install };
