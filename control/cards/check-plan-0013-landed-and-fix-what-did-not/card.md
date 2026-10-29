# Check plan 0013 landed, and fix what did not

bump: patch
unproven: a real iPhone in Safari — walked in Playwright's WebKit 26.4 build

Plan 0013, card B, the loop card. Nothing needed fixing.

- A landed: v0.66.4 deployed (run 40923421692, success), and the live Sole
  Focus page carries the new size handling in its gallery script.
- The visitor's path, walked by `walk.mjs` in this folder in WebKit 26.4, on
  the built site and again on https://metkapstudio.com: an 844 × 390 window on
  picture 3 of each slide gallery, turned to 390 × 844 — still picture 3,
  counter, dot and both arrows agreeing. Then Next, Previous, the last dot, the
  first dot, the Right and Left keys and a turn back sideways: 18 of 18 steps
  as expected, and the dot marker 0 px from the current dot after every one.
- Must keep working: the Waypost Words phone rail starts at "1–2 of 10" and
  Next reaches "9–10 of 10".
- A's cheap test exists (`@gallery-resize`) and was seen red on the old code,
  8 cases, in the form it closed with.
- Seams no card owned: none found. The correction is instant; one reading per
  frame saw WebKit's clamped offset for 1 frame before the right one — read
  inside the frame, before the size observer runs, so whether it is ever
  painted was not measured.
