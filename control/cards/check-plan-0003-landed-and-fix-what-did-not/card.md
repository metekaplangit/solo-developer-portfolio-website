# check plan 0003 landed, and fix what did not

bump: patch

The loop card for plan 0003 (`docs/plans/0003-2026-10-28.md`), covering the five
cards it built: support tiles (v0.59.0), privacy tiles (v0.60.0), the ruled
feature list (v0.61.0), the Get panel and More apps (v0.62.0), and the ruled
common questions (v0.62.1). Its bar is three questions: does each part work as
planned, is any of it broken, does the site still stand up.

Answered by `walk.mjs` in this folder, which walks a visitor's path through the
built site at 1440 and 390: support, a tile clicked through to its product,
each of the three product pages, More apps clicked from Sole Focus, then the
privacy index and a policy tile clicked through. 100 readings, 0 bad:

- Every tile, on all three pages that use it, opens a page that exists, and is
  at least 80px tall, well over the 44px floor.
- Support's tiles load their icons eagerly; the walk confirms card A's fix holds.
- Each feature list fills its rows evenly: 12 claims in 4 rows of 3 at 1440, one
  column at 390. Text is 17px. Each index is in its own product's hue, and none
  leaked into another product's page.
- Every Get panel holds its dates inside it, and its Download button is 52px and
  goes to the same App Store page as the header's.
- Each common question sits on its own line (Magic Notes 3, Sole Focus 2).
- Every policy tile keeps its date whole ("updated 3 August 2026", no break).
- No page scrolls sideways at either width.

Where the cards meet: card A's tile carries B's hint and D's lazy default
unchanged; C, D and E share one page file, and its built form is byte-for-byte
the blob the retouch run measured (`f0302e9`). Nothing needed fixing.

The walk itself took three tries to make trustworthy, and none were the
product's fault. A single browser died part way, and so did a fresh browser per
page: about 1 load in 3 detaches at random on this machine, already recorded in
`scripts/capture.mjs`. Each load now gets 3 tries of its own, and 7 retries
were spent across the two widths.

Proved by: Headless Suite Testing, complete and green; the five screens the
plan changed run by hand with `node scripts/rendered.mjs`, all green; the walk
above. The card names no `screen:`, because it changed none.

unproven: U+2011 in Safari with SF Pro — no Safari here
unproven: a real phone — the coarse-pointer pass is an emulated one
