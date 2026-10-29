// What: serves dist/ and walks home → Magic Notes → Sole Focus at 1536 and 414, photographing each whole page,
//   printing sideways overflow, page errors, and whether each line plan 0008 wrote is shown and each it replaced is gone.
// Run:  node control/cards/check-plan-0008-landed-and-fix-what-did-not/walk.mjs [--plant]
// Settles: whether plan 0008's words reached the built pages, and nothing on them broke. --plant adds a 3000 px box
//   and puts a replaced line back, so overflow and the gone check are seen red first.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = join(HERE, '../../../dist');
const PLANT = process.argv.includes('--plant');
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json' };
const server = createServer((req, res) => {
  let p = join(DIST, decodeURIComponent(req.url.split('?')[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': MIME[extname(p)] ?? 'application/octet-stream' }); res.end(readFileSync(p));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const PAGES = {
  '/': {
    shown: ['Every answer is exact, or clearly marked with ≈.', 'Money, dates, units and loans, in plain sentences.',
      'You set each exchange rate, and the date it was true.', 'Personal. Designed, built and supported by one person.',
      'Documented. For every product, a dated privacy page.', 'Answered. I usually reply within 2–3 business days.'],
    gone: ['The engine keeps only values', 'Exchange rates are yours', 'A real person reads'],
  },
  '/apps/magic-notes/': {
    shown: ['You want to see the working behind budgets, quotes and loans.', 'You need a spreadsheet or a programmable calculator.'],
    gone: ['consequential arithmetic', 'computer-algebra', 'It reads the arithmetic people actually write'],
  },
  '/apps/sole-focus/': {
    shown: ['You want a calm, native Mac timer that waits in your menu bar.', 'Always in reach',
      'You need a website blocker, team tracking or sync across devices.', 'Sole Focus is free on the Mac App Store.'],
    gone: ['distraction-free focus timer', 'Calm, and always in reach', 'soothing', 'deliberately does none'],
  },
};

const norm = (s) => s.replace(/[ ‑]/g, (c) => (c === '‑' ? '-' : ' '));
let red = 0;
for (const w of [1536, 414]) {
  for (const [route, want] of Object.entries(PAGES)) {
    for (let t = 1; t <= 3; t++) {
      const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
      try {
        const p = await b.newPage(); await p.setViewport({ width: w, height: 900 });
        const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
        await p.goto(base + route, { waitUntil: 'networkidle0' });
        if (PLANT) await p.evaluate(() => { const d = document.createElement('p'); d.textContent = 'Exchange rates are yours. A real person reads. consequential arithmetic soothing'; d.style.width = '3000px'; document.body.append(d); });
        const r = await p.evaluate(() => ({ text: document.body.innerText, over: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
        const text = norm(r.text);
        const missing = want.shown.filter((s) => !text.includes(norm(s)));
        const left = want.gone.filter((s) => text.includes(norm(s)));
        const bad = r.over > 0 || missing.length || left.length || errs.length;
        if (bad) red++;
        // Lazy images below the fold load only once scrolled near, and scrolling makes Chrome here quit (issue 0013),
        // so they are switched to eager for the whole-page photo instead.
        await p.evaluate(() => Promise.all([...document.images].map((i) => { i.loading = 'eager'; return i.complete || new Promise((r) => { i.onload = i.onerror = r; }); })));
        const blank = await p.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
        if (blank.length) { red++; console.log(`RED  ${w} ${route} images that never loaded ${JSON.stringify(blank)}`); }
        await p.screenshot({ path: join(HERE, `walk-${w}${route.replaceAll('/', '_')}.png`), fullPage: true });
        console.log(`${bad ? 'RED ' : 'ok  '} ${w} ${route} overflow ${r.over} errors ${errs.length}` +
          (missing.length ? ` missing ${JSON.stringify(missing)}` : '') + (left.length ? ` still shown ${JSON.stringify(left)}` : ''));
        await b.close(); break;
      } catch (e) { await b.close().catch(() => {}); if (t === 3) throw e; console.log(`retry ${w} ${route}: ${e.message}`); }
    }
  }
}
server.close();
console.log(red ? `${red} page(s) red` : 'all pages ok');
process.exit(red ? 1 : 0);
