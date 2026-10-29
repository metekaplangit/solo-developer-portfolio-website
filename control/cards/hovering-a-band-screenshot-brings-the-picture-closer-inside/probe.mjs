// What it does: serves dist/ and times a band screenshot picture and its frame on hover, leave and keyboard focus, then checks the rounded corners stay clean (headless Chrome, shell mode).
// How to run: node control/cards/<this card>/probe.mjs
// The question it settles: does only the picture lean in (1.025, ~600 ms in, ~420 ms out) while the frame stays put and its hairline brightens.
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg' };
const srv = createServer((q, r) => { let p = join('dist', decodeURIComponent(q.url.split('?')[0])); if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html'); if (!existsSync(p)) p = 'dist/404.html'; r.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' }); r.end(readFileSync(p)); }).listen(0);
const base = `http://127.0.0.1:${srv.address().port}`;
const READ = `(sel) => { const f = document.querySelector(sel); const img = f.querySelector('img'); const r = f.getBoundingClientRect(); return { scale: +(new DOMMatrix(getComputedStyle(img).transform).a).toFixed(4), frame: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)].join(','), ring: (getComputedStyle(f.classList.contains('band-phones') ? f.querySelector('.band-phone') : f).boxShadow.match(/rgba?\\([^)]*\\)\\s+0px 0px 0px 1px/) || ['?'])[0] }; }`;
const out = {};
async function timeline(p, sel, ms) { const seen = []; const t0 = Date.now(); while (Date.now() - t0 < ms) { seen.push([Date.now() - t0, await p.evaluate(`(${READ})('${sel}')`)]); await new Promise(r => setTimeout(r, 20)); } return seen; }
const settleAt = (seen, target) => { const hit = seen.find(([, v]) => Math.abs(v.scale - target) < 0.0015); return hit ? hit[0] : 'never'; };
async function run(key, sel, { reduce = false, focus = false } = {}) {
  for (let t = 1; t <= 3; t++) {
    let b;
    try {
      b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'shell' });
      const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 });
      if (reduce) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      await p.goto(base + '/apps/', { waitUntil: 'load' });
      await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), sel); await new Promise(r => setTimeout(r, 900));
      const before = await p.evaluate(`(${READ})('${sel}')`);
      if (focus) { await p.keyboard.press('Tab'); await p.evaluate((s) => document.querySelector(s).focus(), sel); } else await p.hover(sel);
      const inSeen = await timeline(p, sel, 900);
      const corner = await p.evaluate((s) => { const r = document.querySelector(s.includes('phones') ? s + ' .band-phone' : s).getBoundingClientRect(); return { x: Math.round(r.x + 1), y: Math.round(r.y + 1), w: Math.round(r.width), h: Math.round(r.height) }; }, sel);
      const shot = await p.screenshot({ clip: { x: corner.x - 1, y: corner.y - 1, width: 6, height: 6 }, encoding: 'base64' });
      if (focus) await p.evaluate(() => document.activeElement.blur()); else await p.mouse.move(5, 5);
      const outSeen = await timeline(p, sel, 700);
      const held = inSeen.concat(outSeen).every(([, v]) => v.frame === before.frame);
      out[key] = { before, hovered: inSeen[inSeen.length - 1][1], reachedLeanAtMs: settleAt(inSeen, reduce ? 1 : 1.025), backAtMs: settleAt(outSeen, 1), frameNeverMoved: held, cornerPng: shot.length };
      await b.close(); return;
    } catch (e) { out[key] = 'error: ' + e.message; await b?.close().catch(() => {}); }
  }
}
await run('mac shot, hover', '#p-magic-notes .band-shot, .band-shot');
await run('phones, hover', '.band-phones');
await run('mac shot, keyboard focus', '.band-shot', { focus: true });
await run('mac shot, reduced motion', '.band-shot', { reduce: true });
srv.close();
for (const [k, v] of Object.entries(out)) console.log(k, '=>', JSON.stringify(v));
