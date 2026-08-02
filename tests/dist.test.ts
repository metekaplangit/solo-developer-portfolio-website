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

  // An unreleased product must not advertise a purchase. `offers` is emitted
  // from `price`, which Magic Notes deliberately does not set — there is no
  // purchase code in the app and no listing to read a price from.
  it('emits no offer for the unreleased product (STEP-0069)', () => {
    const [, product] = built.find(([r]) => r === '/apps/magic-notes/')!;
    expect(product).not.toContain('"offers"');
    expect(product).toContain('Not yet available');
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
