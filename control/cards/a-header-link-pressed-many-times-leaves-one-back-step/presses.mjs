// What it does: from /, clicks the header's Apps & Games link 15 times at 0, 50 and 150 ms apart,
// then reads history.length and whether one Back returns home. Chrome and WebKit.
// Run: npm run build, then node control/cards/<slug>/presses.mjs
// Settles: issue 0024 — how many Back steps quick repeated presses leave.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const require = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
const pw = require('playwright');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2' };
const server = createServer((req, res) => { let p = join(process.env.DIST ?? 'dist', decodeURIComponent(req.url.split('?')[0])); if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html'); if (!existsSync(p)) p = join(process.env.DIST ?? 'dist', '404.html'); res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' }); res.end(readFileSync(p)); }).listen(0);
const base = `http://127.0.0.1:${server.address().port}`;
let bad = 0;
for (const engine of ['chromium', 'webkit']) {
  const opts = engine === 'webkit'
    ? { executablePath: execSync('ls -d ~/Library/Caches/ms-playwright/webkit-* | tail -1').toString().trim() + '/pw_run.sh' }
    : { executablePath: process.env.PUPPETEER_EXECUTABLE_PATH, ignoreDefaultArgs: ['--disable-back-forward-cache'] };
  const browser = await pw[engine].launch(opts);
  for (const gap of [0, 50, 150]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(base + '/', { waitUntil: 'load' });
    await page.goto(base + '/', { waitUntil: 'load' }).catch(() => {});
    const start = await page.evaluate(() => history.length);
    // Try 2: the mouse itself, at the link's spot, on a fixed clock — no waiting for the
    // link to be ready, as a hand pressing quickly would.
    const box = await page.locator('.site-header a[href="/apps/"]').boundingBox();
    const x = box.x + box.width / 2, y = box.y + box.height / 2;
    for (let i = 0; i < 15; i++) {
      await page.mouse.click(x, y).catch(() => {});
      if (gap) await page.waitForTimeout(gap);
    }
    await page.waitForTimeout(2500);
    const len = await page.evaluate(() => history.length);
    await page.goBack({ waitUntil: 'load' }).catch(() => {});
    await page.waitForTimeout(500);
    const back = new URL(page.url()).pathname;
    const ok = len - start === 1 && back === '/';
    if (!ok) bad++;
    console.log(`${engine} ${gap}ms: ${len - start} new history entries, one Back lands on ${back}`);
    await page.close();
  }
  await browser.close();
}
server.close(); process.exit(bad ? 1 : 0);
