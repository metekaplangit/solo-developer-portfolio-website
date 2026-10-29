// What it does: serves dist/ and measures the page change and opening landing in headless Chrome (shell mode).
// How to run: node control/cards/<this card>/probe.mjs
// The question it settles: does the old page leave in 160 ms, does each opening land in order, and does reduced motion turn it off.
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.xml': 'text/xml', '.webmanifest': 'application/json' };
const srv = createServer((q, r) => { let p = join('dist', decodeURIComponent(q.url.split('?')[0])); if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html'); if (!existsSync(p)) p = 'dist/404.html'; r.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' }); r.end(readFileSync(p)); }).listen(0);
const base = `http://127.0.0.1:${srv.address().port}`;
const INIT = `window.__vt = null; addEventListener('pagereveal', e => { if (!e.viewTransition) return; requestAnimationFrame(() => { window.__vt = document.getAnimations().filter(a => a.effect && a.effect.pseudoElement).map(a => [a.effect.pseudoElement, a.animationName, a.effect.getTiming().duration]); }); });
window.__land = []; const f = () => { const els = [...document.querySelectorAll('[data-land]')]; if (els.length) window.__land.push([performance.now(), ...els.map(e => +getComputedStyle(e).opacity)]); if (performance.now() < 3000) requestAnimationFrame(f); }; requestAnimationFrame(f);`;
const out = {};
const landing = rows => { if (!rows.length) return null; const n = rows[0].length - 1; return Array.from({ length: n }, (_, i) => { const s = rows.find(r => r[i + 1] > 0.02), e = rows.find(r => r[i + 1] > 0.99); return [s ? Math.round(s[0] - rows[0][0]) : null, e ? Math.round(e[0] - rows[0][0]) : null]; }); };
const delays = p => p.evaluate(() => [...document.querySelectorAll('[data-land]')].map(e => e.getAnimations().map(a => a.effect.getTiming().delay)[0] ?? null));
// Chrome on this Mac quits pages now and then (issue 0013), so every reading gets its own browser and 3 tries.
async function reading(key, motion, fn) {
  for (let t = 1; t <= 3; t++) {
    const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'shell' });
    try { const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 }); await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: motion }]); await p.evaluateOnNewDocument(INIT); out[key] = await fn(p); await b.close(); return; }
    catch (e) { out[key] = { error: e.message, try: t }; await b.close().catch(() => {}); }
  }
}
for (const motion of ['no-preference', 'reduce']) {
  for (const path of ['/', '/apps/', '/apps/magic-notes/', '/about/', '/support/', '/privacy/sole-focus/', '/nope']) {
    await reading(`${motion} load ${path}`, motion, async p => { await p.goto(base + path, { waitUntil: 'load' }); await new Promise(r => setTimeout(r, 1200)); return { land: landing(await p.evaluate(() => window.__land)), delays: await delays(p), vtIn: await p.evaluate(() => document.documentElement.classList.contains('vt-in')) }; });
  }
  await reading(`${motion} nav /apps/ -> /apps/magic-notes/`, motion, async p => {
    await p.goto(base + '/apps/', { waitUntil: 'load' }); await new Promise(r => setTimeout(r, 600));
    await Promise.all([p.waitForNavigation({ waitUntil: 'load' }), p.evaluate(() => document.querySelector('a[href="/apps/magic-notes/"]').click())]);
    await new Promise(r => setTimeout(r, 1200));
    return { vt: await p.evaluate(() => window.__vt), vtIn: await p.evaluate(() => document.documentElement.classList.contains('vt-in')), land: landing(await p.evaluate(() => window.__land)), delays: await delays(p) };
  });
}
srv.close();
for (const [k, v] of Object.entries(out)) console.log(k, JSON.stringify(v));
