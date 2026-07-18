# Solo Developer Portfolio Website

> **Purpose:** Product identity, target users, original intent, platforms, and how to use these docs.
> **Read when:** First contact with the repo, or when product intent/platforms/profile change.
> **Update when:** Product intent, platforms, profile summary, or documentation entry points change.
> **Synchronize with:** STATUS.md, ROADMAP.md, TECH_STACK.md.
> **Status:** Active.
> **Activation:** Standard profile. Commercial/compliance overlay armed for privacy/store-support pages.

## Product

A **static-first, premium-minimal personal website** for a solo app and game
developer. It does two jobs at once:

1. Showcase apps and games beautifully (home, catalog, per-product detail pages).
2. Provide stable, login-free **privacy / support / contact / about** URLs that
   app-store reviewers and users can rely on.

The site renders from a **validated content model** (never scattered facts),
stays **backend-free and data-collection-free** for the MVP, and is designed to
be maintained mostly through **Claude Code**.

## Target users

- App-store / platform reviewers opening privacy and support URLs.
- Potential users evaluating the apps and games.
- The solo developer maintaining the site with AI assistance.
- Secondary: press, collaborators, testers, other developers.

## Platforms & hosting

- Static responsive web: desktop, mobile, tablet browsers.
- **GitHub Pages** static hosting + **Cloudflare**-managed custom domain.
- **Zero recurring cost except the domain.** No backend, DB, serverless, CMS,
  accounts, payments, analytics, or ads in the MVP. See `TECH_STACK.md`.

## Selected stack

Astro 7 (static output) + TypeScript + Zod content collections. Details and the
full five-option comparison live in `TECH_STACK.md`.

## Operating profile

**Standard Profile** with a **commercial/compliance overlay** trigger for the
privacy/store-support pages (clear, practical language — never legal advice).

## How to use these docs (startup order)

1. `STATUS.md` — live state and the exact next action.
2. `ROADMAP.md` — ordered Step Packets and the one Standard Workflow.
3. `CHECKPOINTS.md` — due/completed checkpoint ledger.
4. Then the current step's owner docs (e.g. `ARCHITECTURE.md`, `UI_DESIGN.md`,
   `DATA_STORAGE.md`, `DEPLOYMENT.md`).
5. `SOURCE_MAP.md` to locate files without loading everything.

Root `CLAUDE.md` is the short AI handoff and points here. The canonical
ownership map is in `AI_WORKFLOW.md` / this file's siblings — one owner per rule.

## Milestone map

| Milestone | Focus | Status |
|---|---|---|
| M0 | Starter initialization + baseline | Complete |
| M1 | Content model + static shell | Complete (STEP-0001) |
| M2 | Premium minimal product showcase | Complete; continuing polish shipped through STEP-0043 |
| M3 | Store-support pages (privacy/support/about) | Complete and live |
| M4 | GitHub Pages deployment proof | Complete; custom domain live behind Cloudflare |
| M5 | Custom domain | Complete; metkapstudio.com live |
| M6 | App Store review readiness | Complete |
| M7 | Real product growth | Active; Sole Focus released, next product owner-driven |
