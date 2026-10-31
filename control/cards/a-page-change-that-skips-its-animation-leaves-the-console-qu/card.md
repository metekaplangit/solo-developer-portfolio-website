# A page change that skips its animation leaves the console quiet

bump: patch
unrendered: only the inline page-head script changes — a skipped page change stays out of the console, and its opening no longer waits for a hand-off that never ran; that is timing a still picture cannot show
unproven: real Safari and the installed Chrome — every run here drove Playwright's Chromium and WebKit

Closes issue 0023.

Plan 0019, card E. Re-checked as filed, in Playwright's own Chromium: the
chaos storm, seed 1, logged hundreds of `Transition was aborted because of
invalid state` page errors (Page already revealed, ViewTransition opt-in
disabled, Document hidden, Viewport size changed) — 278 invariant breaks.

`which.mjs` and `chaos-which.mjs` in this workshop tag the transition objects
each page is handed in `pageswap` and `pagereveal` and name the promise behind
every uncaught rejection. Two causes:

- The site's own `pagereveal` script reads the arriving transition, and when
  the browser skips it, its `ready` rejects with nothing catching it ("Viewport
  size changed"). The script now catches it, and takes the `vt-in` mark off
  again, so the opening plays at once instead of waiting `--dur-leave` for a
  hand-off that never ran — what the CSS comment always said the mark meant.
- Most of the storm's errors come from transitions Chrome aborts without
  handing them to any page: `seen none`, no `pagereveal` ever sees them, so no
  page can catch their promise. Nothing about this was found in Chrome's docs,
  the Astro tracker or the user's other projects. The same script now marks
  handled only rejections the browser names as a transition's abort or skip
  (`InvalidStateError` or `AbortError` whose message names a transition); every
  other rejection still reaches the console.

The script's CSP hash in `astro.config.mjs` moved with it. `chaos-probe.mjs`
now honours `PUPPETEER_EXECUTABLE_PATH` before the installed Google Chrome.

After, same storm: 1 invariant break, 0 page errors (the 1 left is
`Not allowed to launch 'mailto:…' because a user gesture is required`, also in
the before run, a storm artifact). WebKit storm seed 2: 0 transition errors.
That WebKit run also found 21 breaks that are card D's prefetch, not this card:
with prefetch switched off the same storm finds 0. Plan 0019's loop card owns
that seam.

Three cheap tests in the built-output suite run the exact script every built
page ships, in `node:vm` with stand-ins, no clock: it is on every page; a
skipped transition's rejection is caught and the mark dropped, a running one
keeps the mark, a plain load gets none; and the browser's own skip notices are
quieted while a TypeError, a bare InvalidStateError or AbortError with no
transition in it, a string and `undefined` all stay loud. Each part seen red
on the unfixed build first. `npm run headless` exit 0 (150 unit, 59
built-output).
