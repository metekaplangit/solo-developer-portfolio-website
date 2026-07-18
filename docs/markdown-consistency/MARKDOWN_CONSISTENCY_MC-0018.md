# Markdown Consistency Checkpoint MC-0018

- **Trigger:** Scheduled — Markdown Consistency due at **feature step 36**
  (STEP-0037). Prior: MC-0017 at 34.
- **Reviewed range:** STEP-0036 → STEP-0037 (v0.34.0 → v0.35.0).
- **Date:** 2026-07-17.

## Checklist results

| Check | Result | Notes |
|---|---|---|
| Machine-checked invariants | Pass | Post-tag: product_tag v0.35.0 == git tag == CHANGELOG top; feature count **36** in both owners; validator 43/43. |
| Traceability | Pass | STEP-0037 carded with evidence; CHANGELOG [0.35.0]; ROADMAP entry; AUDIT-0007/ENH-0005 (v0.34.0) already ledgered. |
| Redesign continuity | Pass | STEP-0037 is a polish follow-on to STEP-0036; width tokens unchanged; button height is now the shared system lever (documented in the .btn comment). |
| Merge-critical gates | Pass | build 8 / check 0-0-0 / 45 tests / validator 43/43; overflow-free on all 7 routes at 390/1280. |
| Append-only history | Pass | Additive files + owner updates only. |

## Findings

**No drift.** Owners synchronized at merge.

## Follow-ups

- Next-due: MC + Discussion after feature step 39 (per every-2 / every-3 from 36);
  Audit after 40. More products remains the highest-value next packet (ENH-0005).
