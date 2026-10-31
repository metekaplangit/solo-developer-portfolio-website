// What it does: in WebKit, focuses each gallery's Next, presses Enter to the end, then ArrowLeft.
// Run: npm run build, then node control/cards/<slug>/webkit-walk.mjs
// Settles: whether focus stays in the gallery in Safari's engine too (issue 0025).
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const require = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
const { webkit } = require('playwright');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2' };
const server = createServer((req, res) => { let p = join('dist', decodeURIComponent(req.url.split('?')[0])); if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html'); if (!existsSync(p)) p = 'dist/404.html'; res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' }); res.end(readFileSync(p)); }).listen(0);
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await webkit.launch({ executablePath: execSync('ls -d ~/Library/Caches/ms-playwright/webkit-* | tail -1').toString().trim() + '/pw_run.sh' });
let bad = 0;
for (const [path, kind] of [['/apps/waypost-words/', '[data-phones]'], ['/apps/sole-focus/', '.gallery']]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await page.goto(base + path, { waitUntil: 'load' });
  await page.focus(`${kind} .nav.next`);
  for (let i = 0; i < 12 && !(await page.$eval(`${kind} .nav.next`, (b) => b.disabled)); i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(250); }
  const track = `${kind} .track, ${kind} .phone-track`;
  const before = await page.$eval(track, (t) => t.scrollLeft);
  const inside = await page.evaluate((k) => document.querySelector(k).contains(document.activeElement), kind);
  await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(300);
  const after = await page.$eval(track, (t) => t.scrollLeft);
  const ok = inside && Math.abs(after - before) > 1;
  if (!ok) bad++;
  console.log(`webkit ${path}: focus ${inside ? 'inside' : 'lost'}, ArrowLeft ${Math.abs(after - before) > 1 ? 'moved it' : 'did nothing'}`);
  await page.close();
}
await browser.close(); server.close(); process.exit(bad ? 1 : 0);
