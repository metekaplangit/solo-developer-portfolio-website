// Drives quick page changes and says which view transition promise each uncaught "Transition was aborted" rejection came from.
// Run: npm run build, then node control/cards/a-page-change-that-skips-its-animation-leaves-the-console-qu/which.mjs [chromium|webkit]
// Answers: is the noise an unhandled rejection of the ViewTransition the page is handed in pagereveal or pageswap, and which promise?
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { extname, join } from 'node:path';

const require = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
const { chromium, webkit } = require('playwright');
const ENGINE = process.argv[2] ?? 'chromium';
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' };

const server = createServer(async (req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const f = join(process.cwd(), 'dist', p.endsWith('/') ? p + 'index.html' : p);
  try { const b = await readFile(f); res.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' }); res.end(b); }
  catch { res.writeHead(404, { 'content-type': 'text/html' }); res.end(await readFile(join(process.cwd(), 'dist', '404.html'))); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

// In every document: remember the transition objects handed to pageswap and pagereveal, and on an
// unhandled rejection say which of their promises it was. Registered before the page's own scripts.
function tag() {
  const seen = [];
  const note = (ev) => (e) => { if (e.viewTransition) seen.push([ev, e.viewTransition]); };
  addEventListener('pageswap', note('pageswap'));
  addEventListener('pagereveal', note('pagereveal'));
  addEventListener('unhandledrejection', (u) => {
    let from = 'unknown promise';
    for (const [ev, vt] of seen) for (const k of ['ready', 'finished', 'updateCallbackDone']) if (vt[k] === u.promise) from = `${ev}.${k}`;
    console.log(`WHICH ${from} :: ${u.reason?.message ?? u.reason}`);
  });
}

const launch = ENGINE === 'webkit'
  ? { executablePath: execSync('ls -d ~/Library/Caches/ms-playwright/webkit-* | tail -1').toString().trim() + '/pw_run.sh' }
  : { executablePath: process.env.PUPPETEER_EXECUTABLE_PATH };
const browser = await (ENGINE === 'webkit' ? webkit : chromium).launch(launch);
const counts = {};
const pageErrors = [];
for (const reduced of [false, true]) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  await ctx.addInitScript(tag);
  const page = await ctx.newPage();
  page.on('console', (m) => { const t = m.text(); if (t.startsWith('WHICH ')) counts[t] = (counts[t] ?? 0) + 1; });
  page.on('pageerror', (e) => pageErrors.push(e.message));
  await page.goto(base + '/', { waitUntil: 'load' });
  const links = ['/apps/', '/about/', '/support/', '/privacy/', '/'];
  for (let i = 0; i < 20; i++) {
    const to = links[i % links.length];
    // A second link pressed during the first change, then a reload, then Back, then a resize.
    await page.click(`header a[href="${to}"]`, { noWaitAfter: true }).catch(() => {});
    await page.click(`header a[href="${links[(i + 1) % links.length]}"]`, { noWaitAfter: true, timeout: 500 }).catch(() => {});
    await page.waitForLoadState('load').catch(() => {});
    if (i % 4 === 1) await page.reload({ waitUntil: 'load' }).catch(() => {});
    if (i % 4 === 2) await page.goBack({ waitUntil: 'load' }).catch(() => {});
    if (i % 4 === 3) { await page.setViewportSize({ width: 900 + (i % 3) * 120, height: 800 }); await page.click('header a[href="/apps/"]').catch(() => {}); await page.setViewportSize({ width: 1280, height: 800 }); }
    await page.waitForTimeout(150);
  }
  await ctx.close();
}
await browser.close();
server.close();
console.log(JSON.stringify({ engine: ENGINE, which: counts, pageErrors: pageErrors.length, sample: [...new Set(pageErrors)].slice(0, 6) }, null, 1));
