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
import { createHash } from 'node:crypto';
import { ROUTES, builtFile } from '../scripts/routes.mjs';
import { markdownToHtml } from 'satteri';
import satteriTie from '../src/lib/satteri-tie';

const DIST = 'dist';
const SITE = 'https://metkapstudio.com';

/** Old addresses that only forward, as [from, to]. Their canonical is `to`. */
const MOVED: Array<[string, string]> = [
  ['/apps/wander-words/', '/apps/waypost-words/'],
  ['/privacy/wander-words/', '/privacy/waypost-words/'],
];

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
  // The route table every check reads (`scripts/routes.mjs`). A page the build
  // makes and the table lacks is a page the screen suite, the captures and the
  // live tier all skip without a word — which is how `/privacy/magic-notes/` and
  // both Waypost Words pages went unchecked (evaluate-project 0001).
  it('lists every page the build makes in the one route table, and nothing it does not', () => {
    const forwards = MOVED.map(([from]) => from);
    expect(built.map(([r]) => r)).toEqual(
      [...ROUTES.map((r) => r.path), ...forwards].sort((a, b) => a.localeCompare(b)),
    );
    for (const route of ROUTES) {
      expect(existsSync(join(DIST, builtFile(route.path))), route.path).toBe(true);
    }
  });

  it('has every check that covers every page read that table, and keep no list of its own', () => {
    for (const file of ['tests/screens/site.spec.ts', 'scripts/capture.mjs', 'scripts/live.mjs']) {
      const source = readFileSync(file, 'utf-8');
      expect(source, file).toMatch(/import \{[^}]*\bROUTES\b[^}]*\} from '[./]*\/?(scripts\/)?routes\.mjs'/);
      expect(source, file).not.toMatch(/\bconst ROUTES\b/);
    }
  });

  // The game was Wander Words until 2026-09-22, and a build of it already links
  // to the old addresses. Each one must send a visitor straight on to the new
  // page, point search engines there, and stay out of the index and sitemap.
  it('forwards the old Wander Words addresses to the Waypost Words pages', () => {
    for (const [from, to] of MOVED) {
      const [, html] = built.find(([r]) => r === from)!;
      expect(html, from).toContain(`<meta http-equiv="refresh" content="0; url=${to}">`);
      expect(html, from).toContain(`<link rel="canonical" href="${SITE}${to}"`);
      expect(html, from).toContain('<meta name="robots" content="noindex">');
      expect(html, from).toContain(`href="${to}"`);
    }
    const sitemap = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf-8');
    expect(sitemap).toContain(`${SITE}/apps/waypost-words/`);
    expect(sitemap).not.toContain('wander-words');
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

  // Waypost Words went live on 2026-10-26. Its pages are the addresses the
  // shipped game carries, so they stay pinned; and the page now advertises the
  // download it withheld, the way STEP-0082's pin does for Magic Notes — the
  // offer needs `released`, a price and an available link all at once.
  it('serves the Waypost Words pages the game links to, with its App Store offer', () => {
    const [, policy] = built.find(([r]) => r === '/privacy/waypost-words/')!;
    expect(policy).toContain('<link rel="canonical" href="https://metkapstudio.com/privacy/waypost-words/"');
    expect(policy).toContain('support@metkapstudio.com');
    const [, product] = built.find(([r]) => r === '/apps/waypost-words/')!;
    expect(product).toContain('<link rel="canonical" href="https://metkapstudio.com/apps/waypost-words/"');
    expect(product).toContain(
      '"offers":{"@type":"Offer","price":"0","priceCurrency":"USD","availability":"https://schema.org/InStock","url":"https://apps.apple.com/us/app/waypost-words/id6817343620"}',
    );
    expect(product).toContain('href="https://apps.apple.com/us/app/waypost-words/id6817343620"');
    expect(product).not.toContain('Not yet available');
  });

  // Once every product is out, no page may still talk as if one were coming:
  // the game's own pages, Apps & Games, and Home. Its band on Apps & Games
  // carries the App Store button. Home features whatever was released last,
  // so the game's text there is checked too.
  it('says Waypost Words is out wherever it appears', () => {
    const text = (route: string) =>
      built.find(([r]) => r === route)![1].replace(/ |&nbsp;|&#160;/g, ' ');
    for (const route of ['/', '/apps/', '/apps/waypost-words/', '/privacy/waypost-words/']) {
      expect(text(route), route).not.toMatch(
        /not on the App Store yet|Not yet available|check back soon|In development|in the meantime|as it is built for|on its way|in beta, and planned/i,
      );
    }
    expect(text('/apps/')).toContain('href="https://apps.apple.com/us/app/waypost-words/id6817343620"');
  });

  // No app or game collects data: every policy's `dataCollected` is empty. The
  // privacy overview's lead said some did — the same false line review 0001
  // took off the studio policy, in the one place it was left.
  it('never says an app collects data when none does', () => {
    const [, overview] = built.find(([r]) => r === '/privacy/')!;
    expect(overview.replace(/ |&nbsp;|&#160;/g, ' ')).not.toMatch(/apps collect data/i);
  });

  // The studio never states what a product lacks (STUDIO.md, 10 September
  // 2026). The policy keeps only the answers Apple asks every policy to give —
  // what data, if any, and who it is shared with (5.1.1(i)).
  it("states Waypost Words' data answers without listing what the game lacks", () => {
    const [, raw] = built.find(([r]) => r === '/privacy/waypost-words/')!;
    const policy = raw.replace(/ |&nbsp;|&#160;/g, ' ');
    expect(policy).toContain('No data collected');
    expect(policy).toContain('No third-party sharing');
    expect(policy).not.toContain('No account needed');
    expect(policy).not.toContain('What we never collect');
    expect(policy).not.toMatch(/no analytics|no advertising|no purchases|without connecting|no account to delete/i);
  });

  // Review 0001 (control/cards/apps-games-and-the-studio-privacy-policy-say-
  // only-what-is-tr/): with a game in development on Apps & Games,
  // "everything the studio has shipped" was false, as was "its own support
  // page" (there is one support page) and the site-wide policy's "some of
  // them do collect data" (none does).
  it('claims nothing untrue about the products on Apps & Games or the studio policy', () => {
    const text = (route: string) =>
      built.find(([r]) => r === route)![1].replace(/ |&nbsp;|&#160;/g, ' ');
    expect(text('/apps/')).not.toMatch(/has shipped|own support page/);
    expect(text('/privacy/')).not.toContain('some of them do collect data');
  });

  // Phone captures are portrait. In the Mac-shaped carousel they were squashed
  // to 2880:1800, so a portrait product gets the phone rail: every capture in
  // one track, four in view on a wide screen, arrows to the rest.
  it('puts every Waypost Words phone capture in the phone rail, with arrows', () => {
    const [, product] = built.find(([r]) => r === '/apps/waypost-words/')!;
    expect(product).toContain('class="phone-track');
    expect([...product.matchAll(/class="phone-img/g)]).toHaveLength(10);
    expect(product).toContain('aria-label="Next screenshots"');
    expect(product).toContain('aria-label="Previous screenshots"');
    expect(product).not.toContain('class="track');
    const [, sole] = built.find(([r]) => r === '/apps/sole-focus/')!;
    expect(sole).toContain('class="track');
    expect(sole).not.toContain('class="phone-track');
  });

  // The story opens on its claim and the maker's note follows it — in the page,
  // not only on screen. CSS `order` would move the picture and leave a screen
  // reader and the Tab key on the note first (MDN, `order`, 2026-04-20).
  it("opens every product story on its claim, before the maker's note, in reading order", () => {
    const dir = 'src/content/products';
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
      const slug = file.replace(/\.md$/, '');
      const [, html] = built.find(([r]) => r === `/apps/${slug}/`)!;
      const story = html.slice(html.indexOf('class="story"'));
      const body = readFileSync(join(dir, file), 'utf8').split(/^---$/m).slice(2).join('---');
      const opensOnParagraph = !body.trimStart().startsWith('#');
      const lead = story.indexOf('story-lead');
      const note = story.indexOf('class="maker-note');
      const rest = story.search(/class="prose story-prose"/);
      expect(lead > -1, `${slug}: a story that opens on a paragraph sets it as the claim`).toBe(opensOnParagraph);
      if (lead > -1) expect(lead, `${slug}: the claim comes before the sections`).toBeLessThan(rest);
      if (note > -1) expect(note, `${slug}: the note comes after the claim and before the sections`).toBeGreaterThan(lead);
      if (note > -1) expect(note).toBeLessThan(rest);
    }
  });

  // Owner's call, 2026-09-29: a mobile product shows its first two phone
  // captures side by side on Apps & Games; the Mac products keep one window.
  it('shows two phone captures for a mobile game on Apps & Games', () => {
    const [, apps] = built.find(([r]) => r === '/apps/')!;
    const band = apps.slice(apps.indexOf('class="band-phones'));
    expect(apps).toContain('href="/apps/waypost-words/" aria-label="Open Waypost Words"');
    expect(band.slice(0, band.indexOf('</a>')).match(/<img /g)).toHaveLength(2);
    expect(apps.match(/class="band-shot"/g)).toHaveLength(2);
  });

  it('describes the studio as more than Mac software', () => {
    // Read through the wrapping rule's non-breaking spaces.
    const home = built.find(([r]) => r === '/')![1].replace(/\u00a0/g, ' ');
    expect(home).not.toContain('native Mac software');
    expect(home).not.toContain('not wrapped from something else');
    expect(home).toContain('for Mac, iPhone and iPad');
    // The hero's button names the store of whatever was released last — the
    // Mac App Store for a Mac app, the App Store for an iPhone game.
    expect(home).toMatch(/>\s*(?:Mac )?App Store\s*</);
  });

  it('carries exactly one canonical URL, and it matches the route', () => {
    for (const [route, html] of built) {
      const found = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((m) => m[1]);
      expect(found, `${route}: canonical count`).toHaveLength(1);
      // 404 is the one page with no meaningful canonical target of its own.
      const moved = MOVED.find(([from]) => from === route);
      if (moved) {
        expect(found[0], `${route}: canonical points at the new page`).toBe(SITE + moved[1]);
      } else if (route !== '/404') {
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

  it('allows every inline script it ships, by hash (plan 0011)', () => {
    // An inline script the policy does not hash is refused by the browser and
    // fails silently — the page still loads, the behaviour just never happens.
    // Astro hashes its own bundled scripts; one written `is:inline` (the
    // `pagereveal` listener in BaseLayout) is hashed by hand in
    // astro.config.mjs, and this is what notices when the two drift apart.
    let inline = 0;
    for (const [route, html] of built) {
      const csp = html.match(/http-equiv="content-security-policy" content="([^"]*)"/i)?.[1] ?? '';
      const scriptSrc = csp.match(/script-src ([^;]*)/)?.[1] ?? '';
      for (const m of html.matchAll(/<script(?![^>]*\b(?:\bsrc=|type="application\/ld\+json"))[^>]*>([\s\S]*?)<\/script>/g)) {
        inline++;
        const hash = `'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`;
        expect(scriptSrc, `${route}: inline script not allowed by CSP: ${m[1].slice(0, 60)}`).toContain(hash);
      }
    }
    expect(inline, 'no inline script found anywhere in dist').toBeGreaterThan(0);
  });

  it('names nothing twice for a view transition (plan 0011)', () => {
    // Two elements with one view-transition-name on the same page make the
    // browser skip the whole transition — silently, the page just cuts. The
    // product icons are named per product, so a second icon of the same
    // product given \`travel\` on one page is exactly this fault.
    let icons = 0;
    for (const [route, html] of built) {
      const names = [...html.matchAll(/view-transition-name:\s*([\w-]+)/g)].map((m) => m[1]);
      const twice = names.filter((n, i) => names.indexOf(n) !== i);
      expect(twice, `${route}: view-transition-name used twice`).toEqual([]);
      icons += names.filter((n) => n.startsWith('icon-')).length;
    }
    expect(icons, 'no travelling product icon anywhere in dist').toBeGreaterThan(0);
  });

  it('gives the current-page pill to the current nav item alone (plan 0011)', () => {
    // The pill carries one view-transition-name, so a page with two pills
    // cuts instead of transitioning, and a pill outside the current item
    // glides to the wrong place.
    let pills = 0;
    for (const [route, html] of built) {
      const nav = html.match(/<ul class="nav-list[\s\S]*?<\/ul>/)?.[0] ?? '';
      const all = nav.match(/class="nav-pill\b/g) ?? [];
      const inCurrent = nav.match(/aria-current="page"[^>]*>\s*<span class="nav-pill\b/g) ?? [];
      const current = nav.match(/aria-current="page"/g) ?? [];
      expect(all.length, `${route}: pills in the nav`).toBe(current.length);
      expect(inCurrent.length, `${route}: pill outside the current item`).toBe(all.length);
      expect(current.length, `${route}: current nav items`).toBeLessThanOrEqual(1);
      pills += all.length;
    }
    expect(pills, 'no current-page pill anywhere in dist').toBeGreaterThan(0);
  });

  // smooth-project 0001: product pages had a stylesheet of their own, so the first
  // product page a visitor opened waited one more round trip before it could draw
  // (+125 ms on a Mac, +460 ms on a throttled phone). One shared set means only the
  // first page of a visit ever waits for CSS.
  it('links the same stylesheets on every page, so no page change waits for new CSS', () => {
    const sets = built.map(([route, html]) => [
      route,
      [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]).sort().join(' '),
    ]);
    const first = sets[0][1];
    expect(first, 'the build linked no stylesheet').not.toBe('');
    for (const [route, set] of sets) expect(set, route).toBe(first);
  });

  // Issue 0004. Apple's App Store marketing guidelines: "Don't use the standalone
  // Apple logo" and "Use only the badge artwork provided". Every Download button
  // carries the studio's own mark instead, on every page that shows one.
  it("never draws Apple's logo, and every Download button carries the studio's mark", () => {
    let buttons = 0;
    for (const [route, html] of built) {
      expect(html, `${route}: the Apple logo path`).not.toMatch(/M17\.05 12\.54|apple-mark/);
      expect(html, `${route}: the Apple glyph character`).not.toContain('');
      for (const m of html.matchAll(/<a[^>]*class="[^"]*\bdownload-btn\b[^"]*"[^>]*>([\s\S]*?)<\/a>/g)) {
        buttons++;
        expect(m[1], `${route}: a Download button without the studio's mark`).toMatch(/<svg[^>]*class="get-mark"/);
      }
    }
    expect(buttons, 'no Download button was found to check').toBeGreaterThan(0);
  });

  // Issue 0017. Chrome never keeps a 404 response in its back-forward cache, and
  // a view transition out of a page it cannot keep held the next page's first
  // frame for about 380 ms. The not-found page skips its transition on leaving,
  // and it is the only page that does: everywhere else the hand-off stays.
  it('skips the view transition when leaving the not-found page, and only there', () => {
    const SKIP = /addEventListener\('pageswap',[^<]*skipTransition\(\)/;
    for (const [route, html] of built) {
      if (route === '/404') expect(html, `${route}: no pageswap skip`).toMatch(SKIP);
      else expect(html, `${route}: skips its view transition`).not.toMatch(SKIP);
    }
    expect(built.some(([route]) => route === '/404'), 'the build made no /404 page').toBe(true);
  });

  it('loads no script from a third-party origin', () => {
    for (const [route, html] of built) {
      for (const m of html.matchAll(/<script[^>]*\bsrc="([^"]+)"/g)) {
        expect(m[1], `${route}: third-party script`).not.toMatch(/^https?:\/\//);
      }
    }
  });
});

describe('the studio icons', () => {
  /** A PNG's width and height, read from its IHDR chunk. */
  const pngSize = (path: string): [number, number] => {
    const b = readFileSync(join(DIST, path));
    return [b.readUInt32BE(16), b.readUInt32BE(20)];
  };

  it('serves every icon a page or the manifest names at the size it declares', () => {
    const declared: Array<[string, number]> = [];
    for (const [, html] of built) {
      for (const m of html.matchAll(/<link rel="(?:icon|apple-touch-icon)" href="\/([^"]+\.png)"(?: sizes="(\d+)x\d+")?/g)) {
        declared.push([m[1], m[2] ? Number(m[2]) : m[1] === 'apple-touch-icon-180.png' ? 180 : NaN]);
      }
    }
    const manifest = JSON.parse(readFileSync(join(DIST, 'site.webmanifest'), 'utf-8'));
    for (const icon of manifest.icons) declared.push([icon.src.replace(/^\//, ''), Number(icon.sizes.split('x')[0])]);
    expect(declared.length).toBeGreaterThan(3);
    for (const [path, size] of declared) {
      expect(pngSize(path), path).toEqual([size, size]);
    }
  });

  // Link previews crop to about 1.91:1. A square preview lost the top and bottom
  // of the gem once the mark grew to 79% of its tile (2026-10-28).
  it('serves the link preview at 1200x630, so no site crops the mark', () => {
    for (const [route, html] of built) {
      const m = html.match(/<meta property="og:image" content="https:\/\/metkapstudio\.com\/([^"]+)"/);
      expect(m, `${route}: og:image`).not.toBeNull();
      expect(pngSize(m![1]), route).toEqual([1200, 630]);
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

  // Issue 0008: Astro's content cache kept prose rendered with an older rule,
  // and every check stayed green — T1 below carries its own copy of the words,
  // so a word added to `tie()` never reached it either. This renders each
  // Markdown body afresh with today's plugin and holds its visible text against
  // the page a visitor gets, so a build that reused old prose cannot pass.
  it('renders every Markdown body with the rule as it stands today (issue 0008)', async () => {
    const MARK = String.fromCharCode(0x0001);
    const text = (h: string) =>
      h
        .replace(/<[^>]+>/g, MARK)
        .replace(/&nbsp;/g, NBSP)
        .replace(/&amp;/g, '&')
        .split(MARK)
        .map((s) => s.replace(/[\n\r\t ]+/g, ' ').trim())
        .filter(Boolean)
        .join('|');
    const bodies: Array<[string, string, RegExp]> = [
      ...readdirSync('src/content/products').map((f): [string, string, RegExp] => [
        `src/content/products/${f}`,
        `/apps/${f.replace(/\.md$/, '')}/`,
        /<div class="prose story-prose[^"]*"[^>]*>([\s\S]*?)<\/div>/g,
      ]),
      ...readdirSync('src/content/policies').map((f): [string, string, RegExp] => [
        `src/content/policies/${f}`,
        f === 'global.md' ? '/privacy/' : `/privacy/${f.replace(/\.md$/, '')}/`,
        /<div class="policy-lead"[^>]*>([\s\S]*?)<\/div>/g,
      ]),
    ].filter(([src]) => src.endsWith('.md'));
    expect(bodies.length, 'Markdown bodies found').toBeGreaterThanOrEqual(7);
    for (const [src, route, holder] of bodies) {
      const md = readFileSync(src, 'utf-8').replace(/^---[\s\S]*?\n---\n/, '');
      const { html } = await markdownToHtml(md, {
        hastPlugins: [satteriTie],
        features: { gfm: true, smartPunctuation: true },
      } as never);
      const page = built.find(([r]) => r === route);
      expect(page, `${route} is built`).toBeDefined();
      const shown = [...page![1].matchAll(holder)].map((m) => m[1]).join('');
      expect(text(shown), `${route} (${src}) was rendered with an older rule`).toBe(text(html));
    }
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
        // U+2011 joins a word exactly as `-` does: "built‑in" is one word, and
        // its "in" is not a preposition waiting for the next line.
        for (const m of run.matchAll(/([\p{L}\p{N}’'\u2011-]+) (?=[\p{L}\p{N}])/gu)) {
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
      [...run.matchAll(/([\p{L}\p{N}’'\u2011-]+) (?=[\p{L}\p{N}])/gu)].filter((m) =>
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

// The Spectrum swap retired the graphite ground #16171b for --bg, but the
// gallery arrows kept it hardcoded as rgba(22, 23, 27, 0.78) (issue 0005), so a
// palette change never reached them. Every stylesheet and page a visitor loads
// must take that ground from the tokens, in any spelling the minifier emits.
describe('the retired graphite ground', () => {
  const RETIRED = /#16171b(?:[0-9a-f]{2})?\b|rgba?\(\s*22\s*,\s*23\s*,\s*27\b|rgba?\(\s*22\s+23\s+27\b/i;

  it('is gone from every built stylesheet and page', () => {
    const css = readdirSync(join(DIST, '_astro'))
      .filter((name) => name.endsWith('.css'))
      .map((name): [string, string] => [`_astro/${name}`, readFileSync(join(DIST, '_astro', name), 'utf-8')]);
    expect(css.length, 'the build emitted no stylesheet').toBeGreaterThan(0);
    for (const [where, text] of [...css, ...built]) {
      expect(text.match(RETIRED)?.[0], where).toBeUndefined();
    }
  });
});

// `.panel-accent` washes its corner with `--hue-soft`, and a page that sets no
// `--hue` gets the fallback — Sole Focus's orange — on a surface no product owns
// (issue 0009: the Support and About contact panels). Studio pages stay
// colourless, so a page that draws an accent panel must be a page a product owns.
describe('the accent panel', () => {
  it('appears only on a page whose product sets its hue', () => {
    const wrong = built
      .filter(([, html]) => /class="[^"]*\bpanel-accent\b/.test(html))
      .filter(([, html]) => !/style="[^"]*--hue:\s*#[0-9a-f]{3,8}/i.test(html))
      .map(([route]) => route);
    expect(wrong, 'pages wearing the fallback hue on an accent panel').toEqual([]);
  });
});

describe('newest release first (owner, 2026-10-29)', () => {
  // Whatever the studio published last takes first place on every page, and the
  // rest follow by release date. Read from the product files themselves, so a
  // new release reorders the site and this test with no one editing either.
  const releases = readdirSync('src/content/products')
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const text = readFileSync(join('src/content/products', f), 'utf-8');
      const field = (k: string) => text.match(new RegExp(`^${k}:\\s*"?([^"\\n]+)"?`, 'm'))?.[1]?.trim();
      return { slug: field('slug') ?? f.replace(/\.md$/, ''), status: field('status'), date: field('releaseDate') };
    })
    .filter((p) => p.status === 'released' && p.date)
    .sort((a, b) => (b.date! < a.date! ? -1 : b.date! > a.date! ? 1 : 0))
    .map((p) => p.slug);

  /** The products a page links to inside <main>, in the order a reader meets them. */
  const order = (route: string): string[] => {
    const html = built.find(([r]) => r === route)?.[1] ?? '';
    const main = html.match(/<main[\s\S]*<\/main>/)?.[0] ?? '';
    const seen: string[] = [];
    for (const m of main.matchAll(/href="\/(?:apps|privacy)\/([\w-]+)\/"/g)) {
      if (releases.includes(m[1]) && !seen.includes(m[1])) seen.push(m[1]);
    }
    return seen;
  };

  it('has released products to order', () => {
    expect(releases.length).toBeGreaterThan(1);
  });

  it('features the newest release on the home page', () => {
    expect(order('/')[0], 'home spotlight').toBe(releases[0]);
  });

  for (const route of ['/apps/', '/support/', '/privacy/']) {
    it(`lists every release newest first on ${route}`, () => {
      expect(order(route)).toEqual(releases);
    });
  }
});

describe('every policy names what it covers (issue 0020)', () => {
  // One component renders the website's own policy and every product's, so a
  // fixed sentence in it speaks for all of them. Each policy's "What we collect"
  // row must name the same thing the rest of that policy names — "This website"
  // on the studio's own, the product's subject on a product's — never a word
  // that fits none of them.
  const plain = (html: string) =>
    html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;| /g, ' ').replace(/&#39;|&#x27;|’/g, "'").replace(/\s+/g, ' ');
  const policies = () => built.filter(([, html]) => html.includes('What we collect'));

  it('has policies to check', () => {
    expect(policies().length).toBeGreaterThan(1);
  });

  it("names the policy's own subject in the What we collect row", () => {
    const wrong: string[] = [];
    for (const [route, html] of policies()) {
      const text = plain(html);
      const subject = text.match(/(This \w+) isn't directed at children/)?.[1];
      const row = text.match(/What we collect (.{0,120})/)?.[1] ?? '';
      if (/\bthis product\b/i.test(text)) wrong.push(`${route}: says "this product"`);
      // A policy that rewrote its children section names itself in its own
      // words there, so only the "this product" check above applies to it.
      if (subject && row.startsWith('Nothing.') && !row.startsWith(`Nothing. ${subject} `)) {
        wrong.push(`${route}: "${row.slice(0, 50)}" against "${subject}"`);
      }
    }
    expect(wrong).toEqual([]);
  });
});
