// Serves dist/ over HTTPS (a throwaway self-signed certificate) and walks the site in Playwright's WebKit, listing every console message and page error and every request WebKit marks as a prefetch.
// Run: npm run build, then node control/cards/check-plan-0019-landed-and-fix-what-did-not/webkit-https.mjs <cert.pem> <key.pem> [chromium|webkit]
// Answers: over HTTPS, as the live site is served, does the speculation rule prefetch in WebKit, and does it leave the console quiet?
import { createServer } from 'node:https';
import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { extname, join } from 'node:path';

const require = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
const { webkit, chromium } = require('playwright');
const [cert, key, ENGINE = 'webkit'] = process.argv.slice(2);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' };
const requests = [];
const server = createServer({ cert: readFileSync(cert), key: readFileSync(key) }, async (req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'https://x').pathname);
  requests.push({ path: p, purpose: req.headers['sec-purpose'] || req.headers.purpose || '' });
  try { const f = join(process.cwd(), 'dist', p.endsWith('/') ? p + 'index.html' : p); const b = await readFile(f); res.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream', 'cache-control': 'max-age=600' }); res.end(b); }
  catch { res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' }); res.end(await readFile(join(process.cwd(), 'dist', '404.html'))); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `https://127.0.0.1:${server.address().port}`;
const browser = ENGINE === 'webkit'
  ? await webkit.launch({ executablePath: execSync('ls -d ~/Library/Caches/ms-playwright/webkit-* | tail -1').toString().trim() + '/pw_run.sh' })
  : await chromium.launch({ executablePath: process.env.PUPPETEER_EXECUTABLE_PATH });
const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
const messages = {};
page.on('console', (m) => { const k = `${m.type()}: ${m.text().slice(0, 120)}`; messages[k] = (messages[k] ?? 0) + 1; });
page.on('pageerror', (e) => { const k = `pageerror: ${e.message.slice(0, 120)}`; messages[k] = (messages[k] ?? 0) + 1; });
await page.goto(base + '/', { waitUntil: 'load' });
await page.waitForTimeout(800);
// Quick presses that cut page changes short, then calm ones.
for (const to of ['/apps/', '/about/', '/support/', '/privacy/', '/']) {
  await page.click(`header a[href="${to}"]`, { noWaitAfter: true }).catch(() => {});
  await page.waitForTimeout(40);
}
await page.waitForLoadState('load').catch(() => {});
for (const to of ['/apps/', '/about/', '/support/', '/privacy/', '/']) {
  await page.click(`header a[href="${to}"]`).catch(() => {});
  await page.waitForLoadState('load').catch(() => {});
  await page.waitForTimeout(600);
}
await browser.close();
server.close();
const prefetched = requests.filter((r) => /prefetch/i.test(r.purpose)).map((r) => r.path);
console.log(JSON.stringify({ engine: ENGINE, messages, prefetchRequests: prefetched.length, prefetchedPages: [...new Set(prefetched)] }, null, 1));
