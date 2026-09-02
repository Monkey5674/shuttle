/* ==========================================================================
   Manuel's Taco Clicker — game engine and UI
   Vanilla JS, no build step. Reads DATA from data.js.
   Sections: constants & utils · storage · derived data · state & save ·
   economy · simulation systems · golden tacos · Depop drops · prestige ·
   achievements & eras · UI rendering · tooltips · modals · toasts · news ·
   scenes · input · boot · test hooks
   ========================================================================== */
(() => {
'use strict';

/* ---------- constants ---------- */
const C = Object.freeze({
  LOGIC_MS: 50, RENDER_MS: 100, MAX_STEP_MS: 5 * 60 * 1000, OFFLINE_MIN_MS: 60 * 1000,
  GOLDEN_RANGE_S: [180, 480], FIRST_GOLDEN_S: [60, 90], GOLDEN_STAY_S: 13, GOLDEN_MIN_S: 30,
  PARTICLE_CAP: 60, FLOAT_CAP: 24, TOAST_MAX: 3, TOAST_MS: 4200, STORM_CAP: 40,
  MAX_OWNED: 5000, MAX_BULK: 10000, BANK_CAP: 1e300, AUTOSAVE_MS: 30000, NEWS_MS: 10000,
  SAVE_KEY: 'manuelTaco.save.v1', BACKUP_KEY: 'manuelTaco.save.corrupt', TEST_KEY: 'mtcTest',
  HYPE_MAX: 100, OFFLINE_RATE: 0.5, OFFLINE_CAP_H: 8, PLATE_AFTER_MS: 4 * 3600 * 1000,
  TACO_EXCLUSION_PX: 190,
});
const G = DATA.costGrowth;
const SUFFIX_LONG = ['', ' thousand', ' million', ' billion', ' trillion', ' quadrillion', ' quintillion', ' sextillion', ' septillion', ' octillion', ' nonillion', ' decillion'];
const SUFFIX_SHORT = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

/* ---------- clock (single source of truth; tests can offset it) ---------- */
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

/* Number formatting. Picks the bucket after rounding so 999.95 never prints as "1000.0". */
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
function fmtTime(ms) {
  ms = Math.max(0, ms); const s = Math.floor(ms / 1000);
  if (s < 60) return s + 's';
  const m = Math.floor(s / 60), h = Math.floor(m / 60), d = Math.floor(h / 24);
  if (d > 0) return d + 'd ' + (h % 24) + 'h';
  if (h > 0) return h + 'h ' + (m % 60) + 'm';
  return m + 'm ' + (s % 60) + 's';
}
function fmtClock(ms) { ms = Math.max(0, ms); const s = Math.ceil(ms / 1000); const m = Math.floor(s / 60); const h = Math.floor(m / 60); const pad = (x) => String(x).padStart(2, '0'); return h > 0 ? h + ':' + pad(m % 60) + ':' + pad(s % 60) : m + ':' + pad(s % 60); }
function b64encode(str) { return btoa(unescape(encodeURIComponent(str))); }
function b64decode(str) { return decodeURIComponent(escape(atob(str))); }

/* ---------- storage adapter (private mode, file:// sandboxes, quota) ---------- */
const store = (() => { try { const k = '__mtc_probe'; localStorage.setItem(k, '1'); localStorage.removeItem(k); return localStorage; } catch (e) { return null; } })();
let storageFailed = !store;
function storeGet(k) { try { return store ? store.getItem(k) : null; } catch (e) { return null; } }
function storeSet(k, v) { try { if (!store) throw new Error('no storage'); store.setItem(k, v); return true; } catch (e) { storageFailed = true; return false; } }

/* ---------- derived data ---------- */
const P = DATA.producers;
const PID = {}; P.forEach((p, i) => { PID[p.id] = p; p.index = i; });
const ERAS = DATA.eras;
const TIER_THR = DATA.tierThresholds;
const OPEN_TIERS = 14; // tiers 7..20 are generated: open-ended late-game sink
const UPG = [];
const UPGID = {};
function addUpgrade(u) { UPG.push(u); UPGID[u.id] = u; }
function plural(n) { if (/ss$/.test(n)) return n + 'es'; if (/[^aeiou]y$/.test(n)) return n.slice(0, -1) + 'ies'; return n.endsWith('s') ? n : n + 's'; }
P.forEach((p) => {
  p.tiers.forEach((t, i) => addUpgrade({ id: p.id + '_t' + (i + 1), name: t.name, flavor: t.flavor, cost: p.cost * DATA.tierCostMult[i], icon: p.icon, kind: 'tier', producer: p.id, tier: i + 1, threshold: TIER_THR[i], desc: plural(p.name) + ' are twice as efficient.' }));
  for (let k = 7; k <= 6 + OPEN_TIERS; k++) {
    const thr = 150 + 50 * (k - 7);
    addUpgrade({ id: p.id + '_t' + k, name: p.name + ' Level ' + k, flavor: 'Manuel has stopped asking how. Abuela never asked.', cost: p.cost * DATA.tierCostMult[5] * Math.pow(10, k - 6), icon: p.icon, kind: 'tier', producer: p.id, tier: k, threshold: thr, desc: plural(p.name) + ' are twice as efficient.' });
  }
});
DATA.upgrades.forEach((u) => addUpgrade(Object.assign({}, u)));
DATA.synergies.forEach((s) => addUpgrade({ id: s.id, name: s.name, flavor: s.flavor, cost: PID[s.b].cost * 10, icon: s.icon, kind: 'synergy', a: s.a, b: s.b, pct: s.pct, desc: PID[s.a].name + ' +' + Math.round(s.pct * 100) + '% per ' + PID[s.b].name + ' owned.' }));
const RECIPES = DATA.recipes;
const RID = {}; RECIPES.forEach((r) => { RID[r.id] = r; });
const ACH = DATA.achievements;
const ACHID = {}; ACH.forEach((a) => { ACHID[a.id] = a; });
const GOLDEN = DATA.golden;
const ITEMS = DATA.depopItems;
const ITEMID = {}; ITEMS.forEach((i) => { ITEMID[i.id] = i; });

/* ---------- state ---------- */
let S = null;
function freshState(keep) {
  const t = now();
  const s = {
    v: DATA.version, t, created: t,
    bank: 0, lifetime: 0, lifetimeAll: 0, producerCash: 0, clicks: 0, clicksRun: 0,
    producers: {}, upgrades: [], menuItems: 0,
    buffs: [], golden: { nextAt: t + randInt(C.FIRST_GOLDEN_S[0], C.FIRST_GOLDEN_S[1]) * 1000, active: null, clicked: 0, missed: 0, streak: 0 },
    depop: { slots: [null, null, null], hype: 0, sales: 0, viral: 0, flops: 0, best: 0, earned: 0, lastItem: null },
    era: 1, seenStory: [], journal: [], firstBuys: [],
    salsa: 0, salsaSpent: 0, recipes: [], runs: 1, prestiges: 0,
    ach: [],
    stats: { playMs: 0, goldenClicked: 0, goldenMissed: 0, bestCps: 0, bestStreak: 0, clicksAll: 0, stormTacos: 0, offlineEarned: 0, upgradesBought: 0, salsaAll: 0 },
    opts: { sound: false, particles: true, shortNumbers: false, tips: true },
    tut: { clicks: 0, bought: false },
  };
  P.forEach((p) => { s.producers[p.id] = 0; });
  if (keep) Object.assign(s, keep);
  return s;
}

/* Validate and coerce anything read from storage or import. Unknown ids are dropped, numbers clamped. */
function sanitize(raw) {
  const s = freshState();
  if (!raw || typeof raw !== 'object') return s;
  const t = now();
  s.t = sane(raw.t, 0, t + 60000, t);
  s.created = sane(raw.created, 0, t, s.t);
  s.bank = sane(raw.bank); s.lifetime = sane(raw.lifetime); s.lifetimeAll = Math.max(sane(raw.lifetimeAll), s.lifetime);
  s.producerCash = sane(raw.producerCash); s.clicks = saneInt(raw.clicks, 0, 1e15); s.clicksRun = saneInt(raw.clicksRun, 0, 1e15);
  if (raw.producers && typeof raw.producers === 'object') P.forEach((p) => { s.producers[p.id] = saneInt(raw.producers[p.id], 0, C.MAX_OWNED); });
  if (Array.isArray(raw.upgrades)) s.upgrades = [...new Set(raw.upgrades.filter((id) => typeof id === 'string' && UPGID[id]))];
  s.menuItems = saneInt(raw.menuItems, 0, 1000);
  if (Array.isArray(raw.buffs)) s.buffs = raw.buffs.filter((b) => b && typeof b === 'object' && typeof b.id === 'string' && isNum(b.endsAt) && b.endsAt > t && isNum(b.mult)).map((b) => ({ id: String(b.id).slice(0, 32), kind: ['income', 'click', 'storm'].includes(b.kind) ? b.kind : 'income', mult: sane(b.mult, 1, 1e6, 1), endsAt: Math.min(b.endsAt, t + 3600 * 1000), name: typeof b.name === 'string' ? b.name.slice(0, 40) : b.id }));
  if (raw.golden && typeof raw.golden === 'object') {
    s.golden.nextAt = sane(raw.golden.nextAt, 0, t + 3600 * 1000, s.golden.nextAt);
    s.golden.clicked = saneInt(raw.golden.clicked, 0, 1e9); s.golden.missed = saneInt(raw.golden.missed, 0, 1e9); s.golden.streak = saneInt(raw.golden.streak, 0, 1e6);
    const ra = raw.golden.active;
    if (ra && typeof ra === 'object' && GOLDEN.some((g) => g.id === ra.effect) && isNum(ra.expiresAt) && ra.expiresAt > t) {
      s.golden.active = { effect: ra.effect, spawnedAt: sane(ra.spawnedAt, 0, t, t), expiresAt: Math.min(ra.expiresAt, t + C.GOLDEN_STAY_S * 4 * 1000), x: sane(ra.x, 0.05, 0.95, 0.5), y: sane(ra.y, 0.05, 0.95, 0.5) };
    } else if (ra || s.golden.nextAt < t) s.golden.nextAt = t + randInt(30, 90) * 1000;
  }
  if (raw.depop && typeof raw.depop === 'object') {
    const d = raw.depop;
    const n = Array.isArray(d.slots) ? d.slots : [];
    s.depop.slots = n.slice(0, 4).map((sl) => {
      if (!sl || typeof sl !== 'object' || !ITEMID[sl.item]) return null;
      return { item: sl.item, startedAt: sane(sl.startedAt, 0, t, t), readyAt: sane(sl.readyAt, 0, t + 24 * 3600 * 1000, t), payout: sane(sl.payout), cost: sane(sl.cost), viral: !!sl.viral, flop: !!sl.flop };
    });
    while (s.depop.slots.length < 3) s.depop.slots.push(null);
    s.depop.hype = sane(d.hype, 0, C.HYPE_MAX); s.depop.sales = saneInt(d.sales, 0, 1e9); s.depop.viral = saneInt(d.viral, 0, 1e9); s.depop.flops = saneInt(d.flops, 0, 1e9);
    s.depop.best = sane(d.best); s.depop.earned = sane(d.earned); s.depop.lastItem = ITEMID[d.lastItem] ? d.lastItem : null;
  }
  s.era = saneInt(raw.era, 1, ERAS.length, 1);
  if (Array.isArray(raw.seenStory)) s.seenStory = raw.seenStory.filter((n) => Number.isInteger(n) && n >= 1 && n <= ERAS.length);
  if (Array.isArray(raw.journal)) s.journal = raw.journal.filter((j) => j && typeof j.id === 'string' && isNum(j.t)).slice(-200).map((j) => ({ id: j.id.slice(0, 40), t: j.t }));
  if (Array.isArray(raw.firstBuys)) s.firstBuys = [...new Set(raw.firstBuys.filter((id) => PID[id]))];
  s.salsa = saneInt(raw.salsa, 0, 1e9); s.salsaSpent = saneInt(raw.salsaSpent, 0, s.salsa);
  if (Array.isArray(raw.recipes)) s.recipes = [...new Set(raw.recipes.filter((id) => RID[id]))];
  s.runs = saneInt(raw.runs, 1, 1e6, 1); s.prestiges = saneInt(raw.prestiges, 0, 1e6);
  if (Array.isArray(raw.ach)) s.ach = [...new Set(raw.ach.filter((id) => ACHID[id]))];
  if (raw.stats && typeof raw.stats === 'object') Object.keys(s.stats).forEach((k) => { s.stats[k] = sane(raw.stats[k], 0, 1e300); });
  if (raw.opts && typeof raw.opts === 'object') Object.keys(s.opts).forEach((k) => { if (typeof raw.opts[k] === 'boolean') s.opts[k] = raw.opts[k]; });
  if (raw.tut && typeof raw.tut === 'object') { s.tut.clicks = saneInt(raw.tut.clicks, 0, 1000); s.tut.bought = !!raw.tut.bought; }
  if (P.some((p) => s.producers[p.id] > 0)) { s.tut.bought = true; s.tut.clicks = Math.max(s.tut.clicks, 5); }
  // migrations by version would go here (raw.v < DATA.version)
  return s;
}

let lastSaveAt = 0;
function serialize() { S.t = now(); return JSON.stringify(S); }
function save(manual) {
  if (!S) return false;
  const ok = storeSet(C.SAVE_KEY, serialize());
  lastSaveAt = now();
  if (manual && ok) toast({ title: 'Saved', text: 'Abuela wrote it in the notebook.', icon: 'check', cls: 'lime', ms: 1800 });
  if (!ok && !storageWarned) { storageWarned = true; toast({ title: 'Saving is off', text: DATA.ui.storageOff, icon: 'info', ms: 8000 }); }
  return ok;
}
let storageWarned = false;
let saveTimer = null;
function saveSoon() { if (saveTimer) return; saveTimer = setTimeout(() => { saveTimer = null; save(false); }, 1000); }
function load() {
  const raw = storeGet(C.SAVE_KEY);
  if (!raw) return null;
  try { const obj = JSON.parse(raw); return sanitize(obj); }
  catch (e) { storeSet(C.BACKUP_KEY, raw); console.warn('Save was unreadable; kept a copy under', C.BACKUP_KEY); return null; }
}
function exportSave() { return b64encode(serialize()); }
function importSave(str) {
  let obj;
  try { obj = JSON.parse(b64decode(String(str).trim())); } catch (e) { try { obj = JSON.parse(String(str).trim()); } catch (e2) { return false; } }
  if (!obj || typeof obj !== 'object' || !obj.producers) return false;
  S = sanitize(obj);
  storyQueue.length = 0; endStorm(); removeGoldenEl();
  applyOffline(true);
  rebuildAll();
  save(false);
  return true;
}

/* ---------- economy ---------- */
let upgSet = new Set();
function syncUpgSet() { upgSet = new Set(S.upgrades); }
const has = (id) => { if (upgSet.size !== S.upgrades.length) syncUpgSet(); return upgSet.has(id); };
const hasRecipe = (id) => S.recipes.includes(id);
function tiersOwned(pid) { let n = 0; for (let k = 1; k <= 6 + OPEN_TIERS; k++) if (has(pid + '_t' + k)) n++; return n; }
function producerMult(pid) {
  let m = Math.pow(2, tiersOwned(pid));
  for (const syn of DATA.synergies) if (syn.a === pid && has(syn.id)) m *= 1 + syn.pct * S.producers[syn.b];
  return m;
}
function producerRate(pid) { return PID[pid].income * producerMult(pid); }
function reputation() { return S.ach.length * 0.02; }
function activeBuffMult(kind) { let m = 1; const t = now(); for (const b of S.buffs) if (b.kind === kind && b.endsAt > t) m *= b.mult; return m; }
/* Returns [{label, mult}] layers and the product. withBuffs=false gives the "base" income used for Depop costs. */
function incomeLayers(withBuffs = true) {
  const L = [];
  const eraMult = 1 + DATA.eraBonus * (S.era - 1); if (eraMult !== 1) L.push({ label: 'Chapter ' + S.era + ': ' + ERAS[S.era - 1].name, mult: eraMult });
  for (const u of UPG) if (u.kind === 'global' && has(u.id)) L.push({ label: u.name, mult: 1 + u.effect.globalMult });
  const repK = UPG.filter((u) => u.kind === 'rep' && has(u.id)).reduce((a, u) => a + u.effect.repMult, 0);
  if (repK > 0) L.push({ label: 'Reputation ' + Math.round(reputation() * 100) + '% (' + S.ach.length + ' achievements)', mult: 1 + (reputation() / 0.1) * repK });
  if (S.salsa > 0) L.push({ label: 'Salsa Points (' + S.salsa + ')', mult: 1 + 0.05 * S.salsa });
  for (const r of RECIPES) if (hasRecipe(r.id) && r.effect.globalMult) L.push({ label: r.name, mult: 1 + r.effect.globalMult });
  if (S.menuItems > 0) L.push({ label: 'New Menu Items (' + S.menuItems + ')', mult: Math.pow(1 + DATA.menuItem.bonus, S.menuItems) });
  if (withBuffs) {
    if (S.depop.hype > 0.5) L.push({ label: 'Hype ' + Math.round(S.depop.hype) + '%', mult: 1 + S.depop.hype / 200 });
    const t = now();
    for (const b of S.buffs) if (b.kind === 'income' && b.endsAt > t) L.push({ label: b.name, mult: b.mult });
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
  const L = [];
  let mult = 1, pct = 0;
  for (const u of UPG) if (u.kind === 'click' && has(u.id)) { if (u.effect.clickMult) { mult *= u.effect.clickMult; L.push({ label: u.name, mult: u.effect.clickMult }); } if (u.effect.clickPct) pct += u.effect.clickPct; }
  for (const r of RECIPES) if (hasRecipe(r.id) && r.effect.clickMult) { mult *= r.effect.clickMult; L.push({ label: r.name, mult: r.effect.clickMult }); }
  const buff = activeBuffMult('click'); if (buff !== 1) L.push({ label: 'Click Fiesta', mult: buff });
  return { layers: L, mult, pct, buff };
}
function clickValue() { const c = clickLayers(); return (1 + c.pct * cps()) * c.mult * c.buff; }
function costMult() { return hasRecipe('playbook') ? RID.playbook.effect.costMult : 1; }
function unitCost(pid, owned = S.producers[pid]) { return Math.ceil(PID[pid].cost * costMult() * Math.pow(G, owned)); }
function bulkCost(pid, k, owned = S.producers[pid]) { if (k <= 0) return 0; return Math.ceil(PID[pid].cost * costMult() * Math.pow(G, owned) * (Math.pow(G, k) - 1) / (G - 1)); }
function maxAffordable(pid, cash = S.bank) {
  const owned = S.producers[pid];
  const base = PID[pid].cost * costMult() * Math.pow(G, owned);
  if (!isNum(base) || base <= 0 || cash < base) return 0;
  let k = Math.floor(Math.log(cash * (G - 1) / base + 1) / Math.log(G));
  k = clamp(k, 0, Math.min(C.MAX_BULK, C.MAX_OWNED - owned));
  while (k < C.MAX_OWNED - owned && bulkCost(pid, k + 1, owned) <= cash) k++;
  while (k > 0 && bulkCost(pid, k, owned) > cash) k--;
  return k;
}
function sellRefund(pid, k) { const owned = S.producers[pid]; k = Math.min(k, owned); if (k <= 0) return 0; return Math.floor(bulkCost(pid, k, owned - k) * DATA.sellRefund); }
function menuItemCost() { return DATA.menuItem.baseCost * Math.pow(DATA.menuItem.costMult, S.menuItems); }

function producerVisible(p) { return S.producers[p.id] > 0 || (S.era >= p.era - 1 && Math.max(S.lifetime, S.bank) >= p.cost * 0.4); }
function upgradeUnlocked(u) {
  if (u.kind === 'tier') return S.producers[u.producer] >= u.threshold;
  if (u.kind === 'synergy') return S.producers[u.a] >= 15 && S.producers[u.b] >= 15;
  if (u.kind === 'rep') return S.ach.length >= u.unlock.achievements;
  if (u.kind === 'depop') return depopUnlocked();
  return S.lifetime >= (u.unlock.lifetime || 0);
}
function depopUnlocked() { return S.era >= 5 || hasRecipe('viral'); }
function depopSlotCount() { return 3 + (has('depop_bulk') ? 1 : 0); }
function goldenFreqMult() { let m = 1; for (const u of UPG) if (u.kind === 'golden' && has(u.id) && u.effect.goldenFreq) m *= u.effect.goldenFreq; if (hasRecipe('palate')) m *= RID.palate.effect.goldenFreq; return m; }
function goldenStayMult() { let m = 1; for (const u of UPG) if (u.kind === 'golden' && has(u.id) && u.effect.goldenStay) m *= u.effect.goldenStay; if (hasRecipe('legend')) m *= RID.legend.effect.goldenStay; return m; }
function goldenDurMult() { let m = 1; for (const u of UPG) if (u.kind === 'golden' && has(u.id) && u.effect.goldenDur) m *= u.effect.goldenDur; return m; }
function offlineSettings() { let rate = C.OFFLINE_RATE, cap = C.OFFLINE_CAP_H; if (has('offline_prep')) { rate = Math.max(rate, 0.75); cap = Math.max(cap, 12); } if (hasRecipe('overnight')) { rate = 1; cap = 24; } return { rate, capMs: cap * 3600 * 1000 }; }
function tacosSold() { return S.clicks + Math.floor(S.producerCash / DATA.tacoPrice); }
function pendingSalsa() { return Math.max(0, Math.floor(Math.cbrt(S.lifetimeAll / 1e9)) - S.salsa); }
function nextSalsaAt() { return Math.pow(S.salsa + pendingSalsa() + 1, 3) * 1e9; }

/* ---------- purchases ---------- */
const dirty = { shop: true, scene: true, journey: true, depop: true, journal: true };
function earn(amount, fromProducers) {
  if (!isNum(amount) || amount <= 0) return;
  S.bank = Math.min(S.bank + amount, C.BANK_CAP); S.lifetime += amount; S.lifetimeAll += amount;
  if (fromProducers) S.producerCash += amount;
}
function buyProducer(pid, amount) {
  const p = PID[pid]; if (!p || !producerVisible(p)) return 0;
  const owned = S.producers[pid];
  let k = amount === 'max' ? maxAffordable(pid) : Math.min(amount, C.MAX_OWNED - owned);
  if (k <= 0) return 0;
  const cost = bulkCost(pid, k, owned);
  if (cost > S.bank) return 0;
  S.bank -= cost; S.producers[pid] = owned + k;
  if (!S.firstBuys.includes(pid)) { S.firstBuys.push(pid); journalAdd('first_' + pid); if (S.firstBuys.length > 1) toast({ kicker: 'New business', title: p.name, text: p.desc, icon: p.icon, cls: 'gold' }); }
  S.tut.bought = true;
  afterPurchase(); return k;
}
function sellProducer(pid, amount) {
  const owned = S.producers[pid]; if (owned <= 0) return 0;
  const k = Math.min(amount === 'max' ? owned : amount, owned);
  const refund = sellRefund(pid, k);
  S.producers[pid] = owned - k; S.bank = Math.min(S.bank + refund, C.BANK_CAP);
  afterPurchase(); return k;
}
function buyUpgrade(id) {
  const u = UPGID[id]; if (!u || has(id) || !upgradeUnlocked(u)) return false;
  if (S.bank < u.cost) return false;
  S.bank -= u.cost; S.upgrades.push(id); S.stats.upgradesBought++;
  if (u.effect && u.effect.dropSlots) { while (S.depop.slots.length < depopSlotCount()) S.depop.slots.push(null); dirty.depop = true; }
  afterPurchase(); return true;
}
function buyMenuItem() { const c = menuItemCost(); if (S.bank < c) return false; S.bank -= c; S.menuItems++; S.stats.upgradesBought++; afterPurchase(); return true; }
function buyRecipe(id) {
  const r = RID[id]; if (!r || hasRecipe(id)) return false;
  if (S.salsa - S.salsaSpent < r.cost) return false;
  S.salsaSpent += r.cost; S.recipes.push(id);
  if (r.effect.depopStart) dirty.depop = true;
  afterPurchase(); return true;
}
function afterPurchase() { syncUpgSet(); frameId++; dirty.shop = true; dirty.journey = true; checkEra(); checkAchievements(); saveSoon(); }

/* ---------- buffs ---------- */
function addBuff(id, kind, mult, seconds, name) {
  const t = now(); const endsAt = t + seconds * 1000;
  const ex = S.buffs.find((b) => b.id === id);
  if (ex) ex.endsAt = Math.max(ex.endsAt, endsAt); else S.buffs.push({ id, kind, mult, endsAt, name });
  dirty.journey = true;
}
function pruneBuffs() { const t = now(); const n = S.buffs.length; S.buffs = S.buffs.filter((b) => b.endsAt > t); if (S.buffs.length !== n) dirty.journey = true; syncStorm(); }
function syncStorm() { const live = S.buffs.some((b) => b.kind === 'storm' && b.endsAt > now()); if (live && !stormOn) startStorm(); else if (!live && stormOn) endStorm(); }

/* ---------- simulation ---------- */
let lastTick = 0, acc = 0, secondAcc = 0;
function loop() {
  if (!S) return;
  const t = now(); let dt = t - lastTick; lastTick = t;
  if (dt <= 0) return;
  if (dt > C.MAX_STEP_MS) {
    acc = 0;
    for (let i = 0; i < C.MAX_STEP_MS / 1000; i++) step(1000);
    const rest = dt - C.MAX_STEP_MS;
    if (rest >= C.OFFLINE_MIN_MS) applyOffline(false, rest); else lastTick = now();
    return;
  }
  acc += dt;
  const stepMs = dt > 2000 ? 1000 : C.LOGIC_MS;
  let guard = 0;
  while (acc >= stepMs && guard++ < 100000) { step(stepMs); acc -= stepMs; }
}
function step(ms) {
  frameId++;
  const rate = cps();
  earn(rate * ms / 1000, true);
  S.stats.playMs += ms;
  if (rate > S.stats.bestCps) S.stats.bestCps = rate;
  pruneBuffs();
  goldenTick();
  stormTick(ms);
  depopTick(ms);
  secondAcc += ms;
  if (secondAcc >= 1000) { secondAcc = 0; checkEra(); checkAchievements(); if (now() - lastSaveAt > C.AUTOSAVE_MS) save(false); }
}
/* Offline / catch-up. Called on load and when the loop notices a gap longer than MAX_STEP_MS. */
function applyOffline(fromLoad, dtOverride) {
  const t = now();
  const elapsedRaw = dtOverride != null ? dtOverride : t - S.t;
  const { rate, capMs } = offlineSettings();
  const elapsed = clamp(elapsedRaw, 0, capMs);
  lastTick = t; acc = 0;
  S.buffs = S.buffs.filter((b) => b.endsAt > t); syncStorm();
  if (elapsed < C.OFFLINE_MIN_MS) return;
  const income = cps(false) * rate * elapsed / 1000;
  earn(income, true); S.stats.offlineEarned += income;
  S.depop.hype = Math.max(0, S.depop.hype - elapsed / 1000 / DATA.hypeDecayPer);
  if (S.golden.nextAt < t) S.golden.nextAt = t + randInt(10, 30) * 1000;
  if (S.golden.active) { S.golden.active = null; removeGoldenEl(); }
  if (elapsedRaw >= C.PLATE_AFTER_MS) addBuff('plate', 'income', 2, 300, 'Abuela saved you a plate');
  if (income > 0 || fromLoad) toast({ title: 'While you were away', text: DATA.ui.offlineToast.replace('{time}', fmtTime(elapsed)).replace('{amount}', money(income)), icon: 'moon', ms: 7000 });
  dirty.shop = dirty.journey = dirty.depop = true;
  checkEra(); checkAchievements();
}

/* ---------- golden tacos ---------- */
let goldenEl = null;
function goldenInterval() { return Math.max(C.GOLDEN_MIN_S, randInt(C.GOLDEN_RANGE_S[0], C.GOLDEN_RANGE_S[1]) / goldenFreqMult()) * 1000; }
function pickGoldenEffect() {
  const pool = GOLDEN.filter((g) => !g.minEra || S.era >= g.minEra);
  const total = pool.reduce((a, g) => a + g.weight, 0); let r = Math.random() * total;
  for (const g of pool) { r -= g.weight; if (r <= 0) return g; }
  return pool[0];
}
function goldenTick() {
  const t = now(); const g = S.golden;
  if (g.active) {
    if (t >= g.active.expiresAt) { g.active = null; g.streak = 0; g.missed++; S.stats.goldenMissed++; removeGoldenEl(); g.nextAt = t + goldenInterval(); updateTitle(true); }
    else if (goldenEl && !goldenEl.classList.contains('fading') && g.active.expiresAt - t < 1000) goldenEl.classList.add('fading');
    return;
  }
  if (t >= g.nextAt && !modalOpen()) spawnGolden();
}
function spawnGolden(effectId) {
  const t = now(); const eff = (effectId && GOLDEN.find((x) => x.id === effectId)) || pickGoldenEffect();
  const stay = C.GOLDEN_STAY_S * goldenStayMult() * 1000;
  const pos = goldenPosition();
  S.golden.active = { effect: eff.id, spawnedAt: t, expiresAt: t + stay, x: pos.x, y: pos.y };
  renderGolden();
  updateTitle(true);
  chime(880);
}
function goldenPosition() {
  const layer = $('goldenLayer'); const rect = layer.getBoundingClientRect();
  const w = rect.width, h = rect.height;
  let maxX = w - 80;
  const shop = $('col-shop');
  if (!isMobileLayout() && shop) { const sr = shop.getBoundingClientRect(); maxX = Math.min(maxX, sr.left - rect.left - 80); }
  const taco = $('tacoBtn').getBoundingClientRect(); const tc = { x: taco.left + taco.width / 2 - rect.left, y: taco.top + taco.height / 2 - rect.top };
  let x = 80, y = 80;
  for (let i = 0; i < 12; i++) {
    x = rand(80, Math.max(81, maxX)); y = rand(80, Math.max(81, h - 80));
    if (Math.hypot(x - tc.x, y - tc.y) > C.TACO_EXCLUSION_PX) break;
  }
  return { x: x / Math.max(1, w), y: y / Math.max(1, h) };
}
function renderGolden() {
  removeGoldenEl();
  const a = S.golden.active; if (!a) return;
  const b = el('button', 'golden-taco'); b.type = 'button'; b.setAttribute('aria-label', 'Golden taco! Grab it quickly');
  b.innerHTML = '<svg viewBox="0 0 240 200" aria-hidden="true"><use href="#taco"></use></svg>';
  b.style.left = 'calc(' + (a.x * 100).toFixed(2) + '% - 48px)'; b.style.top = 'calc(' + (a.y * 100).toFixed(2) + '% - 40px)';
  b.addEventListener('pointerdown', (e) => { e.preventDefault(); clickGolden(); });
  b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clickGolden(); } });
  $('goldenLayer').appendChild(b); goldenEl = b;
}
function removeGoldenEl() { if (goldenEl) { goldenEl.remove(); goldenEl = null; } }
function clickGolden() {
  const a = S.golden.active; if (!a) return;
  const eff = GOLDEN.find((g) => g.id === a.effect) || GOLDEN[0];
  S.golden.active = null; removeGoldenEl();
  S.golden.clicked++; S.stats.goldenClicked++; S.golden.streak++; S.stats.bestStreak = Math.max(S.stats.bestStreak, S.golden.streak);
  const streakBonus = 1 + Math.min(5, S.golden.streak - 1) * 0.05;
  S.golden.nextAt = now() + goldenInterval();
  const dur = goldenDurMult() * streakBonus;
  let text = eff.toast;
  if (eff.kind === 'income') addBuff(eff.id, 'income', eff.mult, eff.duration * dur, eff.name);
  else if (eff.kind === 'click') addBuff(eff.id, 'click', eff.mult, eff.duration * dur, eff.name);
  else if (eff.kind === 'storm') { addBuff('storm', 'storm', 1, eff.duration * dur, eff.name); startStorm(); }
  else if (eff.kind === 'cash') { const amt = Math.floor(Math.min(S.bank * 0.15, cps() * 900) * streakBonus) + 13; earn(amt, false); text = eff.toast.replace('{amount}', money(amt)); floatText('+' + money(amt), null, null, true); }
  if (S.golden.clicked === 1) journalAdd('golden_first');
  toast({ kicker: 'Golden taco', title: eff.name, text, icon: 'star', cls: 'gold' });
  chime(1320); chime(1760, 0.12);
  frameId++; updateTitle(true); dirty.journey = true; checkAchievements(); saveSoon();
}

/* ---------- taco storm ---------- */
let stormOn = false, stormAcc = 0, stormEls = [];
function startStorm() { stormOn = true; stormAcc = 0; $('tacoBtn').classList.add('frenzy'); }
function endStorm() { if (!stormOn) return; stormOn = false; stormEls.forEach((e) => e.remove()); stormEls = []; $('tacoBtn').classList.remove('frenzy'); }
function stormTick(ms) {
  if (!stormOn) return;
  stormAcc += ms;
  if (stormAcc >= 220 && stormEls.length < C.STORM_CAP && !reducedMotion()) {
    stormAcc = 0;
    const scene = $('scene'); const b = el('button', 'storm-taco'); b.type = 'button'; b.setAttribute('aria-label', 'Storm taco');
    b.innerHTML = '<svg viewBox="0 0 240 200" aria-hidden="true"><use href="#taco"></use></svg>';
    b.style.left = rand(4, 86) + '%'; b.style.top = rand(2, 70) + '%';
    const grab = (e) => { e.preventDefault(); if (!b.isConnected) return; const amt = Math.max(1, cps() * 2); earn(amt, false); S.stats.stormTacos++; floatText('+' + money(amt), e.clientX, e.clientY); crumbs(e.clientX, e.clientY, 6); chime(1100); b.remove(); stormEls = stormEls.filter((x) => x !== b); };
    b.addEventListener('pointerdown', grab);
    scene.appendChild(b); stormEls.push(b);
    setTimeout(() => { if (b.isConnected) { b.remove(); stormEls = stormEls.filter((x) => x !== b); } }, 3200);
  }
}

/* ---------- Depop drops ---------- */
function itemCost(item) { return Math.max(item.minCost, Math.ceil(item.costSeconds * cps(false))); }
function itemAvailable(item) { return !item.requires || has(item.requires); }
function listDrop(slotIdx, itemId) {
  if (!depopUnlocked()) return false;
  const item = ITEMID[itemId]; if (!item || !itemAvailable(item)) return false;
  while (S.depop.slots.length < depopSlotCount()) S.depop.slots.push(null);
  if (slotIdx < 0 || slotIdx >= depopSlotCount() || S.depop.slots[slotIdx]) return false;
  const cost = itemCost(item); if (S.bank < cost) return false;
  S.bank -= cost;
  const viralChance = has('depop_radar') ? UPGID.depop_radar.effect.viral : DATA.viralBase;
  const viral = Math.random() < viralChance;
  const flop = !viral && Math.random() < DATA.flopChance;
  const payout = cost * (flop ? 0.75 : item.payout) * (viral ? 2 : 1) * (has('depop_verified') ? UPGID.depop_verified.effect.dropPayout : 1);
  const t = now(); const sell = item.sellSeconds * 1000 / (has('depop_ring') ? UPGID.depop_ring.effect.dropSpeed : 1);
  S.depop.slots[slotIdx] = { item: item.id, startedAt: t, readyAt: t + sell, payout: Math.floor(payout), cost, viral, flop };
  S.depop.lastItem = item.id;
  dirty.depop = true; saveSoon(); return true;
}
function collectDrop(slotIdx, silent) {
  const sl = S.depop.slots[slotIdx]; if (!sl || now() < sl.readyAt) return false;
  const item = ITEMID[sl.item];
  earn(sl.payout, false);
  S.depop.slots[slotIdx] = null;
  S.depop.sales++; S.depop.earned += sl.payout; if (sl.payout > S.depop.best) S.depop.best = sl.payout;
  if (sl.viral) { S.depop.viral++; S.depop.hype = Math.min(C.HYPE_MAX, S.depop.hype + item.hype + 30); if (!silent) toast({ kicker: 'Went viral', title: item.name + ' ×2', text: pick(DATA.buyerLines) + ' Then everyone else. ' + money(sl.payout) + '.', icon: 'sparkle', cls: 'berry' }); if (S.depop.viral === 1) journalAdd('viral_first'); }
  else if (sl.flop) { S.depop.flops++; if (!silent) toast({ kicker: 'Depop', title: item.name, text: DATA.ui.flopToast + ' ' + money(sl.payout) + ' back.', icon: 'shirt' }); }
  else { S.depop.hype = Math.min(C.HYPE_MAX, S.depop.hype + item.hype); if (!silent) toast({ kicker: 'Depop sale', title: '+' + money(sl.payout), text: pick(DATA.buyerLines), icon: 'shirt', cls: 'lime', ms: 3000 }); }
  if (S.depop.sales === 1) journalAdd('depop_first');
  dirty.depop = true; dirty.journey = true; checkAchievements(); saveSoon(); return true;
}
function collectAll() { let n = 0; for (let i = 0; i < S.depop.slots.length; i++) if (collectDrop(i, n > 0)) n++; return n; }
function depopTick(ms) {
  if (S.depop.hype > 0) { S.depop.hype = Math.max(0, S.depop.hype - ms / 1000 / DATA.hypeDecayPer); }
  if (has('depop_auto')) { const t = now(); for (let i = 0; i < S.depop.slots.length; i++) { const sl = S.depop.slots[i]; if (sl && t >= sl.readyAt) { const item = sl.item; collectDrop(i, true); listDrop(i, item); } } }
}

/* ---------- prestige: a new summer ---------- */
function newSummer() {
  const gain = pendingSalsa(); if (gain < 1) return false;
  storyQueue.length = 0; if (modalOpen()) closeModal();
  const keep = {
    created: S.created, lifetimeAll: S.lifetimeAll, clicks: S.clicks, salsa: S.salsa + gain, salsaSpent: S.salsaSpent, recipes: S.recipes.slice(),
    runs: S.runs + 1, prestiges: S.prestiges + 1, ach: S.ach.slice(), stats: Object.assign({}, S.stats), opts: Object.assign({}, S.opts),
    journal: S.journal.slice(), tut: { clicks: 99, bought: true }, seenStory: [1],
  };
  keep.stats.salsaAll = keep.salsa;
  S = freshState(keep);
  if (hasRecipe('headstart')) S.bank = RID.headstart.effect.startCash;
  journalAdd('run_' + S.runs);
  endStorm(); removeGoldenEl();
  save(false); rebuildAll();
  toast({ kicker: 'A new summer', title: '+' + gain + ' Salsa Points', text: 'Income +' + Math.round(gain * 5) + '% forever. Summer ' + S.runs + ' begins.', icon: 'chef', cls: 'berry', ms: 6000 });
  checkAchievements();
  return true;
}
function hardReset() { storyQueue.length = 0; if (modalOpen()) closeModal(); S = freshState(); endStorm(); removeGoldenEl(); save(false); rebuildAll(); queueStory(1); }

/* ---------- eras, journal, achievements ---------- */
const storyQueue = [];
function computeEra() { let e = 1; for (const era of ERAS) { if (S.lifetime >= era.threshold || (era.flagship && S.producers[era.flagship] > 0)) e = Math.max(e, era.n); } return e; }
function checkEra() {
  const e = computeEra(); if (e <= S.era) return;
  const from = S.era; S.era = e;
  document.body.dataset.era = String(e);
  for (let n = from + 1; n <= e; n++) { journalAdd('era_' + n); queueStory(n); }
  dirty.scene = dirty.shop = dirty.journey = dirty.depop = true;
  const gainPct = Math.round(((1 + DATA.eraBonus * (e - 1)) / (1 + DATA.eraBonus * (from - 1)) - 1) * 100);
  toast({ kicker: 'Chapter ' + e, title: ERAS[e - 1].name, text: 'All income +' + gainPct + '% from now on.', icon: ERAS[e - 1].icon, cls: 'gold' });
  chime(660); chime(880, 0.15); chime(1320, 0.3);
  save(false);
}
function queueStory(n) { if (S.seenStory.includes(n)) return; storyQueue.push(n); pumpStories(); }
function pumpStories() { if (modalOpen()) return; while (storyQueue.length) { const n = storyQueue.shift(); if (S.seenStory.includes(n) || n > S.era) continue; S.seenStory.push(n); saveSoon(); openStory(n); return; } }
function journalAdd(id) { if (S.journal.some((j) => j.id === id)) return; S.journal.push({ id, t: now() }); dirty.journal = true; }
function journalText(id) {
  let m;
  if ((m = /^era_(\d+)$/.exec(id))) { const e = ERAS[+m[1] - 1]; return { title: 'Chapter ' + e.n + ': ' + e.name, text: e.text.split('. ').slice(0, 2).join('. ') + '.' }; }
  if ((m = /^first_(\w+)$/.exec(id))) { const p = PID[m[1]]; return p ? { title: 'First ' + p.name, text: p.flavor } : null; }
  if ((m = /^run_(\d+)$/.exec(id))) return { title: 'Summer ' + m[1] + ' begins', text: DATA.ui.newSummer };
  if (id === 'golden_first') return { title: 'The first golden taco', text: 'It shimmered on the counter for thirteen seconds. Manuel did not hesitate.' };
  if (id === 'viral_first') return { title: 'It went viral', text: 'Diego refreshed the page until his thumb hurt. Abuela framed the screenshot.' };
  if (id === 'depop_first') return { title: 'First Depop sale', text: 'Abuela wrapped it in tissue paper and wrote a note. The note was longer than the receipt.' };
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
    case 'era': return [S.era, a.v];
    case 'prestiges': return [S.prestiges, a.v];
    case 'salsa': return [S.salsa, a.v];
    case 'depopSales': return [S.depop.sales, a.v];
    case 'depopViral': return [S.depop.viral, a.v];
    case 'hype': return [S.depop.hype, a.v];
    case 'fastClicks': return [Math.min(clickTimes.length, 100), a.v];
    case 'upgrades': return [S.upgrades.length + S.menuItems, a.v];
    case 'playtime': return [S.stats.playMs / 1000, a.v];
    default: return [0, 1];
  }
}
function achievementMet(a) {
  if (a.kind === 'fastClicks') { const t = now(); while (clickTimes.length && t - clickTimes[0] > 10000) clickTimes.shift(); return clickTimes.length >= a.v; }
  if (a.kind === 'hype') return S.depop.hype >= a.v - 0.5;
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
  if (won) { dirty.shop = true; saveSoon(); }
}

/* ==========================================================================
   UI
   ========================================================================== */
let buyAmount = 1, sellMode = false;
const isMobileLayout = () => window.matchMedia('(max-width: 820px)').matches;
const modalOpen = () => $('modalRoot').classList.contains('open');

/* ---------- sound (lazy AudioContext, created on a user gesture) ---------- */
let audio = null, lastBlip = 0;
function ensureAudio() { if (audio || !S.opts.sound) return; try { audio = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audio = null; } }
function tone(freq, delay = 0, dur = 0.09, gain = 0.06, type = 'triangle') {
  if (!audio || !S.opts.sound) return;
  try {
    if (audio.state === 'suspended') audio.resume();
    const t = audio.currentTime + delay; const o = audio.createOscillator(); const g = audio.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(audio.destination); o.start(t); o.stop(t + dur + 0.02);
  } catch (e) { /* audio is optional */ }
}
function blip(value) { const t = now(); if (t - lastBlip < 80) return; lastBlip = t; tone(520 + Math.min(400, Math.log10(Math.max(1, value)) * 60), 0, 0.07, 0.045, 'square'); }
function chime(freq, delay = 0) { tone(freq, delay, 0.18, 0.05, 'sine'); }

/* ---------- floaters & crumbs ---------- */
function floatText(text, clientX, clientY, big) {
  if (!S.opts.particles || reducedMotion()) return;
  const box = $('floaters'); if (box.childElementCount >= C.FLOAT_CAP) box.firstElementChild.remove();
  const r = box.getBoundingClientRect();
  const x = clientX == null ? r.width * rand(0.35, 0.65) : clientX - r.left, y = clientY == null ? r.height * 0.4 : clientY - r.top;
  const f = el('div', 'floater' + (big ? ' big' : ''), text); f.style.left = x + 'px'; f.style.top = y + 'px';
  box.appendChild(f); setTimeout(() => f.remove(), 950);
}
function crumbs(clientX, clientY, n = 8) {
  if (!S.opts.particles || reducedMotion()) return;
  const box = $('floaters'); const r = box.getBoundingClientRect();
  const x = clientX == null ? r.width / 2 : clientX - r.left, y = clientY == null ? r.height / 2 : clientY - r.top;
  for (let i = 0; i < n; i++) {
    if (box.querySelectorAll('.crumb').length >= C.PARTICLE_CAP) break;
    const c = el('div', 'crumb'); const a = rand(0, Math.PI * 2), d = rand(30, 90);
    c.style.left = x + 'px'; c.style.top = y + 'px'; c.style.setProperty('--dx', Math.cos(a) * d + 'px'); c.style.setProperty('--dy', Math.sin(a) * d + 40 + 'px');
    c.style.background = pick(['#ffb52e', '#8fd14f', '#ff5a3c', '#ffd54a']);
    box.appendChild(c); setTimeout(() => c.remove(), 720);
  }
}

/* ---------- toasts ---------- */
const toastQueue = []; let toastsShowing = 0;
function toast(o) { toastQueue.push(o); pumpToasts(); }
function pumpToasts() {
  if (toastsShowing >= C.TOAST_MAX || !toastQueue.length) return;
  const o = toastQueue.shift(); toastsShowing++;
  const t = el('div', 'toast' + (o.cls ? ' ' + o.cls : ''));
  const ic = el('div', 'toast-icon'); ic.appendChild(svgIcon(o.icon || 'info'));
  const body = el('div', 'toast-body');
  if (o.kicker) body.appendChild(el('div', 'toast-kicker', o.kicker));
  if (o.title) body.appendChild(el('div', 'toast-title', o.title));
  if (o.text) body.appendChild(el('div', 'toast-text', o.text));
  t.appendChild(ic); t.appendChild(body); $('toasts').appendChild(t);
  let closing = false, timer = 0;
  const done = () => { if (closing || !t.isConnected) return; closing = true; clearTimeout(timer); t.classList.add('out'); setTimeout(() => { t.remove(); toastsShowing--; pumpToasts(); }, 300); };
  t.addEventListener('click', done);
  timer = setTimeout(done, o.ms || C.TOAST_MS);
}

/* ---------- title ---------- */
let lastTitle = '';
function updateTitle() {
  const t = (S.golden.active ? '(!) ' : '') + money(S.bank, { short: true }) + ' · Manuel\'s Taco Clicker';
  if (t !== lastTitle) { lastTitle = t; document.title = t; }
}

/* ---------- tooltip ---------- */
const tip = { el: null, anchor: null, pinned: false, buyFn: null };
function tipContent(o) {
  const box = el('div');
  const head = el('div', 'tooltip-head'); head.appendChild(el('div', 'tooltip-name', o.name));
  if (o.cost != null) { const c = el('div', 'tooltip-cost' + (o.ok === false ? ' no' : ''), o.cost); head.appendChild(c); }
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
  y = clamp(y, 8, Math.max(8, vh - h - 8));
  t.style.left = x + 'px'; t.style.top = y + 'px';
}
function refreshTip() { if (!tip.el || !tip.el.classList.contains('show') || !tip.anchor) return; if (tip.anchor.__tip) { const b = tip.el.querySelector('button'); tip.el.innerHTML = ''; tip.el.appendChild(tip.anchor.__tip()); if (b) tip.el.appendChild(b); positionTip(); } }
function hideTip() { const t = $('tooltip'); t.classList.remove('show'); t.style.pointerEvents = 'none'; tip.anchor = null; tip.pinned = false; tip.buyFn = null; }
/* Attach hover/focus tooltip and click-to-buy with a two-step flow on touch screens. */
function attachBuyable(node, contentFn, buyFn) {
  node.__tip = contentFn;
  node.addEventListener('mouseenter', () => { if (!coarsePointer()) showTip(node, contentFn, buyFn, false); });
  node.addEventListener('mouseleave', () => { if (!tip.pinned) hideTip(); });
  node.addEventListener('focus', () => showTip(node, contentFn, buyFn, false));
  node.addEventListener('blur', () => { if (!tip.pinned) hideTip(); });
  node.addEventListener('click', (e) => {
    e.preventDefault();
    if (coarsePointer()) {
      if (tip.pinned && tip.anchor === node) { buyFn(); refreshTip(); }
      else showTip(node, contentFn, buyFn, true);
    } else { buyFn(); refreshTip(); }
  });
}
document.addEventListener('pointerdown', (e) => { if (tip.pinned && tip.anchor && !tip.anchor.contains(e.target) && !$('tooltip').contains(e.target)) hideTip(); }, true);

/* ---------- shop: producers ---------- */
const rows = {}; let lockedRow = null;
function buildShop() {
  const box = $('producers');
  P.forEach((p) => {
    const row = el('button', 'producer'); row.type = 'button'; row.dataset.pid = p.id;
    const fill = el('div', 'producer-fill'); row.appendChild(fill);
    const ic = el('div', 'producer-icon'); ic.appendChild(svgIcon(p.icon)); row.appendChild(ic);
    const main = el('div', 'producer-main'); const name = el('div', 'producer-name', p.name); const meta = el('div', 'producer-meta');
    const cost = el('span', 'producer-cost'); const rate = el('span', 'producer-rate'); meta.appendChild(cost); meta.appendChild(rate); main.appendChild(name); main.appendChild(meta);
    row.appendChild(main); const owned = el('div', 'producer-owned num zero', '0'); row.appendChild(owned);
    rows[p.id] = { el: row, fill, name, cost, rate, owned, k: 0, total: 0 };
    attachBuyable(row, () => producerTip(p), () => { if (sellMode) { const n = sellProducer(p.id, buyAmount === 'max' ? 'max' : buyAmount); if (n) chime(440); } else { const n = buyProducer(p.id, buyAmount); if (n) { chime(784); chime(1046, 0.08); } } });
    box.appendChild(row);
  });
  lockedRow = el('div', 'producer lock'); const ic = el('div', 'producer-icon'); ic.appendChild(svgIcon('lock')); lockedRow.appendChild(ic);
  const main = el('div', 'producer-main'); main.appendChild(el('div', 'producer-name', '???')); const hint = el('div', 'producer-meta'); hint.appendChild(el('span', 'producer-rate')); main.appendChild(hint); lockedRow.appendChild(main);
  box.appendChild(lockedRow);
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
  const rate = cps(); let lockedShown = false; let firstHidden = null;
  P.forEach((p) => {
    const r = rows[p.id]; const vis = producerVisible(p);
    if (r.el.hidden !== !vis) r.el.hidden = !vis;
    if (!vis) { if (!firstHidden) firstHidden = p; return; }
    const owned = S.producers[p.id];
    setText(r.owned, String(owned)); setClass(r.owned, 'zero', owned === 0);
    if (sellMode) {
      const k = Math.min(buyAmount === 'max' ? owned : buyAmount, owned);
      setText(r.cost, k > 0 ? 'Sell ' + k + ' for ' + money(sellRefund(p.id, k)) : 'Nothing to sell');
      setClass(r.el, 'selling', true); setClass(r.el, 'ok', k > 0); setClass(r.el, 'no', k <= 0); r.fill.style.width = '0%';
      setText(r.rate, owned ? moneyRate(producerCps(p.id)) : '');
      return;
    }
    setClass(r.el, 'selling', false);
    const k = buyAmount === 'max' ? Math.max(1, maxAffordable(p.id)) : buyAmount;
    const total = bulkCost(p.id, k); const ok = S.bank >= total && (buyAmount !== 'max' || maxAffordable(p.id) > 0);
    setText(r.cost, (k > 1 ? '×' + k + ' ' : '') + money(total));
    setClass(r.el, 'ok', ok); setClass(r.el, 'no', !ok);
    const pct = ok ? 100 : clamp(S.bank / total * 100, 0, 100);
    const w = pct.toFixed(1) + '%'; if (r.fill.__w !== w) { r.fill.__w = w; r.fill.style.width = w; }
    let rateText = owned ? moneyRate(producerCps(p.id)) : moneyRate(producerRate(p.id) * globalMult()) + ' each';
    if (!ok && rate > 0) rateText = 'in ' + fmtTime((total - S.bank) / rate * 1000);
    setText(r.rate, rateText);
  });
  if (firstHidden && !lockedShown) {
    lockedRow.hidden = false;
    const gatedByEra = S.era < firstHidden.era - 1;
    const hint = gatedByEra ? (ERAS[firstHidden.era - 1].hint || 'Not yet.') : 'Keep selling. Something new at ' + money(firstHidden.cost * 0.4) + ' earned.';
    setText(lockedRow.querySelector('.producer-rate'), hint);
  } else lockedRow.hidden = true;
}

/* ---------- shop: upgrades ---------- */
const tiles = {}; let tileOrder = '';
function upgradeTip(u) {
  const ok = S.bank >= u.cost;
  return tipContent({ name: u.name, cost: money(u.cost), ok, effect: u.desc, flavor: u.flavor });
}
function menuTip() { const c = menuItemCost(); return tipContent({ name: DATA.menuItem.name + ' #' + (S.menuItems + 1), cost: money(c), ok: S.bank >= c, effect: 'All income +' + Math.round(DATA.menuItem.bonus * 100) + '%. Can be bought again and again.', flavor: DATA.menuItem.flavor }); }
function visibleUpgrades() { return UPG.filter((u) => !has(u.id) && upgradeUnlocked(u)).sort((a, b) => a.cost - b.cost); }
function rebuildTiles() {
  const box = $('upgradeTiles'); const list = visibleUpgrades(); const showMenu = S.lifetime >= 1e11;
  const order = list.map((u) => u.id).join(',') + (showMenu ? ',menu' : '');
  if (order === tileOrder) return; tileOrder = order;
  const keep = new Set(list.map((u) => u.id)); if (showMenu) keep.add('menu');
  Object.keys(tiles).forEach((id) => { if (!keep.has(id)) { tiles[id].remove(); delete tiles[id]; } });
  const frag = document.createDocumentFragment();
  list.forEach((u) => {
    let t = tiles[u.id];
    if (!t) { t = el('button', 'tile'); t.type = 'button'; t.appendChild(svgIcon(u.icon)); t.setAttribute('aria-label', u.name); tiles[u.id] = t; attachBuyable(t, () => upgradeTip(u), () => { if (buyUpgrade(u.id)) { chime(988); chime(1318, 0.1); toast({ kicker: 'Upgrade', title: u.name, text: u.desc, icon: u.icon, cls: 'lime', ms: 2500 }); } }); }
    frag.appendChild(t);
  });
  if (showMenu) { let t = tiles.menu; if (!t) { t = el('button', 'tile'); t.type = 'button'; t.appendChild(svgIcon('plus')); t.setAttribute('aria-label', DATA.menuItem.name); tiles.menu = t; attachBuyable(t, menuTip, () => { if (buyMenuItem()) { chime(988); chime(1318, 0.1); } }); } frag.appendChild(t); }
  box.appendChild(frag);
  if (tip.anchor && !tip.anchor.isConnected) hideTip();
}
function renderTiles() {
  let affordable = 0;
  for (const id in tiles) {
    const cost = id === 'menu' ? menuItemCost() : UPGID[id].cost; const ok = S.bank >= cost; if (ok) affordable++;
    setClass(tiles[id], 'ok', ok); setClass(tiles[id], 'no', !ok);
  }
  const n = Object.keys(tiles).length;
  setText($('upgradeCount'), n ? affordable + ' of ' + n + ' affordable' : '');
}

/* ---------- journey ---------- */
const chipEls = [];
function buildJourney() {
  const box = $('eraChips'); box.innerHTML = '';
  ERAS.forEach((e) => { const c = el('div', 'chip'); c.appendChild(svgIcon(e.icon)); c.appendChild(el('span', null, e.name)); c.title = 'Chapter ' + e.n + ' · Manuel, ' + e.age; box.appendChild(c); chipEls[e.n] = c; });
}
function renderJourney() {
  const era = ERAS[S.era - 1]; const next = ERAS[S.era];
  ERAS.forEach((e) => { setClass(chipEls[e.n], 'done', e.n < S.era); setClass(chipEls[e.n], 'now', e.n === S.era); });
  const badge = 'Chapter ' + S.era + ' · ' + era.name; setText($('eraBadgeText'), badge); setText($('eraBadgeTextMobile'), badge);
  const href = '#i-' + era.icon; ['eraBadgeIcon', 'eraBadgeIconMobile'].forEach((id) => { const u = $(id); if (u.getAttribute('href') !== href) u.setAttribute('href', href); });
  setText($('runEarned'), money(S.lifetime));
  if (next) {
    const pct = clamp(S.lifetime / next.threshold * 100, 0, 100);
    setText($('nextEra'), 'Next: ' + next.name + ' at ' + money(next.threshold) + (next.flagship ? ', or buy a ' + PID[next.flagship].name : ''));
    setText($('eraPct'), pct.toFixed(pct < 10 ? 1 : 0) + '%'); const bar = $('eraProgress').firstElementChild; const w = pct.toFixed(2) + '%'; if (bar.__w !== w) { bar.__w = w; bar.style.width = w; }
  } else { setText($('nextEra'), 'Manuel made it. Keep going for salsa points.'); setText($('eraPct'), '100%'); $('eraProgress').firstElementChild.style.width = '100%'; }
  setText($('hintText'), DATA.buttonHints[S.era] || DATA.ui.tacoButtonHint);
  renderBuffs();
}
const buffEls = {};
function renderBuffs() {
  const box = $('buffs'); const t = now(); const live = S.buffs.filter((b) => b.endsAt > t);
  const ids = new Set(live.map((b) => b.id));
  Object.keys(buffEls).forEach((id) => { if (!ids.has(id)) { buffEls[id].remove(); delete buffEls[id]; } });
  if (S.depop.hype > 0.5 && depopUnlocked()) ids.add('hype'); else if (buffEls.hype) { buffEls.hype.remove(); delete buffEls.hype; }
  live.forEach((b) => {
    let e = buffEls[b.id];
    if (!e) { e = el('span', 'buff' + (b.kind === 'click' ? ' gold' : b.kind === 'storm' ? ' lime' : '')); e.appendChild(svgIcon(b.kind === 'click' ? 'hand' : b.kind === 'storm' ? 'sparkle' : 'bolt')); e.appendChild(el('span')); buffEls[b.id] = e; box.appendChild(e); }
    setText(e.lastChild, b.name + (b.kind === 'storm' ? '' : ' ×' + b.mult) + ' · ' + fmtClock(b.endsAt - t));
  });
  if (ids.has('hype')) { let e = buffEls.hype; if (!e) { e = el('span', 'buff berry'); e.appendChild(svgIcon('sparkle')); e.appendChild(el('span')); buffEls.hype = e; box.appendChild(e); } setText(e.lastChild, 'Hype ' + Math.round(S.depop.hype) + '% · +' + Math.round(S.depop.hype / 2) + '% income'); }
  const empty = box.querySelector('.buffs-empty'); if (ids.size && empty) empty.remove(); else if (!ids.size && !empty) box.appendChild(el('span', 'buffs-empty', 'No boosts right now. Watch for a golden taco.'));
}

/* ---------- Depop panel ---------- */
let slotEls = []; let depopBuilt = ''; 
function buildDepop() {
  const body = $('depopBody'); body.innerHTML = ''; slotEls = [];
  const box = $('hypeBox'); const stats = $('depopStats');
  if (!depopUnlocked()) {
    depopBuilt = 'locked'; box.hidden = true; stats.hidden = true;
    const t = el('div', 'locked-teaser'); t.appendChild(svgIcon('lock')); t.appendChild(el('div', null, DATA.ui.depopLockedTeaser + ' The Depop shop opens in Chapter 5.'));
    body.appendChild(t); return;
  }
  box.hidden = false; stats.hidden = false;
  const n = depopSlotCount(); while (S.depop.slots.length < n) S.depop.slots.push(null);
  depopBuilt = 'open' + n + ':' + S.depop.slots.map((s) => (s ? s.item + s.startedAt : '-')).join(',') + ':' + ITEMS.map((i) => itemAvailable(i)).join('');
  const grid = el('div', 'slots' + (n === 4 ? ' four' : ''));
  for (let i = 0; i < n; i++) grid.appendChild(buildSlot(i));
  body.appendChild(grid);
  const actions = el('div', 'item-chips'); actions.style.marginTop = '2px';
  const relist = el('button', 'btn', 'Relist last item'); relist.type = 'button'; relist.id = 'relistBtn'; relist.addEventListener('click', () => { const free = S.depop.slots.findIndex((s) => !s); if (free >= 0 && S.depop.lastItem && listDrop(free, S.depop.lastItem)) chime(700); });
  const collect = el('button', 'btn btn-lime', 'Collect all'); collect.type = 'button'; collect.id = 'collectAllBtn'; collect.addEventListener('click', () => { if (collectAll()) { chime(900); chime(1200, 0.1); } });
  actions.appendChild(relist); actions.appendChild(collect); body.appendChild(actions);
}
function buildSlot(i) {
  const sl = S.depop.slots[i];
  if (!sl) {
    const d = el('div', 'slot empty'); d.appendChild(el('div', 'slot-note', 'List an item'));
    const chips = el('div', 'item-chips');
    ITEMS.forEach((item) => {
      const c = el('button', 'item-chip'); c.type = 'button';
      if (!itemAvailable(item)) { c.classList.add('locked'); c.textContent = item.name + ' · needs ' + UPGID[item.requires].name; c.disabled = true; }
      else { c.appendChild(el('span', null, item.name)); c.appendChild(el('b', 'num')); attachBuyable(c, () => tipContent({ name: item.name, cost: money(itemCost(item)), ok: S.bank >= itemCost(item), effect: 'Sells in ' + fmtTime(item.sellSeconds * 1000 / (has('depop_ring') ? 1.25 : 1)) + ' for ' + item.payout + '× what it cost' + (has('depop_verified') ? ' (+25% verified)' : '') + '. Hype +' + item.hype + '.', flavor: item.desc }), () => { if (listDrop(i, item.id)) chime(700); }); }
      chips.appendChild(c);
    });
    d.appendChild(chips); slotEls[i] = { el: d, chips: Array.from(chips.children) }; return d;
  }
  const item = ITEMID[sl.item]; const d = el('div', 'slot');
  const head = el('div', 'slot-head'); head.appendChild(el('span', null, item.name)); const time = el('span', 'slot-time'); time.appendChild(svgIcon('clock')); time.appendChild(el('span', 'num')); head.appendChild(time); d.appendChild(head);
  const prog = el('div', 'progress thin'); prog.appendChild(el('i')); d.appendChild(prog);
  const note = el('div', 'slot-note'); note.appendChild(el('span', null, 'Pays ')); note.appendChild(el('b', 'num', money(sl.payout))); note.appendChild(el('span', null, ' when it sells')); d.appendChild(note);
  const btn = el('button', 'btn btn-lime', 'Collect ' + money(sl.payout)); btn.type = 'button'; btn.hidden = true; btn.addEventListener('click', () => { if (collectDrop(i)) { chime(900); chime(1200, 0.1); } }); d.appendChild(btn);
  slotEls[i] = { el: d, time: time.lastChild, bar: prog.firstElementChild, btn, note, sold: false }; return d;
}
function renderDepop() {
  if (!depopUnlocked()) { if (depopBuilt !== 'locked') buildDepop(); return; }
  const n = depopSlotCount();
  const key = 'open' + n + ':' + S.depop.slots.map((s) => (s ? s.item + s.startedAt : '-')).join(',') + ':' + ITEMS.map((i) => itemAvailable(i)).join('');
  if (key !== depopBuilt) buildDepop();
  const t = now(); let anyReady = false;
  S.depop.slots.forEach((sl, i) => {
    const se = slotEls[i]; if (!se) return;
    if (!sl) { se.chips.forEach((c, j) => { const item = ITEMS[j]; if (!itemAvailable(item)) return; const cost = itemCost(item); setText(c.lastChild, money(cost)); setClass(c, 'ok', S.bank >= cost); setClass(c, 'no', S.bank < cost); }); return; }
    const ready = t >= sl.readyAt; if (ready) anyReady = true;
    if (ready && !se.sold) { se.sold = true; se.el.classList.add('sold'); se.btn.hidden = false; se.note.hidden = true; se.time.textContent = 'SOLD' + (sl.viral ? ' · went viral' : sl.flop ? ' · sort of' : ''); se.time.parentNode.className = 'slot-sold'; }
    else if (!ready) { setText(se.time, fmtClock(sl.readyAt - t)); const w = clamp((t - sl.startedAt) / Math.max(1, sl.readyAt - sl.startedAt) * 100, 0, 100).toFixed(1) + '%'; if (se.bar.__w !== w) { se.bar.__w = w; se.bar.style.width = w; } }
  });
  const collect = $('collectAllBtn'); if (collect) collect.hidden = !anyReady;
  const relist = $('relistBtn'); if (relist) { const free = S.depop.slots.some((s) => !s); const it = S.depop.lastItem && ITEMID[S.depop.lastItem]; relist.hidden = !(free && it && itemAvailable(it)); if (it) { relist.textContent = 'Relist ' + it.name + ' · ' + money(itemCost(it)); relist.disabled = S.bank < itemCost(it); } }
  const bar = $('hypeBar'); const w = S.depop.hype.toFixed(1) + '%'; if (bar.__w !== w) { bar.__w = w; bar.style.width = w; } setText($('hypePct'), Math.round(S.depop.hype) + '%');
  const st = $('depopStats'); const stText = 'Sold ' + S.depop.sales + ' · Viral ' + S.depop.viral + ' · Best sale ' + money(S.depop.best) + ' · Earned ' + money(S.depop.earned);
  setText(st, stText);
}

/* ---------- journal ---------- */
function renderJournal() {
  const box = $('journal'); box.innerHTML = '';
  const entries = S.journal.slice(-6).reverse();
  if (!entries.length) { box.appendChild(el('p', 'muted', 'Every chapter, first business and golden taco gets written down here.')); return; }
  entries.forEach((j) => {
    const jt = journalText(j.id); if (!jt) return;
    const row = el('div', 'journal-entry'); const m = /^era_(\d+)$/.exec(j.id);
    const num = el('div', 'journal-num'); if (m) num.textContent = m[1]; else num.appendChild(svgIcon(/^first_/.test(j.id) ? 'plus' : j.id === 'golden_first' ? 'star' : /^run_/.test(j.id) ? 'sun' : 'tag'));
    row.appendChild(num); const body = el('div'); body.appendChild(el('h4', null, jt.title)); body.appendChild(el('p', null, jt.text)); row.appendChild(body); box.appendChild(row);
  });
}

/* ---------- news ticker ---------- */
const recentNews = [];
function newsPool() {
  const N = DATA.news; const pool = [];
  const add = (arr, w = 1) => arr.forEach((l) => { for (let i = 0; i < w; i++) pool.push(l); });
  add(N.generic); add(N['era' + S.era] || [], 3);
  if (S.bank < 10 && S.lifetime > 200) add(N.lowCash, 3);
  P.forEach((p) => { if (S.producers[p.id] >= 10) add(N.producers[p.id] || [], 2); });
  if (S.ach.length >= 20) pool.push('Manuel has ' + S.ach.length + ' achievements. Abuela keeps them in a shoebox.');
  if (S.golden.missed > 3) pool.push('A golden taco rolled off the counter again. Diego was distracted.');
  if (tacosSold() > 1e6) pool.push('Manuel has sold ' + fmt(tacosSold()) + ' tacos. That is a lot of napkins.');
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
  const close = el('button', 'btn modal-close'); close.type = 'button'; close.setAttribute('aria-label', 'Close'); close.appendChild(svgIcon('x')); close.addEventListener('click', closeModal); head.appendChild(close);
  m.appendChild(head);
  if (o.title) { const h = el('h2', null, o.title); h.id = 'modalTitle'; m.setAttribute('aria-labelledby', 'modalTitle'); m.appendChild(h); }
  const body = el('div', 'modal-body'); if (o.body) body.appendChild(o.body); m.appendChild(body);
  if (o.foot) m.appendChild(o.foot);
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
  const e = ERAS[n - 1]; const body = el('div');
  const art = el('div', 'story-art'); art.appendChild(svgIcon(e.icon)); body.appendChild(art);
  body.appendChild(el('p', null, e.text));
  const foot = el('div', 'modal-foot'); const note = el('div', 'note');
  if (n > 1) { const gainPct = Math.round(DATA.eraBonus / (1 + DATA.eraBonus * (n - 2)) * 100); note.appendChild(el('span', null, 'All income ')); note.appendChild(el('b', null, '+' + gainPct + '%')); note.appendChild(el('span', null, ' from now on (chapter bonus now ×' + (1 + DATA.eraBonus * (n - 1)).toFixed(2) + ')')); }
  else note.textContent = DATA.ui.tacoButtonHint;
  const btn = el('button', 'btn btn-primary', n === 1 ? 'Start selling' : 'Keep cooking'); btn.type = 'button'; btn.addEventListener('click', closeModal);
  foot.appendChild(note); foot.appendChild(btn);
  openModal({ cls: 'story', kicker: 'Chapter ' + n + ' · Manuel, ' + e.age, kickerIcon: e.icon, title: e.title, body, foot });
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
  const body = el('div'); const grid = el('div', 'stats-grid'); body.appendChild(grid);
  const sec = (t) => grid.appendChild(el('div', 'stats-section', t));
  sec('This summer (run ' + S.runs + ')');
  grid.appendChild(statRow('Cash in hand', money(S.bank))); grid.appendChild(statRow('Earned this run', money(S.lifetime)));
  grid.appendChild(statRow('Income per second', moneyRate(cps()))); grid.appendChild(statRow('Best income per second', moneyRate(S.stats.bestCps)));
  grid.appendChild(statRow('Per click', money(clickValue()))); grid.appendChild(statRow('Tacos sold (all ways)', fmt(tacosSold())));
  grid.appendChild(statRow('Hand-rolled by Manuel', fmt(S.clicks))); grid.appendChild(statRow('Businesses owned', fmt(P.reduce((a, p) => a + S.producers[p.id], 0))));
  grid.appendChild(statRow('Upgrades owned', fmt(S.upgrades.length + S.menuItems))); grid.appendChild(statRow('Chapter', S.era + ' · ' + ERAS[S.era - 1].name));
  sec('All time');
  grid.appendChild(statRow('Earned all time', money(S.lifetimeAll))); grid.appendChild(statRow('Time played', fmtTime(S.stats.playMs)));
  grid.appendChild(statRow('Golden tacos grabbed', fmt(S.stats.goldenClicked) + (S.stats.goldenMissed ? ' (missed ' + fmt(S.stats.goldenMissed) + ')' : ''))); grid.appendChild(statRow('Best golden streak', fmt(S.stats.bestStreak)));
  grid.appendChild(statRow('Achievements', S.ach.length + ' of ' + ACH.length)); grid.appendChild(statRow('Reputation', Math.round(reputation() * 100) + '%'));
  grid.appendChild(statRow('Salsa Points', S.salsa + ' (' + (S.salsa - S.salsaSpent) + ' unspent)')); grid.appendChild(statRow('Summers', String(S.runs)));
  grid.appendChild(statRow('Earned while away', money(S.stats.offlineEarned))); grid.appendChild(statRow('Storm tacos caught', fmt(S.stats.stormTacos)));
  if (depopUnlocked() || S.depop.sales) { sec('Depop'); grid.appendChild(statRow('Items sold', fmt(S.depop.sales))); grid.appendChild(statRow('Went viral', fmt(S.depop.viral))); grid.appendChild(statRow('Best sale', money(S.depop.best))); grid.appendChild(statRow('Depop earnings', money(S.depop.earned))); }
  sec('Where the income comes from');
  P.forEach((p) => { if (S.producers[p.id] > 0) grid.appendChild(statRow(p.name + ' ×' + S.producers[p.id], moneyRate(producerCps(p.id)) + ' · ' + (cps() > 0 ? (producerCps(p.id) / cps() * 100).toFixed(1) : '0') + '%')); });
  sec('Multipliers');
  const layers = incomeLayers(true); if (!layers.length) grid.appendChild(statRow('No multipliers yet', '×1'));
  layers.forEach((l) => grid.appendChild(statRow(l.label, '×' + (l.mult >= 100 ? l.mult.toFixed(0) : l.mult.toFixed(2))))); grid.appendChild(statRow('Total', '×' + fmt(globalMult(true))));
  const c = clickLayers(); sec('Click value'); grid.appendChild(statRow('Base', '$1' + (c.pct ? ' + ' + Math.round(c.pct * 100) + '% of income/s' : ''))); c.layers.forEach((l) => grid.appendChild(statRow(l.label, '×' + l.mult))); grid.appendChild(statRow('Per click', money(clickValue())));
  openModal({ cls: 'wide', kicker: 'Stats', kickerIcon: 'stats', title: 'The numbers', body });
}
function openAchievements() {
  const body = el('div'); const sum = el('div', 'ach-summary'); sum.innerHTML = '';
  const left = el('span'); left.appendChild(el('b', null, S.ach.length + ' of ' + ACH.length)); left.appendChild(el('span', null, ' unlocked')); sum.appendChild(left);
  sum.appendChild(el('span', null, 'Reputation ' + Math.round(reputation() * 100) + '% (each achievement +2%)')); body.appendChild(sum);
  const grid = el('div', 'ach-grid'); grid.style.marginTop = '12px';
  ACH.forEach((a) => {
    const won = S.ach.includes(a.id); const t = el('button', 'ach' + (won ? ' won' : '')); t.type = 'button'; t.appendChild(svgIcon(won || !a.secret ? a.icon : 'lock'));
    t.setAttribute('aria-label', won || !a.secret ? a.name : 'Secret achievement');
    const content = () => { if (!won && a.secret) return tipContent({ name: '???', effect: DATA.secretHints[a.id] || 'A secret.' }); const [cur, goal] = achievementProgress(a); return tipContent({ name: a.name, effect: a.desc, extra: [won ? 'Unlocked.' : 'Progress: ' + (a.kind === 'lifetime' || a.kind === 'cps' ? money(cur) + ' of ' + money(goal) : fmt(Math.min(cur, goal)) + ' of ' + fmt(goal))] }); };
    t.__tip = content; t.addEventListener('mouseenter', () => showTip(t, content)); t.addEventListener('mouseleave', hideTip); t.addEventListener('focus', () => showTip(t, content)); t.addEventListener('blur', hideTip);
    t.addEventListener('click', () => showTip(t, content, null, true));
    grid.appendChild(t);
  });
  body.appendChild(grid);
  openModal({ cls: 'wide', kicker: 'Achievements', kickerIcon: 'trophy', title: 'The shoebox', body });
}
function openNotebook() {
  const body = el('div'); const box = el('div', 'prestige-box'); const pend = pendingSalsa();
  box.appendChild(el('div', 'big', pend >= 1 ? '+' + pend + ' Salsa Point' + (pend > 1 ? 's' : '') + ' if Manuel starts a new summer' : 'No new Salsa Points yet'));
  box.appendChild(el('p', null, pend >= 1 ? DATA.ui.newSummer + ' Every Salsa Point makes all income +5% forever, and points you spend on pages still count.' : DATA.ui.prestigeLocked + ' Next point at ' + money(nextSalsaAt()) + ' earned all time (you have ' + money(S.lifetimeAll) + ').'));
  const row = el('div', 'opt-actions'); const btn = el('button', 'btn btn-primary', 'Start a new summer'); btn.type = 'button'; btn.disabled = pend < 1;
  btn.addEventListener('click', () => confirmModal({ kicker: 'A new summer', icon: 'sun', title: 'Start over with +' + pend + ' Salsa Point' + (pend > 1 ? 's' : '') + '?', text: DATA.ui.prestigeConfirm.replace('{salsa}', pend), confirm: 'Start a new summer', onConfirm: () => { newSummer(); } }));
  row.appendChild(btn); row.appendChild(el('span', 'note', 'You have ' + S.salsa + ' Salsa Points, ' + (S.salsa - S.salsaSpent) + ' unspent.')); box.appendChild(row); body.appendChild(box);
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
  body.appendChild(list);
  openModal({ cls: 'wide', kicker: 'Abuela\'s Notebook', kickerIcon: 'book', title: 'Secret recipes', body });
}
function optRow(name, desc, control) { const r = el('div', 'opt'); const m = el('div', 'opt-main'); m.appendChild(el('div', 'opt-name', name)); if (desc) m.appendChild(el('div', 'opt-desc', desc)); r.appendChild(m); r.appendChild(control); return r; }
function switchEl(key, onChange) { const b = el('button', 'switch'); b.type = 'button'; b.setAttribute('role', 'switch'); b.setAttribute('aria-checked', String(!!S.opts[key])); b.addEventListener('click', () => { S.opts[key] = !S.opts[key]; b.setAttribute('aria-checked', String(S.opts[key])); if (onChange) onChange(S.opts[key]); saveSoon(); }); return b; }
function openOptions() {
  const body = el('div', 'options');
  body.appendChild(optRow('Sound', 'Little blips when you sell, chimes for the good stuff.', switchEl('sound', (on) => { if (on) { ensureAudio(); chime(880); } })));
  body.appendChild(optRow('Particles and floating numbers', 'Turn off on a slow phone.', switchEl('particles', (on) => document.body.classList.toggle('no-particles', !on))));
  body.appendChild(optRow('Short numbers', '$1.23M instead of $1.234 million.', switchEl('shortNumbers')));
  const saveRow = el('div', 'opt-actions');
  const sv = el('button', 'btn', 'Save now'); sv.type = 'button'; sv.addEventListener('click', () => save(true));
  const ex = el('button', 'btn', 'Export save'); ex.type = 'button'; ex.appendChild(svgIcon('download'));
  const im = el('button', 'btn', 'Import save'); im.type = 'button'; im.appendChild(svgIcon('upload'));
  saveRow.appendChild(sv); saveRow.appendChild(ex); saveRow.appendChild(im);
  body.appendChild(optRow('Your progress', storageFailed ? DATA.ui.storageOff : 'Saved in this browser every 30 seconds and whenever you buy something.', saveRow));
  const area = el('div'); area.hidden = true; const ta = el('textarea', 'save-box'); ta.setAttribute('aria-label', 'Save code'); const arow = el('div', 'opt-actions'); arow.style.marginTop = '8px'; area.appendChild(ta); area.appendChild(arow); body.appendChild(area);
  ex.addEventListener('click', () => { area.hidden = false; ta.value = exportSave(); ta.readOnly = true; arow.innerHTML = ''; const cp = el('button', 'btn', 'Copy'); cp.type = 'button'; cp.addEventListener('click', () => { ta.select(); let ok = false; try { document.execCommand('copy'); ok = true; } catch (e) { ok = false; } if (navigator.clipboard) navigator.clipboard.writeText(ta.value).then(() => { cp.textContent = 'Copied'; }).catch(() => { cp.textContent = ok ? 'Copied' : 'Select and copy'; }); else cp.textContent = ok ? 'Copied' : 'Select and copy'; }); arow.appendChild(cp); ta.focus(); ta.select(); });
  im.addEventListener('click', () => { area.hidden = false; ta.value = ''; ta.readOnly = false; ta.placeholder = 'Paste a save code here'; arow.innerHTML = ''; const ld = el('button', 'btn btn-primary', 'Load'); ld.type = 'button'; ld.addEventListener('click', () => { if (importSave(ta.value)) { closeModal(); toast({ title: 'Save loaded', text: 'Welcome back. Abuela kept your seat.', icon: 'check', cls: 'lime' }); } else { ld.textContent = 'That code did not work'; } }); arow.appendChild(ld); ta.focus(); });
  const hr = el('button', 'btn btn-danger', 'Hard reset'); hr.type = 'button'; hr.appendChild(svgIcon('trash'));
  hr.addEventListener('click', () => confirmModal({ kicker: 'Danger', icon: 'trash', title: 'Throw away Abuela\'s notebook?', text: DATA.ui.hardResetConfirm, confirm: 'Erase everything', danger: true, onConfirm: () => { hardReset(); toast({ title: 'Back to the backyard', text: 'Manuel is twelve again. The table still wobbles.', icon: 'table' }); } }));
  body.appendChild(optRow('Start completely over', 'Erases everything, including Salsa Points and achievements.', hr));
  body.appendChild(optRow('Keys', 'Space or Enter on the taco sells one. Escape closes windows. Shift-click a business to sell it.', el('div')));
  const foot = el('div', 'modal-foot'); foot.appendChild(el('div', 'note', 'Manuel\'s Taco Clicker · made for Shuttle · no ads, no accounts, just tacos.'));
  openModal({ kicker: 'Options', kickerIcon: 'gear', title: 'Settings', body, foot });
}
function openMenu() {
  const body = el('div', 'options');
  [['stats', 'Stats', 'stats'], ['trophy', 'Achievements', 'achievements'], ['book', 'Abuela\'s Notebook', 'recipes'], ['gear', 'Options', 'options']].forEach(([ic, label, which]) => {
    const b = el('button', 'btn'); b.type = 'button'; b.style.justifyContent = 'flex-start'; b.style.height = '48px'; b.appendChild(svgIcon(ic)); b.appendChild(el('span', null, label)); b.addEventListener('click', () => { closeModal(); setTimeout(() => openPanel(which), 50); }); body.appendChild(b);
  });
  openModal({ kicker: 'Menu', kickerIcon: 'menu', title: 'Manuel\'s Taco Clicker', body });
}
function openPanel(which) { if (which === 'stats') openStats(); else if (which === 'achievements') openAchievements(); else if (which === 'recipes') openNotebook(); else if (which === 'options') openOptions(); }

/* ==========================================================================
   Scenes (one SVG illustration per chapter, with Abuela in every one)
   ========================================================================== */
const OUT = '#3a2418';
const sceneParts = {
  lights(y = 46) { let s = `<path d="M0 ${y} Q 105 ${y + 30} 210 ${y + 4} T 420 ${y}" fill="none" stroke="${OUT}" stroke-width="2"/>`; [0.08, 0.2, 0.32, 0.44, 0.56, 0.68, 0.8, 0.92].forEach((f, i) => { const x = Math.round(420 * f); const yy = [y + 6, y + 20, y + 16, y + 4, y + 8, y + 20, y + 14, y + 2][i]; s += `<circle cx="${x}" cy="${yy}" r="9" fill="#ffb52e" opacity=".18"/><circle cx="${x}" cy="${yy}" r="4" fill="#ffb52e"/>`; }); return s; },
  stars() { let s = ''; for (let i = 0; i < 18; i++) s += `<circle cx="${(i * 97) % 420}" cy="${10 + (i * 53) % 120}" r="${1 + (i % 3) * 0.6}" fill="#fff3e2" opacity=".5"/>`; return s; },
  shadow() { return `<ellipse cx="210" cy="364" rx="150" ry="8" fill="#000" opacity=".35"/>`; },
  sign(x, y, size, color, rot = -3) { return `<text x="${x}" y="${y}" text-anchor="middle" font-family="'Lilita One', 'Arial Rounded MT Bold', sans-serif" font-size="${size}" fill="${color}" transform="rotate(${rot} ${x} ${y})">MANUEL'S</text>`; },
  truck(x, y, s = 1, lit = true) {
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <rect x="0" y="30" width="236" height="128" rx="14" fill="#2b201d" stroke="${OUT}" stroke-width="3"/>
      <rect x="234" y="52" width="84" height="106" rx="10" fill="#2b201d" stroke="${OUT}" stroke-width="3"/>
      <rect x="250" y="64" width="46" height="34" rx="6" fill="#3a2a2c"/>
      <rect x="38" y="58" width="126" height="46" rx="6" fill="${lit ? '#7a5a2a' : '#4a3a2a'}"/>
      ${lit ? '<rect x="38" y="58" width="126" height="46" rx="6" fill="#ffb52e" opacity=".35"/>' : ''}
      ${sceneParts.sign(100, 24, 26, '#ffb52e', -2)}
      <circle cx="58" cy="162" r="16" fill="#1a1315" stroke="${OUT}" stroke-width="3"/><circle cx="210" cy="162" r="16" fill="#1a1315" stroke="${OUT}" stroke-width="3"/>
    </g>`;
  },
  table(x, y) {
    return `<g transform="translate(${x} ${y})">
      <rect x="0" y="0" width="150" height="12" rx="4" fill="#8a5a2a" stroke="${OUT}" stroke-width="3"/>
      <path d="M12 12 L4 78 M138 12 L146 78 M40 12 L34 78 M110 12 L116 78" stroke="${OUT}" stroke-width="4" stroke-linecap="round"/>
      <rect x="28" y="-46" width="94" height="40" rx="4" fill="#fff3e2" stroke="${OUT}" stroke-width="3" transform="rotate(-4 75 -26)"/>
      <text x="75" y="-16" text-anchor="middle" font-family="'Lilita One', sans-serif" font-size="22" fill="#ff5a3c" transform="rotate(-4 75 -26)">TACOS</text>
      <ellipse cx="50" cy="-2" rx="16" ry="6" fill="#f2b134" stroke="${OUT}" stroke-width="3"/><ellipse cx="100" cy="-2" rx="16" ry="6" fill="#f2b134" stroke="${OUT}" stroke-width="3"/>
    </g>`;
  },
  fence(y) { let s = `<path d="M0 ${y + 18} H420 M0 ${y + 48} H420" stroke="${OUT}" stroke-width="4"/>`; for (let x = 8; x < 420; x += 34) s += `<path d="M${x} ${y + 70} V${y + 8} L${x + 9} ${y} L${x + 18} ${y + 8} V${y + 70} Z" fill="#4a3324" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>`; return s; },
  plant(x, y) { return `<g transform="translate(${x} ${y})"><path d="M-14 0 h28 l-4 30 h-20 z" fill="#b5532a" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/><path d="M0 0 c-20 -30 -10 -50 0 -60 c10 10 20 30 0 60 z" fill="#3f9e38" stroke="${OUT}" stroke-width="3"/><path d="M-2 -6 c-30 -10 -34 -30 -30 -44 c16 4 30 20 30 44 z M2 -6 c30 -10 34 -30 30 -44 c-16 4 -30 20 -30 44 z" fill="#8fd14f" stroke="${OUT}" stroke-width="3"/></g>`; },
  stand(x, y) {
    let stripes = ''; for (let i = 0; i < 8; i++) stripes += `<path d="M${i * 30} 0 h30 v34 q-15 12 -30 0 z" fill="${i % 2 ? '#fff3e2' : '#ff5a3c'}" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>`;
    return `<g transform="translate(${x} ${y})">
      <path d="M8 40 V150 M232 40 V150" stroke="${OUT}" stroke-width="6" stroke-linecap="round"/>
      <rect x="0" y="96" width="240" height="60" rx="8" fill="#8a5a2a" stroke="${OUT}" stroke-width="3"/>
      <rect x="14" y="108" width="212" height="12" rx="3" fill="#4a3324"/>
      <g transform="translate(0 0)">${stripes}</g>
      <rect x="40" y="-42" width="160" height="42" rx="6" fill="#fff3e2" stroke="${OUT}" stroke-width="3" transform="rotate(-3 120 -21)"/>
      ${sceneParts.sign(120, -12, 26, '#ff5a3c', -3)}
      <ellipse cx="70" cy="96" rx="18" ry="7" fill="#f2b134" stroke="${OUT}" stroke-width="3"/><ellipse cx="120" cy="96" rx="18" ry="7" fill="#f2b134" stroke="${OUT}" stroke-width="3"/><ellipse cx="170" cy="96" rx="18" ry="7" fill="#f2b134" stroke="${OUT}" stroke-width="3"/>
    </g>`;
  },
  lamp(x, y) { return `<g transform="translate(${x} ${y})"><path d="M0 0 V-150" stroke="${OUT}" stroke-width="6" stroke-linecap="round"/><rect x="-14" y="-172" width="28" height="26" rx="6" fill="#ffb52e" stroke="${OUT}" stroke-width="3"/><circle cx="0" cy="-160" r="34" fill="#ffb52e" opacity=".12"/></g>`; },
  skyline(y) { let s = ''; const hs = [60, 110, 80, 140, 70, 120, 90, 100]; let x = -10; hs.forEach((h, i) => { s += `<rect x="${x}" y="${y - h}" width="52" height="${h + 40}" fill="#241a1c" stroke="${OUT}" stroke-width="2"/>`; for (let r = 0; r < Math.floor(h / 22); r++) for (let c = 0; c < 2; c++) if ((r + c + i) % 3) s += `<rect x="${x + 10 + c * 20}" y="${y - h + 8 + r * 22}" width="10" height="12" fill="#ffb52e" opacity=".55"/>`; x += 56; }); return s; },
  rack(x, y) { return `<g transform="translate(${x} ${y})" stroke="${OUT}" stroke-width="3" fill="none"><path d="M0 0 h96"/><path d="M6 0 v120 M90 0 v120"/><path d="M-6 120 h24 M78 120 h24"/><path d="M22 0 v10 M46 0 v10 M70 0 v10" stroke="#8f7a6c"/><rect x="12" y="10" width="22" height="44" rx="5" fill="#d96bff" opacity=".9"/><rect x="36" y="10" width="22" height="44" rx="5" fill="#ff5a3c" opacity=".9"/><rect x="60" y="10" width="22" height="44" rx="5" fill="#9fdc4b" opacity=".9"/></g>`; },
  phone(x, y) { return `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="56" height="100" rx="10" fill="#1a1315" stroke="${OUT}" stroke-width="3"/><rect x="6" y="10" width="44" height="72" rx="4" fill="#2a1b33"/><path d="M28 34 c-8 -14 -22 -4 -12 8 l12 12 l12 -12 c10 -12 -4 -22 -12 -8 z" fill="#d96bff"/><path d="M18 62 h20 M14 70 h28" stroke="#8f7a6c" stroke-width="3" stroke-linecap="round"/><g fill="#d96bff" opacity=".8"><path d="M70 -6 c-6 -10 -16 -3 -9 6 l9 9 l9 -9 c7 -9 -3 -16 -9 -6 z"/><path d="M84 -40 c-5 -8 -13 -2 -7 5 l7 7 l7 -7 c6 -7 -2 -13 -7 -5 z" opacity=".6"/><path d="M62 -70 c-4 -6 -10 -2 -6 4 l6 6 l6 -6 c4 -6 -2 -10 -6 -4 z" opacity=".4"/></g></g>`; },
  neon(x, y) { return `<g transform="translate(${x} ${y})"><rect x="-96" y="-26" width="192" height="52" rx="12" fill="#17121c" stroke="#d96bff" stroke-width="3"/><rect x="-96" y="-26" width="192" height="52" rx="12" fill="#d96bff" opacity=".12"/>${sceneParts.sign(0, 10, 28, '#d96bff', -2)}</g>`; },
  storefront(x, y, s = 1, color = '#8c2f5a') { return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="0" y="0" width="150" height="130" rx="8" fill="#2b201d" stroke="${OUT}" stroke-width="3"/><rect x="0" y="0" width="150" height="34" rx="8" fill="${color}" stroke="${OUT}" stroke-width="3"/>${sceneParts.sign(75, 25, 20, '#ffb52e', -2)}<rect x="16" y="54" width="52" height="56" rx="4" fill="#ffb52e" opacity=".35" stroke="${OUT}" stroke-width="3"/><rect x="88" y="54" width="46" height="76" rx="4" fill="#3a2a2c" stroke="${OUT}" stroke-width="3"/><circle cx="124" cy="94" r="3" fill="#ffb52e"/><path d="M-8 130 h166" stroke="${OUT}" stroke-width="4"/></g>`; },
  planet(x, y) { return `<g transform="translate(${x} ${y})"><circle r="26" fill="#4a3a2a" stroke="${OUT}" stroke-width="3"/><circle cx="-8" cy="-6" r="6" fill="#3a2a2c"/><circle cx="10" cy="8" r="4" fill="#3a2a2c"/><ellipse rx="44" ry="10" fill="none" stroke="#ffb52e" stroke-width="3" transform="rotate(-18)"/><g transform="translate(34 -22) scale(.16)"><use href="#taco" width="240" height="200"/></g></g>`; },
  chair(x, y) { return `<g transform="translate(${x} ${y})" stroke="${OUT}" stroke-width="4" fill="none" stroke-linecap="round"><path d="M0 0 v-40 h40 v40"/><path d="M0 -40 v-46 h40 v46"/><path d="M-4 -40 h48" stroke="#ff5a3c" stroke-width="8"/></g>`; },
  abuela(x, y, s = 1) {
    return `<g class="abuela" transform="translate(${x} ${y}) scale(${s})" role="button" tabindex="0" aria-label="Abuela. Click to hear what she thinks." data-abuela="1">
      <ellipse cx="0" cy="2" rx="28" ry="6" fill="#000" opacity=".3"/>
      <path d="M-24 0 L-18 -74 L18 -74 L24 0 Z" fill="#8c2f5a" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M-15 0 L-12 -56 L12 -56 L15 0 Z" fill="#fff3e2" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M-18 -66 C-34 -58 -34 -36 -22 -30" fill="none" stroke="${OUT}" stroke-width="10" stroke-linecap="round"/><path d="M-18 -66 C-34 -58 -34 -36 -22 -30" fill="none" stroke="#e8b48f" stroke-width="5" stroke-linecap="round"/>
      <path d="M18 -66 C34 -58 34 -36 22 -30" fill="none" stroke="${OUT}" stroke-width="10" stroke-linecap="round"/><path d="M18 -66 C34 -58 34 -36 22 -30" fill="none" stroke="#e8b48f" stroke-width="5" stroke-linecap="round"/>
      <circle cx="0" cy="-92" r="19" fill="#e8b48f" stroke="${OUT}" stroke-width="4"/>
      <path d="M-19 -96 A19 19 0 0 1 19 -96 L15 -104 A17 17 0 0 0 -15 -104 Z" fill="#d9d4cf" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="0" cy="-114" r="9" fill="#d9d4cf" stroke="${OUT}" stroke-width="3"/>
      <circle cx="-7" cy="-92" r="5" fill="none" stroke="${OUT}" stroke-width="2.5"/><circle cx="7" cy="-92" r="5" fill="none" stroke="${OUT}" stroke-width="2.5"/><path d="M-2 -92 h4" stroke="${OUT}" stroke-width="2.5"/>
      <path d="M-6 -82 q6 5 12 0" fill="none" stroke="${OUT}" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="-13" cy="-84" r="3" fill="#ff5a3c" opacity=".5"/><circle cx="13" cy="-84" r="3" fill="#ff5a3c" opacity=".5"/>
    </g>`;
  },
};
const SCENES = {
  1: () => sceneParts.stars() + sceneParts.lights(50) + sceneParts.fence(120) + sceneParts.plant(28, 300) + sceneParts.table(60, 232) + sceneParts.abuela(372, 330, 1),
  2: () => sceneParts.stars() + sceneParts.lights(40) + sceneParts.lamp(392, 320) + sceneParts.stand(60, 100) + sceneParts.chair(300, 300) + sceneParts.abuela(350, 330, 1),
  3: () => sceneParts.stars() + sceneParts.lights(46) + sceneParts.truck(20, 90, 1, true) + sceneParts.abuela(360, 330, 1),
  4: () => sceneParts.stars() + sceneParts.skyline(160) + sceneParts.truck(30, 120, 0.62, true) + sceneParts.truck(210, 150, 0.62, true) + sceneParts.truck(120, 178, 0.62, false) + sceneParts.abuela(362, 330, 1),
  5: () => sceneParts.stars() + sceneParts.neon(150, 50) + sceneParts.truck(4, 128, 0.6, true) + sceneParts.rack(300, 150) + sceneParts.phone(236, 214) + sceneParts.abuela(370, 330, 1),
  6: () => sceneParts.stars() + sceneParts.planet(330, 64) + sceneParts.storefront(10, 110, 0.8, '#8c2f5a') + sceneParts.storefront(140, 100, 0.8, '#b5532a') + sceneParts.storefront(270, 118, 0.8, '#4f7d2a') + sceneParts.abuela(350, 336, 1),
};
let sceneEra = 0;
function renderScene() {
  if (sceneEra === S.era) return; sceneEra = S.era;
  const svg = $('sceneArt'); svg.innerHTML = SCENES[S.era]() + sceneParts.shadow();
  const ab = svg.querySelector('[data-abuela]');
  if (ab) { const say = (e) => { e.preventDefault(); e.stopPropagation(); abuelaSpeaks(ab); }; ab.addEventListener('pointerdown', say); ab.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') say(e); }); }
}
let speechEl = null, speechTimer = null;
function abuelaSpeaks(node) {
  const lines = DATA.abuelaLines.any.concat(DATA.abuelaLines[S.era] || []);
  const line = pick(lines);
  if (speechEl) speechEl.remove();
  const scene = $('scene'); const r = scene.getBoundingClientRect(); const b = node.getBoundingClientRect();
  const s = el('div', 'speech', line);
  const cx = clamp(b.left + b.width / 2 - r.left, 90, r.width - 90);
  s.style.left = cx + 'px'; s.style.top = Math.max(8, b.top - r.top - 20) + 'px';
  scene.appendChild(s); speechEl = s;
  clearTimeout(speechTimer); speechTimer = setTimeout(() => { s.classList.add('out'); setTimeout(() => s.remove(), 300); }, 3600);
  chime(523); chime(659, 0.08);
}

/* ==========================================================================
   Input, render loop, boot
   ========================================================================== */
function sellTaco(e) {
  ensureAudio();
  const v = clickValue();
  earn(v, false); S.clicks++; S.clicksRun++; S.stats.clicksAll++;
  const t = now(); clickTimes.push(t); while (clickTimes.length > 120) clickTimes.shift();
  if (S.tut.clicks < 5) S.tut.clicks++;
  const x = e && e.clientX != null && e.clientX ? e.clientX : null, y = e && e.clientY ? e.clientY : null;
  floatText('+' + money(v), x, y, v >= cps() * 5 && v > 1000); crumbs(x, y, 5); blip(v);
  const btn = $('tacoBtn'); btn.classList.add('pressed'); clearTimeout(btn.__pt); btn.__pt = setTimeout(() => btn.classList.remove('pressed'), 90);
  if (S.clicks % 5 === 0) checkAchievements();
}
function setTab(name) {
  document.querySelectorAll('.tabbar button').forEach((b) => b.classList.toggle('on', b.dataset.tab === name));
  ['kitchen', 'journey', 'shop'].forEach((n) => { $('col-' + n).classList.toggle('active', n === name); });
  hideTip();
}
function setBuyAmount(amount) { buyAmount = amount; document.querySelectorAll('#buySeg [data-amount]').forEach((b) => b.classList.toggle('on', b.dataset.amount === String(amount))); refreshTip(); }
function setSellMode(on) { sellMode = on; const b = document.querySelector('#buySeg [data-mode="sell"]'); b.classList.toggle('on', on); b.classList.toggle('sell', on); refreshTip(); }
function render() {
  if (!S) return;
  frameId++;
  const cashText = money(S.bank); const cashEl = $('cash'); setText(cashEl, cashText);
  setClass(cashEl, 'small', cashText.length > 13 && cashText.length <= 18); setClass(cashEl, 'tiny', cashText.length > 18);
  const rate = cps(); setText($('cps'), money(rate, { decimals: rate < 10 ? 1 : undefined }));
  setText($('handSold'), fmt(tacosSold())); setText($('clickValue'), money(clickValue()));
  updateTitle();
  if (dirty.shop) { dirty.shop = false; rebuildTiles(); }
  renderProducers(); renderTiles(); renderJourney(); renderDepop();
  if (dirty.journal) { dirty.journal = false; renderJournal(); }
  if (dirty.scene) { dirty.scene = false; renderScene(); }
  const tacoBtn = $('tacoBtn'); setClass(tacoBtn, 'nudge', S.tut.clicks < 5 && !reducedMotion());
  const pressRow = rows.press && rows.press.el; if (pressRow) setClass(pressRow, 'nudge', !S.tut.bought && S.bank >= unitCost('press') && !reducedMotion());
  if (!S.tut.bought && S.bank >= unitCost('press')) setText($('hintText'), isMobileLayout() ? 'You can afford a Tortilla Press. Open the Shop tab.' : 'You can afford a Tortilla Press. Buy helpers to earn while you rest.');
}
function rebuildAll() {
  syncUpgSet(); frameId++;
  syncStorm(); renderGolden();
  document.body.dataset.era = String(S.era); document.body.classList.toggle('no-particles', !S.opts.particles);
  tileOrder = ''; depopBuilt = ''; sceneEra = 0;
  Object.keys(buffEls).forEach((k) => { buffEls[k].remove(); delete buffEls[k]; });
  Object.keys(dirty).forEach((k) => { dirty[k] = true; });
  renderScene(); renderJournal(); render();
}
function wireInput() {
  const taco = $('tacoBtn');
  taco.addEventListener('pointerdown', (e) => { if (e.button !== 0 && e.pointerType === 'mouse') return; e.preventDefault(); sellTaco(e); });
  taco.addEventListener('keydown', (e) => { if (e.repeat) return; if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); const r = taco.getBoundingClientRect(); sellTaco({ clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }); } });
  taco.addEventListener('click', (e) => e.preventDefault());
  taco.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('keydown', (e) => { if (e.key === ' ' && !e.repeat && !modalOpen() && (document.activeElement === document.body || document.activeElement === null)) { e.preventDefault(); const r = taco.getBoundingClientRect(); sellTaco({ clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }); } });
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
  window.addEventListener('pagehide', () => save(false));
  window.addEventListener('beforeunload', () => save(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Shift') sellHint = true; });
  document.addEventListener('keyup', (e) => { if (e.key === 'Shift') sellHint = false; });
}
let sellHint = false;
function boot() {
  S = load(); const fresh = !S; if (fresh) S = freshState();
  document.body.dataset.era = String(S.era); document.body.classList.toggle('no-particles', !S.opts.particles);
  buildShop(); buildJourney(); wireInput();
  if (!fresh) applyOffline(true);
  lastTick = now();
  rebuildAll();
  setInterval(loop, C.LOGIC_MS); setInterval(render, C.RENDER_MS); setInterval(rotateNews, C.NEWS_MS);
  setTimeout(rotateNews, 2500);
  if (fresh) { save(false); queueStory(1); } else pumpStories();
  if (storageFailed) toast({ title: 'Saving is off', text: DATA.ui.storageOff, icon: 'info', ms: 8000 });
  const testMode = /[?&]test=1/.test(location.search) || storeGet(C.TEST_KEY) === '1';
  if (testMode) {
    window.__mtc = {
      C, DATA, getState: () => S, setState: (patch) => { S = sanitize(Object.assign({}, JSON.parse(JSON.stringify(S)), patch)); storyQueue.length = 0; endStorm(); removeGoldenEl(); rebuildAll(); return S; },
      tick: (ms) => { clockOffset += ms; loop(); render(); }, now, setClock: (ms) => { clockOffset = ms; }, spawnGolden: (id) => { spawnGolden(id); return S.golden.active; }, clickGolden,
      fmt, money, cps, clickValue, unitCost, bulkCost, maxAffordable, sellRefund, buyProducer, sellProducer, buyUpgrade, buyRecipe, buyMenuItem, listDrop, collectDrop, newSummer, hardReset, sellTaco: () => sellTaco(null),
      save: () => save(false), load: () => { S = load() || freshState(); storyQueue.length = 0; endStorm(); removeGoldenEl(); rebuildAll(); return S; }, exportSave, importSave, checkAchievements, checkEra, render, applyOffline, incomeLayers, tacosSold, pendingSalsa, closeModal, openPanel, upgrades: UPG, visibleUpgrades, producerVisible, itemCost: (id) => itemCost(ITEMID[id]), sanitize, freshState: () => freshState(),
    };
  }
}
/* Shift-click on a business sells one (handled here so the two-step touch flow is untouched). */
document.addEventListener('click', (e) => { const row = e.target.closest && e.target.closest('.producer[data-pid]'); if (row && e.shiftKey && !sellMode) { e.stopPropagation(); sellProducer(row.dataset.pid, 1); } }, true);

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
