# 0022 Narrow windows and large text scroll the page sideways

- Severity: medium
- Reach: player
- Area: every page
- Found by: chaos-project 0001
- Filed: 2026-10-30
- Tried by: —
- Closed by: v0.66.20, card no-page-scrolls-sideways-at-any-width-or-text-size

Doubt: whether a real phone's text-size or page-zoom setting reaches these
sizes in the way the probe imitated them; Severity rounded up to `medium`
because at 200 px the text is cut at the right edge.

## What happens
Below about 270 CSS px of width, or with text at 150% or more on a 390 px
phone, pages grow wider than the window and slide sideways. At 260 px only the
Waypost Words page does (268 px wide); at 200 px every page does (213 to 268
px). With text raised to 175% at 390 px, About is 397 px wide; at 200%, the
home page is 409 px wide and its rows run 19 px past the edge. In the header,
Support and About sit beyond the right edge inside the nav's own scroller
(the documented safety valve in `Nav.astro`), with nothing showing they are
there.

## How to see it
Build, then `node scripts/probe/chaos-probe.mjs --block=grotesque` (window
200x400 and 240x320, and text at 300%), or open `/apps/waypost-words/` at
260 px wide, or at 390 px with `document.documentElement.style.fontSize =
'150%'`.

## What should happen
No page scrolls sideways at any width or text size; DESIGN rule and the
`Nav.astro` comment both call a horizontal page scroll never acceptable.

## Evidence
- Clean at 287 px and wider at 100% text, in Chrome and WebKit; the reflow
  floor of 320 CSS px is met, which is why this is filed rather than carded.
- 390 px: 125% clean; 150% Waypost Words 400 px; 175% 6 pages; 200% all 10
  routes measured. 1440 px: clean to 175%, Magic Notes 1445 px at 200%.
- assets/0022/01-waypost-390px-text-150.png — Waypost Words at 390 px, text 150%: the header cut after "Su".
- assets/0022/02-home-390px-text-200.png — home at 390 px, text 200%.
- assets/0022/03-waypost-390px-text-150-after.png and 04-home-390px-text-200-after.png — the same two views after the fix: nothing past the edge, the header on 2 rows.
