'use strict';
const BOOLS = ['restoreSession', 'showBookmarksBar', 'askWhereToSave', 'blockTrackers', 'remoteBlocklist', 'blockThirdPartyCookies', 'stripTrackingParams', 'httpsUpgrade', 'sendDoNotTrack', 'clearOnExit'];
const TEXTS = ['homepage', 'customSearchUrl', 'remoteBlocklistUrl'];
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
function save(patch) { return drew.settings.set(patch).then((n) => { s = n; }); }
$('#searchEngine').onchange = (e) => { save({ searchEngine: e.target.value }); $('#customSearchRow').hidden = e.target.value !== 'custom'; };
$('#theme').onchange = (e) => save({ theme: e.target.value }).then(() => location.reload());
for (const k of BOOLS) $('#' + k).onchange = (e) => save({ [k]: e.target.checked }).then(refreshPrivacy);
for (const k of TEXTS) $('#' + k).onchange = (e) => save({ [k]: e.target.value.trim() });
$('#updateList').onclick = async () => { $('#updateList').disabled = true; $('#updateList').textContent = 'Updating…'; const r = await drew.privacy.updateList(); $('#updateList').disabled = false; $('#updateList').textContent = r.error ? 'Failed: ' + r.error : 'Update list now'; refreshPrivacy(); };
$('#clearPerms').onclick = async () => { await drew.permissions.clear(); refreshPrivacy(); };
$('#clearData').onclick = async () => {
  $('#clearStatus').textContent = 'Clearing…';
  await drew.privacy.clearData({ history: $('#c-history').checked, cookies: $('#c-cookies').checked, cache: $('#c-cache').checked, downloads: $('#c-downloads').checked });
  $('#clearStatus').textContent = 'Done.';
};
load().then(() => { if (location.hash === '#clear') $('#clear').scrollIntoView(); });
