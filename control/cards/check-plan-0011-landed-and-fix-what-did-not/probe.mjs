// What it does: drives the built site the way a visitor does — home → Apps → a product → its gallery → back → About — at 1440 and 390, with and without reduced motion, recording every view-transition animation per hop and photographing each settled screen; then repeats the key checks with Chrome's view-transition and scroll-timeline features switched off, standing in for browsers without them.
// How to run: npm run build, then node control/cards/check-plan-0011-landed-and-fix-what-did-not/probe.mjs
// The question it settles: do plan 0011's 5 cards work together where they meet, and does every fallback still show all content.
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg' };
const srv = createServer((q, r) => { let p = join('dist', decodeURIComponent(q.url.split('?')[0])); if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html'); if (!existsSync(p)) p = 'dist/404.html'; r.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' }); r.end(readFileSync(p)); }).listen(0);
const base = `http://127.0.0.1:${srv.address().port}`;
const W = new URL('.', import.meta.url).pathname;
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
// Every view-transition animation at reveal, plus where the arriving opening and the travelling icon stand when the transition ends.
const INIT = `window.__hops = JSON.parse(sessionStorage.getItem('hops') || '[]');
addEventListener('pagereveal', (e) => {
  const rec = { url: location.pathname, vt: !!e.viewTransition, anims: [] };
  if (e.viewTransition) {
    requestAnimationFrame(() => { rec.anims = document.getAnimations().filter(a => a.effect && a.effect.pseudoElement).map(a => a.effect.pseudoElement.replace('::view-transition-', '') + ':' + Math.round(a.effect.getTiming().duration)).filter(s => !/plus-lighter/.test(s)); });
    e.viewTransition.finished.then(() => { const h = document.querySelector('[data-land="1"]'); rec.openingOpacityAtEnd = h ? +getComputedStyle(h).opacity : null; rec.endedAt = Math.round(performance.now() - t0); window.__hops.push(rec); sessionStorage.setItem('hops', JSON.stringify(window.__hops)); });
  } else { window.__hops.push(rec); sessionStorage.setItem('hops', JSON.stringify(window.__hops)); }
  const t0 = performance.now();
});`;
const results = {};
// One fresh browser per hop: a long session in this Chrome detaches (issue 0013).
async function hop(label, start, act, { width, reduce = false, flags = [], back = false, gallery = false }) {
  for (let t = 1; t <= 3; t++) {
    let b;
    try {
      b = await puppeteer.launch({ executablePath: CHROME, headless: 'shell', args: flags });
      const p = await b.newPage(); await p.setViewport({ width, height: 900, hasTouch: width < 700, isMobile: width < 700 });
      if (reduce) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      await p.evaluateOnNewDocument(INIT);
      await p.goto(base + start, { waitUntil: 'load' }); await new Promise(r => setTimeout(r, 600));
      const out = {};
      if (act) { await Promise.all([p.waitForNavigation({ waitUntil: 'load' }), p.evaluate(act)]); await new Promise(r => setTimeout(r, 900)); }
      if (back) { await Promise.all([p.waitForNavigation({ waitUntil: 'load' }), p.evaluate(() => history.back())]); await new Promise(r => setTimeout(r, 900)); }
      if (gallery) out.gallery = await p.evaluate(async () => {
        const g = document.querySelector('.gallery'); g.scrollIntoView({ block: 'center' });
        await new Promise(r => setTimeout(r, 400));
        g.querySelector('.nav.next').click(); await new Promise(r => setTimeout(r, 900));
        g.querySelector('.nav.next').click(); await new Promise(r => setTimeout(r, 900));
        const m = g.querySelector('.dot-marker'), d = g.querySelectorAll('.dot'), cur = g.querySelector('.dot[aria-current="true"]');
        const cx = (e) => { const r = e.getBoundingClientRect(); return r.left + r.width / 2; };
        const markerOn = getComputedStyle(m).display !== 'none';
        return { counter: g.querySelector('.counter-now').textContent, current: [...d].indexOf(cur) + 1, marker: markerOn ? Math.round(cx(m) - cx(d[2])) + 'px off dot 3' : 'not drawn', currentMarkWidth: getComputedStyle(cur, '::after').width };
      });
      await new Promise(r => setTimeout(r, 500));
      await p.screenshot({ path: `${W}journey/${label}.png` });
      out.hops = await p.evaluate(() => window.__hops.map(h => `${h.url} vt=${h.vt} [${h.anims.join(' ')}]` + (h.endedAt !== undefined ? ` ended ${h.endedAt}ms, opening opacity then ${h.openingOpacityAtEnd}` : '')));
      out.openingVisible = await p.evaluate(() => [...document.querySelectorAll('[data-land]')].every(e => getComputedStyle(e).opacity === '1'));
      results[label] = out; await b.close(); return;
    } catch (e) { results[label] = 'error: ' + e.message; await b?.close().catch(() => {}); }
  }
}
const NAV = (href) => `(() => document.querySelector('.nav-list a[href="${href}"]').click())()`;
const BAND = `(() => document.querySelector('a.band-shot[href="/apps/magic-notes/"]').click())()`;
// No Chrome switch tried (ScrollTimeline, CSSScrollTimeline, TimelineScope,
// ViewTransitionOnNavigation, CrossDocumentViewTransition, PageRevealEvent)
// turns these features off in Chrome 156, so the fallbacks cannot be driven here.
// ONLY=<label part> runs just the hops whose label contains it.
const want = (label) => !process.env.ONLY || process.env.ONLY.split(',').some((x) => label.includes(x));
for (const [tag, o] of [['1440', { width: 1440 }], ['390', { width: 390 }], ['1440-reduced', { width: 1440, reduce: true }]]) {
  for (const [name, start, act, extra] of [
    ['1-home-to-apps', '/', NAV('/apps/'), {}],
    ['2-apps-to-magic-notes-gallery', '/apps/', BAND, { gallery: true }],
    ['3-magic-notes-back-to-apps', '/apps/', BAND, { back: true }],
    ['4-apps-to-about', '/apps/', NAV('/about/'), {}],
  ]) if (want(`${tag}-${name}`)) await hop(`${tag}-${name}`, start, act, { ...o, ...extra });
}
srv.close();
for (const [k, v] of Object.entries(results)) console.log('\n== ' + k + '\n' + JSON.stringify(v, null, 1).replace(/\n\s*/g, ' '));
