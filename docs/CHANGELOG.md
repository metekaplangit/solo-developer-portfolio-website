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

_Nothing yet. Next: Milestone 2 — premium minimal product showcase (STEP-0002)._

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
