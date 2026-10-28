# Cards and tiles are lit from the top, with one lift scale

bump: patch
screen: @home
screen: @apps
screen: @sole-focus
screen: @magic-notes
screen: @waypost-words
screen: @support
screen: @privacy-index
unproven: Safari on a real Mac — rendered in headless Chrome only

Card C of plan 0006, pick 2 of style-project 0001. Every shadow on the site
falls downward, but the surface gradient ran the other way — darker at the
top, lighter at the bottom — so cards were lit from below. And on the
near-black stage a black shadow barely shows. Surfaces now take
`--surface-fill`, brighter at the top, and a lift from one scale:
`--lift-1` (cards, tiles, fit cells), `--lift-2` (panels), `--lift-3` (hover).
Each lift is a 1px lit top edge at 10% white plus the shadow it had.

The fit cells ("Who it is for" / "Not for you if") lose their hairline border
and take the lift, so no surface carries both — the Single-Cue Rule. The large
icon now rests on `--shadow-sm` instead of the panel-height shadow. Image
frames keep their ring and shadow; they hold pictures.

Ported from the report's `depth.patch` onto card B unchanged. Measured on the
built site: 46 cards, tiles and cells carry the edge with `--shadow-sm`, 5
panels with `--shadow-md`; hairline borders stay only on ruled lists, frames,
buttons and the header. On top of card B's lighter surfaces, the faintest
label — "Not for you if" on the lit top of a fit cell — measures 5.33:1 (the
report measured 5.60 for this card alone). Still above 4.5:1; `DESIGN.md`
records the new lowest, and gains the One Light Rule.
