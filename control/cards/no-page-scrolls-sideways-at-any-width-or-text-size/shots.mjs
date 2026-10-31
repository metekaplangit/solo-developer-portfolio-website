// What it does: photographs every route of dist/ with motion turned off, at 1440, 390 and 320 wide.
// Run: npm run build, then node control/cards/<slug>/shots.mjs <outdir>
// Settles: repeatable pictures to compare two builds at the standard widths.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { ROUTES } from '../../../scripts/routes.mjs';
const require = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
const { chromium } = require('playwright');
const out = process.argv[2]; mkdirSync(out, { recursive: true });
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2' };
const server = createServer((req, res) => { let p = join('dist', decodeURIComponent(req.url.split('?')[0])); if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html'); if (!existsSync(p)) p = 'dist/404.html'; res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' }); res.end(readFileSync(p)); }).listen(0);
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
for (const w of (process.env.WIDTHS ?? "1440,390,320").split(",").map(Number)) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  for (const r of ROUTES) {
    await page.goto(base + r.path, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => { for (const img of document.images) { img.loading = 'eager'; if (!img.complete) await new Promise((res) => { img.onload = img.onerror = res; }); } });
    await page.evaluate(async () => { await Promise.all([...document.images].map((i) => i.decode().catch(() => {}))); });
    await page.waitForTimeout(800);
    await page.screenshot({ path: join(out, `${r.tag.replace('@', '')}-${w}.png`), fullPage: true, animations: 'disabled' });
  }
  await ctx.close();
}
await browser.close(); server.close();
