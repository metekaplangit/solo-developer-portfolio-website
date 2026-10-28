# Lines across the site break where a reader would break them

bump: patch
screen: @home
screen: @apps
screen: @sole-focus
screen: @magic-notes
screen: @waypost-words
screen: @about
screen: @support
screen: @privacy-index

Plan 0005, card A: piece 1 of text-project 0001, the wrap rule.

Short copy, summaries, cards and list items now balance their lines in
`global.css`, and the reading prose under `.sec-body` keeps `text-wrap: pretty`.
`tie()` binds more than it did: a second set of forward-pointing words ("own",
"each", "every", "when", "which" and the rest), a figure to the word it counts,
the first 2 words of a clause, the word before a dash, and a short hyphenated
word at its hyphen (U+2011). Measured in headless Chrome at 1920, 1440 and 390,
interface text went from 173 bad breaks to 30, with no page overflow at 320.

The text report's version capped the whole run and so, in long chains, refused
the core short words the dist suite's T1 holds the site to — 19 lines failed
it. The fix keeps the original binding pass exactly as it was and adds the new
bindings as a second pass that only joins while the whole run stays inside
`MAX_PAIR`, measuring the run across no-break spaces. 4 unit tests pinned the
old output exactly and now pin the new; 5 new tests cover numbers, clause
starts, dashes, hyphens and the 320px budget, each seen red against the old
rule (the budget test against `MAX_PAIR` raised to 99).

The plan's research note said the site had no wrap rule on body text before
this; that was wrong — `p` already had `text-wrap: pretty`. A stale Astro
content cache also hid the change from product prose until `astro build
--force`; filed as issue 0008.
