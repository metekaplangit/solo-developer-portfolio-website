# Check plan 0006 landed, and fix what did not

bump: patch
screen: @increased-contrast
unproven: a real Mac with Increase contrast on — emulated in headless Chrome

The loop card for plan 0006, the 5 look-system picks from style-project 0001.
All 5 cards landed: A (v0.62.12) type roles, B (v0.62.13) the even ramp and
hue-drawn labels, C (v0.62.14) one light and one lift scale, D (v0.62.15)
the icon corner, E (v0.63.0) the increased-contrast mode. Each card's numbers
were measured on the built site at its own close and held: 3 weights, 6 line
heights and 7 letter-spacings, inks `#390400` / `#1e152c` / `#171b1f`, lit
edges on 46 surfaces, icon corners at 22.37%, hairlines at 32% under the
setting.

One fault lived where C and E meet. Under Increase contrast, E makes the
gallery arrows solid with `!important`, and that outlasted the arrow's own
hover, which turns its glyph dark: on Sole Focus the hovered arrow drew
`#390400` on `#08090c` and vanished. The arrow now keeps its own solid hover
fill under the setting. `@increased-contrast` gained the hover check — it
hovers the first gallery arrow with reduced motion on, so the end state
reads at once — and went red on the unfixed code, green after.

Walked the built site home → Apps & Games → Sole Focus → Support at 1440 and
390, with the setting off and on: headings, bands, buttons, fit cells, tiles
and support cards all read as one site in both modes, nothing overflows at 390,
and no surface shows a border and a lift together. Left as lines, as the plan
said: the stale "8px" in the focus-ring comment, and the bright Magic Notes
images on the dark stage.
