# Both screenshot galleries run on one shared controller

bump: patch
screen: @gallery-presses
screen: @gallery-resize
screen: @waypost-rail
screen: @sole-focus
screen: @magic-notes
screen: @waypost-words

Card B of plan 0016, from evaluate-project 0001. `ScreenshotShowcase.astro`
carried two controllers — the Mac gallery and the phone rail — each with its own
copy of the press aim, the by-hand release, the arrow keys and the frame-queued
scroll, so hunt, chaos and smooth 0001 each had to fix both. The arithmetic under
them had no test of its own, only screens.

The arithmetic now lives in `src/lib/rail.ts` — clamping, arrival within 1 px,
the picture nearest the middle, the first shot in view, shots per view, a whole
view's page and the rail offset — with 13 unit tests in `src/lib/rail.test.ts`
covering both ends, a pull past either end, a partly scrolled track, one shot per
view and every shot in view. The shared wiring is one `steer()` in the
component's script: it holds the aim, lets it go on a hand move or an unrelated
key, maps the arrow keys to Previous and Next, and runs a frame once per
animation frame after a scroll or a `nudge`. Each controller keeps only what is
its own: the gallery's dots, counter and resize re-pin; the rail's count and its
re-aim on resize, which still redraws on the next frame as before. Still one
bundled module script, so the CSP needed no new hash.

Proved: `npm run headless` exit 0, 145 unit tests; the six screens above in
Chrome, 19 of 19; `node scripts/probe/hunt-probe.mjs drive --engine webkit`
gives the same single red hunt-project 0001 left — the first plain Tab in Safari,
recorded there as intended (C6) — with both galleries' resize and the rail
passing. Before and after pictures of the three product pages differ only inside
the page opening (y 281 to 525, the `data-land` fade), at most 7 pixels over a
threshold of 16, and not at all inside any gallery.
