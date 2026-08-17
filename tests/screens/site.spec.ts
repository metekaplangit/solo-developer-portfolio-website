// Assertions about the RENDERED GEOMETRY of the built site (STEP-0080).
//
// `tests/dist.test.ts` proves things about the HTML a visitor is sent. This
// proves things about the layout a browser makes out of it — sizes, positions,
// alignment and spacing — which is where `docs/CHECKLIST.md` keeps most of its
// rules and where, until this suite existed, all of them were "read by a
// person".
//
// The defect that motivated it: STEP-0052 shipped "406 targets measured across
// 8 routes x 3 widths, 0 failures", and a later rename of the back-link class
// from `.back` to `.page-back` quietly took the shared 24px rule away from two
// routes. Nothing went red. A pixel-snapshot suite would not have caught it
// either — six invisible pixels of padding are a diff of nothing.
//
// Run with `npm run test:ui`, AFTER a build. Kept out of `npm test` and out of
// `npm run test:dist` because it launches a browser per route.
//
// THIS IS THE PROJECT'S SCREEN TIER, and the file name and test titles are part
// of the contract rather than a preference:
//
//   - `control/loop.py` finds a screen by reading `*.spec.ts` in the folder
//     `control/project.py` names, so this is a `.spec.ts` under `tests/screens/`.
//   - It reads the tag out of a TEST TITLE, and only from a line beginning
//     `test(` — `it(` is invisible to it. So every route is one `test()` whose
//     title ends in that route's `@tag`, and `control/loop.py check` will refuse
//     a card naming a tag that no title here carries.
//
// A route is therefore one screen: nine screens, one per published route. The
// rules that used to be nine separate `it()` blocks spanning every route are now
// applied per route and collected, so a failure says WHICH PAGE is wrong before
// it says which rule — and every rule that a route breaks is still listed, not
// just the first.
//
// One rule cannot be per-route by nature: the page title's indent has to agree
// ACROSS routes, so it is its own test carrying `@every-route`.

import { test, expect, beforeAll, afterAll } from 'vitest';
import { createServer, type Server } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import type { AddressInfo } from 'node:net';
// puppeteer-core is a DECLARED devDependency (see package.json). It arrives
// transitively through @lhci/cli as well, and STEP-0064 is the reason this file
// does not rely on that: a transitive path can disappear with nothing going red.
import puppeteer, { type Browser } from 'puppeteer-core';

const DIST = 'dist';

/**
 * Every route the site publishes, in the order a reader would meet them, each
 * with the name a card writes down.
 *
 * No two tags may be a substring of one another: the control matches a card's
 * tag against a title with `in`, so `@privacy` would silently select the policy
 * index AND every product policy. Hence `@privacy-index`.
 */
const ROUTES = [
  { path: '/', tag: '@home', name: 'the home page' },
  { path: '/apps/', tag: '@apps', name: 'the catalog' },
  { path: '/apps/sole-focus/', tag: '@sole-focus', name: "Sole Focus's product page" },
  { path: '/apps/magic-notes/', tag: '@magic-notes', name: "Magic Notes's product page" },
  { path: '/about/', tag: '@about', name: 'the about page' },
  { path: '/support/', tag: '@support', name: 'the support page' },
  { path: '/privacy/', tag: '@privacy-index', name: 'the privacy index' },
  { path: '/privacy/sole-focus/', tag: '@privacy-sole-focus', name: "Sole Focus's privacy policy" },
  { path: '/404', tag: '@not-found', name: 'the not-found page' },
] as const;

/** 320 is the narrowest width this site supports; 1440 is the owner's desktop. */
const WIDTHS = [320, 390, 768, 1440] as const;

/** SC 2.5.8 (AA). The floor is 24 CSS px in both axes. */
const TARGET_MIN = 24;

/** `--faint` is the lightest text; nothing on this site is set below this size. */
const TEXT_MIN = 13;

/**
 * The largest step in the band rhythm: `--band-y-loose` caps at 7.5rem = 120px.
 * A gap between two in-flow siblings wider than the largest step is the "void"
 * of CHECKLIST W1 — the reader crosses it and thinks something failed to load.
 */
const GAP_MAX = 120;

/** Where a stock Chrome or Chromium lives, in the order worth trying. */
const CHROME_PATHS = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean) as string[];

function chromePath(): string {
  const found = CHROME_PATHS.find((p) => existsSync(p));
  if (!found) {
    // Never skip. A geometry suite that quietly passes because it could not
    // find a browser is the false green this project refuses.
    throw new Error(
      'No Chrome or Chromium found. Set PUPPETEER_EXECUTABLE_PATH, or install one of:\n  ' +
        CHROME_PATHS.join('\n  '),
    );
  }
  return found;
}

const MIME: Record<string, string> = {
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

/**
 * Serve `dist/` for the life of the suite. A file:// URL will not do: the site
 * links its assets from the site root, which under file:// resolves to the
 * filesystem root. Thirty lines of `node:http` rather than a dev server or a
 * new dependency.
 */
function serveDist(): Promise<{ server: Server; base: string }> {
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
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as AddressInfo;
      resolve({ server, base: `http://127.0.0.1:${port}` });
    });
  });
}

type Box = { w: number; h: number; top: number; left: number };
type Target = Box & { el: string; text: string; exempt: null | 'in-sentence' | 'spacing' };
type Reading = {
  overflowPx: number;
  smallText: Array<{ el: string; fs: number; text: string }>;
  undersizedTargets: Target[];
  rail: { brand: number | null; prose: number | null; footer: number | null };
  titleIndent: number | null;
  unequalRows: Array<{ parent: string; top: number; heights: number[] }>;
  voids: Array<{ parent: string; after: string; before: string; gap: number }>;
  lazyInFirstView: Array<{ src: string; top: number; left: number }>;
  strayHues: Array<{ el: string; hue: string; derived: string }>;
};

/**
 * Runs inside the page. Everything it needs is defined in here — it is
 * serialised to the browser, so it can close over nothing from this file.
 */
const PROBE = (limits: { targetMin: number; textMin: number; gapMax: number }): Reading => {
  const label = (el: Element) => {
    const cls = (el.getAttribute('class') ?? '').split(/\s+/).filter(Boolean).slice(0, 2).join('.');
    return el.tagName.toLowerCase() + (cls ? '.' + cls : '');
  };
  const visible = (el: Element) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none';
  };
  const box = (el: Element) => {
    const r = el.getBoundingClientRect();
    return {
      w: +r.width.toFixed(1),
      h: +r.height.toFixed(1),
      top: +(r.top + window.scrollY).toFixed(1),
      left: +r.left.toFixed(1),
    };
  };
  const round = (n: number) => Math.round(n * 10) / 10;

  const out: Reading = {
    overflowPx: document.documentElement.scrollWidth - window.innerWidth,
    smallText: [],
    undersizedTargets: [],
    rail: { brand: null, prose: null, footer: null },
    titleIndent: null,
    unequalRows: [],
    voids: [],
    lazyInFirstView: [],
    strayHues: [],
  };

  // --- Text size -----------------------------------------------------------
  for (const el of Array.from(document.querySelectorAll('body *'))) {
    if (!visible(el)) continue;
    const ownText = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent!.trim());
    if (!ownText) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < limits.textMin) {
      out.smallText.push({ el: label(el), fs: round(fs), text: el.textContent!.trim().slice(0, 30) });
    }
  }

  // --- Target size (WCAG 2.2 SC 2.5.8) -------------------------------------
  const targets = Array.from(
    document.querySelectorAll('a[href], button, [role="button"], summary, input, select'),
  ).filter(visible);
  const rects = targets.map((el) => el.getBoundingClientRect());
  const undersized = targets
    .map((el, i) => ({ el, i, r: rects[i] }))
    .filter(({ r }) => Math.min(r.width, r.height) < limits.targetMin);

  for (const { el, i, r } of undersized) {
    // Exception 1 — "the target is in a sentence, or its size is otherwise
    // constrained by the line-height of non-target text". Approximated by the
    // parent carrying text of its own around the link.
    const parent = el.parentElement;
    const parentOwnText = parent
      ? Array.from(parent.childNodes)
          .filter((n) => n.nodeType === 3)
          .map((n) => n.textContent!.trim())
          .join('')
      : '';
    if (parentOwnText.length > 0) {
      out.undersizedTargets.push({ ...box(el), el: label(el), text: (el.textContent ?? '').trim().slice(0, 30), exempt: 'in-sentence' });
      continue;
    }

    // Exception 2 — spacing. A 24px-diameter circle centred on this target's
    // bounding box must not intersect another target, nor the circle of
    // another undersized target.
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const radius = limits.targetMin / 2;
    let clear = true;
    for (let j = 0; j < targets.length && clear; j++) {
      if (j === i) continue;
      const o = rects[j];
      const otherUndersized = Math.min(o.width, o.height) < limits.targetMin;
      if (otherUndersized) {
        const ox = o.left + o.width / 2;
        const oy = o.top + o.height / 2;
        if (Math.hypot(cx - ox, cy - oy) < limits.targetMin) clear = false;
      } else {
        const nx = Math.max(o.left, Math.min(cx, o.right));
        const ny = Math.max(o.top, Math.min(cy, o.bottom));
        if (Math.hypot(cx - nx, cy - ny) < radius) clear = false;
      }
    }
    out.undersizedTargets.push({
      ...box(el),
      el: label(el),
      text: (el.textContent ?? '').trim().slice(0, 30),
      exempt: clear ? 'spacing' : null,
    });
  }

  // --- One left rail (CHECKLIST L3) ----------------------------------------
  // The same three roles on every route: the wordmark in the header, the first
  // body paragraph in main, and the first link in the footer.
  const leftOf = (sel: string) => {
    const el = document.querySelector(sel);
    if (!el || !visible(el)) return null;
    return round(el.getBoundingClientRect().left);
  };
  out.rail = { brand: leftOf('header a'), prose: leftOf('main p'), footer: leftOf('footer a') };

  // The page title's own indent from that rail. Six routes start their `h1` on
  // it; the two that lead with the identity lockup start one icon-width plus a
  // gap inboard, which STEP-0061 recorded and the owner asked for. What must
  // not happen is TWO different inboard answers — the product header and the
  // policy header rendering the same lockup at different icon sizes gave 88px
  // and 72px, and only one of those was ever written down (STEP-0081).
  out.titleIndent = (() => {
    const h1 = document.querySelector('main h1');
    const rail = out.rail.prose;
    if (!h1 || !visible(h1) || rail === null) return null;
    return round(h1.getBoundingClientRect().left - rail);
  })();

  // --- Members of a set that share a row share a height (CHECKLIST L1) ------
  // A SET, not any two boxes on one line. L1 is about "cards, tiles and rows
  // that sit side by side" — repeated instances of one thing. A label column
  // beside a content column is two different things by design, and holding it
  // to one height would be asserting a rule the checklist does not make.
  // Members count as one set when they render the same tag and the same class.
  //
  // THE CARD, NOT THE CELL. A grid stretches every item in a row to the row's
  // height, so the list items themselves can never disagree — which is exactly
  // why the STEP-0076 defect went unnoticed: the two `<li>` were identical at
  // 96px while the `.policy-link` INSIDE them measured 96 and 66. So each row
  // is compared at its own level and one level down, where the visible card
  // actually is.
  for (const parent of Array.from(document.querySelectorAll('ul, ol, [class*="grid"]'))) {
    const kids = Array.from(parent.children).filter(visible);
    if (kids.length < 2) continue;
    const byRow = new Map<string, Element[]>();
    for (const k of kids) {
      const key = Math.round(k.getBoundingClientRect().top) + '|' + label(k);
      byRow.set(key, [...(byRow.get(key) ?? []), k]);
    }
    for (const [key, row] of byRow) {
      if (row.length < 2) continue;
      const top = Number(key.split('|')[0]);
      const levels: Array<{ suffix: string; els: Element[] }> = [{ suffix: '', els: row }];
      // One level down, only when every member wraps exactly one element and
      // they are all the same kind of thing.
      const inner = row.map((k) => (k.children.length === 1 ? k.firstElementChild : null));
      if (inner.every((c) => c && visible(c)) && new Set(inner.map((c) => label(c!))).size === 1) {
        levels.push({ suffix: ' > ' + label(inner[0]!), els: inner as Element[] });
      }
      for (const { suffix, els } of levels) {
        const heights = els.map((e) => round(e.getBoundingClientRect().height));
        if (Math.max(...heights) - Math.min(...heights) > 1) {
          out.unequalRows.push({ parent: label(parent) + suffix, top, heights });
        }
      }
    }
  }

  // --- No void wider than the rhythm (CHECKLIST W1) ------------------------
  // In-flow siblings only. Absolutely-positioned overlays — the gallery's
  // arrows and its position chip — sit at arbitrary offsets by design, and
  // the distance between two of them means nothing.
  const inFlow = (el: Element) => {
    const p = getComputedStyle(el).position;
    return p === 'static' || p === 'relative';
  };
  const walk = (parent: Element) => {
    const kids = Array.from(parent.children).filter((k) => visible(k) && inFlow(k));
    for (let i = 1; i < kids.length; i++) {
      const a = kids[i - 1].getBoundingClientRect();
      const b = kids[i].getBoundingClientRect();
      const gap = b.top - a.bottom;
      if (gap > limits.gapMax) {
        out.voids.push({ parent: label(parent), after: label(kids[i - 1]), before: label(kids[i]), gap: round(gap) });
      }
    }
    for (const k of kids) walk(k);
  };
  walk(document.body);

  // --- Nothing already on screen waits to load -----------------------------
  // "On screen" means a quarter of the image is on screen, in BOTH axes.
  //
  // Both axes, because the gallery's later slides share the first slide's top
  // offset while sitting off to the right inside a horizontal scroller, where
  // lazy is exactly right. A quarter, because that scroller deliberately shows
  // a sliver of the next slide — 150px of an 1150px image at 1440px — and
  // fetching a full-width screenshot to stop a 13% edge arriving late is a bad
  // trade. A quarter is the point where an image is something the reader is
  // looking at rather than a hint that one more exists.
  for (const img of Array.from(document.querySelectorAll('img'))) {
    if (!visible(img)) continue;
    const r = img.getBoundingClientRect();
    const visibleW = Math.max(0, Math.min(r.right, window.innerWidth) - Math.max(r.left, 0));
    const visibleH = Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0));
    const onScreen = visibleW >= r.width / 4 && visibleH >= r.height / 4;
    if (onScreen && img.loading === 'lazy') {
      out.lazyInFirstView.push({
        src: (img.currentSrc || img.src).split('/').pop()!.slice(0, 44),
        top: Math.round(r.top),
        left: Math.round(r.left),
      });
    }
  }

  // --- One voice per band (STEP-0083) --------------------------------------
  //
  // `--hue-soft` and `--hue-wash` are made out of `--hue`, and a custom
  // property substitutes its `var()` references on the element that DECLARES
  // it — not on the element that uses it. Declared once on `:root`, both baked
  // in the fallback orange, so every band on the site painted Sole Focus's
  // colour whichever product owned it. DESIGN.md §2 said the opposite, the
  // comment above the rule said the opposite, and nothing looked: the two
  // agreed for eleven months because there was one product.
  //
  // Checked here rather than in `dist.test.ts` because the defect is invisible
  // in the HTML — the band's own `--hue` was right the whole time. Only a
  // browser resolving the cascade can tell you what got painted.
  for (const el of Array.from(document.querySelectorAll('[style*="--hue"]'))) {
    const cs = getComputedStyle(el);
    const hue = cs.getPropertyValue('--hue').trim();
    if (!hue) continue;
    for (const prop of ['--hue-soft', '--hue-wash']) {
      const derived = cs.getPropertyValue(prop).trim();
      if (derived && !derived.toLowerCase().includes(hue.toLowerCase())) {
        out.strayHues.push({ el: label(el), hue, derived: `${prop}: ${derived}` });
      }
    }
  }

  return out;
};

/** route -> width -> reading, plus a coarse-pointer phone pass under `phone`. */
const readings = new Map<string, Record<string, Reading>>();
let server: Server | undefined;
let chrome: Chrome | undefined;

const LIMITS = { targetMin: TARGET_MIN, textMin: TEXT_MIN, gapMax: GAP_MAX };

/** A phone, as a phone sees it — `@media (pointer: coarse)` decides tap sizes. */
const PHONE = {
  viewport: { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true, isLandscape: false },
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
} as const;

/**
 * Headless Chrome detaches the navigating frame intermittently here, whatever
 * the flags — a known puppeteer condition with no upstream fix
 * (puppeteer/puppeteer#12294, #13397; checked 2026-08-04). The remedy is to
 * retry at the SMALLEST unit: one page load. Retrying a whole route means one
 * detach throws away four good readings and the odds of a clean run collapse —
 * measured here, three route-level attempts all failed on the same route.
 * Each reading gets a fresh page and up to four tries.
 */
function launch(): Promise<Browser> {
  return puppeteer.launch({
    executablePath: chromePath(),
    headless: true,
    protocolTimeout: 120_000,
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--force-device-scale-factor=1',
      '--disable-backgrounding-occluded-windows',
    ],
  });
}

/**
 * A browser that can be replaced under the caller. Two failure modes show up
 * here and they need the same answer: the frame detaches mid-read, or the
 * browser's own connection closes on launch. Both are transient, both leave
 * the browser unusable, so a retry that reuses it fails identically — the
 * retry has to be free to start a new one.
 */
class Chrome {
  private browser: Browser | undefined;

  async page(): Promise<import('puppeteer-core').Page> {
    if (!this.browser || !this.browser.connected) {
      await this.close();
      this.browser = await launch();
    }
    return this.browser.newPage();
  }

  async discard(): Promise<void> {
    await this.close();
  }

  async close(): Promise<void> {
    const b = this.browser;
    this.browser = undefined;
    await b?.close().catch(() => {});
  }
}

async function readOnce(chrome: Chrome, url: string, phone: boolean, width?: number): Promise<Reading> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 4; attempt++) {
    let page: import('puppeteer-core').Page | undefined;
    try {
      page = await chrome.page();
      page.setDefaultTimeout(60_000);
      if (phone) await page.emulate(PHONE);
      else await page.setViewport({ width: width!, height: 900, deviceScaleFactor: 1 });
      await page.goto(url, { waitUntil: 'load', timeout: 60_000 });
      await new Promise((r) => setTimeout(r, 400));
      const reading = await page.evaluate(PROBE, LIMITS);
      await page.close().catch(() => {});
      return reading;
    } catch (error) {
      lastError = error;
      await page?.close().catch(() => {});
      // Whatever broke, this browser is not trusted again.
      await chrome.discard();
    }
  }
  throw new Error(
    `could not read ${url} at ${phone ? 'phone' : width} in 4 attempts: ${String(lastError).slice(0, 160)}`,
  );
}

/** One browser per route, replaced on any failure; one fresh page per width. */
async function readRoute(chrome: Chrome, base: string, route: string): Promise<Record<string, Reading>> {
  const per: Record<string, Reading> = {};
  for (const width of WIDTHS) {
    per[String(width)] = await readOnce(chrome, base + route, false, width);
  }
  per.phone = await readOnce(chrome, base + route, true);
  return per;
}

/** Every (route, width) reading as flat rows, so a failure names where it is. */
function each(): Array<{ route: string; width: string; r: Reading }> {
  const rows: Array<{ route: string; width: string; r: Reading }> = [];
  for (const [route, widths] of readings) {
    for (const [width, r] of Object.entries(widths)) rows.push({ route, width, r });
  }
  return rows;
}

beforeAll(async () => {
  if (!existsSync(join(DIST, 'index.html'))) {
    throw new Error('dist/ is missing or empty — run `npm run build` before `npm run test:ui`.');
  }
  const started = await serveDist();
  server = started.server;
  chrome = new Chrome();
  // Every route, every run, whichever screens the card named. One rule below
  // compares routes against each other, and a run that loaded three of them
  // could not check it — so the tags choose which failures a card is answerable
  // for, never which pages get loaded. Reading all nine costs about a minute.
  for (const route of ROUTES) {
    readings.set(route.path, await readRoute(chrome, started.base, route.path));
  }
  // Nothing is read after this point, so the browser goes now rather than
  // waiting on the assertions.
  await chrome.close();
});

afterAll(async () => {
  await chrome?.close();
  server?.close();
});

/**
 * Every rule that can be judged from one page's own readings, as one list of
 * complaints. Each line names the rule before the measurement, because a route's
 * test now reports all of its broken rules together and a bare number would not
 * say which one it came from.
 */
function faults(width: string, r: Reading): string[] {
  const bad: string[] = [];

  if (r.overflowPx > 0) bad.push(`@${width} sideways scroll — ${r.overflowPx}px`);

  for (const t of r.smallText) {
    bad.push(`@${width} text under ${TEXT_MIN}px — ${t.el} ${t.fs}px "${t.text}"`);
  }

  for (const t of r.undersizedTargets.filter((t) => t.exempt === null)) {
    bad.push(`@${width} target under ${TARGET_MIN}px — ${t.el} ${t.w}x${t.h} "${t.text}"`);
  }

  const { brand, prose, footer } = r.rail;
  if (brand === null || prose === null || footer === null) {
    bad.push(`@${width} left rail — a role is missing (${brand}/${prose}/${footer})`);
  } else if (Math.max(brand, prose, footer) - Math.min(brand, prose, footer) > 1) {
    bad.push(`@${width} left rail — brand ${brand}, prose ${prose}, footer ${footer}`);
  }

  for (const u of r.unequalRows) {
    bad.push(`@${width} row heights — ${u.parent} at ${u.top}: ${u.heights.join(' / ')}`);
  }

  for (const v of r.voids) {
    bad.push(`@${width} void wider than ${GAP_MAX}px — ${v.gap}px in ${v.parent} (${v.after} -> ${v.before})`);
  }

  for (const i of r.lazyInFirstView) {
    bad.push(`@${width} lazy image already on screen — ${i.src} at ${i.left},${i.top}`);
  }

  for (const h of r.strayHues) {
    bad.push(`@${width} wrong wash — ${h.el} owns ${h.hue} but has ${h.derived}`);
  }

  return bad;
}

/** Every rule one page can answer for itself, for one route. */
function holdsGeometry(path: string): void {
  const widths = readings.get(path);
  expect(widths, `${path} was never read`).toBeDefined();
  // A route that silently failed to load every width would otherwise pass every
  // rule below by having nothing to measure.
  expect(Object.keys(widths!).sort()).toEqual([...WIDTHS.map(String), 'phone'].sort());

  const bad = Object.entries(widths!).flatMap(([width, r]) => faults(width, r));
  expect(bad).toEqual([]);
}

// ONE TEST PER ROUTE, WRITTEN OUT RATHER THAN GENERATED IN A LOOP.
//
// The tag has to be a literal in the source. `control/loop.py` reads these titles
// with a regex over the file — it never runs the suite to ask what the titles came
// out as — so a generated title like `${route.name} ... ${route.tag}` reads to it
// exactly as written, `@home` appears nowhere, and `check` refuses the card with
// "no screen test carries @home". That is what happened the first time this was
// written; nine plain lines are the fix, and they are greppable besides.
//
// Keep each title's tag in step with the `ROUTES` table above, and with the same
// table in `scripts/capture.mjs`.
test('the home page holds its geometry @home', () => holdsGeometry('/'));
test('the catalog holds its geometry @apps', () => holdsGeometry('/apps/'));
test("Sole Focus's product page holds its geometry @sole-focus", () => holdsGeometry('/apps/sole-focus/'));
test("Magic Notes's product page holds its geometry @magic-notes", () => holdsGeometry('/apps/magic-notes/'));
test('the about page holds its geometry @about', () => holdsGeometry('/about/'));
test('the support page holds its geometry @support', () => holdsGeometry('/support/'));
test('the privacy index holds its geometry @privacy-index', () => holdsGeometry('/privacy/'));
test("Sole Focus's privacy policy holds its geometry @privacy-sole-focus", () => holdsGeometry('/privacy/sole-focus/'));
test('the not-found page holds its geometry @not-found', () => holdsGeometry('/404'));

// The titles above are hand-written, so they can drift from the table they are
// supposed to match — and a tag that quietly stops existing is a screen the
// control can no longer be asked to run. Carries no `@tag` of its own on purpose:
// a tag here would become a tenth screen that opens nothing.
test('every route in the table has a test carrying its tag', () => {
  // Only lines that open a test count — the same place the control looks. Searching
  // the whole file would find every tag in the `ROUTES` table itself and pass while
  // no test carried any of them.
  const titles = readFileSync(new URL(import.meta.url), 'utf-8')
    .split('\n')
    .filter((line) => line.trimStart().startsWith('test('));
  const missing = ROUTES.filter((route) => !titles.some((line) => line.includes(route.tag)));
  expect(missing.map((r) => r.tag)).toEqual([]);
});

// The one rule no single page can answer. Six routes start their `h1` on the
// rail; the two that lead with the identity lockup start one icon-width plus a
// gap inboard, which STEP-0061 recorded and the owner asked for. What must not
// happen is TWO different inboard answers — the product header and the policy
// header rendering the same lockup at different icon sizes gave 88px and 72px,
// and only one of those was ever written down (STEP-0081).
test('every page title starts on the rail or at the one shared lockup indent @every-route', () => {
  // Per width, because the gap inside the lockup is narrower below 30rem.
  const byWidth = new Map<string, Map<number, string[]>>();
  for (const { route, width, r } of each()) {
    if (r.titleIndent === null || r.titleIndent <= 1) continue;
    if (!byWidth.has(width)) byWidth.set(width, new Map());
    const seen = byWidth.get(width)!;
    seen.set(r.titleIndent, [...(seen.get(r.titleIndent) ?? []), route]);
  }
  const bad: string[] = [];
  for (const [width, seen] of byWidth) {
    if (seen.size > 1) {
      const shown = [...seen].map(([indent, routes]) => `${indent}px (${routes.join(', ')})`).join(' vs ');
      bad.push(`@${width}: ${shown}`);
    }
  }
  expect(bad).toEqual([]);
});
