// What it does: photographs the two views issue 0022's pictures show, with today's build.
// Run: npm run build, then node control/cards/<slug>/issue-shots.mjs <outdir>
// Settles: the after pictures for docs/issues/assets/0022/.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const require = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
const { chromium } = require('playwright');
const out = process.argv[2];
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2' };
const server = createServer((req, res) => { let p = join('dist', decodeURIComponent(req.url.split('?')[0])); if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html'); if (!existsSync(p)) p = 'dist/404.html'; res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' }); res.end(readFileSync(p)); }).listen(0);
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
for (const [path, text, name] of [['/apps/waypost-words/', 150, '03-waypost-390px-text-150-after.png'], ['/', 200, '04-home-390px-text-200-after.png']]) {
  await page.goto(base + path, { waitUntil: 'load' });
  await page.evaluate((t) => { document.documentElement.style.fontSize = `${t}%`; }, text);
  await page.waitForTimeout(500);
  console.log(name, await page.evaluate(() => document.documentElement.scrollWidth - innerWidth));
  await page.screenshot({ path: join(out, name) });
}
await browser.close(); server.close();
