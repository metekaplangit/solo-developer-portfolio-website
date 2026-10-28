// Walks a visitor's path across plan 0003's five changes in the built site.
// Run: npm run build, then node control/cards/check-plan-0003-landed-and-fix-what-did-not/walk.mjs
// Settles: does each part the plan built work where the cards meet, at 1440 and 390?
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import puppeteer from 'puppeteer-core';

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json', '.xml': 'application/xml' };
const server = createServer((req, res) => {
  let p = join('dist', decodeURIComponent(req.url.split('?')[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': MIME[extname(p)] ?? 'application/octet-stream' });
  res.end(readFileSync(p));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const bad = [];
const ok = [];
const note = (cond, msg) => (cond ? ok : bad).push(msg);
const exists = (href) => {
  const u = new URL(href, base).pathname;
  const p = join('dist', u, u.endsWith('/') ? 'index.html' : '');
  return existsSync(p);
};

// A fresh browser for every page opened by address: one browser driven across
// the product pages dies part way ("Navigating frame was detached"), as
// scripts/capture.mjs records. A click stays in the browser it started in.
async function at(width) {
  let browser = null;
  let page = null;
  try {
    // Each load gets 3 tries: about 1 load in 3 detaches at random on this
    // machine, so a walk needing every load to land at once rarely finished.
    const retry = async (what, fn) => {
      for (let attempt = 1; ; attempt++) {
        try { return await fn(); } catch (e) {
          if (attempt >= 3) throw e;
          console.log(`retry @${width} ${what}: ${e.message}`);
        }
      }
    };
    const go = (path) => retry(path, async () => {
      if (process.env.WALK_DEBUG) console.log(`@${width} go ${path}`);
      if (browser) await browser.close().catch(() => {});
      browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox', '--force-device-scale-factor=1'] });
      page = await browser.newPage();
      await page.setViewport({ width, height: 900 });
      await page.goto(base + path, { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-visible')));
    });
    // Load `from`, then click `selector` as a visitor would, retried whole.
    const follow = (from, selector) => retry(`${from} -> ${selector}`, async () => {
      await go(from);
      await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click(selector)]);
    });
    const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const tiles = () => page.$$eval('a.tile', (as) => as.map((a) => {
      const r = a.getBoundingClientRect();
      const img = a.querySelector('img');
      return { href: a.getAttribute('href'), name: a.querySelector('.tile-name')?.textContent.trim(), line: a.querySelector('.tile-line')?.textContent, h: Math.round(r.height), w: Math.round(r.width), lineH: Math.round(a.querySelector('.tile-line').getBoundingClientRect().height), img: img ? img.getAttribute('loading') : 'monogram' };
    }));

    // 1. Support: the tiles a visitor uses to find their product.
    await go('/support/');
    const st = await tiles();
    note(st.length === 3, `@${width} support: ${st.length} tiles`);
    for (const t of st) {
      note(exists(t.href), `@${width} support tile ${t.name} -> ${t.href} resolves`);
      note(t.h >= 44, `@${width} support tile ${t.name} ${t.w}x${t.h} (target >= 44)`);
      note(t.img === 'eager' || t.img === 'monogram', `@${width} support tile ${t.name} icon loading=${t.img}`);
    }
    note((await overflow()) <= 0, `@${width} support: no sideways scroll`);

    // 2. Follow the first tile, as a visitor does.
    await follow('/support/', 'a.tile');
    const product = new URL(page.url()).pathname;
    note(/^\/apps\/[^/]+\/$/.test(product), `@${width} support tile click landed on ${product}`);

    for (const slug of ['magic-notes', 'sole-focus', 'waypost-words']) {
      await go(`/apps/${slug}/`);
      const r = await page.evaluate(() => {
        const band = document.querySelector('.features-band');
        const hue = getComputedStyle(document.querySelector('[style*="--hue"]') ?? document.body).getPropertyValue('--hue').trim();
        const items = [...document.querySelectorAll('.feature')];
        const n = items[0]?.querySelector('.feature-n');
        const text = items[0]?.querySelector('.feature-text');
        const get = document.querySelector('.get');
        const dl = get?.querySelector('dl.meta');
        const dlBtn = get?.querySelector('.download-btn, .btn');
        const headBtn = document.querySelector('.download-btn');
        const getRect = get?.getBoundingClientRect();
        const dlRect = dl?.getBoundingClientRect();
        const faq = document.querySelector('#common-questions');
        const q = faq ? [...document.querySelectorAll('#common-questions ~ p > strong:first-child')] : [];
        const related = [...document.querySelectorAll('.related a.tile')].map((a) => a.getAttribute('href'));
        return {
          features: items.length,
          featureRows: items.length ? new Set(items.map((i) => Math.round(i.getBoundingClientRect().top))).size : 0,
          bandIsList: band?.querySelector('ol.feature-list') != null,
          nColor: n && getComputedStyle(n).color,
          textSize: text && getComputedStyle(text).fontSize,
          textColor: text && getComputedStyle(text).color,
          hue,
          dlInside: !!(dl && getRect && dlRect.bottom <= getRect.bottom + 0.5 && dlRect.top >= getRect.top),
          getBtn: dlBtn ? { href: dlBtn.getAttribute('href'), h: Math.round(dlBtn.getBoundingClientRect().height), same: headBtn?.getAttribute('href') === dlBtn.getAttribute('href') } : null,
          unreleased: !!get?.querySelector('.unreleased'),
          titleLines: (() => { const t = get?.querySelector('.get-title'); if (!t) return 0; return Math.round(t.getBoundingClientRect().height / parseFloat(getComputedStyle(t).lineHeight || '1')); })(),
          faq: !!faq,
          qBlock: q.map((s) => getComputedStyle(s).display),
          related,
        };
      });
      note(r.bandIsList && r.features > 0, `@${width} ${slug}: features are a list of ${r.features} in ${r.featureRows} rows`);
      note(r.textSize === '17px', `@${width} ${slug}: feature text ${r.textSize} ${r.textColor}`);
      note(r.dlInside, `@${width} ${slug}: dates sit inside the Get panel`);
      note(r.getBtn ? r.getBtn.h >= 44 : r.unreleased, `@${width} ${slug}: Get button ${JSON.stringify(r.getBtn)} unreleased=${r.unreleased}`);
      note(!r.getBtn || r.getBtn.same, `@${width} ${slug}: Get button goes where the header's Download goes`);
      if (r.faq) note(r.qBlock.length > 0 && r.qBlock.every((d) => d === 'block'), `@${width} ${slug}: ${r.qBlock.length} questions each on their own line`);
      for (const h of r.related) note(exists(h), `@${width} ${slug}: More apps tile -> ${h} resolves`);
      note((await overflow()) <= 0, `@${width} ${slug}: no sideways scroll`);
      ok.push(`@${width} ${slug}: index colour ${r.nColor}, hue ${r.hue}`);
    }

    // 3. More apps, followed by click, then on to the privacy index.
    {
      await follow('/apps/sole-focus/', '.related a.tile');
      note(new URL(page.url()).pathname === '/apps/magic-notes/', `@${width} More apps click from Sole Focus landed on ${new URL(page.url()).pathname}`);
    }
    await go('/privacy/');
    const pt = await tiles();
    note(pt.length === 3, `@${width} privacy: ${pt.length} policy tiles`);
    for (const t of pt) {
      note(exists(t.href) && /^\/privacy\/[^/]+\/$/.test(t.href), `@${width} privacy tile ${t.name} -> ${t.href} resolves`);
      note(/updated \d{1,2} \w+ \d{4}/.test(t.line), `@${width} privacy tile ${t.name}: date held whole "${t.line}"`);
      note(t.h >= 44, `@${width} privacy tile ${t.name} ${t.w}x${t.h}`);
    }
    await follow('/privacy/', 'a.tile');
    note(/^\/privacy\/[^/]+\/$/.test(new URL(page.url()).pathname), `@${width} privacy tile click landed on ${new URL(page.url()).pathname}`);
    note((await overflow()) <= 0, `@${width} policy page: no sideways scroll`);
  } finally {
    if (browser) await browser.close();
  }
}

try {
  for (const w of [1440, 390]) {
    for (let attempt = 1; ; attempt++) {
      const [o, b] = [ok.length, bad.length];
      try { await at(w); break; } catch (e) {
        ok.length = o; bad.length = b;
        if (attempt >= 3) throw e;
        console.log(`retry @${w}: ${e.message}`);
      }
    }
  }
} finally {
  server.close();
}
for (const m of ok) console.log('ok   ' + m);
for (const m of bad) console.log('BAD  ' + m);
console.log(`${ok.length} ok, ${bad.length} bad`);
process.exit(bad.length ? 1 : 0);
