// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import satteriTie from './src/lib/satteri-tie.ts';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/** The wrapping rule's source files, fingerprinted — see `markdown` below. */
const RULE_DIGEST = createHash('sha256')
  .update(['./src/lib/typography.ts', './src/lib/satteri-tie.ts'].map((f) => readFileSync(new URL(f, import.meta.url), 'utf-8')).join('\0'))
  .digest('hex')
  .slice(0, 12);

// Zero-cost, fully static configuration.
// Guardrails (see docs/ARCHITECTURE.md, docs/DEPLOYMENT.md):
//   - output: 'static' ONLY. Do NOT add SSR adapters, server islands,
//     on-demand rendering, or live content collections. Nothing may run in
//     production; GitHub Pages serves the prebuilt `dist/` for free.
//   - No backend, database, serverless, Cloudflare Workers/Pages, or SaaS.
//
// Deployment target: GitHub Pages + Cloudflare-managed custom domain.
//   - Custom domain (apex/www): keep `base: '/'` and set `site` to the domain.
//   - Project page fallback (https://<user>.github.io/<repo>) instead: set
//     `base: '/solo-dev-portfolio-website'`. Documented in docs/DEPLOYMENT.md.
export default defineConfig({
  output: 'static',
  // Live on the custom domain metkapstudio.com (Cloudflare-managed), served at
  // the root. `withBase()` (src/lib/url.ts) becomes a no-op while base is '/'.
  site: 'https://metkapstudio.com',
  base: '/',
  trailingSlash: 'ignore',
  // Every link's page is fetched once it scrolls into view, so a first visit
  // to a page answers from the cache instead of waiting 250–450 ms on the
  // network (issue 0018). The pages are 8–28 KB of HTML each. Astro falls back
  // to fetching on tap for a visitor on data saver or a slow connection, and
  // Safari, which has no `<link rel="prefetch">`, fetches into the HTTP cache
  // that GitHub Pages' 600 s max-age then serves.
  // https://docs.astro.build/en/guides/prefetch/ (read 2026-10-31)
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  build: {
    format: 'directory',
  },
  // The wrapping rule (STEP-0062), applied to every Markdown body at build
  // time through Sätteri's own hast hook — Astro's default pipeline here.
  // Naming the processor explicitly rather than using the deprecated
  // `markdown.rehypePlugins`, which would pull in `@astrojs/markdown-remark`
  // and swap the whole site's Markdown processor back to unified.
  //
  // The plugin's name carries a fingerprint of the rule's own source (issue
  // 0008). Astro's content cache keeps rendered Markdown until the config's
  // serialised form changes, and a function's body never reaches that form, so
  // an edit to `tie()` alone left every product's prose on the old rule. A
  // name is a string, so it does — and only an edit to the rule clears the cache.
  markdown: {
    processor: satteri({ hastPlugins: [{ ...satteriTie, name: `tie-${RULE_DIGEST}` }] }),
  },
  // Content-Security-Policy (STEP-0065).
  //
  // docs/SECURITY.md states the control "no third-party script embeds", and
  // AUDIT-0009 found Cloudflare injecting a beacon into every LIVE page against
  // exactly that control, at the edge, where nothing in this repository could
  // see it. That beacon is gone, but the same thing can happen again from any
  // dashboard setting. This is the one control that makes it break visibly
  // instead of silently.
  //
  // Astro owns `script-src` and `style-src` and emits real sha256 hashes for
  // every bundled script and style, so no `unsafe-inline` is needed and the one
  // inline module (ScreenshotShowcase) keeps working without a hand-maintained
  // hash that would rot the first time it is edited.
  //
  // Delivered as a `<meta http-equiv>`, knowingly second-best: GitHub Pages
  // cannot set headers. Two consequences, both accepted and recorded in
  // docs/SECURITY.md — `frame-ancestors` and `report-uri` are ignored inside a
  // meta element per the CSP spec, and `Content-Security-Policy-Report-Only`
  // cannot be used in one, so this ships enforcing or not at all.
  //
  // Astro's `ClientRouter` is unsupported by its own CSP implementation. Not a
  // problem here: global.css already uses the native `@view-transition` at-rule
  // and records why ClientRouter was deliberately rejected.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        // Astro inlines small images as data: URIs.
        "img-src 'self' data:",
        // System font stack only — nothing is fetched.
        "font-src 'self'",
        // The site makes no requests of its own, embeds nothing, and has no
        // forms. Stated rather than left to `default-src` so that adding one
        // later is a deliberate edit here.
        "connect-src 'self'",
        "frame-src 'none'",
        "object-src 'none'",
        "form-action 'none'",
        "base-uri 'self'",
      ],
      // Inline `style=` attributes, and ONLY those.
      //
      // Measured 2026-08-01: without this, `style-src-attr` falls back to
      // `style-src` and the headless probe recorded violations on 4 of the 8
      // routes — home, catalog, product and per-product privacy. What was
      // blocked is how the Spectrum identity works: `--hue` is set per band as
      // a style attribute (`index.astro`, `ProductBand.astro`,
      // `apps/[slug].astro`), so every product colour on the site would have
      // silently gone back to the achromatic default. That is a defect the
      // policy would have shipped, and the probe is the only reason it did not.
      //
      // Hashes cannot rescue it: the CSP spec excludes style attributes from
      // hash matching unless `'unsafe-hashes'` is set, and the value varies per
      // product anyway. Astro documents `{ resource: "'unsafe-inline'", kind:
      // "attribute" }` as the remedy for exactly this case.
      //
      // `style-src-attr` is a separate directive — this weakens nothing about
      // scripts, which is what the policy exists to control. A style attribute
      // cannot execute code, and the CSS-exfiltration attacks it theoretically
      // enables need an injection point; this site has no user input, no forms
      // and no query handling.
      //
      // `'self'` is restated because `resources` REPLACES Astro's defaults
      // rather than adding to them. Astro's own generated hashes are kept.
      // The two hand-written inline scripts: BaseLayout's `pagereveal`
      // listener (plan 0011), and the `pageswap` skip only the not-found page
      // carries (issue 0017). Astro hashes the scripts it bundles but not one
      // marked `is:inline`, so their hashes are listed here. Edit either script
      // and its line goes stale — `tests/dist.test.ts` ("allows every inline
      // script it ships") fails until the new hash is pasted in.
      scriptDirective: {
        hashes: [
          'sha256-Z1bJ+MdQ8xAkmXhNP5BJRua3hF4CiZMGudpSIXECJhw=',
          'sha256-ykkb2FQVcNkQFoDoNenW8RmbgApRGL6+89mbksOj1Yc=',
        ],
      },
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'default' },
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
  // This project's own port, 5757, for both `astro dev` and `astro preview`.
  //
  // Several projects run a dev server on this machine at once, and Astro's
  // default 4321 is whichever of them started first. Worse, a taken port makes
  // Astro slide quietly to the next free one, which is how a session opens the
  // port it expected, gets the neighbouring project, tests it and reports green.
  //
  // So the number is fixed here rather than passed on a command line, where
  // only the one caller that remembered it would be right, and `strictPort`
  // makes a collision fail loudly instead of moving.
  server: {
    port: 5757,
  },
  vite: {
    server: { strictPort: true },
    preview: { port: 5757, strictPort: true },
    // One stylesheet for every page (smooth-project 0001). Split per page, the
    // product pages carried a 15 KB sheet of their own, and the first one a
    // visitor opened waited a whole extra round trip for it before drawing:
    // +125 ms on a Mac, +460 ms on a throttled phone. Shared, it is fetched once
    // with the first page and every later page draws from the cache.
    build: { cssCodeSplit: false },
  },
  // Build-time only; @astrojs/sitemap emits static XML (no runtime service).
  // The game's old addresses only forward to its new ones, so they stay out.
  integrations: [sitemap({ filter: (page) => !page.includes('/wander-words/') })],
});
