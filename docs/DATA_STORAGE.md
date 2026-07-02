# Data & Storage

> **Purpose:** Data storage strategy, content model/schema, validation, and migration rules.
> **Read when:** Defining or changing the content model, schemas, or content files.
> **Update when:** Storage, schema, content shape, or validation changes.
> **Synchronize with:** ARCHITECTURE.md, SECURITY.md, TESTING.md, DEPLOYMENT.md, UI_DESIGN.md.
> **Status:** Active.
> **Activation:** Standard profile. Database/backend sections are N/A (see triggers).

## Strategy

**No database, no backend, no runtime storage.** All content is **typed files in
the repo**, read at build time via **Astro content collections** and validated
by **Zod schemas**. This is the simplest durable choice for a static site and
satisfies the zero-cost / no-third-party constraint.

- Local/test/production content are the same committed files (no environments to
  separate; no user data).
- No cookies, local storage, or client persistence in the MVP.

## Content model (schemas defined in `src/content.config.ts` — STEP-0001)

Contracts from `project-idea/02-pages-and-content-model.md`. Zod enforces them at
build; invalid content **fails the build loudly**.

- **Product:** `id, name, slug, type(app|game), status(planned|in-development|
  beta|released|archived), summary, longDescription, platforms[], storeLinks[],
  supportUrl, privacyPolicyUrl, screenshots[], icon, features[], releaseDate,
  lastUpdated, seo`.
- **StoreLink:** `store, url, status, countryOrRegionLimit?, notes?`.
- **PrivacyPolicyEntry:** `productId, title, lastUpdated, dataCollected[],
  dataUse[], dataNotCollected[], thirdPartyServices[], storedLocally[],
  permissions[], retention (REQUIRED), hasAccounts, contact, effectiveScope,
  reviewStatus`. Supports one global policy + per-product entries. `retention` is
  required (Apple 5.1.1(i)); `dataUse`/`hasAccounts` map to Apple's "uses of data"
  and in-app account-deletion (5.1.1(v)). `storedLocally[]`/`permissions[]` render
  as bullet sections. `PolicyArticle` presents these as an at-a-glance chip strip
  + separated headlined sections. See `SECURITY.md` and `UI_DESIGN.md`.
- **MediaAsset:** `id, productId, type(icon|screenshot|hero|logo|press), path,
  altText, dimensions, source, licenseOrOwnership`.

## Content rules

- Product facts declared **once**; pages render from the model (see ARCHITECTURE).
- Every image requires `altText`. External links carry a label + review status.
- Store links may be absent for unreleased products; the UI shows honest
  placeholders.
- Privacy/support URLs must be **stable** (no fragile query params).

## Validation & tests

- Build-time: Zod schema validation via content collections; `astro check`.
- Unit tests cover schema edge cases and `lib/` link/policy resolution (TESTING).
- A deliberately invalid fixture must fail validation (negative test).

## Migration

Content-shape changes use expand → migrate → contract: add optional field →
backfill content files → make required. Record schema changes here and in
`CHANGELOG.md` when they affect the public content contract.

## N/A sections (activation triggers)

- **Database / ORM / backups / RPO-RTO:** N/A — no database. *Trigger:* any Step
  Packet introducing durable server-side or user data (would activate the
  data/recovery overlay and escalate the profile).
- **Privacy of user data:** N/A — the site collects **no** user data. Only public
  developer-provided content is stored. *Trigger:* adding a contact form,
  analytics, or accounts (each a separate security/privacy-reviewed packet).
