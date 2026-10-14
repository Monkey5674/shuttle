'use strict';
$('#search').onsubmit = (e) => { e.preventDefault(); const q = $('#q').value.trim(); if (q) drew.open(q); };
const tile = (b) => h('a', { class: 'tile', href: b.url, title: b.url, onclick: (e) => { e.preventDefault(); openLink(b.url, e); } }, favicon(b.url), h('span', { class: 't' }, b.title || hostOf(b.url)));
drew.history.top().then((top) => {
  const list = top.filter((t) => !t.url.startsWith('drew://')).slice(0, 8);
  if (list.length) { $('#top-title').hidden = false; $('#top').replaceChildren(...list.map(tile)); }
});
drew.bookmarks.list().then((bms) => {
  const list = bms.slice(0, 8);
  if (list.length) { $('#bm-title').hidden = false; $('#bm').replaceChildren(...list.map(tile)); }
});
document.addEventListener('click', (e) => { const a = e.target.closest('.links a'); if (a) { e.preventDefault(); openLink(a.href, e); } });
