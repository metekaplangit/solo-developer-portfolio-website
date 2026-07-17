# Markdown Consistency Checkpoint MC-0015

- **Trigger:** Scheduled cadence — due at **feature step 30** (prior: MC-0014 at 28).
- **Reviewed range:** STEP-0029 → STEP-0030 (v0.29.0 → v0.30.0).
- **Date:** 2026-07-17.

## Checklist results

| Check | Result | Notes |
|---|---|---|
| Machine-checked invariants | Pass (post-repair) | At the v0.29.0 push the validator correctly failed (`STEP-0029 missing from ROADMAP.md` — silent doc-edit anchor miss) and main was briefly pushed in that state; repaired in the STEP-0030 merge. Post-merge: product_tag v0.30.0 == git tag == CHANGELOG top; feature count **30** in both owners; validator 43/43. |
| Step/card/ROADMAP agreement | Pass | STEP-0029 + STEP-0030 entries present with per-finding dispositions; cards complete with evidence. |
| Docs ↔ reality | Pass | Live pages verified post-deploy (mobile header, labels, requirements, trust line); claims sourced (App Store listing; Support page). |
| Append-only history | Pass | Additive only; no released sections rewritten. |
| Merge-critical gates | Pass | build 8 / check 0-0-0 / **40 tests** / validator 43/43. |

## Findings

One transient drift (the missing ROADMAP entry) — caught by the validator at
push time, repaired in the same session. No residual drift.

## Follow-ups

- Next scheduled: MC after 32; Discussion after 33; Enhancement + Audit after 35.
