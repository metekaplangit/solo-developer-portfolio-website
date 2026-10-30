// What: serves dist/ and scrolls every route to its end in headless Chrome, beside 2 controls (a blank page held open
//   as long, and a plain 20000 px page scrolled the same way), printing when and where the browser goes away.
// Run:  node control/cards/scrolling-a-site-page-no-longer-makes-chrome-quit/scroll.mjs [runs=3] [mode=step|wheel]
// Settles: whether issue 0013's quit comes from the site's pages or from Chrome on this machine.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { ROUTES } from '../../../scripts/routes.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = join(HERE, '../../../dist');
const RUNS = Number(process.argv[2] ?? 3);
const MODE = process.argv[3] ?? 'step';
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json', '.avif': 'image/avif' };
const TALL = `<!doctype html><meta name=viewport content="width=device-width"><body style="margin:0">${
  Array.from({ length: 200 }, (_, i) => `<p style="height:100px;margin:0">row ${i}</p>`).join('')}`;
const server = createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/__tall') { res.writeHead(200, { 'content-type': MIME['.html'] }); return res.end(TALL); }
  if (url === '/__blank') { res.writeHead(200, { 'content-type': MIME['.html'] }); return res.end('<!doctype html><title>b</title>'); }
  let p = join(DIST, url);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': MIME[extname(p)] ?? 'application/octet-stream' }); res.end(readFileSync(p));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const routes = ROUTES.map((r) => (typeof r === 'string' ? r : r.path ?? r.route ?? r.url));

async function one(path, width) {
  const t0 = Date.now();
  const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args: [`--window-size=${width},900`] });
  let gone = null;
  b.on('disconnected', () => { gone ??= Date.now() - t0; });
  let y = 0, end = 0;
  try {
    const p = await b.newPage();
    await p.setViewport({ width, height: 900 });
    await p.goto(base + path, { waitUntil: 'load', timeout: 20000 });
    if (path === '/__blank') { await new Promise((r) => setTimeout(r, 6000)); end = 0; }
    else {
      end = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
      while (y < end) {
        y += 100;
        if (MODE === 'wheel') await p.mouse.wheel({ deltaY: 100 }); else await p.evaluate((v) => scrollTo(0, v), y);
        await new Promise((r) => setTimeout(r, 30));
      }
      await new Promise((r) => setTimeout(r, 300));
      y = await p.evaluate(() => scrollY);
    }
  } catch (e) { /* the browser going away is what we measure */ }
  const up = b.connected && gone === null;
  if (up) await b.close();
  return { path, width, up, at: up ? null : y, of: end, ms: gone ?? Date.now() - t0 };
}

let quits = 0, siteQuits = 0;
for (let run = 1; run <= RUNS; run++) {
  for (const width of [1536, 414]) {
    for (const path of ['/__blank', '/__tall', ...routes]) {
      const r = await one(path, width);
      const site = !path.startsWith('/__');
      if (!r.up) { quits++; if (site) siteQuits++; }
      console.log(`run ${run} ${width} ${path.padEnd(28)} ${r.up ? 'up   ' : 'QUIT '} y ${r.at ?? 'end'} of ${r.of} at ${r.ms} ms`);
    }
  }
}
console.log(`quits ${quits}, on site pages ${siteQuits}`);
server.close();
process.exit(siteQuits ? 1 : 0);
