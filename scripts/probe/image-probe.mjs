// Reports, for every <img> on a built route at several widths, whether it loaded
// and whether it is actually drawn. Run: node scripts/probe/image-probe.mjs /apps/ [390 768 1440]
// Answers: is a picture that looks empty missing, unloaded, or hidden by CSS?
import puppeteer from 'puppeteer-core';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const [route = '/apps/', ...ws] = process.argv.slice(2);
const widths = ws.length ? ws.map(Number) : [390, 768, 1440];
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const server = createServer((req, res) => {
  const url = (req.url ?? '/').split('?')[0];
  const c = url.endsWith('/') ? [join('dist', url, 'index.html')] : [join('dist', url), join('dist', url, 'index.html')];
  const f = c.find((p) => existsSync(p) && statSync(p).isFile());
  if (!f) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[extname(f)] ?? 'application/octet-stream' });
  res.end(readFileSync(f));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const chrome = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium'].find(existsSync);

async function probe(width) {
  const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900 });
    await page.goto(base + route, { waitUntil: 'load' });
    // Scroll through like a visitor, so lazy images and reveal animations get their chance.
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 400) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await new Promise((r) => setTimeout(r, 120)); }
    await new Promise((r) => setTimeout(r, 1500));
    const rows = await page.evaluate(() => [...document.querySelectorAll('img')].map((img) => {
      const r = img.getBoundingClientRect();
      let el = img, hidden = '';
      while (el && el !== document.body) {
        const cs = getComputedStyle(el);
        if (cs.opacity === '0' || cs.visibility === 'hidden' || cs.display === 'none') { hidden = `${el.tagName}.${el.className} opacity=${cs.opacity} vis=${cs.visibility} disp=${cs.display}`; break; }
        el = el.parentElement;
      }
      return { src: (img.currentSrc || img.src).split('/').pop().slice(0, 40), loading: img.loading, complete: img.complete, natural: img.naturalWidth, w: Math.round(r.width), h: Math.round(r.height), hidden };
    }));
    console.log(`\n@${width}`);
    for (const r of rows) console.log(`  ${r.natural ? 'loaded ' : 'EMPTY  '} ${r.w}x${r.h} ${r.loading} ${r.src} ${r.hidden ? 'HIDDEN by ' + r.hidden : ''}`);
  } finally { await browser.close().catch(() => {}); }
}
// Chrome on this machine detaches about 1 launch in 3 (see capture.mjs); 3 tries.
for (const width of widths) {
  for (let t = 1; t <= 3; t++) {
    try { await probe(width); break; } catch (e) { console.log(`@${width} try ${t} failed: ${e.message.slice(0, 60)}`); }
  }
}
server.close();
