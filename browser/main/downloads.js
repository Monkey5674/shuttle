'use strict';
// Download handling: saves to the user's Downloads folder (or asks), tracks
// progress for the UI and keeps a persistent list.
const path = require('path');
const fs = require('fs');
const { app, shell } = require('electron');
const store = require('./store');

const active = new Map(); // id -> DownloadItem
let counter = 0;

function uniquePath(dir, filename) {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  let candidate = path.join(dir, filename);
  let i = 1;
  while (fs.existsSync(candidate)) candidate = path.join(dir, `${base} (${i++})${ext}`);
  return candidate;
}

function broadcast() {
  const windows = require('./windows');
  const list = store.downloads.all();
  for (const w of windows.all()) {
    if (w.win.isDestroyed()) continue;
    w.ui.webContents.send('downloads:update', list);
    for (const t of w.tabs) if (t.url.startsWith('drew://downloads')) t.view.webContents.send('downloads:update', list);
  }
}

function serialize(id, item, extra = {}) {
  return {
    id,
    filename: path.basename(item.getSavePath() || item.getFilename()),
    path: item.getSavePath(),
    url: item.getURL(),
    total: item.getTotalBytes(),
    received: item.getReceivedBytes(),
    state: item.getState(),       // progressing | completed | cancelled | interrupted
    paused: item.isPaused(),
    startTime: Math.round(item.getStartTime() * 1000),
    ...extra
  };
}

function attach(session) {
  session.on('will-download', (event, item) => {
    const id = `${Date.now()}-${counter++}`;
    const settings = store.settings.get();
    if (!settings.askWhereToSave) {
      const dir = app.getPath('downloads');
      try { fs.mkdirSync(dir, { recursive: true }); } catch {}
      item.setSavePath(uniquePath(dir, item.getFilename()));
    }
    active.set(id, item);
    store.downloads.upsert(serialize(id, item));
    broadcast();
    item.on('updated', () => { store.downloads.upsert(serialize(id, item)); broadcast(); });
    item.once('done', (e, state) => {
      store.downloads.upsert(serialize(id, item, { state, received: state === 'completed' ? item.getTotalBytes() || item.getReceivedBytes() : item.getReceivedBytes() }));
      active.delete(id);
      broadcast();
    });
  });
}

const api = {
  list: () => store.downloads.all(),
  pause(id) { const i = active.get(id); if (i && !i.isPaused()) i.pause(); },
  resume(id) { const i = active.get(id); if (i && i.canResume()) i.resume(); },
  cancel(id) { const i = active.get(id); if (i) i.cancel(); },
  remove(id) { api.cancel(id); store.downloads.remove(id); broadcast(); },
  clear() { for (const i of active.values()) i.cancel(); store.downloads.clear(); broadcast(); },
  open(id) {
    const d = store.downloads.all().find((x) => x.id === id);
    if (d && d.state === 'completed' && d.path && fs.existsSync(d.path)) return shell.openPath(d.path);
  },
  showInFolder(id) {
    const d = store.downloads.all().find((x) => x.id === id);
    if (d && d.path && fs.existsSync(d.path)) shell.showItemInFolder(d.path);
    else shell.openPath(app.getPath('downloads'));
  }
};

module.exports = { attach, api, broadcast };
