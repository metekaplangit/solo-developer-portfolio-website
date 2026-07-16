# Markdown Consistency Checkpoint MC-0014

- **Trigger:** Scheduled cadence — Markdown Consistency every 2 completed feature
  Steps; due at **feature step 28** (STEP-0028). Prior: MC-0013 at 26.
- **Reviewed range:** STEP-0027 → STEP-0028 (v0.27.0 → v0.28.0).
- **Date:** 2026-07-15.

## Checklist results

| Check | Result | Notes |
|---|---|---|
| Machine-checked invariants | Pass | `sync.*` validator checks green post-tag: product_tag v0.28.0 == git tag == CHANGELOG top; feature count **28** in STATUS + CHECKPOINTS (validator 43/43). |
| Step/task-card traceability | Pass | STEP-0027 and STEP-0028 each have frozen Task Cards with evidence; ROADMAP entries COMPLETE; CHANGELOG releases [0.27.0]/[0.28.0] match tags. |
| Canonical ownership | Pass | Download CTA is one component (`DownloadButton.astro`) rendered from the single product content file — no duplicated URLs anywhere (grep: the store URL exists once in content, once in tests). |
| Docs ↔ reality | Pass | Live pages serve the buttons (verified in preview + post-deploy); STATUS handoff/next-action current; pre-launch blockers closed at 27 remain closed. |
| Append-only history | Pass | Only additive files + owner updates; no released sections rewritten. |
| Merge-critical gates | Pass | build 8 / check 0-0-0 / 38 tests / validator 43/43. |

## Findings

**No drift.** Both packets synchronized owners at merge time; the validator's
sync checks continue to hold the release facts mechanically.

## Follow-ups

- Next scheduled: Audit + Discussion + Markdown Consistency after feature step 30.
