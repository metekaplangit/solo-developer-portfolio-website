# Product, Apps and About text breaks where a reader would

bump: patch
screen: @home
screen: @apps
screen: @sole-focus
screen: @magic-notes
screen: @waypost-words
screen: @about
screen: @privacy-index

Plan 0017, card C, from resolve-issues 0001. Closes issue 0007. Issue 0015 is
half mended and stays open.

`breaks.mjs` in this workshop reads where every line of interface text ends on
every route at 1920, 1536, 1440, 414 and 390 px. It flags a line ending on a
word that points forward, a line stranding a new phrase's first 1 or 2 words,
and a 2-line heading whose second line is under 60% of its first. It was
calibrated against 2 planted faults first. Most of issue 0007's 19 rows were
already gone, rewritten by plans 0008 to 0010. 16 pieces still broke badly.

Mended with new words, meaning and facts unchanged: the Apps & Games closing
line ("Nothing is announced here until you can install it — get in touch to
hear when that is", the link now one unbreakable unit); About's "Privacy
first" card, now one sentence; the privacy index's retention line; and the
Magic Notes story line that ended on "where" (issue 0015), which now "goes no
further than an honest answer". Mended with ties: the home page's screenshot
captions ("A meteor opens a / square") and its statement headings ("Seven
skills, and / something to watch") never went through `tie()`; now they do.

The lasting test is a new rule in the screen suite's per-route probe. On every
route except a product's legal policy, at 320, 390, 768 and 1440 and on the
phone, no line may end on a forward word, strand a new sentence's or dash-led
phrase's first 1 or 2 words, or leave a 2-line heading's second line under 60%
of its first. Run against the unfixed pages, it failed on home, Apps & Games,
Magic Notes, About and the privacy index. It then found 5 more breaks at 320
and 768 that the issue's widths had missed, and those were mended too: Sole
Focus's Zen and Study modes and Magic Notes' "exact, or clearly marked with ≈"
each became their own paragraph, "archive what" became "archive the sheets",
and each "Get <product>" heading keeps the product's name whole. All 12 route
tests pass now.

Left, and said so. The Waypost Words heading "Weather with a mind of its own"
is the game's App Store words. In the 240 px label rail its ties allow only
"Weather with a mind / of its own", and every even split would end on "with"
or "a", so no layout can mend it. Issue 0015 stays open for the owner's words,
and the screen rule carries it in `BREAKS_KNOWN`. Breaks after a comma or a
colon count as correct: a series ("percentages, cooking measures, times") and
a term list ("Reveal a letter: one letter / from an answer…", also App Store
words) break there properly.

Pictures: `docs/issues/assets/0007/02-about-heading-after.png`,
`docs/issues/assets/0015/03-magic-notes-opening-390-after.png`, and
`docs/issues/assets/0015/04-weather-heading-1536-unchanged.png`.
