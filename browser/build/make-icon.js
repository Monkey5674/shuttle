'use strict';
// Generates build/icon.png (256x256) and build/icon.ico without any
// dependencies: a rounded dark-blue square with a white "S" glyph path.
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const SIZE = 256;
const px = Buffer.alloc(SIZE * SIZE * 4);
function put(x, y, r, g, b, a) { if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return; const i = (y * SIZE + x) * 4; px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = a; }
function inRounded(x, y, x0, y0, x1, y1, rad) {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;
  const cx = Math.max(x0 + rad, Math.min(x, x1 - rad)), cy = Math.max(y0 + rad, Math.min(y, y1 - rad));
  return (x - cx) ** 2 + (y - cy) ** 2 <= rad * rad;
}
// Background: rounded square with vertical gradient.
for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
  if (inRounded(x + .5, y + .5, 8, 8, 248, 248, 56)) {
    const t = y / SIZE;
    put(x, y, Math.round(26 + 20 * t), Math.round(115 - 30 * t), Math.round(232 - 60 * t), 255);
  }
}
// Glyph: a stylised "S" made of two arcs plus a ring (a "shuttle" orbit).
function ring(cx, cy, rOuter, rInner, a0, a1, color) {
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const dx = x + .5 - cx, dy = y + .5 - cy, d = Math.hypot(dx, dy);
    if (d > rOuter || d < rInner) continue;
    let ang = Math.atan2(dy, dx); if (ang < 0) ang += Math.PI * 2;
    const inArc = a0 <= a1 ? (ang >= a0 && ang <= a1) : (ang >= a0 || ang <= a1);
    if (inArc) put(x, y, ...color);
  }
}
const W = [255, 255, 255, 255];
ring(128, 128, 96, 82, 0, Math.PI * 2, [255, 255, 255, 70]);          // faint orbit
ring(128, 92, 40, 20, Math.PI * 0.15, Math.PI * 1.55, W);          // upper S arc
ring(128, 164, 40, 20, Math.PI * 1.15, Math.PI * 0.55, W);         // lower S arc
for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {     // small "shuttle" dot on the orbit
  if (Math.hypot(x + .5 - 196, y + .5 - 60) <= 14) put(x, y, 255, 214, 10, 255);
}

// --- PNG encoder -------------------------------------------------------
function crc32(buf) { let c, crc = 0xffffffff; for (let n = 0; n < buf.length; n++) { c = (crc ^ buf[n]) & 0xff; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crc = (crc >>> 8) ^ c; } return (crc ^ 0xffffffff) >>> 0; }
function chunk(type, data) { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td)); return Buffer.concat([len, td, crc]); }
const raw = Buffer.alloc((SIZE * 4 + 1) * SIZE);
for (let y = 0; y < SIZE; y++) { raw[y * (SIZE * 4 + 1)] = 0; px.copy(raw, y * (SIZE * 4 + 1) + 1, y * SIZE * 4, (y + 1) * SIZE * 4); }
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(SIZE, 0); ihdr.writeUInt32BE(SIZE, 4); ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
fs.writeFileSync(path.join(__dirname, 'icon.png'), png);

// --- ICO wrapper (PNG-compressed entry, supported since Windows Vista) ----
const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
const entry = Buffer.alloc(16); entry[0] = 0; entry[1] = 0; entry[2] = 0; entry[3] = 0; entry.writeUInt16LE(1, 4); entry.writeUInt16LE(32, 6); entry.writeUInt32LE(png.length, 8); entry.writeUInt32LE(22, 12);
fs.writeFileSync(path.join(__dirname, 'icon.ico'), Buffer.concat([header, entry, png]));
console.log('wrote icon.png (%d bytes) and icon.ico', png.length);
