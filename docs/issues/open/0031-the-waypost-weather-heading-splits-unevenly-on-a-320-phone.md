# 0031 The Waypost Words weather heading splits unevenly on a 320px phone

- Severity: medium
- Reach: player
- Area: Waypost Words page
- Found by: session (issue 0015's card, 2026-11-07)
- Filed: 2026-11-07
- Tried by: —
- Closed by: —

Doubt: it could read `low` (only seen); it is filed `medium` to match issue 0015,
the same fault at wide widths, and doubt rounds up.

## What happens
At 320px wide, "Weather with a mind of its own" splits as "Weather with a mind /
of its own", 19 characters over 10. It needs 315px on 1 line and the column is
280px. Its ties leave only 2 places to break. Wide screens were mended by
widening the label rail to 22rem from 80rem up (issue 0015). A phone has no room
to widen into. At 390 and up it does not happen. The screen suite's
`BREAKS_KNOWN` exempts this heading at 320 only, naming this issue.

## How to see it
Build, then in `tests/screens/site.spec.ts` empty `BREAKS_KNOWN` and run
`npx vitest run --config vitest.ui.config.ts -t "@waypost-words"`. It reports
`@320 bad line break — uneven heading: "19 / 10 characters"`.

## What should happen
The heading splits into 2 even lines, or sits on 1, at 320 as at every other
width. The words are the owner's ("Stay.", 2026-11-02), so the fix is layout,
or the owner's new words.

## Evidence
- The screen suite on 2026-11-07, with the exemption removed: `@320 bad line
  break — uneven heading: "19 / 10 characters" in "Weather with a mind of its
  own"` (the same run reported @1440 too, which the 22rem rail has since mended).
