'use strict';
// Per-session hardening: tracking protection, permission prompts, download
// handling, certificate policy and user agent clean-up.
const { app, dialog } = require('electron');
const privacy = require('./privacy');
const store = require('./store');
const downloads = require('./downloads');

const SENSITIVE = new Set(['media', 'geolocation', 'notifications', 'midi', 'midiSysex', 'clipboard-read', 'clipboard-sanitized-write',
  'display-capture', 'idle-detection', 'hid', 'serial', 'usb', 'bluetooth', 'speaker-selection', 'storage-access', 'top-level-storage-access', 'window-management', 'local-fonts', 'keyboardLock']);
const ALWAYS_ALLOW = new Set(['fullscreen', 'pointerLock', 'background-sync', 'clipboard-sanitized-write']);
const PROMPTABLE = new Set(['media', 'geolocation', 'notifications', 'clipboard-read', 'display-capture', 'midi', 'midiSysex']);

const LABELS = {
  media: 'use your camera and/or microphone', geolocation: 'know your location', notifications: 'show notifications',
  'clipboard-read': 'read text and images from your clipboard', 'display-capture': 'see the contents of your screen',
  midi: 'use your MIDI devices', midiSysex: 'use your MIDI devices (system exclusive)'
};

function originOf(url) { try { return new URL(url).origin; } catch { return url; } }

function configure(session, { isPrivate = false } = {}) {
  // Remove "Electron/x.y" from the UA so sites serve their normal pages.
  const appToken = app.getName().replace(/\s+/g, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const ua = session.getUserAgent().replace(new RegExp(`\\s(Electron|${appToken})\\/[\\d.]+`, 'gi'), '').replace(/\s+/g, ' ');
  session.setUserAgent(ua);

  privacy.applyTo(session);
  downloads.attach(session);

  session.setPermissionRequestHandler(async (wc, permission, callback, details) => {
    const url = (details && details.requestingUrl) || (wc && wc.getURL()) || '';
    const origin = originOf(url);
    if (ALWAYS_ALLOW.has(permission)) return callback(true);
    if (permission === 'openExternal') {
      return callback(false); // handled through our own prompt in urls.maybeOpenExternal
    }
    if (!PROMPTABLE.has(permission) || !/^https?:/.test(origin)) return callback(false);
    if (permission === 'media' && details && details.mediaTypes && details.mediaTypes.length === 0) return callback(true);

    const remembered = isPrivate ? undefined : store.permissions.get(origin, permission);
    if (remembered !== undefined) return callback(!!remembered);

    const ctx = require('./windows').fromWebContents(wc);
    const parent = ctx ? ctx.win.win : undefined;
    const what = LABELS[permission] || permission;
    const extra = permission === 'media' && details && details.mediaTypes ? ` (${details.mediaTypes.join(', ')})` : '';
    try {
      const { response, checkboxChecked } = await dialog.showMessageBox(parent, {
        type: 'question', buttons: ['Allow', 'Block'], defaultId: 1, cancelId: 1,
        title: 'Permission request', message: `${origin} wants to ${what}${extra}.`,
        checkboxLabel: isPrivate ? undefined : 'Remember this decision for this site', checkboxChecked: false
      });
      const allowed = response === 0;
      if (checkboxChecked && !isPrivate) store.permissions.set(origin, permission, allowed);
      callback(allowed);
    } catch { callback(false); }
  });

  session.setPermissionCheckHandler((wc, permission, requestingOrigin, details) => {
    if (ALWAYS_ALLOW.has(permission)) return true;
    const origin = originOf(requestingOrigin || (details && details.requestingUrl) || '');
    if (!PROMPTABLE.has(permission)) return false;
    const remembered = isPrivate ? undefined : store.permissions.get(origin, permission);
    return remembered === true;
  });

  session.setDevicePermissionHandler(() => false);
  session.setBluetoothPairingHandler && session.setBluetoothPairingHandler((details, cb) => cb({ confirmed: false }));
  session.on('select-hid-device', (e, d, cb) => { e.preventDefault(); cb(''); });
  session.on('select-serial-port', (e, l, wc, cb) => { e.preventDefault(); cb(''); });
  session.on('select-usb-device', (e, d, cb) => { e.preventDefault(); cb(''); });

  try { session.setSpellCheckerLanguages([app.getLocale()].filter(Boolean)); } catch {}
}

module.exports = { configure, SENSITIVE };
