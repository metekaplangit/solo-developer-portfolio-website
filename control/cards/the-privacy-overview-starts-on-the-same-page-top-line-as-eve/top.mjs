// What it does: prints, per route and width, the first text line in <main>, its distance below the header, and its element.
// Run: npm run build, then node control/cards/<slug>/top.mjs
// Settles: why /privacy/ starts higher than the other routes (issue 0010).
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { ROUTES } from '../../../scripts/routes.mjs';
const require = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
const { chromium } = require('playwright');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2' };
const server = createServer((req, res) => { let p = join('dist', decodeURIComponent(req.url.split('?')[0])); if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html'); if (!existsSync(p)) p = 'dist/404.html'; res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' }); res.end(readFileSync(p)); }).listen(0);
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
for (const w of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  for (const r of ROUTES) {
    await page.goto(base + r.path, { waitUntil: 'load' });
    await page.waitForTimeout(300);
    console.log(w, r.path.padEnd(24), await page.evaluate(() => {
      const header = document.querySelector('.site-header').getBoundingClientRect().bottom;
      const walk = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT);
      for (let n = walk.nextNode(); n; n = walk.nextNode()) {
        const host = n.parentElement; if (!n.textContent.trim() || !host.checkVisibility()) continue;
        if (host.closest('.visually-hidden, .skip-link, [aria-hidden="true"]')) continue;
        const range = document.createRange(); range.selectNodeContents(n); const rect = range.getClientRects()[0];
        if (!rect || rect.width < 2) continue;
        const cs = getComputedStyle(host); const box = host.getBoundingClientRect();
        let p = host; const chain = []; while (p && p.tagName !== 'MAIN') { chain.push(`${p.tagName.toLowerCase()}${p.className && typeof p.className === 'string' ? '.' + p.className.trim().split(/\s+/)[0] : ''} mt=${getComputedStyle(p).marginTop} pt=${getComputedStyle(p).paddingTop}`); p = p.parentElement; }
        return `text ${Math.round(rect.top - header)} box ${Math.round(box.top - header)} font ${cs.fontSize}/${cs.lineHeight} "${n.textContent.trim().slice(0, 20)}" ${chain.reverse().join(' > ')}`;
      }
    }));
  }
  await page.close();
}
await browser.close(); server.close();
