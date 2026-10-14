'use strict';
// Launches the browser with DREW_SMOKE=1 (uses xvfb-run on Linux when no
// display is available) and relays the self-test output.
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const electron = require('electron'); // path to the binary
const root = path.join(__dirname, '..');
const userData = fs.mkdtempSync(path.join(os.tmpdir(), 'drews-smoke-'));
const env = { ...process.env, DREW_SMOKE: '1', DREW_USER_DATA: userData, ELECTRON_ENABLE_LOGGING: '1' };

let cmd = electron, args = [root];
if (process.platform === 'linux' && !process.env.DISPLAY) { cmd = 'xvfb-run'; args = ['-a', '-s', '-screen 0 1280x800x24', electron, '--no-sandbox', root]; }
const r = spawnSync(cmd, args, { env, stdio: 'inherit', timeout: 180000 });
fs.rmSync(userData, { recursive: true, force: true });
process.exit(r.status == null ? 1 : r.status);
