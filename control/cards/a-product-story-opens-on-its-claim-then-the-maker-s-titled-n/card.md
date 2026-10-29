# A product story opens on its claim, then the maker's titled note

bump: patch
screen: @sole-focus
screen: @magic-notes
screen: @waypost-words

Card C of plan 0009, from pick 4 of retouch-project 0003. The story band opened
twice and led with neither: on Sole Focus a 13px faint caption titled the
maker's note, and on both Mac products the description's first paragraph sat
unlabelled in the prose column with the rail empty beside it.

The first paragraph is now the story's claim, across both tracks from the rail's
edge at 24px in `--text-strong`, capped at 40ch. The maker's note follows as the
first section, its title at 24px strong over the same two-segment rule every
section below uses. Waypost Words opens on a heading, so it has no claim and is
unchanged (3283px tall at 1440 before and after).

The retouch built this with CSS `order`, which moves only the picture: a screen
reader and the Tab key would still have met the note first (MDN, `order`,
modified 2026-04-20; `reading-flow` is not Baseline). So the page splits the
claim off the description's rendered HTML instead, and the claim, the note and
the rest sit in the page in the order they are read; no `order` is left. The
Markdown has no components, so `entry.rendered.html` is all `<Content />` drew,
and the files under `src/content/products/` are untouched. A `test:dist` check
reads every product page and fails a story that opens on a paragraph without
the claim first, or a note out of place; seen red on the unchanged page
(magic-notes, no claim), green now.

Measured on this build at 1440: Sole Focus 4195 → 4221px, Magic Notes 4567 →
4610px, matching the retouch copy.
