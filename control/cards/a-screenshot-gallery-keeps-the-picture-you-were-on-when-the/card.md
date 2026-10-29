# A screenshot gallery keeps the picture you were on when the window narrows or the phone turns upright

bump: patch
screen: @sole-focus
screen: @magic-notes
screen: @gallery-resize
unproven: a real iPhone in Safari — proved in Playwright's WebKit 26.4 build

Plan 0013, card A: finding 1 of hunt-project 0001.

In Safari, a Sole Focus or Magic Notes gallery resting on picture 3 jumped to
the last picture when the window narrowed or a phone turned upright: 932 → 430
showed 5 of 5, 1440 → 390 showed 5 of 5 and 6 of 6, with the counter and dots
agreeing with the wrong picture. Safari keeps the old scroll offset and clamps
it to the narrower track's end (WebKit bug 184774); Chrome re-snaps by itself.

`initGallery` now remembers the track's width and, when it changes, puts the
track back on the picture it was on — at once, with the smooth scrolling
switched off for that one move. Both a size observer and the scroll handler
run it, because Safari sends the clamped scroll first and the handler must not
take it as the visitor's own move.

Measured in WebKit 26.4 on the built site: all 40 window resizes (1440 ↔ 390,
1440 → 1000, 1180 ↔ 820, by dot and by arrow, both galleries) and all 6 phone
turns (932 ↔ 430, 844 → 390) stay on picture 3, counter matching; on Sole Focus
picture 4 and picture 2 hold too. Each frame's offset was read: the track is on the right
picture by the next frame, with no glide through the pictures between. The
hunt driver's WebKit drive, red on both galleries before, has no gallery line.
Chrome 156: the same 20 resizes unchanged.

The screen suite now drives both galleries in Chrome with snapping switched
off on the track, which makes Chrome keep the old offset the way Safari does:
it rests on picture 3 and on the second-last, narrows 1440 → 390 and widens
back, and expects the same picture and counter. Seen red on the old code (8
cases, e.g. "picture 3, 1440→390: showing 5, counter 5"), green on the new.
