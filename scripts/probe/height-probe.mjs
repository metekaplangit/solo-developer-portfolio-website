// Measures how tall each route is at 390 and 1440, and whether a fullPage
// screenshot of it survives. Answers: is the capture failure an OOM on a very
// tall page, or something else?
import puppeteer from 'puppeteer-core';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
const DIST = join(process.cwd(), 'dist');
const TYPES = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.xml':'application/xml', '.ico':'image/x-icon', '.json':'application/json', '.txt':'text/plain', '.avif':'image/avif' };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  try { const b = await readFile(join(DIST, p)); res.writeHead(200, {'content-type': TYPES[extname(p)] || 'application/octet-stream'}); res.end(b); }
  catch { res.writeHead(404); res.end('nope'); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, protocolTimeout: 120000, args: ['--no-sandbox','--disable-dev-shm-usage','--force-device-scale-factor=1'] });
for (const path of ['/', '/apps/magic-notes/', '/apps/sole-focus/', '/about/']) {
  for (const width of [1440, 390]) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    await page.goto(base + path, { waitUntil: 'load', timeout: 60000 });
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    let shot = 'ok';
    try { await page.screenshot({ fullPage: true }); } catch (e) { shot = e.constructor.name + ': ' + e.message.slice(0, 80); }
    console.log(`${path} @${width} height=${h} px  area=${(width*h/1e6).toFixed(1)}Mpx  screenshot=${shot}`);
    await page.close().catch(() => {});
  }
}
await browser.close(); server.close();
