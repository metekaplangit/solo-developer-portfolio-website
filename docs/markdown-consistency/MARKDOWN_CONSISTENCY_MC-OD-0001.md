# Markdown Consistency Checkpoint MC-OD-0001 (on-demand)

- **Trigger:** On-demand (user wrap-up request). **Does not reset** the scheduled
  every-2-feature-step cadence (next scheduled MC is due after feature step #6).
- **Reviewed range:** Repository state at `v0.4.0` / commit `239035a` (after
  STEP-0004).
- **Date:** 2026-07-02.

## Checklist results

| Check | Result | Evidence |
|---|---|---|
| Current step / next step agreement | Pass | STATUS `current_step: STEP-0004`, `next_step: STEP-0005`; ROADMAP shows STEP-0005 as next; CHECKPOINTS "next feature step: STEP-0005". |
| Latest tag agreement | Pass | STATUS `product_tag: v0.4.0`; CHANGELOG latest `## [0.4.0]`; `git tag` → v0.1.0..v0.4.0; VERSION_CONTROL/STATUS name v0.4.0 as latest. |
| Feature-step count | Pass | CHECKPOINTS = 4 (STEP-0001..0004); matches completed merged packets. |
| Live-state vs docs | Pass | Live Git: branch `main`, HEAD `239035a` == `origin/main`, clean worktree; matches STATUS machine block (`branch: main`, `dirty: false`, remote in sync). |
| Canonical ownership; no duplicated workflow | Pass | Standard Workflow only in ROADMAP; deploy details only in DEPLOYMENT.md; others link. |
| Unique milestone headings | Pass | ROADMAP M0–M5 each appear once (previous duplicate-M3 drift from MC-0001 stays fixed). |
| Referenced reports/task cards exist | Pass | STEP-0001..0004 task cards, MC-0001/MC-0002, DISC-0001 all present. |
| Validator command recorded | Pass | Present in STATUS (×3), AI_WORKFLOW, and CI workflow. |
| Checkpoint ledger accurate | Pass | MC-0001 (step2), DISC-0001 (step3), MC-0002 (step4) logged; none due now. |
| Open issues synchronized | Pass | LEDGER-001 (monogram dup, low) reflected in STATUS Issues + LEDGER. |

## Findings

- **MC-OD-0001-F1 (repaired):** ROADMAP Milestone 2 was still labelled
  *"(in progress)"* though its step is complete and visual polish moved to the
  UI/Design phase. Relabelled to "core DONE (v0.2.0)" with a pointer to the UI
  phase.

No other drift. Documentation is synchronized and a future AI session can resume
from `STATUS.md` alone.

## Follow-ups

- None blocking. Next scheduled checkpoint: **Audit** after feature step #5.
