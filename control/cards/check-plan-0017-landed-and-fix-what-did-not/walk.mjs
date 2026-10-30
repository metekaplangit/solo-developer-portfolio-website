// What: serves dist/ (or --live, the live site) and, on every page with a Download button, checks the seam between plan 0017's
//   cards B and D: the button carries the studio's mark and no Apple logo, lifts 1px hovered and settles to 97% pressed.
// Run:  node control/cards/check-plan-0017-landed-and-fix-what-did-not/walk.mjs [--live]
// Settles: whether the new mark and the new press rule hold together on the real buttons.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
const require = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
const { chromium } = require('playwright');
const DIST = join(process.cwd(), 'dist');
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.avif': 'image/avif' };
const server = createServer(async (req, res) => { let p = decodeURIComponent(new URL(req.url, 'http://x').pathname); if (p.endsWith('/')) p += 'index.html';
  try { const b = await readFile(join(DIST, p)); res.writeHead(200, { 'content-type': T[extname(p)] || 'application/octet-stream' }); res.end(b); } catch { res.writeHead(404); res.end(); } });
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = process.argv.includes('--live') ? 'https://metkapstudio.com' : `http://127.0.0.1:${server.address().port}`;
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
let bad = 0, buttons = 0;
for (const route of ['/', '/apps/', '/apps/sole-focus/', '/apps/magic-notes/', '/apps/waypost-words/']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(base + route, { waitUntil: 'load' });
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument', { depth: 0 });
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: '.download-btn' });
  for (const [i, nodeId] of nodeIds.entries()) {
    buttons++;
    const read = async (forced) => {
      await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: forced });
      return p.evaluate((i) => { const el = document.querySelectorAll('.download-btn')[i]; for (const a of el.getAnimations()) a.finish();
        return { t: getComputedStyle(el).transform, mark: !!el.querySelector('svg.get-mark'), apple: /M17\.05/.test(el.innerHTML), label: el.textContent.trim(), name: el.getAttribute('aria-label') }; }, i);
    };
    const hover = await read(['hover']); const pressed = await read(['hover', 'active']); await read([]);
    const ok = hover.mark && !hover.apple && hover.t === 'matrix(1, 0, 0, 1, 0, -1)' && pressed.t === 'matrix(0.97, 0, 0, 0.97, 0, 0)';
    if (!ok) bad++;
    console.log(`${ok ? 'ok ' : 'BAD'} ${route} "${hover.label}" (${hover.name}) mark ${hover.mark} apple ${hover.apple} hover ${hover.t} pressed ${pressed.t}`);
  }
  await p.close();
}
await b.close(); server.close();
console.log(`${buttons} Download buttons, ${bad} wrong`);
process.exit(bad || !buttons ? 1 : 0);
