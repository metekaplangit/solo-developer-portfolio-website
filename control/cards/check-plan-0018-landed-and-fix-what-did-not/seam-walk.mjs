// What it does: the seams of plan 0018 — on a 390px phone with text at 150%, each gallery's Next pressed
// to the end by keyboard then ArrowLeft (cards B and D), in Chromium and WebKit; the page must not be wider than the window.
// Run: npm run build, then PUPPETEER_EXECUTABLE_PATH=<Chrome for Testing> node control/cards/<slug>/seam-walk.mjs
// Settles: whether card D's focus hand-off still works inside card B's narrow, large-text layout.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const require = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
const pw = require('playwright');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2' };
const server = createServer((req, res) => { let p = join('dist', decodeURIComponent(req.url.split('?')[0])); if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html'); if (!existsSync(p)) p = 'dist/404.html'; res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' }); res.end(readFileSync(p)); }).listen(0);
const base = `http://127.0.0.1:${server.address().port}`;
let bad = 0;
for (const engine of ['chromium', 'webkit']) {
const browser = await pw[engine].launch({ executablePath: engine === 'webkit' ? execSync('ls -d ~/Library/Caches/ms-playwright/webkit-* | tail -1').toString().trim() + '/pw_run.sh' : process.env.PUPPETEER_EXECUTABLE_PATH });
for (const [path, kind] of [['/apps/waypost-words/', '[data-phones]'], ['/apps/sole-focus/', '.gallery']]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await page.goto(base + path, { waitUntil: 'load' });
  await page.evaluate(() => { document.documentElement.style.fontSize = '150%'; });
  await page.waitForTimeout(300);
  await page.focus(`${kind} .nav.next`);
  for (let i = 0; i < 12 && !(await page.$eval(`${kind} .nav.next`, (b) => b.disabled)); i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(250); }
  const track = `${kind} .track, ${kind} .phone-track`;
  const before = await page.$eval(track, (t) => t.scrollLeft);
  const inside = await page.evaluate((k) => document.querySelector(k).contains(document.activeElement), kind);
  await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(300);
  const after = await page.$eval(track, (t) => t.scrollLeft);
  const wide = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  const ok = inside && Math.abs(after - before) > 1 && wide <= 0;
  if (!ok) bad++;
  console.log(`${engine} ${path}: page ${wide > 0 ? wide + 'px too wide' : 'fits'}, focus ${inside ? 'inside' : 'lost'}, ArrowLeft ${Math.abs(after - before) > 1 ? 'moved it' : 'did nothing'}`);
  await page.close();
}
await browser.close();
}
server.close(); process.exit(bad ? 1 : 0);
