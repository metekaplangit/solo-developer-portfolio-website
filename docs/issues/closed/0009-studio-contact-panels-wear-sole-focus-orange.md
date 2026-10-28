# 0009 The contact panels on Support and About wear Sole Focus's orange

- Severity: low
- Reach: player
- Area: support, about
- Found by: retouch-project 0002
- Filed: 2026-10-28
- Tried by: —
- Closed by: plan 0007 cards B and C — both panels plain `.panel`; the built-output test "the accent panel appears only on a page whose product sets its hue" seen red on /about/ first

## What happens
The "Get in touch" panel on `/about/` and the address panel on `/support/` use `.panel-accent`, whose wash is `var(--hue-soft)`. Neither page sets `--hue`, so both fall back to the default `#ff9245` — Sole Focus's orange — and show a brown-orange glow in their top-left corner on pages that belong to the studio, not to a product.

## How to see it
Build, open `/support/` and `/about/` at 1440 px, look at the top-left corner of the contact panel. `src/styles/global.css` (the `.panel-accent` rule and the comment above the list of surfaces that set `--hue`) names this exact failure.

## What should happen
Studio pages stay achromatic (DESIGN.md §2, One Voice Per Band): these panels use plain `.panel`, or a hue only where a product owns the surface.

## Evidence
- assets/0009/01-support-panel-orange-wash.png — the Support address panel at 1440, orange in its top-left corner
- assets/0009/02-about-panel-orange-wash.png — the About "Get in touch" panel at 1440, same wash
