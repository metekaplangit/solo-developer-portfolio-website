# The Waypost Words phone rail always comes to rest on a whole shot

bump: patch
unrendered: where the rail comes to rest after a resize mid-glide; no still picture differs, so it is proved by `rail-rest.mjs` here (1,600 rounds) and the chaos storms, with @waypost-rail and @waypost-words passing
unproven: real Safari on an iPhone turning upright mid-swipe — every browser driven was Playwright's Chrome for Testing or WebKit

Plan 0020, card A, from resolve-issues 0004. Closes issue 0026.

A resize that lands while the rail is gliding moves every shot. A glide begun
by a press had its own aim and was re-aimed; one begun by a swipe, a wheel or a
trackpad had none, so it finished at its old destination, now between two
shots. The rail now settles on the shot it was nearest before the shots moved
(`aimAfterResize` in `src/lib/rail.ts`). WebKit can scroll the rail to a place
of its own and run the next frame before the window's resize event, so by the
time the event came the rail's "where was I" already read the new layout and
nothing was re-aimed — seen only with reduced motion, 2 of 200 rounds. The
frame itself now notices the shots moved and re-aims. The step is read from the
layout rather than `offsetLeft`, which rounds: a step of 272.5 read as 273
aimed shot 6 3 px past where it snaps.

Re-checked first. The storm as filed (seed 3) and 2 replays did not show it in
Playwright's Chromium on the first run; `rail-rest.mjs`, written here, drives
the rail as a person would and proves its own reading first. Before (exact
positions): Chromium 2, WebKit 10 rests between shots in 200 rounds; WebKit
with reduced motion 2. The re-run storm caught it too, at step 1199. After:
0 in 1,600 rounds — both engines, motion and reduced motion, seeds 1 and 3 —
and the storms (Chromium seeds 1–3, WebKit seed 2) show no rail break.

The cheap test is `aimAfterResize` in `src/lib/rail.test.ts`: every pair of
the rail's real steps, every shot, positions either side of it, a press's aim
kept, nothing done when the shots did not move. Seen red on today's behaviour
(2 of its 4 checks) first.

The chaos probe read the rail with `offsetLeft` too, and called a resting rail
"between shots" from shot 5 on at fractional steps; it now reads exact
positions. Its replay only ever played config 0, which is why the issue's
replays never repeated a config-7 break; `--config` and `--since` pick the
config and start step.

A mistake of mine: the first storm ran in the installed Google Chrome, because
the probe falls back to it when `PUPPETEER_EXECUTABLE_PATH` is unset. Every run
after that set it. Filed as issue 0027 (9 tools). Storm seed 1 also logged
Chrome refusing the support email link twice — issue 0028, left alone.

`npm run headless` exit 0 (154 unit, 59 built-output); screens @waypost-rail
@waypost-words passed in Chrome for Testing.
