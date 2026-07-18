# Discussion Checkpoint DISC-0012

- **Trigger:** Feature step #36 (STEP-0037); Discussion cadence every 3 (prior:
  DISC-0011 at #33).
- **Reviewed range:** STEP-0036 (redesign) → STEP-0037 (polish).
- **Date:** 2026-07-17.

## Review

The wider/image-forward redesign (STEP-0036) traded text-column width for image
prominence, which surfaced real alignment debt the user then flagged: mismatched
button heights (56 vs 49px) and ragged text in the narrowed column. STEP-0037
resolves it at the **system** level — a single shared button height so emphasis
never comes from a taller box, plus a facts-line that breaks only between facts.
This is the healthier fix than per-instance tweaks (echoes ENH-0005's "adjust
tokens, not per-page widths").

**Verification quality.** Button heights and facts wrapping were *measured* (not
just eyeballed), and overflow was swept across all seven routes at two widths —
the kind of check that catches the regressions manual review misses
(DISC-0011-F1 / AUDIT-0007-F3 lineage).

## Findings

| ID | Severity | Finding | Disposition |
|---|---|---|---|
| DISC-0012-F1 | low | On narrow screens some long buttons wrap to 2 lines, so heights vary within a stacked CTA (button box up to ~79px). | **Accept** — wrapping, not inconsistent sizing; buttons stack (each on its own row) on mobile, so mismatch isn't visible side-by-side. Revisit only if a mobile CTA looks off. |
| DISC-0012-F2 | info | This was a focused pass: home + shared rules verified; other pages inherit the button/facts fixes but were only overflow-swept, not individually art-directed. | **Note** — further per-page polish available on request. |

No blocking findings.

## Follow-ups

- Next: MC + Discussion after #39. Highest-value packet: more products.
