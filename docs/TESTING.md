# Testing

> **Purpose:** Test strategy, commands, coverage expectations, and step-completion gates.
> **Read when:** Adding tests, defining Done, or wiring CI checks.
> **Update when:** Tools, commands, coverage, fixtures, or gates change.
> **Synchronize with:** ARCHITECTURE.md, DATA_STORAGE.md, DEPLOYMENT.md, SECURITY.md.
> **Status:** Active.
> **Activation:** Standard profile. Test runner is added in STEP-0001 (see gate below).

## Commands (repeatable local + CI gates)

| Check | Command | Gate class |
|---|---|---|
| Static build | `npm run build` | Merge-critical |
| Type + content schema check | `npm run check` (`astro check`) | Merge-critical |
| Governance validator | `python3 scripts/validate-governance.py` | Merge-critical |
| Unit tests (`lib/` + schema) | `npm test` (Vitest — **added in STEP-0001**) | Merge-critical |
| Link check | build-time / CI link check (STEP-0003+) | Merge-critical for release |
| Accessibility check | axe/pa11y on built pages (STEP-0002+) | Merge-critical for user pages |

**Baseline status:** `npm test` is **Blocked** until STEP-0001 adds Vitest and
the first `lib/`/schema units. This is recorded in `STATUS.md`. A merge-critical
verifier blocked for a second consecutive packet forces a dedicated
verification packet before more versionable work.

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

## Definition of Done (per step)

Build + check + governance validator pass; unit/schema tests for new logic pass
(or Blocked with an infra issue); required routes present; accessibility checked
for user-facing pages; docs + STATUS updated; no secrets.
