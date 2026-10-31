// What it does: serves dist/ and measures every route at narrow widths and large text, naming what sticks out.
// Run: npm run build, then node control/cards/no-page-scrolls-sideways-at-any-width-or-text-size/wide.mjs [chromium|webkit]
// Settles: which page parts make a page wider than its window (issue 0022).
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { ROUTES } from '../../../scripts/routes.mjs';
const require = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
const pw = require('playwright');
const engine = process.argv[2] ?? 'chromium';
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };
const server = createServer((req, res) => {
  let p = join('dist', decodeURIComponent(req.url.split('?')[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) p = 'dist/404.html';
  res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' });
  res.end(readFileSync(p));
}).listen(0);
const base = `http://127.0.0.1:${server.address().port}`;
const CONFIGS = [[200, 400, 100], [240, 320, 100], [260, 600, 100], [287, 600, 100], [320, 600, 100], [390, 844, 125], [390, 844, 150], [390, 844, 175], [390, 844, 200], [390, 844, 300], [1440, 900, 175], [1440, 900, 200]];
const opts = engine === 'webkit'
  ? { executablePath: execSync('ls -d ~/Library/Caches/ms-playwright/webkit-* | tail -1').toString().trim() + '/pw_run.sh' }
  : { executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' };
const browser = await pw[engine].launch(opts);
let bad = 0;
for (const [w, h, text] of CONFIGS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, bypassCSP: !!process.env.INJECT });
  const page = await ctx.newPage();
  for (const r of ROUTES) {
    await page.goto(base + r.path, { waitUntil: 'load' });
    if (process.env.INJECT) await page.addStyleTag({ content: process.env.INJECT });
    if (text !== 100) await page.evaluate((t) => { document.documentElement.style.fontSize = `${t}%`; }, text);
    await page.waitForTimeout(50);
    const res = await page.evaluate(() => {
      const over = document.documentElement.scrollWidth - window.innerWidth;
      if (over <= 0) return { over, who: [] };
      const vw = window.innerWidth; const who = [];
      const sticks = new Set();
      for (const el of document.querySelectorAll('body *')) {
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.right <= vw + 0.5) continue;
        let a = el.parentElement, inScroller = false;
        while (a) { const ox = getComputedStyle(a).overflowX; if (ox !== 'visible') { inScroller = true; break; } a = a.parentElement; }
        if (!inScroller) sticks.add(el);
      }
      const name = (el) => `${el.tagName.toLowerCase()}${typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''}`;
      for (const el of sticks) {
        if ([...el.children].some((c) => sticks.has(c))) continue;
        const b = el.getBoundingClientRect(); const cs = getComputedStyle(el);
        who.push(`${name(el.parentElement)}>${name(el)} r=${Math.round(b.right)} w=${Math.round(b.width)} min=${cs.minWidth} ws=${cs.whiteSpace} "${(el.textContent || '').trim().slice(0, 24)}"`);
      }
      return { over, who: who.slice(0, 6) };
    });
    if (res.over > 0) { bad++; console.log(`${w}x${h} ${text}% ${r.path}: +${res.over}px  ${res.who.join(' | ')}`); }
  }
  await ctx.close();
}
console.log(`${engine}: ${bad} page views wider than the window`);
await browser.close(); server.close();
process.exit(bad ? 1 : 0);
