# A link to a page not yet visited answers at once

bump: patch
unproven: real Safari — Playwright's WebKit fetches every page it moves to from the network, even one it has just shown, so it cannot show a cache at work either way
unproven: the live site, until this version is deployed; plan 0019's loop card measures it there

Closes issue 0018.

Plan 0019, card D. Re-checked as filed, in Playwright's own Chromium
(`PUPPETEER_EXECUTABLE_PATH`, never the installed Google Chrome): with `dist/`
served by `serve.mjs` in this workshop — a 250 ms delay on every request and
GitHub Pages' `max-age=600` — `smooth-probe.mjs drive` timed every first visit
to a page at 264–291 ms from the click to the new page's first frame, the
response itself taking 258–271 ms of it.

Astro's prefetch is now on in `astro.config.mjs`, every link, fetched as it
scrolls into view (`prefetchAll`, `defaultStrategy: 'viewport'`). The pages are
8–28 KB of HTML. Astro falls back to fetching on tap for a visitor on data
saver or a slow connection. The client is one 2.5 KB module from the site's own
origin, so the CSP needed no change; `connect-src 'self'` holds.

After, same server, same probe: every page change 10–61 ms to a first frame,
the view transition still running (`vt: true`, the not-found page's skipped
leave unchanged). On a throttled phone (`--weak --width 390`: 4x CPU, 150 ms
RTT on top of the server's 250 ms): 41–61 ms. The server saw 10 requests
marked `Sec-Purpose: prefetch`. WebKit stayed at 268–289 ms both for first
visits and for pages it had already shown, which is the instrument, not the
site — written as unproven above.

`smooth-probe.mjs` took the installed Google Chrome by a hard-coded path; it now
honours `PUPPETEER_EXECUTABLE_PATH` first, as `capture.mjs` and the screen suite
already do.

Two cheap tests, each seen red with prefetch switched off and green with it on:
the built-output suite holds that every page ships the prefetch client and no
link opts out; the screen suite's `@prefetch` loads every route and holds that
each header link's page is fetched without a hover or a tap (red: every route
listed "never fetched", green: 1 passed). `npm run headless` exit 0 (150 unit,
56 built-output).
