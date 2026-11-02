# The home page says plainly what we make and how to reach us

bump: patch
screen: @home
screen: @about
screen: @support
unproven: the page as Cloudflare serves it, until the deploy has landed

The owner went through the home page sentence by sentence on 2026-11-02, accepting
a suggestion or keeping what was there, and asked that the studio speak as we
rather than as one named person. The agreed wording is in
docs/work/text/0001-2026-11-02.md, and this card is that list applied.

The line above the headline, the line under it and the search description now say
what we make and what a reader can check. The motto stays. The second hero button
reads Newest Game or Newest App. The Waypost Words summary names lightning instead
of "seven to unlock, four to carry". The 8 picture captions and The deal section
are gone, the footer lost "Built as a static site", and the GitHub link to the
owner's personal account is gone from the footer and About. The hidden data for
search engines no longer names a founder. This last one was never brought to the
owner as a sentence; it follows from the instruction to stop using the name.

The home page's 3 blocks were the first sentence of each section of the product's
prose, cut by code, which is how "Lightning reveals a letter." came to sit under a
heading about seven skills. They are now `homeStatements` on the product file,
written by hand, and the fast checks fail if the newest release has none. That is
one more field to fill when publishing, and CLAUDE.md says so. `firstSentence` and
`bodySections` had no other caller and went with their tests.

About, Support, the product pages and the rest still say "I" and name the owner
until their own turn. Each page joins the list in tests/dist.test.ts when its
wording is agreed. That list checks for first-person words, a person's name, and
buttons of 1 or 2 capitalised words, with "View <product>" as the owner's kept
exception. Those tests were seen red on the old build. An older test that pinned
"for Mac, iPhone and iPad" now pins the owner's newer rule instead.

Pictures and the screen tier used Playwright's Chromium through
PUPPETEER_EXECUTABLE_PATH, because of issue 0027.
