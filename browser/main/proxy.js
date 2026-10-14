'use strict';
// Proxy configuration. Default is "auto": use the proxy that Chrome or Edge
// is forced to use by Windows policy (common on school/work PCs), otherwise
// the normal Windows system proxy. Users can override in Settings.
const { execFileSync } = require('child_process');
const store = require('./store');

function regQuery(key, value) {
  if (process.platform !== 'win32') return null;
  try {
    const out = execFileSync('reg', ['query', key, '/v', value], { encoding: 'utf8', timeout: 3000, windowsHide: true, stdio: ['ignore', 'pipe', 'ignore'] });
    const m = out.match(new RegExp('^\\s*' + value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s+REG_\\w+\\s+(.*)$', 'mi'));
    return m ? m[1].trim() : null;
  } catch { return null; }
}

// Chrome/Edge policy keys, machine-wide first, then per-user.
const POLICY_KEYS = [
  'HKLM\\SOFTWARE\\Policies\\Google\\Chrome',
  'HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge',
  'HKCU\\SOFTWARE\\Policies\\Google\\Chrome',
  'HKCU\\SOFTWARE\\Policies\\Microsoft\\Edge'
];

function readPolicyProxy() {
  for (const key of POLICY_KEYS) {
    // Newer policy: a single JSON blob.
    const json = regQuery(key, 'ProxySettings');
    if (json) {
      try {
        const o = JSON.parse(json);
        const cfg = fromPolicy(o.ProxyMode, o.ProxyServer, o.ProxyPacUrl, o.ProxyBypassList);
        if (cfg) return { ...cfg, source: key + '\\ProxySettings' };
      } catch {}
    }
    const mode = regQuery(key, 'ProxyMode');
    const server = regQuery(key, 'ProxyServer');
    const pac = regQuery(key, 'ProxyPacUrl');
    const bypass = regQuery(key, 'ProxyBypassList');
    if (mode || server || pac) {
      const cfg = fromPolicy(mode, server, pac, bypass);
      if (cfg) return { ...cfg, source: key };
    }
  }
  return null;
}

function fromPolicy(mode, server, pac, bypass) {
  switch (mode) {
    case 'direct': return { mode: 'direct' };
    case 'auto_detect': return { mode: 'auto_detect' };
    case 'pac_script': return pac ? { mode: 'pac_script', pacScript: pac } : null;
    case 'fixed_servers': return server ? { mode: 'fixed_servers', proxyRules: server, proxyBypassRules: bypass || '<local>' } : null;
    case 'system': return { mode: 'system' };
    default:
      if (pac) return { mode: 'pac_script', pacScript: pac };
      if (server) return { mode: 'fixed_servers', proxyRules: server, proxyBypassRules: bypass || '<local>' };
      return null;
  }
}

let policyCache;
function resolve() {
  const s = store.settings.get();
  switch (s.proxyMode) {
    case 'direct': return { mode: 'direct', source: 'settings' };
    case 'manual': return s.proxyServer ? { mode: 'fixed_servers', proxyRules: s.proxyServer, proxyBypassRules: s.proxyBypass || '<local>', source: 'settings' } : { mode: 'system', source: 'settings (no server given)' };
    case 'pac': return s.proxyPac ? { mode: 'pac_script', pacScript: s.proxyPac, source: 'settings' } : { mode: 'system', source: 'settings (no PAC url)' };
    case 'system': return { mode: 'system', source: 'settings' };
    default: { // auto
      if (policyCache === undefined) policyCache = readPolicyProxy();
      return policyCache || { mode: 'system', source: 'windows' };
    }
  }
}

async function apply(session) {
  const cfg = resolve();
  const { source, ...proxyConfig } = cfg;
  try {
    await session.setProxy(proxyConfig);
    console.log('proxy:', JSON.stringify(proxyConfig), 'from', source);
  } catch (err) {
    console.warn('proxy: could not apply', err.message);
  }
  return cfg;
}

function status() { policyCache = undefined; return resolve(); }

module.exports = { apply, status, readPolicyProxy };
