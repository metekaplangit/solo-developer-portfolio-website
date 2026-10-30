# 0023 Chrome logs "Transition was aborted" errors on page changes

- Severity: low
- Reach: player
- Area: page changes
- Found by: chaos-project 0001
- Filed: 2026-10-30
- Tried by: —
- Closed by: —

Doubt: the cause was not found; whether the site's own `pagereveal` script
has any part in it is unknown.

## What happens
When a page change skips its view transition — a reload, Back, a hidden tab,
a resize, or a second link pressed during the first change — Chrome reports
an uncaught `Transition was aborted because of invalid state` (with "Page
already revealed", "ViewTransition opt-in disabled", "Document hidden" or
"Viewport size changed"), and WebKit reports `InvalidStateError: Skipping
view transition because viewport size changed.` Nothing visible goes wrong:
the page arrives whole.

## How to see it
Build, then `node scripts/probe/chaos-probe.mjs --block=storm --seed=1` and
read the `pageerror` lines; 130 of them in 3,000 events in Chrome 156.

## What should happen
A skipped transition leaves the console quiet, so a real error is not lost
among these.

## Evidence
- Storms seeds 1 and 3 (Chrome): 194 and 148 such errors; seeds 2 and 4 (WebKit): 5 and 4.
- A bare 2-page site with `@view-transition { navigation: auto }`, with and
  without the site's `pagereveal` line, driven by clicks, reloads and Back,
  logged none, so the trigger is something the storm does that the bare test
  did not.
