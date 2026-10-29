# 0014 The gallery's inactive dots are too faint to see as controls

- Severity: low
- Reach: player
- Area: screenshot gallery
- Found by: style-project 0002
- Filed: 2026-10-29
- Tried by: —
- Closed by: card "The gallery's marker and counter keep pace with the slide" (v0.65.2, plan 0011 card D) — inactive dots at 50% of the text colour, 4.7:1; held by the screen suite's control-mark rule

Doubt: a dot is a button here, so 3:1 applies (WCAG 2.2 SC 1.4.11); if it were read as decoration it would not. Rounded up to a fault.

## What happens
Below each product's screenshot gallery, the dots that are not the current screenshot are drawn at 30% of the text colour (`.dot::after` in `ScreenshotShowcase.astro`). On the stage they render `#48494c` — sampled `rgb(72,73,76)` on `rgb(7,8,11)` — which is **2.2:1**. Each dot is a button that jumps to its screenshot, and its dot is the only thing that shows it is there.

## How to see it
Open `/apps/sole-focus/` or `/apps/magic-notes/` at 1440 and look under the gallery: the current dot is a bright hue pill, the other 4–5 are barely visible grey points.

## What should happen
Every inactive dot reaches at least 3:1 against the stage, while the current one still stands out by its width and hue.

## Evidence
- assets/0014/01-gallery-dots-1440.png — the dot row under the Sole Focus gallery, 2× enlarged; pixels sampled from the full-page capture at 1440
