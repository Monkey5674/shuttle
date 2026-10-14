'use strict';
const BOOLS = ['restoreSession', 'showBookmarksBar', 'askWhereToSave', 'blockTrackers', 'remoteBlocklist', 'blockThirdPartyCookies', 'stripTrackingParams', 'httpsUpgrade', 'sendDoNotTrack', 'clearOnExit'];
const TEXTS = ['homepage', 'customSearchUrl', 'remoteBlocklistUrl', 'proxyServer', 'proxyBypass', 'proxyPac'];
let s;
async function load() {
  s = await drew.settings.get();
  const sel = $('#searchEngine');
  sel.replaceChildren(...Object.entries(s.engines).map(([k, v]) => h('option', { value: k }, v.name)));
  sel.value = s.searchEngine;
  $('#customSearchRow').hidden = s.searchEngine !== 'custom';
  for (const k of BOOLS) $('#' + k).checked = !!s[k];
  for (const k of TEXTS) $('#' + k).value = s[k] || '';
  $('#theme').value = s.theme || 'system';
  $('#proxyMode').value = s.proxyMode || 'auto';
  proxyRows();
  refreshProxy();
  $('#version').textContent = `Drew's Browser ${s.version} · Chromium ${s.chrome} · Electron ${s.electron}`;
  refreshPrivacy();
}
async function refreshPrivacy() {
  const st = await drew.privacy.status();
  $('#listinfo').textContent = `${st.builtinCount} built-in + ${st.remoteCount} remote domains` + (st.remoteUpdated ? `, updated ${new Date(st.remoteUpdated).toLocaleString()}` : '');
  $('#allowlist').replaceChildren(...(st.allowlist.length ? st.allowlist.map((hst) => h('span', {}, hst, ' ', h('button', { class: 'link', onclick: async () => { await drew.privacy.allowlistRemove(hst); refreshPrivacy(); } }, 'Re-enable'), ' ')) : ['None']));
  const perms = await drew.permissions.list();
  $('#permcount').textContent = Object.keys(perms).length + ' site(s)';
}
function proxyRows() {
  const m = $('#proxyMode').value;
  $('#proxyServerRow').hidden = m !== 'manual';
  $('#proxyBypassRow').hidden = m !== 'manual';
  $('#proxyPacRow').hidden = m !== 'pac';
}
async function refreshProxy() {
  try {
    const p = await drew.proxy.status();
    const what = p.mode === 'direct' ? 'no proxy' : p.mode === 'system' ? 'Windows system proxy' : p.mode === 'pac_script' ? 'PAC script ' + p.pacScript : p.mode === 'fixed_servers' ? 'proxy ' + p.proxyRules : p.mode;
    $('#proxyinfo').textContent = 'Currently using: ' + what + (p.source && p.source !== 'settings' ? ' (from ' + (p.source.includes('Policies') ? 'Chrome/Edge policy' : p.source) + ')' : '');
  } catch { $('#proxyinfo').textContent = ''; }
}
$('#proxyMode').onchange = (e) => { save({ proxyMode: e.target.value }).then(() => { proxyRows(); refreshProxy(); }); };
function save(patch) { return drew.settings.set(patch).then((n) => { s = n; }); }
$('#searchEngine').onchange = (e) => { save({ searchEngine: e.target.value }); $('#customSearchRow').hidden = e.target.value !== 'custom'; };
$('#theme').onchange = (e) => save({ theme: e.target.value }).then(() => location.reload());
for (const k of BOOLS) $('#' + k).onchange = (e) => save({ [k]: e.target.checked }).then(refreshPrivacy);
for (const k of TEXTS) $('#' + k).onchange = (e) => save({ [k]: e.target.value.trim() }).then(() => { if (k.startsWith('proxy')) refreshProxy(); });
$('#updateList').onclick = async () => { $('#updateList').disabled = true; $('#updateList').textContent = 'Updating…'; const r = await drew.privacy.updateList(); $('#updateList').disabled = false; $('#updateList').textContent = r.error ? 'Failed: ' + r.error : 'Update list now'; refreshPrivacy(); };
$('#clearPerms').onclick = async () => { await drew.permissions.clear(); refreshPrivacy(); };
$('#clearData').onclick = async () => {
  $('#clearStatus').textContent = 'Clearing…';
  await drew.privacy.clearData({ history: $('#c-history').checked, cookies: $('#c-cookies').checked, cache: $('#c-cache').checked, downloads: $('#c-downloads').checked });
  $('#clearStatus').textContent = 'Done.';
};
load().then(() => { if (location.hash === '#clear') $('#clear').scrollIntoView(); });
