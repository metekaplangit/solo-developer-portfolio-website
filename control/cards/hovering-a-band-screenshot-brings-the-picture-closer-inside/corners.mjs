// What it does: photographs a band screenshot's top-left and bottom-right corners at rest and fully leaning in, and prints the colours just outside and just inside the rounded edge.
// How to run: npm run build, then node control/cards/<this card>/corners.mjs
// The question it settles: does the scaled picture stay clipped to the frame's rounded corners.
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' };
const srv = createServer((q, r) => { let p = join('dist', decodeURIComponent(q.url.split('?')[0])); if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html'); if (!existsSync(p)) p = 'dist/404.html'; r.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' }); r.end(readFileSync(p)); }).listen(0);
const base = `http://127.0.0.1:${srv.address().port}`;
const W = new URL('.', import.meta.url).pathname;
for (let t = 1; t <= 3; t++) {
  let b;
  try {
    b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'shell' });
    const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 });
    await p.goto(base + '/apps/', { waitUntil: 'load' });
    await p.evaluate(() => document.querySelector('.band-shot').scrollIntoView({ block: 'center' }));
    await p.waitForFunction(() => { const i = document.querySelector('.band-shot img'); return i.complete && i.naturalWidth > 0; });
    await new Promise(r => setTimeout(r, 900));
    const box = await p.evaluate(() => { const b = document.querySelector('.band-shot').getBoundingClientRect(); return [b.x + scrollX, b.y + scrollY, b.width, b.height]; });
    console.log('frame', box.map(Math.round).join(','));
    for (const state of ['rest', 'lean']) {
      if (state === 'lean') { await p.hover('.band-shot'); await new Promise(r => setTimeout(r, 900)); }
      await p.screenshot({ path: `${W}corner-${state}-tl.png`, clip: { x: Math.floor(box[0]), y: Math.floor(box[1]), width: 48, height: 48 } });
      await p.screenshot({ path: `${W}corner-${state}-br.png`, clip: { x: Math.ceil(box[0] + box[2]) - 48, y: Math.ceil(box[1] + box[3]) - 48, width: 48, height: 48 } });
    }
    await b.close(); break;
  } catch (e) { console.log('retry', e.message); await b?.close().catch(() => {}); }
}
srv.close();
