/* ==========================================================================
   Manuel's Taco Clicker v2 — engine and UI
   Three lives joined by rebirths: Taco Life -> Depop Life -> Empire Life.
   Vanilla JS, no build step. Reads DATA from data.js.
   ========================================================================== */
(() => {
'use strict';

/* ---------- constants ---------- */
const C = Object.freeze({
  LOGIC_MS: 50, RENDER_MS: 100, MAX_STEP_MS: 5 * 60 * 1000, OFFLINE_MIN_MS: 60 * 1000,
  GOLDEN_RANGE_S: [150, 420], FIRST_GOLDEN_S: [45, 75], GOLDEN_STAY_S: 13, GOLDEN_MIN_S: 30,
  PARTICLE_CAP: 420, FLOAT_CAP: 24, TOAST_MAX: 3, TOAST_MS: 4200, STORM_CAP: 40,
  MAX_OWNED: 5000, MAX_BULK: 10000, BANK_CAP: 1e300, AUTOSAVE_MS: 30000, NEWS_MS: 10000,
  SAVE_KEY: 'manuelTaco.save.v2', OLD_SAVE_KEY: 'manuelTaco.save.v1', BACKUP_KEY: 'manuelTaco.save.corrupt', TEST_KEY: 'mtcTest',
  HYPE_MAX: 100, OFFLINE_RATE: 0.6, OFFLINE_CAP_H: 10, PLATE_AFTER_MS: 4 * 3600 * 1000,
  TACO_EXCLUSION_PX: 190, COMBO_WINDOW_MS: 650, COMBO_MAX: 40, CRIT_CHANCE: 0.07, CRIT_MULT: 10,
});
const G = DATA.costGrowth;
const SUFFIX_LONG = ['', ' thousand', ' million', ' billion', ' trillion', ' quadrillion', ' quintillion', ' sextillion', ' septillion', ' octillion', ' nonillion', ' decillion'];
const SUFFIX_SHORT = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

/* ---------- clock ---------- */
let clockOffset = 0;
const now = () => Date.now() + clockOffset;

/* ---------- utils ---------- */
const $ = (id) => document.getElementById(id);
const clamp = (x, lo, hi) => Math.min(Math.max(x, lo), hi);
const rand = (lo, hi) => lo + Math.random() * (hi - lo);
const randInt = (lo, hi) => Math.floor(rand(lo, hi + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const svgIcon = (name, cls = 'icon') => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('class', cls); s.setAttribute('aria-hidden', 'true'); const u = document.createElementNS('http://www.w3.org/2000/svg', 'use'); u.setAttribute('href', '#i-' + name); s.appendChild(u); return s; };
const setText = (node, text) => { if (node && node.__t !== text) { node.__t = text; node.textContent = text; } };
const setClass = (node, cls, on) => { if (node && node.classList.contains(cls) !== !!on) node.classList.toggle(cls, !!on); };
const isNum = (x) => typeof x === 'number' && Number.isFinite(x);
const sane = (x, lo = 0, hi = C.BANK_CAP, dflt = 0) => (isNum(x) ? clamp(x, lo, hi) : dflt);
const saneInt = (x, lo, hi, dflt = 0) => Math.floor(sane(x, lo, hi, dflt));
const coarsePointer = () => window.matchMedia && window.matchMedia('(hover: none)').matches;
const reducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fxOn = () => S && S.opts.particles && !reducedMotion();

function fmt(n, opts = {}) {
  if (!isNum(n)) return '0';
  const sign = n < 0 ? '-' : '';
  n = Math.abs(n);
  const short = opts.short != null ? opts.short : (S && S.opts.shortNumbers);
  const decimals = opts.decimals;
  if (n < 1000) {
    const r = decimals != null ? Number(n.toFixed(decimals)) : Math.round(n * 10) / 10;
    if (r < 1000) return sign + (Number.isInteger(r) ? r.toLocaleString('en-US') : r.toLocaleString('en-US', { minimumFractionDigits: decimals != null ? decimals : 1, maximumFractionDigits: decimals != null ? decimals : 1 }));
    n = r;
  }
  if (Math.round(n) < 1e6) return sign + Math.round(n).toLocaleString('en-US');
  let exp = Math.floor(Math.log10(n) / 3);
  let mant = n / Math.pow(10, exp * 3);
  const digitsFor = (m) => (short ? (m >= 99.95 ? 0 : m >= 9.995 ? 1 : 2) : 3);
  let digits = digitsFor(mant);
  if (Number(mant.toFixed(digits)) >= 1000) { exp += 1; mant = n / Math.pow(10, exp * 3); digits = digitsFor(mant); }
  if (exp >= SUFFIX_LONG.length) return sign + n.toExponential(2).replace('e+', 'e');
  return sign + mant.toFixed(digits) + (short ? SUFFIX_SHORT[exp] : SUFFIX_LONG[exp]);
}
const money = (n, opts) => (n < 0 ? '-$' + fmt(-n, opts) : '$' + fmt(n, opts));
const moneyRate = (n) => money(n, { decimals: n < 10 ? 1 : undefined }) + '/s';
function fmtTime(ms) { ms = Math.max(0, ms); const s = Math.floor(ms / 1000); if (s < 60) return s + 's'; const m = Math.floor(s / 60), h = Math.floor(m / 60), d = Math.floor(h / 24); if (d > 0) return d + 'd ' + (h % 24) + 'h'; if (h > 0) return h + 'h ' + (m % 60) + 'm'; return m + 'm ' + (s % 60) + 's'; }
function fmtClock(ms) { ms = Math.max(0, ms); const s = Math.ceil(ms / 1000); const m = Math.floor(s / 60); const h = Math.floor(m / 60); const pad = (x) => String(x).padStart(2, '0'); return h > 0 ? h + ':' + pad(m % 60) + ':' + pad(s % 60) : m + ':' + pad(s % 60); }
function b64encode(str) { return btoa(unescape(encodeURIComponent(str))); }
function b64decode(str) { return decodeURIComponent(escape(atob(str))); }

/* ---------- storage ---------- */
const store = (() => { try { const k = '__mtc_probe'; localStorage.setItem(k, '1'); localStorage.removeItem(k); return localStorage; } catch (e) { return null; } })();
let storageFailed = !store, storageWarned = false;
function storeGet(k) { try { return store ? store.getItem(k) : null; } catch (e) { return null; } }
function storeSet(k, v) { try { if (!store) throw new Error('no storage'); store.setItem(k, v); return true; } catch (e) { storageFailed = true; return false; } }

/* ---------- derived data ---------- */
const LIVES = DATA.lives;
const P = DATA.producers;
const PID = {}; P.forEach((p, i) => { PID[p.id] = p; p.index = i; });
const CH = DATA.chapters; // 12 chapters, n = 1..12
const CHN = {}; CH.forEach((c) => { CHN[c.n] = c; });
const TIER_THR = DATA.tierThresholds;
const OPEN_TIERS = 14;
const UPG = []; const UPGID = {};
function addUpgrade(u) { UPG.push(u); UPGID[u.id] = u; }
function plural(n) { if (/ss$/.test(n)) return n + 'es'; if (/[^aeiou]y$/.test(n)) return n.slice(0, -1) + 'ies'; return n.endsWith('s') ? n : n + 's'; }
P.forEach((p) => {
  p.tiers.forEach((t, i) => addUpgrade({ id: p.id + '_t' + (i + 1), name: t.name, flavor: t.flavor, cost: p.cost * DATA.tierCostMult[i], icon: p.icon, kind: 'tier', producer: p.id, tier: i + 1, threshold: TIER_THR[i], desc: plural(p.name) + ' are twice as efficient.' }));
  for (let k = 7; k <= 6 + OPEN_TIERS; k++) addUpgrade({ id: p.id + '_t' + k, name: p.name + ' Level ' + k, flavor: 'Manuel has stopped asking how. Abuela never asked.', cost: p.cost * DATA.tierCostMult[5] * Math.pow(10, k - 6), icon: p.icon, kind: 'tier', producer: p.id, tier: k, threshold: 150 + 50 * (k - 7), desc: plural(p.name) + ' are twice as efficient.' });
});
DATA.upgrades.forEach((u) => addUpgrade(Object.assign({}, u)));
DATA.synergies.forEach((s) => addUpgrade({ id: s.id, name: s.name, flavor: s.flavor, cost: PID[s.a].cost * 25, icon: s.icon || PID[s.b].icon, kind: 'synergy', a: s.a, b: s.b, pct: s.pct, desc: PID[s.a].name + ' +' + Math.round(s.pct * 100) + '% per ' + PID[s.b].name + ' owned.' }));
const RECIPES = DATA.recipes; const RID = {}; RECIPES.forEach((r) => { RID[r.id] = r; });
const ACH = DATA.achievements; const ACHID = {}; ACH.forEach((a) => { ACHID[a.id] = a; });
const GOLDEN = DATA.golden;
const SKINS = DATA.skins;

/* ---------- state ---------- */
let S = null;
function freshState(keep) {
  const t = now();
  const s = {
    v: DATA.version, t, created: t,
    bank: 0, lifetime: 0, lifetimeAll: 0, producerCash: 0, clicks: 0, clicksRun: 0,
    life: 1, chapter: 1, rebirths: 0, clout: 0,
    producers: {}, upgrades: [], menuItems: 0,
    buffs: [], golden: { nextAt: t + randInt(C.FIRST_GOLDEN_S[0], C.FIRST_GOLDEN_S[1]) * 1000, active: null, clicked: 0, missed: 0, streak: 0 },
    hustle: { slots: [null, null, null], hype: 0, sales: 0, viral: 0, flops: 0, best: 0, earned: 0, lastItem: null },
    seenStory: [], journal: [], firstBuys: [],
    salsa: 0, salsaSpent: 0, recipes: [], runs: 1, prestiges: 0,
    ach: [], skin: 'classic', skins: ['classic'],
    stats: { playMs: 0, goldenClicked: 0, goldenMissed: 0, bestCps: 0, bestStreak: 0, clicksAll: 0, stormTacos: 0, offlineEarned: 0, upgradesBought: 0, salsaAll: 0, crits: 0, bestCombo: 0, rebirthsAll: 0 },
    opts: { sound: false, particles: true, shortNumbers: false, tips: true, shake: true },
    tut: { clicks: 0, bought: false },
  };
  P.forEach((p) => { s.producers[p.id] = 0; });
  if (keep) Object.assign(s, keep);
  return s;
}
function sanitize(raw) {
  const s = freshState();
  if (!raw || typeof raw !== 'object') return s;
  const t = now();
  if (raw.v !== DATA.version) { // older layout: keep only options and achievements
    if (raw.opts && typeof raw.opts === 'object') Object.keys(s.opts).forEach((k) => { if (typeof raw.opts[k] === 'boolean') s.opts[k] = raw.opts[k]; });
    if (Array.isArray(raw.ach)) s.ach = [...new Set(raw.ach.filter((id) => ACHID[id]))];
    return s;
  }
  s.t = sane(raw.t, 0, t + 60000, t); s.created = sane(raw.created, 0, t, s.t);
  s.bank = sane(raw.bank); s.lifetime = sane(raw.lifetime); s.lifetimeAll = Math.max(sane(raw.lifetimeAll), s.lifetime);
  s.producerCash = sane(raw.producerCash); s.clicks = saneInt(raw.clicks, 0, 1e15); s.clicksRun = saneInt(raw.clicksRun, 0, 1e15);
  s.life = saneInt(raw.life, 1, LIVES.length, 1); s.rebirths = saneInt(raw.rebirths, 0, 1e6); s.clout = saneInt(raw.clout, 0, 1e6);
  const lifeCh = LIVES[s.life - 1].chapters; s.chapter = saneInt(raw.chapter, lifeCh[0], lifeCh[lifeCh.length - 1], lifeCh[0]);
  if (raw.producers && typeof raw.producers === 'object') P.forEach((p) => { s.producers[p.id] = saneInt(raw.producers[p.id], 0, C.MAX_OWNED); });
  if (Array.isArray(raw.upgrades)) s.upgrades = [...new Set(raw.upgrades.filter((id) => typeof id === 'string' && UPGID[id]))];
  s.menuItems = saneInt(raw.menuItems, 0, 1000);
  if (Array.isArray(raw.buffs)) s.buffs = raw.buffs.filter((b) => b && typeof b === 'object' && typeof b.id === 'string' && isNum(b.endsAt) && b.endsAt > t && isNum(b.mult)).map((b) => ({ id: String(b.id).slice(0, 32), kind: ['income', 'click', 'storm'].includes(b.kind) ? b.kind : 'income', mult: sane(b.mult, 1, 1e6, 1), endsAt: Math.min(b.endsAt, t + 3600 * 1000), name: typeof b.name === 'string' ? b.name.slice(0, 40) : b.id }));
  if (raw.golden && typeof raw.golden === 'object') {
    s.golden.nextAt = sane(raw.golden.nextAt, 0, t + 3600 * 1000, s.golden.nextAt);
    s.golden.clicked = saneInt(raw.golden.clicked, 0, 1e9); s.golden.missed = saneInt(raw.golden.missed, 0, 1e9); s.golden.streak = saneInt(raw.golden.streak, 0, 1e6);
    const ra = raw.golden.active;
    if (ra && typeof ra === 'object' && GOLDEN.some((g) => g.id === ra.effect) && isNum(ra.expiresAt) && ra.expiresAt > t) s.golden.active = { effect: ra.effect, spawnedAt: sane(ra.spawnedAt, 0, t, t), expiresAt: Math.min(ra.expiresAt, t + C.GOLDEN_STAY_S * 4 * 1000), x: sane(ra.x, 0.05, 0.95, 0.5), y: sane(ra.y, 0.05, 0.95, 0.5) };
    else if (ra || s.golden.nextAt < t) s.golden.nextAt = t + randInt(30, 90) * 1000;
  }
  if (raw.hustle && typeof raw.hustle === 'object') {
    const d = raw.hustle; const items = hustleItemsFor(s.life); const n = Array.isArray(d.slots) ? d.slots : [];
    s.hustle.slots = n.slice(0, 4).map((sl) => { if (!sl || typeof sl !== 'object' || !items.some((i) => i.id === sl.item)) return null; return { item: sl.item, startedAt: sane(sl.startedAt, 0, t, t), readyAt: sane(sl.readyAt, 0, t + 24 * 3600 * 1000, t), payout: sane(sl.payout), cost: sane(sl.cost), viral: !!sl.viral, flop: !!sl.flop }; });
    while (s.hustle.slots.length < 3) s.hustle.slots.push(null);
    s.hustle.hype = sane(d.hype, 0, C.HYPE_MAX); s.hustle.sales = saneInt(d.sales, 0, 1e9); s.hustle.viral = saneInt(d.viral, 0, 1e9); s.hustle.flops = saneInt(d.flops, 0, 1e9);
    s.hustle.best = sane(d.best); s.hustle.earned = sane(d.earned); s.hustle.lastItem = items.some((i) => i.id === d.lastItem) ? d.lastItem : null;
  }
  if (Array.isArray(raw.seenStory)) s.seenStory = raw.seenStory.filter((n) => Number.isInteger(n) && n >= 1 && n <= CH.length);
  if (Array.isArray(raw.journal)) s.journal = raw.journal.filter((j) => j && typeof j.id === 'string' && isNum(j.t)).slice(-200).map((j) => ({ id: j.id.slice(0, 40), t: j.t }));
  if (Array.isArray(raw.firstBuys)) s.firstBuys = [...new Set(raw.firstBuys.filter((id) => PID[id]))];
  s.salsa = saneInt(raw.salsa, 0, 1e9); s.salsaSpent = saneInt(raw.salsaSpent, 0, s.salsa);
  if (Array.isArray(raw.recipes)) s.recipes = [...new Set(raw.recipes.filter((id) => RID[id]))];
  s.runs = saneInt(raw.runs, 1, 1e6, 1); s.prestiges = saneInt(raw.prestiges, 0, 1e6);
  if (Array.isArray(raw.ach)) s.ach = [...new Set(raw.ach.filter((id) => ACHID[id]))];
  if (Array.isArray(raw.skins)) s.skins = [...new Set(['classic'].concat(raw.skins.filter((id) => SKINS.some((k) => k.id === id))))];
  s.skin = s.skins.includes(raw.skin) ? raw.skin : 'classic';
  if (raw.stats && typeof raw.stats === 'object') Object.keys(s.stats).forEach((k) => { s.stats[k] = sane(raw.stats[k], 0, 1e300); });
  if (raw.opts && typeof raw.opts === 'object') Object.keys(s.opts).forEach((k) => { if (typeof raw.opts[k] === 'boolean') s.opts[k] = raw.opts[k]; });
  if (raw.tut && typeof raw.tut === 'object') { s.tut.clicks = saneInt(raw.tut.clicks, 0, 1000); s.tut.bought = !!raw.tut.bought; }
  if (P.some((p) => s.producers[p.id] > 0)) { s.tut.bought = true; s.tut.clicks = Math.max(s.tut.clicks, 5); }
  return s;
}

let lastSaveAt = 0, saveTimer = null;
function serialize() { S.t = now(); return JSON.stringify(S); }
function save(manual) {
  if (!S) return false;
  const ok = storeSet(C.SAVE_KEY, serialize()); lastSaveAt = now();
  if (manual && ok) toast({ title: 'Saved', text: 'Abuela wrote it in the notebook.', icon: 'check', cls: 'lime', ms: 1800 });
  if (!ok && !storageWarned) { storageWarned = true; toast({ title: 'Saving is off', text: DATA.ui.storageOff, icon: 'info', ms: 8000 }); }
  return ok;
}
function saveSoon() { if (saveTimer) return; saveTimer = setTimeout(() => { saveTimer = null; save(false); }, 1000); }
function load() {
  const raw = storeGet(C.SAVE_KEY) || storeGet(C.OLD_SAVE_KEY);
  if (!raw) return null;
  try { return sanitize(JSON.parse(raw)); } catch (e) { storeSet(C.BACKUP_KEY, raw); return null; }
}
function exportSave() { return b64encode(serialize()); }
function importSave(str) {
  let obj;
  try { obj = JSON.parse(b64decode(String(str).trim())); } catch (e) { try { obj = JSON.parse(String(str).trim()); } catch (e2) { return false; } }
  if (!obj || typeof obj !== 'object' || !obj.producers) return false;
  S = sanitize(obj); storyQueue.length = 0; endStorm(); removeGoldenEl();
  applyOffline(true); rebuildAll(); save(false); return true;
}

/* ---------- economy ---------- */
let upgSet = new Set();
function syncUpgSet() { upgSet = new Set(S.upgrades); }
const has = (id) => { if (upgSet.size !== S.upgrades.length) syncUpgSet(); return upgSet.has(id); };
const hasRecipe = (id) => S.recipes.includes(id);
const life = () => LIVES[S.life - 1];
const lifeScale = () => life().scale;
const cloutMult = () => Math.pow(2, S.clout);
function tiersOwned(pid) { let n = 0; for (let k = 1; k <= 6 + OPEN_TIERS; k++) if (has(pid + '_t' + k)) n++; return n; }
function producerMult(pid) {
  let m = Math.pow(2, tiersOwned(pid));
  for (const syn of DATA.synergies) if (syn.a === pid && has(syn.id)) m *= 1 + syn.pct * S.producers[syn.b];
  return m;
}
/* Businesses from earlier lives keep running under Diego; Manuel only sees a small cut. */
function producerRate(pid) { return PID[pid].income * producerMult(pid) * (PID[pid].life < S.life ? DATA.legacyCut : 1); }
function reputation() { return S.ach.length * 0.02; }
function activeBuffMult(kind) { let m = 1; const t = now(); for (const b of S.buffs) if (b.kind === kind && b.endsAt > t) m *= b.mult; return m; }
function incomeLayers(withBuffs = true) {
  const L = [];
  const chapterIdx = life().chapters.indexOf(S.chapter);
  const eraMult = 1 + DATA.eraBonus * chapterIdx; if (eraMult !== 1) L.push({ label: 'Chapter ' + S.chapter + ': ' + CHN[S.chapter].name, mult: eraMult });
  if (S.clout > 0) L.push({ label: 'Clout (' + S.rebirths + ' rebirth' + (S.rebirths === 1 ? '' : 's') + ')', mult: cloutMult() });
  for (const u of UPG) if (u.kind === 'global' && has(u.id)) L.push({ label: u.name, mult: 1 + u.effect.globalMult });
  const repK = UPG.filter((u) => u.kind === 'rep' && has(u.id)).reduce((a, u) => a + u.effect.repMult, 0);
  if (repK > 0) L.push({ label: 'Reputation ' + Math.round(reputation() * 100) + '% (' + S.ach.length + ' achievements)', mult: 1 + (reputation() / 0.1) * repK });
  if (S.salsa > 0) L.push({ label: 'Salsa Points (' + S.salsa + ')', mult: 1 + 0.05 * S.salsa });
  for (const r of RECIPES) if (hasRecipe(r.id) && r.effect.globalMult) L.push({ label: r.name, mult: 1 + r.effect.globalMult });
  if (S.menuItems > 0) L.push({ label: 'New Menu Items (' + S.menuItems + ')', mult: Math.pow(1 + DATA.menuItem.bonus, S.menuItems) });
  if (withBuffs) {
    if (S.hustle.hype > 0.5) L.push({ label: 'Hype ' + Math.round(S.hustle.hype) + '%', mult: 1 + S.hustle.hype / 200 });
    const t = now(); for (const b of S.buffs) if (b.kind === 'income' && b.endsAt > t) L.push({ label: b.name, mult: b.mult });
  }
  return L;
}
let frameId = 0; const gmCache = { frame: -1, on: 0, off: 0 };
function globalMult(withBuffs = true) {
  if (gmCache.frame !== frameId) { gmCache.frame = frameId; gmCache.on = incomeLayers(true).reduce((m, l) => m * l.mult, 1); gmCache.off = incomeLayers(false).reduce((m, l) => m * l.mult, 1); }
  return withBuffs ? gmCache.on : gmCache.off;
}
function producerCps(pid, withBuffs = true) { return S.producers[pid] * producerRate(pid) * globalMult(withBuffs); }
function cps(withBuffs = true) { let sum = 0; for (const p of P) if (S.producers[p.id] > 0) sum += S.producers[p.id] * producerRate(p.id); return sum * globalMult(withBuffs); }
function clickLayers() {
  const L = []; let mult = lifeScale().click * cloutMult(), pct = 0;
  if (lifeScale().click !== 1) L.push({ label: life().name + ' base', mult: lifeScale().click });
  if (S.clout > 0) L.push({ label: 'Clout', mult: cloutMult() });
  for (const u of UPG) if (u.kind === 'click' && has(u.id)) { if (u.effect.clickMult) { mult *= u.effect.clickMult; L.push({ label: u.name, mult: u.effect.clickMult }); } if (u.effect.clickPct) pct += u.effect.clickPct; }
  for (const r of RECIPES) if (hasRecipe(r.id) && r.effect.clickMult) { mult *= r.effect.clickMult; L.push({ label: r.name, mult: r.effect.clickMult }); }
  const buff = activeBuffMult('click'); if (buff !== 1) L.push({ label: 'Click Fiesta', mult: buff });
  const combo = comboMult(); if (combo > 1.001) L.push({ label: DATA.combo.meterName + ' combo', mult: combo });
  return { layers: L, mult, pct, buff, combo };
}
function clickValue(withCombo = true) { const c = clickLayers(); return (1 + c.pct * cps() / (lifeScale().click * cloutMult())) * c.mult * c.buff * (withCombo ? c.combo : 1); }
function costMult() { return hasRecipe('playbook') ? RID.playbook.effect.costMult : 1; }
function unitCost(pid, owned = S.producers[pid]) { return Math.ceil(PID[pid].cost * costMult() * Math.pow(G, owned)); }
function bulkCost(pid, k, owned = S.producers[pid]) { if (k <= 0) return 0; return Math.ceil(PID[pid].cost * costMult() * Math.pow(G, owned) * (Math.pow(G, k) - 1) / (G - 1)); }
function maxAffordable(pid, cash = S.bank) {
  const owned = S.producers[pid]; const base = PID[pid].cost * costMult() * Math.pow(G, owned);
  if (!isNum(base) || base <= 0 || cash < base) return 0;
  let k = Math.floor(Math.log(cash * (G - 1) / base + 1) / Math.log(G));
  k = clamp(k, 0, Math.min(C.MAX_BULK, C.MAX_OWNED - owned));
  while (k < C.MAX_OWNED - owned && bulkCost(pid, k + 1, owned) <= cash) k++;
  while (k > 0 && bulkCost(pid, k, owned) > cash) k--;
  return k;
}
function sellRefund(pid, k) { const owned = S.producers[pid]; k = Math.min(k, owned); if (k <= 0) return 0; return Math.floor(bulkCost(pid, k, owned - k) * DATA.sellRefund); }
/* Generic (non-tier) upgrades are priced for life 1; later lives scale them. */
function upgradeCost(u) { if (u.kind === 'tier' || u.kind === 'synergy') return u.cost; return u.cost * lifeScale().cost; }
function menuItemCost() { return DATA.menuItem.baseCost * lifeScale().cost * Math.pow(DATA.menuItem.costMult, S.menuItems); }
function producerInLife(p) { return p.life === S.life; }
function producerVisible(p) { return producerInLife(p) && (S.producers[p.id] > 0 || (S.chapter >= p.chapter - 1 && Math.max(S.lifetime, S.bank) >= p.cost * 0.4)); }
function upgradeUnlocked(u) {
  if (u.kind === 'tier') return S.producers[u.producer] >= u.threshold && PID[u.producer].life <= S.life;
  if (u.kind === 'synergy') return S.producers[u.a] >= 15 && S.producers[u.b] >= 15;
  if (u.kind === 'rep') return S.ach.length >= u.unlock.achievements;
  if (u.kind === 'depop') return S.life >= 2 && hustleUnlocked();
  return S.lifetime >= (u.unlock.lifetime || 0) * lifeScale().income;
}
function hustleUnlocked() { return S.chapter >= life().hustle.unlockChapter || hasRecipe('viral'); }
function hustleItemsFor(lifeN) { return LIVES[lifeN - 1].hustle.items; }
function hustleSlotCount() { return 3 + (has('depop_bulk') ? 1 : 0); }
function goldenFreqMult() { let m = 1; for (const u of UPG) if (u.kind === 'golden' && has(u.id) && u.effect.goldenFreq) m *= u.effect.goldenFreq; if (hasRecipe('palate')) m *= RID.palate.effect.goldenFreq; return m; }
function goldenStayMult() { let m = 1; for (const u of UPG) if (u.kind === 'golden' && has(u.id) && u.effect.goldenStay) m *= u.effect.goldenStay; if (hasRecipe('legend')) m *= RID.legend.effect.goldenStay; return m; }
function goldenDurMult() { let m = 1; for (const u of UPG) if (u.kind === 'golden' && has(u.id) && u.effect.goldenDur) m *= u.effect.goldenDur; return m; }
function offlineSettings() { let rate = C.OFFLINE_RATE, cap = C.OFFLINE_CAP_H; if (has('offline_prep')) { rate = Math.max(rate, 0.8); cap = Math.max(cap, 14); } if (hasRecipe('overnight')) { rate = 1; cap = 24; } return { rate, capMs: cap * 3600 * 1000 }; }
function tacosSold() { return S.clicks + Math.floor(S.producerCash / DATA.tacoPrice); }
function pendingSalsa() { return Math.max(0, Math.floor(Math.cbrt(S.lifetimeAll / 1e12)) - S.salsa); }
function nextSalsaAt() { return Math.pow(S.salsa + pendingSalsa() + 1, 3) * 1e12; }
/* Rebirth readiness: last chapter of the life reached and enough earned this life. */
function rebirthTarget() { return life().rebirthAt; }
function rebirthReady() { const ch = life().chapters; return S.chapter >= ch[ch.length - 1] && S.lifetime >= rebirthTarget(); }
function nextLifeIndex() { return S.life < LIVES.length ? S.life + 1 : 1; }

/* ---------- purchases ---------- */
const dirty = { shop: true, scene: true, journey: true, hustle: true, journal: true };
function earn(amount, fromProducers) {
  if (!isNum(amount) || amount <= 0) return;
  S.bank = Math.min(S.bank + amount, C.BANK_CAP); S.lifetime += amount; S.lifetimeAll += amount;
  if (fromProducers) S.producerCash += amount;
}
function buyProducer(pid, amount) {
  const p = PID[pid]; if (!p || !producerVisible(p)) return 0;
  const owned = S.producers[pid];
  const k = amount === 'max' ? maxAffordable(pid) : Math.min(amount, C.MAX_OWNED - owned);
  if (k <= 0) return 0;
  const cost = bulkCost(pid, k, owned); if (cost > S.bank) return 0;
  S.bank -= cost; S.producers[pid] = owned + k;
  if (!S.firstBuys.includes(pid)) { S.firstBuys.push(pid); journalAdd('first_' + pid); if (S.firstBuys.length > 1) toast({ kicker: 'New business', title: p.name, text: p.desc, icon: p.icon, cls: 'gold' }); }
  S.tut.bought = true;
  afterPurchase(); return k;
}
function sellProducer(pid, amount) {
  const owned = S.producers[pid]; if (owned <= 0) return 0;
  const k = Math.min(amount === 'max' ? owned : amount, owned); const refund = sellRefund(pid, k);
  S.producers[pid] = owned - k; S.bank = Math.min(S.bank + refund, C.BANK_CAP);
  afterPurchase(); return k;
}
function buyUpgrade(id) {
  const u = UPGID[id]; if (!u || has(id) || !upgradeUnlocked(u)) return false;
  const cost = upgradeCost(u); if (S.bank < cost) return false;
  S.bank -= cost; S.upgrades.push(id); S.stats.upgradesBought++;
  if (u.effect && u.effect.dropSlots) { while (S.hustle.slots.length < hustleSlotCount()) S.hustle.slots.push(null); dirty.hustle = true; }
  afterPurchase(); return true;
}
function buyMenuItem() { const c = menuItemCost(); if (S.bank < c) return false; S.bank -= c; S.menuItems++; S.stats.upgradesBought++; afterPurchase(); return true; }
function buyRecipe(id) {
  const r = RID[id]; if (!r || hasRecipe(id)) return false;
  if (S.salsa - S.salsaSpent < r.cost) return false;
  S.salsaSpent += r.cost; S.recipes.push(id); if (r.effect.depopStart) dirty.hustle = true;
  afterPurchase(); return true;
}
function afterPurchase() { syncUpgSet(); frameId++; dirty.shop = true; dirty.journey = true; checkChapter(); checkAchievements(); saveSoon(); }

/* ---------- rebirth ---------- */
function rebirth() {
  if (!rebirthReady()) return false;
  const toLife = nextLifeIndex(); const legend = toLife === 1;
  storyQueue.length = 0;
  const rb = DATA.rebirths[legend ? 2 : S.life - 1];
  let gainSalsa = 0;
  if (legend) gainSalsa = pendingSalsa();
  const keep = {
    created: S.created, lifetimeAll: S.lifetimeAll, producerCash: S.producerCash, clicks: S.clicks,
    life: toLife, chapter: LIVES[toLife - 1].chapters[0], rebirths: S.rebirths + 1, clout: S.clout + 1,
    producers: legend ? undefined : Object.assign({}, S.producers),
    upgrades: legend ? [] : S.upgrades.filter((id) => UPGID[id] && (UPGID[id].kind === 'tier' || UPGID[id].kind === 'synergy')),
    salsa: S.salsa + gainSalsa, salsaSpent: S.salsaSpent, recipes: S.recipes.slice(), runs: S.runs + (legend ? 1 : 0), prestiges: S.prestiges + (legend ? 1 : 0),
    ach: S.ach.slice(), skins: S.skins.slice(), skin: S.skin, stats: Object.assign({}, S.stats), opts: Object.assign({}, S.opts),
    journal: S.journal.slice(), tut: { clicks: 99, bought: true }, seenStory: legend ? [] : S.seenStory.slice(),
  };
  if (keep.producers === undefined) delete keep.producers;
  keep.stats.rebirthsAll = (keep.stats.rebirthsAll || 0) + 1; keep.stats.salsaAll = keep.salsa;
  S = freshState(keep);
  const newLife = LIVES[toLife - 1];
  S.bank = newLife.startCash * (hasRecipe('headstart') ? 4 : 1);
  if (!S.skins.includes(newLife.skin)) S.skins.push(newLife.skin);
  S.skin = newLife.skin;
  journalAdd(rb.id + '_' + S.rebirths);
  endStorm(); removeGoldenEl();
  save(false); rebuildAll();
  toast({ kicker: rb.kicker, title: rb.title, text: rb.toast + (gainSalsa ? ' +' + gainSalsa + ' Salsa Points.' : ''), icon: 'sun', cls: 'berry', ms: 6000 });
  checkAchievements();
  queueStory(S.chapter);
  return true;
}
function hardReset() { storyQueue.length = 0; S = freshState(); endStorm(); removeGoldenEl(); save(false); rebuildAll(); queueStory(1); }

/* ---------- buffs ---------- */
function addBuff(id, kind, mult, seconds, name) {
  const t = now(); const endsAt = t + seconds * 1000;
  const ex = S.buffs.find((b) => b.id === id);
  if (ex) ex.endsAt = Math.max(ex.endsAt, endsAt); else S.buffs.push({ id, kind, mult, endsAt, name });
  dirty.journey = true; frameId++;
}
function pruneBuffs() { const t = now(); const n = S.buffs.length; S.buffs = S.buffs.filter((b) => b.endsAt > t); if (S.buffs.length !== n) { dirty.journey = true; frameId++; } syncStorm(); }
function syncStorm() { const live = S.buffs.some((b) => b.kind === 'storm' && b.endsAt > now()); if (live && !stormOn) startStorm(); else if (!live && stormOn) endStorm(); }

/* ---------- combo ("Sizzle") ---------- */
const combo = { count: 0, lastAt: 0, tier: 0 };
function comboMult() { return 1 + Math.min(combo.count, C.COMBO_MAX) / C.COMBO_MAX; }
function comboTier() { const f = Math.min(combo.count, C.COMBO_MAX) / C.COMBO_MAX; return f >= 1 ? 4 : f >= 0.6 ? 3 : f >= 0.3 ? 2 : f > 0 ? 1 : 0; }
function comboTick(ms) {
  if (combo.count <= 0) return;
  if (now() - combo.lastAt > 1100) { combo.count = Math.max(0, combo.count - Math.ceil(ms / 60)); }
  const tier = comboTier(); if (tier !== combo.tier) { combo.tier = tier; onComboTier(tier); }
}
function onComboTier(tier) { const btn = $('tacoBtn'); setClass(btn, 'hot', tier >= 3); setClass(btn, 'onfire', tier >= 4); if (tier >= 4) { FX.embers = true; chime(1568, 0); chime(1975, 0.1); } else FX.embers = false; }

/* ---------- simulation ---------- */
let lastTick = 0, acc = 0, secondAcc = 0;
function loop() {
  if (!S) return;
  const t = now(); const dt = t - lastTick; lastTick = t;
  if (dt <= 0) return;
  if (dt > C.MAX_STEP_MS) {
    acc = 0; for (let i = 0; i < C.MAX_STEP_MS / 1000; i++) step(1000);
    const rest = dt - C.MAX_STEP_MS; if (rest >= C.OFFLINE_MIN_MS) applyOffline(false, rest); else lastTick = now();
    return;
  }
  acc += dt;
  const stepMs = dt > 2000 ? 1000 : C.LOGIC_MS; let guard = 0;
  while (acc >= stepMs && guard++ < 100000) { step(stepMs); acc -= stepMs; }
}
function step(ms) {
  frameId++;
  const rate = cps();
  earn(rate * ms / 1000, true);
  S.stats.playMs += ms;
  if (rate > S.stats.bestCps) S.stats.bestCps = rate;
  pruneBuffs(); goldenTick(); stormTick(ms); hustleTick(ms); comboTick(ms);
  secondAcc += ms;
  if (secondAcc >= 1000) { secondAcc = 0; checkChapter(); checkAchievements(); if (now() - lastSaveAt > C.AUTOSAVE_MS) save(false); }
}
function applyOffline(fromLoad, dtOverride) {
  syncUpgSet(); frameId++;
  const t = now(); const elapsedRaw = dtOverride != null ? dtOverride : t - S.t;
  const { rate, capMs } = offlineSettings(); const elapsed = clamp(elapsedRaw, 0, capMs);
  lastTick = t; acc = 0;
  S.buffs = S.buffs.filter((b) => b.endsAt > t); syncStorm();
  if (elapsed < C.OFFLINE_MIN_MS) return;
  const income = cps(false) * rate * elapsed / 1000;
  earn(income, true); S.stats.offlineEarned += income;
  S.hustle.hype = Math.max(0, S.hustle.hype - elapsed / 1000 / DATA.hypeDecayPer);
  if (S.golden.nextAt < t) S.golden.nextAt = t + randInt(10, 30) * 1000;
  if (S.golden.active) { S.golden.active = null; removeGoldenEl(); }
  if (elapsedRaw >= C.PLATE_AFTER_MS) addBuff('plate', 'income', 2, 300, 'Abuela saved you a plate');
  if (income > 0 || fromLoad) toast({ title: 'While you were away', text: DATA.ui.offlineToast.replace('{time}', fmtTime(elapsed)).replace('{amount}', money(income)), icon: 'moon', ms: 7000 });
  dirty.shop = dirty.journey = dirty.hustle = true; frameId++;
  checkChapter(); checkAchievements();
}

/* ---------- golden tacos ---------- */
let goldenEl = null;
function goldenInterval() { return Math.max(C.GOLDEN_MIN_S, randInt(C.GOLDEN_RANGE_S[0], C.GOLDEN_RANGE_S[1]) / goldenFreqMult()) * 1000; }
function pickGoldenEffect() {
  const pool = GOLDEN.filter((g) => !g.minChapter || S.chapter >= g.minChapter || S.life > 1);
  const total = pool.reduce((a, g) => a + g.weight, 0); let r = Math.random() * total;
  for (const g of pool) { r -= g.weight; if (r <= 0) return g; }
  return pool[0];
}
function goldenTick() {
  const t = now(); const g = S.golden;
  if (g.active) {
    if (t >= g.active.expiresAt) { g.active = null; g.streak = 0; g.missed++; S.stats.goldenMissed++; removeGoldenEl(); g.nextAt = t + goldenInterval(); updateTitle(); }
    else if (goldenEl && !goldenEl.classList.contains('fading') && g.active.expiresAt - t < 1000) goldenEl.classList.add('fading');
    return;
  }
  if (t >= g.nextAt && !modalOpen() && !cinematicOpen()) spawnGolden();
}
function spawnGolden(effectId) {
  const t = now(); const eff = (effectId && GOLDEN.find((x) => x.id === effectId)) || pickGoldenEffect();
  const stay = C.GOLDEN_STAY_S * goldenStayMult() * 1000; const pos = goldenPosition();
  S.golden.active = { effect: eff.id, spawnedAt: t, expiresAt: t + stay, x: pos.x, y: pos.y };
  renderGolden(); updateTitle(); chime(880); chime(1108, 0.08);
}
function goldenPosition() {
  const layer = $('goldenLayer'); const rect = layer.getBoundingClientRect(); const w = rect.width, h = rect.height;
  let maxX = w - 80; const shop = $('col-shop');
  if (!isMobileLayout() && shop && window.innerWidth > 1240) { const sr = shop.getBoundingClientRect(); maxX = Math.min(maxX, sr.left - rect.left - 80); }
  const taco = $('tacoBtn').getBoundingClientRect(); const tc = { x: taco.left + taco.width / 2 - rect.left, y: taco.top + taco.height / 2 - rect.top };
  let x = 80, y = 80;
  for (let i = 0; i < 12; i++) { x = rand(80, Math.max(81, maxX)); y = rand(80, Math.max(81, h - 80)); if (Math.hypot(x - tc.x, y - tc.y) > C.TACO_EXCLUSION_PX) break; }
  return { x: x / Math.max(1, w), y: y / Math.max(1, h) };
}
function renderGolden() {
  removeGoldenEl(); const a = S.golden.active; if (!a) return;
  const b = el('button', 'golden-taco'); b.type = 'button'; b.setAttribute('aria-label', 'Golden taco! Grab it quickly');
  b.innerHTML = '<svg viewBox="0 0 240 200" aria-hidden="true"><use href="#taco"></use></svg>';
  b.style.left = 'calc(' + (a.x * 100).toFixed(2) + '% - 48px)'; b.style.top = 'calc(' + (a.y * 100).toFixed(2) + '% - 40px)';
  b.addEventListener('pointerdown', (e) => { e.preventDefault(); clickGolden(e); });
  b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clickGolden(); } });
  $('goldenLayer').appendChild(b); goldenEl = b;
}
function removeGoldenEl() { if (goldenEl) { goldenEl.remove(); goldenEl = null; } }
function clickGolden(e) {
  const a = S.golden.active; if (!a) return;
  const eff = GOLDEN.find((g) => g.id === a.effect) || GOLDEN[0];
  const r = goldenEl ? goldenEl.getBoundingClientRect() : null; const cx = r ? r.left + r.width / 2 : window.innerWidth / 2, cy = r ? r.top + r.height / 2 : window.innerHeight / 2;
  S.golden.active = null; removeGoldenEl();
  S.golden.clicked++; S.stats.goldenClicked++; S.golden.streak++; S.stats.bestStreak = Math.max(S.stats.bestStreak, S.golden.streak);
  const streakBonus = 1 + Math.min(5, S.golden.streak - 1) * 0.05;
  S.golden.nextAt = now() + goldenInterval(); const dur = goldenDurMult() * streakBonus;
  let text = eff.toast;
  if (eff.kind === 'income') addBuff(eff.id, 'income', eff.mult, eff.duration * dur, eff.name);
  else if (eff.kind === 'click') addBuff(eff.id, 'click', eff.mult, eff.duration * dur, eff.name);
  else if (eff.kind === 'storm') { addBuff('storm', 'storm', 1, eff.duration * dur, eff.name); startStorm(); }
  else if (eff.kind === 'cash') { const amt = Math.floor(Math.min(S.bank * 0.15, cps() * 900) * streakBonus) + 13 * lifeScale().click; earn(amt, false); text = eff.toast.replace('{amount}', money(amt)); floatText('+' + money(amt), null, null, true); FX.rain('bill', 40); }
  if (S.golden.clicked === 1) journalAdd('golden_first');
  FX.ring(cx, cy, '#ffd479'); FX.burst(cx, cy, 'star', 26); FX.flash('rgba(255,212,121,0.22)'); shake(4);
  toast({ kicker: 'Golden taco' + (S.golden.streak > 1 ? ' · streak ' + S.golden.streak : ''), title: eff.name, text, icon: 'star', cls: 'gold' });
  chime(1320); chime(1760, 0.12); chime(2093, 0.24);
  frameId++; updateTitle(); dirty.journey = true; checkAchievements(); saveSoon();
}

/* ---------- taco storm ---------- */
let stormOn = false, stormAcc = 0, stormEls = [];
function startStorm() { stormOn = true; stormAcc = 0; $('tacoBtn').classList.add('frenzy'); }
function endStorm() { if (!stormOn) return; stormOn = false; stormEls.forEach((e) => e.remove()); stormEls = []; $('tacoBtn').classList.remove('frenzy'); }
function stormTick(ms) {
  if (!stormOn) return; stormAcc += ms;
  if (stormAcc >= 220 && stormEls.length < C.STORM_CAP) {
    stormAcc = 0;
    const scene = $('scene'); const b = el('button', 'storm-taco'); b.type = 'button'; b.setAttribute('aria-label', 'Storm taco');
    b.innerHTML = '<svg viewBox="0 0 240 200" aria-hidden="true"><use href="#taco"></use></svg>';
    b.style.left = rand(4, 86) + '%'; b.style.top = rand(2, 70) + '%';
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); if (!b.isConnected) return; const amt = Math.max(lifeScale().click, cps() * 2); earn(amt, false); S.stats.stormTacos++; floatText('+' + money(amt), e.clientX, e.clientY); FX.burst(e.clientX, e.clientY, 'crumb', 10); chime(1100); b.remove(); stormEls = stormEls.filter((x) => x !== b); });
    scene.appendChild(b); stormEls.push(b);
    setTimeout(() => { if (b.isConnected) { b.remove(); stormEls = stormEls.filter((x) => x !== b); } }, 3200);
  }
}

/* ---------- side hustle (Catering Orders / Depop Drops / Global Launches) ---------- */
const hustleDef = () => life().hustle;
function hustleItems() { return hustleDef().items; }
function itemById(id) { return hustleItems().find((i) => i.id === id); }
function itemCost(item) { return Math.max(item.minCost, Math.ceil(item.costSeconds * cps(false))); }
function itemAvailable(item) { if (item.requires && !has(item.requires)) return false; if (item.requiresChapter && S.chapter < item.requiresChapter) return false; return true; }
function listDrop(slotIdx, itemId) {
  if (!hustleUnlocked()) return false;
  const item = itemById(itemId); if (!item || !itemAvailable(item)) return false;
  while (S.hustle.slots.length < hustleSlotCount()) S.hustle.slots.push(null);
  if (slotIdx < 0 || slotIdx >= hustleSlotCount() || S.hustle.slots[slotIdx]) return false;
  const cost = itemCost(item); if (S.bank < cost) return false;
  S.bank -= cost;
  const viralChance = has('depop_radar') ? UPGID.depop_radar.effect.viral : DATA.viralBase;
  const viral = Math.random() < viralChance; const flop = !viral && Math.random() < DATA.flopChance;
  const payout = cost * (flop ? 0.75 : item.payout) * (viral ? 2 : 1) * (has('depop_verified') ? UPGID.depop_verified.effect.dropPayout : 1);
  const t = now(); const sell = item.sellSeconds * 1000 / (has('depop_ring') ? UPGID.depop_ring.effect.dropSpeed : 1);
  S.hustle.slots[slotIdx] = { item: item.id, startedAt: t, readyAt: t + sell, payout: Math.floor(payout), cost, viral, flop };
  S.hustle.lastItem = item.id; dirty.hustle = true; saveSoon(); return true;
}
function collectDrop(slotIdx, silent) {
  const sl = S.hustle.slots[slotIdx]; if (!sl || now() < sl.readyAt) return false;
  const item = itemById(sl.item) || { name: 'Order', hype: 10 }; const H = hustleDef();
  earn(sl.payout, false); S.hustle.slots[slotIdx] = null;
  S.hustle.sales++; S.hustle.earned += sl.payout; if (sl.payout > S.hustle.best) S.hustle.best = sl.payout;
  if (sl.viral) { S.hustle.viral++; S.hustle.hype = Math.min(C.HYPE_MAX, S.hustle.hype + item.hype + 30); if (!silent) { toast({ kicker: H.viralWord, title: item.name + ' ×2', text: pick(H.buyerLines) + ' ' + money(sl.payout) + '.', icon: 'sparkle', cls: 'berry' }); FX.confetti(30); } if (S.hustle.viral === 1) journalAdd('viral_first'); }
  else if (sl.flop) { S.hustle.flops++; if (!silent) toast({ kicker: H.title, title: item.name, text: H.flopLine + ' ' + money(sl.payout) + ' back.', icon: 'shirt' }); }
  else { S.hustle.hype = Math.min(C.HYPE_MAX, S.hustle.hype + item.hype); if (!silent) toast({ kicker: H.soldWord, title: '+' + money(sl.payout), text: pick(H.buyerLines), icon: 'shirt', cls: 'lime', ms: 3000 }); }
  if (S.hustle.sales === 1) journalAdd('hustle_first_' + S.life);
  if (S.hustle.hype >= C.HYPE_MAX - 0.5) FX.burst(window.innerWidth / 2, 120, 'heart', 12);
  dirty.hustle = true; dirty.journey = true; frameId++; checkAchievements(); saveSoon(); return true;
}
function collectAll() { let n = 0; for (let i = 0; i < S.hustle.slots.length; i++) if (collectDrop(i, n > 0)) n++; return n; }
function hustleTick(ms) {
  if (S.hustle.hype > 0) S.hustle.hype = Math.max(0, S.hustle.hype - ms / 1000 / DATA.hypeDecayPer);
  if (has('depop_auto')) { const t = now(); for (let i = 0; i < S.hustle.slots.length; i++) { const sl = S.hustle.slots[i]; if (sl && t >= sl.readyAt) { const item = sl.item; collectDrop(i, true); listDrop(i, item); } } }
}

/* ---------- chapters, journal, achievements ---------- */
const storyQueue = [];
function computeChapter() { let c = life().chapters[0]; for (const n of life().chapters) { const ch = CHN[n]; if (S.lifetime >= ch.threshold || (ch.flagship && S.producers[ch.flagship] > 0)) c = Math.max(c, n); } return c; }
function checkChapter() {
  const c = computeChapter(); if (c <= S.chapter) return;
  const from = S.chapter; S.chapter = c;
  document.body.dataset.era = String(c);
  for (let n = from + 1; n <= c; n++) { journalAdd('era_' + n); queueStory(n); }
  dirty.scene = dirty.shop = dirty.journey = dirty.hustle = true; frameId++;
  const i0 = life().chapters.indexOf(from), i1 = life().chapters.indexOf(c);
  const gainPct = Math.round(((1 + DATA.eraBonus * i1) / (1 + DATA.eraBonus * i0) - 1) * 100);
  toast({ kicker: 'Chapter ' + c, title: CHN[c].name, text: 'All income +' + gainPct + '% from now on.', icon: CHN[c].icon, cls: 'gold' });
  FX.confetti(80); FX.flash(eraFlashColor(0.25)); chime(660); chime(880, 0.15); chime(1320, 0.3);
  save(false);
}
function eraFlashColor(alpha) { const rgb = getComputedStyle(document.body).getPropertyValue('--era-accent-rgb').trim() || '255,181,46'; return 'rgba(' + rgb + ',' + alpha + ')'; }
function queueStory(n) { if (S.seenStory.includes(n)) return; storyQueue.push(n); pumpStories(); }
function pumpStories() { if (modalOpen() || cinematicOpen()) return; while (storyQueue.length) { const n = storyQueue.shift(); if (S.seenStory.includes(n) || n > S.chapter) continue; S.seenStory.push(n); saveSoon(); openStory(n); return; } }
function journalAdd(id) { if (S.journal.some((j) => j.id === id)) return; S.journal.push({ id, t: now() }); dirty.journal = true; }
function journalText(id) {
  let m;
  if ((m = /^era_(\d+)$/.exec(id))) { const e = CHN[+m[1]]; return e ? { title: 'Chapter ' + e.n + ': ' + e.name, text: e.text.split('. ').slice(0, 2).join('. ') + '.' } : null; }
  if ((m = /^first_(\w+)$/.exec(id))) { const p = PID[m[1]]; return p ? { title: 'First ' + p.name, text: p.flavor } : null; }
  if ((m = /^(rebirth1|rebirth2|legend)_(\d+)$/.exec(id))) { const rb = DATA.rebirths.find((r) => r.id === m[1]); return rb ? { title: rb.title, text: rb.text.split('. ').slice(0, 2).join('. ') + '.' } : null; }
  if ((m = /^hustle_first_(\d)$/.exec(id))) { const H = LIVES[+m[1] - 1].hustle; return { title: 'First ' + H.title.toLowerCase().replace(/s$/, ''), text: H.buyerLines[0] }; }
  if (id === 'golden_first') return { title: 'The first golden taco', text: 'It shimmered on the counter for thirteen seconds. Manuel did not hesitate.' };
  if (id === 'viral_first') return { title: 'It went viral', text: 'Diego refreshed the page until his thumb hurt. Abuela framed the screenshot.' };
  return null;
}
const clickTimes = [];
function achievementProgress(a) {
  switch (a.kind) {
    case 'lifetime': return [S.lifetimeAll, a.v];
    case 'cps': return [cps(), a.v];
    case 'clicks': return [S.clicks, a.v];
    case 'owned': return [S.producers[a.producer], a.v];
    case 'golden': return [S.stats.goldenClicked, a.v];
    case 'era': return [S.chapter, a.v];
    case 'prestiges': return [S.prestiges, a.v];
    case 'rebirths': return [S.rebirths, a.v];
    case 'salsa': return [S.salsa, a.v];
    case 'depopSales': return [S.hustle.sales, a.v];
    case 'depopViral': return [S.hustle.viral, a.v];
    case 'hype': return [S.hustle.hype, a.v];
    case 'fastClicks': return [Math.min(clickTimes.length, 100), a.v];
    case 'upgrades': return [S.upgrades.length + S.menuItems, a.v];
    case 'playtime': return [S.stats.playMs / 1000, a.v];
    case 'combo': return [S.stats.bestCombo, a.v];
    case 'crits': return [S.stats.crits, a.v];
    case 'skins': return [S.skins.length, a.v];
    default: return [0, 1];
  }
}
function achievementMet(a) {
  if (a.kind === 'fastClicks') { const t = now(); while (clickTimes.length && t - clickTimes[0] > 10000) clickTimes.shift(); return clickTimes.length >= a.v; }
  if (a.kind === 'hype') return S.hustle.hype >= a.v - 0.5;
  if (a.kind === 'era') return S.chapter >= a.v || S.rebirths >= Math.ceil(a.v / 4) && a.v <= 4 * S.life; // chapters of finished lives count as reached
  const [cur, goal] = achievementProgress(a); return cur >= goal;
}
function checkAchievements() {
  let won = 0;
  for (const a of ACH) {
    if (S.ach.includes(a.id) || !achievementMet(a)) continue;
    S.ach.push(a.id); won++;
    toast({ kicker: 'Achievement unlocked · Reputation +2%', title: a.name, text: a.desc, icon: 'trophy', cls: 'gold' });
    chime(1046, 0); chime(1318, 0.1);
  }
  if (won) { dirty.shop = true; frameId++; saveSoon(); }
}

/* ==========================================================================
   UI
   ========================================================================== */
let buyAmount = 1, sellMode = false;
const isMobileLayout = () => window.matchMedia('(max-width: 820px)').matches;
const modalOpen = () => $('modalRoot').classList.contains('open');
const cinematicOpen = () => !$('cinematic').hidden;

/* ---------- sound ---------- */
let audio = null, lastBlip = 0;
function ensureAudio() { if (audio || !S.opts.sound) return; try { audio = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audio = null; } }
function tone(freq, delay = 0, dur = 0.09, gain = 0.06, type = 'triangle') {
  if (!audio || !S.opts.sound) return;
  try { if (audio.state === 'suspended') audio.resume(); const t = audio.currentTime + delay; const o = audio.createOscillator(); const g = audio.createGain(); o.type = type; o.frequency.setValueAtTime(freq, t); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g); g.connect(audio.destination); o.start(t); o.stop(t + dur + 0.02); } catch (e) { /* optional */ }
}
function blip(value) { const t = now(); if (t - lastBlip < 80) return; lastBlip = t; tone(520 + Math.min(400, Math.log10(Math.max(1, value)) * 60) + combo.count * 6, 0, 0.07, 0.045, 'square'); }
function chime(freq, delay = 0) { tone(freq, delay, 0.18, 0.05, 'sine'); }

/* ---------- floaters ---------- */
function floatText(text, clientX, clientY, big, small) {
  if (!fxOn()) return;
  const box = $('floaters'); if (box.childElementCount >= C.FLOAT_CAP) box.firstElementChild.remove();
  const r = box.getBoundingClientRect();
  const x = clientX == null ? r.width * rand(0.35, 0.65) : clientX - r.left, y = clientY == null ? r.height * 0.4 : clientY - r.top;
  const f = el('div', 'floater' + (big ? ' big' : '') + (small ? ' small' : ''), text); f.style.left = x + 'px'; f.style.top = y + 'px';
  box.appendChild(f); setTimeout(() => f.remove(), 950);
}
function shake(px) { if (!fxOn() || !S.opts.shake) return; const b = document.body; b.style.setProperty('--shake', px + 'px'); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 300); }

/* ---------- toasts ---------- */
const toastQueue = []; let toastsShowing = 0;
function toast(o) { toastQueue.push(o); pumpToasts(); }
function pumpToasts() {
  if (toastsShowing >= C.TOAST_MAX || !toastQueue.length) return;
  const o = toastQueue.shift(); toastsShowing++;
  const t = el('div', 'toast' + (o.cls ? ' ' + o.cls : '')); const ic = el('div', 'toast-icon'); ic.appendChild(svgIcon(o.icon || 'info'));
  const body = el('div', 'toast-body'); if (o.kicker) body.appendChild(el('div', 'toast-kicker', o.kicker)); if (o.title) body.appendChild(el('div', 'toast-title', o.title)); if (o.text) body.appendChild(el('div', 'toast-text', o.text));
  t.appendChild(ic); t.appendChild(body); $('toasts').appendChild(t);
  let closing = false, timer = 0;
  const done = () => { if (closing || !t.isConnected) return; closing = true; clearTimeout(timer); t.classList.add('out'); setTimeout(() => { t.remove(); toastsShowing--; pumpToasts(); }, 300); };
  t.addEventListener('click', done); timer = setTimeout(done, o.ms || C.TOAST_MS);
}

/* ---------- title ---------- */
let lastTitle = '';
function updateTitle() { const t = (S.golden.active ? '(!) ' : '') + money(S.bank, { short: true }) + ' · Manuel\'s Taco Clicker'; if (t !== lastTitle) { lastTitle = t; document.title = t; } }

/* ---------- tooltip ---------- */
const tip = { el: null, anchor: null, pinned: false, buyFn: null };
function tipContent(o) {
  const box = el('div'); const head = el('div', 'tooltip-head'); head.appendChild(el('div', 'tooltip-name', o.name));
  if (o.cost != null) head.appendChild(el('div', 'tooltip-cost' + (o.ok === false ? ' no' : ''), o.cost));
  box.appendChild(head);
  if (o.effect) box.appendChild(el('div', 'tooltip-effect', o.effect));
  if (o.extra) o.extra.forEach((x) => box.appendChild(el('div', 'tooltip-owned', x)));
  if (o.flavor) box.appendChild(el('div', 'tooltip-flavor', '“' + o.flavor + '”'));
  return box;
}
function showTip(anchor, contentFn, buyFn, pin) {
  const t = $('tooltip'); tip.el = t; tip.anchor = anchor; tip.pinned = !!pin; tip.buyFn = buyFn || null;
  t.innerHTML = ''; t.appendChild(contentFn());
  if (pin && buyFn) { const b = el('button', 'btn btn-primary', 'Buy'); b.style.marginTop = '8px'; b.style.height = '40px'; b.addEventListener('click', (e) => { e.stopPropagation(); buyFn(); refreshTip(); }); t.appendChild(b); t.style.pointerEvents = 'auto'; }
  else t.style.pointerEvents = 'none';
  t.classList.add('show'); positionTip();
}
function positionTip() {
  const t = tip.el; if (!t || !tip.anchor || !tip.anchor.isConnected) { hideTip(); return; }
  const r = tip.anchor.getBoundingClientRect(); const w = t.offsetWidth, h = t.offsetHeight; const vw = window.innerWidth, vh = window.innerHeight;
  let x, y;
  if (r.left - w - 12 >= 8) { x = r.left - w - 12; y = r.top; }
  else if (r.right + w + 12 <= vw - 8) { x = r.right + 12; y = r.top; }
  else { x = clamp(r.left + r.width / 2 - w / 2, 8, vw - w - 8); y = r.bottom + 8 + h <= vh - 8 ? r.bottom + 8 : r.top - h - 8; }
  y = clamp(y, 8, Math.max(8, vh - h - 8)); t.style.left = x + 'px'; t.style.top = y + 'px';
}
function refreshTip() { if (!tip.el || !tip.el.classList.contains('show') || !tip.anchor) return; if (tip.anchor.__tip) { const b = tip.el.querySelector('button'); tip.el.innerHTML = ''; tip.el.appendChild(tip.anchor.__tip()); if (b) tip.el.appendChild(b); positionTip(); } }
function hideTip() { const t = $('tooltip'); t.classList.remove('show'); t.style.pointerEvents = 'none'; tip.anchor = null; tip.pinned = false; tip.buyFn = null; }
function attachBuyable(node, contentFn, buyFn) {
  node.__tip = contentFn;
  node.addEventListener('mouseenter', () => { if (!coarsePointer()) showTip(node, contentFn, buyFn, false); });
  node.addEventListener('mouseleave', () => { if (!tip.pinned) hideTip(); });
  node.addEventListener('focus', () => showTip(node, contentFn, buyFn, false));
  node.addEventListener('blur', () => { if (!tip.pinned) hideTip(); });
  node.addEventListener('click', (e) => { e.preventDefault(); if (coarsePointer()) { if (tip.pinned && tip.anchor === node) { buyFn(e); refreshTip(); } else showTip(node, contentFn, buyFn, true); } else { buyFn(e); refreshTip(); } });
}
document.addEventListener('pointerdown', (e) => { if (tip.pinned && tip.anchor && !tip.anchor.contains(e.target) && !$('tooltip').contains(e.target)) hideTip(); }, true);

/* ---------- shop: producers ---------- */
const rows = {}; let lockedRow = null, legacyRow = null;
function buildShop() {
  const box = $('producers');
  P.forEach((p) => {
    const row = el('button', 'producer'); row.type = 'button'; row.dataset.pid = p.id;
    const fill = el('div', 'producer-fill'); row.appendChild(fill);
    const ic = el('div', 'producer-icon'); ic.appendChild(svgIcon(p.icon)); row.appendChild(ic);
    const main = el('div', 'producer-main'); const name = el('div', 'producer-name', p.name); const meta = el('div', 'producer-meta');
    const cost = el('span', 'producer-cost'); const rate = el('span', 'producer-rate'); meta.appendChild(cost); meta.appendChild(rate); main.appendChild(name); main.appendChild(meta);
    row.appendChild(main); const owned = el('div', 'producer-owned num zero', '0'); row.appendChild(owned);
    rows[p.id] = { el: row, fill, name, cost, rate, owned };
    attachBuyable(row, () => producerTip(p), (e) => { if (e && e.shiftKey && !sellMode) { sellProducer(p.id, 1); return; } if (sellMode) { if (sellProducer(p.id, buyAmount === 'max' ? 'max' : buyAmount)) chime(440); } else { const n = buyProducer(p.id, buyAmount); if (n) { chime(784); chime(1046, 0.08); const r = row.getBoundingClientRect(); FX.burst(r.left + 33, r.top + r.height / 2, 'coin', 8 + Math.min(12, n)); } } });
    box.appendChild(row);
  });
  lockedRow = el('div', 'producer lock'); const ic = el('div', 'producer-icon'); ic.appendChild(svgIcon('lock')); lockedRow.appendChild(ic);
  const main = el('div', 'producer-main'); main.appendChild(el('div', 'producer-name', '???')); const hint = el('div', 'producer-meta'); hint.appendChild(el('span', 'producer-rate')); main.appendChild(hint); lockedRow.appendChild(main); box.appendChild(lockedRow);
  legacyRow = el('div', 'producer legacy'); const ic2 = el('div', 'producer-icon'); ic2.appendChild(svgIcon('truck')); legacyRow.appendChild(ic2);
  const main2 = el('div', 'producer-main'); main2.appendChild(el('div', 'producer-name', 'Earlier lives, run by Diego')); const meta2 = el('div', 'producer-meta'); meta2.appendChild(el('span', 'producer-rate')); main2.appendChild(meta2); legacyRow.appendChild(main2); legacyRow.hidden = true; box.appendChild(legacyRow);
}
function producerTip(p) {
  const owned = S.producers[p.id]; const k = buyAmountFor(p.id);
  const each = producerRate(p.id) * globalMult(); const total = producerCps(p.id); const share = cps() > 0 ? total / cps() * 100 : 0;
  const nextTier = UPG.find((u) => u.kind === 'tier' && u.producer === p.id && !has(u.id));
  const extra = ['You own ' + owned + (owned ? ', making ' + moneyRate(total) + ' (' + share.toFixed(share < 10 ? 1 : 0) + '% of income)' : '') + '.'];
  if (nextTier && owned < nextTier.threshold) extra.push('Next upgrade at ' + nextTier.threshold + ' owned.');
  if (sellMode) return tipContent({ name: 'Sell ' + p.name + (k > 1 ? ' ×' + k : ''), cost: '+' + money(sellRefund(p.id, k)), effect: DATA.ui.sellMode, extra, flavor: p.flavor, ok: owned > 0 });
  const cost = bulkCost(p.id, Math.max(1, k));
  return tipContent({ name: p.name + (k > 1 ? ' ×' + k : ''), cost: money(cost), ok: S.bank >= cost, effect: 'Each ' + p.name + ' earns ' + moneyRate(each) + '. ' + p.desc, extra, flavor: p.flavor });
}
function buyAmountFor(pid) { if (buyAmount === 'max') return sellMode ? S.producers[pid] : maxAffordable(pid); return buyAmount; }
function renderProducers() {
  const rate = cps(); let firstHidden = null; let legacyRate = 0, legacyCount = 0;
  P.forEach((p) => {
    const r = rows[p.id]; const vis = producerVisible(p);
    if (r.el.hidden !== !vis) r.el.hidden = !vis;
    if (!vis) { if (!firstHidden && producerInLife(p)) firstHidden = p; if (!producerInLife(p) && S.producers[p.id] > 0) { legacyRate += producerCps(p.id); legacyCount += S.producers[p.id]; } return; }
    const owned = S.producers[p.id];
    setText(r.owned, String(owned)); setClass(r.owned, 'zero', owned === 0);
    if (sellMode) {
      const k = Math.min(buyAmount === 'max' ? owned : buyAmount, owned);
      setText(r.cost, k > 0 ? 'Sell ' + k + ' for ' + money(sellRefund(p.id, k)) : 'Nothing to sell');
      setClass(r.el, 'selling', true); setClass(r.el, 'ok', k > 0); setClass(r.el, 'no', k <= 0); r.fill.style.width = '0%';
      setText(r.rate, owned ? moneyRate(producerCps(p.id)) : ''); return;
    }
    setClass(r.el, 'selling', false);
    const k = buyAmount === 'max' ? Math.max(1, maxAffordable(p.id)) : buyAmount;
    const total = bulkCost(p.id, k); const ok = S.bank >= total && (buyAmount !== 'max' || maxAffordable(p.id) > 0);
    setText(r.cost, (k > 1 ? '×' + k + ' ' : '') + money(total)); setClass(r.el, 'ok', ok); setClass(r.el, 'no', !ok);
    const pct = ok ? 100 : clamp(S.bank / total * 100, 0, 100); const w = pct.toFixed(1) + '%'; if (r.fill.__w !== w) { r.fill.__w = w; r.fill.style.width = w; }
    let rateText = owned ? moneyRate(producerCps(p.id)) : moneyRate(producerRate(p.id) * globalMult()) + ' each';
    if (!ok && rate > 0) rateText = 'in ' + fmtTime((total - S.bank) / rate * 1000);
    setText(r.rate, rateText);
  });
  if (firstHidden) {
    lockedRow.hidden = false;
    const gated = S.chapter < firstHidden.chapter - 1;
    const hint = gated ? (CHN[firstHidden.chapter].hint || 'Not yet.') : 'Keep selling. Something new at ' + money(firstHidden.cost * 0.4) + ' earned.';
    setText(lockedRow.querySelector('.producer-rate'), hint);
  } else lockedRow.hidden = true;
  if (legacyCount > 0) { legacyRow.hidden = false; setText(legacyRow.querySelector('.producer-rate'), legacyCount + ' businesses still earning ' + moneyRate(legacyRate) + ' (Diego sends Manuel a ' + Math.round(DATA.legacyCut * 100) + '% cut)'); } else legacyRow.hidden = true;
}

/* ---------- shop: upgrades ---------- */
const tiles = {}; let tileOrder = '';
function upgradeTip(u) { const cost = upgradeCost(u); return tipContent({ name: u.name, cost: money(cost), ok: S.bank >= cost, effect: u.desc, flavor: u.flavor }); }
function menuTip() { const c = menuItemCost(); return tipContent({ name: DATA.menuItem.name + ' #' + (S.menuItems + 1), cost: money(c), ok: S.bank >= c, effect: 'All income +' + Math.round(DATA.menuItem.bonus * 100) + '%. Can be bought again and again.', flavor: DATA.menuItem.flavor }); }
function visibleUpgrades() { return UPG.filter((u) => !has(u.id) && upgradeUnlocked(u)).sort((a, b) => upgradeCost(a) - upgradeCost(b)); }
function rebuildTiles() {
  const box = $('upgradeTiles'); const list = visibleUpgrades(); const showMenu = S.lifetime >= 2e7 * lifeScale().income * 0.5 || S.life >= 3;
  const order = list.map((u) => u.id).join(',') + (showMenu ? ',menu' : ''); if (order === tileOrder) return; tileOrder = order;
  const keep = new Set(list.map((u) => u.id)); if (showMenu) keep.add('menu');
  Object.keys(tiles).forEach((id) => { if (!keep.has(id)) { tiles[id].remove(); delete tiles[id]; } });
  const frag = document.createDocumentFragment();
  list.forEach((u) => { let t = tiles[u.id]; if (!t) { t = el('button', 'tile'); t.type = 'button'; t.appendChild(svgIcon(u.icon)); t.setAttribute('aria-label', u.name); tiles[u.id] = t; attachBuyable(t, () => upgradeTip(u), () => { if (buyUpgrade(u.id)) { chime(988); chime(1318, 0.1); const r = t.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top + r.height / 2, 'star', 10); toast({ kicker: 'Upgrade', title: u.name, text: u.desc, icon: u.icon, cls: 'lime', ms: 2500 }); } }); } frag.appendChild(t); });
  if (showMenu) { let t = tiles.menu; if (!t) { t = el('button', 'tile'); t.type = 'button'; t.appendChild(svgIcon('plus')); t.setAttribute('aria-label', DATA.menuItem.name); tiles.menu = t; attachBuyable(t, menuTip, () => { if (buyMenuItem()) { chime(988); chime(1318, 0.1); } }); } frag.appendChild(t); }
  box.appendChild(frag); if (tip.anchor && !tip.anchor.isConnected) hideTip();
}
function renderTiles() {
  let affordable = 0;
  for (const id in tiles) { const cost = id === 'menu' ? menuItemCost() : upgradeCost(UPGID[id]); const ok = S.bank >= cost; if (ok) affordable++; setClass(tiles[id], 'ok', ok); setClass(tiles[id], 'no', !ok); }
  const n = Object.keys(tiles).length; setText($('upgradeCount'), n ? affordable + ' of ' + n + ' affordable' : '');
}

/* ---------- journey ---------- */
const chipEls = {}; const lifePills = {};
function buildJourney() {
  const pills = $('lifePills'); pills.innerHTML = '';
  LIVES.forEach((l) => { const p = el('div', 'life-pill'); p.appendChild(svgIcon(['hand', 'shirt', 'crown'][l.n - 1])); p.appendChild(el('span', null, l.name)); pills.appendChild(p); lifePills[l.n] = p; });
  const box = $('eraChips'); box.innerHTML = '';
  CH.forEach((c) => { const chip = el('div', 'chip'); chip.appendChild(svgIcon(c.icon)); chip.appendChild(el('span', null, c.name)); chip.title = 'Chapter ' + c.n + ' · Manuel, ' + c.age; box.appendChild(chip); chipEls[c.n] = chip; });
}
function renderJourney() {
  const L = life(); const ch = CHN[S.chapter]; const chapters = L.chapters; const nextN = chapters[chapters.indexOf(S.chapter) + 1]; const next = nextN ? CHN[nextN] : null;
  LIVES.forEach((l) => { setClass(lifePills[l.n], 'done', l.n < S.life); setClass(lifePills[l.n], 'now', l.n === S.life); });
  CH.forEach((c) => { const e = chipEls[c.n]; const inLife = c.life === S.life; if (e.hidden !== !inLife) e.hidden = !inLife; setClass(e, 'done', c.n < S.chapter); setClass(e, 'now', c.n === S.chapter); });
  const badge = L.name + ' · Ch. ' + S.chapter + ' · ' + ch.name; setText($('eraBadgeText'), badge); setText($('eraBadgeTextMobile'), badge);
  const href = '#i-' + ch.icon; ['eraBadgeIcon', 'eraBadgeIconMobile'].forEach((id) => { const u = $(id); if (u.getAttribute('href') !== href) u.setAttribute('href', href); });
  setText($('runEarned'), money(S.lifetime));
  const bar = $('eraProgress').firstElementChild;
  if (next) {
    const pct = clamp(S.lifetime / next.threshold * 100, 0, 100);
    setText($('nextEra'), 'Next: ' + next.name + ' at ' + money(next.threshold) + (next.flagship ? ', or buy a ' + PID[next.flagship].name : ''));
    setText($('eraPct'), pct.toFixed(pct < 10 ? 1 : 0) + '%'); const w = pct.toFixed(2) + '%'; if (bar.__w !== w) { bar.__w = w; bar.style.width = w; }
  } else { setText($('nextEra'), 'Last chapter of ' + L.name + '. Rebirth when ready.'); setText($('eraPct'), '100%'); bar.style.width = '100%'; }
  setText($('hintText'), (!S.tut.bought && S.bank >= unitCost(L.producers[0])) ? (isMobileLayout() ? 'You can afford a ' + PID[L.producers[0]].name + '. Open the Shop tab.' : 'You can afford a ' + PID[L.producers[0]].name + '. Buy helpers to earn while you rest.') : ch.buttonHint);
  renderBuffs(); renderRebirthCard();
}
const buffEls = {};
function renderBuffs() {
  const box = $('buffs'); const t = now(); const live = S.buffs.filter((b) => b.endsAt > t); const ids = new Set(live.map((b) => b.id));
  Object.keys(buffEls).forEach((id) => { if (!ids.has(id) && id !== 'hype') { buffEls[id].remove(); delete buffEls[id]; } });
  const hypeOn = S.hustle.hype > 0.5 && hustleUnlocked(); if (hypeOn) ids.add('hype'); else if (buffEls.hype) { buffEls.hype.remove(); delete buffEls.hype; }
  live.forEach((b) => { let e = buffEls[b.id]; if (!e) { e = el('span', 'buff' + (b.kind === 'click' ? ' gold' : b.kind === 'storm' ? ' lime' : '')); e.appendChild(svgIcon(b.kind === 'click' ? 'hand' : b.kind === 'storm' ? 'sparkle' : 'bolt')); e.appendChild(el('span')); buffEls[b.id] = e; box.appendChild(e); } setText(e.lastChild, b.name + (b.kind === 'storm' ? '' : ' ×' + b.mult) + ' · ' + fmtClock(b.endsAt - t)); });
  if (hypeOn) { let e = buffEls.hype; if (!e) { e = el('span', 'buff berry'); e.appendChild(svgIcon('sparkle')); e.appendChild(el('span')); buffEls.hype = e; box.appendChild(e); } setText(e.lastChild, 'Hype ' + Math.round(S.hustle.hype) + '% · +' + Math.round(S.hustle.hype / 2) + '% income'); }
  const empty = box.querySelector('.buffs-empty'); if (ids.size && empty) empty.remove(); else if (!ids.size && !empty) box.appendChild(el('span', 'buffs-empty', 'No boosts right now. Watch for a golden taco.'));
}
let rebirthBuilt = '';
function renderRebirthCard() {
  const card = $('rebirthCard'); const ready = rebirthReady(); const L = life(); const last = L.chapters[L.chapters.length - 1];
  const toLife = LIVES[nextLifeIndex() - 1]; const legend = nextLifeIndex() === 1;
  const key = (ready ? 'r' : 'n') + S.life + S.chapter;
  if (key !== rebirthBuilt) {
    rebirthBuilt = key; card.innerHTML = ''; card.classList.toggle('ready', ready);
    const head = el('div', 'card-head'); head.appendChild(el('h3', 'card-title', legend ? 'A New Summer' : 'Rebirth')); const cl = el('div', 'clout'); cl.appendChild(svgIcon('sparkle')); cl.appendChild(el('span', null, DATA.ui.cloutLabel + ' ×' + cloutMult())); head.appendChild(cl); card.appendChild(head);
    const p = el('p', 'rebirth-text');
    if (ready) p.textContent = DATA.ui.rebirthReadyTitle + ' ' + DATA.ui.rebirthReadyText.replace('{life}', legend ? 'a new summer back at the backyard' : toLife.name) + ' Income and clicks ×2 forever.';
    else p.textContent = (S.chapter < last ? 'Reach Chapter ' + last + ' (' + CHN[last].name + ') and earn ' : 'Earn ') + money(rebirthTarget()) + ' this life to rebirth into ' + (legend ? 'a new summer' : toLife.name) + '.';
    card.appendChild(p);
    const prog = el('div', 'progress'); prog.appendChild(el('i')); prog.firstElementChild.id = 'rebirthBar'; card.appendChild(prog);
    const meta = el('div', 'progress-meta'); meta.appendChild(el('span', null, '')); meta.appendChild(el('span', null, '')); meta.firstElementChild.id = 'rebirthMeta'; meta.lastElementChild.id = 'rebirthPct'; card.appendChild(meta);
    if (ready) { const b = el('button', 'btn btn-primary rebirth-btn', legend ? 'Start a new summer' : 'Rebirth into ' + toLife.name); b.type = 'button'; b.addEventListener('click', () => openRebirthCinematic()); card.appendChild(b); }
  }
  const pct = clamp(S.lifetime / rebirthTarget() * 100, 0, 100); const bar = $('rebirthBar'); const w = pct.toFixed(2) + '%'; if (bar && bar.__w !== w) { bar.__w = w; bar.style.width = w; }
  setText($('rebirthMeta'), money(S.lifetime) + ' of ' + money(rebirthTarget())); setText($('rebirthPct'), pct.toFixed(pct < 10 ? 1 : 0) + '%');
}

/* ---------- side hustle panel ---------- */
let slotEls = []; let hustleBuilt = '';
function hustleKey() { const n = hustleSlotCount(); return 'open' + S.life + n + ':' + S.hustle.slots.map((s) => (s ? s.item + s.startedAt : '-')).join(',') + ':' + hustleItems().map((i) => itemAvailable(i)).join(''); }
function buildHustle() {
  const body = $('hustleBody'); body.innerHTML = ''; slotEls = []; const H = hustleDef();
  setText($('hustleTitle'), H.title);
  const box = $('hypeBox'); const stats = $('hustleStats');
  if (!hustleUnlocked()) {
    hustleBuilt = 'locked' + S.life; box.hidden = true; stats.hidden = true;
    const t = el('div', 'locked-teaser'); t.appendChild(svgIcon('lock')); t.appendChild(el('div', null, H.lockedTeaser + ' Opens in Chapter ' + H.unlockChapter + ' (' + CHN[H.unlockChapter].name + ').')); body.appendChild(t); return;
  }
  box.hidden = false; stats.hidden = false;
  const n = hustleSlotCount(); while (S.hustle.slots.length < n) S.hustle.slots.push(null);
  hustleBuilt = hustleKey();
  const grid = el('div', 'slots' + (n === 4 ? ' four' : '')); for (let i = 0; i < n; i++) grid.appendChild(buildSlot(i)); body.appendChild(grid);
  const actions = el('div', 'item-chips'); actions.style.marginTop = '2px';
  const relist = el('button', 'btn', 'Relist'); relist.type = 'button'; relist.id = 'relistBtn'; relist.addEventListener('click', () => { const free = S.hustle.slots.findIndex((s) => !s); if (free >= 0 && S.hustle.lastItem && listDrop(free, S.hustle.lastItem)) chime(700); });
  const collect = el('button', 'btn btn-lime', 'Collect all'); collect.type = 'button'; collect.id = 'collectAllBtn'; collect.addEventListener('click', () => { if (collectAll()) { chime(900); chime(1200, 0.1); } });
  actions.appendChild(relist); actions.appendChild(collect); body.appendChild(actions);
}
function buildSlot(i) {
  const sl = S.hustle.slots[i]; const H = hustleDef();
  if (!sl) {
    const d = el('div', 'slot empty'); d.appendChild(el('div', 'slot-note', 'Start one')); const chips = el('div', 'item-chips');
    hustleItems().forEach((item) => {
      const c = el('button', 'item-chip'); c.type = 'button';
      if (!itemAvailable(item)) { c.classList.add('locked'); c.textContent = item.name + ' · needs ' + (item.requires ? UPGID[item.requires].name : 'Chapter ' + item.requiresChapter); c.disabled = true; }
      else { c.appendChild(el('span', null, item.name)); c.appendChild(el('b', 'num')); attachBuyable(c, () => tipContent({ name: item.name, cost: money(itemCost(item)), ok: S.bank >= itemCost(item), effect: 'Done in ' + fmtTime(item.sellSeconds * 1000 / (has('depop_ring') ? 1.25 : 1)) + ' for ' + item.payout + '× what it cost' + (has('depop_verified') ? ' (+25% verified)' : '') + '. Hype +' + item.hype + '.', flavor: item.desc }), () => { if (listDrop(i, item.id)) chime(700); }); }
      chips.appendChild(c);
    });
    d.appendChild(chips); slotEls[i] = { el: d, chips: Array.from(chips.children) }; return d;
  }
  const item = itemById(sl.item) || { name: 'Order' }; const d = el('div', 'slot');
  const head = el('div', 'slot-head'); head.appendChild(el('span', null, item.name)); const time = el('span', 'slot-time'); time.appendChild(svgIcon('clock')); time.appendChild(el('span', 'num')); head.appendChild(time); d.appendChild(head);
  const prog = el('div', 'progress thin'); prog.appendChild(el('i')); d.appendChild(prog);
  const note = el('div', 'slot-note'); note.appendChild(el('span', null, 'Pays ')); note.appendChild(el('b', 'num', money(sl.payout))); note.appendChild(el('span', null, ' when done')); d.appendChild(note);
  const btn = el('button', 'btn btn-lime', 'Collect ' + money(sl.payout)); btn.type = 'button'; btn.hidden = true; btn.addEventListener('click', (e) => { if (collectDrop(i)) { chime(900); chime(1200, 0.1); FX.burst(e.clientX, e.clientY, 'coin', 16); } }); d.appendChild(btn);
  slotEls[i] = { el: d, time: time.lastChild, timeWrap: time, bar: prog.firstElementChild, btn, note, sold: false, H }; return d;
}
function renderHustle() {
  if (!hustleUnlocked()) { if (hustleBuilt !== 'locked' + S.life) buildHustle(); return; }
  if (hustleKey() !== hustleBuilt) buildHustle();
  const t = now(); let anyReady = false; const H = hustleDef();
  S.hustle.slots.forEach((sl, i) => {
    const se = slotEls[i]; if (!se) return;
    if (!sl) { se.chips.forEach((c, j) => { const item = hustleItems()[j]; if (!item || !itemAvailable(item)) return; const cost = itemCost(item); setText(c.lastChild, money(cost)); setClass(c, 'ok', S.bank >= cost); setClass(c, 'no', S.bank < cost); }); return; }
    const ready = t >= sl.readyAt; if (ready) anyReady = true;
    if (ready && !se.sold) { se.sold = true; se.el.classList.add('sold'); se.btn.hidden = false; se.note.hidden = true; se.timeWrap.className = 'slot-sold'; se.timeWrap.textContent = H.soldWord + (sl.viral ? ' · ' + H.viralWord : sl.flop ? ' · sort of' : ''); }
    else if (!ready) { setText(se.time, fmtClock(sl.readyAt - t)); const w = clamp((t - sl.startedAt) / Math.max(1, sl.readyAt - sl.startedAt) * 100, 0, 100).toFixed(1) + '%'; if (se.bar.__w !== w) { se.bar.__w = w; se.bar.style.width = w; } }
  });
  const collect = $('collectAllBtn'); if (collect) collect.hidden = !anyReady;
  const relist = $('relistBtn'); if (relist) { const free = S.hustle.slots.some((s) => !s); const it = S.hustle.lastItem && itemById(S.hustle.lastItem); relist.hidden = !(free && it && itemAvailable(it)); if (it) { relist.textContent = 'Relist ' + it.name + ' · ' + money(itemCost(it)); relist.disabled = S.bank < itemCost(it); } }
  const bar = $('hypeBar'); const w = S.hustle.hype.toFixed(1) + '%'; if (bar.__w !== w) { bar.__w = w; bar.style.width = w; } setText($('hypePct'), Math.round(S.hustle.hype) + '%');
  setText($('hustleStats'), 'Done ' + S.hustle.sales + ' · ' + H.viralWord + ' ' + S.hustle.viral + ' · Best ' + money(S.hustle.best) + ' · Earned ' + money(S.hustle.earned));
}

/* ---------- journal ---------- */
function renderJournal() {
  const box = $('journal'); box.innerHTML = ''; const entries = S.journal.slice(-6).reverse();
  if (!entries.length) { box.appendChild(el('p', 'muted', 'Every chapter, first business and golden taco gets written down here.')); return; }
  entries.forEach((j) => {
    const jt = journalText(j.id); if (!jt) return;
    const row = el('div', 'journal-entry'); const m = /^era_(\d+)$/.exec(j.id);
    const num = el('div', 'journal-num'); if (m) num.textContent = m[1]; else num.appendChild(svgIcon(/^first_/.test(j.id) ? 'plus' : j.id === 'golden_first' ? 'star' : /^(rebirth|legend)/.test(j.id) ? 'sun' : 'tag'));
    row.appendChild(num); const body = el('div'); body.appendChild(el('h4', null, jt.title)); body.appendChild(el('p', null, jt.text)); row.appendChild(body); box.appendChild(row);
  });
}

/* ---------- news ticker ---------- */
const recentNews = [];
function newsPool() {
  const N = DATA.news; const pool = []; const add = (arr, w = 1) => (arr || []).forEach((l) => { for (let i = 0; i < w; i++) pool.push(l); });
  add(S.life === 1 ? N.generic : S.life === 2 ? N.life2Generic : N.life3Generic); add(CHN[S.chapter].news, 3);
  if (S.bank < 10 * lifeScale().click && S.lifetime > 200 * lifeScale().click) add(N.lowCash, 3);
  P.forEach((p) => { if (S.producers[p.id] >= 10 && p.life === S.life) add(N.producers[p.id], 2); });
  if (S.ach.length >= 20) pool.push('Manuel has ' + S.ach.length + ' achievements. Abuela keeps them in a shoebox.');
  if (S.golden.missed > 3) pool.push('A golden taco rolled off the counter again. Diego was distracted.');
  if (tacosSold() > 1e6) pool.push('Manuel has sold ' + fmt(tacosSold()) + ' tacos. That is a lot of napkins.');
  if (S.rebirths > 0) pool.push('Diego still runs the old businesses. He has a clipboard now. Nobody asked for the clipboard.');
  return pool;
}
function rotateNews() {
  const pool = newsPool().filter((l) => !recentNews.includes(l)); if (!pool.length) return;
  const line = pick(pool); recentNews.push(line); if (recentNews.length > 6) recentNews.shift();
  const n = $('newsText'); n.classList.add('fade'); setTimeout(() => { n.textContent = line; n.classList.remove('fade'); }, 320);
}

/* ---------- modals ---------- */
let modalOpener = null, modalOnClose = null, lastInputKeyboard = false;
function openModal(o) {
  const root = $('modalRoot'); root.innerHTML = ''; modalOpener = lastInputKeyboard ? document.activeElement : null; modalOnClose = o.onClose || null;
  const m = el('div', 'modal' + (o.cls ? ' ' + o.cls : '')); m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
  const head = el('div', 'modal-head');
  if (o.kicker) { const k = el('div', 'modal-kicker'); if (o.kickerIcon) k.appendChild(svgIcon(o.kickerIcon)); k.appendChild(el('span', null, o.kicker)); head.appendChild(k); } else head.appendChild(el('div'));
  const close = el('button', 'btn modal-close'); close.type = 'button'; close.setAttribute('aria-label', 'Close'); close.appendChild(svgIcon('x')); close.addEventListener('click', closeModal); head.appendChild(close); m.appendChild(head);
  if (o.title) { const h = el('h2', null, o.title); h.id = 'modalTitle'; m.setAttribute('aria-labelledby', 'modalTitle'); m.appendChild(h); }
  const body = el('div', 'modal-body'); if (o.body) body.appendChild(o.body); m.appendChild(body); if (o.foot) m.appendChild(o.foot);
  root.appendChild(m); root.classList.add('open'); hideTip();
  const focusTarget = m.querySelector('.btn-primary, .btn-lime') || close; setTimeout(() => focusTarget.focus(), 30);
}
function closeModal() {
  const root = $('modalRoot'); if (!root.classList.contains('open')) return;
  root.classList.remove('open'); root.innerHTML = ''; hideTip();
  const cb = modalOnClose; modalOnClose = null; if (cb) cb();
  if (modalOpener && modalOpener.focus && modalOpener.isConnected) modalOpener.focus(); modalOpener = null;
  setTimeout(pumpStories, 150);
}
$('modalRoot').addEventListener('click', (e) => { if (e.target === $('modalRoot')) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalOpen()) { e.preventDefault(); closeModal(); } });

function openStory(n) {
  const c = CHN[n]; const body = el('div');
  const art = el('div', 'story-art'); art.innerHTML = portraitSVG(c.life, 96); art.appendChild(svgIcon(c.icon)); body.appendChild(art);
  body.appendChild(el('p', null, c.text));
  const foot = el('div', 'modal-foot'); const note = el('div', 'note');
  const idx = LIVES[c.life - 1].chapters.indexOf(n);
  if (idx > 0) { const gainPct = Math.round(DATA.eraBonus / (1 + DATA.eraBonus * (idx - 1)) * 100); note.appendChild(el('span', null, 'All income ')); note.appendChild(el('b', null, '+' + gainPct + '%')); note.appendChild(el('span', null, ' from now on (chapter bonus ×' + (1 + DATA.eraBonus * idx).toFixed(2) + ')')); }
  else note.textContent = c.buttonHint;
  const btn = el('button', 'btn btn-primary', n === 1 ? 'Start selling' : 'Keep going'); btn.type = 'button'; btn.addEventListener('click', closeModal);
  foot.appendChild(note); foot.appendChild(btn);
  openModal({ cls: 'story', kicker: LIVES[c.life - 1].name + ' · Chapter ' + n + ' · Manuel, ' + c.age, kickerIcon: c.icon, title: c.title, body, foot });
}
function confirmModal(o) {
  const body = el('div'); body.appendChild(el('p', null, o.text));
  const foot = el('div', 'modal-foot'); foot.appendChild(el('div', 'note', o.note || ''));
  const wrap = el('div', 'opt-actions'); const no = el('button', 'btn', 'Cancel'); no.type = 'button'; no.addEventListener('click', closeModal);
  const yes = el('button', 'btn ' + (o.danger ? 'btn-danger' : 'btn-primary'), o.confirm); yes.type = 'button'; yes.addEventListener('click', () => { closeModal(); o.onConfirm(); });
  wrap.appendChild(no); wrap.appendChild(yes); foot.appendChild(wrap);
  openModal({ kicker: o.kicker, kickerIcon: o.icon, title: o.title, body, foot });
}
function statRow(label, value) { const r = el('div', 'stat'); r.appendChild(el('span', null, label)); r.appendChild(el('b', 'num', value)); return r; }
function openStats() {
  const body = el('div'); const grid = el('div', 'stats-grid'); body.appendChild(grid); const sec = (t) => grid.appendChild(el('div', 'stats-section', t));
  sec(life().name + ' (rebirth ' + S.rebirths + ', summer ' + S.runs + ')');
  grid.appendChild(statRow('Cash in hand', money(S.bank))); grid.appendChild(statRow('Earned this life', money(S.lifetime)));
  grid.appendChild(statRow('Income per second', moneyRate(cps()))); grid.appendChild(statRow('Best income per second', moneyRate(S.stats.bestCps)));
  grid.appendChild(statRow('Per click', money(clickValue(false)))); grid.appendChild(statRow('Tacos sold (all ways)', fmt(tacosSold())));
  grid.appendChild(statRow('Hand-rolled by Manuel', fmt(S.clicks))); grid.appendChild(statRow('Businesses owned', fmt(P.reduce((a, p) => a + S.producers[p.id], 0))));
  grid.appendChild(statRow('Upgrades owned', fmt(S.upgrades.length + S.menuItems))); grid.appendChild(statRow('Chapter', S.chapter + ' · ' + CHN[S.chapter].name));
  sec('All time');
  grid.appendChild(statRow('Earned all time', money(S.lifetimeAll))); grid.appendChild(statRow('Time played', fmtTime(S.stats.playMs)));
  grid.appendChild(statRow('Rebirths', fmt(S.rebirths) + ' (' + DATA.ui.cloutLabel + ' ×' + cloutMult() + ')')); grid.appendChild(statRow('Best ' + DATA.combo.meterName + ' combo', fmt(S.stats.bestCombo) + ' / ' + C.COMBO_MAX));
  grid.appendChild(statRow('Lucky big clicks', fmt(S.stats.crits))); grid.appendChild(statRow('Golden tacos grabbed', fmt(S.stats.goldenClicked) + (S.stats.goldenMissed ? ' (missed ' + fmt(S.stats.goldenMissed) + ')' : '')));
  grid.appendChild(statRow('Best golden streak', fmt(S.stats.bestStreak))); grid.appendChild(statRow('Achievements', S.ach.length + ' of ' + ACH.length));
  grid.appendChild(statRow('Reputation', Math.round(reputation() * 100) + '%')); grid.appendChild(statRow('Salsa Points', S.salsa + ' (' + (S.salsa - S.salsaSpent) + ' unspent)'));
  grid.appendChild(statRow('Earned while away', money(S.stats.offlineEarned))); grid.appendChild(statRow('Storm tacos caught', fmt(S.stats.stormTacos)));
  if (S.hustle.sales || hustleUnlocked()) { sec(hustleDef().title); grid.appendChild(statRow('Completed', fmt(S.hustle.sales))); grid.appendChild(statRow(hustleDef().viralWord, fmt(S.hustle.viral))); grid.appendChild(statRow('Best one', money(S.hustle.best))); grid.appendChild(statRow('Earned', money(S.hustle.earned))); }
  sec('Where the income comes from');
  P.forEach((p) => { if (S.producers[p.id] > 0) grid.appendChild(statRow(p.name + ' ×' + S.producers[p.id] + (p.life !== S.life ? ' (earlier life, Diego\'s cut)' : ''), moneyRate(producerCps(p.id)) + ' · ' + (cps() > 0 ? (producerCps(p.id) / cps() * 100).toFixed(1) : '0') + '%')); });
  sec('Multipliers'); const layers = incomeLayers(true); if (!layers.length) grid.appendChild(statRow('No multipliers yet', '×1'));
  layers.forEach((l) => grid.appendChild(statRow(l.label, '×' + (l.mult >= 100 ? l.mult.toFixed(0) : l.mult.toFixed(2))))); grid.appendChild(statRow('Total', '×' + fmt(globalMult(true))));
  const c = clickLayers(); sec('Click value'); grid.appendChild(statRow('Base', money(lifeScale().click) + (c.pct ? ' + ' + Math.round(c.pct * 100) + '% of income/s' : ''))); c.layers.forEach((l) => grid.appendChild(statRow(l.label, '×' + (l.mult >= 100 ? l.mult.toFixed(0) : l.mult.toFixed(2))))); grid.appendChild(statRow('Per click', money(clickValue())));
  openModal({ cls: 'wide', kicker: 'Stats', kickerIcon: 'stats', title: 'The numbers', body });
}
function openAchievements() {
  const body = el('div'); const sum = el('div', 'ach-summary'); const left = el('span'); left.appendChild(el('b', null, S.ach.length + ' of ' + ACH.length)); left.appendChild(el('span', null, ' unlocked')); sum.appendChild(left);
  sum.appendChild(el('span', null, 'Reputation ' + Math.round(reputation() * 100) + '% (each achievement +2%)')); body.appendChild(sum);
  const grid = el('div', 'ach-grid'); grid.style.marginTop = '12px';
  ACH.forEach((a) => {
    const won = S.ach.includes(a.id); const t = el('button', 'ach' + (won ? ' won' : '')); t.type = 'button'; t.appendChild(svgIcon(won || !a.secret ? a.icon : 'lock')); t.setAttribute('aria-label', won || !a.secret ? a.name : 'Secret achievement');
    const content = () => { if (!won && a.secret) return tipContent({ name: '???', effect: DATA.secretHints[a.id] || 'A secret.' }); const [cur, goal] = achievementProgress(a); return tipContent({ name: a.name, effect: a.desc, extra: [won ? 'Unlocked.' : 'Progress: ' + (a.kind === 'lifetime' || a.kind === 'cps' ? money(cur) + ' of ' + money(goal) : fmt(Math.min(cur, goal)) + ' of ' + fmt(goal))] }); };
    t.__tip = content; t.addEventListener('mouseenter', () => showTip(t, content)); t.addEventListener('mouseleave', hideTip); t.addEventListener('focus', () => showTip(t, content)); t.addEventListener('blur', hideTip); t.addEventListener('click', () => showTip(t, content, null, true));
    grid.appendChild(t);
  });
  body.appendChild(grid); openModal({ cls: 'wide', kicker: 'Achievements', kickerIcon: 'trophy', title: 'The shoebox', body });
}
function openNotebook() {
  const body = el('div'); const box = el('div', 'prestige-box'); const pend = pendingSalsa();
  box.appendChild(el('div', 'big', 'Salsa Points: ' + S.salsa + ' (' + (S.salsa - S.salsaSpent) + ' unspent)'));
  box.appendChild(el('p', null, 'Salsa Points arrive when Manuel finishes ' + LIVES[2].name + ' and starts a new summer back at the backyard. Every point makes all income +5% forever, and points you spend on pages still count. ' + (pend >= 1 ? 'Right now a new summer would bring +' + pend + '.' : 'Next point at ' + money(nextSalsaAt()) + ' earned all time (you have ' + money(S.lifetimeAll) + ').')));
  body.appendChild(box);
  body.appendChild(el('p', null, 'Pages from Abuela\'s notebook. Bought with Salsa Points, kept forever.')).style.marginTop = '12px';
  const list = el('div', 'recipes'); list.style.marginTop = '8px';
  RECIPES.forEach((r) => {
    const owned = hasRecipe(r.id); const can = !owned && S.salsa - S.salsaSpent >= r.cost;
    const b = el('button', 'recipe' + (owned ? ' owned' : can ? '' : ' no')); b.type = 'button'; b.disabled = owned;
    const ic = el('div', 'recipe-icon'); ic.appendChild(svgIcon(r.icon)); b.appendChild(ic);
    const main = el('div', 'recipe-main'); main.appendChild(el('div', 'recipe-name', r.name)); main.appendChild(el('div', 'recipe-desc', r.desc)); main.appendChild(el('div', 'recipe-flavor', '“' + r.flavor + '”')); b.appendChild(main);
    b.appendChild(el('div', 'recipe-cost', owned ? 'In the notebook' : r.cost + ' SP'));
    if (!owned) b.addEventListener('click', () => { if (buyRecipe(r.id)) { chime(988); chime(1318, 0.1); openNotebook(); } });
    list.appendChild(b);
  });
  body.appendChild(list); openModal({ cls: 'wide', kicker: 'Abuela\'s Notebook', kickerIcon: 'book', title: 'Secret recipes', body });
}
function optRow(name, desc, control) { const r = el('div', 'opt'); const m = el('div', 'opt-main'); m.appendChild(el('div', 'opt-name', name)); if (desc) m.appendChild(el('div', 'opt-desc', desc)); r.appendChild(m); r.appendChild(control); return r; }
function switchEl(key, onChange) { const b = el('button', 'switch'); b.type = 'button'; b.setAttribute('role', 'switch'); b.setAttribute('aria-checked', String(!!S.opts[key])); b.addEventListener('click', () => { S.opts[key] = !S.opts[key]; b.setAttribute('aria-checked', String(S.opts[key])); if (onChange) onChange(S.opts[key]); saveSoon(); }); return b; }
function openOptions() {
  const body = el('div', 'options');
  const skinRow = el('div', 'opt-actions');
  SKINS.forEach((k) => { const b = el('button', 'btn' + (S.skin === k.id ? ' btn-primary' : ''), k.name); b.type = 'button'; const unlocked = S.skins.includes(k.id); b.disabled = !unlocked; b.title = unlocked ? k.desc : 'Unlocks in ' + LIVES.find((l) => l.skin === k.id).name; b.addEventListener('click', () => { S.skin = k.id; applySkin(); saveSoon(); openOptions(); }); skinRow.appendChild(b); });
  body.appendChild(optRow('Taco skin', SKINS.find((k) => k.id === S.skin).desc, skinRow));
  body.appendChild(optRow('Sound', 'Little blips when you sell, chimes for the good stuff.', switchEl('sound', (on) => { if (on) { ensureAudio(); chime(880); } })));
  body.appendChild(optRow('Visual effects', 'Particles, confetti, floating numbers. Turn off on a slow phone.', switchEl('particles', (on) => document.body.classList.toggle('no-particles', !on))));
  body.appendChild(optRow('Screen shake', 'A little rumble on big moments.', switchEl('shake')));
  body.appendChild(optRow('Short numbers', '$1.23M instead of $1.234 million.', switchEl('shortNumbers')));
  const saveRow = el('div', 'opt-actions');
  const sv = el('button', 'btn', 'Save now'); sv.type = 'button'; sv.addEventListener('click', () => save(true));
  const ex = el('button', 'btn', 'Export save'); ex.type = 'button'; ex.appendChild(svgIcon('download'));
  const im = el('button', 'btn', 'Import save'); im.type = 'button'; im.appendChild(svgIcon('upload'));
  saveRow.appendChild(sv); saveRow.appendChild(ex); saveRow.appendChild(im);
  body.appendChild(optRow('Your progress', storageFailed ? DATA.ui.storageOff : 'Saved in this browser every 30 seconds and whenever you buy something.', saveRow));
  const area = el('div'); area.hidden = true; const ta = el('textarea', 'save-box'); ta.setAttribute('aria-label', 'Save code'); const arow = el('div', 'opt-actions'); arow.style.marginTop = '8px'; area.appendChild(ta); area.appendChild(arow); body.appendChild(area);
  ex.addEventListener('click', () => { area.hidden = false; ta.value = exportSave(); ta.readOnly = true; arow.innerHTML = ''; const cp = el('button', 'btn', 'Copy'); cp.type = 'button'; cp.addEventListener('click', () => { ta.select(); let ok = false; try { document.execCommand('copy'); ok = true; } catch (e) { ok = false; } if (navigator.clipboard) navigator.clipboard.writeText(ta.value).then(() => { cp.textContent = 'Copied'; }).catch(() => { cp.textContent = ok ? 'Copied' : 'Select and copy'; }); else cp.textContent = ok ? 'Copied' : 'Select and copy'; }); arow.appendChild(cp); ta.focus(); ta.select(); });
  im.addEventListener('click', () => { area.hidden = false; ta.value = ''; ta.readOnly = false; ta.placeholder = 'Paste a save code here'; arow.innerHTML = ''; const ld = el('button', 'btn btn-primary', 'Load'); ld.type = 'button'; ld.addEventListener('click', () => { if (importSave(ta.value)) { closeModal(); toast({ title: 'Save loaded', text: 'Welcome back. Abuela kept your seat.', icon: 'check', cls: 'lime' }); } else ld.textContent = 'That code did not work'; }); arow.appendChild(ld); ta.focus(); });
  const hr = el('button', 'btn btn-danger', 'Hard reset'); hr.type = 'button'; hr.appendChild(svgIcon('trash'));
  hr.addEventListener('click', () => confirmModal({ kicker: 'Danger', icon: 'trash', title: 'Throw away Abuela\'s notebook?', text: DATA.ui.hardResetConfirm, confirm: 'Erase everything', danger: true, onConfirm: () => { hardReset(); toast({ title: 'Back to the backyard', text: 'Manuel is twelve again. The table still wobbles.', icon: 'table' }); } }));
  body.appendChild(optRow('Start completely over', 'Erases everything, including Salsa Points and achievements.', hr));
  body.appendChild(optRow('Keys', 'Space or Enter on the taco sells one. Escape closes windows. Shift-click a business to sell one.', el('div')));
  const foot = el('div', 'modal-foot'); foot.appendChild(el('div', 'note', 'Manuel\'s Taco Clicker · made for Shuttle · no ads, no accounts, just tacos.'));
  openModal({ kicker: 'Options', kickerIcon: 'gear', title: 'Settings', body, foot });
}
function openMenu() {
  const body = el('div', 'options');
  [['stats', 'Stats', 'stats'], ['trophy', 'Achievements', 'achievements'], ['book', 'Abuela\'s Notebook', 'recipes'], ['gear', 'Options', 'options']].forEach(([ic, label, which]) => { const b = el('button', 'btn'); b.type = 'button'; b.style.justifyContent = 'flex-start'; b.style.height = '48px'; b.appendChild(svgIcon(ic)); b.appendChild(el('span', null, label)); b.addEventListener('click', () => { closeModal(); setTimeout(() => openPanel(which), 50); }); body.appendChild(b); });
  openModal({ kicker: 'Menu', kickerIcon: 'menu', title: 'Manuel\'s Taco Clicker', body });
}
function openPanel(which) { if (which === 'stats') openStats(); else if (which === 'achievements') openAchievements(); else if (which === 'recipes') openNotebook(); else if (which === 'options') openOptions(); }

/* ==========================================================================
   Characters and scenes
   ========================================================================== */
const OUT = '#3a2418';
function hairMass() {
  const cx = 0, cy = -128, pts = [];
  for (let a = 180; a <= 360; a += 12) { const i = (a - 180) / 12; const r = (i % 2 ? 44 : 36) + (i % 3 === 0 ? 4 : 0) - (a > 330 ? 4 : 0); const rad = a * Math.PI / 180; pts.push([cx + Math.cos(rad) * r, cy + Math.sin(rad) * r * 0.95]); }
  let d = 'M-40 -100 L-40 -118 '; pts.forEach(([x, y]) => { d += 'L' + x.toFixed(1) + ' ' + y.toFixed(1) + ' '; }); d += 'L40 -118 L36 -100 L30 -96 L-30 -96 Z'; return d;
}
/* Manuel: messy dark wavy hair with flyaways, tan skin, thick brows, thin mustache, full lips. Outfit per life. */
function manuel(x, y, s = 1, lifeN = 1) {
  const skin = '#c9915e', skinDark = '#a9713f', hair = '#1c1310', hairHi = '#4a352c', lipsU = '#b85a5a', lipsL = '#d9736b';
  const outfit = {
    1: `<path d="M-26 -30 L-30 -92 L30 -92 L26 -30 Z" fill="#23222a" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/><path d="M-17 -30 L-15 -76 L15 -76 L17 -30 Z" fill="#fff3e2" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/><path d="M-15 -76 L-6 -92 M15 -76 L6 -92" fill="none" stroke="${OUT}" stroke-width="3"/><path d="M-8 -60 h16" stroke="#ff5a3c" stroke-width="3" stroke-linecap="round"/>`,
    2: `<path d="M-28 -30 L-32 -92 L32 -92 L28 -30 Z" fill="#6d3fa3" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/><path d="M-32 -92 Q0 -108 32 -92 L26 -84 Q0 -96 -26 -84 Z" fill="#5a3288" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/><path d="M-6 -84 v18 M6 -84 v18" stroke="#fff3e2" stroke-width="2.5" stroke-linecap="round"/><path d="M-16 -50 h32 v14 h-32 z" fill="#5a3288" stroke="${OUT}" stroke-width="2.5"/><text x="0" y="-62" text-anchor="middle" font-family="'Lilita One', sans-serif" font-size="9" fill="#ffb52e" transform="rotate(-3)">MANUEL'S</text>`,
    3: `<path d="M-28 -30 L-32 -92 L32 -92 L28 -30 Z" fill="#fff3e2" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/><path d="M-30 -92 L-34 -30 L-12 -30 L-8 -92 Z M30 -92 L34 -30 L12 -30 L8 -92 Z" fill="#1a1a22" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/><path d="M-8 -92 L-2 -72 M8 -92 L2 -72" stroke="${OUT}" stroke-width="2.5"/><path d="M-12 -92 q12 14 24 0" fill="none" stroke="#ffb52e" stroke-width="3" stroke-linecap="round"/>`,
  }[lifeN] || '';
  const legs = `<path d="M-20 -30 L-22 0 L-6 0 L-4 -30 Z M20 -30 L22 0 L6 0 L4 -30 Z" fill="${lifeN === 3 ? '#1a1a22' : '#2b3a5e'}" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/><path d="M-24 0 h20 v-6 h-20 z M4 0 h20 v-6 h-20 z" fill="${lifeN === 2 ? '#ff5a3c' : '#fff3e2'}" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>`;
  const sleeve = lifeN === 2 ? '#6d3fa3' : lifeN === 3 ? '#1a1a22' : skin;
  const arms = `<path d="M-30 -88 C-44 -74 -44 -56 -34 -48" fill="none" stroke="${OUT}" stroke-width="11" stroke-linecap="round"/><path d="M-30 -88 C-44 -74 -44 -56 -34 -48" fill="none" stroke="${sleeve}" stroke-width="6" stroke-linecap="round"/><circle cx="-34" cy="-46" r="6" fill="${skin}" stroke="${OUT}" stroke-width="3"/>`
    + (lifeN === 2
      ? `<path d="M30 -88 C44 -80 44 -66 36 -60" fill="none" stroke="${OUT}" stroke-width="11" stroke-linecap="round"/><path d="M30 -88 C44 -80 44 -66 36 -60" fill="none" stroke="${sleeve}" stroke-width="6" stroke-linecap="round"/><circle cx="36" cy="-60" r="6" fill="${skin}" stroke="${OUT}" stroke-width="3"/><rect x="30" y="-78" width="14" height="24" rx="3" fill="#1a1315" stroke="${OUT}" stroke-width="2.5" transform="rotate(-12 37 -66)"/><rect x="33" y="-75" width="8" height="16" rx="1.5" fill="#d96bff" opacity=".85" transform="rotate(-12 37 -66)"/>`
      : `<path d="M30 -88 C44 -74 44 -56 34 -48" fill="none" stroke="${OUT}" stroke-width="11" stroke-linecap="round"/><path d="M30 -88 C44 -74 44 -56 34 -48" fill="none" stroke="${sleeve}" stroke-width="6" stroke-linecap="round"/><circle cx="34" cy="-46" r="6" fill="${skin}" stroke="${OUT}" stroke-width="3"/>`);
  const shades = lifeN === 3 ? `<path d="M-22 -122 h44" stroke="${OUT}" stroke-width="3"/><path d="M-20 -122 h17 a2 2 0 0 1 2 2 v6 a6 6 0 0 1 -6 6 h-9 a6 6 0 0 1 -6 -6 v-6 a2 2 0 0 1 2 -2 z M3 -122 h17 a2 2 0 0 1 2 2 v6 a6 6 0 0 1 -6 6 h-9 a6 6 0 0 1 -6 -6 v-6 a2 2 0 0 1 2 -2 z" fill="#1a1a22" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/><path d="M-16 -118 l6 -3 M7 -118 l6 -3" stroke="#fff3e2" stroke-width="2" opacity=".7"/>` : '';
  return `<g class="manuel" transform="translate(${x} ${y}) scale(${s})" role="button" tabindex="0" aria-label="Manuel. Click to hear what he says." data-manuel="1">
    <ellipse cx="0" cy="2" rx="30" ry="6" fill="#000" opacity=".3"/>${legs}${outfit}${arms}
    <rect x="-8" y="-98" width="16" height="10" fill="${skinDark}" stroke="${OUT}" stroke-width="3"/>
    <path d="${hairMass()}" fill="${hair}" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/>
    <ellipse cx="0" cy="-116" rx="25" ry="27" fill="${skin}" stroke="${OUT}" stroke-width="4"/>
    <ellipse cx="-26" cy="-115" rx="4.5" ry="6" fill="${skin}" stroke="${OUT}" stroke-width="3"/><ellipse cx="26" cy="-115" rx="4.5" ry="6" fill="${skin}" stroke="${OUT}" stroke-width="3"/>
    <path d="M-17 -126 q7 -5 14 -2" fill="none" stroke="${hair}" stroke-width="4" stroke-linecap="round"/><path d="M3 -128 q7 -3 14 2" fill="none" stroke="${hair}" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="-10" cy="-117" rx="3.8" ry="4.6" fill="#1a1315"/><ellipse cx="10" cy="-117" rx="3.8" ry="4.6" fill="#1a1315"/><circle cx="-9" cy="-119.5" r="1" fill="#fff"/><circle cx="11" cy="-119.5" r="1" fill="#fff"/>
    <path d="M-1 -113 q-3 5 2 6" fill="none" stroke="${skinDark}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M-8 -101 q4 -2 7 0 M1 -101 q3 -2 7 0" fill="none" stroke="${hair}" stroke-width="2.2" stroke-linecap="round" opacity=".85"/>
    <path d="M-8 -98 q8 -3 16 0 q-8 3 -16 0 z" fill="${lipsU}" stroke="${OUT}" stroke-width="2"/><path d="M-8 -97 q8 8 16 0 z" fill="${lipsL}" stroke="${OUT}" stroke-width="2"/>
    ${shades}
    <path d="M-34 -118 C-34 -140 -20 -156 -4 -154 C10 -160 26 -152 32 -138 C38 -128 34 -118 28 -112 C30 -124 24 -132 16 -128 C14 -118 18 -110 24 -104 C16 -108 8 -116 4 -126 C-2 -132 -10 -132 -14 -124 C-18 -118 -22 -120 -24 -126 C-28 -130 -32 -124 -34 -118 Z" fill="${hair}" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M-24 -128 C-22 -136 -14 -140 -8 -136 C-12 -130 -16 -126 -20 -122 Z" fill="${hair}"/>
    <path d="M-14 -158 l-8 -14 M-2 -162 l1 -14 M12 -158 l9 -12 M26 -150 l13 -8 M-28 -148 l-13 -8 M36 -134 l13 -3 M-38 -130 l-13 3 M6 -164 l-4 -12 M-20 -160 l-3 -12 M20 -160 l6 -10 M40 -120 l12 2 M-42 -116 l-11 -4" stroke="${hair}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M-22 -148 q8 -8 18 -6 M6 -150 q10 -4 18 4 M-32 -136 q4 -10 12 -14 M20 -140 q6 -2 12 6" fill="none" stroke="${hairHi}" stroke-width="2" stroke-linecap="round" opacity=".7"/>
  </g>`;
}
let portraitSeq = 0;
function portraitSVG(lifeN = 1, size = 40) { const id = 'pc' + lifeN + '_' + (portraitSeq++); return `<svg class="portrait-svg" width="${size}" height="${size}" viewBox="-44 -172 88 88" aria-hidden="true"><clipPath id="${id}"><circle cx="0" cy="-128" r="44"/></clipPath><g clip-path="url(#${id})"><circle cx="0" cy="-128" r="44" fill="#2b201d"/>${manuel(0, -60, 1, lifeN).replace(/<g class="manuel"[^>]*>/, '<g>')}</g><circle cx="0" cy="-128" r="42.5" fill="none" stroke="var(--era-accent, #ffb52e)" stroke-width="3"/></svg>`; }

const sceneParts = {
  lights(y = 46) { let s = `<path d="M0 ${y} Q 105 ${y + 30} 210 ${y + 4} T 420 ${y}" fill="none" stroke="${OUT}" stroke-width="2"/>`; [0.08, 0.2, 0.32, 0.44, 0.56, 0.68, 0.8, 0.92].forEach((f, i) => { const x = Math.round(420 * f); const yy = [y + 6, y + 20, y + 16, y + 4, y + 8, y + 20, y + 14, y + 2][i]; s += `<circle class="bulb" cx="${x}" cy="${yy}" r="9" fill="#ffb52e" opacity=".18"/><circle cx="${x}" cy="${yy}" r="4" fill="#ffb52e"/>`; }); return s; },
  stars(n = 18) { let s = ''; for (let i = 0; i < n; i++) s += `<circle class="star" style="animation-delay:${(i * 0.37) % 3}s" cx="${(i * 97) % 420}" cy="${10 + (i * 53) % 120}" r="${1 + (i % 3) * 0.6}" fill="#fff3e2" opacity=".5"/>`; return s; },
  shadow() { return `<ellipse cx="210" cy="364" rx="150" ry="8" fill="#000" opacity=".35"/>`; },
  sign(x, y, size, color, rot = -3, text = "MANUEL'S") { return `<text x="${x}" y="${y}" text-anchor="middle" font-family="'Lilita One', 'Arial Rounded MT Bold', sans-serif" font-size="${size}" fill="${color}" transform="rotate(${rot} ${x} ${y})">${text}</text>`; },
  truck(x, y, s = 1, lit = true) { return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="0" y="30" width="236" height="128" rx="14" fill="#2b201d" stroke="${OUT}" stroke-width="3"/><rect x="234" y="52" width="84" height="106" rx="10" fill="#2b201d" stroke="${OUT}" stroke-width="3"/><rect x="250" y="64" width="46" height="34" rx="6" fill="#3a2a2c"/><rect x="38" y="58" width="126" height="46" rx="6" fill="${lit ? '#7a5a2a' : '#4a3a2a'}"/>${lit ? '<rect x="38" y="58" width="126" height="46" rx="6" fill="#ffb52e" opacity=".35"/>' : ''}${sceneParts.sign(100, 24, 26, '#ffb52e', -2)}<circle cx="58" cy="162" r="16" fill="#1a1315" stroke="${OUT}" stroke-width="3"/><circle cx="210" cy="162" r="16" fill="#1a1315" stroke="${OUT}" stroke-width="3"/></g>`; },
  table(x, y) { return `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="150" height="12" rx="4" fill="#8a5a2a" stroke="${OUT}" stroke-width="3"/><path d="M12 12 L4 78 M138 12 L146 78 M40 12 L34 78 M110 12 L116 78" stroke="${OUT}" stroke-width="4" stroke-linecap="round"/><rect x="28" y="-46" width="94" height="40" rx="4" fill="#fff3e2" stroke="${OUT}" stroke-width="3" transform="rotate(-4 75 -26)"/><text x="75" y="-16" text-anchor="middle" font-family="'Lilita One', sans-serif" font-size="22" fill="#ff5a3c" transform="rotate(-4 75 -26)">TACOS</text><ellipse cx="50" cy="-2" rx="16" ry="6" fill="#f2b134" stroke="${OUT}" stroke-width="3"/><ellipse cx="100" cy="-2" rx="16" ry="6" fill="#f2b134" stroke="${OUT}" stroke-width="3"/></g>`; },
  fence(y) { let s = `<path d="M0 ${y + 18} H420 M0 ${y + 48} H420" stroke="${OUT}" stroke-width="4"/>`; for (let x = 8; x < 420; x += 34) s += `<path d="M${x} ${y + 70} V${y + 8} L${x + 9} ${y} L${x + 18} ${y + 8} V${y + 70} Z" fill="#4a3324" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>`; return s; },
  plant(x, y) { return `<g transform="translate(${x} ${y})"><path d="M-14 0 h28 l-4 30 h-20 z" fill="#b5532a" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/><path d="M0 0 c-20 -30 -10 -50 0 -60 c10 10 20 30 0 60 z" fill="#3f9e38" stroke="${OUT}" stroke-width="3"/><path d="M-2 -6 c-30 -10 -34 -30 -30 -44 c16 4 30 20 30 44 z M2 -6 c30 -10 34 -30 30 -44 c-16 4 -30 20 -30 44 z" fill="#8fd14f" stroke="${OUT}" stroke-width="3"/></g>`; },
  stand(x, y) { let stripes = ''; for (let i = 0; i < 8; i++) stripes += `<path d="M${i * 30} 0 h30 v34 q-15 12 -30 0 z" fill="${i % 2 ? '#fff3e2' : '#ff5a3c'}" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>`; return `<g transform="translate(${x} ${y})"><path d="M8 40 V150 M232 40 V150" stroke="${OUT}" stroke-width="6" stroke-linecap="round"/><rect x="0" y="96" width="240" height="60" rx="8" fill="#8a5a2a" stroke="${OUT}" stroke-width="3"/><rect x="14" y="108" width="212" height="12" rx="3" fill="#4a3324"/><g>${stripes}</g><rect x="40" y="-42" width="160" height="42" rx="6" fill="#fff3e2" stroke="${OUT}" stroke-width="3" transform="rotate(-3 120 -21)"/>${sceneParts.sign(120, -12, 26, '#ff5a3c', -3)}<ellipse cx="70" cy="96" rx="18" ry="7" fill="#f2b134" stroke="${OUT}" stroke-width="3"/><ellipse cx="120" cy="96" rx="18" ry="7" fill="#f2b134" stroke="${OUT}" stroke-width="3"/><ellipse cx="170" cy="96" rx="18" ry="7" fill="#f2b134" stroke="${OUT}" stroke-width="3"/></g>`; },
  lamp(x, y) { return `<g transform="translate(${x} ${y})"><path d="M0 0 V-150" stroke="${OUT}" stroke-width="6" stroke-linecap="round"/><rect x="-14" y="-172" width="28" height="26" rx="6" fill="#ffb52e" stroke="${OUT}" stroke-width="3"/><circle cx="0" cy="-160" r="34" fill="#ffb52e" opacity=".12"/></g>`; },
  skyline(y) { let s = ''; const hs = [60, 110, 80, 140, 70, 120, 90, 100]; let x = -10; hs.forEach((h, i) => { s += `<rect x="${x}" y="${y - h}" width="52" height="${h + 40}" fill="#241a1c" stroke="${OUT}" stroke-width="2"/>`; for (let r = 0; r < Math.floor(h / 22); r++) for (let c = 0; c < 2; c++) if ((r + c + i) % 3) s += `<rect x="${x + 10 + c * 20}" y="${y - h + 8 + r * 22}" width="10" height="12" fill="#ffb52e" opacity=".55"/>`; x += 56; }); return s; },
  rack(x, y) { return `<g transform="translate(${x} ${y})" stroke="${OUT}" stroke-width="3" fill="none"><path d="M0 0 h96"/><path d="M6 0 v120 M90 0 v120"/><path d="M-6 120 h24 M78 120 h24"/><path d="M22 0 v10 M46 0 v10 M70 0 v10" stroke="#8f7a6c"/><rect x="12" y="10" width="22" height="44" rx="5" fill="#d96bff" opacity=".9"/><rect x="36" y="10" width="22" height="44" rx="5" fill="#ff5a3c" opacity=".9"/><rect x="60" y="10" width="22" height="44" rx="5" fill="#9fdc4b" opacity=".9"/></g>`; },
  phone(x, y, s = 1) { return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="0" y="0" width="56" height="100" rx="10" fill="#1a1315" stroke="${OUT}" stroke-width="3"/><rect x="6" y="10" width="44" height="72" rx="4" fill="#2a1b33"/><path d="M28 34 c-8 -14 -22 -4 -12 8 l12 12 l12 -12 c10 -12 -4 -22 -12 -8 z" fill="#d96bff"/><path d="M18 62 h20 M14 70 h28" stroke="#8f7a6c" stroke-width="3" stroke-linecap="round"/><g fill="#d96bff" class="hearts"><path d="M70 -6 c-6 -10 -16 -3 -9 6 l9 9 l9 -9 c7 -9 -3 -16 -9 -6 z" opacity=".8"/><path d="M84 -40 c-5 -8 -13 -2 -7 5 l7 7 l7 -7 c6 -7 -2 -13 -7 -5 z" opacity=".6"/><path d="M62 -70 c-4 -6 -10 -2 -6 4 l6 6 l6 -6 c4 -6 -2 -10 -6 -4 z" opacity=".4"/></g></g>`; },
  neon(x, y, text = "MANUEL'S", color = '#d96bff') { return `<g transform="translate(${x} ${y})"><rect x="-96" y="-26" width="192" height="52" rx="12" fill="#17121c" stroke="${color}" stroke-width="3"/><rect x="-96" y="-26" width="192" height="52" rx="12" fill="${color}" opacity=".12"/>${sceneParts.sign(0, 10, 28, color, -2, text)}</g>`; },
  storefront(x, y, s = 1, color = '#8c2f5a', text = "MANUEL'S") { return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="0" y="0" width="150" height="130" rx="8" fill="#2b201d" stroke="${OUT}" stroke-width="3"/><rect x="0" y="0" width="150" height="34" rx="8" fill="${color}" stroke="${OUT}" stroke-width="3"/>${sceneParts.sign(75, 25, 20, '#ffb52e', -2, text)}<rect x="16" y="54" width="52" height="56" rx="4" fill="#ffb52e" opacity=".35" stroke="${OUT}" stroke-width="3"/><rect x="88" y="54" width="46" height="76" rx="4" fill="#3a2a2c" stroke="${OUT}" stroke-width="3"/><circle cx="124" cy="94" r="3" fill="#ffb52e"/><path d="M-8 130 h166" stroke="${OUT}" stroke-width="4"/></g>`; },
  planet(x, y) { return `<g transform="translate(${x} ${y})"><circle r="26" fill="#4a3a2a" stroke="${OUT}" stroke-width="3"/><circle cx="-8" cy="-6" r="6" fill="#3a2a2c"/><circle cx="10" cy="8" r="4" fill="#3a2a2c"/><ellipse rx="44" ry="10" fill="none" stroke="#ffb52e" stroke-width="3" transform="rotate(-18)"/><g transform="translate(34 -22) scale(.16)"><use href="#taco" width="240" height="200"/></g></g>`; },
  chair(x, y) { return `<g transform="translate(${x} ${y})" stroke="${OUT}" stroke-width="4" fill="none" stroke-linecap="round"><path d="M0 0 v-40 h40 v40"/><path d="M0 -40 v-46 h40 v46"/><path d="M-4 -40 h48" stroke="#ff5a3c" stroke-width="8"/></g>`; },
  desk(x, y) { return `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="170" height="12" rx="4" fill="#8a5a2a" stroke="${OUT}" stroke-width="3"/><path d="M10 12 v70 M160 12 v70" stroke="${OUT}" stroke-width="5" stroke-linecap="round"/><path d="M40 0 l8 -40 h60 l8 40 z" fill="#1a1315" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/><rect x="54" y="-34" width="48" height="28" rx="2" fill="#2a1b33"/><path d="M62 -26 h32 M62 -18 h20" stroke="#d96bff" stroke-width="2.5" stroke-linecap="round"/><rect x="118" y="-20" width="34" height="20" rx="3" fill="#b5532a" stroke="${OUT}" stroke-width="2.5"/></g>`; },
  ringLight(x, y) { return `<g transform="translate(${x} ${y})"><path d="M0 0 v-120" stroke="${OUT}" stroke-width="5" stroke-linecap="round"/><path d="M-20 0 h40" stroke="${OUT}" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="-150" r="34" fill="none" stroke="#fff3e2" stroke-width="9"/><circle cx="0" cy="-150" r="34" fill="none" stroke="${OUT}" stroke-width="3"/><circle cx="0" cy="-150" r="24" fill="none" stroke="${OUT}" stroke-width="3"/><circle cx="0" cy="-150" r="52" fill="#fff3e2" opacity=".08"/></g>`; },
  sheet(x, y, w, h) { return `<path d="M${x} ${y} h${w} v${h} q-${w / 2} 10 -${w} 0 z" fill="#efe6d8" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/><path d="M${x + 20} ${y + 10} q10 ${h / 2} 0 ${h - 20}" fill="none" stroke="#d9cdbb" stroke-width="3"/>`; },
  window(x, y) { return `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="110" height="90" rx="6" fill="#0f0d16" stroke="${OUT}" stroke-width="4"/><path d="M55 0 v90 M0 45 h110" stroke="${OUT}" stroke-width="4"/><circle cx="82" cy="24" r="10" fill="#fff3e2" opacity=".9"/><circle cx="20" cy="60" r="1.5" fill="#fff3e2"/><circle cx="36" cy="70" r="1" fill="#fff3e2"/></g>`; },
  shelves(x, y) { let s = `<g transform="translate(${x} ${y})"><path d="M0 0 v160 M150 0 v160" stroke="${OUT}" stroke-width="5"/>`; for (let r = 0; r < 4; r++) { s += `<path d="M-4 ${r * 40 + 30} h158" stroke="${OUT}" stroke-width="4"/>`; for (let c = 0; c < 4; c++) s += `<rect x="${6 + c * 36}" y="${r * 40 + 6}" width="30" height="22" rx="3" fill="${['#ff5a3c', '#fff3e2', '#9fdc4b', '#d96bff', '#ffb52e'][(r + c) % 5]}" stroke="${OUT}" stroke-width="2.5"/>`; } return s + '</g>'; },
  boxes(x, y) { return `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="54" height="44" rx="4" fill="#b5532a" stroke="${OUT}" stroke-width="3"/><path d="M27 0 v44 M0 22 h54" stroke="#fff3e2" stroke-width="4" opacity=".6"/><rect x="58" y="10" width="44" height="34" rx="4" fill="#c9915e" stroke="${OUT}" stroke-width="3"/><rect x="20" y="-34" width="46" height="34" rx="4" fill="#b5532a" stroke="${OUT}" stroke-width="3"/><path d="M43 -34 v34" stroke="#fff3e2" stroke-width="4" opacity=".6"/></g>`; },
  factory(x, y) { return `<g transform="translate(${x} ${y})"><rect x="0" y="40" width="230" height="110" rx="6" fill="#2b201d" stroke="${OUT}" stroke-width="3"/><path d="M0 40 l40 -26 v26 l40 -26 v26 l40 -26 v26" fill="#241a1c" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/><rect x="150" y="-30" width="22" height="70" fill="#3a2a2c" stroke="${OUT}" stroke-width="3"/><rect x="190" y="-10" width="22" height="50" fill="#3a2a2c" stroke="${OUT}" stroke-width="3"/><circle class="puff" cx="161" cy="-44" r="10" fill="#fff3e2" opacity=".25"/><circle class="puff" cx="201" cy="-26" r="8" fill="#fff3e2" opacity=".2"/>${sceneParts.sign(70, 96, 22, '#ffb52e', -2)}<rect x="20" y="110" width="190" height="10" rx="3" fill="#4a3324" stroke="${OUT}" stroke-width="2"/><g transform="translate(30 92) scale(.09)"><use href="#taco" width="240" height="200"/></g><g transform="translate(80 92) scale(.09)"><use href="#taco" width="240" height="200"/></g><g transform="translate(130 92) scale(.09)"><use href="#taco" width="240" height="200"/></g></g>`; },
  globe(x, y, r = 60) { return `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#1f3a5e" stroke="${OUT}" stroke-width="3"/><path d="M${-r} 0 h${2 * r} M0 ${-r} v${2 * r}" stroke="#4fc3f7" stroke-width="2" opacity=".6"/><ellipse rx="${r * 0.5}" ry="${r}" fill="none" stroke="#4fc3f7" stroke-width="2" opacity=".6"/><ellipse rx="${r}" ry="${r * 0.4}" fill="none" stroke="#4fc3f7" stroke-width="2" opacity=".6"/><path d="M${-r * 0.5} ${-r * 0.3} q${r * 0.3} -${r * 0.3} ${r * 0.6} 0 q-${r * 0.1} ${r * 0.4} -${r * 0.6} ${r * 0.2} z" fill="#9fdc4b" opacity=".8"/><path d="M${r * 0.1} ${r * 0.2} q${r * 0.3} 0 ${r * 0.4} ${r * 0.3} q-${r * 0.4} ${r * 0.2} -${r * 0.4} -${r * 0.3} z" fill="#9fdc4b" opacity=".8"/><circle cx="${-r * 0.3}" cy="${-r * 0.4}" r="4" fill="#ff5a3c"/><circle cx="${r * 0.35}" cy="${r * 0.1}" r="4" fill="#ff5a3c"/><circle cx="${r * 0.05}" cy="${r * 0.5}" r="4" fill="#ff5a3c"/><path d="M0 ${r} v20 M-16 ${r + 20} h32" stroke="${OUT}" stroke-width="4" stroke-linecap="round"/></g>`; },
  blimp(x, y, s = 1) { return `<g transform="translate(${x} ${y}) scale(${s})"><g class="drift"><ellipse rx="80" ry="30" fill="#ff5a3c" stroke="${OUT}" stroke-width="3"/><path d="M-80 0 q-14 -16 -22 -10 v20 q8 6 22 -10 z" fill="#2b201d" stroke="${OUT}" stroke-width="3"/>${sceneParts.sign(0, 8, 20, '#fff3e2', -1)}<rect x="-24" y="26" width="48" height="18" rx="5" fill="#2b201d" stroke="${OUT}" stroke-width="3"/><rect x="-16" y="30" width="32" height="8" rx="2" fill="#ffb52e" opacity=".6"/></g></g>`; },
  moonGround() { return `<path d="M-20 380 Q 210 300 440 380 Z" fill="#3a3540" stroke="${OUT}" stroke-width="3"/><circle cx="120" cy="352" r="10" fill="#2e2a34"/><circle cx="300" cy="346" r="14" fill="#2e2a34"/><circle cx="210" cy="332" r="6" fill="#2e2a34"/>`; },
  abuela(x, y, s = 1) { return `<g class="abuela" transform="translate(${x} ${y}) scale(${s})" role="button" tabindex="0" aria-label="Abuela. Click to hear what she thinks." data-abuela="1"><ellipse cx="0" cy="2" rx="28" ry="6" fill="#000" opacity=".3"/><path d="M-24 0 L-18 -74 L18 -74 L24 0 Z" fill="#8c2f5a" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/><path d="M-15 0 L-12 -56 L12 -56 L15 0 Z" fill="#fff3e2" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/><path d="M-18 -66 C-34 -58 -34 -36 -22 -30" fill="none" stroke="${OUT}" stroke-width="10" stroke-linecap="round"/><path d="M-18 -66 C-34 -58 -34 -36 -22 -30" fill="none" stroke="#e8b48f" stroke-width="5" stroke-linecap="round"/><path d="M18 -66 C34 -58 34 -36 22 -30" fill="none" stroke="${OUT}" stroke-width="10" stroke-linecap="round"/><path d="M18 -66 C34 -58 34 -36 22 -30" fill="none" stroke="#e8b48f" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="-92" r="19" fill="#e8b48f" stroke="${OUT}" stroke-width="4"/><path d="M-19 -96 A19 19 0 0 1 19 -96 L15 -104 A17 17 0 0 0 -15 -104 Z" fill="#d9d4cf" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/><circle cx="0" cy="-114" r="9" fill="#d9d4cf" stroke="${OUT}" stroke-width="3"/><circle cx="-7" cy="-92" r="5" fill="none" stroke="${OUT}" stroke-width="2.5"/><circle cx="7" cy="-92" r="5" fill="none" stroke="${OUT}" stroke-width="2.5"/><path d="M-2 -92 h4" stroke="${OUT}" stroke-width="2.5"/><path d="M-6 -82 q6 5 12 0" fill="none" stroke="${OUT}" stroke-width="2.5" stroke-linecap="round"/><circle cx="-13" cy="-84" r="3" fill="#ff5a3c" opacity=".5"/><circle cx="13" cy="-84" r="3" fill="#ff5a3c" opacity=".5"/></g>`; },
};
const sp = sceneParts;
const SCENES = {
  1: () => sp.stars() + sp.lights(50) + sp.fence(120) + sp.plant(14, 296) + sp.table(90, 232) + sp.abuela(372, 330) + manuel(52, 346, 0.85, 1),
  2: () => sp.stars() + sp.lights(40) + sp.lamp(392, 320) + sp.stand(70, 100) + sp.chair(300, 300) + sp.abuela(350, 330) + manuel(52, 346, 0.85, 1),
  3: () => sp.stars() + sp.lights(46) + sp.truck(40, 90, 1, true) + sp.abuela(372, 330) + manuel(52, 346, 0.85, 1),
  4: () => sp.stars() + sp.skyline(160) + sp.truck(40, 120, 0.62, true) + sp.truck(210, 150, 0.62, true) + sp.truck(120, 178, 0.62, false) + sp.abuela(362, 330) + manuel(52, 346, 0.85, 1),
  5: () => sp.stars(10) + sp.window(280, 40) + sp.sheet(60, 90, 200, 150) + sp.ringLight(100, 300) + sp.desk(150, 250) + sp.rack(310, 160) + sp.abuela(390, 330, 0.9) + manuel(56, 346, 0.85, 2),
  6: () => sp.stars() + sp.neon(210, 52, "MANUEL'S", '#ff4fa3') + sp.phone(170, 150, 1.4) + sp.rack(300, 150) + sp.abuela(372, 330) + manuel(52, 346, 0.85, 2),
  7: () => sp.stars(10) + sp.shelves(30, 60) + sp.boxes(300, 290) + sp.boxes(230, 300) + sp.abuela(378, 330, 0.95) + manuel(56, 346, 0.85, 2),
  8: () => sp.stars() + sp.neon(210, 52, 'CROOKED CO.', '#c957ff') + sp.storefront(30, 110, 0.9, '#5a3288', 'CROOKED CO.') + sp.rack(300, 150) + sp.abuela(372, 330) + manuel(52, 346, 0.85, 2),
  9: () => sp.stars() + sp.storefront(10, 110, 0.8, '#8c2f5a') + sp.storefront(140, 100, 0.8, '#b5532a') + sp.storefront(270, 118, 0.8, '#4f7d2a') + sp.abuela(372, 336) + manuel(52, 346, 0.85, 3),
  10: () => sp.stars() + sp.factory(120, 110) + sp.abuela(372, 336) + manuel(52, 346, 0.85, 3),
  11: () => sp.stars() + sp.skyline(170) + sp.globe(220, 130, 62) + sp.blimp(330, 62, 0.55) + sp.abuela(372, 336) + manuel(52, 346, 0.85, 3),
  12: () => sp.stars(30) + sp.planet(330, 64) + sp.blimp(150, 70, 0.55) + sp.moonGround() + sp.abuela(372, 340) + manuel(52, 346, 0.85, 3),
};
let sceneEra = 0;
function renderScene() {
  if (sceneEra === S.chapter) return; sceneEra = S.chapter;
  const svg = $('sceneArt'); svg.innerHTML = SCENES[S.chapter]() + (S.chapter === 12 ? '' : sp.shadow());
  const ab = svg.querySelector('[data-abuela]'); const mn = svg.querySelector('[data-manuel]');
  const wire = (node, linesFn) => { if (!node) return; const say = (e) => { e.preventDefault(); e.stopPropagation(); speak(node, linesFn()); }; node.addEventListener('pointerdown', say); node.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') say(e); }); };
  wire(ab, () => DATA.abuelaLines.any.concat(DATA.abuelaLines['life' + S.life] || []));
  wire(mn, () => DATA.manuelLines.any.concat(DATA.manuelLines['life' + S.life] || []));
}
let speechEl = null, speechTimer = null;
function speak(node, lines) {
  const line = pick(lines); if (speechEl) speechEl.remove();
  const scene = $('scene'); const r = scene.getBoundingClientRect(); const b = node.getBoundingClientRect();
  const s = el('div', 'speech', line); const cx = clamp(b.left + b.width / 2 - r.left, 90, r.width - 90);
  s.style.left = cx + 'px'; s.style.top = Math.max(8, b.top - r.top - 20) + 'px'; scene.appendChild(s); speechEl = s;
  clearTimeout(speechTimer); speechTimer = setTimeout(() => { s.classList.add('out'); setTimeout(() => s.remove(), 300); }, 3600);
  chime(523); chime(659, 0.08);
}
let portraitLife = 0;
function renderPortrait() { if (portraitLife === S.life) return; portraitLife = S.life; $('portrait').innerHTML = portraitSVG(S.life, 40); }
function applySkin() { document.body.dataset.skin = S.skin; }

/* ==========================================================================
   VFX engine (one canvas over everything, only animates while busy)
   ========================================================================== */
const FX = (() => {
  const canvas = $('fx'); const ctx = canvas.getContext('2d'); const probe = document.createElement('canvas').getContext('2d');
  let parts = [], rings = [], flashes = [], raf = 0, last = 0, w = 0, h = 0, dpr = 1;
  const COLORS = { coin: ['#ffb52e', '#ffd479', '#f2b134'], crumb: ['#f2b134', '#8fd14f', '#ff5a3c', '#ffd54a'], star: ['#ffd479', '#fff3e2', '#ffb52e'], confetti: ['#ffb52e', '#ff5a3c', '#9fdc4b', '#d96bff', '#4fc3f7', '#fff3e2'], bill: ['#9fdc4b', '#7bc043', '#b6ea6c'], heart: ['#ff4fa3', '#d96bff', '#ff5a3c'], ember: ['#ff5a3c', '#ffb52e', '#ffd54a'] };
  function resize() { dpr = Math.min(2, window.devicePixelRatio || 1); w = window.innerWidth; h = window.innerHeight; canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr); canvas.style.width = w + 'px'; canvas.style.height = h + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function kick() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  function spawn(type, x, y, vx, vy, life, size, extra) { if (!fxOn()) return; if (parts.length >= C.PARTICLE_CAP) parts.shift(); parts.push(Object.assign({ type, x, y, vx, vy, life, age: 0, size, rot: rand(0, 6.28), vr: rand(-6, 6), color: pick(COLORS[type] || COLORS.star), g: 900, drag: 0.9 }, extra)); kick(); }
  const api = {
    embers: false, resize,
    burst(x, y, type = 'crumb', n = 8) { for (let i = 0; i < n; i++) { const a = rand(0, Math.PI * 2), sp = rand(120, type === 'star' ? 520 : 380); spawn(type, x, y, Math.cos(a) * sp, Math.sin(a) * sp - 120, rand(0.5, 0.9), type === 'coin' ? rand(5, 8) : type === 'star' ? rand(6, 11) : rand(3, 6)); } },
    ring(x, y, color = '#ffd479') { if (!fxOn()) return; rings.push({ x, y, r: 12, age: 0, life: 0.55, color }); kick(); },
    flash(color) { if (!fxOn()) return; probe.fillStyle = '#000'; probe.fillStyle = color; if (probe.fillStyle === '#000000') return; flashes.push({ color, age: 0, life: 0.45 }); kick(); },
    confetti(n = 60) { for (let i = 0; i < n; i++) spawn('confetti', rand(0, w), rand(-40, -5), rand(-60, 60), rand(120, 260), rand(2.2, 3.4), rand(5, 9), { g: 140, drag: 0.98, sway: rand(1, 3), phase: rand(0, 6) }); },
    rain(type = 'bill', n = 30) { for (let i = 0; i < n; i++) spawn(type, rand(0, w), rand(-200, -10), rand(-30, 30), rand(160, 320), rand(2, 3), type === 'bill' ? rand(14, 22) : rand(6, 10), { g: 60, drag: 0.99, sway: rand(1, 2.5), phase: rand(0, 6) }); },
    rise(x, y, type = 'heart', n = 10) { for (let i = 0; i < n; i++) spawn(type, x + rand(-30, 30), y, rand(-40, 40), rand(-260, -120), rand(1, 1.6), rand(6, 12), { g: -60, drag: 0.98 }); },
    count() { return parts.length; },
  };
  function emberTick(dt) {
    if (!api.embers || !fxOn()) return;
    const r = $('tacoBtn').getBoundingClientRect(); if (Math.random() < dt * 18) spawn('ember', rand(r.left + r.width * 0.2, r.right - r.width * 0.2), r.bottom - r.height * 0.3, rand(-30, 30), rand(-160, -60), rand(0.6, 1.1), rand(3, 6), { g: -120, drag: 0.98 });
  }
  function frame(ts) {
    const dt = Math.min(0.05, (ts - last) / 1000); last = ts;
    ctx.clearRect(0, 0, w, h); emberTick(dt);
    parts = parts.filter((p) => (p.age += dt) < p.life);
    for (const p of parts) {
      p.vy += p.g * dt; p.vx *= Math.pow(p.drag, dt * 60); p.x += p.vx * dt + (p.sway ? Math.sin(p.age * 4 + p.phase) * p.sway : 0); p.y += p.vy * dt; p.rot += p.vr * dt;
      const k = 1 - p.age / p.life; ctx.globalAlpha = Math.min(1, k * 1.6); ctx.fillStyle = p.color;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      if (p.type === 'coin') { ctx.beginPath(); ctx.arc(0, 0, p.size, 0, 6.283); ctx.fill(); ctx.strokeStyle = 'rgba(58,36,24,0.7)'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.fillStyle = 'rgba(58,36,24,0.55)'; ctx.fillRect(-1, -p.size * 0.55, 2, p.size * 1.1); }
      else if (p.type === 'crumb' || p.type === 'ember') { if (p.type === 'ember') { ctx.shadowColor = p.color; ctx.shadowBlur = 10; } ctx.beginPath(); ctx.arc(0, 0, p.size * (p.type === 'ember' ? k : 1), 0, 6.283); ctx.fill(); }
      else if (p.type === 'star') { ctx.beginPath(); for (let i = 0; i < 8; i++) { const rr = i % 2 ? p.size * 0.42 : p.size; const a = i * Math.PI / 4; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); }
      else if (p.type === 'confetti') { ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); }
      else if (p.type === 'bill') { ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); ctx.strokeStyle = 'rgba(58,36,24,0.6)'; ctx.lineWidth = 1.2; ctx.strokeRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); ctx.fillStyle = 'rgba(58,36,24,0.5)'; ctx.beginPath(); ctx.arc(0, 0, p.size * 0.14, 0, 6.283); ctx.fill(); }
      else if (p.type === 'heart') { const s = p.size / 2; ctx.beginPath(); ctx.moveTo(0, s); ctx.bezierCurveTo(-s * 2, -s * 0.5, -s, -s * 1.8, 0, -s * 0.6); ctx.bezierCurveTo(s, -s * 1.8, s * 2, -s * 0.5, 0, s); ctx.fill(); }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    rings = rings.filter((r) => (r.age += dt) < r.life);
    for (const r of rings) { const k = r.age / r.life; ctx.globalAlpha = 1 - k; ctx.strokeStyle = r.color; ctx.lineWidth = 6 * (1 - k) + 1; ctx.beginPath(); ctx.arc(r.x, r.y, r.r + k * 160, 0, 6.283); ctx.stroke(); }
    flashes = flashes.filter((f) => (f.age += dt) < f.life);
    for (const f of flashes) { ctx.globalAlpha = 1 - f.age / f.life; ctx.fillStyle = f.color; ctx.fillRect(0, 0, w, h); }
    ctx.globalAlpha = 1;
    if (parts.length || rings.length || flashes.length || api.embers) raf = requestAnimationFrame(frame); else { raf = 0; ctx.clearRect(0, 0, w, h); }
  }
  window.addEventListener('resize', resize); resize();
  return api;
})();

/* ---------- rebirth cinematic ---------- */
function openRebirthCinematic() {
  if (!rebirthReady() || cinematicOpen()) return;
  const legend = nextLifeIndex() === 1; const rb = DATA.rebirths[legend ? 2 : S.life - 1]; const to = LIVES[nextLifeIndex() - 1];
  const c = $('cinematic'); c.innerHTML = '';
  const inner = el('div', 'cine-inner');
  inner.appendChild(el('div', 'cine-kicker', rb.kicker));
  inner.appendChild(el('h2', 'cine-title', rb.title));
  const ports = el('div', 'cine-portraits'); ports.innerHTML = portraitSVG(S.life, 132) + '<svg class="icon cine-arrow" aria-hidden="true"><use href="#i-bolt"></use></svg>' + portraitSVG(nextLifeIndex(), 132); inner.appendChild(ports);
  inner.appendChild(el('p', 'cine-text', rb.text));
  const stats = el('div', 'cine-stats'); stats.appendChild(el('span', null, DATA.ui.cloutLabel + ' ×' + cloutMult() + ' → ×' + (cloutMult() * 2))); stats.appendChild(el('span', null, legend ? '+' + pendingSalsa() + ' Salsa Points' : 'New shop: ' + to.name)); stats.appendChild(el('span', null, S.life < 3 && !legend ? 'Old businesses keep earning' : 'Achievements and notebook stay')); inner.appendChild(stats);
  const row = el('div', 'cine-actions');
  const go = el('button', 'btn btn-primary cine-btn', rb.button); go.type = 'button';
  const no = el('button', 'btn', 'Not yet'); no.type = 'button'; no.addEventListener('click', () => closeCinematic());
  row.appendChild(no); row.appendChild(go); inner.appendChild(row); c.appendChild(inner);
  c.setAttribute('role', 'dialog'); c.setAttribute('aria-modal', 'true'); c.hidden = false; setInert(true); hideTip(); requestAnimationFrame(() => c.classList.add('show'));
  FX.flash('rgba(217,107,255,0.25)'); FX.ring(window.innerWidth / 2, window.innerHeight / 2, '#d96bff'); chime(523); chime(659, 0.12); chime(784, 0.24); chime(1046, 0.36);
  go.addEventListener('click', () => {
    go.disabled = true; no.disabled = true; c.classList.add('go');
    FX.burst(window.innerWidth / 2, window.innerHeight / 2, 'star', 90); FX.confetti(120); FX.flash('rgba(255,243,226,0.6)'); shake(10);
    chime(1046); chime(1318, 0.1); chime(1568, 0.2); chime(2093, 0.3);
    setTimeout(() => { if (c.hidden || !c.classList.contains('go')) return; rebirth(); closeCinematic(true); }, 900);
  });
  setTimeout(() => go.focus(), 50);
}
function setInert(on) { document.querySelectorAll('.topbar, .layout, .tabbar, #toasts').forEach((n) => { n.inert = on; }); }
function closeCinematic(force) { const c = $('cinematic'); if (!force && c.classList.contains('go')) return; c.classList.remove('show', 'go'); c.hidden = true; c.innerHTML = ''; setInert(false); setTimeout(pumpStories, 200); }
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && cinematicOpen() && !$('cinematic').classList.contains('go')) closeCinematic(); });

/* ==========================================================================
   Input, render loop, boot
   ========================================================================== */
function sellTaco(e) {
  ensureAudio();
  const t = now();
  combo.count = t - combo.lastAt <= C.COMBO_WINDOW_MS ? Math.min(C.COMBO_MAX + 12, combo.count + 1) : 1; combo.lastAt = t;
  if (Math.min(combo.count, C.COMBO_MAX) > S.stats.bestCombo) S.stats.bestCombo = Math.min(combo.count, C.COMBO_MAX);
  const tier = comboTier(); if (tier !== combo.tier) { combo.tier = tier; onComboTier(tier); }
  let v = clickValue(); const crit = Math.random() < C.CRIT_CHANCE; if (crit) { v *= C.CRIT_MULT; S.stats.crits++; }
  earn(v, false); S.clicks++; S.clicksRun++; S.stats.clicksAll++;
  clickTimes.push(t); while (clickTimes.length > 120) clickTimes.shift();
  if (S.tut.clicks < 5) S.tut.clicks++;
  const x = e && e.clientX ? e.clientX : null, y = e && e.clientY ? e.clientY : null;
  floatText('+' + money(v), x, y, crit || tier >= 3); if (crit) floatText(DATA.combo.critLine, x, y == null ? null : y - 34, false, true);
  const bx = x != null ? x : window.innerWidth / 2, by = y != null ? y : window.innerHeight / 2;
  FX.burst(bx, by, 'crumb', crit ? 18 : 4 + tier); if (tier >= 2) FX.burst(bx, by, 'coin', tier);
  if (crit) { FX.ring(bx, by, '#ffd54a'); FX.burst(bx, by, 'star', 12); shake(6); chime(1568); chime(2093, 0.08); } else blip(v);
  const btn = $('tacoBtn'); btn.classList.add('pressed'); clearTimeout(btn.__pt); btn.__pt = setTimeout(() => btn.classList.remove('pressed'), 90);
  if (S.clicks % 5 === 0) checkAchievements();
}
function setTab(name) { document.querySelectorAll('.tabbar button').forEach((b) => b.classList.toggle('on', b.dataset.tab === name)); ['kitchen', 'journey', 'shop'].forEach((n) => { $('col-' + n).classList.toggle('active', n === name); }); hideTip(); }
function setBuyAmount(amount) { buyAmount = amount; document.querySelectorAll('#buySeg [data-amount]').forEach((b) => b.classList.toggle('on', b.dataset.amount === String(amount))); refreshTip(); }
function setSellMode(on) { sellMode = on; const b = document.querySelector('#buySeg [data-mode="sell"]'); b.classList.toggle('on', on); b.classList.toggle('sell', on); refreshTip(); }
function renderCombo() {
  const f = Math.min(combo.count, C.COMBO_MAX) / C.COMBO_MAX; const bar = $('comboBar'); const w = (f * 100).toFixed(1) + '%'; if (bar.__w !== w) { bar.__w = w; bar.style.width = w; }
  const tier = comboTier(); const box = $('combo'); setClass(box, 'active', combo.count > 0); box.dataset.tier = String(tier);
  setText($('comboLabel'), tier ? DATA.combo.tiers[tier - 1] + ' ×' + comboMult().toFixed(2) : DATA.combo.meterName);
}
function render() {
  if (!S) return; frameId++;
  const cashText = money(S.bank); const cashEl = $('cash'); setText(cashEl, cashText);
  setClass(cashEl, 'small', cashText.length > 13 && cashText.length <= 18); setClass(cashEl, 'tiny', cashText.length > 18);
  const rate = cps(); setText($('cps'), money(rate, { decimals: rate < 10 ? 1 : undefined }));
  setText($('handSold'), fmt(tacosSold())); setText($('clickValue'), money(clickValue(false)));
  updateTitle();
  if (dirty.shop) { dirty.shop = false; rebuildTiles(); }
  renderProducers(); renderTiles(); renderJourney(); renderHustle(); renderCombo(); renderPortrait();
  if (dirty.journal) { dirty.journal = false; renderJournal(); }
  if (dirty.scene) { dirty.scene = false; renderScene(); }
  const tacoBtn = $('tacoBtn'); setClass(tacoBtn, 'nudge', S.tut.clicks < 5 && !reducedMotion());
  const first = rows[life().producers[0]]; if (first) setClass(first.el, 'nudge', !S.tut.bought && S.bank >= unitCost(life().producers[0]) && !reducedMotion());
}
function rebuildAll() {
  syncUpgSet(); frameId++;
  document.body.dataset.era = String(S.chapter); document.body.dataset.life = String(S.life); applySkin(); document.body.classList.toggle('no-particles', !S.opts.particles);
  tileOrder = ''; hustleBuilt = ''; rebirthBuilt = ''; sceneEra = 0; portraitLife = 0;
  Object.keys(buffEls).forEach((k) => { buffEls[k].remove(); delete buffEls[k]; });
  Object.keys(dirty).forEach((k) => { dirty[k] = true; });
  syncStorm(); renderGolden(); renderScene(); renderPortrait(); renderJournal(); render();
}
function wireInput() {
  const taco = $('tacoBtn');
  taco.addEventListener('pointerdown', (e) => { if (e.button !== 0 && e.pointerType === 'mouse') return; e.preventDefault(); sellTaco(e); });
  taco.addEventListener('keydown', (e) => { if (e.repeat || cinematicOpen()) return; if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); const r = taco.getBoundingClientRect(); sellTaco({ clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }); } });
  taco.addEventListener('click', (e) => e.preventDefault()); taco.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('keydown', (e) => { if (e.key === ' ' && !e.repeat && !modalOpen() && !cinematicOpen() && (document.activeElement === document.body || document.activeElement === null)) { e.preventDefault(); const r = taco.getBoundingClientRect(); sellTaco({ clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }); } });
  document.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', () => { ensureAudio(); openPanel(b.dataset.open); }));
  $('menuBtn').addEventListener('click', openMenu);
  document.querySelectorAll('#buySeg [data-amount]').forEach((b) => b.addEventListener('click', () => setBuyAmount(b.dataset.amount === 'max' ? 'max' : +b.dataset.amount)));
  document.querySelector('#buySeg [data-mode="sell"]').addEventListener('click', () => setSellMode(!sellMode));
  document.querySelectorAll('.tabbar button').forEach((b) => b.addEventListener('click', () => setTab(b.dataset.tab)));
  window.addEventListener('resize', () => { positionTip(); });
  document.addEventListener('mousedown', (e) => { lastInputKeyboard = false; const b = e.target.closest && e.target.closest('.topnav .btn, #menuBtn, .producer, .tile, #buySeg button, .tabbar button, .item-chip'); if (b) e.preventDefault(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Tab') lastInputKeyboard = true; }, true);
  document.addEventListener('pointerdown', () => { lastInputKeyboard = false; }, true);
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(false); });
  window.addEventListener('pagehide', () => save(false)); window.addEventListener('beforeunload', () => save(false));
}
function boot() {
  S = load(); const fresh = !S; if (fresh) S = freshState();
  buildShop(); buildJourney(); wireInput();
  if (!fresh) applyOffline(true);
  lastTick = now(); rebuildAll();
  setInterval(loop, C.LOGIC_MS); setInterval(render, C.RENDER_MS); setInterval(rotateNews, C.NEWS_MS); setTimeout(rotateNews, 2500);
  if (fresh) { save(false); queueStory(1); } else pumpStories();
  if (storageFailed) toast({ title: 'Saving is off', text: DATA.ui.storageOff, icon: 'info', ms: 8000 });
  const testMode = /[?&]test=1/.test(location.search) || storeGet(C.TEST_KEY) === '1';
  if (testMode) {
    window.__mtc = {
      C, DATA, FX, combo, getState: () => S, setState: (patch) => { S = sanitize(Object.assign({}, JSON.parse(JSON.stringify(S)), patch, { v: DATA.version })); storyQueue.length = 0; endStorm(); removeGoldenEl(); rebuildAll(); return S; },
      tick: (ms) => { clockOffset += ms; loop(); render(); }, now, setClock: (ms) => { clockOffset = ms; }, spawnGolden: (id) => { spawnGolden(id); return S.golden.active; }, clickGolden,
      fmt, money, cps, clickValue, unitCost, bulkCost, maxAffordable, sellRefund, buyProducer, sellProducer, buyUpgrade, upgradeCost, buyRecipe, buyMenuItem, listDrop, collectDrop, rebirth, rebirthReady, openRebirthCinematic, closeCinematic, hardReset, sellTaco: (e) => sellTaco(e || null),
      save: () => save(false), load: () => { S = load() || freshState(); storyQueue.length = 0; endStorm(); removeGoldenEl(); rebuildAll(); return S; }, exportSave, importSave, checkAchievements, checkChapter, render, applyOffline, incomeLayers, tacosSold, pendingSalsa, closeModal, openPanel, openStory, upgrades: UPG, visibleUpgrades, producerVisible, itemCost: (id) => itemCost(itemById(id)), sanitize, freshState: () => freshState(), lives: LIVES, chapters: CH,
    };
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
