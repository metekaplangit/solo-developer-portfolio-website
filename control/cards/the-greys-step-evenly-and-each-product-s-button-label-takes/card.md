# The greys step evenly and each product's button label takes its own hue

bump: patch
screen: @every-route
unproven: Safari on a real Mac — rendered in headless Chrome only

Card B of plan 0006, pick 5 of style-project 0001. The surfaces above the
stage stepped unevenly, and the band step was the smallest of all — so small
the band barely lifted off the stage. The ramp is now `#0f1015`, `#16181d`,
`#1e2027`, `#262931`: OKLCH lightness 0.174, 0.209, 0.245, 0.280 above the
`#08090c` stage, one blue-grey hue.

Every product's hue-filled button also wore one label colour, Sole Focus's
brown, so Waypost Words' lavender button had a brown label. Where the product
hue is owned, `--hue-contrast` is now derived from it with relative colour:
the same hue taken down to near-black. Measured on the built site: Sole Focus
`#390400` (7.93:1 on its hue), Waypost Words `#1e152c` (9.25:1), Magic Notes
`#171b1f` (8.91:1). Browsers without relative colour keep `#1c0d02`.

Ported from the report's `palette.patch` onto card A unchanged. Lowest text
contrast on the site is now 5.55:1 (was 5.71), the "Not for you if" label on
the lifted surface; still above the 4.5 floor. `DESIGN.md` carries the new
ramp and the derived label.
