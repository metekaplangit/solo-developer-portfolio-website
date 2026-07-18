# Issue Ledger (pre-remote fallback)

> **Purpose:** Read-only history of issues recorded before GitHub Issues became the owner.
> **Read when:** Tracing LEDGER-001/002 lineage.
> **Update when:** Never; file new findings in GitHub Issues.
> **Synchronize with:** ISSUE_TRACKING.md, STATUS.md.
> **Status:** Retired (read-only history).

## Remote status

GitHub Issues is active at
`metekaplangit/solo-developer-portfolio-website`. Both historical entries below
are resolved. New findings must be filed in GitHub, not appended here.

## Historical entries

- LEDGER-001 | type:technical-debt | priority:low | Product "avatar"
  (icon-or-monogram) block duplicated
  observed: the icon-or-monogram avatar (and monogram computation) appears in
  both `src/components/ProductCard.astro` and `src/pages/apps/[slug].astro`.
  expected: a single shared `ProductAvatar` component.
  evidence: DISC-0001 (F2), AUDIT-0002 (F1). impact: minor duplication; no defect.
  step-or-commit: found STEP-0003, grew at STEP-0010 (icon rendering added to
  both). acceptance: extract a `ProductAvatar.astro` (icon when present, else
  monogram) in a dedicated refactor pass per `REFACTORING.md`.
  status: **RESOLVED at STEP-0015 (v0.15.0)** — `src/components/ProductAvatar.astro`
  now owns the icon-or-monogram lockup; ProductCard, `apps/[slug]`, and the
  privacy header all use it (3 sites unified). Monogram logic removed from the
  call sites.

- LEDGER-002 | type:accessibility | priority:low | No automated a11y / visual
  regression check
  observed: UI correctness (contrast, focus, layout) is verified manually via
  screenshots only; no automated axe/pa11y/Lighthouse gate.
  expected: an automated accessibility check in CI for user-facing pages.
  evidence: AUDIT-0001 (F1). impact: manual checks can miss regressions as the
  UI grows. step-or-commit: found at STEP-0005. acceptance: add a Lighthouse or
  axe/pa11y check (own packet) during the UI phase or launch-hardening.
  status: **RESOLVED at STEP-0017 (v0.17.0)** — Lighthouse CI accessibility gate
  (`lighthouserc.json`; `accessibility` job in `ci.yml`; a11y gate in `deploy.yml`
  before publish) asserts accessibility >=0.95 as an error and blocks regressions.
  Verified green in real CI (PR #1). Visual-regression snapshots not included.

## Entry format

```
- LEDGER-001 | type:<label> | priority:<level> | title
  observed / expected / evidence / impact / step-or-commit / acceptance / status
```
