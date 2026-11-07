// What it does: measures every story heading on the 3 product pages at 1024–1920 wide — box, natural one-line width, and each line's width.
// How to run: node control/cards/the-waypost-words-weather-heading-breaks-into-even-lines-at/measure-headings.mjs "$PWD" (after npm run build)
// Settles: whether a story heading can sit on 1 line or 2 even lines inside the 15rem label rail.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
const root = process.argv[2];
const { chromiumPath } = await import(join(root, 'scripts/browsers.mjs'));
const require = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
const { chromium } = require('playwright');
const DIST = join(root, 'dist');
const srv = createServer((q, r) => { let u = q.url.split('?')[0]; let f = join(DIST, u.endsWith('/') ? u + 'index.html' : u); if (!existsSync(f) || statSync(f).isDirectory()) f = join(f, 'index.html'); if (!existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': f.endsWith('.css') ? 'text/css' : f.endsWith('.js') ? 'text/javascript' : f.endsWith('.svg') ? 'image/svg+xml' : f.endsWith('.webp') ? 'image/webp' : 'text/html' }); r.end(readFileSync(f)); });
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${srv.address().port}`;
const b = await chromium.launch({ executablePath: chromiumPath(), headless: true });
for (const w of [1024, 1280, 1440, 1536, 1920]) {
  const p = await b.newPage({ viewport: { width: w, height: 1000 } });
  for (const slug of ['waypost-words', 'magic-notes', 'sole-focus']) {
    await p.goto(`${base}/apps/${slug}/`);
    const out = await p.evaluate(() => [...document.querySelectorAll('.story-prose > h2')].map((h) => {
      const r = document.createRange(); r.selectNodeContents(h);
      const rects = [...r.getClientRects()]; const lines = []; for (const x of rects) { const l = lines.find((y) => Math.abs(y.top - x.top) < 4); if (l) l.w += x.width; else lines.push({ top: x.top, w: x.width }); }
      const c = h.cloneNode(true); c.style.cssText = 'position:absolute;white-space:nowrap;visibility:hidden'; h.parentElement.appendChild(c); const nat = c.getBoundingClientRect().width; c.remove();
      return `${h.textContent.replace(/ /g,'_')} | box ${Math.round(h.getBoundingClientRect().width)} | natural ${Math.round(nat)} | lines ${lines.map((l) => Math.round(l.w)).join('/')}`;
    }));
    console.log(w, slug); out.forEach((o) => console.log('   ', o));
  }
  await p.close();
}
await b.close(); srv.close();
