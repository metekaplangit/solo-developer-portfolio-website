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

_None._ No actionable bug, regression, security, or blocked-check finding is open
at baseline. (`npm test` being unavailable until STEP-0001 is a **planned scope
item**, not a defect — tracked in `STATUS.md` blockers and `TESTING.md`.)

## Entry format

```
- LEDGER-001 | type:<label> | priority:<level> | title
  observed / expected / evidence / impact / step-or-commit / acceptance / status
```
