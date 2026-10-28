# The Get panel holds its dates, and More apps shows sibling products as tiles

bump: minor
screen: @magic-notes
screen: @sole-focus
screen: @waypost-words

Card D of plan 0003, from pick 4 of retouch-project 0001. The end of a product
page was three loose pieces: a panel with a title and a button, the release dates
floating 40px under it as an unrelated block, and "More apps" as a bare word.

The Get panel is now one surface. Its top holds the product's icon at 56px,
"Get <name>", the facts line and the store buttons; its lower edge holds the
dates and the privacy and support links, on a hairline and a slightly deeper
tone so they read as the panel's small print. The first available store link is
the shared `DownloadButton`, in the product's hue, the same button the page
header uses; any others stay secondary, and a product with no store link still
says "Not yet available — check back soon." The title is fluid
(`clamp(var(--text-xl), 5.5vw, var(--text-2xl))`) because a fixed size wrapped
"Get Magic / Notes" at 390.

"More apps" uses the `ProductTile` from card A in the same even-row tile grid,
lazy, since it sits at the foot of the page. A product with no sibling of its
kind, Waypost Words today, shows no such section, as before.

Proved by: Headless Suite Testing, complete and green; Scoped Suite Testing on
@magic-notes @sole-focus @waypost-words, 14 of 14; after pictures at 1440 and 390.

unproven: a real phone — the coarse-pointer pass is an emulated one
