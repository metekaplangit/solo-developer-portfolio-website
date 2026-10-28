# A Mac set to Increase contrast gets stronger text, clear hairlines and a solid header

bump: minor
screen: @increased-contrast
unproven: a real Mac with Increase contrast on — emulated in headless Chrome (`prefers-contrast: more`, set before the page loads)

Card E of plan 0006, pick 4 of style-project 0001. Turning on "Increase
contrast" on a Mac changed nothing on this site: 9% hairlines, two quiet grey
tiers and a translucent header stayed as they were. A
`@media (prefers-contrast: more)` block, last in `global.css`, now gives every
quiet value a stronger version — text `#fff`, muted `#d0d3da`, faint
`#babec8`, hairlines 32% and 56% — and makes the header, glass chips and
gallery arrows solid, with link underlines at full strength.

Two changes from the report's version, both found by the new screen test.
Under the setting, lifted surfaces now take a 1px ring instead of their lift,
not on top of it, so each surface keeps one cue. The report's rules also never
reached tiles, the "who it is for" boxes or the header: each component's own
scoped rule outranks a plain selector. The block uses `!important` for the
ring and the solid fills, because it answers the visitor's own setting and has
to win over every component and its hover.

`@increased-contrast` reads the home page, Sole Focus and Support with the
setting on and off. It went red on the code before this card (34 complaints),
red on the report's version (rings missing, shadows stacked, header still
glass), and green now. Measured: hairlines 32% and 56%, cards, panels, tiles and
cells ringed with no shadow, lowest contrast 5.86:1 under the setting, on the
hue chip. Without the setting, 18 of 22 pictures are pixel-identical to card
D's. The other 4 differ by at most 3 levels out of 255, or only in the home
hero, which also differs between 2 captures of one build. Pictures under the
setting are in `after/increased-contrast/`. `DESIGN.md` gains the Increased
Contrast Rule.
