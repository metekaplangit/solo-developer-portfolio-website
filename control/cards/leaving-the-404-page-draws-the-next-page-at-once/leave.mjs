// What: serves dist/ the way GitHub Pages does (an unknown address gets 404.html with status 404) and times a click from one
//   page to home: the new page's response end against its first paint, 3 runs per case, in Chrome.
// Run:  npm run build, then node control/cards/leaving-the-404-page-draws-the-next-page-at-once/leave.mjs [--live]
// Settles: what makes leaving the 404 page hold the next page's first frame (issue 0017) — the 404 status, the
//   cross-document view transition, or neither — by changing one thing per case.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const require = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
const { chromium } = require('playwright');
const DIST = join(process.cwd(), 'dist');
const T = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.png': 'image/png', '.avif': 'image/avif', '.json': 'application/json', '.ico': 'image/x-icon' };
let notFoundStatus = 404;
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  try { const b = await readFile(join(DIST, p)); res.writeHead(200, { 'content-type': T[extname(p)] || 'application/octet-stream' }); res.end(b); }
  catch { res.writeHead(notFoundStatus, { 'content-type': T['.html'] }); res.end(await readFile(join(DIST, '404.html'))); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const LIVE = process.argv.includes('--live');
const base = LIVE ? 'https://metkapstudio.com' : `http://127.0.0.1:${server.address().port}`;

async function time(browser, { from, via = null, noTransition = false, status = 404, link = 'main a[href="/"]', inject = null }) {
  notFoundStatus = status;
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  // Every document records its first animation frame and whether a view transition revealed it, in absolute time.
  await page.addInitScript(() => {
    requestAnimationFrame((t) => { window.__first = performance.timeOrigin + t; });
    addEventListener('pagereveal', (e) => { window.__vt = !!e.viewTransition; });
  });
  if (noTransition) {
    await page.route('**/*.css', async (route) => {
      const r = await route.fetch();
      const body = (await r.text()).replace(/@view-transition\s*\{[^}]*\}/g, '');
      await route.fulfill({ response: r, body });
    });
  }
  // A trial change to the 404 page alone, put into the HTML as served (its CSP meta dropped so the trial can run).
  if (inject) {
    await page.route('**/no-such-page/', async (route) => {
      const r = await route.fetch();
      const body = (await r.text()).replace(/<meta http-equiv="content-security-policy"[^>]*>/i, '').replace('</head>', inject + '</head>');
      await route.fulfill({ response: r, body });
    });
  }
  await page.goto(base + (via ?? from), { waitUntil: 'load' });
  if (via) {
    await page.waitForTimeout(500);
    await page.click(`header a[href="${from}"], main a[href="${from}"]`);
    await page.waitForURL(base + from);
    await page.waitForLoadState('load');
  }
  await page.waitForTimeout(800);
  const click = await page.evaluate(() => performance.timeOrigin + performance.now());
  await page.click(link);
  await page.waitForURL(base + '/');
  await page.waitForLoadState('load');
  await page.waitForTimeout(400);
  const t = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    return { response: performance.timeOrigin + nav.responseEnd, first: window.__first, vt: window.__vt };
  });
  await ctx.close();
  return { response: Math.round(t.response - click), first: Math.round(t.first - click), vt: t.vt };
}

// Playwright switches the back-forward cache off by default; a visitor's Chrome has it on. --no-bfcache keeps it off.
const ignoreDefaultArgs = process.argv.includes('--no-bfcache') ? [] : ['--disable-back-forward-cache'];
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ignoreDefaultArgs });
const cases = LIVE
  ? [['404 → home', { from: '/no-such-page/' }], ['about → home', { from: '/about/', link: 'header a[href="/"]' }], ['404 → home by the header', { from: '/no-such-page/', link: 'header a[href="/"]' }]]
  : [
      ['404 → home', { from: '/no-such-page/' }],
      ['about → home', { from: '/about/', link: 'header a[href="/"]' }],
      ['404 → home by the header', { from: '/no-such-page/', link: 'header a[href="/"]' }],
      ['about (reached by a click) → home', { from: '/about/', via: '/support/', link: 'header a[href="/"]' }],
      ['404 page served 200 → home', { from: '/no-such-page/', status: 200 }],
      ['404 → home, no view transition', { from: '/no-such-page/', noTransition: true }],
      ['404 opted out in CSS → home', { from: '/no-such-page/', inject: '<style>@view-transition { navigation: none; }</style>' }],
      ['404 skips in pageswap → home', { from: '/no-such-page/', inject: "<script>addEventListener('pageswap', (e) => e.viewTransition?.skipTransition());</script>" }],
    ];
for (const [name, c] of cases) {
  const runs = [];
  for (let i = 0; i < 5; i++) runs.push(await time(browser, c));
  console.log(`${name.padEnd(36)} first frame ${runs.map((r) => r.first).join(', ')} ms after the click; response ${runs.map((r) => r.response).join(', ')}; transition ${runs.map((r) => r.vt).join(', ')}`);
}
await browser.close();
server.close();
