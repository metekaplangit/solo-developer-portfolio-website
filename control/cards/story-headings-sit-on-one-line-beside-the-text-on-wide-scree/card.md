# Story headings sit on one line beside the text on wide screens

bump: patch
screen: @waypost-words
screen: @magic-notes
screen: @sole-focus
screen: @about
screen: @privacy-sole-focus
screen: @privacy-index
screen: @apps
screen: @home
screen: @support
screen: @page-top
unproven: the live site, until this card's deploy has run

Closes issue 0015. The owner chose to widen the column (2026-11-07).

The label rail, the left track every two-column section shares, was 15rem in
8 grids: the shared opening, the ruled rows, the product page's features and
story, the maker note, the privacy article and About. It is now one token,
`--rail` in `global.css`: 15rem, and 22rem from 80rem (1280px) up. Every rail
grid reads it, so the hairlines still meet across both tracks on every page.

Why 22rem: measured in Playwright's Chromium, "Weather with a mind of its own"
needs 315px on 1 line, and the longest story heading, "Seven skills for when
you're stuck", needs 345px. At 352px every story heading on the 3 product pages
sits on 1 line at 1280, 1440, 1536 and 1920. Before, Weather split 211 over
99px, "Something waiting on the road" 193/116, and 4 more ran to 2 lines. At
1440 and up the story's prose keeps its full 47rem measure. The features list
and the openings' columns give up the 112px, so some feature lines now wrap to
2 balanced lines. Below 1280 nothing moves: the 390 pictures are pixel-identical
on 20 of 24 routes, and the rest differ by noise of at most 0.05%.

The cheap test is the screen suite's own break rule. `BREAKS_KNOWN` no longer
exempts the heading at every width. With the exemption gone and the old CSS,
`@waypost-words` was red at 1440 and 320, then green at 1440 with the rail. 320
is still red, because a 280px phone column cannot hold 315px. That is filed as
issue 0031, and the exemption now names 320 only.

Proof: `npm run headless` exit 0 (195 unit, 87 built-output). 14 screen tests
covering every route plus @page-top and @narrow-and-large-text passed. Before
and after pictures of all 12 routes at 1440 and 390 are in this folder.
