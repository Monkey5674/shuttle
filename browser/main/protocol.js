'use strict';
// The drew:// scheme serves the browser's own pages (new tab, bookmarks,
// history, downloads, settings, error) from the local "pages" directory.
const path = require('path');
const fs = require('fs');
const { protocol, net } = require('electron');
const { pathToFileURL } = require('url');
const urls = require('./urls');

const PAGES_DIR = path.join(__dirname, '..', 'pages');

function registerPrivileged() {
  protocol.registerSchemesAsPrivileged([
    { scheme: 'drew', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: false, allowServiceWorkers: false } }
  ]);
}

function handle() {
  protocol.handle('drew', (request) => {
    let u;
    try { u = new URL(request.url); } catch { return new Response('Bad request', { status: 400 }); }
    const page = u.hostname;
    if (!urls.INTERNAL_PAGES.has(page)) return new Response('Not found', { status: 404 });
    let rel = decodeURIComponent(u.pathname).replace(/^\/+/, '');
    if (!rel || rel.endsWith('/')) rel = page + '.html';
    const file = path.normalize(path.join(PAGES_DIR, rel));
    if (!file.startsWith(PAGES_DIR + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      return new Response('Not found', { status: 404 });
    }
    return net.fetch(pathToFileURL(file).toString(), { bypassCustomProtocolHandlers: true }).then((res) => {
      const headers = new Headers(res.headers);
      headers.set('Content-Security-Policy', "default-src 'self'; img-src 'self' data: https: http:; style-src 'self' 'unsafe-inline'; script-src 'self'");
      headers.set('X-Content-Type-Options', 'nosniff');
      return new Response(res.body, { status: res.status, headers });
    });
  });
}

module.exports = { registerPrivileged, handle };
