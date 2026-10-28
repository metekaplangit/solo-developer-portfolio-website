# App icons keep the Mac icon shape at every size, and their tiles nest round them

bump: patch
screen: @every-route
unproven: Safari on a real Mac — rendered in headless Chrome only

Card D of plan 0006, pick 1 of style-project 0001. App icons were cut by fixed
pixel corners — 7px on 28, 18px on 48, 24px on 56 — so each size was a
different shape, and the larger ones read as round badges rather than Mac
icons. They now take `--radius-icon`, 22.37% of their own size, the proportion
Apple's icon masks use: 6.3, 10.7 and 12.5px measured on the built site. The
brand mark in the header takes the same token, so it changes on every route.

The tile around a list icon moves to `--radius-lg` (24px), so its corner nests
round the icon's at the 16px inset: off by 2.7px, was 16. The large icon's own
`--radius-lg` override is gone.

Ported from the report's `icons.patch` onto card C. `ProductAvatar` and
`ProductTile` conflicted with cards A and C; both kept card C's lift and
`--shadow-sm` and took this card's corners. `DESIGN.md`'s corner lines said
20/14/8px while the code has been 24/18/10 — corrected, with the icon corner
added.
