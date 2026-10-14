'use strict';
// URL helpers: turning address-bar input into a URL, deciding what is allowed
// to load inside a tab, and building the internal error page URL.
const { dialog, shell } = require('electron');
const store = require('./store');

const INTERNAL_SCHEME = 'drew:';
const INTERNAL_PAGES = new Set(['newtab', 'bookmarks', 'history', 'downloads', 'settings', 'error', 'about']);

function isWebUrl(url) { return /^https?:\/\//i.test(url || ''); }
function isInternal(url) { return (url || '').startsWith(INTERNAL_SCHEME + '//'); }
function isAllowedNavigation(url) {
  return isWebUrl(url) || isInternal(url) || url === 'about:blank' || /^file:\/\//i.test(url) || /^data:text\/html/i.test(url) || /^view-source:/i.test(url);
}
function isBookmarkable(url) { return isWebUrl(url) || (isInternal(url) && !url.startsWith('drew://newtab') && !url.startsWith('drew://error')); }

function looksLikeHost(text) {
  if (text === 'localhost' || text.startsWith('localhost:') || text.startsWith('localhost/')) return true;
  if (/^(\d{1,3}\.){3}\d{1,3}(:\d+)?(\/.*)?$/.test(text)) return true;
  if (/^\[[0-9a-f:]+\](:\d+)?(\/.*)?$/i.test(text)) return true;
  // something.tld[/path] – no spaces, has a dot with letters after it
  return /^[a-z0-9¡-￿-]+(\.[a-z0-9¡-￿-]+)+(:\d+)?([/?#].*)?$/i.test(text);
}

function fromUserInput(raw) {
  const text = String(raw || '').trim();
  if (!text) return null;
  if (/^(https?|file|view-source):/i.test(text)) return text;
  if (/^about:blank$/i.test(text)) return 'about:blank';
  if (/^drew:\/\//i.test(text)) {
    const host = text.slice('drew://'.length).split(/[/?#]/)[0];
    return INTERNAL_PAGES.has(host) ? text : store.settings.searchUrl(text);
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(text) && !text.includes(' ') && !looksLikeHost(text)) {
    // Some other scheme (mailto:, ms-settings:, ...) typed explicitly.
    return text;
  }
  if (!/\s/.test(text) && looksLikeHost(text)) return 'http://' + text;
  return store.settings.searchUrl(text);
}

function errorPage(url, code, desc) {
  const p = new URLSearchParams({ url: url || '', code: String(code || 0), desc: desc || '' });
  return 'drew://error/?' + p.toString();
}
function isErrorPage(url) { return (url || '').startsWith('drew://error'); }
function errorPageTarget(url) {
  try { return new URL(url).searchParams.get('url') || url; } catch { return url; }
}

function securityState(url, error) {
  if (error) return 'error';
  if (isInternal(url)) return 'internal';
  if (/^https:/i.test(url)) return 'secure';
  if (/^http:/i.test(url)) return 'insecure';
  return 'neutral';
}

const externalPrompted = new Map();
async function maybeOpenExternal(url, parentWin) {
  let scheme;
  try { scheme = new URL(url).protocol; } catch { return; }
  if (['javascript:', 'file:', 'data:', 'blob:'].includes(scheme)) return;
  const { response, checkboxChecked } = await dialog.showMessageBox(parentWin, {
    type: 'question', buttons: ['Open', 'Cancel'], defaultId: 1, cancelId: 1,
    title: 'Open external application?',
    message: `This page wants to open a link with another application (${scheme.replace(':', '')}).`,
    detail: url.length > 200 ? url.slice(0, 200) + '…' : url,
    checkboxLabel: 'Always allow links of this type', checkboxChecked: false
  });
  if (response !== 0) return;
  if (checkboxChecked) externalPrompted.set(scheme, true);
  shell.openExternal(url).catch(() => {});
}

module.exports = {
  INTERNAL_PAGES, isWebUrl, isInternal, isAllowedNavigation, isBookmarkable, fromUserInput,
  errorPage, isErrorPage, errorPageTarget, securityState, maybeOpenExternal
};
