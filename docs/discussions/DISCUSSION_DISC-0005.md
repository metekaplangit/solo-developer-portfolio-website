# Discussion Checkpoint DISC-0005

- **Trigger:** Completion of feature step #15 (STEP-0015); Discussion cadence =
  every 3 feature steps.
- **Reviewed range:** STEP-0013 → STEP-0015 (v0.13.0 → v0.15.0) — the product
  icon, the UI-consistency/website-privacy pass, and the research-driven polish.
- **Date:** 2026-07-03.

## Persona reviews

**1. Design-system architect.** The new `ProductAvatar` centralises the one
identity lockup (icon-or-monogram) behind a `size` prop that derives radius +
shadow (small = card, large = hero), so cards/detail/privacy are consistent by
construction. `--maxw-prose` and the width tokens keep the layout on one measure.
Clean consolidation; no concerns.

**2. Accessibility / UX reviewer (primary).** The `--faint` fix is a genuine
WCAG-AA correction (3.9:1 → ≥4.5:1 on every surface), verified by calculation.
Focus states unsuppressed; the reading measure tightened toward the comfortable
band. Icon images stay decorative (`alt=""`) with the product name adjacent —
correct. No regressions.

**3. Security / privacy reviewer.** No content or data-handling change in
STEP-0015; the website-vs-apps privacy scoping from STEP-0014 remains accurate
and reduces reviewer confusion. `../PromodoApp/` still read-only/unmodified. No
concerns.

**4. Build / deploy engineer.** No new dependencies; still fully static. 34 tests
green; `astro check` 0/0/0; build 8 routes. Component-only refactor. No concerns.

**5. Maintainability skeptic.** `ProductAvatar` **resolves LEDGER-001** (monogram
logic removed from two call sites, now three consumers share one component).
Borders relaxed to a single separation cue — less CSS, not more. Net debt down.
LEDGER-002 (a11y automation) remains the one open, unrelated item.

## Dispositions

No critical/security/release-blocking findings. The research was salvaged from a
partial deep-research run (stopped for cost) plus a local contrast audit — the
adopted claims were the ones adversarially verified. Research item **C
(hero/detail product screenshots)** is intentionally deferred until real Sole
Focus screenshots exist — flagged, not dropped.

## Follow-ups

- Next Discussion after feature step #18. (Audit AUDIT-0003 runs alongside this
  at step 15; Markdown Consistency after #16.)
