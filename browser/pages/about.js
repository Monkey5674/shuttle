'use strict';
drew.settings.get().then((s) => { $('#version').textContent = `Version ${s.version} · Chromium ${s.chrome} · Electron ${s.electron}`; });
const KEYS = [['Ctrl+T', 'New tab'], ['Ctrl+W', 'Close tab'], ['Ctrl+Shift+T', 'Reopen closed tab'], ['Ctrl+Tab / Ctrl+Shift+Tab', 'Next / previous tab'], ['Ctrl+1…8, Ctrl+9', 'Switch to tab N / last tab'],
  ['Ctrl+N', 'New window'], ['Ctrl+Shift+N', 'New private window'], ['Ctrl+L / Alt+D / F6', 'Focus address bar'], ['Alt+Left / Alt+Right', 'Back / forward'], ['F5 / Ctrl+R', 'Reload'], ['Ctrl+Shift+R', 'Reload ignoring cache'],
  ['Esc', 'Stop loading'], ['Ctrl+D', 'Bookmark this page'], ['Ctrl+Shift+B', 'Show / hide bookmarks bar'], ['Ctrl+H', 'History'], ['Ctrl+J', 'Downloads'], ['Ctrl+F', 'Find in page'], ['Ctrl+P', 'Print'],
  ['Ctrl++ / Ctrl+- / Ctrl+0', 'Zoom in / out / reset'], ['F11', 'Full screen'], ['F12 / Ctrl+Shift+I', 'Developer tools'], ['Ctrl+Shift+Delete', 'Clear browsing data']];
$('#keys').replaceChildren(...KEYS.map(([k, d]) => h('div', { class: 'item' }, h('kbd', {}, k), h('span', {}, d))));
document.addEventListener('click', (e) => { const a = e.target.closest('a[href]'); if (a) { e.preventDefault(); drew.open(a.href, { newTab: true }); } });
