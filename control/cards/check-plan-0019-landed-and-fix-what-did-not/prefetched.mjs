// Loads each route in Playwright's Chromium and lists which of its header links Chrome reports as prefetched, through the DevTools Preload domain.
// Run: npm run build, then PUPPETEER_EXECUTABLE_PATH=<Chrome for Testing> node control/cards/check-plan-0019-landed-and-fix-what-did-not/prefetched.mjs
// Answers: does the speculation rule really make Chrome fetch every header link's page, under this site's CSP, without a hover or a tap?
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { extname, join } from 'node:path';

const require = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
const { chromium } = require('playwright');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' };
const server = createServer(async (req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  try { const f = join(process.cwd(), 'dist', p.endsWith('/') ? p + 'index.html' : p); const b = await readFile(f); res.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' }); res.end(b); }
  catch { res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' }); res.end(await readFile(join(process.cwd(), 'dist', '404.html'))); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.PUPPETEER_EXECUTABLE_PATH });
const routes = ['/', '/apps/', '/apps/sole-focus/', '/about/', '/privacy/', '/no-such-page/'];
for (const route of routes) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  const status = new Map();
  const csp = [];
  cdp.on('Preload.prefetchStatusUpdated', (e) => status.set(new URL(e.key.url).pathname, `${e.status}${e.prefetchStatus ? ' ' + e.prefetchStatus : ''}`));
  page.on('console', (m) => { if (/Content Security Policy|speculation/i.test(m.text())) csp.push(m.text().slice(0, 140)); });
  await cdp.send('Preload.enable');
  await page.goto(base + route, { waitUntil: 'load' });
  const wanted = await page.evaluate(() => [...new Set([...document.querySelectorAll('header a[href^="/"]')].map((a) => new URL(a.href).pathname))]);
  const t0 = Date.now();
  while (Date.now() - t0 < 5000 && !wanted.every((p) => p === route || /Ready|Success/.test(status.get(p) ?? ''))) await page.waitForTimeout(50);
  console.log(JSON.stringify({ route, ms: Date.now() - t0, header: Object.fromEntries(wanted.map((p) => [p, status.get(p) ?? 'never'])), others: status.size, csp }));
  await ctx.close();
}
await browser.close();
server.close();
