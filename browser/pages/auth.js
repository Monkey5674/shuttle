'use strict';
const q = new URLSearchParams(location.search);
const id = q.get('id'), host = q.get('host'), realm = q.get('realm'), isProxy = q.get('proxy') === '1';
$('#title').textContent = isProxy ? 'The network proxy needs you to sign in' : 'This site needs you to sign in';
$('#msg').textContent = (isProxy ? 'Proxy ' : '') + host + (realm ? ' (' + realm + ')' : '') + (isProxy ? '. Usually this is your normal school or work login.' : '');
$('#f').onsubmit = (e) => { e.preventDefault(); drew.auth.submit(id, $('#u').value, $('#p').value); };
$('#cancel').onclick = () => drew.auth.cancel(id);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') drew.auth.cancel(id); });
