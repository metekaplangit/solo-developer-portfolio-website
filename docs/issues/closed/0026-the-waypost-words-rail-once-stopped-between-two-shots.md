# 0026 The Waypost Words screenshot rail once stopped between two shots

- Severity: low
- Reach: player
- Area: Waypost Words page
- Found by: session (plan 0019's loop card)
- Filed: 2026-10-31
- Tried by: —
- Closed by: v0.66.31, card the-waypost-words-phone-rail-always-comes-to-rest-on-a-whole

Doubt: seen once in 3,000 storm events and not again in 3 replays; reach is
filed `player` because the storm drives the rail only with ordinary presses
and a phone-sized window, and doubt rounds up.

## What happens
The chaos storm's invariant check found the Waypost Words phone rail resting
at 855 px, between two screenshots, instead of on one, at 844 × 390 (a phone
on its side), after a press on a gallery dot.

## How to see it
Build, then `node scripts/probe/chaos-probe.mjs --block=storm --seed=3` in
Playwright's Chromium (`PUPPETEER_EXECUTABLE_PATH`), and read for `rail left
between shots`. It did not repeat in 3 replays of that config's 375 events
(`--replay` of config 7, up to step 2774, `--from=/apps/waypost-words/ --w=844
--h=390`).

## What should happen
The rail always comes to rest with one screenshot squarely in view.

## Evidence
- Storm seed 3, Chromium, 2026-10-31, on v0.66.29 plus the loop card's changes: 1 invariant break, `BREAK seed 3 step 2774 on /apps/waypost-words/: rail left between shots at 855px`.
- Nothing in plan 0019 touched the rail's code.
