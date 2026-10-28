# The support page shows each product as an icon tile, not a bare text link

bump: minor
screen: @support

Card A of plan 0003, from pick 1 of retouch-project 0001. "Supported products"
was three 15px words in a row, 91×34 each, on a page whose every other part is a
surface. A visitor looking for help with one app had to read for it.

Each product is now a `ProductTile`: its icon at 48px, its name, what it is and
where it runs, and a chevron, the whole row one link. The tiles sit in a
`.tile-grid.grid-even` whose column count comes from `evenColumns()`, so three
products are three columns ending on one line, and `.tile-grid` caps a column at
26rem so one product is a tile rather than a page-wide bar. Single cue: the tile
lifts on hover; it carries no hairline.

`ProductTile` is new and shared on purpose. Cards B and D put the privacy
policies and a product page's "More apps" on the same tile, so a product is
recognised by its icon wherever it is listed.

The screen test caught one thing the retouch copy missed: the tile icons were
lazy-loaded while already on screen at 768 and 1440 — four faults, "lazy image
already on screen". `ProductTile` now takes `eager` and hands it to
`ProductAvatar`, whose own note says why; the support page sets it, since its
tiles sit inside the first screen.

Proved by: Headless Suite Testing, complete and green; Scoped Suite Testing on
@support, 14 of 14 after the eager fix (red with the four lazy faults before
it); after pictures at 1440 and 390.

unproven: a real phone — the coarse-pointer pass is an emulated one
