# Every press on a screenshot gallery or the phone rail moves it, however quickly they come

bump: patch
screen: @gallery-presses
screen: @sole-focus
screen: @magic-notes
screen: @waypost-words
screen: @waypost-rail
screen: @gallery-resize
unproven: a real iPhone in Safari — WebKit through Playwright only

Plan 0014, card A, from chaos-project 0001 finding 1.

A visitor tapping Next quickly lost presses: 3 taps 150 ms apart moved Sole
Focus and Magic Notes 2 pictures in Chrome, 80 ms apart moved 1. Every press
aimed at `current ± 1`, and `current` only moves once a glide is half done. The
Waypost Words rail paged with `scrollBy` from wherever a glide had got to, so 2
quick taps stopped at shots 5–8 instead of the end, and in WebKit 3 quick
ArrowLeft presses left it resting part-way across a shot. A phone turned just
after a dot was pressed went back to the old picture, because the resize re-pin
used the same stale `current`.

Now each gallery and the rail remember where the last press sent them, aim the
next press from there, and let that go when the track arrives or when the
visitor moves it by hand (pointer, touch, a sideways wheel, any other key). The
rail pages to whole shots with `scrollTo`, and a resize mid-glide re-aims at the
same shot. The re-pin lands on the picture the glide was going to.

Proof, all on the built site:

- `@gallery-presses`, new: bursts of Next, ArrowLeft and 40 Next on both
  galleries, and 2 Next then 3 ArrowLeft on the rail, motion on. Seen red on the
  unfixed code (7 failures, e.g. "3 taps on Next from picture 1: showing 2,
  counter 2, expected 4"), green now.
- The 5 other screens above, green; `npm run headless`, green.
- The chaos narrowing probe, both engines: 3 clicks or keys at 0 to 600 ms apart
  land on picture 4 with the counter 4 on both galleries (24 of 24 per engine);
  the rail's 2 Next taps rest at shot 7–10 exactly and 3 ArrowLeft from the end
  at shot 1 exactly, every speed (9 of 9 per engine).
- `chaos-probe --block=sequences` and `--block=races`, both engines: every
  gallery and rail scenario held, the 20-rotation race included. The other lines
  it prints are the driver artefacts and filed issues 0023 and 0024.
- Hand beats press: in WebKit a sideways wheel back during a 3-press glide wins,
  and the next Next counts from where the hand left it. In Chrome the glide
  finishes whatever the wheel does — the same with a bare `scrollTo` and none of
  this code — so that is Chrome's own handling of a scripted smooth scroll.
