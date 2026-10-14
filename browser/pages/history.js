'use strict';
let timer;
async function load() {
  const list = await drew.history.list({ query: $('#q').value.trim(), limit: 1000 });
  if (!list.length) { $('#list').replaceChildren(h('div', { class: 'empty' }, 'No history.')); return; }
  const days = new Map();
  for (const e of list) { const d = new Date(e.time).toDateString(); if (!days.has(d)) days.set(d, []); days.get(d).push(e); }
  const out = [];
  for (const [day, items] of days) {
    out.push(h('h2', {}, day === new Date().toDateString() ? 'Today' : day));
    out.push(h('div', { class: 'list' }, items.map((e) => linkItem({
      url: e.url, title: e.title, extra: h('span', { class: 'time' }, fmtTime(e.time)),
      actions: [h('button', { class: 'link danger', title: 'Remove all visits to this page', onclick: async () => { await drew.history.remove(e.url); load(); } }, '✕')]
    }))));
  }
  $('#list').replaceChildren(...out);
}
$('#q').oninput = () => { clearTimeout(timer); timer = setTimeout(load, 120); };
$('#clear').onclick = async () => {
  const ms = Number($('#range').value);
  if (!confirm(ms ? 'Delete history for the selected range?' : 'Delete ALL browsing history?')) return;
  await drew.history.clear(ms || 0); load();
};
load();
