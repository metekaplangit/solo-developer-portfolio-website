# Markdown Consistency Checkpoint MC-OD-0007 (on-demand)

- **Trigger:** On-demand (user wrap-up request). **Does not reset** the scheduled
  cadence (next scheduled Markdown Consistency after feature step #22).
- **Reviewed range:** Repository state at `v0.21.0` / commit `3a2666d`
  (code-review remediation). No new feature step since v0.21.0.
- **Date:** 2026-07-03.

## Checklist results

| Check | Result | Evidence |
|---|---|---|
| Step/tag/feature agreement | Pass | STATUS `current_step: STEP-0021`, `product_tag: v0.21.0`, `dirty: false`, `due_checkpoints: none`, `blockers: none`; CHANGELOG `[0.21.0]`; CHECKPOINTS feature count 21. |
| Content reality vs docs | Pass | On disk: 1 product (`sole-focus`), 2 policies (`global`, `sole-focus`), icon at `public/media/sole-focus/icon.svg`. Matches STATUS/DATA_STORAGE. |
| Live Git vs STATUS | Pass | `main`, HEAD `3a2666d` == `origin/main`, working tree clean, 0 ahead / 0 behind, only `main` (feature branches + PR #2 merged/pruned). HEAD on tag `v0.21.0`. |
| Checkpoint ledger | Pass | DISC-0007 + ENH-0003 logged at step 21 across CHECKPOINTS, ROADMAP, STATUS + their own reports; no scheduled checkpoint due until step 22 (MC). |
| Code-review remediation recorded | Pass | STEP-0021 (redundant-link a11y fix + ProductAvatar de-dup) reflected in STATUS, CHANGELOG, ROADMAP, Task Card; a11y-safety verified via the Lighthouse CI gate (PR #2) and noted. |
| No stale tag/step drift | Pass | No doc still references STEP-0020 / v0.20.0 as current. |
| Read-only source convention | Pass | `../PromodoApp/` recorded read-only; unchanged. |
| Canonical ownership / append-only | Pass | Historical task cards + checkpoint reports untouched; single milestone headings; no duplicated versions. |

## Findings

**No drift requiring repair.** All current-state owners agree at v0.21.0. The
code-review remediation is consistently recorded and its accessibility safety is
documented as gate-verified.

## Follow-ups

- Next scheduled: **Markdown Consistency after feature step #22**; **Discussion
  after #24**; **Audit after #25**; **Enhancement after #28**.
- Highest-value next packet (per ENH-0003): **real Sole Focus screenshots +
  device mockups** — top of the roadmap, blocked on user-exported assets.
