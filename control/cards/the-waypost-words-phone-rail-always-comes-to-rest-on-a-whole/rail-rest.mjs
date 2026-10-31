// What: drives the Waypost Words phone rail the way a person would — quick Next/Previous runs, swipes, wheel flicks, a turn of the phone mid-glide — and after each round reads where it came to rest.
// Run: npm run build, then node control/cards/<this card>/rail-rest.mjs [--engine=chromium|webkit] [--rounds=200] [--seed=1] [--reduced=1] [--trace=<round>]
// Settles: does the rail ever come to rest between two shots (issue 0026)?
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { extname, join } from 'node:path';

const arg = (n, f) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? f;
const ENGINE = arg('engine', 'chromium');
const ROUNDS = Number(arg('rounds', 200));
const REDUCED = arg('reduced', '') === '1';
const TRACE = Number(arg('trace', -1));
let seed = Number(arg('seed', 1));
const rng = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const int = (lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));

const require = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
const pw = require('playwright');

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.avif': 'image/avif', '.svg': 'image/svg+xml' };
const server = createServer((req, res) => {
  const url = decodeURI((req.url ?? '/').split('?')[0]);
  const f = [join('dist', url, 'index.html'), join('dist', url)].find((p) => existsSync(p) && statSync(p).isFile());
  if (!f) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[extname(f)] ?? 'application/octet-stream' });
  res.end(readFileSync(f));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

// Playwright's own browsers only, never the installed Chrome: no path, no run.
const executablePath = ENGINE === 'webkit'
  ? execSync('ls -d ~/Library/Caches/ms-playwright/webkit-* | tail -1').toString().trim() + '/pw_run.sh'
  : process.env.PUPPETEER_EXECUTABLE_PATH;
if (!executablePath || executablePath.startsWith('/Applications/')) throw new Error('set PUPPETEER_EXECUTABLE_PATH to Playwright\'s Chromium');
const browser = await pw[ENGINE].launch({ executablePath });
const page = await browser.newPage({ viewport: { width: 844, height: 390 }, reducedMotion: REDUCED ? 'reduce' : 'no-preference' });
await page.goto(`${base}/apps/waypost-words/`, { waitUntil: 'load' });
await page.locator('[data-phones]').scrollIntoViewIfNeeded();

// Wait until the rail has not moved for 600 ms, then say where it rests.
const rest = () => page.evaluate(() => new Promise((done) => {
  const t = document.querySelector('.phone-track');
  let last = -1, still = 0, waited = 0;
  const tick = () => {
    still = t.scrollLeft === last ? still + 50 : 0;
    last = t.scrollLeft; waited += 50;
    if (still >= 600 || waited >= 8000) {
      // Each shot's exact left edge in scroll terms: offsetLeft rounds to whole
      // pixels, and a step of 272.5 read as 273 puts shot 6 3 px off.
      const box = t.getBoundingClientRect().left;
      const lefts = [...t.querySelectorAll('.phone')].map((p) => p.getBoundingClientRect().left - box + t.scrollLeft);
      const step = lefts[1] - lefts[0];
      const max = t.scrollWidth - t.clientWidth;
      const off = Math.min(...lefts.map((l) => Math.abs(t.scrollLeft - l)));
      done({ x: t.scrollLeft, step, max, between: max > 1 && off > 2 && t.scrollLeft < max - 1, waited });
    } else setTimeout(tick, 50);
  };
  tick();
}));

// Prove the reading first: a rail held half-way across a shot must read as between.
await page.evaluate(() => { const t = document.querySelector('.phone-track'); const s = t.querySelectorAll('.phone'); t.style.scrollSnapType = 'none'; t.style.scrollBehavior = 'auto'; t.scrollLeft = (s[1].offsetLeft - s[0].offsetLeft) * 1.5; });
const proof = await rest();
console.log(`instrument: half-way rail reads ${proof.between ? 'between (good)' : 'NOT between — the reading is broken'} at ${proof.x}px`);
await page.evaluate(() => { const t = document.querySelector('.phone-track'); t.style.scrollSnapType = ''; t.style.scrollBehavior = ''; t.scrollLeft = 0; });

const sizes = [[844, 390], [390, 844], [1024, 768], [600, 900], [1440, 900], [1920, 1080], [320, 568]];
const breaks = [];
for (let round = 0; round < ROUNDS; round++) {
  await page.locator('[data-phones]').scrollIntoViewIfNeeded();
  if (round === TRACE) await page.evaluate(() => {
    const t = document.querySelector('.phone-track');
    const log = (window.__trace = []);
    const at = () => Math.round(performance.now());
    for (const e of ['scroll', 'scrollend', 'wheel']) t.addEventListener(e, () => log.push([at(), e, t.scrollLeft]), { passive: true });
    window.addEventListener('resize', () => log.push([at(), 'resize', t.scrollLeft, innerWidth]));
  });
  const kind = int(0, 4);
  const nav = page.locator(`[data-phones] .nav.${rng() < 0.5 ? 'next' : 'prev'}`);
  const box = await page.locator('.phone-track').boundingBox();
  const ev = { round, kind };
  if (kind === 0) { ev.taps = int(1, 4); for (let i = 0; i < ev.taps; i++) await nav.click({ force: true, delay: 0 }).catch(() => {}); }
  if (kind === 1 && box) { ev.dx = int(-400, 400); await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.wheel(ev.dx, 0); }
  if (kind === 2 && box) { ev.dx = int(-250, 250); const y = box.y + box.height / 2; await page.mouse.move(box.x + box.width / 2, y); await page.mouse.down(); await page.mouse.move(box.x + box.width / 2 + ev.dx, y, { steps: 5 }); await page.mouse.up(); }
  if (kind === 3) { await nav.click({ force: true }).catch(() => {}); ev.size = sizes[int(0, sizes.length - 1)]; await page.waitForTimeout(int(0, 200)); await page.setViewportSize({ width: ev.size[0], height: ev.size[1] }); }
  if (kind === 4 && box) { ev.dx = int(-400, 400); await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.wheel(ev.dx, 0); ev.size = sizes[int(0, sizes.length - 1)]; await page.waitForTimeout(int(0, 150)); await page.setViewportSize({ width: ev.size[0], height: ev.size[1] }); }
  const r = await rest();
  if (r.between) breaks.push({ ...ev, ...r });
  if (round === TRACE) { console.log(JSON.stringify({ ...ev, ...r })); console.log((await page.evaluate(() => window.__trace)).map((x) => x.join(' ')).join('\n')); break; }
  if (round % 25 === 24) await page.setViewportSize({ width: 844, height: 390 });
}
console.log(`${ENGINE}: ${ROUNDS} rounds, ${breaks.length} rests between shots`);
for (const b of breaks.slice(0, 10)) console.log(JSON.stringify(b));
await browser.close();
server.close();
process.exit(0);
