# No page scrolls sideways at any width or text size

bump: patch
screen: @narrow-and-large-text
screen: @home
screen: @apps
screen: @sole-focus
screen: @magic-notes
screen: @waypost-words
screen: @about
screen: @support
screen: @privacy-index
screen: @privacy-sole-focus
screen: @privacy-magic-notes
screen: @privacy-waypost-words
screen: @not-found
unproven: a real phone's own text-size or zoom setting — imitated, as the issue did, by raising the root font size

Closes issue 0022

Issue 0022 re-checked as filed: `wide.mjs` in this workshop walks all 13
routes at 12 sizes (200, 240, 260, 287 and 320 px; 390 px at 125–300% text;
1440 px at 175 and 200%) and found 53 page views wider than the window in Chrome
and 53 in WebKit. The parts sticking out were an email address, the chips, the
tied "Usually within 2–3 business days" and every grid or flex row holding one
of them at its full length — and in the header, Support and About pushed past
the edge of the nav's own scroller.

Three rules, no new values. The body sets `overflow-wrap: anywhere`, the one
setting that lowers a box's min-content width, so a word longer than its column
breaks instead of widening the page; a word that fits never breaks. Headings
keep `normal` above 40rem, because at 1440 a tied heading in the 15rem label
rail ("and something to watch") runs into the gutter beside it and broke
mid-word when allowed to. The chip lost `white-space: nowrap`: an inline-block
is never split across lines anyway. The phone nav wraps instead of scrolling:
one row whenever the four fit, a second row only where they cannot, so nothing
hides.

After: 0 page views wider than the window in both engines at all 12 sizes. Old
and new builds photographed with motion off at 1920, 1536, 1440, 768, 414, 390
and 320 (`shots.mjs`, `pixdiff.py`): nothing moved at 390 and up beyond image
noise; every page at 320 is 36 px taller, the nav's second row. The new screen
test `@narrow-and-large-text` walks every route at 7 sizes; it failed on the
old styles with 43 page views too wide and passes now. After pictures for the
issue are in `docs/issues/assets/0022/`.
