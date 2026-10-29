// What it does: serves dist/ and records the nav-pill view-transition group on real navigations, then freezes it half-way and photographs the header (headless Chrome, shell mode).
// How to run: node control/cards/<this card>/probe.mjs
// The question it settles: does the current-page pill glide 220 ms from the old item to the new one, under legible labels, and fade where it has no partner.
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg' };
const srv = createServer((q, r) => { let p = join('dist', decodeURIComponent(q.url.split('?')[0])); if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html'); if (!existsSync(p)) p = 'dist/404.html'; r.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' }); r.end(readFileSync(p)); }).listen(0);
const base = `http://127.0.0.1:${srv.address().port}`;
const INIT = `window.__vt = null; addEventListener('pagereveal', e => { if (!e.viewTransition) { window.__vt = 'none'; return; } requestAnimationFrame(() => { const as = document.getAnimations().filter(a => a.effect && a.effect.pseudoElement && /nav-pill/.test(a.effect.pseudoElement)); window.__vt = as.map(a => a.effect.pseudoElement.replace('::view-transition-', '') + ' ' + (a.animationName || '').replace('-ua-view-transition-', '') + ' ' + a.effect.getTiming().duration); if (window.__freeze) { document.getAnimations().forEach(a => { a.pause(); a.currentTime = 110; }); } }); });`;
const out = {};
async function hop(key, start, click, { width = 1440, reduce = false, shot = null, prep = false } = {}) {
  for (let t = 1; t <= 3; t++) {
    let b;
    try {
      b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'shell' });
      const p = await b.newPage(); await p.setViewport({ width, height: 900 });
      if (reduce) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      await p.evaluateOnNewDocument(INIT );
      const cdp = await p.createCDPSession(); await cdp.send('Animation.enable'); if (shot) await cdp.send('Animation.setPlaybackRate', { playbackRate: 0.1 });
      await p.goto(base + start, { waitUntil: 'load' }); await new Promise(r => setTimeout(r, 500));
      if (prep) await p.evaluate(() => { const a = document.createElement('a'); a.id = 'to-missing'; a.href = '/no-such-page/'; document.body.append(a); });
      await Promise.all([p.waitForNavigation({ waitUntil: 'load' }), p.evaluate(s => document.querySelector(s).click(), click)]);
      await new Promise(r => setTimeout(r, shot ? 600 : 300));
      if (shot) out[key + ' | frozen'] = await p.evaluate(() => { const g = getComputedStyle(document.documentElement, '::view-transition-group(nav-pill)'); return document.getAnimations().filter(a => /nav-pill/.test(a.effect?.pseudoElement || '')).map(a => a.playState + '@' + a.currentTime).join(',') + ' transform ' + g.transform + ' width ' + g.width; });
      if (shot) await p.screenshot({ path: shot, clip: { x: 0, y: 0, width, height: width < 700 ? 110 : 80 } });
      out[key] = await p.evaluate(() => window.__vt);
      if (!shot) out[key + ' | settled pill'] = await p.evaluate(() => { const e = document.querySelector('.nav-pill'); if (!e || !e.offsetParent) return 'none visible'; const a = e.parentElement.getBoundingClientRect(), r = e.getBoundingClientRect(); return `${e.parentElement.textContent.trim()} pill==link ${Math.round(r.x) === Math.round(a.x) && Math.round(r.width) === Math.round(a.width)} bg ${getComputedStyle(e).backgroundColor}`; });
      await b.close(); return;
    } catch (e) { out[key] = 'error: ' + e.message; await b?.close().catch(() => {}); }
  }
}
for (let i = 1; i <= 4; i++) await hop('repeat ' + i + ': home -> apps', '/', '.nav-list a[href="/apps/"]');
const W = new URL('.', import.meta.url).pathname;
await hop('home -> apps', '/', '.nav-list a[href="/apps/"]');
await hop('apps -> about', '/apps/', '.nav-list a[href="/about/"]');
await hop('apps -> 404 (no current item)', '/apps/', 'a#to-missing', { prep: true });
await hop('phone: apps -> support', '/apps/', '.nav-list a[href="/support/"]', { width: 390 });
await hop('phone: apps -> brand to home', '/apps/', '.brand', { width: 390 });
await hop('reduced: home -> apps', '/', '.nav-list a[href="/apps/"]', { reduce: true });
await hop('mid-flight home -> apps', '/', '.nav-list a[href="/apps/"]', { shot: W + 'mid/home-to-apps-1440.png' });
await hop('mid-flight phone apps -> about', '/apps/', '.nav-list a[href="/about/"]', { width: 390, shot: W + 'mid/apps-to-about-390.png' });
srv.close();
for (const [k, v] of Object.entries(out)) console.log(k, '=>', JSON.stringify(v));
