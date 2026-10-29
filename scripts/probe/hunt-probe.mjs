// Holds the built site to what it claims: every link lands, every fact matches its content file, and every control does its job in a real Chrome.
// Run: npm run build, then node scripts/probe/hunt-probe.mjs [static|drive|all] [--calibrate] [--engine chrome|webkit]   (webkit uses the global `playwright` install)
// Answers: is anything on the built site wrong right now — a dead link, a stale fact, a control that does nothing, a page that errors?
import puppeteer from 'puppeteer-core';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, extname, relative, sep } from 'node:path';
import { parse } from 'yaml';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

const mode = process.argv[2] ?? 'all';
const CALIBRATE = process.argv.includes('--calibrate');
const ENGINE = process.argv.includes('--engine') ? process.argv[process.argv.indexOf('--engine') + 1] : 'chrome';
const DIST = 'dist';
const SITE = 'https://metkapstudio.com';
const bad = [];
const note = (lane, msg) => bad.push(`${lane}: ${msg}`);

// ---------- the built pages ----------
function pages() {
  const out = new Map();
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.html')) {
        const rel = relative(DIST, p).split(sep).join('/');
        const route = rel === 'index.html' ? '/' : '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '');
        out.set(route, readFileSync(p, 'utf-8'));
      }
    }
  };
  walk(DIST);
  return out;
}
const built = pages();
const front = (file) => parse(readFileSync(file, 'utf-8').split(/^---$/m)[1]);
const products = readdirSync('src/content/products').map((f) => front(join('src/content/products', f)));
const policies = readdirSync('src/content/policies').map((f) => front(join('src/content/policies', f)));
const fmt = (d) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(d));
const resolves = (url) => {
  const path = decodeURI(url.split('#')[0].split('?')[0]);
  if (path === '') return true;
  const c = path.endsWith('/') ? [join(DIST, path, 'index.html')] : [join(DIST, path), join(DIST, path, 'index.html')];
  return c.some((p) => existsSync(p) && statSync(p).isFile());
};
const text = (html) => html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;| |⁠/g, ' ').replace(/\s+/g, ' ');

function staticLane() {
  // Control: a known-dead link and a known-wrong date must be caught by these very checks.
  if (CALIBRATE) {
    if (resolves('/apps/no-such-product/')) note('calibrate', 'resolver passed a dead link');
    if (!resolves('/apps/sole-focus/')) note('calibrate', 'resolver failed a live link');
    if (fmt('2026-07-15') !== '15 July 2026') note('calibrate', `date format reads ${fmt('2026-07-15')}`);
  }
  for (const [route, html] of built) {
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dup.length) note('static', `${route} repeats id ${[...new Set(dup)].join(', ')}`);
    for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      const u = m[1].replace(/&amp;/g, '&');
      if (/^(https?:|mailto:|data:|tel:)/.test(u)) continue;
      if (u.startsWith('#')) { if (u.length > 1 && !ids.includes(u.slice(1))) note('static', `${route} links to missing #${u.slice(1)}`); continue; }
      if (!resolves(u.startsWith('/') ? u : new URL(u, SITE + route).pathname)) note('static', `${route} links to missing ${u}`);
    }
    for (const m of html.matchAll(/srcset="([^"]+)"/g)) for (const part of m[1].split(',')) {
      const u = part.trim().split(/\s+/)[0];
      if (u && !/^https?:/.test(u) && !resolves(u)) note('static', `${route} srcset names missing ${u}`);
    }
    for (const m of html.matchAll(/aria-(?:labelledby|describedby|controls)="([^"]+)"/g)) for (const id of m[1].split(/\s+/))
      if (!ids.includes(id)) note('static', `${route} aria points at missing #${id}`);
    for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt(?=[\s=>])/.test(m[0])) note('static', `${route} has an img with no alt`);
    for (const m of html.matchAll(/href="mailto:([^"?]+)/g)) if (m[1] !== 'support@metkapstudio.com') note('static', `${route} mails ${m[1]}`);
  }
  // Every product page states its own facts.
  for (const p of products) {
    const html = built.get(`/apps/${p.slug}/`);
    if (!html) { note('static', `no page for ${p.slug}`); continue; }
    const t = text(html);
    if (p.releaseDate && !t.includes(`Released ${fmt(p.releaseDate)}`)) note('static', `${p.slug} page does not say Released ${fmt(p.releaseDate)}`);
    if (p.lastUpdated && !t.includes(`Last updated ${fmt(p.lastUpdated)}`)) note('static', `${p.slug} page does not say Last updated ${fmt(p.lastUpdated)}`);
    for (const s of p.storeLinks ?? []) if (s.status === 'available' && !html.includes(`href="${s.url.replace(/&/g, '&amp;')}"`) && !html.includes(`href="${s.url}"`)) note('static', `${p.slug} page never links its store ${s.url}`);
    if (p.requirements && !t.includes(p.requirements)) note('static', `${p.slug} page omits "${p.requirements}"`);
    const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => [JSON.parse(m[1])].flat());
    const app = ld.find((o) => o['@type'] === 'SoftwareApplication' || o['@type'] === 'VideoGame');
    if (!app) note('static', `${p.slug} has no app JSON-LD`);
    else {
      if (app.offers?.url !== p.storeLinks?.[0]?.url) note('static', `${p.slug} JSON-LD offer url ${app.offers?.url}`);
      if (app.offers?.price !== p.price) note('static', `${p.slug} JSON-LD price ${app.offers?.price} vs ${p.price}`);
    }
    // Every page that names the product links to it.
    for (const [route, h] of built) if (route !== `/apps/${p.slug}/` && !route.includes('wander') && text(h).includes(p.name) && !h.includes(`/apps/${p.slug}/`) && !route.startsWith('/privacy/'))
      note('static', `${route} names ${p.name} and never links its page`);
  }
  // Every policy page states its own date, and the privacy index lists every one with the same date.
  const index = text(built.get('/privacy/') ?? '');
  for (const pol of policies) {
    const route = pol.productId === 'global' ? '/privacy/' : `/privacy/${pol.productId}/`;
    const html = built.get(route);
    if (!html) { note('static', `no page for policy ${pol.productId} at ${route}`); continue; }
    if (!text(html).includes(`Updated ${fmt(pol.lastUpdated)}`)) note('static', `${route} does not say Updated ${fmt(pol.lastUpdated)}`);
    if (pol.productId !== 'global' && !index.includes(`updated ${fmt(pol.lastUpdated)}`)) note('static', `/privacy/ does not list ${pol.productId} as updated ${fmt(pol.lastUpdated)}`);
  }
  // The sitemap names every page that wants indexing and nothing else.
  const sitemap = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf-8');
  const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, ''));
  for (const r of listed) if (!built.has(r)) note('static', `sitemap lists ${r}, which is not built`);
  for (const [route, html] of built) if (!html.includes('name="robots" content="noindex"') && route !== '/404' && !listed.includes(route)) note('static', `${route} is indexable and missing from the sitemap`);
}

// ---------- the driven lane ----------
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json', '.avif': 'image/avif' };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function driveLane() {
  const server = createServer((req, res) => {
    const url = decodeURI((req.url ?? '/').split('?')[0]);
    const c = url.endsWith('/') ? [join(DIST, url, 'index.html')] : [join(DIST, url), join(DIST, url, 'index.html')];
    const f = c.find((p) => existsSync(p) && statSync(p).isFile());
    if (!f) { res.writeHead(404, { 'Content-Type': 'text/html' }); res.end(readFileSync(join(DIST, '404.html'))); return; }
    res.writeHead(200, { 'Content-Type': MIME[extname(f)] ?? 'application/octet-stream' });
    res.end(readFileSync(f));
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const chrome = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium'].find(existsSync);
  const routes = [...built.keys()].filter((r) => r !== '/404');
  let browser;
  // Playwright's WebKit stands in for Safari; the few calls that differ from puppeteer are shimmed here.
  const launch = async () => {
    if (ENGINE !== 'webkit') return puppeteer.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox'] });
    const req = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
    const b = await req('playwright').webkit.launch({ executablePath: execSync('ls -d ~/Library/Caches/ms-playwright/webkit-* | tail -1').toString().trim() + '/pw_run.sh' });
    Object.defineProperty(b, 'connected', { get: () => b.isConnected() });
    return b;
  };
  const fresh = async (opts = {}) => {
    const page = await browser.newPage();
    if (ENGINE === 'webkit') {
      page.setViewport = ({ width, height }) => page.setViewportSize({ width, height });
      page.emulateMediaFeatures = (f) => page.emulateMedia({ reducedMotion: f[0].value });
    }
    const errors = [];
    page.on('pageerror', (e) => errors.push(`pageerror ${e.message}`));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`console ${m.text()}`); });
    page.on('requestfailed', (r) => errors.push(`failed ${r.url()}`));
    page.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith(base)) errors.push(`${r.status()} ${r.url().replace(base, '')}`); });
    await page.setViewport({ width: opts.width ?? 1440, height: 900 });
    if (opts.reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    return { page, errors };
  };
  const step = async (name, fn) => {
    console.log(`… ${name}`);
    for (let t = 1; t <= 3; t++) {
      try { await fn(); return; } catch (e) {
        console.log(`  try ${t} failed: ${String(e.message).slice(0, 120)}`);
        if (!browser?.connected) browser = await launch();
      }
    }
    note('drive', `${name} could not be run`);
  };
  browser = await launch();
  console.log(`engine ${ENGINE} ${browser.version?.() ?? ''}`);
  try {
    // Control: a page we break on purpose must report its error through these listeners.
    if (CALIBRATE) await step('calibrate listeners', async () => {
      const { page, errors } = await fresh();
      await page.goto(base + '/no-such-page/', { waitUntil: 'load' });
      await page.evaluate(() => setTimeout(() => { throw new Error('calibration'); }));
      await wait(200);
      if (!errors.some((e) => e.startsWith('404'))) note('calibrate', 'a 404 went unheard');
      if (!errors.some((e) => e.includes('calibration'))) note('calibrate', 'a thrown error went unheard');
      await page.close();
    });
    // Every route, at a phone and a desktop width, with and without motion: no error, no sideways scroll, nothing left invisible.
    for (const width of [390, 1440]) for (const reduced of [false, true]) await step(`routes @${width}${reduced ? ' reduced' : ''}`, async () => {
      for (const route of routes) {
        const { page, errors } = await fresh({ width, reduced });
        await page.goto(base + route, { waitUntil: 'load' });
        if (route.includes('wander')) { await page.waitForNavigation({ timeout: 3000 }).catch(() => {}); }
        const h = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = 0; y <= h; y += 600) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await wait(60); }
        await wait(900);
        const r = await page.evaluate(() => {
          const over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
          const hidden = [...document.querySelectorAll('main *')].filter((el) => {
            const cs = getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && cs.visibility !== 'hidden' && Number(cs.opacity) < 0.05 && el.textContent.trim() && !el.closest('[aria-hidden="true"], .sr-only, .visually-hidden');
          }).map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`);
          return { over, hidden: hidden.slice(0, 5), url: location.pathname };
        });
        if (r.over > 0) note('drive', `${route} @${width} scrolls sideways by ${r.over}px`);
        if (r.hidden.length) note('drive', `${route} @${width}${reduced ? ' reduced' : ''} leaves text invisible: ${r.hidden.join(', ')}`);
        if (route.includes('wander') && r.url === route) note('drive', `${route} never forwarded`);
        for (const e of errors) note('drive', `${route} @${width}: ${e}`);
        await page.close();
      }
    });
    // The header: every nav link goes where it says and marks its own page current.
    await step('nav', async () => {
      const { page, errors } = await fresh();
      await page.goto(base + '/', { waitUntil: 'load' });
      const links = await page.$$eval('header nav a', (as) => as.map((a) => ({ href: a.getAttribute('href'), label: a.textContent.trim() })));
      if (!links.length) note('drive', 'header has no nav links');
      for (const l of links) {
        await page.goto(base + '/', { waitUntil: 'load' });
        await Promise.all([page.waitForNavigation({ waitUntil: 'load' }), page.click(`header nav a[href="${l.href}"]`)]);
        await wait(400);
        const cur = await page.$$eval('header nav a[aria-current="page"]', (as) => as.map((a) => a.getAttribute('href')));
        const path = new URL(page.url()).pathname;
        if (path !== l.href) note('drive', `nav "${l.label}" went to ${path}`);
        if (cur.length !== 1 || cur[0] !== l.href) note('drive', `on ${path} the current nav item is [${cur.join(', ')}]`);
      }
      // A page under a section marks its section.
      for (const [route, section] of [['/apps/sole-focus/', '/apps/'], ['/privacy/waypost-words/', '/privacy/']]) {
        await page.goto(base + route, { waitUntil: 'load' });
        const cur = await page.$$eval('header nav a[aria-current="page"], header nav a[aria-current="true"]', (as) => as.map((a) => a.getAttribute('href')));
        if (cur[0] !== section) note('drive', `on ${route} the current nav item is [${cur.join(', ')}], expected ${section}`);
      }
      for (const e of errors) note('drive', `nav: ${e}`);
      await page.close();
    });
    // The slide galleries: arrows, dots and keys each move one slide, and the counter and dots follow.
    for (const width of [390, 1440]) for (const slug of products.filter((p) => p.type === 'app').map((p) => p.slug)) await step(`gallery ${slug} @${width}`, async () => {
      const { page } = await fresh({ width });
      await page.goto(base + `/apps/${slug}/`, { waitUntil: 'load' });
      const g = await page.$('.gallery');
      if (!g) { note('drive', `${slug} has no gallery`); return; }
      await page.evaluate(() => document.querySelector('.gallery').scrollIntoView({ block: 'center' }));
      const read = () => page.evaluate(() => {
        const g = document.querySelector('.gallery');
        const track = g.querySelector('.track');
        const slides = [...track.querySelectorAll('.slide')];
        const tr = track.getBoundingClientRect();
        const seen = slides.findIndex((s) => { const r = s.getBoundingClientRect(); return Math.abs(r.left + r.width / 2 - (tr.left + tr.width / 2)) < r.width / 4; });
        return {
          n: slides.length, seen,
          counter: g.querySelector('.counter-now')?.textContent,
          dot: [...g.querySelectorAll('.dot')].findIndex((d) => d.getAttribute('aria-current') === 'true'),
          prev: g.querySelector('.nav.prev')?.disabled, next: g.querySelector('.nav.next')?.disabled,
          hiddenArrows: [...g.querySelectorAll('.nav')].some((b) => b.hidden || getComputedStyle(b).display === 'none'),
        };
      });
      let s = await read();
      const n = s.n;
      const expect = (i, how) => { if (s.seen !== i || s.counter !== String(i + 1) || s.dot !== i || s.prev !== (i === 0) || s.next !== (i === n - 1)) note('drive', `${slug} @${width} after ${how}: shows ${s.seen + 1}, counter ${s.counter}, dot ${s.dot + 1}, prev ${s.prev ? 'off' : 'on'}, next ${s.next ? 'off' : 'on'} — expected ${i + 1}`); };
      expect(0, 'load');
      if (s.hiddenArrows) note('drive', `${slug} @${width} keeps its arrows hidden`);
      for (let i = 1; i < n; i++) { await page.click('.gallery .nav.next'); await wait(900); s = await read(); expect(i, `next ×${i}`); }
      for (let i = n - 2; i >= 0; i--) { await page.click('.gallery .nav.prev'); await wait(900); s = await read(); expect(i, `prev back to ${i + 1}`); }
      const dots = await page.$$('.gallery .dot');
      for (const i of [n - 1, 1, 0]) { if (!dots[i]) { note('drive', `${slug} has no dot ${i + 1}`); continue; } await dots[i].click(); await wait(2000); s = await read(); expect(i, `dot ${i + 1}`); }
      await page.focus('.gallery .nav.next').catch(() => page.focus('.gallery .track'));
      await page.keyboard.press('ArrowRight'); await wait(700); s = await read(); expect(1, 'ArrowRight');
      await page.keyboard.press('ArrowLeft'); await wait(700); s = await read(); expect(0, 'ArrowLeft');
      // A resize mid-gallery keeps the slide being looked at.
      await dots[2]?.click(); await wait(2000);
      await page.setViewport({ width: width === 390 ? 1440 : 390, height: 900 }); await wait(900); s = await read(); expect(2, 'resize on slide 3');
      await page.close();
    });
    // The phone rail: Next pages through every shot, the count says which are in view, Prev comes back.
    for (const width of [390, 1440]) await step(`phone rail @${width}`, async () => {
      for (const route of ['/apps/waypost-words/', '/apps/', '/']) {
        const { page } = await fresh({ width });
        await page.goto(base + route, { waitUntil: 'load' });
        const rail = await page.$('[data-phones]');
        if (!rail) { if (route === '/apps/waypost-words/') note('drive', `${route} has no phone rail`); await page.close(); continue; }
        await page.evaluate(() => document.querySelector('[data-phones]').scrollIntoView({ block: 'center' })); await wait(300);
        const read = () => page.evaluate(() => {
          const root = document.querySelector('[data-phones]');
          const track = root.querySelector('.phone-track');
          const tr = track.getBoundingClientRect();
          const shots = [...track.querySelectorAll('.phone')];
          const inView = shots.map((s, i) => [s.getBoundingClientRect(), i]).filter(([r]) => r.left >= tr.left - 2 && r.right <= tr.right + 2).map(([, i]) => i + 1);
          return { n: shots.length, inView, from: root.querySelector('.phone-from')?.textContent, to: root.querySelector('.phone-to')?.textContent, prev: root.querySelector('.nav.prev')?.disabled, next: root.querySelector('.nav.next')?.disabled };
        });
        let s = await read();
        const seenAll = new Set(s.inView);
        const check = (how) => { if (s.inView.length && (String(s.inView[0]) !== s.from || String(s.inView.at(-1)) !== s.to)) note('drive', `${route} rail @${width} after ${how}: shows ${s.inView.join(',')} but says ${s.from}–${s.to}`); };
        check('load');
        let guard = 0;
        while (!s.next && guard++ < 20) { await page.click('[data-phones] .nav.next'); await wait(800); s = await read(); s.inView.forEach((i) => seenAll.add(i)); check(`next ×${guard}`); }
        if (seenAll.size !== s.n) note('drive', `${route} rail @${width}: Next reached only shots ${[...seenAll].sort((a, b) => a - b).join(',')} of ${s.n}`);
        guard = 0;
        while (!s.prev && guard++ < 20) { await page.click('[data-phones] .nav.prev'); await wait(800); s = await read(); check(`prev ×${guard}`); }
        if (s.inView[0] !== 1) note('drive', `${route} rail @${width}: Prev stopped at ${s.inView[0]}`);
        await page.close();
      }
    });
    // Skip link, and every external link opening away from the site.
    await step('skip link and external links', async () => {
      const { page } = await fresh();
      await page.goto(base + '/apps/sole-focus/', { waitUntil: 'load' });
      await page.keyboard.press('Tab');
      const first = await page.evaluate(() => document.activeElement?.className + '|' + document.activeElement?.textContent.trim());
      if (!first.startsWith('skip-link')) note('drive', `first Tab lands on ${first}`);
      await page.keyboard.press('Enter'); await wait(200);
      const after = await page.evaluate(() => ({ hash: location.hash, inMain: !!document.activeElement?.closest('main') || document.activeElement?.id === 'main' }));
      await page.keyboard.press('Tab');
      const next = await page.evaluate(() => !!document.activeElement?.closest('main'));
      if (!after.inMain && !next) note('drive', `skip link leaves the next Tab outside main`);
      for (const route of routes.filter((r) => !r.includes('wander'))) {
        await page.goto(base + route, { waitUntil: 'load' });
        const ext = await page.$$eval('a[href^="http"]', (as) => as.filter((a) => !a.href.startsWith(location.origin)).map((a) => ({ href: a.href, target: a.target, rel: a.rel })));
        for (const a of ext) if (a.target === '_blank' && !/noopener|noreferrer/.test(a.rel)) note('drive', `${route} opens ${a.href} without noopener`);
      }
      await page.close();
    });
    // Back and forward after a page change: the page you return to is all there.
    await step('history', async () => {
      const { page } = await fresh();
      await page.goto(base + '/', { waitUntil: 'load' });
      await Promise.all([page.waitForNavigation({ waitUntil: 'load' }), page.click('header nav a[href="/apps/"]')]);
      await wait(500);
      await Promise.all([page.waitForNavigation({ waitUntil: 'commit' }).catch(() => {}), page.goBack({ waitUntil: 'commit' }).catch(() => {})]);
      await wait(1200);
      const r = await page.evaluate(() => ({ path: location.pathname, cur: [...document.querySelectorAll('header nav a[aria-current="page"]')].map((a) => a.getAttribute('href')), faint: [...document.querySelectorAll('[data-land]')].filter((e) => Number(getComputedStyle(e).opacity) < 0.95).length }));
      if (r.path !== '/' || r.cur[0] !== '/' || r.faint) note('drive', `back to home: path ${r.path}, current [${r.cur}], ${r.faint} opening parts not shown`);
      await page.close();
    });
  } finally {
    await browser?.close().catch(() => {});
    server.close();
  }
}

if (mode === 'static' || mode === 'all') staticLane();
if (mode === 'drive' || mode === 'all') await driveLane();
console.log(bad.length ? bad.map((b) => `✗ ${b}`).join('\n') : '✓ nothing wrong');
console.log(`done ${bad.length}`);
process.exitCode = bad.length ? 1 : 0;
