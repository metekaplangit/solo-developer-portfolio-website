# The 4 privacy policies read as one ruled document

bump: patch
screen: @privacy-sole-focus
screen: @privacy-waypost-words
screen: @privacy-index

Plan 0007, card A, from retouch-project 0002 part 3. Every policy — the
website's and the 3 products' — renders through `PolicyArticle.astro`, and each
of its sections was a separately lifted card: 10 of them on Sole Focus's page,
with a mono date line on top and the body at 15 px, smaller than the rest of
the site. A legal page read like a settings screen.

The sections are now ruled rows on the stage: a hairline above each and one
under the last, the title on the 15rem label rail from 56rem up with the body
beside it in the `--measure-mid` column, and the body, notes and lists at
`--text-base`. The date and scope line is in the site's sans at `--text-sm`.
Titles stay `h2`, so the structure the App Store's policy rule leans on is
unchanged, and no word of any policy moved.

Measured on the built site at 1440: `/privacy/sole-focus/` has 0 `section.card`
(10 before), all 8 plain paragraphs and 11 list items at 17 px, 10 titles at
20 px; page heights 2215 (Sole Focus), 2598 (Magic Notes), 2161 (the index),
the same as the retouch copy's after. At 390 the rows stack title over body
with no sideways scroll. The website policy on the privacy index was looked at
whole at 1440 and reads as one document above its 3 product tiles.
