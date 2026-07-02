# Markdown Consistency Checkpoint MC-OD-0005 (on-demand)

- **Trigger:** On-demand (user wrap-up request). **Does not reset** the scheduled
  cadence (next scheduled Markdown Consistency is due after feature step #16).
- **Reviewed range:** Repository state at `v0.14.0` / commit `bbf76db` (UI polish +
  website privacy scope live).
- **Date:** 2026-07-02.

## Checklist results

| Check | Result | Evidence |
|---|---|---|
| Step/tag/feature agreement | Pass | STATUS `current_step: STEP-0014`, `product_tag: v0.14.0`, `blockers: none`; CHANGELOG `[0.14.0]`; ROADMAP STEP-0014 entry present. |
| Content reality vs docs | Pass | On disk: 1 product (`sole-focus`), 2 policies (`global`, `sole-focus`), icon at `public/media/sole-focus/icon.svg`. Matches STATUS/DATA_STORAGE. |
| Live Git vs STATUS | Pass | `main`, HEAD `bbf76db` == `origin/main`, working tree clean, 0 ahead / 0 behind. |
| Layout/token system documented | Pass | `--maxw-prose` is a commented design-system token in `global.css`; every content page consumes it. |
| Website privacy scope wording | Pass | Main privacy page titled "MetKap Studio Website Privacy Policy"; body + `effectiveScope` scope the website and route apps to their own policies. Consistent with per-product policies and `SECURITY.md`. |
| Read-only source convention | Pass | `../PromodoApp/` recorded read-only; only read/copied **out** for the icon — **0 changes** in that repo. |
| Checkpoint ledger | **Drift → repaired** | CHECKPOINTS.md had not been updated for **MC-0007** (run at step 14); its counters still read "MC after 14 / Enhancement after 14". Repaired in this pass. Also surfaced that **ENH-0002 (Enhancement) was due at step 14 and had not run** — now run (see below). |
| Canonical ownership / append-only | Pass | Historical task cards + checkpoint reports untouched; single milestone headings; no duplicated versions. |

## Findings

Two items of drift, both repaired in this pass:

1. **CHECKPOINTS.md not updated for MC-0007.** The STATUS prose recorded MC-0007,
   but the CHECKPOINTS.md ledger/counters lagged. Added the MC-0007 row and this
   MC-OD-0005 row; corrected the counters.
2. **Missed scheduled Enhancement (ENH-0002).** Enhancement cadence is every 7
   feature steps (ran at #7; due again at #14). The STEP-0014 close ran MC-0007
   but not the Enhancement checkpoint. Run now as
   `docs/enhancements/ENHANCEMENT_ENH-0002.md`; ledger + counters updated.

All other owners (STATUS ↔ ROADMAP ↔ CHANGELOG ↔ VERSION_CONTROL) are in sync at
v0.14.0. No content/code drift.

## Follow-ups

- Next scheduled: **Discussion + Audit after feature step #15**; **Markdown
  Consistency after #16**; **Enhancement after #21**.
