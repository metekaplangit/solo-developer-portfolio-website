# Issue Ledger (pre-remote fallback)

> **Purpose:** Temporary durable issue record until GitHub Issues is the owner of record.
> **Read when:** Filing/triaging an issue before the remote is live, or backfilling IDs after.
> **Update when:** Any finding is discovered, triaged, or closed pre-remote.
> **Synchronize with:** ISSUE_TRACKING.md, STATUS.md.
> **Status:** Active (fallback).

## Remote status

**GitHub remote push planned immediately after baseline (user-authorized).** Once
GitHub Issues exist, entries here are backfilled with issue IDs/links and this
ledger becomes read-only history. This fallback must not be carried past the
first maintained release (see `ISSUE_TRACKING.md`).

## Open entries

- LEDGER-001 | type:technical-debt | priority:low | Monogram logic duplicated
  (2 uses)
  observed: the initials/monogram computation appears in
  `src/components/ProductCard.astro` and `src/pages/apps/[slug].astro`.
  expected: a single shared helper once a third use appears.
  evidence: DISC-0001 (F2). impact: minor duplication; no defect.
  step-or-commit: found at STEP-0003. acceptance: extract a `monogram()` helper
  into `src/lib/` on the third use (rule-of-three per `REFACTORING.md`).
  status: open (watch — do not extract yet at 2 uses).

## Entry format

```
- LEDGER-001 | type:<label> | priority:<level> | title
  observed / expected / evidence / impact / step-or-commit / acceptance / status
```
