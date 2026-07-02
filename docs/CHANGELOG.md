# Changelog

> **Purpose:** Human-readable version history (Keep a Changelog style).
> **Read when:** Cutting a release or reviewing history.
> **Update when:** During versionable packets (finalize Unreleased before tagging).
> **Synchronize with:** VERSION_CONTROL.md, ROADMAP.md, STATUS.md.
> **Status:** Active.
> **Activation:** Standard profile.

All notable, user-relevant changes are documented here. Versioning follows
Semantic Versioning (pre-1.0 `0.MINOR.PATCH`). Internal-only work (docs,
checkpoints, refactors, this initialization) is traceable via Step IDs and
commits and does **not** consume a product version.

## [Unreleased]

_Nothing pending. metkapstudio.com is fully live over HTTPS (cert approved, Enforce HTTPS on). Next packet undecided — see ROADMAP._

## [0.8.0] — 2026-07-02

Custom domain metkapstudio.com (STEP-0008).

### Changed

- Site now targets **metkapstudio.com** at the root: `astro.config` `site` +
  `base: '/'`, `public/CNAME`, `robots.txt`/sitemap on the domain, and
  `support@metkapstudio.com`. `withBase()` is a no-op at root (kept for safety).
- GitHub Pages custom domain set to metkapstudio.com.

### Notes

- **Live HTTPS on the domain is pending user-side Cloudflare DNS + GitHub
  certificate provisioning** (up to 24h) — records and steps in `DEPLOYMENT.md`.
  Enforce HTTPS + domain verification + Cloudflare Email Routing are the
  post-DNS follow-ups. Still fully static.

## [0.7.0] — 2026-07-02

Dark-premium theme rolled across the remaining pages (STEP-0007).

### Changed

- New shared **`PageHeader`** component; consistent headers/spacing on catalog,
  support, and about.
- **Product detail** page polished: elevated header panel, gradient screenshot
  frames, store links as primary/secondary **buttons**, refined metadata.
- **Privacy** policy pages: data-facts now in a subtle bordered panel.
- **Support** page: email is a primary button; two-column guidance.
- The whole site now matches the home page's dark-premium quality.

### Notes

- UI-only — no product/data/logic changes. Enhancement checkpoint ENH-0001
  accepted a real-image pipeline and a11y/Lighthouse CI to the backlog.

## [0.6.0] — 2026-07-02

Rebrand to MetKap Studio (STEP-0006).

### Changed

- The site brand is now **MetKap Studio** — wordmark, page titles, hero, footer,
  and SEO/OpenGraph. Centralized in `src/lib/site.ts` (new `person` field keeps
  the studio brand distinct from the developer's name).
- About page attributes the studio to Mete Kaplan; tagline/description use the
  studio voice.

### Notes

- Future domain **metkapstudio.com** is deferred to the custom-domain step (set
  `site`/`base`/`CNAME`/robots + `support@metkapstudio.com` there). Support email
  stays a placeholder until then. Content-only; no data/logic changes.

## [0.5.0] — 2026-07-02

Dark-premium Apple-minimal design system + home (STEP-0005).

### Changed

- New **"light dark" design system**: elevated graphite surfaces (not black),
  SF Pro type scale, restrained periwinkle accent, hairline borders + soft
  shadows, spacing rhythm, and motion tokens — all in `src/styles/global.css`.
- **Shell** reflects it: translucent sticky header, refined nav pills, footer,
  and badges; new primary/secondary button styles.
- **Home page** redesigned: cinematic hero with accent glow, display type, CTA
  buttons; refined featured grid; elevated product cards with tasteful hover.
- Site is now dark-first (`color-scheme: dark`, theme-color). Other pages inherit
  the new tokens; bespoke per-page polish follows in later steps.

### Notes

- UI-only — no product/data/logic changes. Motion respects
  `prefers-reduced-motion`; contrast meets WCAG AA. Audit AUDIT-0001 (all Pass).

## [0.4.0] — 2026-07-02

Live on GitHub Pages (STEP-0004).

### Added

- Continuous deployment to a **GitHub Pages project site**
  (`https://metekaplangit.github.io/solo-developer-portfolio-website/`) via
  `.github/workflows/deploy.yml` (Actions → Pages, least-privilege).
- `withBase()` link helper (`src/lib/url.ts`) so all internal links resolve under
  the project sub-path; 5 unit tests.

### Changed

- `astro.config.mjs` now targets the Pages project site (`base` + `site`); all
  internal links routed through `withBase()`.
- `robots.txt` sitemap URL points at the project site.

### Notes

- **Custom domain deferred to the end of the project** (user decision). Reverting
  is a documented late step (`site`→domain, `base`→`/`). Still fully static.

## [0.3.0] — 2026-07-02

Core site-completeness essentials (STEP-0003).

### Added

- Custom **404** page linking back to the main sections.
- **`robots.txt`** allowing crawlers and referencing the sitemap.
- Auto-generated **sitemap** (`/sitemap-index.xml`) via `@astrojs/sitemap`
  (build-time only; static XML; MIT).
- **Favicon** (inline SVG) linked from every page.

### Changed

- CI now runs the unit-test suite (`npm test`) as a merge gate (was previously
  not wired) — from Discussion checkpoint DISC-0001.

### Notes

- Sitemap/robots use a placeholder domain until the custom domain is live (M4).
- Still fully static; `@astrojs/sitemap` adds no runtime service. `npm audit`
  clean.

## [0.2.0] — 2026-07-02

Reusable product-detail page pattern (STEP-0002).

### Added

- Per-product detail page at `/apps/<slug>/`, generated for every product,
  rendering identity, platforms, summary, long description, features, store
  links, screenshot placeholders (with alt text), release/updated metadata, and
  canonical privacy + support links.
- "More apps/games" related-products section (same type, self excluded) via a
  new `relatedProducts` helper.
- Home and catalog product cards now link to the detail page.
- Per-product SEO/OpenGraph title + description on detail pages.

### Notes

- Screenshots remain honest placeholders; a real image-optimization pipeline is
  a later packet. Still fully static, no backend or third-party services.

## [0.1.0] — 2026-07-02

First usable slice: the content model and static shell (STEP-0001).

### Added

- Typed content model with Zod validation: **Product, StoreLink,
  PrivacyPolicyEntry, MediaAsset** (`src/content/schema.ts`). Invalid content
  fails the build.
- Astro content collections for products and privacy policies with sample
  content (Aurora Notes, Pixel Drift, Tempo Timer).
- Static shell: base layout, primary nav, footer, and design tokens with light/
  dark support, a skip link, and reduced-motion handling.
- Routes rendering from content: home (featured), Apps & Games catalog, privacy
  overview + per-product privacy routes (`/privacy/<product>/`), support, about.
- Pure, unit-tested domain helpers (`src/lib/`) and a **Vitest** suite
  (25 tests). Basic SEO/OpenGraph metadata per page.

### Notes

- Fully static (`output: 'static'`), no backend or third-party services.
- Project initialized (Milestone 0) on Astro 7.0.5 as an internal baseline
  (no tag); this is the first tagged product version.

---

Released versions are reverse-chronological and append-only.
