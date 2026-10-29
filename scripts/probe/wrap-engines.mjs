// Measures how body copy wraps in Chromium and in WebKit (Safari's engine), per route and width.
// Run: npm run build, then node scripts/probe/wrap-engines.mjs [/route/ ...]   (uses the global `playwright` install)
// Answers: does the line-wrapping CSS behave the same in Safari as in the Chrome every other check uses?
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const require = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
const { chromium, webkit } = require('playwright');

const DIST = join(process.cwd(), 'dist');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  try { const b = await readFile(join(DIST, p)); res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' }); res.end(b); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const ROUTES = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/apps/', '/apps/sole-focus/', '/apps/magic-notes/', '/apps/waypost-words/', '/about/', '/support/', '/privacy/sole-focus/'];
const WIDTHS = [1440, 390];
// The core of the site's own line-end rule (src/lib/typography.ts TIE_WORDS), enough to compare engines.
const FORWARD = ['a', 'an', 'the', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'at', 'by', 'for', 'from', 'with', 'is', 'are', 'its', 'your', 'our', 'it', 'you', 'i', 'has', 'can', 'will'];

// Runs in the page: every visible multi-line p/li, split into lines by word rectangles.
function measure(forward) {
  const out = [];
  for (const el of document.querySelectorAll('main p, main li')) {
    if (el.querySelector('p, li, ul, ol')) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const words = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      for (const m of n.data.matchAll(/[^\s ]+/g)) {
        const range = document.createRange();
        range.setStart(n, m.index); range.setEnd(n, m.index + m[0].length);
        const rects = [...range.getClientRects()].filter((q) => q.width > 0);
        if (rects.length) words.push({ w: m[0], top: Math.round(rects[0].top), left: rects[0].left, right: rects[rects.length - 1].right });
      }
    }
    const lines = [];
    for (const w of words) {
      const last = lines[lines.length - 1];
      if (last && Math.abs(last.top - w.top) < 4) { last.right = Math.max(last.right, w.right); last.end = w.w; }
      else lines.push({ top: w.top, left: w.left, right: w.right, end: w.w });
    }
    if (lines.length < 2) continue;
    const box = parseFloat(getComputedStyle(el).width);
    const widths = lines.map((l) => l.right - l.left);
    const bad = lines.slice(0, -1).filter((l) => forward.includes(l.end.toLowerCase().replace(/[^\p{L}]/gu, ''))).length;
    out.push({ lines: lines.length, fill: Math.max(...widths) / box, last: widths[widths.length - 1] / Math.max(...widths), bad, wrap: getComputedStyle(el).textWrapStyle || getComputedStyle(el).textWrap });
  }
  return out;
}

const summary = {};
const ENGINES = [
  ['chromium', chromium, { executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' }],
  // The newest WebKit build Playwright left in its cache; the global install may expect an older one.
  ['webkit', webkit, { executablePath: execSync('ls -d ~/Library/Caches/ms-playwright/webkit-* | tail -1').toString().trim() + '/pw_run.sh' }],
];
for (const [name, type, opts] of ENGINES) {
  const browser = await type.launch(opts);
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    for (const route of ROUTES) {
      await page.goto(base + route, { waitUntil: 'load' });
      const rows = await page.evaluate(measure, FORWARD);
      for (const row of rows) {
        const key = `${width} ${row.wrap}`;
        const s = (summary[key] ??= {});
        const e = (s[name] ??= { paras: 0, lines: 0, bad: 0, fill: 0, narrow: 0, stub: 0 });
        e.paras++; e.lines += row.lines; e.bad += row.bad; e.fill += row.fill;
        if (row.fill < 0.85) e.narrow++;
        if (row.last < 0.25) e.stub++;
      }
    }
    await page.close();
  }
  await browser.close();
}
server.close();

console.log('width wrap      engine    paras lines bad-ends avg-fill narrow(<85%) stub-last(<25%)');
for (const [key, s] of Object.entries(summary).sort()) {
  for (const [name, e] of Object.entries(s)) {
    console.log(`${key.padEnd(15)} ${name.padEnd(9)} ${String(e.paras).padStart(5)} ${String(e.lines).padStart(5)} ${String(e.bad).padStart(8)} ${(e.fill / e.paras).toFixed(2).padStart(8)} ${String(e.narrow).padStart(12)} ${String(e.stub).padStart(15)}`);
  }
}
