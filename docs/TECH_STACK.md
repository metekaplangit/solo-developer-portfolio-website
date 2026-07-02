# Tech Stack

> **Purpose:** Selected technologies, exact verified versions, compatibility, rejected alternatives, licensing, and verification status.
> **Read when:** Adding a dependency, changing a version, or evaluating compatibility.
> **Update when:** A component, version, platform, dependency, or compatibility assumption changes.
> **Synchronize with:** ARCHITECTURE.md, DATA_STORAGE.md, DEPLOYMENT.md, SECURITY.md, EXTERNAL_EDITOR.md.
> **Status:** Active.
> **Activation:** Standard profile.

## Intake answers (from project-idea package)

1. **Build:** premium minimal solo-developer portfolio + store-support website.
2. **Platforms:** static responsive web via GitHub Pages + Cloudflare domain.

## Selected stack (verified 2026-07-02)

| Component | Choice | Version | Source | License |
|---|---|---|---|---|
| Framework | Astro (static output) | **7.0.5** (stable, Jun 2026) | docs.astro.build/upgrade-astro | MIT |
| Language | TypeScript | ^5.6 | typescriptlang.org | Apache-2.0 |
| Content validation | Zod via `astro/zod` (content collections) | bundled with Astro 7 | docs.astro.build | MIT |
| Runtime (build) | Node.js | 24.16 LTS (Astro 7 needs ≥22.12) | nodejs.org | MIT-like |
| Type/content check | `@astrojs/check` | ^0.9 (dev only) | npm | MIT |
| Hosting | GitHub Pages (static) | n/a | docs.github.com/pages | — |
| Domain / DNS | Cloudflare Registrar + DNS | n/a | developers.cloudflare.com/registrar | — |

`yaml` is pinned via `overrides` to `^2.8.3` to clear GHSA-48c2-rrv3-qjmp in the
dev-only YAML language server. Verified: `npm audit` → 0 vulnerabilities.

### Verification evidence

- `node -p "require('./node_modules/astro/package.json').version"` → `7.0.5`.
- `npm run build` → `output: "static"`, `dist/index.html` generated, exit 0.
- `npm audit` → `found 0 vulnerabilities`.
- Astro 7 version confirmed against docs.astro.build/en/upgrade-astro
  (latest release v7.0.5), accessed 2026-07-02.

## Why Astro 7

- Typed **content collections + Zod** enforce the required deterministic content
  contracts (Product / StoreLink / PrivacyPolicyEntry / MediaAsset) at build.
- **Static output** → plain HTML/CSS/JS for free GitHub Pages hosting; near-zero
  JS by default = fast, accessible, store-reviewer friendly.
- MDX suits per-product privacy policy prose.
- v7 adds **coding-agent detection, background dev server, structured JSON logs**
  — strong AI-assisted maintenance fit for Claude Code.
- Rust compiler + Vite 8/Rolldown → 15–61% faster builds (well inside GH Pages'
  10-min build timeout).

## Zero-cost / no-third-party contract

Hard constraint: **GitHub + Cloudflare only.** `output: 'static'` is pinned.
Forbidden (merge-critical, enforced in ARCHITECTURE.md): SSR adapters, server
islands, on-demand rendering, live content collections, backend, database, BaaS,
serverless, Cloudflare Workers/Pages, analytics SaaS, third-party form/comment
services. Only recurring cost is the domain (Cloudflare at-cost).

## Five-option Stage 2 comparison

| Option | Version | Schema fit | GH Pages fit | AI fit | Verdict |
|---|---|---|---|---|---|
| **Astro 7** | 7.0.5 | Excellent (Zod) | Excellent | Excellent+ | **Selected** |
| Eleventy | 3.1.6 | Manual | Excellent | Good | Rejected — no typed schema layer |
| Next.js | 16.2.7 | Manual (React+Zod) | OK (export) | Good | Rejected — heaviest toolchain |
| SvelteKit | 2.57 + adapter-static 3.0.10 | Manual | Good | Good | Rejected — more moving parts |
| Hugo | 0.158.0 | Front-matter only | Excellent | Lower (Go) | Rejected — least AI-idiomatic |

Rejected: prerelease Astro/Eleventy v4 alphas (not stable). No older-version
exception is in use — all pins are current stable.

## Public compatibility contract (pre-1.0)

Covers: generated route URLs (privacy/support stability), content schema shape,
and static build output. Breaking any of these after 1.0 is a MAJOR change
(see `VERSION_CONTROL.md`).
