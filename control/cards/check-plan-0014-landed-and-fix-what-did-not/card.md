# Check plan 0014 landed, and fix what did not

bump: patch
unproven: a real iPhone in Safari — WebKit through Playwright at 390 × 844 with touch only

The loop card for plan 0014, against its bar: does what card A built work the
way it was supposed to, is any of it broken, does the site still stand up. Scope
was exactly what A touched. It found nothing to fix, so this card changes no
product file.

Driven (`walk.mjs`, built site, WebKit 26.4 and Chrome 156 through Playwright):

- A phone at 390 × 844 with touch on Waypost Words: Next tapped 12 times
  quickly rests on shots 9–10 exactly, Next off; Previous tapped 12 times
  quickly rests on shots 1–2 exactly, Previous off. Both engines.
- A Mac at 1440 × 900 on Sole Focus: Next clicked 3 times at once, the window
  turned upright (900 × 1440) 60 ms into the glide → picture 4, counter 4, dot
  4. Then a sideways swipe by hand → picture 5 with counter and dot matching,
  and one Previous → picture 4, counted from where the hand left it. Both
  engines.

10 of 10 checks held.

Where it meets the rest: card A's own proof already covered both galleries'
arrows, dots, keys and counter, the rail reaching every shot (`@waypost-rail`)
and the resize re-pin (`@gallery-resize`), all green at its close in v0.66.6;
`chaos-probe --block=sequences` and `--block=races` ran in WebKit and Chrome
against that same build with every gallery and rail scenario holding. Not run
again here.

Proof was real: A's `@gallery-presses` test was seen red on the unfixed code
with 7 failures before the fix, and green after.

Left as lines, not fixed: closing a single page in Playwright WebKit hung the
walk until the browser was closed instead — the harness, not the site.
