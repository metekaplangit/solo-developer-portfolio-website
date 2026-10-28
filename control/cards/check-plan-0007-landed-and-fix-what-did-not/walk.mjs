// Walks a visitor's path across plan 0007's five changes in the built site, contrast off and on.
// Run: npm run build, then node control/cards/check-plan-0007-landed-and-fix-what-did-not/walk.mjs
// Settles: do the new rows, ledger and lists hold at 1440 and 390, and do their hairlines strengthen under Increase contrast?
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
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
const out = 'control/cards/check-plan-0007-landed-and-fix-what-did-not/after';
mkdirSync(out, { recursive: true });

const ROUTES = ['/', '/apps/', '/apps/magic-notes/', '/privacy/magic-notes/', '/support/', '/about/'];
const PARTS = '.sheet-row, .spec-row, .include > li, .values > li, .story-prose > h2, .panel';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
let failures = 0;

async function read(page) {
  return page.evaluate((sel) => {
    const alpha = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean); return v.length > 3 ? +v[3] : 1; };
    const parts = {};
    for (const el of document.querySelectorAll(sel)) {
      const key = el.matches('.panel') ? 'panel' : el.className.split(' ')[0] || el.parentElement.className.split(' ')[0] + '>' + el.tagName.toLowerCase();
      const cs = getComputedStyle(el);
      const a = alpha(cs.borderTopColor);
      (parts[key] ??= { n: 0, borderAlpha: new Set(), bg: new Set() });
      parts[key].n++;
      if (cs.borderTopStyle !== 'none' && +cs.borderTopWidth.replace('px', '') > 0) parts[key].borderAlpha.add(a);
      if (el.matches('.panel')) parts[key].bg.add(cs.backgroundImage.includes('gradient') ? 'gradient:' + cs.backgroundImage.slice(0, 60) : cs.backgroundColor);
    }
    for (const k in parts) { parts[k].borderAlpha = [...parts[k].borderAlpha]; parts[k].bg = [...parts[k].bg]; }
    const lists = [...document.querySelectorAll('main ol, main ul')].filter((l) => getComputedStyle(l).listStyleType === 'none' && l.getAttribute('role') !== 'list' && !l.closest('nav')).length;
    return { overflow: document.documentElement.scrollWidth - innerWidth, accent: document.querySelectorAll('.panel-accent').length, lists, parts };
  }, PARTS);
}

for (const contrast of ['no-preference', 'more']) {
  for (const width of [1440, 390]) {
    let browser;
    for (let tries = 0; tries < 3 && !browser; tries++) {
      try { browser = await puppeteer.launch({ executablePath: CHROME, headless: true }); } catch (e) { if (tries === 2) throw e; }
    }
    for (const route of ROUTES) {
      let r;
      for (let tries = 0; tries < 3 && !r; tries++) {
        try {
          const page = await browser.newPage();
          await page.setViewport({ width, height: 900 });
          await page.emulateMediaFeatures([{ name: 'prefers-contrast', value: contrast }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
          await page.goto(base + route, { waitUntil: 'networkidle0' });
          // PLANT=1 proves the instrument: a too-wide box and a list stripped of its role must both read red.
          if (process.env.PLANT) await page.evaluate(() => { const d = document.createElement('div'); d.style.width = '3000px'; d.style.height = '1px'; document.querySelector('main').append(d); document.querySelector('main ol[role=list], main ul[role=list]')?.removeAttribute('role'); });
          r = await read(page);
          const name = `${route.replace(/\//g, '_') || '_'}-${width}-${contrast}.png`;
          await page.screenshot({ path: join(out, name), fullPage: true });
          await page.close();
        } catch (e) {
          if (tries === 2) throw e;
          // A dropped connection takes the whole browser with it here: start a fresh one.
          await browser.close().catch(() => {});
          browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
        }
      }
      const bad = [];
      if (r.overflow > 0) bad.push(`overflow ${r.overflow}`);
      if (r.lists > 0) bad.push(`${r.lists} unstyled list(s) without role=list`);
      if (r.accent > 0 && !route.startsWith('/apps/') && route !== '/') bad.push(`${r.accent} accent panel(s) on a studio page`);
      if (bad.length) failures++;
      const parts = Object.entries(r.parts).map(([k, v]) => `${k}×${v.n} border ${v.borderAlpha.join('/') || '-'}${v.bg.length ? ' bg ' + v.bg.join('|') : ''}`).join('; ');
      console.log(`${contrast.padEnd(13)} ${String(width).padStart(4)} ${route.padEnd(22)} ${bad.length ? 'FAIL ' + bad.join(', ') : 'ok'} | ${parts}`);
    }
    await browser.close();
  }
}
server.close();
console.log(failures ? `${failures} route reading(s) failed` : 'every reading held');
process.exit(failures ? 1 : 0);
