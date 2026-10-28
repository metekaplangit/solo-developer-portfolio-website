# check plan 0004 landed, and fix what did not

bump: patch

Plan 0004's loop card, covering card A (v0.62.3, the gallery arrows) and card B
(v0.62.4, the dots). Both were built; nothing was abandoned.

`walk.mjs` in this folder drives the built site as a visitor would, at 1440 and
390. On Sole Focus and Magic Notes it presses next twice, picks the last dot, and
picks the first again. On Waypost Words' phone rail it presses next once. Then
it loads Sole Focus with touch and with reduced motion. 70 checks passed, exit
code 0:

- All 4 arrow kinds use the 20-unit chevron, are 48px, and show the `--bg` glass
  with no shadow and no retired graphite.
- At the start prev is off. At the last screenshot next is off and prev is on.
  Back at the first, prev is off again.
- The pill follows the current screenshot (7 7 22 7 7), the other marks stay
  7 × 7, and no transform is left on any mark.
- Hovering an arrow fills it with the same hue the pill wears: orange on Sole
  Focus, silver on Magic Notes.
- Touch was emulated (hover none, pointer coarse): arrows stay 48px and dot
  targets grow to 44px. With a mouse they are 28px.
- Under reduced motion the mark's transition is 1e-06s, the site-wide 0.001ms
  rule.
- Nothing scrolls sideways.

The first walk's 4 failures were the instrument's, not the site's. Puppeteer
cannot emulate `hover` as a media feature, so touch is now emulated with
`hasTouch`. Reduced motion reads back as 0.001ms, not 0. One retry once timed
out waiting for a dot to change, then passed in a fresh browser; the second full
walk did not repeat it. This machine's Chrome detaches about once a launch in 3.

Card A's cheap test, "the retired graphite ground" in `tests/dist.test.ts`, is
on main and was seen red on `#16171bc7` before the fix. Issue 0005 is in
`closed/`. Card B fixed no defect and carries no test.

The seam no card owned was `DESIGN.md`. It still listed the gallery arrows under
`--shadow-lg` and gave the dots as 11px, and it now describes what ships. Words
only, and no screen changed in this card.
