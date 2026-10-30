// Walks a visitor's path across plan 0014's change in the built site, in WebKit and Chrome.
// Run: npm run build, then node control/cards/check-plan-0014-landed-and-fix-what-did-not/walk.mjs
// Settles: do quick presses still count once a phone tap, a turn and a hand swipe are mixed in?
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { extname, join } from 'node:path';

const pw = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'))('playwright');
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = createServer((req, res) => {
  const url = decodeURI((req.url ?? '/').split('?')[0]);
  const c = url.endsWith('/') ? [join('dist', url, 'index.html')] : [join('dist', url), join('dist', url, 'index.html')];
  const f = c.find((p) => existsSync(p) && statSync(p).isFile());
  if (!f) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[extname(f)] ?? 'application/octet-stream' });
  res.end(readFileSync(f));
});
await new Promise((r) => server.listen(0, '127.0.0.1', () => r(null)));
const addr = server.address();
const base = `http://127.0.0.1:${typeof addr === 'object' && addr ? addr.port : 0}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bad = [];
const ok = [];
const note = (cond, msg) => { (cond ? ok : bad).push(msg); console.log((cond ? "ok   " : "BAD  ") + msg); };
const step = (m) => console.log("  .. " + m);

const launch = (engine) => engine === 'webkit'
  ? pw.webkit.launch({ executablePath: execSync('ls -d ~/Library/Caches/ms-playwright/webkit-* | tail -1').toString().trim() + '/pw_run.sh' })
  : pw.chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });

// Waits until the track has not moved for 10 reads 50 ms apart.
const still = (page, sel) => page.evaluate((s) => new Promise((done) => {
  const t = document.querySelector(s); let last = -1, n = 0;
  const tick = () => { n = t.scrollLeft === last ? n + 1 : 0; last = t.scrollLeft; if (n >= 10) done(null); else setTimeout(tick, 50); };
  tick();
}), sel);
const rail = (page) => page.evaluate(() => {
  const t = document.querySelector('.phone-track'); const p = [...t.querySelectorAll('.phone')];
  const step = p[1].offsetLeft - p[0].offsetLeft;
  return { at: +(t.scrollLeft / step).toFixed(2), from: document.querySelector('.phone-from').textContent, to: document.querySelector('.phone-to').textContent, next: document.querySelector('[data-phones] .nav.next').disabled, prev: document.querySelector('[data-phones] .nav.prev').disabled };
});
const gallery = (page) => page.evaluate(() => {
  const t = document.querySelector('.gallery .track');
  const dot = [...document.querySelectorAll('.gallery .dot')].findIndex((d) => d.getAttribute('aria-current') === 'true');
  return { at: +(t.scrollLeft / t.clientWidth).toFixed(2), counter: document.querySelector('.counter-now').textContent, dot: dot + 1 };
});

for (const engine of ['webkit', 'chromium']) {
  const b = await launch(engine);
  step(`${engine} launched`);

  // 1. A phone on Waypost Words: Next tapped quickly to the end, then Previous quickly back.
  const phone = await (await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: engine === 'chromium' })).newPage();
  await phone.goto(base + '/apps/waypost-words/', { waitUntil: 'load' }); await sleep(800);
  step("phone page loaded");
  await phone.locator('[data-phones] .nav.next').scrollIntoViewIfNeeded();
  for (let i = 0; i < 12; i++) await phone.tap('[data-phones] .nav.next', { force: true, timeout: 2000 }).catch(() => {});
  step("12 Next taps sent");
  await still(phone, '.phone-track');
  const end = await rail(phone);
  note(end.to === '10' && end.next && Number.isInteger(end.at), `${engine} 390 rail, Next tapped 12 times quickly: shots ${end.from}–${end.to}, at ${end.at}, Next ${end.next ? 'off' : 'on'}`);
  for (let i = 0; i < 12; i++) await phone.tap('[data-phones] .nav.prev', { force: true, timeout: 2000 }).catch(() => {});
  await still(phone, '.phone-track');
  const back = await rail(phone);
  note(back.from === '1' && back.prev && back.at === 0, `${engine} 390 rail, Previous tapped 12 times quickly: shots ${back.from}–${back.to}, at ${back.at}, Previous ${back.prev ? 'off' : 'on'}`);

  // 2. A Mac on Sole Focus: Next 3 times quickly, the window turned upright mid-glide, then a hand swipe.
  const mac = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await mac.goto(base + '/apps/sole-focus/', { waitUntil: 'load' }); await sleep(800);
  await mac.locator('.gallery .nav.next').scrollIntoViewIfNeeded();
  step("mac loaded");
  for (let i = 0; i < 3; i++) await mac.click('.gallery .nav.next');
  step("3 clicks sent");
  await sleep(60);
  await mac.setViewportSize({ width: 900, height: 1440 });
  await sleep(300); await still(mac, '.gallery .track');
  step("turned and still");
  const turned = await gallery(mac);
  note(turned.at === 3 && turned.counter === '4' && turned.dot === 4, `${engine} 3 quick Next, turned upright mid-glide: at ${turned.at}, counter ${turned.counter}, dot ${turned.dot} (picture 4 expected)`);
  const box = await mac.locator('.gallery .track').boundingBox();
  await mac.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  for (let i = 0; i < 6; i++) { await mac.mouse.wheel(150, 0); await sleep(16); }
  await sleep(200); await still(mac, '.gallery .track');
  step("swiped and still");
  const swiped = await gallery(mac);
  note(Number.isInteger(swiped.at) && swiped.at > 3 && swiped.counter === String(swiped.at + 1) && swiped.dot === swiped.at + 1, `${engine} then a sideways swipe by hand: at ${swiped.at}, counter ${swiped.counter}, dot ${swiped.dot}`);
  await mac.click('.gallery .nav.prev');
  await still(mac, '.gallery .track');
  const after = await gallery(mac);
  note(after.at === swiped.at - 1 && after.counter === String(after.at + 1), `${engine} then Previous once: at ${after.at}, counter ${after.counter} (one back from where the hand left it)`);
  // Closing a page on its own hangs Playwright WebKit here; closing the browser does not.
  await b.close();
}
server.close();
process.exit(bad.length ? 1 : 0);
