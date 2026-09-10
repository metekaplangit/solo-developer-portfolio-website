#!/usr/bin/env node
// The live tier: what the public actually receives, held against what the build
// wrote.
//
//   npm run test:live
//   npm run test:live -- https://staging.example.com
//
// WHY THIS EXISTS. Every other check in this project reads `dist/`. Nothing
// between `dist/` and a visitor is this repository's, and on 2026-09-10 that
// gap was not hypothetical: Cloudflare Web Analytics was injecting
// `static.cloudflareinsights.com/beacon.min.js` into every live page, against
// the "no analytics, no third-party services" control in `CLAUDE.md`, and every
// gate here was green. The page's own CSP blocked the script, so nothing
// tracked — but the only reason anybody knew was that somebody opened the site
// and looked. This is that look, written down.
//
// It is NOT part of `npm run headless`. That tier runs on every card, offline
// and in seconds; a network fetch in it would turn an unrelated card red the
// first time a CDN hiccupped. This one is run by hand, and after a deploy.
//
// It compares SERVED HTML against BUILT HTML rather than loading the page in a
// browser, on purpose. A browser shows what survived the CSP; the served bytes
// show what was sent, which is the thing that changed.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SITE = process.argv[2] ?? 'https://metkapstudio.com';

// Cloudflare only injects its beacon into responses it believes are page
// navigations, so a bare fetch() gets a clean page and reports all-well. This
// is the header that made the difference when the injection was found.
const HEADERS = {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
};

// The routes the build produces, as `dist/` lays them out.
const ROUTES = [
  ['/', 'index.html'],
  ['/apps', 'apps/index.html'],
  ['/apps/sole-focus', 'apps/sole-focus/index.html'],
  ['/apps/magic-notes', 'apps/magic-notes/index.html'],
  ['/about', 'about/index.html'],
  ['/support', 'support/index.html'],
  ['/privacy', 'privacy/index.html'],
  ['/privacy/sole-focus', 'privacy/sole-focus/index.html'],
  ['/privacy/magic-notes', 'privacy/magic-notes/index.html'],
];

if (!existsSync('dist/index.html')) {
  console.error('dist/ is missing — run `npm run build` first.');
  process.exit(1);
}

/** Every `src` a `<script>` element carries, plus a marker per inline script. */
function scripts(html) {
  const found = [];
  for (const tag of html.match(/<script\b[^>]*>/gi) ?? []) {
    const src = tag.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
    found.push(src ? src[1] : 'inline');
  }
  return found;
}

/** Every absolute origin the document points at, from any attribute. */
function origins(html) {
  const found = new Set();
  for (const m of html.matchAll(/\b(?:src|href)\s*=\s*["'](https?:\/\/[^"']+)["']/gi)) {
    try {
      found.add(new URL(m[1]).origin);
    } catch {
      /* a malformed URL is not an origin; the diff below will still show it */
    }
  }
  return found;
}

const problems = [];
let checked = 0;

for (const [route, file] of ROUTES) {
  const builtPath = join('dist', file);
  if (!existsSync(builtPath)) {
    problems.push(`${route}: the build produced no ${builtPath} — this list is out of date with the site`);
    continue;
  }
  const built = readFileSync(builtPath, 'utf8');

  let served;
  let status;
  try {
    const res = await fetch(SITE + route, { headers: HEADERS, redirect: 'follow' });
    status = res.status;
    served = await res.text();
  } catch (err) {
    problems.push(`${route}: could not be fetched — ${err.message}`);
    continue;
  }
  checked += 1;

  if (status !== 200) {
    problems.push(`${route}: served ${status}, expected 200`);
    continue;
  }

  const builtScripts = scripts(built);
  const servedScripts = scripts(served);
  for (const s of servedScripts) {
    if (!builtScripts.includes(s)) {
      problems.push(`${route}: a <script> the build never wrote is being served — ${s}`);
    }
  }
  if (servedScripts.length > builtScripts.length) {
    problems.push(
      `${route}: ${servedScripts.length} <script> elements served, ${builtScripts.length} built — ` +
        'something between the build and the visitor is adding markup',
    );
  }

  const builtOrigins = origins(built);
  for (const origin of origins(served)) {
    if (!builtOrigins.has(origin)) {
      problems.push(`${route}: points at a third-party origin the build never wrote — ${origin}`);
    }
  }

  // The CSP is what stopped the 2026-09-10 injection from executing. Losing it
  // silently would be worse than the injection.
  if (!/http-equiv\s*=\s*["']Content-Security-Policy["']/i.test(served)) {
    problems.push(`${route}: no Content-Security-Policy in the served page`);
  }
}

console.log(`Live tier — ${SITE}, ${checked} of ${ROUTES.length} route(s) fetched and held against dist/.`);

if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`  • ${p}`);
  console.error(
    '\nEach line above is markup the visitor received and the build did not produce.\n' +
      'If it is an injected script, the setting that injects it is in whatever sits\n' +
      'in front of this site, not in this repository.',
  );
  process.exit(1);
}

console.log('Every served page matches its build — no extra script, no third-party origin, CSP present.');
