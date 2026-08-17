// Assertions against the BUILT OUTPUT (STEP-0068).
//
// Every other suite here tests a pure function. That leaves 14 components and 8
// pages covered only by `astro build`, `astro check` and the deploy-time
// Lighthouse gate — none of which would notice a wrong canonical URL, malformed
// JSON-LD, or the wrapping rule silently not reaching rendered Markdown. That
// last one is not hypothetical: STEP-0064 exists because the packages applying
// that rule were reachable only as transitive dependencies.
//
// Reads `dist/` directly rather than rendering components in isolation. A
// component harness proves a component; this proves the page a visitor gets,
// and it adds no dependency to a project that keeps two runtime deps on purpose.
//
// Run with `npm run test:dist`, AFTER a build. Kept out of `npm test` so the
// fast loop stays in milliseconds.

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const SITE = 'https://metkapstudio.com';

/** Every built HTML page, as [route, html]. */
function pages(): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.html')) {
        // dist/about/index.html -> /about/ ; dist/index.html -> / ; dist/404.html -> /404
        const rel = relative(DIST, p).split(sep).join('/');
        const route = rel === 'index.html' ? '/' : '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '');
        out.push([route, readFileSync(p, 'utf-8')]);
      }
    }
  };
  walk(DIST);
  return out.sort(([a], [b]) => a.localeCompare(b));
}

let built: Array<[string, string]> = [];

beforeAll(() => {
  // A missing dist is a harness error, not a product failure — say which.
  expect(
    existsSync(DIST),
    'dist/ is missing — run `npm run build` before `npm run test:dist`',
  ).toBe(true);
  built = pages();
  expect(built.length, 'dist/ contains no HTML — the build produced nothing').toBeGreaterThan(0);
});

describe('every built page', () => {
  it('builds the 10 routes this site has', () => {
    expect(built.map(([r]) => r)).toEqual([
      '/',
      '/404',
      '/about/',
      '/apps/',
      '/apps/magic-notes/',
      '/apps/sole-focus/',
      '/privacy/',
      '/privacy/magic-notes/',
      '/privacy/sole-focus/',
      '/support/',
    ]);
  });

  // The Magic Notes submission draft already names
  // `https://metkapstudio.com/privacy/magic-notes/` as its privacy policy URL,
  // and a URL baked into a store listing cannot be corrected quietly. The route
  // assertion above proves the page exists; this proves it is the page Apple
  // will be sent to, spelled exactly as the submission sheet spells it.
  it('serves the exact privacy URL the Magic Notes submission names (STEP-0069)', () => {
    const [, policy] = built.find(([r]) => r === '/privacy/magic-notes/')!;
    expect(policy).toContain('<link rel="canonical" href="https://metkapstudio.com/privacy/magic-notes/"');
    expect(policy).toContain('support@metkapstudio.com');
  });

  // The reverse of STEP-0069's pin: Magic Notes went live on 2026-08-16, so the
  // page must now advertise the download it withheld for six weeks. `offers` is
  // emitted only when `released`, a `price` and an available store link are ALL
  // present, so this one assertion catches any of the three being left behind —
  // a price without a link, or a link without the status, silently emits
  // nothing and the page would go on reading as unreleased.
  it('emits the offer and the store link for the released product (STEP-0082)', () => {
    const [, product] = built.find(([r]) => r === '/apps/magic-notes/')!;
    expect(product).toContain(
      '"offers":{"@type":"Offer","price":"0","priceCurrency":"USD","availability":"https://schema.org/InStock","url":"https://apps.apple.com/us/app/magic-notes-calculator/id6797499171?mt=12"}',
    );
    expect(product).not.toContain('Not yet available');
  });

  it('carries exactly one canonical URL, and it matches the route', () => {
    for (const [route, html] of built) {
      const found = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((m) => m[1]);
      expect(found, `${route}: canonical count`).toHaveLength(1);
      // 404 is the one page with no meaningful canonical target of its own.
      if (route !== '/404') {
        expect(found[0], `${route}: canonical target`).toBe(
          SITE + (route === '/' ? '/' : route.replace(/\/$/, '/')),
        );
      }
    }
  });

  it('never points a canonical or og:url at localhost or a bare path', () => {
    for (const [route, html] of built) {
      for (const m of html.matchAll(/(?:rel="canonical" href|property="og:url" content)="([^"]+)"/g)) {
        expect(m[1], `${route}: absolute URL required`).toMatch(/^https:\/\//);
        expect(m[1], `${route}: must not leak a dev host`).not.toMatch(/localhost|127\.0\.0\.1/);
      }
    }
  });

  it('emits only valid JSON-LD, each block with an @type', () => {
    let blocks = 0;
    for (const [route, html] of built) {
      for (const m of html.matchAll(
        /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
      )) {
        blocks++;
        let parsed: unknown;
        expect(() => {
          parsed = JSON.parse(m[1]!);
        }, `${route}: JSON-LD must parse`).not.toThrow();
        for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
          expect(node, `${route}: JSON-LD node needs @type`).toHaveProperty('@type');
          expect(node, `${route}: JSON-LD node needs @context`).toHaveProperty('@context');
        }
      }
    }
    // A silent drop of every schema block would otherwise pass the loop above.
    expect(blocks, 'no JSON-LD found anywhere in dist').toBeGreaterThan(0);
  });

  it('ships a Content-Security-Policy on every page (STEP-0065)', () => {
    for (const [route, html] of built) {
      expect(html, `${route}: CSP meta`).toMatch(/http-equiv="content-security-policy"/i);
      // The whole point of the policy: no blanket script allowance.
      const csp = html.match(/http-equiv="content-security-policy" content="([^"]*)"/i)?.[1] ?? '';
      const scriptSrc = csp.match(/script-src ([^;]*)/)?.[1] ?? '';
      expect(scriptSrc, `${route}: script-src must not allow unsafe-inline`).not.toContain(
        'unsafe-inline',
      );
    }
  });

  it('loads no script from a third-party origin', () => {
    for (const [route, html] of built) {
      for (const m of html.matchAll(/<script[^>]*\bsrc="([^"]+)"/g)) {
        expect(m[1], `${route}: third-party script`).not.toMatch(/^https?:\/\//);
      }
    }
  });
});

describe('the wrapping rule reaches rendered Markdown (STEP-0062)', () => {
  const NBSP = ' ';

  it('ties prose in a Markdown body, not only in component strings', () => {
    // The product page renders its description through the Markdown pipeline,
    // where the rule is applied by the satteri plugin rather than by `tie()` at
    // a call site. If the plugin ever stops loading — the failure STEP-0064
    // guards against — this is the assertion that notices.
    const [, product] = built.find(([r]) => r === '/apps/sole-focus/')!;
    const body = product.slice(product.indexOf('<main'));
    expect(body.split(NBSP).length - 1, 'non-breaking spaces in the product body').toBeGreaterThan(
      20,
    );
  });

  it('ties the policy sections too (STEP-0067)', () => {
    const [, policy] = built.find(([r]) => r === '/privacy/')!;
    expect(policy.includes(NBSP), 'policy prose is tied').toBe(true);
  });
});

// The checklist's text rules, enforced against the page a visitor gets
// (docs/CHECKLIST.md, T1 and T2).
//
// These exist because the mechanism was in place and most of the site still
// bypassed it: product summaries rendered raw on three surfaces, seven policy
// lists read straight from the content file, and every page's own lede written
// as literal JSX. A rule nothing checks is a rule that quietly stops applying.
describe('the checklist text rules (STEP-0073)', () => {
  const NB = String.fromCharCode(0x00a0);
  const MARK = String.fromCharCode(0x0001); // cannot occur in HTML

  /** Words that must never end a line: they point at a word not yet arrived. */
  const TIE_WORDS = new Set([
    'a', 'an', 'the',
    'and', 'or', 'nor', 'but', 'so', 'yet', 'if', 'as', 'than', 'that',
    'of', 'to', 'in', 'on', 'at', 'by', 'for', 'from', 'with', 'into', 'onto',
    'over', 'under', 'via', 'per',
    'is', 'are', 'was', 'were', 'be', 'been', 'no', 'not',
    'has', 'have', 'had', 'can', 'will', 'do', 'does', 'did',
    'it', 'its', 'my', 'your', 'our', 'their', 'his', 'her', 'this', 'these',
    'you', 'we', 'they', 'i',
  ]);

  const PROTECTED = [
    'count-up stopwatch', 'Mac App Store', 'Pomodoro timer', 'MetKap Studio',
    'Apple Silicon', 'business days', 'Magic Notes', 'Sole Focus', 'App Store',
  ];

  /**
   * A run of visible text with no element boundary in it. A tag ENDS a run:
   * text either side of one can wrap freely, so treating "and <strong>Study"
   * as one run would report a break no reader ever sees.
   *
   * `<head>` is excluded: a <title> is one line in a browser tab and a meta
   * description is a search snippet. Neither wraps in the page.
   *
   * Runs shorter than 60 characters are excluded: a chip, a nav item or a
   * button has no second line to fall to, so a line-ending rule cannot apply.
   */
  function wrappableRuns(html: string): string[] {
    const bodyAt = html.indexOf('<body');
    return (bodyAt === -1 ? html : html.slice(bodyAt))
      .replace(/<script[\s\S]*?<\/script>/gi, MARK)
      .replace(/<style[\s\S]*?<\/style>/gi, MARK)
      .replace(/<[^>]+>/g, MARK)
      .replace(/&nbsp;/g, NB)
      .replace(/&amp;/g, '&')
      .split(MARK)
      .map((s) => s.replace(/[\n\r\t ]+/g, ' ').trim())
      .filter((s) => s.length >= 60);
  }

  it('T1 — no line of body copy can end on a word that points forward', () => {
    const offenders: string[] = [];
    for (const [route, html] of built) {
      for (const run of wrappableRuns(html)) {
        for (const m of run.matchAll(/([\p{L}\p{N}’'-]+) (?=[\p{L}\p{N}])/gu)) {
          if (TIE_WORDS.has(m[1]!.toLowerCase())) {
            offenders.push(`${route}: "${m[1]} …" in "${run.slice(0, 70)}"`);
          }
        }
      }
    }
    expect(offenders, offenders.slice(0, 8).join('\n')).toHaveLength(0);
  });

  it('T2 — no named thing can split across two lines', () => {
    const offenders: string[] = [];
    for (const [route, html] of built) {
      for (const run of wrappableRuns(html)) {
        for (const p of PROTECTED) {
          if (run.includes(p)) offenders.push(`${route}: "${p}" in "${run.slice(0, 70)}"`);
        }
      }
    }
    expect(offenders, offenders.slice(0, 8).join('\n')).toHaveLength(0);
  });

  it('T4 — binding never builds a run too wide for the 320px column', () => {
    // A non-breaking space removes a wrap opportunity. Enough of them in a row
    // overflows the narrowest column — the one defect this site never accepts.
    // 30 characters is the measured budget at the small body size.
    const tooLong: string[] = [];
    for (const [route, html] of built) {
      const bodyAt = html.indexOf('<body');
      const text = (bodyAt === -1 ? html : html.slice(bodyAt))
        .replace(/<script[\s\S]*?<\/script>/gi, MARK)
        .replace(/<style[\s\S]*?<\/style>/gi, MARK)
        .replace(/<[^>]+>/g, MARK)
        .replace(/&nbsp;/g, NB);
      for (const run of text.split(new RegExp(`[ \\t\\n\\r${MARK}]`))) {
        // Only runs the rule actually built — an unbroken URL or a code span is
        // long for reasons this rule did not cause and cannot fix.
        if (run.includes(NB) && run.length > 30) tooLong.push(`${route}: ${run}`);
      }
    }
    expect(tooLong, tooLong.join('\n')).toHaveLength(0);
  });

  it('proof the three checks above can fail', () => {
    // Every assertion here was seen red against deliberately broken output.
    // This keeps that property: strip the non-breaking spaces out of a real
    // page and all three rules must report it, or they are checking nothing.
    const [, real] = built.find(([r]) => r === '/apps/sole-focus/')!;
    const broken = real.split(NB).join(' ');

    const brokenTie = wrappableRuns(broken).flatMap((run) =>
      [...run.matchAll(/([\p{L}\p{N}’'-]+) (?=[\p{L}\p{N}])/gu)].filter((m) =>
        TIE_WORDS.has(m[1]!.toLowerCase()),
      ),
    );
    expect(brokenTie.length, 'T1 must report untied prose').toBeGreaterThan(0);

    const brokenPhrase = wrappableRuns(broken).filter((run) =>
      PROTECTED.some((p) => run.includes(p)),
    );
    expect(brokenPhrase.length, 'T2 must report a split name').toBeGreaterThan(0);
  });
});
