'use strict';
// Tracking protection: blocks known tracker/ad hosts, strips tracking query
// parameters, upgrades http:// navigations to https://, sends Do-Not-Track /
// Global Privacy Control headers and blocks third-party cookies.
const fs = require('fs');
const path = require('path');
const { app, net, webContents } = require('electron');
const store = require('./store');

const builtin = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'trackers.json'), 'utf8'));

const state = {
  domains: new Set(builtin.domains),
  remoteDomains: new Set(),
  patterns: builtin.patterns.map((p) => new RegExp(p, 'i')),
  trackingParams: new Set(builtin.trackingParams),
  allowlist: new Set(),          // site hosts where the user disabled the shield
  httpsFallback: new Set(),      // hosts where the https upgrade failed
  upgraded: new Map(),           // webContentsId -> original http url (for fallback)
  blockedCounts: new Map(),      // webContentsId -> { count, hosts:Set }
  listeners: new Set(),
  remoteCount: 0,
  remoteUpdated: 0
};

const ALLOWLIST_FILE = () => path.join(app.getPath('userData'), 'shield-allowlist.json');
const REMOTE_FILE = () => path.join(app.getPath('userData'), 'blocklist-remote.json');

function loadPersisted() {
  try { JSON.parse(fs.readFileSync(ALLOWLIST_FILE(), 'utf8')).forEach((h) => state.allowlist.add(h)); } catch {}
  try {
    const r = JSON.parse(fs.readFileSync(REMOTE_FILE(), 'utf8'));
    state.remoteDomains = new Set(r.domains || []);
    state.remoteUpdated = r.updated || 0;
    state.remoteCount = state.remoteDomains.size;
  } catch {}
}

function saveAllowlist() {
  try { fs.writeFileSync(ALLOWLIST_FILE(), JSON.stringify([...state.allowlist])); } catch {}
}

// --- host helpers ---------------------------------------------------------
const TWO_LEVEL = new Set(['co.uk', 'org.uk', 'ac.uk', 'gov.uk', 'com.au', 'net.au', 'org.au', 'co.nz', 'co.jp',
  'ne.jp', 'or.jp', 'com.br', 'com.mx', 'com.ar', 'co.in', 'co.za', 'com.sg', 'com.hk', 'com.tw', 'com.cn',
  'com.tr', 'co.kr', 'com.my', 'co.id', 'com.ph', 'com.vn', 'com.pk', 'com.ng', 'com.eg', 'com.sa', 'com.ua']);

function baseDomain(host) {
  if (!host) return '';
  host = host.toLowerCase().replace(/\.$/, '');
  if (/^[\d.]+$/.test(host) || host.includes(':')) return host; // IP literal
  const parts = host.split('.');
  if (parts.length <= 2) return host;
  const lastTwo = parts.slice(-2).join('.');
  if (TWO_LEVEL.has(lastTwo)) return parts.slice(-3).join('.');
  return lastTwo;
}

function hostOf(url) {
  try { return new URL(url).hostname.toLowerCase(); } catch { return ''; }
}

function isTrackerHost(host) {
  if (!host) return false;
  host = host.toLowerCase();
  const labels = host.split('.');
  for (let i = 0; i < labels.length - 1; i++) {
    const candidate = labels.slice(i).join('.');
    if (state.domains.has(candidate) || state.remoteDomains.has(candidate)) return true;
  }
  return false;
}

function matchesPattern(url) {
  for (const re of state.patterns) if (re.test(url)) return true;
  return false;
}

function topUrlFor(details) {
  // Prefer the real top frame URL, fall back to the initiator / referrer.
  try {
    const wc = details.webContentsId != null ? webContents.fromId(details.webContentsId) : null;
    if (wc && !wc.isDestroyed()) {
      const u = wc.getURL();
      if (u) return u;
    }
  } catch {}
  return details.initiator || details.referrer || '';
}

function isThirdParty(details) {
  const top = topUrlFor(details);
  if (!top) return true;
  return baseDomain(hostOf(top)) !== baseDomain(hostOf(details.url));
}

function stripTrackingParams(url) {
  let u;
  try { u = new URL(url); } catch { return null; }
  if (!u.search) return null;
  let changed = false;
  for (const key of [...u.searchParams.keys()]) {
    if (state.trackingParams.has(key) || /^utm_/i.test(key)) { u.searchParams.delete(key); changed = true; }
  }
  if (!changed) return null;
  return u.toString();
}

function noteBlocked(details, host) {
  const id = details.webContentsId;
  if (id == null) return;
  const entry = state.blockedCounts.get(id) || { count: 0, hosts: new Set() };
  entry.count++;
  entry.hosts.add(host);
  state.blockedCounts.set(id, entry);
  for (const fn of state.listeners) fn(id, entry);
}

function resetCount(webContentsId) {
  state.blockedCounts.set(webContentsId, { count: 0, hosts: new Set() });
  for (const fn of state.listeners) fn(webContentsId, state.blockedCounts.get(webContentsId));
}

function getCount(webContentsId) {
  const e = state.blockedCounts.get(webContentsId);
  return e ? { count: e.count, hosts: [...e.hosts] } : { count: 0, hosts: [] };
}

function onBlockedChange(fn) { state.listeners.add(fn); }

// --- shield allowlist -----------------------------------------------------
function isShieldDisabledFor(url) {
  const h = hostOf(url);
  return h ? state.allowlist.has(baseDomain(h)) : false;
}
function setShieldEnabledFor(url, enabled) {
  const d = baseDomain(hostOf(url));
  if (!d) return;
  if (enabled) state.allowlist.delete(d); else state.allowlist.add(d);
  saveAllowlist();
}

// --- https upgrade fallback -----------------------------------------------
function shouldUpgrade(url) {
  let u;
  try { u = new URL(url); } catch { return false; }
  if (u.protocol !== 'http:') return false;
  const h = u.hostname;
  if (h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.local') || /^[\d.]+$/.test(h) || h.includes(':')) return false;
  if (state.httpsFallback.has(h)) return false;
  return true;
}
function markUpgraded(webContentsId, httpUrl) { state.upgraded.set(webContentsId, httpUrl); }
// Called by the tab manager when a load fails: if we had upgraded this
// navigation, remember the host and return the http url to retry with.
function httpsFallbackFor(webContentsId, failedUrl) {
  const original = state.upgraded.get(webContentsId);
  if (!original) return null;
  state.upgraded.delete(webContentsId);
  try {
    const o = new URL(original), f = new URL(failedUrl);
    if (o.hostname !== f.hostname) return null;
    state.httpsFallback.add(o.hostname);
    return original;
  } catch { return null; }
}

// --- session wiring -------------------------------------------------------
function applyTo(session) {
  const filter = { urls: ['<all_urls>'] };

  session.webRequest.onBeforeRequest(filter, (details, callback) => {
    const s = store.settings.get();
    const url = details.url;
    if (!/^https?:/i.test(url)) return callback({});
    const isMain = details.resourceType === 'mainFrame';

    if (isMain) {
      if (s.stripTrackingParams) {
        const cleaned = stripTrackingParams(url);
        if (cleaned) return callback({ redirectURL: cleaned });
      }
      if (s.httpsUpgrade && shouldUpgrade(url)) {
        markUpgraded(details.webContentsId, url);
        return callback({ redirectURL: 'https:' + url.slice('http:'.length) });
      }
      return callback({});
    }

    if (s.blockTrackers) {
      const top = topUrlFor(details);
      if (!isShieldDisabledFor(top)) {
        const host = hostOf(url);
        const sameSite = baseDomain(hostOf(top)) === baseDomain(host);
        if ((isTrackerHost(host) && !sameSite) || matchesPattern(url)) {
          noteBlocked(details, host);
          return callback({ cancel: true });
        }
      }
    }
    callback({});
  });

  session.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    const s = store.settings.get();
    const headers = { ...details.requestHeaders };
    if (s.sendDoNotTrack) {
      headers['DNT'] = '1';
      headers['Sec-GPC'] = '1';
    }
    if (s.blockThirdPartyCookies && details.resourceType !== 'mainFrame' && isThirdParty(details)) {
      delete headers['Cookie'];
      delete headers['cookie'];
    }
    callback({ requestHeaders: headers });
  });

  session.webRequest.onHeadersReceived(filter, (details, callback) => {
    const s = store.settings.get();
    if (!s.blockThirdPartyCookies || details.resourceType === 'mainFrame' || !isThirdParty(details)) {
      return callback({});
    }
    const headers = {};
    let changed = false;
    for (const [k, v] of Object.entries(details.responseHeaders || {})) {
      if (k.toLowerCase() === 'set-cookie') { changed = true; continue; }
      headers[k] = v;
    }
    callback(changed ? { responseHeaders: headers } : {});
  });
}

// --- remote blocklist update ---------------------------------------------
function parseHostList(text) {
  const out = new Set();
  for (let line of text.split(/\r?\n/)) {
    line = line.replace(/#.*$/, '').trim();
    if (!line) continue;
    const parts = line.split(/\s+/);
    let host = parts.length > 1 && /^[\d.:]+$/.test(parts[0]) ? parts[1] : parts[0];
    host = host.replace(/^\|\|/, '').replace(/\^.*$/, '').toLowerCase();
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(host)) continue;
    if (host === 'localhost' || host.endsWith('.localhost')) continue;
    out.add(host);
  }
  return out;
}

async function updateRemoteList(force = false) {
  const s = store.settings.get();
  if (!s.remoteBlocklist || !s.remoteBlocklistUrl) return { skipped: true };
  const age = Date.now() - state.remoteUpdated;
  if (!force && age < 3 * 86_400_000 && state.remoteDomains.size) return { cached: true, count: state.remoteDomains.size };
  try {
    const res = await net.fetch(s.remoteBlocklistUrl, { headers: { 'User-Agent': 'DrewsBrowser/' + app.getVersion() } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.text();
    const hosts = parseHostList(text);
    if (hosts.size < 50) throw new Error('list too small, ignoring');
    state.remoteDomains = hosts;
    state.remoteCount = hosts.size;
    state.remoteUpdated = Date.now();
    fs.writeFileSync(REMOTE_FILE(), JSON.stringify({ updated: state.remoteUpdated, domains: [...hosts] }));
    return { count: hosts.size };
  } catch (err) {
    console.warn('privacy: remote blocklist update failed:', err.message);
    return { error: err.message };
  }
}

function status() {
  return {
    builtinCount: state.domains.size,
    remoteCount: state.remoteDomains.size,
    remoteUpdated: state.remoteUpdated,
    allowlist: [...state.allowlist]
  };
}

module.exports = {
  loadPersisted, applyTo, updateRemoteList, status,
  isShieldDisabledFor, setShieldEnabledFor, getCount, resetCount, onBlockedChange,
  httpsFallbackFor, stripTrackingParams, isTrackerHost, baseDomain
};
