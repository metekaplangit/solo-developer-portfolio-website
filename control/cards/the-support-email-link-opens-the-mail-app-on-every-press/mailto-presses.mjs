// What it does: presses the support address on every page that shows it, in Playwright's Chromium — once, then twice quickly, then 3 times spread 1.5s apart — and prints what Chrome logs about launching mailto:.
// How to run: npm run build, then node control/cards/the-support-email-link-opens-the-mail-app-on-every-press/mailto-presses.mjs "$PWD"
// Settles: whether a single press is ever refused (presses: once, twice quickly, a burst of 5, 3 spread out), or only a second launch inside Chrome's external-protocol flood window.
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process'; import { join } from 'node:path';
import { createServer } from 'node:http'; import { readFileSync, existsSync, statSync } from 'node:fs';
const root = process.argv[2]; const { chromiumPath } = await import(join(root, 'scripts/browsers.mjs'));
const { chromium } = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'))('playwright');
const DIST = join(root, 'dist');
const srv = createServer((q, r) => { const u = q.url.split('?')[0]; let f = join(DIST, u); if (!existsSync(f) || statSync(f).isDirectory()) f = join(DIST, u, 'index.html'); if (!existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': f.endsWith('.css') ? 'text/css' : f.endsWith('.js') ? 'text/javascript' : f.endsWith('.svg') ? 'image/svg+xml' : 'text/html' }); r.end(readFileSync(f)); });
await new Promise((r) => srv.listen(0, '127.0.0.1', r)); const base = `http://127.0.0.1:${srv.address().port}`;
const b = await chromium.launch({ executablePath: chromiumPath(), headless: true });
const routes = ['/', '/apps/', '/about/', '/support/', '/privacy/', '/privacy/waypost-words/', '/apps/waypost-words/'];
const plans = { once: [0], 'twice quickly': [0, 80], 'burst of 5': [0, 0, 0, 0, 0], 'spread 1.5s': [0, 1500, 3000] };
let found = 0;
for (const route of routes) {
  for (const [name, gaps] of Object.entries(plans)) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
    const launched = [], refused = []; page.on('console', (m) => { const t = m.text(); if (/^Launched external handler/.test(t)) launched.push(t); else if (/Not allowed to launch/.test(t)) refused.push(t.slice(0, 110)); });
    await page.goto(base + route, { waitUntil: 'load' });
    const links = await page.locator('a[href^="mailto:"]').count();
    if (!links) { await ctx.close(); if (name === 'once') console.log(`${route}: no mailto link`); continue; }
    found++;
    const link = page.locator('a[href^="mailto:"]').first(); await link.scrollIntoViewIfNeeded();
    const box = await link.boundingBox(); let t = 0;
    for (const at of gaps) { await page.waitForTimeout(at - t); t = at; await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2); }
    await page.waitForTimeout(400);
    console.log(`${route} ${name}: ${gaps.length} press(es), ${launched.length} launched, ${refused.length} refused${refused.length ? ' — ' + refused[0] : ''}`);
    await ctx.close();
  }
}
console.log(`pages with a mailto link: ${found / Object.keys(plans).length}`);
await b.close(); srv.close();
