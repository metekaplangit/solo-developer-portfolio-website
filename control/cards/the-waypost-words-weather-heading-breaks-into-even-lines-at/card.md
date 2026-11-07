# The Waypost Words weather heading breaks into even lines at desktop widths

bump: patch
unproven: the fix itself — it needs the owner's choice of new words or a wider label rail

Plan 0021, card B, for issue 0015. Issue 0015 stays open: no layout change
this card was allowed to make closes it.

Re-checked as filed on 2026-11-07 with `measure-headings.mjs` in this folder,
in Playwright's Chromium. "Weather with a mind of its own" sits in the story's
240px label rail (15rem) and needs 315px to sit on 1 line. The tie rule leaves
it 2 places to break, after "Weather" or after "mind". `balance` keeps it to 2
lines, so it always splits as "Weather with a mind / of its own", 211px over
99px. That holds at 1024, 1280, 1440, 1536 and 1920; the issue had named only
1536 and 1920. In the same rail, "Something waiting on the road" reads 193/116
and "Seven skills for when you're stuck" 120/220.

The words are fixed: the owner said "Stay." for this heading on 2026-11-02
(docs/work/text/0001-2026-11-02.md, row 11). That leaves 2 ways to close it,
and neither is this card's to take. A wider rail at desktop widths would put
every story heading on 1 line, but 15rem is a site-wide token used by 8 grids:
the product pages, the privacy pages, About, the maker note and the shared
bands. Widening it is a layout change to every page. A rule for this heading
alone is the shape the plan ruled out. The Magic Notes half of the issue is
still mended: at 414 wide its opening paragraph's lines end on "it.", "was."
and "step".

The reading is written into issue 0015's Tried by line and Evidence, so the
next run does not spend a card learning it again.
