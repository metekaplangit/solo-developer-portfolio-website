#!/usr/bin/env node
// Photograph the site's routes into a card's workshop.
//
//   node scripts/capture.mjs control/cards/<slug>/before
//   node scripts/capture.mjs control/cards/<slug>/after
//   node scripts/capture.mjs control/cards/<slug>/after @home @apps
//
// The control asks a card that changed a screen for pictures of it and never for
// a particular way of taking them, because every project takes them differently.
// This is how this one does: the built site served from disk, a real Chrome, one
// PNG per route at 1440 and one at 390.
//
// Two rules from `control/README.md` are enforced here rather than remembered:
//
//   - BUILD FIRST. A picture of a stale build reports differences the change
//     never made, so this refuses to run when `dist/` is missing and says why.
//   - A picture older than the code it shows is refused as stale at closing
//     time, so take them after the last edit, not before.
//
// Named tags narrow it to those routes; with none it photographs all nine.

import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import puppeteer from 'puppeteer-core';

const DIST = 'dist';

/** Kept in step with `tests/screens/site.spec.ts` — same routes, same tags. */
const ROUTES = [
  { path: '/', tag: '@home', file: 'home' },
  { path: '/apps/', tag: '@apps', file: 'apps' },
  { path: '/apps/sole-focus/', tag: '@sole-focus', file: 'sole-focus' },
  { path: '/apps/magic-notes/', tag: '@magic-notes', file: 'magic-notes' },
  { path: '/about/', tag: '@about', file: 'about' },
  { path: '/support/', tag: '@support', file: 'support' },
  { path: '/privacy/', tag: '@privacy-index', file: 'privacy-index' },
  { path: '/privacy/sole-focus/', tag: '@privacy-sole-focus', file: 'privacy-sole-focus' },
  { path: '/404', tag: '@not-found', file: 'not-found' },
];

const WIDTHS = [1440, 390];

const CHROME_PATHS = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.xml': 'application/xml',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

function serveDist() {
  const server = createServer((req, res) => {
    const url = (req.url ?? '/').split('?')[0];
    const candidates = url.endsWith('/')
      ? [join(DIST, url, 'index.html')]
      : [join(DIST, url), join(DIST, url + '.html'), join(DIST, url, 'index.html')];
    const file = candidates.find((p) => existsSync(p) && statSync(p).isFile());
    if (!file) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('not found: ' + url);
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(readFileSync(file));
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, base: `http://127.0.0.1:${server.address().port}` }));
  });
}

const [into, ...tags] = process.argv.slice(2);

if (!into) {
  console.error('Where to? e.g. node scripts/capture.mjs control/cards/<slug>/after');
  process.exit(1);
}
if (!existsSync(join(DIST, 'index.html'))) {
  console.error('dist/ is missing — run `npm run build` first. A picture of a stale build proves nothing.');
  process.exit(1);
}
const chrome = CHROME_PATHS.find((p) => existsSync(p));
if (!chrome) {
  console.error('No Chrome or Chromium found. Set PUPPETEER_EXECUTABLE_PATH, or install one of:\n  ' + CHROME_PATHS.join('\n  '));
  process.exit(1);
}

const wanted = tags.length ? ROUTES.filter((r) => tags.some((t) => r.tag.includes(t))) : ROUTES;
if (!wanted.length) {
  console.error(`No route matches ${tags.join(' ')}. Known: ${ROUTES.map((r) => r.tag).join(' ')}`);
  process.exit(1);
}

mkdirSync(into, { recursive: true });

const { server, base } = await serveDist();
const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  protocolTimeout: 120_000,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-device-scale-factor=1'],
});

let taken = 0;
try {
  for (const route of wanted) {
    for (const width of WIDTHS) {
      const page = await browser.newPage();
      try {
        await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
        await page.goto(base + route.path, { waitUntil: 'load', timeout: 60_000 });
        await new Promise((r) => setTimeout(r, 400));
        const path = join(into, `${route.file}-${width}.png`);
        await page.screenshot({ path, fullPage: true });
        console.log(`  • ${path}`);
        taken += 1;
      } finally {
        await page.close().catch(() => {});
      }
    }
  }
} finally {
  await browser.close().catch(() => {});
  server.close();
}

console.log(`  • ${taken} picture(s) into ${into}`);
