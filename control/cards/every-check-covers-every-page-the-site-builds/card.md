# Every check covers every page the site builds

bump: patch

Card A of plan 0016, from evaluate-project 0001. The screen suite, the capture
script and the live tier each wrote the site's routes out by hand, and all three
disagreed with the build: the screen suite and the captures had no
`/privacy/magic-notes/`, and the live tier had neither Waypost Words page — the
two the game links to and App Review opens (issue 0019). Comments around two of
the tables still counted nine routes (issue 0003). A fourth hand list in
`tests/dist.test.ts` was the only one that matched the build.

There is now one table, `scripts/routes.mjs`, with each route's path, screen tag,
title name and picture file, and a `builtFile()` helper for where `dist/` puts
it. All three checks import it and keep no list of their own. The built-output
suite replaces its hand list with two tests: "lists every page the build makes in
the one route table, and nothing it does not", which reads the HTML files in
`dist/` and allows only the two Wander Words forwards besides the table; and "has
every check that covers every page read that table", which fails if any of the
three declares its own `ROUTES`. The second was seen red on the unfixed screen
suite; the first was seen red by cutting `/privacy/magic-notes/` from the table,
naming that page. The Magic Notes policy got its screen test,
`@privacy-magic-notes`, and is now photographed with the rest.

Measured after: `npm run headless` exit 0 (48 built-output tests);
`node scripts/rendered.mjs @privacy-magic-notes @every-route` exit 0, 19 of 19;
`node scripts/live.mjs` reads "12 of 12 route(s) fetched", red only for the
Cloudflare beacon of issue 0002, as it should be. The screen tests stay one
literal `test()` line per route, because the control reads tags from titles; the
existing guard still fails a table route with no title. The audit probes under
`scripts/probe/` keep their own lists on purpose — each is a deliberate subset or
adds a missing page — and were left alone. Closes issue 0019. Closes issue 0003.
