# Testing

> **Purpose:** Test strategy, commands, coverage expectations, and step-completion gates.
> **Read when:** Adding tests, defining Done, or wiring CI checks.
> **Update when:** Tools, commands, coverage, fixtures, or gates change.
> **Synchronize with:** ARCHITECTURE.md, DATA_STORAGE.md, DEPLOYMENT.md, SECURITY.md.
> **Status:** Active.
> **Activation:** Standard profile. Vitest and Lighthouse CI are active.

## Commands (repeatable local + CI gates)

| Check | Command | Gate class |
|---|---|---|
| Static build | `npm run build` | Merge-critical |
| Type + content schema check | `npm run check` (`astro check`) | Merge-critical |
| Governance validator | `python3 scripts/validate-governance.py` | Merge-critical |
| Unit tests (`lib/` + schema) | `npm test` (Vitest — **added in STEP-0001**) | Merge-critical |
| Route/link generation | `npm run build` (sitemap + required static routes) | Merge-critical for release |
| Accessibility check | `npm run lhci` on built pages; threshold enforced in CI/deploy | Merge-critical for user pages |

**Current baseline:** Vitest is active (45 tests at the 2026-07-18 wrap-up) and
Lighthouse CI requires accessibility ≥0.95 on built routes. An unavailable,
crashed, or skipped merge-critical verifier is `Blocked`, never `Pass`.

## Portfolio (risk-based)

Many fast **unit tests** for `src/lib/` (pure functions: link resolution,
canonical privacy URL, date formatting) and **schema tests** (valid, invalid,
missing-field, hostile content fixtures — invalid content MUST fail). A small set
of **build/route smoke** checks (required routes exist) and **accessibility**
checks on rendered pages. No E2E server tests (static site).

## Runner contract

Capture exit status without suppressing output; print failure logs
unconditionally; no false-green. An unavailable/crashed/skipped check is
`Blocked`, never `Pass`.

## Evidence mapping

Every Step acceptance criterion maps to an evidence method (command/log,
automated test, screenshot, or explicit Blocked) before implementation — see each
Task Card's **Evidence method** / **Proof classification** fields.

**Runtime / visual proof:** `npm run preview` on the built `dist/`, then a browser
(or Preview MCP) screenshot per route (home, catalog, product detail, privacy,
support/contact, about; plus a mobile viewport). This is the `manual-runtime` /
`needs-human-runtime` evidence for visual polish and store-reviewer readability
that automated build/route/a11y checks cannot fully cover.

## Definition of Done (per step)

Build + check + governance validator pass; unit/schema tests for new logic pass
(or Blocked with an infra issue); required routes present; accessibility checked
for user-facing pages; docs + STATUS updated; no secrets.
