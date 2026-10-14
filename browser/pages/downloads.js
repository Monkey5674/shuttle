'use strict';
function render(list) {
  if (!list.length) { $('#list').replaceChildren(h('div', { class: 'empty' }, 'No downloads yet.')); return; }
  $('#list').replaceChildren(h('div', { class: 'list' }, list.map((d) => {
    const status = d.state === 'progressing' ? (d.paused ? 'Paused · ' : '') + `${fmtBytes(d.received)}${d.total ? ' of ' + fmtBytes(d.total) : ''}` : d.state === 'completed' ? `${fmtBytes(d.total || d.received)} · Completed ${fmtTime(d.startTime)}` : d.state === 'cancelled' ? 'Cancelled' : 'Failed';
    const acts = [];
    if (d.state === 'progressing') {
      acts.push(h('button', { class: 'link', onclick: () => d.paused ? drew.downloads.resume(d.id) : drew.downloads.pause(d.id) }, d.paused ? 'Resume' : 'Pause'));
      acts.push(h('button', { class: 'link danger', onclick: () => drew.downloads.cancel(d.id) }, 'Cancel'));
    } else {
      if (d.state === 'completed') { acts.push(h('button', { class: 'link', onclick: () => drew.downloads.open(d.id) }, 'Open')); acts.push(h('button', { class: 'link', onclick: () => drew.downloads.show(d.id) }, 'Show in folder')); }
      acts.push(h('button', { class: 'link danger', onclick: () => drew.downloads.remove(d.id) }, 'Remove'));
    }
    const text = h('div', { class: 'text' }, h('div', { class: 'title' }, d.filename), h('div', { class: 'url' }, d.url), h('div', { class: 'url' }, status));
    const item = h('div', { class: 'item' }, favicon(d.url), text, h('div', { class: 'acts', style: 'opacity:1' }, acts));
    if (d.state === 'progressing' && d.total) text.appendChild(h('progress', { max: d.total, value: d.received }));
    return item;
  })));
}
drew.downloads.list().then(render);
drew.onDownloads(render);
$('#folder').onclick = () => drew.downloads.openFolder();
$('#clear').onclick = async () => { await drew.downloads.clear(); render(await drew.downloads.list()); };
