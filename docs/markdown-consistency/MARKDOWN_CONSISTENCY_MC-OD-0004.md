# Markdown Consistency Checkpoint MC-OD-0004 (on-demand)

- **Trigger:** On-demand (user wrap-up request). **Does not reset** the scheduled
  cadence (next scheduled Markdown Consistency is due after feature step #12).
- **Reviewed range:** Repository state at `v0.10.0` / commit `a0a5441` (Sole Focus
  live, placeholders removed).
- **Date:** 2026-07-02.

## Checklist results

| Check | Result | Evidence |
|---|---|---|
| Step/tag/feature agreement | Pass | STATUS `current_step: STEP-0010`, `product_tag: v0.10.0`, `blockers: none`; CHANGELOG `[0.10.0]`; CHECKPOINTS feature count 10; ROADMAP Milestone 7. |
| Content reality vs docs | Pass | On disk: 1 product (`sole-focus`), 2 policies (`global`, `sole-focus`); icon at `public/media/sole-focus/icon.svg`. Matches STATUS/CHANGELOG/DATA_STORAGE. |
| Live Git vs STATUS | Pass | `main`, HEAD `a0a5441` == `origin/main`, clean, only `main` branch. |
| Checkpoint ledger | Pass | AUDIT-0002 + MC-0005 logged at step 10; none due until step 12. |
| Read-only source convention | Pass | `../PromodoApp/` recorded read-only; verified **0 changes** in that repo. |
| Issues | Pass | LEDGER-001 (avatar dup, ripe) + LEDGER-002 (a11y CI) reflected in STATUS + LEDGER. |
| Canonical ownership / append-only | Pass | Historical task cards (STEP-0001/0002) and checkpoint reports legitimately reference the former placeholder products — not rewritten (append-only preserved). |

## Findings

**No drift requiring repair.** The remaining `aurora-notes`/`pixel-drift`/
`tempo-timer` strings are (a) **synthetic test fixtures** (arbitrary product ids
in `schema.test.ts` / `privacy.test.ts` — they reference no content files) and
(b) **historical records** (append-only task cards / reports). Both are correct
to leave. The live product content is fully consistent with the docs.

## Follow-ups

- Optional tidy (non-blocking): rename synthetic test-fixture ids away from the
  old placeholder names for clarity; leave historical reports untouched.
- Next scheduled: Discussion + Markdown Consistency after feature step #12.
