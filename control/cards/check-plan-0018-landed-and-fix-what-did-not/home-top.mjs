// What it does: on the built home page at 320, 390 and 1440, prints the first visible text in main and how far below the header it starts.
// Run: npm run build, then PUPPETEER_EXECUTABLE_PATH=<Chrome for Testing> node control/cards/<slug>/home-top.mjs [dist folder]
// Settles: which line the page-top test reads on the home page, and whether it moves between loads.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const require = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
const { chromium } = require('playwright');
const root = process.argv[2] ?? 'dist';
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif' };
const server = createServer((req, res) => { let p = join(root, decodeURIComponent(req.url.split('?')[0])); if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html'); if (!existsSync(p)) p = join(root, '404.html'); res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' }); res.end(readFileSync(p)); }).listen(0);
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.PUPPETEER_EXECUTABLE_PATH });
for (const width of [320, 390, 1440]) for (const round of [1, 2]) {
  const page = await browser.newPage({ viewport: { width, height: 844 }, reducedMotion: process.env.MOTION === 'full' ? 'no-preference' : 'reduce' });
  await page.goto(base + '/', { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const r = await page.evaluate(() => {
    const header = document.querySelector('.site-header'); const main = document.querySelector('main');
    const walk = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      const host = n.parentElement; if (!host || !n.textContent.trim()) continue;
      const cs = getComputedStyle(host); if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      if (host.closest('.visually-hidden, .skip-link, [aria-hidden="true"]')) continue;
      const range = document.createRange(); range.selectNodeContents(n); const rect = range.getClientRects()[0];
      if (!rect || rect.width < 2 || rect.height < 2) continue;
      return { anims: document.getAnimations().map((a) => (a.effect?.target?.className ?? '') + ':' + a.playState + ':' + Math.round(a.currentTime ?? -1) + '/' + a.effect?.getTiming().duration).slice(0, 6), text: n.textContent.trim().slice(0, 40), host: host.tagName + '.' + host.className, top: Math.round(rect.top - header.getBoundingClientRect().bottom), header: Math.round(header.getBoundingClientRect().height), navRows: new Set([...document.querySelectorAll('.nav-list li')].filter((li) => li.offsetParent).map((li) => Math.round(li.getBoundingClientRect().top))).size };
    }
  });
  console.log(width, round, JSON.stringify(r));
  await page.close();
}
await browser.close(); server.close();
