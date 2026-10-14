'use strict';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el[k] = v;
    else if (v !== undefined && v !== null) el.setAttribute(k, v);
  }
  for (const c of children.flat()) if (c !== null && c !== undefined) el.append(c.nodeType ? c : document.createTextNode(String(c)));
  return el;
}
function hostOf(url) { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; } }
function favicon(url) { const host = hostOf(url); return h('span', { class: 'fav' }, host ? host[0].toUpperCase() : '•'); }
function openLink(url, ev) {
  if (ev && (ev.ctrlKey || ev.metaKey || ev.button === 1)) drew.open(url, { newTab: true, background: true });
  else if (ev && ev.shiftKey) drew.open(url, { newTab: true });
  else drew.open(url);
}
function linkItem({ url, title, extra, actions }) {
  const a = h('a', { href: url, class: 'title', onclick: (e) => { e.preventDefault(); openLink(url, e); }, onauxclick: (e) => { if (e.button === 1) { e.preventDefault(); openLink(url, e); } } }, title || url);
  return h('div', { class: 'item' }, favicon(url), h('div', { class: 'text' }, a, h('div', { class: 'url' }, url)), extra || null, actions ? h('div', { class: 'acts' }, actions) : null);
}
function fmtTime(ts) {
  const d = new Date(ts), now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function fmtBytes(n) { if (n == null) return ''; const u = ['B', 'KB', 'MB', 'GB']; let i = 0; while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; } return (i ? n.toFixed(1) : n) + ' ' + u[i]; }
