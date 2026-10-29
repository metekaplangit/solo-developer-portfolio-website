// Times what a visitor's hands meet: page loads, page changes, the galleries, hovers, scrolling, back, idle and hidden cost.
// Run: node scripts/probe/smooth-probe.mjs <mode> [--base https://metkapstudio.com] [--engine chrome|webkit] [--weak] [--minutes 5]
//      modes: calibrate, inventory, load, drive, still, hidden, gc, hold   (uses the global `playwright` install)
// Answers: does the site feel instant on the build that ships, on this Mac and on a throttled phone-class device, and does it rest?
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const require = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
const { chromium, webkit } = require('playwright');

const argv = process.argv.slice(2);
const mode = argv[0];
const opt = (name, dflt) => {
  const i = argv.indexOf(`--${name}`);
  return i < 0 ? dflt : argv[i + 1];
};
const BASE = opt('base', 'https://metkapstudio.com').replace(/\/$/, '');
const ENGINE = opt('engine', 'chrome');
const WEAK = argv.includes('--weak');
const MINUTES = Number(opt('minutes', '5'));
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const WEBKIT = execSync('ls -d ~/Library/Caches/ms-playwright/webkit-* | tail -1').toString().trim() + '/pw_run.sh';

// The weak device, from step 2's research: Lighthouse's mobile profile (4x CPU, 150 ms RTT,
// 1.6 Mbps down, 750 kbps up). Override with --cpu / --rtt / --down / --up.
const THROTTLE = {
  cpu: Number(opt('cpu', '4')),
  rtt: Number(opt('rtt', '150')),
  down: Number(opt('down', '1.6')) * 1e6 / 8,
  up: Number(opt('up', '0.75')) * 1e6 / 8,
};

const ROUTES = ['/', '/apps/', '/apps/sole-focus/', '/apps/magic-notes/', '/apps/waypost-words/', '/about/', '/support/', '/privacy/', '/privacy/sole-focus/', '/privacy/magic-notes/', '/privacy/waypost-words/', '/no-such-page/'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const r1 = (n) => (n == null ? null : Math.round(n * 10) / 10);
const out = (o) => console.log(JSON.stringify(o));

// In every document: every frame's time, inputs, scroll ends, page reveal, and the browser's own
// event-timing, long-frame, LCP and layout-shift entries. All times absolute (timeOrigin + t).
function recorder() {
  const T0 = performance.timeOrigin;
  const P = (window.__P = { frames: [], events: [], loaf: [], lcp: 0, cls: 0, fcp: 0, reveal: null, vt: false, scrollend: [], shows: [] });
  const tick = (t) => {
    P.frames.push(T0 + t);
    if (P.frames.length < 200000) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  addEventListener('pagereveal', (e) => { P.reveal = T0 + performance.now(); P.vt = !!e.viewTransition; });
  addEventListener('pageshow', (e) => P.shows.push({ t: T0 + performance.now(), persisted: e.persisted }));
  addEventListener('pointerdown', (e) => { try { sessionStorage.setItem('__clickT', String(T0 + e.timeStamp)); } catch {} }, { capture: true, passive: true });
  addEventListener('scrollend', () => P.scrollend.push(T0 + performance.now()), { capture: true });
  const obs = (type, fn, extra = {}) => { try { new PerformanceObserver((l) => l.getEntries().forEach(fn)).observe({ type, buffered: true, ...extra }); } catch {} };
  obs('event', (e) => P.events.push({ name: e.name, start: T0 + e.startTime, dur: e.duration, delay: e.processingStart - e.startTime, proc: e.processingEnd - e.processingStart }), { durationThreshold: 16 });
  obs('long-animation-frame', (e) => P.loaf.push({ start: T0 + e.startTime, dur: e.duration, block: e.blockingDuration, render: e.renderStart ? e.renderStart - e.startTime : null, style: e.styleAndLayoutStart ? e.styleAndLayoutStart - e.startTime : null, scripts: (e.scripts || []).map((s) => `${s.invoker}:${Math.round(s.duration)}`) }));
  obs('largest-contentful-paint', (e) => (P.lcp = e.startTime));
  obs('layout-shift', (e) => { if (!e.hadRecentInput) P.cls += e.value; });
  obs('paint', (e) => { if (e.name === 'first-contentful-paint') P.fcp = e.startTime; });
}

// When the opening ([data-land]) and any view transition have fully finished, absolute.
const landedAt = () => {
  const T0 = performance.timeOrigin;
  let end = 0;
  for (const a of document.getAnimations()) {
    const tgt = a.effect?.target;
    const pseudo = a.effect?.pseudoElement || '';
    if (!(pseudo.includes('view-transition') || tgt?.closest?.('[data-land]'))) continue;
    if (a.startTime == null) continue;
    end = Math.max(end, a.startTime + a.effect.getComputedTiming().endTime);
  }
  return end ? T0 + end : null;
};

async function browserFor(engine = ENGINE) {
  if (engine === 'webkit') return webkit.launch({ executablePath: WEBKIT });
  for (let i = 0; i < 3; i++) {
    // Playwright switches the back-forward cache off by default; a visitor's Chrome has it on.
    // --no-bfcache keeps Playwright's default, as the control for that switch.
    const ignoreDefaultArgs = argv.includes('--no-bfcache') ? [] : ['--disable-back-forward-cache'];
    try { return await chromium.launch({ executablePath: CHROME, headless: true, ignoreDefaultArgs }); } catch (e) { if (i === 2) throw e; }
  }
}

async function throttle(page, on = WEAK) {
  if (!on || ENGINE !== 'chrome') return null;
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: THROTTLE.cpu });
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: THROTTLE.rtt, downloadThroughput: THROTTLE.down, uploadThroughput: THROTTLE.up });
  return cdp;
}

// Frames between two absolute times: count, worst interval, intervals over 2 budgets.
function frameStats(frames, from, to) {
  const f = frames.filter((t) => t >= from && t <= to);
  const gaps = f.slice(1).map((t, i) => t - f[i]);
  gaps.sort((a, b) => b - a);
  return { n: f.length, worst: r1(gaps[0] ?? 0), p95: r1(gaps[Math.floor(gaps.length * 0.05)] ?? 0), over33: gaps.filter((g) => g > 33.4).length };
}

async function newPage(browser, viewport = { width: 1440, height: 900 }, record = true) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  if (record) await ctx.addInitScript(recorder);
  const page = await ctx.newPage();
  return { ctx, page };
}

const nowIn = (page) => page.evaluate(() => performance.timeOrigin + performance.now());

// ---------------------------------------------------------------------------------------------
if (mode === 'navcontrol') {
  // Control for a page change: 2 bare same-origin pages, with and without a view transition,
  // and the site's own 2 pages served from dist/ on this machine. Click to the new page's first frame.
  const { createServer } = await import('node:http');
  const { readFile } = await import('node:fs/promises');
  const { extname } = await import('node:path');
  const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.json': 'application/json' };
  const bare = (vt, to) => `<!doctype html><html><head><meta charset="utf-8">${vt ? '<style>@view-transition{navigation:auto}</style>' : ''}</head><body><h1>Page</h1><a id="go" href="${to}">next</a></body></html>`;
  const server = createServer(async (req, res) => {
    const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.startsWith('/bare-')) { const vt = p.includes('vt'); res.writeHead(200, { 'content-type': 'text/html' }); return res.end(bare(vt, p.endsWith('a/') ? p.replace(/a\/$/, 'b/') : p.replace(/b\/$/, 'a/'))); }
    const f = join(process.cwd(), 'dist', p.endsWith('/') ? p + 'index.html' : p);
    try { const b = await readFile(f); res.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' }); res.end(b); } catch { res.writeHead(404); res.end(); }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await browserFor();
  const { page } = await newPage(browser);
  const cases = [['bare, no transition', '/bare-a/', '#go'], ['bare, view transition', '/bare-vt-a/', '#go'], ['site from disk', '/support/', 'header a[href="/about/"]'], ['site from disk, back', '/about/', 'header a[href="/support/"]']];
  for (const [label, start, sel] of cases) {
    const rows = [];
    for (let k = 0; k < 3; k++) {
      await page.goto(base + start, { waitUntil: 'load' });
      await sleep(800);
      const before = page.url();
      await page.locator(sel).first().click();
      await page.waitForURL((u) => u.href !== before);
      await page.waitForLoadState('load');
      await sleep(800);
      rows.push(await page.evaluate(() => { const c = Number(sessionStorage.getItem('__clickT')); const P = window.__P; const nav = performance.getEntriesByType('navigation')[0]; return { resp: Math.round(performance.timeOrigin + nav.responseStart - c), first: Math.round(P.frames[0] - c), reveal: P.reveal ? Math.round(P.reveal - c) : null, vt: P.vt }; }));
    }
    out({ control: label, engine: ENGINE, runs: rows });
  }
  await browser.close();
  server.close();
}

// ---------------------------------------------------------------------------------------------
if (mode === 'navdetail') {
  // One page change taken apart: where the time between the click and the first frame goes.
  const browser = await browserFor();
  const { page } = await newPage(browser);
  await throttle(page);
  for (let k = 0; k < 2; k++) {
    const from = opt('from', '/support/'), to = opt('to', '/about/');
    await page.goto(BASE + from, { waitUntil: 'load' });
    await sleep(1500);
    // --scroll: wheel the old page to its end and back first, as a visitor reading it would.
    if (argv.includes('--scroll')) {
      const h = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
      for (let y = 0; y < h; y += 120) { await page.mouse.wheel(0, 120); await sleep(16); }
      for (let y = 0; y < h; y += 400) { await page.mouse.wheel(0, -400); await sleep(16); }
      await sleep(800);
    }
    await page.locator(`header a[href="${to}"]`).first().click();
    await page.waitForURL((u) => u.pathname === to);
    await page.waitForLoadState('load');
    await sleep(1500);
    const d = await page.evaluate(() => {
      const c = Number(sessionStorage.getItem('__clickT'));
      const T0 = performance.timeOrigin;
      const at = (t) => Math.round(T0 + t - c);
      const n = performance.getEntriesByType('navigation')[0];
      const P = window.__P;
      return {
        nav: { start: at(0), fetch: at(n.fetchStart), resp: at(n.responseStart), respEnd: at(n.responseEnd), interactive: at(n.domInteractive), dcl: at(n.domContentLoadedEventEnd), load: at(n.loadEventEnd), type: n.type, size: n.transferSize },
        firstFrame: Math.round(P.frames[0] - c), reveal: P.reveal ? Math.round(P.reveal - c) : null, fcp: P.fcp ? at(P.fcp) : null,
        res: performance.getEntriesByType('resource').map((r) => ({ u: r.name.replace(/^https?:\/\/[^/]+/, '').slice(0, 40), s: at(r.startTime), e: at(r.responseEnd), blk: r.renderBlockingStatus, kb: Math.round(r.transferSize / 1024) })),
        loaf: P.loaf.map((l) => ({ s: Math.round(l.start - c), dur: Math.round(l.dur), render: Math.round(l.render), style: Math.round(l.style), scripts: l.scripts })),
      };
    });
    out({ base: BASE, engine: ENGINE, run: k + 1, ...d });
  }
  await browser.close();
}

// ---------------------------------------------------------------------------------------------
if (mode === 'hovertrace') {
  // What the long frame on a first hover is made of: a trace across the 1st and the 2nd hover.
  const browser = await browserFor('chrome');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + opt('route', '/'), { waitUntil: 'load' });
  await sleep(2500);
  const sel = opt('sel', '.band-shot, .band-phones');
  const el = page.locator(sel).first();
  await el.scrollIntoViewIfNeeded();
  await page.mouse.move(5, 5);
  await sleep(1500);
  const box = await el.boundingBox();
  await browser.startTracing(page, { categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'blink', 'cc', 'gpu'] });
  const marks = [];
  for (const k of [1, 2]) {
    marks.push(Date.now());
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 4 });
    await sleep(900);
    await page.mouse.move(5, 5);
    await sleep(900);
  }
  const ev = JSON.parse((await browser.stopTracing()).toString()).traceEvents;
  const big = ev.filter((e) => e.dur > 30000 && e.ph === 'X').map((e) => ({ name: e.name, ms: r1(e.dur / 1000), ts: e.ts }));
  const t0 = Math.min(...big.map((b) => b.ts));
  const tally = {};
  for (const e of ev) if (e.ph === 'X' && e.dur && /Decode|Paint|Raster|Layout|UpdateLayer|Image|Style|Commit|Composite/.test(e.name)) tally[e.name] = r1((tally[e.name] || 0) + e.dur / 1000);
  out({ mode: 'hovertrace', sel, over30ms: big.map((b) => ({ ...b, at: r1((b.ts - t0) / 1000) })).slice(0, 25), totalsMs: tally });
  await browser.close();
}

// ---------------------------------------------------------------------------------------------
if (mode === 'calibrate') {
  // Controls, each against an answer already known.
  const browser = await browserFor();
  const { page } = await newPage(browser);
  await page.goto('about:blank');
  await page.evaluate(recorder);
  await sleep(3000);
  // The first half-second after a page opens is the browser settling, not a steady frame clock.
  const f = await page.evaluate(() => window.__P.frames.filter((t) => t > window.__P.frames[0] + 500));
  const gaps = f.slice(1).map((t, i) => t - f[i]);
  const meanGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const timer = await page.evaluate(() => new Promise((r) => { const s = performance.now(); setTimeout(() => r(performance.now() - s), 500); }));
  const renderer = await page.evaluate(() => {
    const gl = document.createElement('canvas').getContext('webgl');
    if (!gl) return 'no webgl';
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  });
  const work = () => page.evaluate(() => { const s = performance.now(); let x = 0; for (let i = 0; i < 3e7; i++) x += Math.sqrt(i); return performance.now() - s + (x < 0 ? 1 : 0); });
  const w1 = await work();
  let w4 = null, net = null;
  if (ENGINE === 'chrome') {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: THROTTLE.cpu });
    w4 = await work();
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    // Network control: a known-size file, cold, with and without the throttle.
    const url = `${BASE}/og-image.png?cal=${Date.now()}`;
    const fetchT = () => page.evaluate(async (u) => { const s = performance.now(); const b = await (await fetch(u, { cache: 'no-store' })).arrayBuffer(); return [performance.now() - s, b.byteLength]; }, url);
    await page.goto(BASE + '/support/');
    const [plain, bytes] = await fetchT();
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: THROTTLE.rtt, downloadThroughput: THROTTLE.down, uploadThroughput: THROTTLE.up });
    const [slow] = await fetchT();
    net = { bytes, plainMs: r1(plain), throttledMs: r1(slow), expectedMs: r1(THROTTLE.rtt + (bytes / THROTTLE.down) * 1000) };
  }
  // Idle control: a blank page for 10 s should cost nothing.
  let idle = null;
  if (ENGINE === 'chrome') {
    const p2 = await (await browser.newContext()).newPage();
    await p2.goto('about:blank');
    const cdp = await p2.context().newCDPSession(p2);
    await cdp.send('Performance.enable');
    const m = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((x) => [x.name, x.value]));
    const a = await m(); await sleep(10000); const b = await m();
    idle = { taskMs: r1((b.TaskDuration - a.TaskDuration) * 1000), procMs: r1((b.ProcessTime - a.ProcessTime) * 1000), layouts: b.LayoutCount - a.LayoutCount, styles: b.RecalcStyleCount - a.RecalcStyleCount };
  }
  out({ engine: ENGINE, version: browser.version(), renderer, frames: { n: f.length, meanGap: r1(meanGap), worst: r1(Math.max(...gaps)) }, timer500: r1(timer), cpu: { x1: r1(w1), throttled: r1(w4), ratio: w4 ? r1(w4 / w1) : null, asked: THROTTLE.cpu }, net, idle });
  await browser.close();
}

// ---------------------------------------------------------------------------------------------
if (mode === 'inventory') {
  // What a visitor can touch, per route, read from the served page.
  const browser = await browserFor();
  const { page } = await newPage(browser, undefined, false);
  for (const route of ROUTES) {
    const res = await page.goto(BASE + route, { waitUntil: 'load' });
    const inv = await page.evaluate(() => {
      const q = (s) => document.querySelectorAll(s).length;
      const links = [...document.querySelectorAll('a[href]')];
      const internal = links.filter((a) => a.host === location.host && !a.hash).length;
      return {
        title: document.title, h: document.documentElement.scrollHeight,
        navLinks: q('header a[href]'), internal, external: links.filter((a) => a.host !== location.host && a.protocol.startsWith('http')).length,
        mailto: links.filter((a) => a.protocol === 'mailto:').length, buttons: q('button:not([hidden])'),
        galleries: q('.gallery'), phoneRails: q('[data-phones]'), slides: q('.gallery .slide'), phones: q('[data-phones] .phone'),
        bandShots: q('.band-shot, .band-phones'), tiles: q('.tile'), cards: q('.card'), avatars: q('.avatar-link'),
        reveals: q('.reveal'), land: q('[data-land]'), imgs: document.images.length, lazy: q('img[loading=lazy]'),
        vtNames: [...document.querySelectorAll('*')].filter((e) => getComputedStyle(e).viewTransitionName !== 'none').length,
        infinite: document.getAnimations().filter((a) => a.effect?.getComputedTiming().iterations === Infinity).length,
        refresh: !!document.querySelector('meta[http-equiv=refresh]'),
      };
    });
    out({ route, status: res.status(), ...inv });
  }
  await browser.close();
}

// ---------------------------------------------------------------------------------------------
if (mode === 'load') {
  // Cold (empty cache, fresh context) and warm (same context, again) per route, at 1440 and 390.
  const browser = await browserFor();
  // The weak device is a phone, so its pass is taken at phone width only.
  for (const viewport of WEAK ? [{ width: 390, height: 844 }] : [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    for (const route of ROUTES) {
      const { ctx, page } = await newPage(browser, viewport);
      await throttle(page);
      const row = { route, w: viewport.width, weak: WEAK };
      for (const run of ['cold', 'warm']) {
        await page.goto(BASE + route, { waitUntil: 'load', timeout: 120000 });
        await sleep(WEAK ? 2500 : 1200);
        const m = await page.evaluate((landedSrc) => {
          const landed = new Function(`return (${landedSrc})()`)();
          const nav = performance.getEntriesByType('navigation')[0];
          const res = performance.getEntriesByType('resource');
          const P = window.__P;
          return {
            ttfb: nav.responseStart, dcl: nav.domContentLoadedEventEnd, load: nav.loadEventEnd, fcp: P.fcp, lcp: P.lcp, cls: P.cls,
            landed: landed ? landed - performance.timeOrigin : null,
            kb: (nav.transferSize + res.reduce((a, r) => a + r.transferSize, 0)) / 1024, reqs: res.length + 1,
            loaf: P.loaf.filter((l) => l.dur > 50).map((l) => Math.round(l.dur)),
          };
        }, landedAt.toString());
        const usable = Math.max(m.lcp || 0, m.landed || 0);
        row[run] = { ttfb: r1(m.ttfb), fcp: r1(m.fcp), lcp: r1(m.lcp), landed: r1(m.landed), usable: r1(usable), load: r1(m.load), cls: Math.round(m.cls * 1000) / 1000, kb: r1(m.kb), reqs: m.reqs, longFrames: m.loaf };
      }
      out(row);
      await ctx.close();
    }
  }
  await browser.close();
}

// ---------------------------------------------------------------------------------------------
if (mode === 'drive') {
  // The flow a visitor takes, every interaction timed. Prints one line per interaction.
  const width = Number(opt('width', '1440'));
  const browser = await browserFor();
  const { page } = await newPage(browser, { width, height: width < 800 ? 844 : 900 });
  page.setDefaultTimeout(15000);
  await throttle(page);
  const P = () => page.evaluate(() => window.__P);

  // A page change by clicking a link: click to the new page's first frame, and to its opening landed.
  async function navClick(label, selector) {
    try { await navClickRaw(label, selector); } catch (e) { out({ i: label, kind: 'page change', error: e.message.split('\n')[0] }); }
  }
  async function navClickRaw(label, selector) {
    const el = page.locator(selector).first();
    await el.scrollIntoViewIfNeeded();
    await sleep(300);
    const before = page.url();
    await el.click();
    await page.waitForURL((u) => u.href !== before, { timeout: 60000 });
    await page.waitForLoadState('load');
    await sleep(WEAK ? 2000 : 1000);
    const r = await page.evaluate((landedSrc) => {
      const landed = new Function(`return (${landedSrc})()`)();
      const P = window.__P;
      const click = Number(sessionStorage.getItem('__clickT'));
      const nav = performance.getEntriesByType('navigation')[0];
      return { click, first: P.frames[0], reveal: P.reveal, vt: P.vt, landed, lcp: P.lcp ? performance.timeOrigin + P.lcp : null, ttfb: performance.timeOrigin + nav.responseStart, frames: P.frames.slice(0, 400), loaf: P.loaf };
    }, landedAt.toString());
    const end = Math.max(r.landed || 0, r.lcp || 0);
    const fs = frameStats(r.frames, r.first, end);
    out({ i: label, kind: 'page change', to: new URL(page.url()).pathname, vt: r.vt, toResponse: r1(r.ttfb - r.click), toFirstFrame: r1(r.first - r.click), toDone: r1(end - r.click), frames: fs, longFrames: r.loaf.filter((l) => l.dur > 50).map((l) => Math.round(l.dur)) });
  }

  // A same-page input: event-timing duration (input to next paint), time to its scroll end, frames.
  async function inPage(label, act, waitScroll = false) {
    const t0 = await nowIn(page);
    try { await act(); } catch (e) { return out({ i: label, kind: 'in page', error: e.message.split('\n')[0] }); }
    await sleep(waitScroll ? (WEAK ? 2500 : 1200) : 700);
    const p = await P();
    const ev = p.events.filter((e) => e.start >= t0 - 5);
    const se = p.scrollend.find((t) => t >= t0);
    const end = se ?? t0 + 700;
    out({ i: label, kind: 'in page', feedback: ev.length ? r1(Math.max(...ev.map((e) => e.dur))) : '<16', events: ev.map((e) => `${e.name}:${Math.round(e.dur)}`).slice(0, 6), toDone: se ? r1(se - t0) : null, frames: frameStats(p.frames, t0, end + 50), longFrames: p.loaf.filter((l) => l.start >= t0 && l.dur > 50).map((l) => Math.round(l.dur)) });
  }

  // A hover: frames across the transition that follows.
  async function hover(label, selector) {
    const el = page.locator(selector).first();
    if (!(await el.count())) return out({ i: label, kind: 'hover', missing: selector });
    await el.scrollIntoViewIfNeeded();
    await page.mouse.move(5, 5);
    await sleep(500);
    const box = await el.boundingBox();
    if (!box) return out({ i: label, kind: 'hover', hidden: selector });
    const t0 = await nowIn(page);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 4 });
    await sleep(700);
    const p = await P();
    const moving = await el.evaluate((e) => getComputedStyle(e).transform);
    out({ i: label, kind: 'hover', transform: moving, frames: frameStats(p.frames, t0, t0 + 600), longFrames: p.loaf.filter((l) => l.start >= t0 && l.dur > 50).map((l) => Math.round(l.dur)) });
  }

  // A whole-page wheel scroll to the end and back: frames, long frames, and whether the browser lived.
  async function wheel(label) {
    const t0 = await nowIn(page);
    const h = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    try {
      for (let y = 0; y < h; y += 120) { await page.mouse.wheel(0, 120); await sleep(16); }
      await sleep(800);
      for (let y = 0; y < h; y += 400) { await page.mouse.wheel(0, -400); await sleep(16); }
      await sleep(800);
    } catch (e) {
      return out({ i: label, kind: 'scroll', died: e.message.split('\n')[0] });
    }
    const t1 = await nowIn(page);
    const p = await P();
    out({ i: label, kind: 'scroll', px: h, ms: r1(t1 - t0), frames: frameStats(p.frames, t0, t1), longFrames: p.loaf.filter((l) => l.start >= t0 && l.dur > 50).map((l) => `${Math.round(l.dur)}${l.scripts.length ? ' ' + l.scripts.join(',') : ''}`) });
  }

  async function gallery(prefix) {
    const g = '.gallery';
    const rail = '[data-phones]';
    if (await page.locator(`${g} .nav.next`).count()) {
      await page.locator(g).first().scrollIntoViewIfNeeded();
      await sleep(400);
      await inPage(`${prefix} gallery next (1st)`, () => page.locator(`${g} .nav.next`).first().click(), true);
      await inPage(`${prefix} gallery next (2nd)`, () => page.locator(`${g} .nav.next`).first().click(), true);
      await inPage(`${prefix} gallery prev`, () => page.locator(`${g} .nav.prev`).first().click(), true);
      await inPage(`${prefix} gallery dot`, () => page.locator(`${g} .dot`).last().click(), true);
      await inPage(`${prefix} gallery key left`, async () => { await page.locator(`${g} .nav.prev`).first().focus(); await page.keyboard.press('ArrowLeft'); }, true);
      await inPage(`${prefix} gallery swipe`, async () => { const b = await page.locator(`${g} .track`).first().boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.wheel(-600, 0); }, true);
      const pos = await page.evaluate(() => { const t = document.querySelector('.gallery .track'); return { left: t.scrollLeft, counter: document.querySelector('.gallery .counter-now')?.textContent }; });
      out({ i: `${prefix} gallery end position`, kind: 'state', ...pos });
    }
    if (await page.locator(`${rail} .nav.next`).count()) {
      await page.locator(rail).first().scrollIntoViewIfNeeded();
      await sleep(400);
      await inPage(`${prefix} phone rail next (1st)`, () => page.locator(`${rail} .nav.next`).first().click(), true);
      await inPage(`${prefix} phone rail next (2nd)`, () => page.locator(`${rail} .nav.next`).first().click(), true);
      await inPage(`${prefix} phone rail prev`, () => page.locator(`${rail} .nav.prev`).first().click(), true);
      await inPage(`${prefix} phone rail key right`, async () => { await page.locator(`${rail} .nav.next`).first().focus(); await page.keyboard.press('ArrowRight'); }, true);
      await inPage(`${prefix} phone rail swipe`, async () => { const b = await page.locator(`${rail} .phone-track`).first().boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.wheel(500, 0); }, true);
    }
  }

  // Back: the page as left (bfcache) or a reload, and how long to its first frame.
  async function back(label) {
    const t0 = Date.now();
    const before = await P().catch(() => null);
    // A page restored from the back-forward cache fires pageshow, not load: wait for the commit only.
    await page.goBack({ waitUntil: 'commit' });
    await sleep(WEAK ? 1500 : 800);
    const p = await P();
    const restored = p.shows.length > 1 && p.shows[p.shows.length - 1].persisted;
    const first = restored ? p.shows[p.shows.length - 1].t : p.frames[0];
    const why = restored ? null : await page.evaluate(() => JSON.stringify(performance.getEntriesByType('navigation')[0]?.notRestoredReasons?.reasons ?? null));
    out({ i: label, kind: 'back', to: new URL(page.url()).pathname, bfcache: restored, toFirstFrame: r1(first - t0), notRestored: why, note: before ? undefined : 'no recorder before' });
  }

  // Cold landing on home, then the flow. --part2 resumes at the first "back", for a re-run of only that half.
  const PART2 = argv.includes('--part2');
  await page.goto(BASE + '/', { waitUntil: 'load', timeout: 120000 });
  await sleep(WEAK ? 2500 : 1200);
  if (PART2) await navClick('resume: home → product', 'main a[href^="/apps/"][href$="/"]:not([href="/apps/"])');
  if (!PART2) {
  await hover('home hero button hover', 'main .btn >> nth=0');
  await hover('home band screenshot hover', '.band-shot, .band-phones');
  await hover('home tile hover', '.tile');
  await wheel('home scroll');
  await navClick('home → apps (header, 1st page change)', 'header a[href="/apps/"]');
  await hover('apps card hover', '.card, .tile, .avatar-link');
  await wheel('apps scroll');
  await navClick('apps → home (header, 2nd page change)', 'header a[href="/"]');
  await navClick('home → product (band, icon travels)', 'main a[href^="/apps/"][href$="/"]:not([href="/apps/"])');
  await gallery(new URL(page.url()).pathname);
  await wheel(`${new URL(page.url()).pathname} scroll`);
  }
  await back('product → back');
  await navClick('home → apps', 'header a[href="/apps/"]');
  for (const slug of ['sole-focus', 'magic-notes', 'waypost-words']) {
    if (new URL(page.url()).pathname !== '/apps/') await navClick('→ apps', 'header a[href="/apps/"]');
    await navClick(`apps → ${slug}`, `main a[href="/apps/${slug}/"]`);
    await gallery(`/apps/${slug}/`);
    await wheel(`/apps/${slug}/ scroll`);
  }
  await navClick('→ about (header)', 'header a[href="/about/"]');
  await wheel('/about/ scroll');
  await navClick('→ support (header)', 'header a[href="/support/"]');
  await wheel('/support/ scroll');
  await navClick('→ privacy (footer)', 'footer a[href="/privacy/"]');
  await wheel('/privacy/ scroll');
  await navClick('privacy → a policy', 'main a[href^="/privacy/"]:not([href="/privacy/"])');
  await wheel(`${new URL(page.url()).pathname} scroll`);
  await back('policy → back');
  await page.goto(BASE + '/no-such-page/', { waitUntil: 'load' });
  await sleep(1000);
  await navClick('404 → home', 'main a[href="/"]');
  // Resize: the frames while the window narrows to phone width.
  const t0 = await nowIn(page);
  for (const w of [1280, 1024, 768, 600, 390]) { await page.setViewportSize({ width: w, height: 844 }); await sleep(120); }
  await sleep(400);
  const p = await P();
  out({ i: 'resize 1440 → 390', kind: 'resize', frames: frameStats(p.frames, t0, t0 + 1000), longFrames: p.loaf.filter((l) => l.start >= t0 && l.dur > 50).map((l) => Math.round(l.dur)) });
  const mem = await page.evaluate(() => performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1024) : null);
  out({ i: 'heap at end (KB)', kind: 'state', mem });
  await browser.close();
}

// ---------------------------------------------------------------------------------------------
if (mode === 'still' || mode === 'hidden') {
  // Still: 10 s untouched per route. Hidden: 60 s behind another tab, then the return.
  const browser = await browserFor('chrome');
  const routes = mode === 'still' ? ROUTES : ['/', '/apps/sole-focus/'];
  for (const route of routes) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    let reqs = 0;
    await page.goto(BASE + route, { waitUntil: 'load' });
    await sleep(3000);
    page.on('request', () => reqs++);
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Performance.enable');
    const m = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((x) => [x.name, x.value]));
    const anims = await page.evaluate(() => document.getAnimations().map((a) => ({ inf: a.effect?.getComputedTiming().iterations === Infinity, state: a.playState, scroll: a.timeline && !(a.timeline instanceof DocumentTimeline) })));
    let other = null;
    if (mode === 'hidden') { other = await ctx.newPage(); await other.goto('about:blank'); await other.bringToFront(); await sleep(500); }
    const vis = await page.evaluate(() => document.visibilityState);
    const a = await m();
    await sleep(mode === 'still' ? 10000 : 60000);
    const b = await m();
    const row = { mode, route, visibility: vis, secs: mode === 'still' ? 10 : 60, taskMs: r1((b.TaskDuration - a.TaskDuration) * 1000), procMs: r1((b.ProcessTime - a.ProcessTime) * 1000), layouts: b.LayoutCount - a.LayoutCount, styles: b.RecalcStyleCount - a.RecalcStyleCount, requests: reqs, infiniteAnims: anims.filter((x) => x.inf).length, runningClockAnims: anims.filter((x) => x.state === 'running' && !x.scroll).length };
    if (mode === 'hidden') {
      const t0 = Date.now();
      await page.bringToFront();
      const first = await page.evaluate(() => new Promise((r) => requestAnimationFrame((t) => r(performance.timeOrigin + t))));
      row.returnToFrameMs = r1(first - t0);
      row.visibilityAfter = await page.evaluate(() => document.visibilityState);
    }
    out(row);
    await ctx.close();
  }
  await browser.close();
}

// ---------------------------------------------------------------------------------------------
if (mode === 'gc') {
  // Garbage collection against long frames over a minute of gallery use (no frame recorder: one recorder at a time).
  const browser = await browserFor('chrome');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + opt('route', '/apps/sole-focus/'), { waitUntil: 'load' });
  await page.locator('.gallery').first().scrollIntoViewIfNeeded();
  await sleep(800);
  const heap0 = await page.evaluate(() => performance.memory.usedJSHeapSize);
  await browser.startTracing(page, { categories: ['v8', 'devtools.timeline', 'disabled-by-default-devtools.timeline.frame'] });
  const end = Date.now() + 60000;
  let clicks = 0;
  while (Date.now() < end) {
    const next = page.locator('.gallery .nav.next').first();
    if (await next.isDisabled()) await page.locator('.gallery .dot').first().click(); else await next.click();
    clicks++;
    await sleep(600);
  }
  const buf = await browser.stopTracing();
  const heap1 = await page.evaluate(() => performance.memory.usedJSHeapSize);
  const ev = JSON.parse(buf.toString()).traceEvents;
  const gcs = ev.filter((e) => /^(MinorGC|MajorGC|V8\.GC_SCAVENGER|V8\.GCScavenger|V8\.GCFinalizeMC)$/.test(e.name) && e.dur);
  const tasks = ev.filter((e) => e.name === 'RunTask' && e.dur > 50000);
  const dropped = ev.filter((e) => e.name === 'DroppedFrame' || (e.name === 'PipelineReporter' && e.args?.data?.state === 'STATE_DROPPED')).length;
  out({ mode: 'gc', clicks, gcCount: gcs.length, gcWorstMs: r1(Math.max(0, ...gcs.map((g) => g.dur / 1000))), gcTotalMs: r1(gcs.reduce((a, g) => a + g.dur / 1000, 0)), longTasks: tasks.map((t) => r1(t.dur / 1000)), droppedFrames: dropped, heapKB: [Math.round(heap0 / 1024), Math.round(heap1 / 1024)] });
  await browser.close();
}

// ---------------------------------------------------------------------------------------------
if (mode === 'hold') {
  // Minutes of gallery paging and page scrolling on a product page; worst frames per minute and CPU time.
  const browser = await browserFor();
  const { page } = await newPage(browser);
  const route = opt('route', '/apps/sole-focus/');
  await page.goto(BASE + route, { waitUntil: 'load' });
  await sleep(1500);
  const cpu = () => {
    const rows = execSync('ps -axo pid=,time=,rss=,command=').toString().split('\n');
    const mine = rows.filter((r) => ENGINE === 'webkit' ? /ms-playwright\/webkit/.test(r) : /Google Chrome/.test(r) && /--headless|Helper/.test(r));
    let secs = 0, rss = 0;
    for (const r of mine) {
      const [, , time, kb] = r.trim().match(/^(\d+)\s+(\S+)\s+(\d+)/) || [];
      if (!time) continue;
      const parts = time.split(':').map(Number);
      secs += parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
      rss += Number(kb);
    }
    return { secs, rssMB: Math.round(rss / 1024) };
  };
  const startCpu = cpu();
  const t0 = await nowIn(page);
  let minute = 0, lastCpu = startCpu;
  const until = Date.now() + MINUTES * 60000;
  let markEnd = Date.now() + 60000;
  while (Date.now() < until) {
    const next = page.locator('.gallery .nav.next, [data-phones] .nav.next').first();
    await next.scrollIntoViewIfNeeded();
    if (await next.isDisabled()) await page.locator('.gallery .dot, [data-phones] .nav.prev').first().click(); else await next.click();
    await sleep(700);
    await page.mouse.wheel(0, 300); await sleep(300); await page.mouse.wheel(0, -300); await sleep(300);
    if (Date.now() >= markEnd) {
      minute++;
      const now = await nowIn(page);
      const frames = await page.evaluate(() => window.__P.frames);
      const c = cpu();
      out({ mode: 'hold', engine: ENGINE, route, minute, frames: frameStats(frames, now - 60000, now), cpuSecsThisMinute: c.secs - lastCpu.secs, rssMB: c.rssMB });
      lastCpu = c;
      markEnd += 60000;
    }
  }
  await browser.close();
}
