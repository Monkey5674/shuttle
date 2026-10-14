'use strict';
const p = new URLSearchParams(location.search);
const url = p.get('url') || '', code = Number(p.get('code') || 0), desc = p.get('desc') || '';
const host = hostOf(url) || url;
const MESSAGES = {
  '-105': [`${host} could not be found`, 'Check the address for typos. If it is correct, the site may be offline or your DNS may be unavailable.'],
  '-106': ['You are offline', 'Check your network connection and try again.'],
  '-102': [`${host} refused to connect`, 'The server is up but is not accepting connections on this port.'],
  '-118': [`${host} took too long to respond`, 'The server did not answer in time. Try again in a moment.'],
  '-7': [`${host} took too long to respond`, 'The connection timed out.'],
  '-101': ['Connection reset', 'The connection was closed unexpectedly. Reload to try again.'],
  '-100': ['Connection closed', 'The server closed the connection before sending a response.'],
  '-200': ['Your connection is not private', `The security certificate for ${host} is not trusted. Drew's Browser does not let you continue to sites with invalid certificates.`],
  '-201': ['Your connection is not private', `The security certificate for ${host} has expired or is not yet valid.`],
  '-202': ['Your connection is not private', `The security certificate for ${host} was issued by an authority this device does not trust.`],
  '-203': ['Your connection is not private', `The security certificate for ${host} is invalid.`],
  '-501': ['Insecure response', 'The server sent an invalid response over the secure connection.'],
  '-20': ['Blocked', 'This request was blocked by the browser policy or tracking protection.'],
  '-27': ['Blocked', 'This request was blocked by the browser.'],
  '-310': ['Too many redirects', 'The page redirected you too many times. Clearing cookies for this site may help.'],
  '-324': ['Empty response', `${host} did not send any data.`],
  '-2': ['Load failed', 'The page could not be loaded.']
};
const [t, m] = MESSAGES[String(code)] || (code <= -200 && code > -300 ? MESSAGES['-200'] : [`This page can't be loaded`, desc.includes('crash') ? desc : `An error occurred while loading ${host || 'the page'}.`]);
$('#title').textContent = t; $('#msg').textContent = m;
$('#code').textContent = [url, desc ? `${desc} (${code})` : code ? String(code) : ''].filter(Boolean).join('\n');
$('#retry').onclick = () => drew.retry();
$('#back').onclick = () => drew.back();
