// Walks a visitor's path through the redrawn gallery arrows and dots (plan 0004).
// Run: npm run build, then node control/cards/check-plan-0004-landed-and-fix-what-did-not/walk.mjs
// Settles: do the arrows and the pill work together — move, hide at the ends, hue on hover, sizes, reduced motion — at 1440 and 390?
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import puppeteer from 'puppeteer-core';

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json', '.xml': 'application/xml' };
const server = createServer((req, res) => {
  let p = join('dist', decodeURIComponent(req.url.split('?')[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': MIME[extname(p)] ?? 'application/octet-stream' });
  res.end(readFileSync(p));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const bad = [];
const ok = [];
const note = (cond, msg) => (cond ? ok : bad).push(msg);

// One fresh browser per job, 3 tries: about 1 launch in 3 detaches on this machine.
async function job(name, width, media, fn) {
  for (let attempt = 1; ; attempt++) {
    const found = [];
    let browser = null;
    try {
      browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox', '--force-device-scale-factor=1'] });
      const page = await browser.newPage();
      // Touch is a device, not a media feature: hasTouch makes Chrome report
      // pointer: coarse and hover: none.
      await page.setViewport({ width, height: 900, hasTouch: media === 'touch', isMobile: media === 'touch' });
      if (Array.isArray(media)) await page.emulateMediaFeatures(media);
      await page.goto(base + name, { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-visible')));
      await fn(page, (c, m) => found.push([c, `@${width} ${name} ${m}`]));
      for (const [c, m] of found) note(c, m);
      return;
    } catch (e) {
      if (attempt >= 3) { note(false, `@${width} ${name}: ${e.message}`); return; }
      console.log(`retry @${width} ${name}: ${e.message}`);
    } finally {
      if (browser) await browser.close().catch(() => {});
    }
  }
}

const navState = (page, root) => page.$$eval(`${root} .nav`, (ns) => ns.map((n) => {
  const cs = getComputedStyle(n);
  const svg = n.querySelector('svg');
  return { cls: n.className, hidden: n.hidden, disabled: n.disabled, w: Math.round(n.getBoundingClientRect().width), bg: cs.backgroundColor, shadow: cs.boxShadow, view: svg.getAttribute('viewBox'), sw: svg.getAttribute('width') };
}));
const dotState = (page) => page.$$eval('.gallery .dot', (ds) => ds.map((d) => {
  const a = getComputedStyle(d, '::after');
  return { cur: d.getAttribute('aria-current') === 'true', w: parseFloat(a.width), h: parseFloat(a.height), bg: a.backgroundColor, tr: a.transform, dur: a.transitionDuration, hit: Math.round(d.getBoundingClientRect().width) };
}));
const current = (page) => page.$$eval('.gallery .dot', (ds) => ds.findIndex((d) => d.getAttribute('aria-current') === 'true'));
const waitCurrent = (page, i) => page.waitForFunction((i) => document.querySelectorAll('.gallery .dot')[i]?.getAttribute('aria-current') === 'true', { timeout: 3000 }, i);
const overflow = (page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

const RETIRED = /rgba?\(22, 23, 27/;

for (const width of [1440, 390]) {
  // Mac gallery: next, next, the last dot, back to the first.
  for (const route of ['/apps/sole-focus/', '/apps/magic-notes/']) {
    await job(route, width, null, async (page, see) => {
      let navs = await navState(page, '.gallery');
      const prev = navs.find((n) => n.cls.includes('prev'));
      const next = navs.find((n) => n.cls.includes('next'));
      see(navs.every((n) => n.view === '0 0 20 20' && n.sw === '20'), `arrows drawn on the 20-unit chevron (${navs.map((n) => n.view).join(', ')})`);
      see(navs.every((n) => n.w === 48), `arrows 48px (${navs.map((n) => n.w).join(', ')})`);
      see(navs.every((n) => n.shadow === 'none' && !RETIRED.test(n.bg)), `arrows: glass ${next.bg}, shadow ${next.shadow}`);
      see(prev.disabled && !next.disabled && !next.hidden, `at the start prev is off and next is on`);

      let dots = await dotState(page);
      const n = dots.length;
      see(n > 1 && dots[0].cur, `${n} dots, the first current`);
      see(dots[0].w === 22 && dots[0].h === 7 && dots[0].tr === 'none', `current mark ${dots[0].w}x${dots[0].h}, transform ${dots[0].tr}`);
      see(dots.slice(1).every((d) => d.w === 7 && d.h === 7), `other marks ${dots.slice(1).map((d) => `${d.w}x${d.h}`).join(' ')}`);
      see(dots.every((d) => d.hit >= 24), `dot targets ${dots[0].hit}px`);

      await page.click('.gallery .nav.next');
      await waitCurrent(page, 1);
      await page.click('.gallery .nav.next');
      await waitCurrent(page, 2);
      see((await current(page)) === 2, `two clicks on next land on screenshot 3`);
      await new Promise((r) => setTimeout(r, 300));
      dots = await dotState(page);
      see(dots[2].w === 22 && dots[0].w === 7, `the pill moved to dot 3 (${dots.map((d) => d.w).join(' ')})`);

      await (await page.$$('.gallery .dot'))[n - 1].click();
      await waitCurrent(page, n - 1);
      await new Promise((r) => setTimeout(r, 300));
      navs = await navState(page, '.gallery');
      see(navs.find((x) => x.cls.includes('next')).disabled && !navs.find((x) => x.cls.includes('prev')).disabled, `at the last screenshot next is off and prev is on`);

      const all = await page.$$('.gallery .dot');
      await all[0].click();
      await waitCurrent(page, 0);
      await new Promise((r) => setTimeout(r, 300));
      navs = await navState(page, '.gallery');
      dots = await dotState(page);
      see(navs.find((x) => x.cls.includes('prev')).disabled && dots[0].w === 22, `back at the start: prev off, pill on dot 1`);

      await page.hover('.gallery .nav.next');
      await new Promise((r) => setTimeout(r, 300));
      const hover = await page.$eval('.gallery .nav.next', (b) => [getComputedStyle(b).backgroundColor, getComputedStyle(document.querySelector('.gallery')).getPropertyValue('--accent').trim()]);
      const accentPill = (await dotState(page))[0].bg;
      see(hover[0] === accentPill, `hover fills the arrow in the hue (${hover[0]}), the pill wears the same (${accentPill})`);
      see((await overflow(page)) <= 0, `no sideways scroll`);
    });
  }

  // Phone rail: next once, prev comes on.
  await job('/apps/waypost-words/', width, null, async (page, see) => {
    let navs = await navState(page, '[data-phones]');
    see(navs.length === 2 && navs.every((n) => n.view === '0 0 20 20' && n.w === 48 && n.shadow === 'none' && !RETIRED.test(n.bg)), `rail arrows 20-unit chevron, 48px, no shadow (${navs.map((n) => `${n.w} ${n.bg}`).join(' / ')})`);
    see(navs.find((n) => n.cls.includes('prev')).disabled, `rail starts with prev off`);
    const before = await page.$eval('.phone-from', (e) => e.textContent);
    await page.click('[data-phones] .nav.next');
    await page.waitForFunction((b) => document.querySelector('.phone-from').textContent !== b, { timeout: 3000 }, before);
    await new Promise((r) => setTimeout(r, 300));
    navs = await navState(page, '[data-phones]');
    const after = await page.$eval('.phone-from', (e) => e.textContent);
    see(!navs.find((n) => n.cls.includes('prev')).disabled, `after next the counter reads from ${after} and prev is on`);
    see((await overflow(page)) <= 0, `no sideways scroll`);
  });

  // Touch: arrows keep 48px, dots grow to 44px targets.
  await job('/apps/sole-focus/', width, 'touch', async (page, see) => {
    const media = await page.evaluate(() => [matchMedia('(hover: none)').matches, matchMedia('(pointer: coarse)').matches]);
    see(media[0] && media[1], `touch emulated: hover none ${media[0]}, pointer coarse ${media[1]}`);
    const navs = await navState(page, '.gallery');
    const dots = await dotState(page);
    see(navs.every((n) => n.w === 48) && dots.every((d) => d.hit === 44), `touch: arrows ${navs[0].w}px, dot targets ${dots[0].hit}px`);
  });

  // Reduced motion: the pill jumps rather than stretches. global.css sets every
  // transition to 0.001ms under reduce, which reads back as 1e-06s.
  await job('/apps/sole-focus/', width, [{ name: 'prefers-reduced-motion', value: 'reduce' }], async (page, see) => {
    const dots = await dotState(page);
    see(dots.every((d) => d.dur.split(',').every((s) => parseFloat(s) <= 0.00001)), `reduced motion: mark transition ${dots[0].dur}`);
  });
}

server.close();
for (const m of ok) console.log(`ok   ${m}`);
for (const m of bad) console.log(`BAD  ${m}`);
console.log(`${ok.length} ok, ${bad.length} bad`);
process.exit(bad.length ? 1 : 0);
