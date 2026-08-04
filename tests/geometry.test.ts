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

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer, type Server } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import type { AddressInfo } from 'node:net';
// puppeteer-core is a DECLARED devDependency (see package.json). It arrives
// transitively through @lhci/cli as well, and STEP-0064 is the reason this file
// does not rely on that: a transitive path can disappear with nothing going red.
import puppeteer, { type Browser } from 'puppeteer-core';

const DIST = 'dist';

/** Every route the site publishes, in the order a reader would meet them. */
const ROUTES = [
  '/',
  '/apps/',
  '/apps/sole-focus/',
  '/apps/magic-notes/',
  '/about/',
  '/support/',
  '/privacy/',
  '/privacy/sole-focus/',
  '/404',
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
  unequalRows: Array<{ parent: string; top: number; heights: number[] }>;
  voids: Array<{ parent: string; after: string; before: string; gap: number }>;
  lazyInFirstView: Array<{ src: string; top: number; left: number }>;
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
    unequalRows: [],
    voids: [],
    lazyInFirstView: [],
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

  // --- Members of a set that share a row share a height (CHECKLIST L1) ------
  // A SET, not any two boxes on one line. L1 is about "cards, tiles and rows
  // that sit side by side" — repeated instances of one thing. A label column
  // beside a content column is two different things by design, and holding it
  // to one height would be asserting a rule the checklist does not make.
  // Members count as one set when they render the same tag and the same class.
  for (const parent of Array.from(document.querySelectorAll('ul, ol, [class*="grid"]'))) {
    const kids = Array.from(parent.children).filter(visible);
    if (kids.length < 2) continue;
    const byRow = new Map<string, number[]>();
    for (const k of kids) {
      const r = k.getBoundingClientRect();
      const key = Math.round(r.top) + '|' + label(k);
      byRow.set(key, [...(byRow.get(key) ?? []), round(r.height)]);
    }
    for (const [key, heights] of byRow) {
      if (heights.length < 2) continue;
      if (Math.max(...heights) - Math.min(...heights) > 1) {
        out.unequalRows.push({ parent: label(parent), top: Number(key.split('|')[0]), heights });
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
  // Both axes. The gallery's later slides share the first slide's top offset
  // but sit off to the right inside a horizontal scroller, where lazy is right.
  for (const img of Array.from(document.querySelectorAll('img'))) {
    if (!visible(img)) continue;
    const r = img.getBoundingClientRect();
    const onScreen = r.top < window.innerHeight && r.bottom > 0 && r.left < window.innerWidth && r.right > 0;
    if (onScreen && img.loading === 'lazy') {
      out.lazyInFirstView.push({
        src: (img.currentSrc || img.src).split('/').pop()!.slice(0, 44),
        top: Math.round(r.top),
        left: Math.round(r.left),
      });
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
  for (const route of ROUTES) {
    readings.set(route, await readRoute(chrome, started.base, route));
  }
  // Nothing is read after this point, so the browser goes now rather than
  // waiting on the assertions.
  await chrome.close();
});

afterAll(async () => {
  await chrome?.close();
  server?.close();
});

describe('rendered geometry (docs/CHECKLIST.md)', () => {
  it('reads every route at every width', () => {
    expect(readings.size).toBe(ROUTES.length);
    for (const widths of readings.values()) {
      expect(Object.keys(widths).sort()).toEqual([...WIDTHS.map(String), 'phone'].sort());
    }
  });

  it('no page scrolls sideways', () => {
    const bad = each()
      .filter(({ r }) => r.overflowPx > 0)
      .map(({ route, width, r }) => `${route} @${width}: ${r.overflowPx}px`);
    expect(bad).toEqual([]);
  });

  it('no text is rendered below the size floor', () => {
    const bad = each().flatMap(({ route, width, r }) =>
      r.smallText.map((t) => `${route} @${width}: ${t.el} ${t.fs}px "${t.text}"`),
    );
    expect(bad).toEqual([]);
  });

  it('every target reaches 24px or meets an SC 2.5.8 exception', () => {
    const bad = each().flatMap(({ route, width, r }) =>
      r.undersizedTargets
        .filter((t) => t.exempt === null)
        .map((t) => `${route} @${width}: ${t.el} ${t.w}x${t.h} "${t.text}"`),
    );
    expect(bad).toEqual([]);
  });

  it('the wordmark, the prose and the footer share one left rail', () => {
    const bad: string[] = [];
    for (const { route, width, r } of each()) {
      const { brand, prose, footer } = r.rail;
      if (brand === null || prose === null || footer === null) {
        bad.push(`${route} @${width}: a rail role is missing (${brand}/${prose}/${footer})`);
        continue;
      }
      const spread = Math.max(brand, prose, footer) - Math.min(brand, prose, footer);
      if (spread > 1) bad.push(`${route} @${width}: brand ${brand}, prose ${prose}, footer ${footer}`);
    }
    expect(bad).toEqual([]);
  });

  it('members of a set that share a row share a height', () => {
    const bad = each().flatMap(({ route, width, r }) =>
      r.unequalRows.map((u) => `${route} @${width}: ${u.parent} row at ${u.top} — ${u.heights.join(' / ')}`),
    );
    expect(bad).toEqual([]);
  });

  it('no gap between in-flow siblings is wider than the rhythm', () => {
    const bad = each().flatMap(({ route, width, r }) =>
      r.voids.map((v) => `${route} @${width}: ${v.gap}px in ${v.parent} (${v.after} -> ${v.before})`),
    );
    expect(bad).toEqual([]);
  });

  it('nothing already on screen is left to load lazily', () => {
    const bad = each().flatMap(({ route, width, r }) =>
      r.lazyInFirstView.map((i) => `${route} @${width}: ${i.src} at ${i.left},${i.top}`),
    );
    expect(bad).toEqual([]);
  });
});
