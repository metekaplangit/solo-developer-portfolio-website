# Markdown Consistency Checkpoint MC-0008

- **Trigger:** Completion of feature step #16 (STEP-0016); cadence = every 2
  feature steps.
- **Reviewed range:** STEP-0015 (v0.15.0) → STEP-0016 (v0.16.0).
- **Date:** 2026-07-03.

## Checklist results

| Check | Result | Notes |
|---|---|---|
| Step/tag/feature agreement | Pass | STATUS current STEP-0016, tag v0.16.0; CHANGELOG [0.16.0]; CHECKPOINTS feature count 16; ROADMAP STEP-0016 entry present. |
| Static / zero-JS guardrail | Pass | Motion is CSS-only (`animation-timeline: view()`); no client JS added; still `output: 'static'`. Guardrail checks green. |
| Accessibility of motion | Pass | `.reveal` is gated by `prefers-reduced-motion: no-preference` **and** `@supports (animation-timeline: view())`; where unsupported or motion-reduced, content renders fully visible (verified opacity resolves to 1 in-view). Consistent with UI_DESIGN dark-premium + a11y stance. |
| Honesty / no fabricated proof | Pass | No App Store badges, press logos, testimonials, user counts, or screenshots added; the spotlight uses only real product fields (icon, name, status, summary, features). Consistent with SECURITY.md truthfulness stance. |
| Component reuse | Pass | Spotlight reuses `ProductAvatar` + `Badge`; feature grid is content-driven from `product.features`. No duplication introduced. |
| Checkpoint ledger | Pass | MC-0008 logged at step 16; next scheduled Discussion/MC after 18, Audit after 20, Enhancement after 21. |
| Canonical ownership / append-only | Pass | Historical reports untouched; single milestone headings; no duplicated versions. |

## Findings

**No drift requiring repair.** The appeal/motion pass (home spotlight, feature
grid, scroll-reveal) is consistently reflected across code and docs, stays within
the static/zero-JS/zero-cost and accessibility guardrails, and adds no unverifiable
marketing claims. Research item **C (real screenshots + device mockups)** remains
correctly recorded as deferred pending assets.

## Follow-ups

- Next Markdown Consistency after feature step #18; Discussion after #18; Audit
  after #20; Enhancement after #21.
- Promote **LEDGER-002 (a11y/Lighthouse CI)**: now that motion + scroll-driven CSS
  are in, an automated a11y/reduced-motion check has extra value.
