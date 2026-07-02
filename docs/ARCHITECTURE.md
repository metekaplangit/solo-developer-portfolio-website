# Architecture

> **Purpose:** Folder structure, module/layer boundaries, dependency direction, design principles, and fitness checks.
> **Read when:** Adding modules, changing boundaries, or reviewing dependency direction.
> **Update when:** Structure, boundaries, state ownership, patterns, or fitness rules change.
> **Synchronize with:** DATA_STORAGE.md, UI_DESIGN.md, TECH_STACK.md, TESTING.md, SECURITY.md.
> **Status:** Active.
> **Activation:** Standard profile.

## Folder map

```
src/
  content/        # Typed content collections (products, policies) — data layer
  content.config.ts  # Zod schemas = the content contracts (added in STEP-0001)
  layouts/        # Page shells (base, product, policy) — presentation
  components/     # Reusable UI units (cards, badges, nav, footer)
  pages/          # Route files → generated static routes
  lib/            # Pure helpers (formatting, link resolution) — domain logic
  styles/         # Design tokens + global CSS
public/           # Static assets served as-is (icons, screenshots, CNAME)
docs/             # Governance system (this folder)
scripts/          # Governance validator + tooling
```

## Layer boundaries (Ports & Adapters, scaled to a static site)

- **Content/data layer** (`src/content/`, schemas): the single source of product
  and policy facts. Nothing else re-declares product facts.
- **Domain logic** (`src/lib/`): pure, testable functions (e.g. resolve store
  links, pick canonical privacy URL, format dates). No Astro/DOM imports.
- **Presentation** (`layouts/`, `components/`, `pages/`): render validated data.
  Read from content collections + `lib/`; never hardcode product facts.
- **Dependency direction:** presentation → domain → data. Domain never imports
  presentation. This is a fitness rule (see below).

## Design principles (applied pragmatically)

- **Separation of concerns:** data (content), domain (`lib/`), UI (components)
  stay separate. KISS/YAGNI — build the concrete UI first, extract on real reuse
  (rule-of-three-at-two).
- **DRY on product facts:** a product's name, links, and policy live once in the
  content model and are rendered everywhere from there.
- **Testability:** `lib/` functions are pure and unit-tested (see `TESTING.md`).

## Zero-cost guardrails (merge-critical fitness checks)

These are hard architectural constraints enforcing the GitHub-+-Cloudflare-only,
no-third-party constraint:

1. `astro.config.mjs` keeps `output: 'static'`. **Forbidden:** SSR adapters
   (`@astrojs/node`, `@astrojs/vercel`, `@astrojs/cloudflare`, etc.), server
   islands, `export const prerender = false`, live content collections.
2. **Forbidden runtime services/deps:** backend, database, BaaS, serverless,
   Cloudflare Workers/Pages, analytics SaaS, third-party form/comment widgets.
3. No secret, API key, credential, or private data anywhere in the repo or build.
4. Stay inside GitHub Pages limits (≤1 GB site, no large binaries/video in-repo).

A change violating 1–4 is `Needs Repair` and blocks merge. When a fitness-check
script exists (`TOOL_CREATION.md`), these become automated grep/config checks.

## Platform rule

Core/domain logic (`src/lib/`) never calls platform or rendering APIs. Astro
components are the only place that touches Astro/HTML. There are no native
platform adapters in the MVP (pure static web).

## ADR policy

Consequential architecture/storage/deployment decisions get a short ADR under
`docs/decisions/`. First ADR candidate: the static-only + zero-cost contract
(recorded here for the baseline; promote to an ADR if it is ever challenged).
