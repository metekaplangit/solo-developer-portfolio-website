# The privacy overview starts on the same page-top line as every page

bump: patch
screen: @privacy-index
screen: @page-top

Closes issue 0010

Issue 0010 re-checked as filed (its 404 half was fixed by plan 0009): `top.mjs`
in this workshop read each route's first text line below the header. Every
other page opens on a small line — an eyebrow, a kicker or a back link — at
50–51 px (1440) and 34–35 px (390). `/privacy/` opened straight on its 68 px
title, whose glyphs rise above their own box: 40 and 27 px. The likely cause the
issue named was the right one.

The site-wide policy now opens the way About and Support do: a "Privacy"
eyebrow above the title, through a new optional `eyebrow` on `PolicyArticle`.
Product policies keep opening on their back link. `/privacy/` now reads 51 and
35 px, the same as About and Support.

`PAGE_TOP_KNOWN` in the screen suite listed `/privacy/` as this issue; it is
empty now. With the line removed, the page-top test failed on the old build at
every width ("@1440 /privacy/: 40px, the line is 51px") and passes on the new
one. That test shared `@every-route` with the title-indent test, and the
control takes one test per tag, so it now carries its own, `@page-top`. After picture: `docs/issues/assets/0010/02-privacy-top-1440-after.png`.
