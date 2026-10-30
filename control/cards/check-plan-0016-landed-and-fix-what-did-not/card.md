# Check plan 0016 landed, and fix what did not

bump: patch

Card C of plan 0016, the loop card. Bar: does what was planned work, is any of it
broken, does the site still stand up. Nothing needed fixing.

Card A (v0.66.10): one route table in `scripts/routes.mjs`, read by the screen
suite, the capture script and the live tier, none keeping a list of its own. Its
two built-output tests were each seen red before they were trusted — one on the
unfixed screen suite, one by cutting `/privacy/magic-notes/` from the table.
Taken along a real path here: `node scripts/capture.mjs` with no tags
photographed all 12 pages at both widths, 24 pictures, the Magic Notes policy
among them; `node scripts/live.mjs` (run in card A) fetched 12 of 12, red only for
the Cloudflare beacon of issue 0002. Issues 0019 and 0003 sit in `closed/`.

Card B (v0.66.11): both galleries on one `steer()` with the arithmetic in
`src/lib/rail.ts` and its 13 unit tests. Pressed by hand in the browser pane: 3
quick taps on Next on `/apps/sole-focus/` went from picture 1 to 4, counter
"4 / 5"; 2 quick taps on the Waypost Words rail reached "7–10 of 10" with Next
switched off; with focus on Previous, 2 ArrowLeft paged back to "1–4 of 10" with
Previous switched off.

Seams: a card naming `@magic-notes` does not also pick up the new
`@privacy-magic-notes` — the control matches whole title words, and the capture
filter needs the `@` — and card B's tagged capture took exactly its 6 pictures.
Card B's close ran the 6 gallery and product screens plus
`@privacy-magic-notes`, so they were not run again here.

Found in passing and left, since plan 0016 did not cause it: a gallery arrow
that switches off at the end drops keyboard focus to the page, so the arrow keys
stop working — present at `f571749` too. Filed as issue 0025.
