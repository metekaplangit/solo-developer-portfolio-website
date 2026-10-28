# check plan 0005 landed, and fix what did not

bump: patch

Plan 0005's loop card. Cards A–E closed as v0.62.6 to v0.62.10; nothing was
left open or abandoned, and nothing needed fixing.

What was checked, on a build with Astro's content cache cleared
(`astro build --force`, because of issue 0008): every route measured in
headless Chrome at 1920, 1440, 390 and 320. Interface text has 28 bad breaks at
the 3 standard sizes, against 173 before the plan and 31 in the text report's
copy; no page overflows, nothing is cut off, and uneven siblings went from 29
to 27. Each card's outcome is on the page: the home over-line, intro and "See
Magic Notes" button; the 3 two-line summaries; the one reply wording on About
and every product page, both trust-line links still opening About and
Support; the 12 two-line Magic Notes features. The home page at 1440 was
looked at whole, top to the first product band.

Seams: B, C and D's strings all pass through card A's `tie()` and come out
with no bad break and no run over the 320px budget (dist T4 green); T1 and T2
green. Card A's new unit tests exist and were seen red against the old rule.

Left as lines: the 28 remaining breaks are issue 0007's; the Apps & Games
summaries at 390 take 3, 3 and 4 lines in a stacked column, as uneven as
before; the maker-note sign-off D reworded renders on no page today.
