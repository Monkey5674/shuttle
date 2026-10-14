'use strict';
// Netscape bookmark file format (what every browser imports/exports).
function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function exportBookmarksHtml(list) {
  const folders = new Map();
  for (const b of list) {
    const f = b.folder || '';
    if (!folders.has(f)) folders.set(f, []);
    folders.get(f).push(b);
  }
  let out = '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n<TITLE>Bookmarks</TITLE>\n<H1>Bookmarks</H1>\n<DL><p>\n';
  const item = (b) => `    <DT><A HREF="${esc(b.url)}" ADD_DATE="${Math.round((b.added || Date.now()) / 1000)}">${esc(b.title)}</A>\n`;
  for (const b of folders.get('') || []) out += item(b);
  for (const [name, items] of folders) {
    if (!name) continue;
    out += `    <DT><H3>${esc(name)}</H3>\n    <DL><p>\n`;
    for (const b of items) out += '    ' + item(b);
    out += '    </DL><p>\n';
  }
  out += '</DL><p>\n';
  return out;
}

function decode(s) {
  return String(s || '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}

function importBookmarksHtml(html) {
  const out = [];
  const folderStack = [];
  const tokens = html.split(/(?=<DT>|<\/DL>)/i);
  for (const tok of tokens) {
    const h3 = tok.match(/<H3[^>]*>([\s\S]*?)<\/H3>/i);
    if (h3) { folderStack.push(decode(h3[1]).trim()); continue; }
    if (/^<\/DL>/i.test(tok)) { folderStack.pop(); continue; }
    const a = tok.match(/<A\s+[^>]*HREF="([^"]+)"[^>]*>([\s\S]*?)<\/A>/i);
    if (a && /^https?:/i.test(a[1])) {
      const added = (tok.match(/ADD_DATE="(\d+)"/i) || [])[1];
      out.push({ url: decode(a[1]), title: decode(a[2]).trim() || decode(a[1]), folder: folderStack.filter((f) => !/^bookmarks( bar| toolbar)?$/i.test(f)).join('/'), added: added ? Number(added) * 1000 : Date.now() });
    }
  }
  return out;
}

module.exports = { exportBookmarksHtml, importBookmarksHtml };
