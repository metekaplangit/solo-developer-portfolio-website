// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import satteriTie from './src/lib/satteri-tie.ts';

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
  build: {
    format: 'directory',
  },
  // The wrapping rule (STEP-0062), applied to every Markdown body at build
  // time through Sätteri's own hast hook — Astro's default pipeline here.
  // Naming the processor explicitly rather than using the deprecated
  // `markdown.rehypePlugins`, which would pull in `@astrojs/markdown-remark`
  // and swap the whole site's Markdown processor back to unified.
  markdown: {
    processor: satteri({ hastPlugins: [satteriTie] }),
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
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'default' },
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
  // Build-time only; @astrojs/sitemap emits static XML (no runtime service).
  integrations: [sitemap()],
});
