'use strict';
// Tiny JSON persistence layer. Each collection lives in its own file inside
// Electron's userData directory and is written lazily (debounced) to disk.
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const DEFAULT_SETTINGS = {
  searchEngine: 'duckduckgo',
  customSearchUrl: '',
  homepage: 'drew://newtab',
  restoreSession: true,
  showBookmarksBar: true,
  blockTrackers: true,
  blockThirdPartyCookies: true,
  stripTrackingParams: true,
  httpsUpgrade: true,
  sendDoNotTrack: true,
  remoteBlocklist: true,
  remoteBlocklistUrl: 'https://pgl.yoyo.org/adservers/serverlist.php?hostformat=hosts&showintro=0&mimetype=plaintext',
  askWhereToSave: false,
  clearOnExit: false,
  theme: 'system'
};

const SEARCH_ENGINES = {
  duckduckgo: { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=%s' },
  brave: { name: 'Brave Search', url: 'https://search.brave.com/search?q=%s' },
  startpage: { name: 'Startpage', url: 'https://www.startpage.com/do/search?q=%s' },
  google: { name: 'Google', url: 'https://www.google.com/search?q=%s' },
  bing: { name: 'Bing', url: 'https://www.bing.com/search?q=%s' },
  custom: { name: 'Custom', url: '' }
};

class Collection {
  constructor(file, fallback) {
    this.file = file;
    this.fallback = fallback;
    this.data = this._read();
    this.timer = null;
  }
  _read() {
    try {
      const raw = fs.readFileSync(this.file, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(this.fallback) && !Array.isArray(parsed)) return structuredClone(this.fallback);
      if (!Array.isArray(this.fallback) && typeof parsed === 'object' && parsed) {
        return Object.assign(structuredClone(this.fallback), parsed);
      }
      return parsed;
    } catch {
      return structuredClone(this.fallback);
    }
  }
  save() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), 300);
  }
  flush() {
    clearTimeout(this.timer);
    this.timer = null;
    try {
      fs.mkdirSync(path.dirname(this.file), { recursive: true });
      const tmp = this.file + '.tmp';
      fs.writeFileSync(tmp, JSON.stringify(this.data, null, 1));
      fs.renameSync(tmp, this.file);
    } catch (err) {
      console.error('store: failed to write', this.file, err);
    }
  }
}

let dir;
const collections = {};

function init() {
  dir = app.getPath('userData');
  collections.settings = new Collection(path.join(dir, 'settings.json'), DEFAULT_SETTINGS);
  collections.bookmarks = new Collection(path.join(dir, 'bookmarks.json'), []);
  collections.history = new Collection(path.join(dir, 'history.json'), []);
  collections.downloads = new Collection(path.join(dir, 'downloads.json'), []);
  collections.session = new Collection(path.join(dir, 'session.json'), { windows: [] });
  collections.permissions = new Collection(path.join(dir, 'permissions.json'), {});
  collections.closedTabs = new Collection(path.join(dir, 'closed-tabs.json'), []);
}

function flushAll() {
  for (const c of Object.values(collections)) c.flush();
}

// ---- settings ----------------------------------------------------------
const settings = {
  get() { return collections.settings.data; },
  set(patch) {
    const allowed = Object.keys(DEFAULT_SETTINGS);
    for (const [k, v] of Object.entries(patch || {})) {
      if (allowed.includes(k)) collections.settings.data[k] = v;
    }
    collections.settings.save();
    return collections.settings.data;
  },
  searchUrl(query) {
    const s = collections.settings.data;
    let template = (SEARCH_ENGINES[s.searchEngine] || SEARCH_ENGINES.duckduckgo).url;
    if (s.searchEngine === 'custom' && s.customSearchUrl.includes('%s')) template = s.customSearchUrl;
    if (!template) template = SEARCH_ENGINES.duckduckgo.url;
    return template.replace('%s', encodeURIComponent(query));
  }
};

// ---- bookmarks ---------------------------------------------------------
let nextId = Date.now();
const bookmarks = {
  all() { return collections.bookmarks.data; },
  find(url) { return collections.bookmarks.data.find((b) => b.url === url); },
  add({ url, title, folder = '' }) {
    if (!url) return null;
    const existing = bookmarks.find(url);
    if (existing) return existing;
    const b = { id: String(nextId++), url, title: title || url, folder, added: Date.now() };
    collections.bookmarks.data.push(b);
    collections.bookmarks.save();
    return b;
  },
  update(id, patch) {
    const b = collections.bookmarks.data.find((x) => x.id === id);
    if (!b) return null;
    if (typeof patch.title === 'string') b.title = patch.title;
    if (typeof patch.url === 'string' && patch.url) b.url = patch.url;
    if (typeof patch.folder === 'string') b.folder = patch.folder;
    collections.bookmarks.save();
    return b;
  },
  remove(idOrUrl) {
    const before = collections.bookmarks.data.length;
    collections.bookmarks.data = collections.bookmarks.data.filter((b) => b.id !== idOrUrl && b.url !== idOrUrl);
    collections.bookmarks.save();
    return collections.bookmarks.data.length !== before;
  },
  move(id, toIndex) {
    const list = collections.bookmarks.data;
    const from = list.findIndex((b) => b.id === id);
    if (from < 0) return;
    const [item] = list.splice(from, 1);
    list.splice(Math.max(0, Math.min(toIndex, list.length)), 0, item);
    collections.bookmarks.save();
  },
  replaceAll(list) {
    collections.bookmarks.data = list;
    collections.bookmarks.save();
  }
};

// ---- history -----------------------------------------------------------
const MAX_HISTORY = 20000;
const history = {
  all() { return collections.history.data; },
  record(url, title) {
    if (!url || !/^https?:/i.test(url)) return;
    const list = collections.history.data;
    const now = Date.now();
    const last = list[list.length - 1];
    // Collapse immediate duplicate visits (e.g. reloads).
    if (last && last.url === url && now - last.time < 60_000) {
      last.time = now;
      if (title) last.title = title;
    } else {
      list.push({ url, title: title || url, time: now });
      if (list.length > MAX_HISTORY) list.splice(0, list.length - MAX_HISTORY);
    }
    collections.history.save();
  },
  setTitle(url, title) {
    if (!title) return;
    const list = collections.history.data;
    for (let i = list.length - 1; i >= Math.max(0, list.length - 20); i--) {
      if (list[i].url === url) { list[i].title = title; collections.history.save(); return; }
    }
  },
  remove(url) {
    collections.history.data = collections.history.data.filter((h) => h.url !== url);
    collections.history.save();
  },
  clear(sinceMs) {
    if (sinceMs) {
      const cutoff = Date.now() - sinceMs;
      collections.history.data = collections.history.data.filter((h) => h.time < cutoff);
    } else {
      collections.history.data = [];
    }
    collections.history.save();
  },
  // Simple ranking used by the address bar: frequency * recency, prefix matches first.
  suggest(query, limit = 8) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const scores = new Map();
    const now = Date.now();
    for (const h of collections.history.data) {
      const url = h.url.toLowerCase();
      const title = (h.title || '').toLowerCase();
      const stripped = url.replace(/^https?:\/\/(www\.)?/, '');
      let score = 0;
      if (stripped.startsWith(q)) score = 3;
      else if (url.includes(q)) score = 2;
      else if (title.includes(q)) score = 1;
      if (!score) continue;
      const ageDays = (now - h.time) / 86_400_000;
      const recency = 1 / (1 + ageDays / 7);
      const entry = scores.get(h.url) || { url: h.url, title: h.title, score: 0, type: 'history' };
      entry.score += score * (0.5 + recency);
      if (h.title) entry.title = h.title;
      scores.set(h.url, entry);
    }
    for (const b of collections.bookmarks.data) {
      const url = b.url.toLowerCase();
      const title = (b.title || '').toLowerCase();
      if (url.includes(q) || title.includes(q)) {
        const entry = scores.get(b.url) || { url: b.url, title: b.title, score: 0, type: 'bookmark' };
        entry.score += 4;
        entry.type = 'bookmark';
        scores.set(b.url, entry);
      }
    }
    return [...scores.values()].sort((a, b) => b.score - a.score).slice(0, limit);
  }
};

// ---- downloads ---------------------------------------------------------
const downloads = {
  all() { return collections.downloads.data; },
  upsert(entry) {
    const list = collections.downloads.data;
    const idx = list.findIndex((d) => d.id === entry.id);
    if (idx >= 0) list[idx] = { ...list[idx], ...entry }; else list.unshift(entry);
    if (list.length > 200) list.length = 200;
    collections.downloads.save();
  },
  remove(id) {
    collections.downloads.data = collections.downloads.data.filter((d) => d.id !== id);
    collections.downloads.save();
  },
  clear() { collections.downloads.data = []; collections.downloads.save(); }
};

// ---- session (open tabs) ----------------------------------------------
const session = {
  get() { return collections.session.data; },
  set(data) { collections.session.data = data; collections.session.save(); }
};

const permissions = {
  get(origin, permission) { return (collections.permissions.data[origin] || {})[permission]; },
  set(origin, permission, value) {
    collections.permissions.data[origin] = collections.permissions.data[origin] || {};
    collections.permissions.data[origin][permission] = value;
    collections.permissions.save();
  },
  all() { return collections.permissions.data; },
  clear() { collections.permissions.data = {}; collections.permissions.save(); }
};

const closedTabs = {
  push(entry) {
    collections.closedTabs.data.unshift(entry);
    if (collections.closedTabs.data.length > 25) collections.closedTabs.data.length = 25;
    collections.closedTabs.save();
  },
  pop() {
    const e = collections.closedTabs.data.shift();
    collections.closedTabs.save();
    return e;
  },
  all() { return collections.closedTabs.data; }
};

module.exports = {
  init, flushAll, settings, bookmarks, history, downloads, session, permissions, closedTabs,
  DEFAULT_SETTINGS, SEARCH_ENGINES
};
