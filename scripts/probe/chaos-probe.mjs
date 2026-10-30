// What: chaos-project's seeded driver — storms, impossible sequences, held races, grotesque addresses and interruptions against the built site in Playwright, the invariants checked every 25 events.
// Run: npm run build, then node scripts/probe/chaos-probe.mjs --block=control|storm|sequences|races|grotesque|interrupt|chain [--seed=1] [--events=3000] [--configs=8] [--engine=chromium|webkit] [--replay=<log.jsonl> --upto=<step>]   (always `control` first; uses the global `playwright` install)
// Settles: where does the site stop working when a visitor is careless, fast, or interrupted — a gallery whose counter lies, a page that errors, a state with no way out?
import { createServer } from 'node:http';
import { appendFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { extname, join } from 'node:path';

const arg = (name, fallback) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback;
const BLOCK = arg('block', 'control');
const SEED = Number(arg('seed', 1));
const EVENTS = Number(arg('events', 3000));
const CONFIGS = Number(arg('configs', 8));
const ENGINE = arg('engine', 'chromium');
const REPLAY = arg('replay', '');
const UPTO = Number(arg('upto', Infinity));
const LOGS = arg('logs', join(tmpdir(), 'portfolio-chaos'));
mkdirSync(LOGS, { recursive: true });

const require = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
const { chromium, webkit } = require('playwright');

// ——— Randomness: one seed, one sequence ———
function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (rng, list) => list[Math.floor(rng() * list.length)];
const int = (rng, lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const LIMIT = Symbol('limit');
const withLimit = (p, ms) => Promise.race([p, new Promise((r) => setTimeout(() => r(LIMIT), ms))]);

// ——— The built site, served for this run alone on a free port ———
const DIST = 'dist';
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json', '.avif': 'image/avif', '.txt': 'text/plain' };
const server = createServer((req, res) => {
  let url;
  try { url = decodeURI((req.url ?? '/').split('?')[0].split('#')[0]); } catch { url = '/%%bad'; }
  const c = url.endsWith('/') ? [join(DIST, url, 'index.html')] : [join(DIST, url), join(DIST, url, 'index.html')];
  const f = c.find((p) => p.startsWith(DIST) && existsSync(p) && statSync(p).isFile());
  if (!f) { res.writeHead(404, { 'Content-Type': 'text/html' }); res.end(readFileSync(join(DIST, '404.html'))); return; }
  res.writeHead(200, { 'Content-Type': MIME[extname(f)] ?? 'application/octet-stream' });
  res.end(readFileSync(f));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

// ——— Every surface this run must reach: the denominator of the coverage table ———
export const SURFACES = [
  '/', '/apps/', '/apps/sole-focus/', '/apps/magic-notes/', '/apps/waypost-words/', '/about/', '/support/',
  '/privacy/', '/privacy/sole-focus/', '/privacy/magic-notes/', '/privacy/waypost-words/', '/404', '/apps/wander-words/', '/privacy/wander-words/',
  'gallery:sole-focus', 'gallery:magic-notes', 'rail:waypost-words', 'external',
];
const ROUTES = SURFACES.filter((s) => s.startsWith('/'));
const hits = Object.fromEntries(SURFACES.map((s) => [s, 0]));
const checks = Object.fromEntries(SURFACES.map((s) => [s, 0]));
const breaks = [];

// ——— The browser ———
const engine = ENGINE === 'webkit' ? webkit : chromium;
const launchOpts = ENGINE === 'webkit'
  ? { executablePath: execSync('ls -d ~/Library/Caches/ms-playwright/webkit-* | tail -1').toString().trim() + '/pw_run.sh' }
  : { executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ignoreDefaultArgs: ['--disable-back-forward-cache'] };
let browser = await engine.launch(launchOpts);

async function fresh({ width = 1440, height = 900, reduced = false, js = true, touch = false } = {}) {
  if (!browser.isConnected()) browser = await engine.launch(launchOpts);
  const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: reduced ? 'reduce' : 'no-preference', javaScriptEnabled: js, hasTouch: touch });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error' && !/404 \(Not Found\)/.test(m.text())) errors.push(`console ${m.text().slice(0, 160)}`); });
  page.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith(base) && r.request().resourceType() !== 'document') errors.push(`${r.status()} ${r.url().replace(base, '')}`); });
  page.on('crash', () => errors.push('page crashed'));
  // Nothing leaves this machine: every other origin gets a stub page.
  await ctx.route((u) => !u.href.startsWith(base), (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>external</title><p>external</p>' }));
  return { ctx, page, errors };
}

// ——— Where the driver is: the readable signal ———
async function surfaceOf(page) {
  const u = page.url();
  if (!u.startsWith(base)) return 'external';
  const path = new URL(u).pathname;
  if (ROUTES.includes(path)) return path;
  return '/404';
}

// ——— The invariants, read from the page ———
const SNAPSHOT = () => {
  const out = { problems: [], gallery: [], rail: [] };
  const de = document.documentElement;
  if (de.scrollWidth > de.clientWidth + 1) out.problems.push(`page scrolls sideways: ${de.scrollWidth} > ${de.clientWidth}`);
  if (!document.querySelector('main')) out.problems.push('no <main>');
  if (!document.title.trim()) out.problems.push('empty title');
  if (document.activeViewTransition) out.problems.push('a view transition is still running after the settle');
  const navLinks = [...document.querySelectorAll('header nav a')];
  if (!navLinks.length) out.problems.push('no header links: no way out');
  const cur = navLinks.filter((a) => a.getAttribute('aria-current') === 'page');
  const path = location.pathname;
  for (const a of cur) {
    const t = new URL(a.href).pathname.replace(/\/+$/, '') || '/';
    const h = path.replace(/\/+$/, '') || '/';
    const ok = t === '/' ? h === '/' : h === t || h.startsWith(t + '/');
    if (!ok) out.problems.push(`header marks ${t} current on ${path}`);
  }
  for (const g of document.querySelectorAll('.gallery')) {
    const track = g.querySelector('.track');
    const slides = [...track.querySelectorAll('.slide')];
    const n = slides.length;
    const idx = Math.round(track.scrollLeft / track.clientWidth);
    const counter = Number(g.querySelector('.counter-now')?.textContent);
    const dot = [...g.querySelectorAll('.dot')].findIndex((d) => d.getAttribute('aria-current') === 'true');
    const prev = g.querySelector('.nav.prev'), next = g.querySelector('.nav.next');
    const snapped = slides.some((s) => Math.abs(s.offsetLeft - track.offsetLeft - track.scrollLeft) <= 2);
    const r = { n, idx, counter, dot, scrollLeft: track.scrollLeft, w: track.clientWidth, snapped, prevDis: prev?.disabled, nextDis: next?.disabled };
    out.gallery.push(r);
    if (!snapped) out.problems.push(`gallery left between pictures at ${track.scrollLeft}px (w ${track.clientWidth})`);
    if (counter !== idx + 1) out.problems.push(`gallery counter says ${counter}, picture shown is ${idx + 1}`);
    if (dot !== idx) out.problems.push(`gallery dot ${dot + 1} current, picture shown is ${idx + 1}`);
    if (prev && prev.disabled !== (idx === 0)) out.problems.push(`gallery Previous ${prev.disabled ? 'off' : 'on'} on picture ${idx + 1}`);
    if (next && next.disabled !== (idx === n - 1)) out.problems.push(`gallery Next ${next.disabled ? 'off' : 'on'} on picture ${idx + 1} of ${n}`);
  }
  for (const g of document.querySelectorAll('[data-phones]')) {
    const track = g.querySelector('.phone-track');
    const s = [...track.querySelectorAll('.phone')];
    const step = s[1].offsetLeft - s[0].offsetLeft;
    const max = track.scrollWidth - track.clientWidth;
    const from = Number(g.querySelector('.phone-from')?.textContent);
    const to = Number(g.querySelector('.phone-to')?.textContent);
    const prev = g.querySelector('.nav.prev'), next = g.querySelector('.nav.next');
    const first = Math.round(track.scrollLeft / step);
    const perView = Math.max(1, Math.round((track.clientWidth + (step - s[0].offsetWidth)) / step));
    const r = { n: s.length, from, to, first, perView, scrollLeft: track.scrollLeft, max, prevDis: prev.disabled, nextDis: next.disabled };
    out.rail.push(r);
    if (from !== first + 1) out.problems.push(`rail count starts at ${from}, first shot shown is ${first + 1}`);
    if (to !== Math.min(s.length, first + perView)) out.problems.push(`rail count ends at ${to}, last shot shown is ${Math.min(s.length, first + perView)}`);
    if (prev.disabled !== (track.scrollLeft <= 1)) out.problems.push(`rail Previous ${prev.disabled ? 'off' : 'on'} at ${track.scrollLeft}px`);
    if (next.disabled !== (track.scrollLeft >= max - 1)) out.problems.push(`rail Next ${next.disabled ? 'off' : 'on'} at ${track.scrollLeft}px of ${max}`);
    if (max > 1 && Math.abs(track.scrollLeft - first * step) > 2 && track.scrollLeft < max - 1) out.problems.push(`rail left between shots at ${track.scrollLeft}px`);
  }
  return out;
};

// Wait until every scroller has been still for 500 ms (or 6 s), then read.
async function settle(page) {
  const r = await withLimit(page.evaluate(() => new Promise((done) => {
    const sc = [document.scrollingElement, ...document.querySelectorAll('.track, .phone-track')].filter(Boolean);
    let last = sc.map((e) => e.scrollLeft + ',' + e.scrollTop).join('|'), still = 0, t = 0;
    const tick = () => {
      const now = sc.map((e) => e.scrollLeft + ',' + e.scrollTop).join('|');
      still = now === last && !document.activeViewTransition ? still + 50 : 0;
      last = now; t += 50;
      if (still >= 500 || t >= 6000) done(t); else setTimeout(tick, 50);
    };
    setTimeout(tick, 50);
  })).catch(() => 'gone'), 8000);
  return r;
}

async function check(page, errors, where, tag) {
  // A page that forwards (the moved addresses) or is still arriving is read once it has
  // loaded, never mid-load: the first storm read half-loaded pages as breaks.
  for (let i = 0; i < 3; i++) {
    await withLimit(page.waitForLoadState('load').catch(() => {}), 5000);
    if ((await settle(page)) !== 'gone') break;
  }
  await withLimit(page.waitForLoadState('load').catch(() => {}), 5000);
  const surface = await surfaceOf(page).catch(() => 'gone');
  if (surface === 'external') return [];
  let snap;
  try { snap = await page.evaluate(SNAPSHOT); } catch (e) { snap = { problems: [`could not read the page: ${String(e.message).slice(0, 80)}`], gallery: [], rail: [] }; }
  checks[surface] = (checks[surface] ?? 0) + 1;
  if (snap.gallery.length) checks[`gallery:${surface.split('/')[2]}`] = (checks[`gallery:${surface.split('/')[2]}`] ?? 0) + 1;
  if (snap.rail.length) checks['rail:waypost-words'] += 1;
  const problems = [...errors.splice(0), ...snap.problems];
  for (const p of problems) breaks.push({ tag, where, surface, problem: p, gallery: snap.gallery, rail: snap.rail });
  return problems;
}

// ——— The storm's actions ———
const ACTIONS = ['clickRandom', 'clickControl', 'dblclick', 'wheel', 'wheelX', 'key', 'tab', 'back', 'forward', 'resize', 'hover', 'drag', 'reload', 'goto', 'dot', 'arrow'];
const KEYS = ['ArrowLeft', 'ArrowRight', 'Enter', ' ', 'Escape', 'Home', 'End', 'PageDown', 'PageUp', 'Shift+Tab', 'Tab', 'ArrowDown'];
const SIZES = [[1440, 900], [390, 844], [844, 390], [1024, 768], [320, 568], [1920, 1080], [768, 1024], [600, 900]];

async function act(page, rng, a, log) {
  const vp = page.viewportSize();
  const ev = { a };
  switch (a) {
    case 'clickRandom': ev.x = int(rng, 0, vp.width - 1); ev.y = int(rng, 0, vp.height - 1); await page.mouse.click(ev.x, ev.y); break;
    case 'dblclick': ev.x = int(rng, 0, vp.width - 1); ev.y = int(rng, 0, vp.height - 1); await page.mouse.dblclick(ev.x, ev.y); break;
    case 'clickControl': {
      const boxes = await page.evaluate(() => [...document.querySelectorAll('a, button')].map((e) => { const r = e.getBoundingClientRect(); return r.width && r.height && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth ? [r.left + r.width / 2, r.top + r.height / 2] : null; }).filter(Boolean));
      if (!boxes.length) break;
      [ev.x, ev.y] = pick(rng, boxes); await page.mouse.click(ev.x, ev.y); break;
    }
    case 'dot': case 'arrow': {
      const sel = a === 'dot' ? '.dot' : '.nav.prev, .nav.next';
      const boxes = await page.evaluate((s) => [...document.querySelectorAll(s)].map((e) => { e.scrollIntoView({ block: 'center', behavior: 'instant' }); const r = e.getBoundingClientRect(); return r.width ? [r.left + r.width / 2, r.top + r.height / 2] : null; }).filter(Boolean), sel);
      if (!boxes.length) break;
      [ev.x, ev.y] = pick(rng, boxes); ev.n = int(rng, 1, 6);
      for (let i = 0; i < ev.n; i++) await page.mouse.click(ev.x, ev.y);
      break;
    }
    case 'wheel': ev.dy = int(rng, -1200, 1200); await page.mouse.move(int(rng, 0, vp.width - 1), int(rng, 0, vp.height - 1)); await page.mouse.wheel(0, ev.dy); break;
    case 'wheelX': {
      const t = await page.evaluate(() => { const e = document.querySelector('.track, .phone-track'); if (!e) return null; e.scrollIntoView({ block: 'center', behavior: 'instant' }); const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
      if (!t) break;
      ev.dx = int(rng, -900, 900); await page.mouse.move(t[0], t[1]); await page.mouse.wheel(ev.dx, 0); break;
    }
    case 'key': ev.k = pick(rng, KEYS); ev.n = int(rng, 1, 5); for (let i = 0; i < ev.n; i++) await page.keyboard.press(ev.k); break;
    case 'tab': ev.n = int(rng, 1, 12); for (let i = 0; i < ev.n; i++) await page.keyboard.press('Tab'); break;
    case 'back': await withLimit(page.goBack({ waitUntil: 'commit' }).catch(() => {}), 3000); break;
    case 'forward': await withLimit(page.goForward({ waitUntil: 'commit' }).catch(() => {}), 3000); break;
    case 'resize': [ev.w, ev.h] = pick(rng, SIZES); await page.setViewportSize({ width: ev.w, height: ev.h }); break;
    case 'hover': ev.x = int(rng, 0, vp.width - 1); ev.y = int(rng, 0, vp.height - 1); await page.mouse.move(ev.x, ev.y, { steps: 3 }); break;
    case 'drag': {
      ev.x = int(rng, 0, vp.width - 1); ev.y = int(rng, 0, vp.height - 1); ev.dx = int(rng, -600, 600);
      await page.mouse.move(ev.x, ev.y); await page.mouse.down(); await page.mouse.move(ev.x + ev.dx, ev.y, { steps: 5 }); await page.mouse.up(); break;
    }
    case 'reload': await withLimit(page.reload({ waitUntil: 'commit' }).catch(() => {}), 4000); break;
    case 'goto': ev.to = pick(rng, ROUTES.filter((r) => r !== '/404')); await withLimit(page.goto(base + ev.to, { waitUntil: 'commit' }).catch(() => {}), 4000); break;
  }
  log?.(ev);
  return ev;
}

// ——— Blocks ———
const results = { block: BLOCK, engine: ENGINE, seed: SEED };
const logFile = join(LOGS, `${BLOCK}-${ENGINE}-seed${SEED}.jsonl`);
const say = (s) => console.log(s);

async function storm() {
  writeFileSync(logFile, '');
  const rng = mulberry32(SEED);
  const configs = Array.from({ length: CONFIGS }, () => ACTIONS.filter(() => rng() > 0.35));
  const per = Math.floor(EVENTS / CONFIGS);
  let step = 0;
  for (const [ci, cfg] of configs.entries()) {
    if (!cfg.length) continue;
    const [w, h] = pick(rng, SIZES);
    const reduced = rng() < 0.2;
    const { ctx, page, errors } = await fresh({ width: w, height: h, reduced });
    const start = pick(rng, ROUTES.filter((r) => r !== '/404'));
    await withLimit(page.goto(base + start, { waitUntil: 'load' }).catch(() => {}), 8000);
    const fast = rng() < 0.5;
    say(`config ${ci} [${cfg.join(',')}] ${w}x${h}${reduced ? ' reduced' : ''} from ${start} ${fast ? 'fast' : 'gapped'}`);
    for (let k = 0; k < per; k++, step++) {
      // Directed between surfaces: every 40 events, go to the least-hit route.
      let a = pick(rng, cfg);
      if (k % 40 === 39) { a = 'goto-least'; }
      const surface = await surfaceOf(page).catch(() => 'gone');
      // An external stub is left by going to the least-visited route, not Back: Back from a
      // stub opened in a new history entry stayed on it in WebKit and spent 1,370 events there.
      if (surface === 'external') { hits.external++; await withLimit(page.goto(base + ROUTES.filter((r) => r !== '/404').sort((x, y) => hits[x] - hits[y])[0], { waitUntil: 'commit' }).catch(() => {}), 4000); }
      hits[surface] = (hits[surface] ?? 0) + 1;
      const gal = await page.evaluate(() => [!!document.querySelector('.gallery'), !!document.querySelector('[data-phones]')]).catch(() => [false, false]);
      if (gal[0]) hits[`gallery:${surface.split('/')[2]}`]++;
      if (gal[1]) hits['rail:waypost-words']++;
      let ev;
      try {
        if (a === 'goto-least') {
          const least = ROUTES.filter((r) => r !== '/404').sort((x, y) => hits[x] - hits[y])[0];
          ev = { a: 'goto', to: least };
          await withLimit(page.goto(base + least, { waitUntil: 'commit' }).catch(() => {}), 4000);
        } else ev = await withLimit(act(page, rng, a), 6000);
      } catch (e) { ev = { a, err: String(e.message).slice(0, 100) }; }
      if (ev === LIMIT) ev = { a, limit: true };
      if (!fast) await sleep(int(rng, 0, 40));
      appendFileSync(logFile, JSON.stringify({ step, config: ci, surface, ...ev }) + '\n');
      if (k % 25 === 24) {
        const p = await check(page, errors, `seed ${SEED} step ${step}`, `storm c${ci}`);
        if (p.length) say(`  BREAK seed ${SEED} step ${step} on ${surface}: ${p.join(' | ')}`);
      }
    }
    await check(page, errors, `seed ${SEED} step ${step} end`, `storm c${ci}`);
    await ctx.close();
  }
  results.events = step;
}

async function replay() {
  const lines = readFileSync(REPLAY, 'utf-8').trim().split('\n').map((l) => JSON.parse(l)).filter((e) => e.step <= UPTO);
  const cfgOf = lines[0].config;
  say(`replaying ${lines.length} events of ${REPLAY}`);
  const first = arg('from', '/');
  const { ctx, page, errors } = await fresh({ width: Number(arg('w', 1440)), height: Number(arg('h', 900)), reduced: arg('reduced', '') === '1' });
  await page.goto(base + first, { waitUntil: 'load' });
  for (const ev of lines) {
    if (ev.config !== cfgOf) continue;
    const vp = page.viewportSize();
    try {
      switch (ev.a) {
        case 'clickRandom': case 'clickControl': await page.mouse.click(ev.x, ev.y); break;
        case 'dot': case 'arrow': for (let i = 0; i < (ev.n ?? 1); i++) await page.mouse.click(ev.x, ev.y); break;
        case 'dblclick': await page.mouse.dblclick(ev.x, ev.y); break;
        case 'wheel': await page.mouse.wheel(0, ev.dy); break;
        case 'wheelX': await page.mouse.wheel(ev.dx, 0); break;
        case 'key': for (let i = 0; i < ev.n; i++) await page.keyboard.press(ev.k); break;
        case 'tab': for (let i = 0; i < ev.n; i++) await page.keyboard.press('Tab'); break;
        case 'back': await page.goBack({ waitUntil: 'commit' }).catch(() => {}); break;
        case 'forward': await page.goForward({ waitUntil: 'commit' }).catch(() => {}); break;
        case 'resize': await page.setViewportSize({ width: ev.w, height: ev.h }); break;
        case 'hover': await page.mouse.move(ev.x, ev.y); break;
        case 'drag': await page.mouse.move(ev.x, ev.y); await page.mouse.down(); await page.mouse.move(ev.x + ev.dx, ev.y, { steps: 5 }); await page.mouse.up(); break;
        case 'reload': await page.reload({ waitUntil: 'commit' }).catch(() => {}); break;
        case 'goto': await page.goto(base + ev.to, { waitUntil: 'commit' }).catch(() => {}); break;
      }
    } catch {}
    void vp;
  }
  const p = await check(page, errors, `replay upto ${UPTO}`, 'replay');
  say(p.length ? `REPLAY BREAK: ${p.join(' | ')}` : 'replay clean');
  await ctx.close();
}

// Gallery helpers for the deliberate blocks.
const galleryState = (page) => page.evaluate(() => { const g = document.querySelector('.gallery'); const t = g.querySelector('.track'); return { idx: Math.round(t.scrollLeft / t.clientWidth), counter: g.querySelector('.counter-now').textContent, n: t.querySelectorAll('.slide').length }; });
const centre = (page, sel) => page.evaluate((s) => { const e = document.querySelector(s); e.scrollIntoView({ block: 'center', behavior: 'instant' }); const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, sel);

async function scenario(name, opts, fn) {
  const { ctx, page, errors } = await fresh(opts);
  let problems;
  try {
    const extra = (await withLimit(fn(page, ctx), 45000)) ?? [];
    problems = extra === LIMIT ? ['scenario timed out (driver or page)'] : extra;
    problems = [...problems, ...(await check(page, errors, name, BLOCK))];
  } catch (e) { problems = [`driver error: ${String(e.message).slice(0, 140)}`]; }
  say(`${problems.length ? 'BREAK' : 'held '} ${name}${problems.length ? ': ' + [...new Set(problems)].join(' | ') : ''}`);
  results[name] = problems;
  await ctx.close().catch(() => {});
}

const GAL = ['/apps/sole-focus/', '/apps/magic-notes/'];
const RAIL = '/apps/waypost-words/';

async function sequences() {
  for (const r of GAL) {
    await scenario(`40 Next taps ${r}`, {}, async (page) => {
      await page.goto(base + r, { waitUntil: 'load' }); await sleep(800);
      const [x, y] = await centre(page, '.gallery .nav.next');
      for (let i = 0; i < 40; i++) await page.mouse.click(x, y);
      await settle(page); const s = await galleryState(page);
      return s.idx === s.n - 1 ? [] : [`after 40 Next taps the gallery is on ${s.idx + 1} of ${s.n}`];
    });
    await scenario(`40 Previous taps at the start, by script ${r}`, {}, async (page) => {
      await page.goto(base + r, { waitUntil: 'load' }); await sleep(800);
      await page.evaluate(() => { const b = document.querySelector('.gallery .nav.prev'); for (let i = 0; i < 40; i++) b.click(); });
      await settle(page); const s = await galleryState(page);
      return s.idx === 0 ? [] : [`disabled Previous moved the gallery to ${s.idx + 1}`];
    });
    await scenario(`ArrowRight held 60 times then ArrowLeft 3 ${r}`, {}, async (page) => {
      await page.goto(base + r, { waitUntil: 'load' }); await sleep(800);
      await page.focus('.gallery .track');
      for (let i = 0; i < 60; i++) await page.keyboard.press('ArrowRight');
      await settle(page);
      const s1 = await galleryState(page);
      for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowLeft');
      await settle(page); const s2 = await galleryState(page);
      const p = [];
      if (s1.idx !== s1.n - 1) p.push(`60 ArrowRight left it on ${s1.idx + 1} of ${s1.n}`);
      if (s2.idx !== s1.n - 4) p.push(`then 3 ArrowLeft landed on ${s2.idx + 1}, expected ${s1.n - 3}`);
      return p;
    });
    await scenario(`last dot then first dot in one instant ${r}`, {}, async (page) => {
      await page.goto(base + r, { waitUntil: 'load' }); await sleep(800);
      await page.evaluate(() => { const d = document.querySelectorAll('.gallery .dot'); d[d.length - 1].click(); d[0].click(); });
      await settle(page); const s = await galleryState(page);
      return s.idx === 0 ? [] : [`last-then-first landed on ${s.idx + 1}`];
    });
    await scenario(`Next and Previous in one instant ${r}`, {}, async (page) => {
      await page.goto(base + r, { waitUntil: 'load' }); await sleep(800);
      await page.evaluate(() => { const g = document.querySelector('.gallery'); g.querySelector('.dot:nth-child(1)'); g.querySelectorAll('.dot')[2].click(); });
      await settle(page);
      await page.evaluate(() => { const g = document.querySelector('.gallery'); g.querySelector('.nav.next').click(); g.querySelector('.nav.prev').click(); });
      await settle(page); const s = await galleryState(page);
      return s.idx === 1 || s.idx === 2 ? [] : [`Next+Previous from 3 landed on ${s.idx + 1}`];
    });
  }
  await scenario('rail 40 Next taps then 40 ArrowLeft', {}, async (page) => {
    await page.goto(base + RAIL, { waitUntil: 'load' }); await sleep(800);
    const [x, y] = await centre(page, '[data-phones] .nav.next');
    for (let i = 0; i < 40; i++) await page.mouse.click(x, y);
    await settle(page);
    const end = await page.evaluate(() => { const t = document.querySelector('.phone-track'); return t.scrollLeft >= t.scrollWidth - t.clientWidth - 1; });
    await page.focus('.phone-track');
    for (let i = 0; i < 40; i++) await page.keyboard.press('ArrowLeft');
    await settle(page);
    const start = await page.evaluate(() => document.querySelector('.phone-track').scrollLeft <= 1);
    return [...(end ? [] : ['40 Next taps did not reach the end']), ...(start ? [] : ['40 ArrowLeft did not return to the start'])];
  });
  await scenario('back past the first page', {}, async (page) => {
    await page.goto(base + '/', { waitUntil: 'load' });
    for (let i = 0; i < 6; i++) await page.goBack({ waitUntil: 'commit' }).catch(() => {});
    await sleep(500);
    return page.url().startsWith(base) ? [] : [`back past the first page left the site: ${page.url()}`];
  });
  await scenario('a header link pressed 15 times as fast as possible', {}, async (page) => {
    await page.goto(base + '/', { waitUntil: 'load' });
    const [x, y] = await centre(page, 'header nav a[href="/apps/"]');
    for (let i = 0; i < 15; i++) await page.mouse.click(x, y).catch(() => {});
    await page.waitForLoadState('load');
    const len = await page.evaluate(() => history.length);
    return new URL(page.url()).pathname === '/apps/' ? (len > 3 ? [`15 presses left ${len} history entries`] : []) : [`ended on ${page.url()}`];
  });
  await scenario('every header link, then the one already current, pressed 5 times', {}, async (page) => {
    await page.goto(base + '/support/', { waitUntil: 'load' });
    const [x, y] = await centre(page, 'header nav a[aria-current="page"]');
    for (let i = 0; i < 5; i++) await page.mouse.click(x, y).catch(() => {});
    await page.waitForLoadState('load'); await sleep(600);
    return new URL(page.url()).pathname === '/support/' ? [] : [`ended on ${page.url()}`];
  });
  await scenario('skip link, then Tab: focus lands in main', {}, async (page) => {
    await page.goto(base + '/apps/sole-focus/', { waitUntil: 'load' });
    await page.keyboard.press('Tab'); await page.keyboard.press('Enter'); await page.keyboard.press('Tab');
    const inMain = await page.evaluate(() => !!document.activeElement?.closest('main'));
    return inMain ? [] : [`after skip link + Tab focus is on ${await page.evaluate(() => document.activeElement?.outerHTML.slice(0, 80))}`];
  });
  await scenario('Tab 200 times on every route: focus is never stuck', {}, async (page) => {
    const p = [];
    for (const r of ROUTES.filter((x) => !x.includes('wander') && x !== '/404')) {
      await page.goto(base + r, { waitUntil: 'load' });
      const seen = new Set(); let stuck = 0, lastEl = '';
      for (let i = 0; i < 200; i++) {
        await page.keyboard.press('Tab');
        const el = await page.evaluate(() => { const a = document.activeElement; return a ? a.tagName + (a.getAttribute('href') ?? '') + (a.className ?? '') + [...a.parentNode.children].indexOf(a) : 'none'; });
        if (el === lastEl) stuck++; lastEl = el; seen.add(el);
      }
      if (stuck > 3) p.push(`${r}: focus stayed on one element ${stuck} times`);
      if (seen.size < 3) p.push(`${r}: Tab reached only ${seen.size} elements`);
      p.push(...(await check(page, [], `tab ${r}`, 'sequences')));
    }
    return p;
  });
}

async function races() {
  for (const r of GAL) {
    await scenario(`resize mid-glide ${r}`, {}, async (page) => {
      await page.goto(base + r, { waitUntil: 'load' }); await sleep(800);
      const p = [];
      for (const delay of [16, 60, 120, 250]) {
        await page.setViewportSize({ width: 1440, height: 900 }); await settle(page);
        await page.evaluate(() => document.querySelectorAll('.gallery .dot')[3].click());
        await sleep(delay);
        await page.setViewportSize({ width: 390, height: 844 });
        p.push(...(await check(page, [], `resize after ${delay}ms`, 'races')).map((x) => `${delay}ms: ${x}`));
      }
      return p;
    });
    await scenario(`rotate 20 times while gliding ${r}`, { touch: false }, async (page) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(base + r, { waitUntil: 'load' }); await sleep(800);
      await page.evaluate(() => document.querySelectorAll('.gallery .dot')[4].click());
      for (let i = 0; i < 20; i++) { await page.setViewportSize(i % 2 ? { width: 390, height: 844 } : { width: 844, height: 390 }); await sleep(30); }
      await settle(page);
      const s = await galleryState(page);
      return s.idx === 4 ? [] : [`after rotating mid-glide to 5 the gallery is on ${s.idx + 1}`];
    });
    await scenario(`a dot pressed mid-glide to another dot ${r}`, {}, async (page) => {
      await page.goto(base + r, { waitUntil: 'load' }); await sleep(800);
      const p = [];
      for (const delay of [20, 80, 200]) {
        await page.evaluate(() => document.querySelectorAll('.gallery .dot')[0].click()); await settle(page);
        await page.evaluate(() => document.querySelectorAll('.gallery .dot')[4].click());
        await sleep(delay);
        await page.evaluate(() => document.querySelectorAll('.gallery .dot')[1].click());
        await settle(page);
        const s = await galleryState(page);
        if (s.idx !== 1) p.push(`${delay}ms: dot 2 pressed during a glide to 5 ended on ${s.idx + 1}`);
      }
      return p;
    });
    await scenario(`sideways wheel and ArrowRight together ${r}`, {}, async (page) => {
      await page.goto(base + r, { waitUntil: 'load' }); await sleep(800);
      const [x, y] = await centre(page, '.gallery .track');
      await page.mouse.move(x, y); await page.focus('.gallery .track');
      for (let i = 0; i < 6; i++) { await page.mouse.wheel(180, 0); await page.keyboard.press('ArrowRight'); }
      return [];
    });
    await scenario(`gallery script held 3 s while the visitor swipes ${r}`, {}, async (page, ctx) => {
      let release; const held = new Promise((r2) => (release = r2));
      await ctx.route((u) => u.pathname.includes('ScreenshotShowcase') || (u.pathname.endsWith('.js') && u.pathname.includes('_astro')), async (route) => { await held; await route.continue(); });
      await page.goto(base + r, { waitUntil: 'domcontentloaded' });
      await sleep(300);
      await page.evaluate(() => { const t = document.querySelector('.gallery .track'); t.scrollIntoView({ block: 'center' }); t.scrollTo({ left: t.clientWidth * 2, behavior: 'instant' }); });
      await sleep(2500); release(); await sleep(1500);
      const s = await galleryState(page);
      return s.counter === String(s.idx + 1) ? [] : [`script arriving after a swipe to 3 shows counter ${s.counter} on picture ${s.idx + 1}`];
    });
    await scenario(`pictures held 4 s while the gallery is driven ${r}`, {}, async (page, ctx) => {
      let release; const held = new Promise((r2) => (release = r2));
      await ctx.route((u) => /\.(webp|avif|png|jpg)$/.test(u.pathname), async (route) => { await held; await route.continue(); });
      await page.goto(base + r, { waitUntil: 'domcontentloaded' });
      await sleep(400);
      await page.evaluate(() => { const d = document.querySelectorAll('.gallery .dot'); d[2]?.click(); });
      await sleep(200); await page.setViewportSize({ width: 600, height: 900 });
      await sleep(800); release();
      return [];
    });
  }
  await scenario('rail: stylesheet held 3 s, then released', {}, async (page, ctx) => {
    let release; const held = new Promise((r2) => (release = r2));
    await ctx.route((u) => u.pathname.endsWith('.css'), async (route) => { await held; await route.continue(); });
    const nav = page.goto(base + RAIL, { waitUntil: 'load' }).catch(() => {});
    await sleep(2500); release(); await nav; await sleep(800);
    return [];
  });
  await scenario('rail: arriving by a page change, then next pressed at once', {}, async (page) => {
    await page.goto(base + '/apps/', { waitUntil: 'load' });
    await Promise.all([page.waitForURL('**/waypost-words/'), page.click('a[href="/apps/waypost-words/"]')]);
    await page.evaluate(() => document.querySelector('[data-phones] .nav.next').click());
    return [];
  });
  await scenario('a page change interrupted by another link and back', {}, async (page) => {
    const p = [];
    await page.goto(base + '/', { waitUntil: 'load' });
    for (const delay of [0, 30, 120, 300]) {
      await page.evaluate(() => document.querySelector('header nav a[href="/apps/"]').click());
      await sleep(delay);
      await page.evaluate(() => document.querySelector('header nav a[href="/about/"]')?.click()).catch(() => {});
      await sleep(delay);
      await page.goBack({ waitUntil: 'commit' }).catch(() => {});
      p.push(...(await check(page, [], `interrupt ${delay}`, 'races')).map((x) => `${delay}ms: ${x}`));
    }
    return p;
  });
  await scenario('back and forward 30 times as fast as possible', {}, async (page) => {
    for (const r of ['/', '/apps/', '/apps/sole-focus/', '/privacy/', '/about/']) await page.goto(base + r, { waitUntil: 'load' });
    for (let i = 0; i < 30; i++) { await page.goBack({ waitUntil: 'commit' }).catch(() => {}); if (i % 3 === 0) await page.goForward({ waitUntil: 'commit' }).catch(() => {}); }
    await page.waitForLoadState('load').catch(() => {});
    return [];
  });
}

async function grotesque() {
  const LONG = 'a'.repeat(6000);
  const urls = [
    '/apps/sole-focus/?x=%3Cscript%3Ealert(1)%3C/script%3E', '/apps/%3Cimg%20src=x%20onerror=alert(1)%3E/', `/${LONG}/`, '/apps/__proto__/', '/apps/constructor/',
    '/apps/sole-focus/index.html', '/APPS/', '//apps//sole-focus//', '/apps/%E2%80%AEsole/', '/apps/%00/', '/apps/sole-focus/#..%2F..%2F', '/apps/sole-focus/#does-not-exist',
    '/privacy/global/', '/apps/wander-words/?a=1', '/privacy/wander-words/#x', '/apps/%F0%9F%92%A9/', '/apps/sole-focus/?' + 'q=1&'.repeat(1500), '/%', '/apps/..%2F..%2Fetc/passwd',
    '/apps/sole-focus?no-slash', '/apps/magic-notes/#main', '/support/?email=%0d%0aBcc:x@y',
  ];
  await scenario('grotesque addresses', {}, async (page) => {
    const p = [];
    let dialog = false; page.on('dialog', (d) => { dialog = true; d.dismiss(); });
    for (const u of urls) {
      const resp = await page.goto(base + u, { waitUntil: 'load' }).catch((e) => ({ err: e.message }));
      await sleep(250);
      if (resp?.err) { p.push(`${u.slice(0, 60)}: navigation failed ${resp.err.slice(0, 60)}`); continue; }
      const s = await page.evaluate(() => ({ nav: document.querySelectorAll('header nav a').length, h1: document.querySelector('h1')?.textContent.trim().slice(0, 60), body: document.body.innerText.length, scripts: [...document.scripts].filter((x) => /alert/.test(x.textContent)).length }));
      if (!s.nav) p.push(`${u.slice(0, 60)}: no header links`);
      if (!s.h1) p.push(`${u.slice(0, 60)}: no heading`);
      if (s.scripts) p.push(`${u.slice(0, 60)}: the address became a script`);
      p.push(...(await check(page, [], u.slice(0, 40), 'grotesque')).map((x) => `${u.slice(0, 40)}: ${x}`));
    }
    if (dialog) p.push('an address opened a dialog');
    return p;
  });
  for (const [w, h] of [[200, 400], [240, 320], [3840, 2160], [1440, 120], [7680, 600]]) {
    await scenario(`window ${w}x${h} on every route`, { width: w, height: h }, async (page) => {
      const p = [];
      for (const r of ROUTES.filter((x) => !x.includes('wander'))) {
        await page.goto(base + (r === '/404' ? '/nope/' : r), { waitUntil: 'load' });
        await page.evaluate(() => { const n = document.querySelector('.gallery .nav.next, [data-phones] .nav.next'); n?.click(); });
        p.push(...(await check(page, [], `${w}x${h} ${r}`, 'grotesque')).map((x) => `${r}: ${x}`));
      }
      return p;
    });
  }
  await scenario('text at 300% (root font size) on every route', {}, async (page) => {
    const p = [];
    for (const r of ROUTES.filter((x) => !x.includes('wander'))) {
      await page.goto(base + (r === '/404' ? '/nope/' : r), { waitUntil: 'load' });
      await page.evaluate(() => { document.documentElement.style.fontSize = '300%'; });
      await sleep(300);
      p.push(...(await check(page, [], `300% ${r}`, 'grotesque')).map((x) => `${r}: ${x}`));
    }
    return p;
  });
}

async function interrupt() {
  await scenario('offline, press a link, back online, go back', {}, async (page, ctx) => {
    await page.goto(base + '/apps/sole-focus/', { waitUntil: 'load' });
    await ctx.setOffline(true);
    await page.click('header nav a[href="/about/"]').catch(() => {});
    await sleep(800);
    await ctx.setOffline(false);
    await page.goBack({ waitUntil: 'load' }).catch(() => {});
    await sleep(600);
    return new URL(page.url()).pathname === '/apps/sole-focus/' ? [] : [`after offline+back the page is ${page.url()}`];
  });
  await scenario('offline flapping during a page change', {}, async (page, ctx) => {
    await page.goto(base + '/', { waitUntil: 'load' });
    const nav = page.click('header nav a[href="/apps/"]').catch(() => {});
    for (let i = 0; i < 10; i++) { await ctx.setOffline(i % 2 === 0); await sleep(20); }
    await ctx.setOffline(false); await nav; await page.waitForLoadState('load').catch(() => {});
    await page.reload({ waitUntil: 'load' }).catch(() => {});
    return [];
  });
  await scenario('every picture fails to load', {}, async (page, ctx) => {
    await ctx.route((u) => /\.(webp|avif|png|jpg)$/.test(u.pathname), (route) => route.abort());
    const p = [];
    for (const r of ['/', '/apps/sole-focus/', '/apps/waypost-words/', '/apps/']) {
      await page.goto(base + r, { waitUntil: 'load' });
      await page.evaluate(() => document.querySelector('.gallery .nav.next, [data-phones] .nav.next')?.click());
      const errs = (await check(page, [], `no pictures ${r}`, 'interrupt')).filter((x) => !/^console Failed to load resource/.test(x));
      p.push(...errs.map((x) => `${r}: ${x}`));
    }
    return p;
  });
  await scenario('JavaScript off: no dead controls', { js: false }, async (page) => {
    const p = [];
    for (const r of [...GAL, RAIL]) {
      await page.goto(base + r, { waitUntil: 'load' });
      const vis = await page.evaluate(() => [...document.querySelectorAll('.nav.prev, .nav.next, .phone-count')].filter((e) => !e.hidden && getComputedStyle(e).display !== 'none').length);
      if (vis) p.push(`${r}: ${vis} gallery controls shown with JavaScript off`);
    }
    return p;
  });
  await scenario('gallery state survives a trip away and back (page cache)', {}, async (page) => {
    await page.goto(base + '/apps/sole-focus/', { waitUntil: 'load' }); await sleep(800);
    await page.evaluate(() => document.querySelectorAll('.gallery .dot')[3].click()); await settle(page);
    await page.click('header nav a[href="/about/"]'); await page.waitForLoadState('load');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goBack({ waitUntil: 'commit' }); await sleep(1200);
    return [];
  });
  await scenario('reduced motion: every gallery control still arrives', { reduced: true }, async (page) => {
    const p = [];
    for (const r of GAL) {
      await page.goto(base + r, { waitUntil: 'load' });
      await page.evaluate(() => document.querySelectorAll('.gallery .dot')[2].click()); await sleep(100);
      const s = await galleryState(page);
      if (s.idx !== 2) p.push(`${r}: with motion off, dot 3 shows ${s.idx + 1} after 100 ms`);
    }
    return p;
  });
  await scenario('touch phone: swipe the gallery and rail by finger-sized drags', { width: 390, height: 844, touch: true }, async (page) => {
    for (const r of [...GAL, RAIL]) {
      await page.goto(base + r, { waitUntil: 'load' }); await sleep(600);
      const [x, y] = await centre(page, '.track, .phone-track');
      for (let i = 0; i < 5; i++) { await page.mouse.move(x + 120, y); await page.mouse.down(); await page.mouse.move(x - 120, y, { steps: 4 }); await page.mouse.up(); }
      await check(page, [], `touch ${r}`, 'interrupt');
    }
    return [];
  });
  await scenario('the tab hidden mid-glide, then shown', {}, async (page) => {
    await page.goto(base + '/apps/magic-notes/', { waitUntil: 'load' }); await sleep(800);
    const cdp = ENGINE === 'chromium' ? await page.context().newCDPSession(page) : null;
    await page.evaluate(() => document.querySelectorAll('.gallery .dot')[5].click());
    if (cdp) { await cdp.send('Emulation.setFocusEmulationEnabled', { enabled: false }); await cdp.send('Page.setWebLifecycleState', { state: 'frozen' }); await sleep(1500); await cdp.send('Page.setWebLifecycleState', { state: 'active' }); }
    await settle(page); const s = await galleryState(page);
    return s.idx === 5 ? [] : [`after a freeze mid-glide to 6 the gallery is on ${s.idx + 1}`];
  });
}

async function chain() {
  // No reset: storm a gallery page, then the impossible sequences on whatever it left, then resize and history.
  const rng = mulberry32(SEED);
  await scenario('chain: storm, then sequences, then rotate, then history', {}, async (page) => {
    const p = [];
    await page.goto(base + '/apps/sole-focus/', { waitUntil: 'load' });
    for (let i = 0; i < 300; i++) { const a = pick(rng, ['dot', 'arrow', 'wheelX', 'key', 'drag', 'resize', 'hover']); await withLimit(act(page, rng, a).catch(() => {}), 4000); }
    p.push(...(await check(page, [], 'chain after storm', 'chain')));
    const [x, y] = await centre(page, '.gallery .nav.next').catch(() => [0, 0]);
    for (let i = 0; i < 40; i++) await page.mouse.click(x, y);
    for (let i = 0; i < 12; i++) { await page.setViewportSize(i % 2 ? { width: 390, height: 844 } : { width: 1180, height: 820 }); await sleep(int(rng, 5, 60)); }
    p.push(...(await check(page, [], 'chain after taps and rotation', 'chain')));
    await page.click('header nav a[href="/apps/"]').catch(() => {}); await page.waitForLoadState('load').catch(() => {});
    await page.goBack({ waitUntil: 'commit' }).catch(() => {}); await sleep(900);
    p.push(...(await check(page, [], 'chain after away and back', 'chain')));
    for (let i = 0; i < 40; i++) await page.keyboard.press(i % 3 ? 'ArrowLeft' : 'ArrowRight');
    await page.reload({ waitUntil: 'load' });
    p.push(...(await check(page, [], 'chain after reload', 'chain')));
    return p;
  });
}

async function control() {
  // 1. A seed must produce the same event list twice.
  const a = [], b = [];
  for (const out of [a, b]) { const rng = mulberry32(7); for (let i = 0; i < 200; i++) out.push(pick(rng, ACTIONS) + int(rng, 0, 999)); }
  say(`control seed replay: ${a.join() === b.join() ? 'same' : 'DIFFERENT'}`);
  // 2. The listeners must hear an error we cause on purpose.
  const { ctx, page, errors } = await fresh();
  await page.goto(base + '/', { waitUntil: 'load' });
  await page.evaluate(() => setTimeout(() => { throw new Error('chaos-control'); }));
  await sleep(300);
  say(`control error heard: ${errors.some((e) => e.includes('chaos-control')) ? 'yes' : 'NO'}`); errors.length = 0;
  // 3. The gallery invariant must catch a lie we tell it, and pass the truth.
  await page.goto(base + '/apps/sole-focus/', { waitUntil: 'load' }); await sleep(800);
  const clean = await check(page, errors, 'control clean', 'control');
  await page.evaluate(() => { document.querySelector('.counter-now').textContent = '9'; });
  const lie = await check(page, errors, 'control lie', 'control');
  breaks.length = 0;
  say(`control gallery truth: ${clean.length ? 'FLAGGED ' + clean.join('|') : 'clean'}; lie: ${lie.some((x) => x.includes('counter says 9')) ? 'caught' : 'MISSED'}`);
  // 4. The surface signal must follow a click, and the input must land where the driver says.
  await page.goto(base + '/', { waitUntil: 'load' });
  await page.click('header nav a[href="/support/"]'); await page.waitForLoadState('load');
  say(`control surface after click: ${await surfaceOf(page)}`);
  // 5. Issue 0013: does this browser survive a scroll down every page?
  const died = [];
  for (const r of ['/', '/apps/magic-notes/', '/apps/sole-focus/']) {
    await page.goto(base + r, { waitUntil: 'load' });
    for (let y = 0; y < 6000; y += 200) { await page.mouse.wheel(0, 200); await sleep(20); }
    if (!browser.isConnected()) { died.push(r); browser = await engine.launch(launchOpts); break; }
  }
  say(`control scroll survival: ${died.length ? 'browser quit on ' + died.join(',') : 'stayed up'}`);
  await ctx.close().catch(() => {});
}

const t0 = Date.now();
if (REPLAY) await replay();
else await ({ control, storm, sequences, races, grotesque, interrupt, chain })[BLOCK]();
results.seconds = Math.round((Date.now() - t0) / 1000);
results.hits = hits; results.checks = checks; results.breaks = breaks;
writeFileSync(join(LOGS, `${BLOCK}-${ENGINE}-seed${SEED}.result.json`), JSON.stringify(results, null, 1));
say(`done ${BLOCK} ${ENGINE} seed ${SEED} in ${results.seconds}s, ${breaks.length} invariant breaks, log ${logFile}`);
await browser.close().catch(() => {});
server.close();
process.exit(0);
