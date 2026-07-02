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

_Nothing yet. Next: Milestone 4 — GitHub Pages deployment proof (custom domain, HTTPS)._

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
