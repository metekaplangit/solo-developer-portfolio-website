# Check plan 0019 landed, and fix what did not

bump: patch
unrendered: only page-head markup changes — a speculation rule replaces Astro's prefetch script, and the skip-notice filter learns Chrome's timeout; nothing on screen moves
unproven: real Safari and the installed Chrome — every browser driven was Playwright's Chromium (Chrome for Testing) or WebKit
unproven: the live site, until this version deploys

Plan 0019, card F, the loop card for resolve-issues 0003's 5 cards. Two things
needed fixing, both at seams: card D's prefetch broke Safari's console, and
card E's filter missed one kind of skip.

Each card's outcome, held against the built site:

- A (v0.66.25): issue 0002 left open with its Tried by filled; nothing in the
  site changed.
- B (v0.66.26): all 4 policies' "What we collect" rows name their own
  subject; its built-output test passes.
- C (v0.66.27): the not-found page names no canonical or `og:url` and carries
  `noindex`; every other page's canonical is a page the build serves.
- D (v0.66.28) and E (v0.66.29): below.

The seam D left: a WebKit storm (seed 2) found 21 breaks with D's prefetch on
and 0 with it off — Astro's prefetch falls back to `fetch()` where
`<link rel="prefetch">` is missing, and every page change that cut one short
logged "Fetch API cannot load … due to access control checks" — new console
noise in the very place card E was quieting it. D's outcome now comes from one
speculation rule in `BaseLayout` instead: every same-origin link fetched as
soon as a page loads (`eagerness: immediate`), the header link to the page
already open left out, no script at all, its CSP hash beside the others.
Astro's `prefetch` setting is gone. `prefetched.mjs` here confirmed through
Chrome's Preload domain that every header link is held ready under the site's
CSP. `webkit-https.mjs` served the build over HTTPS, as the live site is, with
quick presses cutting page changes short: WebKit and Chromium each prefetched
all 11 pages, and both consoles stayed empty. Over plain http WebKit refuses
the rule with "Prefetch request denied: URL must be secure (HTTPS)", which
only the chaos probe's own server ever is, so the probe now skips that line.

The seam E left: replaying the storm turned up "Transition was aborted because
of timeout in DOM update", a `TimeoutError` E's filter let through. The filter
now covers InvalidStateError, AbortError and TimeoutError, still only when the
message names a transition.

After, on the finished state: page changes 10–46 ms on desktop and 13–60 ms
on a throttled phone with a 250 ms server (264–291 ms before plan 0019), view
transitions still running; WebKit storm seed 2: 0 breaks; Chromium storm
seed 1: 0 breaks (278 before E). `npm run headless` exit 0 (150 unit, 59
built-output); 8 screens passed by hand, in Chromium: `@prefetch @home
@not-found @privacy-index @privacy-waypost-words @every-route @page-top
@button-press`.

Cheap tests: D's built-output pair now holds that every page carries the one
speculation rule and that no page ships a script-driven prefetch, and the
`@prefetch` screen test reads Chrome's Preload events — both seen red on D's
version, green after. E's notice test gained the timeout, seen red first, and
a bare TimeoutError stays loud.

Every fix in the plan left its test: 0020 and 0021 in `tests/dist.test.ts`,
0018 there and in `@prefetch`, 0023 in `tests/dist.test.ts`. Each was seen red
in its own card or here.

Left alone, filed: a Chromium storm (seed 3) once found the Waypost Words rail
resting between two shots; 3 replays did not repeat it, and nothing in this
plan touched the rail — issue 0026.

Bad news from card B: its pictures and its 6 screens ran in the installed
Google Chrome, because `capture.mjs` and the screen suite fall back to it when
`PUPPETEER_EXECUTABLE_PATH` is unset. Every run after that set it.
