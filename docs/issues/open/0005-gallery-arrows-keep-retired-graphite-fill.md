# 0005 Gallery arrows are filled with the retired graphite colour, not the stage's

- Severity: low
- Reach: player
- Area: screenshot gallery
- Found by: art-project 0001
- Filed: 2026-10-28
- Tried by: —
- Closed by: —

## What happens
The gallery's previous and next buttons hard-code `background: rgba(22, 23, 27, 0.78)`, which is the graphite ground `#16171b` from before the Spectrum palette. The counter chip next to them had the same leftover and was moved to `color-mix` from `--bg`. The arrows were not. The buttons also stack a fill, a hairline, `--shadow-lg` and a blur, which is more than the Single-Cue Rule in `DESIGN.md` §4 allows.

## How to see it
`grep -n "rgba(22, 23, 27" src/components/ScreenshotShowcase.astro`

## What should happen
The arrows take their glass from the same tokens as `.chip-glass`, so a palette change reaches them, and they carry 1 separation cue rather than 4.

## Evidence
- assets/0005/01-gallery-arrow-graphite-fill.png — the Sole Focus next arrow at 2x
- `src/components/ScreenshotShowcase.astro:318-324`
- art-project 0001's piece 1 redraws these buttons and removes this, if picked
