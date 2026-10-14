'use strict';
let all = [], editing = null;
async function load() { all = await drew.bookmarks.list(); render(); }
function render() {
  const q = $('#q').value.trim().toLowerCase();
  const list = all.filter((b) => !q || b.url.toLowerCase().includes(q) || (b.title || '').toLowerCase().includes(q));
  if (!list.length) { $('#list').replaceChildren(h('div', { class: 'empty' }, all.length ? 'No matches.' : 'No bookmarks yet. Press Ctrl+D on any page to bookmark it.')); return; }
  const groups = new Map();
  for (const b of list) { const f = b.folder || ''; if (!groups.has(f)) groups.set(f, []); groups.get(f).push(b); }
  const out = [];
  for (const [folder, items] of [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    out.push(h('h2', {}, folder || 'Bookmarks bar'));
    out.push(h('div', { class: 'list' }, items.map((b, i) => linkItem({
      url: b.url, title: b.title,
      actions: [
        h('button', { class: 'link', title: 'Move up', onclick: () => move(b, -1) }, '↑'),
        h('button', { class: 'link', title: 'Move down', onclick: () => move(b, 1) }, '↓'),
        h('button', { class: 'link', onclick: () => edit(b) }, 'Edit'),
        h('button', { class: 'link danger', onclick: async () => { await drew.bookmarks.remove(b.id); load(); } }, 'Delete')
      ]
    }))));
  }
  $('#list').replaceChildren(...out);
}
function move(b, dir) {
  const idx = all.findIndex((x) => x.id === b.id);
  const target = idx + dir;
  if (target < 0 || target >= all.length) return;
  drew.bookmarks.move(b.id, target).then(load);
}
function edit(b) {
  editing = b;
  $('#editor-title').textContent = b ? 'Edit bookmark' : 'Add bookmark';
  $('#e-title').value = b ? b.title : ''; $('#e-url').value = b ? b.url : ''; $('#e-folder').value = b ? (b.folder || '') : '';
  $('#editor').hidden = false; $('#e-title').focus();
}
$('#add').onclick = () => edit(null);
$('#e-cancel').onclick = () => { $('#editor').hidden = true; };
$('#e-save').onclick = async () => {
  const title = $('#e-title').value.trim(), url = $('#e-url').value.trim(), folder = $('#e-folder').value.trim();
  if (!url) return $('#e-url').focus();
  if (editing) await drew.bookmarks.update(editing.id, { title, url, folder });
  else await drew.bookmarks.add({ title: title || url, url: /^[a-z]+:/i.test(url) ? url : 'https://' + url, folder });
  $('#editor').hidden = true; load();
};
$('#q').oninput = render;
$('#import').onclick = async () => { const n = await drew.bookmarks.import(); if (n) load(); };
$('#export').onclick = () => drew.bookmarks.export();
load();
