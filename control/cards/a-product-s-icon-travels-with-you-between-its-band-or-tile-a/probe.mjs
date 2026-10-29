// What it does: serves dist/ and records which view-transition groups run on real navigations, in headless Chrome (shell mode).
// How to run: node control/cards/<this card>/probe.mjs
// The question it settles: does the product icon travel as its own 420 ms group, both ways and to its privacy page.
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg' };
const srv = createServer((q, r) => { let p = join('dist', decodeURIComponent(q.url.split('?')[0])); if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html'); if (!existsSync(p)) p = 'dist/404.html'; r.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' }); r.end(readFileSync(p)); }).listen(0);
const base = `http://127.0.0.1:${srv.address().port}`;
const INIT = `window.__vt = null; addEventListener('pagereveal', e => { if (!e.viewTransition) { window.__vt = 'none'; return; } requestAnimationFrame(() => { window.__vt = document.getAnimations().filter(a => a.effect && a.effect.pseudoElement && /icon|root/.test(a.effect.pseudoElement)).map(a => a.effect.pseudoElement.replace('::view-transition-', '') + ' ' + (a.animationName || '').replace('-ua-view-transition-', '') + ' ' + a.effect.getTiming().duration); }); });`;
const out = {};
async function hop(key, start, click, back = false) {
  for (let t = 1; t <= 3; t++) {
    const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'shell' });
    try {
      const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 }); await p.evaluateOnNewDocument(INIT);
      await p.goto(base + start, { waitUntil: 'load' }); await new Promise(r => setTimeout(r, 500));
      await Promise.all([p.waitForNavigation({ waitUntil: 'load' }), p.evaluate(s => document.querySelector(s).click(), click)]);
      await new Promise(r => setTimeout(r, 900));
      if (back) { await Promise.all([p.waitForNavigation({ waitUntil: 'load' }), p.evaluate(() => history.back())]); await new Promise(r => setTimeout(r, 900)); }
      out[key] = await p.evaluate(() => window.__vt); await b.close(); return;
    } catch (e) { out[key] = 'error: ' + e.message; await b.close().catch(() => {}); }
  }
}
await hop('apps -> magic-notes (band title link)', '/apps/', '#p-magic-notes a, a[href="/apps/magic-notes/"]');
await hop('magic-notes -> back to apps', '/apps/', 'a[href="/apps/magic-notes/"]', true);
await hop('support tile -> sole-focus', '/support/', '.tile[href="/apps/sole-focus/"]');
await hop('sole-focus -> its privacy policy', '/apps/sole-focus/', '.action-row a[href="/privacy/sole-focus/"]');
await hop('home -> about (no icon there)', '/', '.nav-list a[href="/about/"]');
srv.close();
for (const [k, v] of Object.entries(out)) console.log(k, '=>', JSON.stringify(v));
