# The current screenshot shows as a hue pill among smaller dots

bump: patch
screen: @sole-focus
screen: @magic-notes

Plan 0004, card B — piece 2 of art-project 0001.

The position dots under the Mac screenshot gallery are now 7px marks at 30% of
`--text`, in place of 11px marks in `--border-strong`. The current one no
longer scales up by 1.35; it stretches into a 22 × 7px pill in the product's
hue, so position reads from shape as well as colour and the row never changes
height. The stretch animates over 0.25s and is switched off under reduced
motion, which now lists `.dot::after` beside `.nav` and `.dot`. The dot buttons'
hit areas are untouched: 28px on fine pointers, 44px on touch. The phone rail
(Waypost Words) has no dots and is not affected.

Before and after pictures of Sole Focus and Magic Notes at 1440 and 390 differ
only in the dot row's box; an enlarged crop shows the orange pill followed by 4
small grey marks. `npm run headless` passed: 125 unit and 36 built-output tests.
This is a design change, not a fix, so it carries no new test.
