// What: serves dist/ and reads where every line of interface text ends, on every route at 1920, 1536, 1440, 414 and 390 px,
//   printing each bad break: a line ending on a word that points forward, a line stranding a new phrase's first 1–2 words,
//   and a 2-line heading whose second line is under 60% of its first.
// Run:  npm run build, then node control/cards/product-apps-and-about-text-breaks-where-a-reader-would/breaks.mjs [--plant]
// Settles: which of issue 0007's and 0015's breaks are still live, and that none is left. --plant adds 2 known faults first.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { ROUTES } from '../../../scripts/routes.mjs';

const require = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
const { chromium } = require('playwright');
const DIST = join(process.cwd(), 'dist');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.json': 'application/json', '.woff2': 'font/woff2', '.avif': 'image/avif' };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  else if (!extname(p)) p += '.html';
  try { const b = await readFile(join(DIST, p)); res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' }); res.end(b); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const PLANT = process.argv.includes('--plant');
// Policy pages are legal text, outside 0007's count; the privacy index is interface text and stays in.
const routes = ROUTES.map((r) => r.path).filter((p) => !/^\/privacy\/.+/.test(p));
const WIDTHS = [1920, 1536, 1440, 414, 390];
// The site's own line-end words (tests/dist.test.ts T1 and src/lib/typography.ts).
const FORWARD = ['a', 'an', 'the', 'and', 'or', 'nor', 'but', 'so', 'yet', 'if', 'as', 'than', 'that', 'of', 'to', 'in', 'on', 'at',
  'by', 'for', 'from', 'with', 'into', 'onto', 'over', 'under', 'via', 'per', 'is', 'are', 'was', 'were', 'be', 'been', 'no', 'not',
  'has', 'have', 'had', 'can', 'will', 'do', 'does', 'did', 'it', 'its', 'my', 'your', 'our', 'their', 'his', 'her', 'this', 'these',
  'you', 'we', 'they', 'i', 'where', 'when', 'which', 'who', 'what', 'every', 'each'];

function measure({ forward, plant }) {
  if (plant) {
    const m = document.querySelector('main');
    m.insertAdjacentHTML('afterbegin', `<p style="width:16ch">Planted text that ends on the word</p><h2 style="width:9ch">Weather with a mind of its own</h2>`);
  }
  const out = [];
  for (const el of document.querySelectorAll('main p, main li, main h1, main h2, main h3, main h4, main dd, main figcaption, main blockquote')) {
    if (el.querySelector('p, li, ul, ol, h1, h2, h3, h4')) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height || getComputedStyle(el).visibility === 'hidden') continue;
    const words = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      for (const m of n.data.matchAll(/[^\s ]+(?: [^\s ]+)*/g)) {
        const range = document.createRange();
        range.setStart(n, m.index); range.setEnd(n, m.index + m[0].length);
        const rects = [...range.getClientRects()].filter((q) => q.width > 0);
        // A tied run may itself span a line only if it is too long; split it by its own rects.
        const parts = m[0].split(' ');
        if (rects.length > 1 && parts.length > 1) {
          // Rare: a tied run broke anyway. Count it as its parts on the rects' lines.
          parts.forEach((w, i) => words.push({ w, top: Math.round(rects[Math.min(i, rects.length - 1)].top) }));
        } else if (rects.length) {
          parts.forEach((w) => words.push({ w, top: Math.round(rects[0].top), x0: rects[0].left, x1: rects[rects.length - 1].right }));
        }
      }
    }
    const lines = [];
    for (const w of words) {
      const last = lines[lines.length - 1];
      if (last && Math.abs(last.top - w.top) < 4) { last.words.push(w.w); if (w.x1) last.x1 = w.x1; }
      else lines.push({ top: w.top, words: [w.w], x0: w.x0, x1: w.x1 });
    }
    if (lines.length < 2) continue;
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    const heading = /^H\d$/.test(el.tagName);
    lines.slice(0, -1).forEach((l, i) => {
      const end = l.words[l.words.length - 1].toLowerCase().replace(/[^\p{L}]/gu, '');
      const endsPhrase = /[.,;:!?—–)]$/.test(l.words[l.words.length - 1]);
      if (!endsPhrase && forward.includes(end)) out.push({ kind: 'forward-word', text, line: l.words.join(' ') });
      // The line's last 1–2 words open a phrase begun after punctuation on the same line.
      const w = l.words;
      for (const k of [1, 2]) {
        if (w.length > k + 1 && /[.,;:!?—–]$/.test(w[w.length - 1 - k]) && !endsPhrase && !/^[—–]$/.test(w[w.length - k])) {
          out.push({ kind: 'stranded-start', text, line: w.join(' ') }); break;
        }
      }
    });
    if (heading && lines.length === 2) {
      const a = lines[0].words.join(' ').length, b = lines[1].words.join(' ').length;
      if (b / a < 0.6) out.push({ kind: 'uneven-heading', text, line: `${a} / ${b} characters` });
    }
  }
  return out;
}

const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
let total = 0;
const seen = new Map();
for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const rows = await page.evaluate(measure, { forward: FORWARD, plant: PLANT });
    for (const r of rows) {
      total++;
      const key = `${route} | ${r.kind} | ${r.text.slice(0, 50)} || line: ${r.line}`;
      seen.set(key, [...(seen.get(key) ?? []), width]);
    }
  }
  await page.close();
}
await browser.close();
for (const [k, ws] of seen) console.log(`${k}  @ ${ws.join(', ')}`);
console.log(`bad breaks ${total} across ${seen.size} pieces`);
server.close();
process.exit(total ? 1 : 0);
