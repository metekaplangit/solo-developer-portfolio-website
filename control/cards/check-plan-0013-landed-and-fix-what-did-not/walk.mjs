// What it does: walks plan 0013's fix the way a visitor meets it, in WebKit — an iPhone-sized window
// turned from sideways to upright on picture 3 of each slide gallery, then the arrows, dots and keys, then the phone rail.
// How to run: node control/cards/check-plan-0013-landed-and-fix-what-did-not/walk.mjs [base-url]   (no url: serves dist/)
// The question it settles: did plan 0013 land, and does everything around the gallery still work?
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const req = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
const { webkit } = req('playwright');
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };

let server;
let base = process.argv[2];
if (!base) {
  server = createServer((rq, res) => {
    const url = decodeURI(rq.url.split('?')[0]);
    const f = [url.endsWith('/') ? join('dist', url, 'index.html') : join('dist', url)].find((p) => existsSync(p) && statSync(p).isFile());
    if (!f) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': MIME[extname(f)] ?? 'application/octet-stream' });
    res.end(readFileSync(f));
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
}

const browser = await webkit.launch({ executablePath: execSync('ls -d ~/Library/Caches/ms-playwright/webkit-* | tail -1').toString().trim() + '/pw_run.sh' });
console.log(`webkit ${browser.version()} against ${base}`);
const bad = [];
const wait = (page, ms) => page.waitForTimeout(ms);

const read = (page) => page.evaluate(() => {
  const g = document.querySelector('.gallery');
  const t = g.querySelector('.track');
  const tr = t.getBoundingClientRect();
  const off = [...t.querySelectorAll('.slide')].map((s) => Math.abs(s.getBoundingClientRect().left - tr.left));
  return {
    showing: off.indexOf(Math.min(...off)) + 1,
    counter: g.querySelector('.counter-now').textContent,
    dot: [...g.querySelectorAll('.dot')].findIndex((d) => d.getAttribute('aria-current') === 'true') + 1,
    prev: !g.querySelector('.nav.prev').disabled,
    next: !g.querySelector('.nav.next').disabled,
    // How far the dot marker's centre sits from the current dot's, in pixels.
    marker: (() => { const m = g.querySelector('.dot-marker')?.getBoundingClientRect(); const d = g.querySelector('.dot[aria-current="true"]')?.getBoundingClientRect(); return m && d ? Math.round(Math.abs(m.left + m.width / 2 - (d.left + d.width / 2))) : -1; })(),
  };
});

async function expectOn(page, label, want) {
  const r = await read(page);
  const ok = r.showing === want.showing && r.counter === String(want.showing) && r.dot === want.showing && (want.prev === undefined || r.prev === want.prev) && (want.next === undefined || r.next === want.next) && r.marker >= 0 && r.marker <= 2;
  console.log(`  ${ok ? '✓' : '✗'} ${label}: showing ${r.showing}, counter ${r.counter}, dot ${r.dot}, prev ${r.prev ? 'on' : 'off'}, next ${r.next ? 'on' : 'off'}, marker off by ${r.marker}px`);
  if (!ok) bad.push(label);
}

for (const path of ['/apps/sole-focus/', '/apps/magic-notes/']) {
  console.log(path);
  const page = await browser.newPage({ viewport: { width: 844, height: 390 } });
  await page.goto(base + path, { waitUntil: 'load' });
  const n = await page.evaluate(() => { const g = document.querySelector('.gallery'); g.scrollIntoView({ block: 'center' }); return g.querySelectorAll('.slide').length; });
  await wait(page, 800);
  await page.click('.gallery .nav.next');
  await wait(page, 1200);
  await page.click('.gallery .nav.next');
  await wait(page, 1200);
  await expectOn(page, `${path} sideways, Next twice`, { showing: 3 });
  await page.setViewportSize({ width: 390, height: 844 });
  await wait(page, 1200);
  await expectOn(page, `${path} turned upright`, { showing: 3, prev: true, next: true });
  await page.evaluate(() => document.querySelector('.gallery').scrollIntoView({ block: 'center' }));
  await wait(page, 600);
  await page.click('.gallery .nav.next');
  await wait(page, 1200);
  await expectOn(page, `${path} upright, Next`, { showing: 4 });
  await page.click('.gallery .nav.prev');
  await wait(page, 1200);
  await expectOn(page, `${path} upright, Previous`, { showing: 3 });
  await page.click(`.gallery .dot[data-index="${n - 1}"]`);
  await wait(page, 2000);
  await expectOn(page, `${path} upright, last dot`, { showing: n, next: false });
  await page.click('.gallery .dot[data-index="0"]');
  await wait(page, 2000);
  await expectOn(page, `${path} upright, first dot`, { showing: 1, prev: false });
  await page.focus('.gallery .track');
  await page.keyboard.press('ArrowRight');
  await wait(page, 1200);
  await expectOn(page, `${path} upright, Right key`, { showing: 2 });
  await page.keyboard.press('ArrowLeft');
  await wait(page, 1200);
  await expectOn(page, `${path} upright, Left key`, { showing: 1, prev: false });
  await page.setViewportSize({ width: 844, height: 390 });
  await wait(page, 1200);
  await expectOn(page, `${path} turned sideways again`, { showing: 1 });
  await page.close();
}

console.log('/apps/waypost-words/ phone rail');
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(base + '/apps/waypost-words/', { waitUntil: 'load' });
await page.evaluate(() => document.querySelector('[data-phones]').scrollIntoView({ block: 'center' }));
await wait(page, 800);
const count = () => page.evaluate(() => document.querySelector('[data-phones] .phone-count').textContent.replace(/\s+/g, ' ').trim());
const first = await count();
for (let i = 0; i < 10 && !(await page.evaluate(() => document.querySelector('[data-phones] .nav.next').disabled)); i++) {
  await page.click('[data-phones] .nav.next');
  await wait(page, 1000);
}
const last = await count();
const ok = first === '1–2 of 10' && last === '9–10 of 10';
console.log(`  ${ok ? '✓' : '✗'} rail: first "${first}", after Next to the end "${last}"`);
if (!ok) bad.push('phone rail');

await browser.close();
server?.close();
console.log(bad.length ? `${bad.length} wrong: ${bad.join('; ')}` : 'all as expected');
process.exit(bad.length ? 1 : 0);
