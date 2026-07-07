# Markdown Consistency Checkpoint MC-0012

- **Trigger:** Completion of feature step #24 (STEP-0024); cadence = every 2
  feature steps.
- **Reviewed range:** STEP-0023 (v0.23.0) → STEP-0024 (v0.24.0).
- **Date:** 2026-07-07.

## Checklist results

| Check | Result | Notes |
|---|---|---|
| Step/tag/feature agreement | Pass | STATUS current STEP-0024, tag v0.24.0, feature steps **24**; ROADMAP STEP-0024 entry; CHECKPOINTS count 24 + MC-0012 + DISC-0008 logged; CHANGELOG top release [0.24.0]. |
| Copy truthfulness (Apple/pack rules) | Pass | New Sole Focus copy maps to the v2 copy pack's documented facts; **no app/website blocking claim** (the only mention is the FAQ negation "No … not a blocker"); privacy stated exactly (no account/cloud/tracking/subscription, zero network requests) — consistent with SECURITY.md + the privacy page. |
| Content vs template reality | Pass | `summary`, `features` (7), `seo.title/description`, and body sections all live in `sole-focus.md`; detail page renders Highlights grid + divided prose sections + FAQ; JSON-LD `featureList` = 7 tracks the content. |
| Consistency across surfaces | Pass | Updated `summary`/`features` propagate to the home spotlight lede + highlights, the product card, and the `SoftwareApplication` JSON-LD (single source: the content file). |
| Checkpoint ledger | Pass | MC-0012 + DISC-0008 logged at step 24; next MC + Discussion after 27/… , Audit after 25, Enhancement after 28. |
| Canonical ownership / append-only | Pass | Historical reports untouched; single milestone headings; edits are additive/owner-updates. |

## Findings

**No drift requiring repair.** The v2 listing copy is applied consistently to the
one content file that feeds every Sole Focus surface, the claims stay truthful,
and docs/tag/step agree at v0.24.0.

## Follow-ups

- Next Markdown Consistency after feature step #26; Discussion after #27; Audit
  after #25; Enhancement after #28.
