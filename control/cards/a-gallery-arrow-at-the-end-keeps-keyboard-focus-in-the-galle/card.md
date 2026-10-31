# A gallery arrow at the end keeps keyboard focus in the gallery

bump: patch
screen: @gallery-focus
screen: @waypost-words
screen: @sole-focus
screen: @magic-notes

Closes issue 0025

Issue 0025 re-checked as filed, in both galleries and at both ends: the new
screen test tabs onto an arrow, presses Enter until it switches off, then
presses the arrow key back. On the old build all 4 walks failed — "focus lost,
ring not shown, arrow key did nothing" — on the Waypost Words rail and on the
Sole Focus gallery, for Next and for Previous.

Both galleries now switch their arrows through one `switchArrows`, which hands
focus to the arrow still on before its twin is disabled. The rule itself is
`focusHandOff` in `src/lib/rail.ts`, with a unit test over both ends, an arrow
that stays on, focus elsewhere, and both arrows off. A switched-off arrow still
fades out and ignores the pointer exactly as before; Previous keeps the ring
because the last move came from the keyboard, and a mouse user sees no ring.

After: the screen test passes all 4 walks, with `@gallery-presses`,
`@gallery-resize` and `@waypost-rail` still green. `webkit-walk.mjs` in this
workshop walked both galleries to the end in WebKit: focus stayed inside and
ArrowLeft moved each back.
