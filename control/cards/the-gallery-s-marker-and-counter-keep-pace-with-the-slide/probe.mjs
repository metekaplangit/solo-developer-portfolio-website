// What it does: serves dist/ and samples the gallery marker, counter and track scroll every frame through arrow, dot and stopped-swipe moves (headless Chrome, shell mode).
// How to run: node control/cards/<this card>/probe.mjs
// The question it settles: does the marker sit where the slides are at every frame, and does the counter switch at the halfway point.
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg' };
const srv = createServer((q, r) => { let p = join('dist', decodeURIComponent(q.url.split('?')[0])); if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html'); if (!existsSync(p)) p = 'dist/404.html'; r.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' }); r.end(readFileSync(p)); }).listen(0);
const base = `http://127.0.0.1:${srv.address().port}`;
const SAMPLE = `(async (action) => {
  const g = document.querySelector('.gallery'); g.scrollIntoView({ block: 'center' });
  const track = g.querySelector('.track'), marker = g.querySelector('.dot-marker'), dots = [...g.querySelectorAll('.dot')], counter = g.querySelector('.counter-now');
  const cx = (el) => { const r = el.getBoundingClientRect(); return r.left + r.width / 2; };
  const frame = () => { const p = track.scrollLeft / track.clientWidth; const lo = Math.floor(p), hi = Math.min(dots.length - 1, lo + 1), f = p - lo; const want = cx(dots[lo]) + (cx(dots[hi]) - cx(dots[lo])) * f; return { p: +p.toFixed(3), off: +(cx(marker) - want).toFixed(2), n: counter.textContent, cur: dots.findIndex(d => d.getAttribute('aria-current') === 'true') + 1 }; };
  await new Promise(r => setTimeout(r, 300));
  const out = [frame()];
  action(g, track, dots);
  const t0 = performance.now();
  await new Promise(done => { const tick = () => setTimeout(() => { out.push(frame()); performance.now() - t0 < 1200 ? requestAnimationFrame(tick) : done(); }, 0); requestAnimationFrame(tick); });
  const moving = out.filter(s => s.p % 1 > 0.01 && s.p % 1 < 0.99);
  const worst = Math.max(...out.map(s => Math.abs(s.off)));
  const switches = []; for (let i = 1; i < out.length; i++) if (out[i].n !== out[i - 1].n) switches.push(out[i - 1].p + '->' + out[i].p); const wrongN = out.filter(s => +s.n !== Math.round(s.p) + 1).map(s => s.p + ':' + s.n);
  const last = out[out.length - 1];
  return { frames: out.length, inBetween: moving.length, worstOffPx: worst, counterSwitchedBetween: switches, settled: last, counterMatchesDots: out.every(s => +s.n === s.cur), counterOffNearest: wrongN };
})`;
const out = {};
async function run(key, url, action, { width = 1440, touch = false, reduce = false } = {}) {
  for (let t = 1; t <= 3; t++) {
    let b;
    try {
      b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'shell' });
      const p = await b.newPage(); await p.setViewport({ width, height: 900, hasTouch: touch, isMobile: touch });
      if (reduce) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      await p.goto(base + url, { waitUntil: 'load' });
      out[key] = await p.evaluate(`${SAMPLE}(${action})`);
      if (key.startsWith('layout')) out[key + ' | slots'] = await p.evaluate(() => { const d = [...document.querySelectorAll('.gallery .dot')]; const r = d.map(e => e.getBoundingClientRect()); return `${d.length} dots, ${Math.round(r[0].width)}x${Math.round(r[0].height)} each, one row ${new Set(r.map(x => Math.round(x.top))).size === 1}, marker supported ${getComputedStyle(document.querySelector('.dot-marker')).display !== 'none'}`; });
      await b.close(); return;
    } catch (e) { out[key] = 'error: ' + e.message; await b?.close().catch(() => {}); }
  }
}
const NEXT = `(g) => g.querySelector('.nav.next').click()`;
await run('magic-notes 1440: next arrow', '/apps/magic-notes/', NEXT);
await run('magic-notes 1440: dot 6 (last)', '/apps/magic-notes/', `(g, t, d) => d[5].click()`);
await run('sole-focus 1440: arrow key right', '/apps/sole-focus/', `(g, t) => { t.focus(); t.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })); }`);
await run('sole-focus 1440: swipe let go at 45%', '/apps/sole-focus/', `(g, t) => { t.style.scrollBehavior = 'auto'; t.scrollLeft = t.clientWidth * 0.45; }`);
await run('layout magic-notes 320 touch: next arrow', '/apps/magic-notes/', NEXT, { width: 320, touch: true });
await run('layout magic-notes 390 touch: next arrow', '/apps/magic-notes/', NEXT, { width: 390, touch: true });
await run('reduced 1440: next arrow', '/apps/magic-notes/', NEXT, { reduce: true });
srv.close();
for (const [k, v] of Object.entries(out)) console.log(k, '=>', JSON.stringify(v));
