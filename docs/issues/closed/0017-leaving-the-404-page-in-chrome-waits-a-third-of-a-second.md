# 0017 Leaving the 404 page in Chrome waits a third of a second

- Severity: medium
- Reach: player
- Area: not-found page
- Found by: smooth-project 0001
- Filed: 2026-10-29
- Tried by: —
- Closed by: v0.66.17, card leaving-the-404-page-draws-the-next-page-at-once

Doubt: the fixed wait was only seen in headless Chrome 156; whether a
visitor's Chrome pays it too is not known, so Reach is rounded up to `player`.

## What happens
Clicking any link on the 404 page holds the old page for about 310–325 ms
before the next page draws its first frame, even when the next page comes
from the cache in 5–20 ms. Every other page change on the site draws within
10–60 ms of its response.

## How to see it
`node scripts/probe/smooth-probe.mjs drive` against https://metkapstudio.com:
the `404 → home` line, `toFirstFrame` against `toResponse`, with a 310–325 ms
long frame at the start of the new page.

## What should happen
The next page draws as soon as it arrives, as it does from every other page.

## Evidence
- Live, headless Chrome 156, 3 lanes: 404 → home first frame at 530, 330 and
  344 ms against responses at 220, 8 and 18 ms; the long frame did not grow
  under a 4× CPU slowdown, so it is a fixed wait, not work.
- The same fixed wait appears on every page change when the back-forward
  cache is switched off (`--no-bfcache` control, 313–329 ms against 13–28 ms),
  and a 404 response is a page Chrome does not keep in that cache.
- Safari's engine (WebKit 26.4): 404 → home first frame at 84 ms.

## Closed

Card `leaving-the-404-page-draws-the-next-page-at-once`, 2026-10-30, measured with that card's `leave.mjs` (built site served the
way GitHub Pages serves it, a 404 status for an unknown address; Chrome 156 with the back-forward cache on, as a visitor's is).

- Before, the header's home link from the 404 page: first frame 373–399 ms after the click, against a response at 55–81 ms, 5 of
  5 runs with a view transition. Leaving About the same way: 60–80 ms.
- Cause, one change per case: with the 404 page's view transition removed, opted out in CSS, or skipped in `pageswap`, the
  wait was gone (first frame 63–132 ms). Served with status 200, the old page went into the back-forward cache and the wait was
  gone too. Chrome never keeps a 404 response in that cache, and a transition out of a page it cannot keep held the next frame.
- Fix: the not-found page alone skips its view transition on leaving (`leaveWithoutTransition` in `BaseLayout`, a one-line
  `pageswap` listener). After, 5 runs each: 404 → home 105–119 ms (main link) and 60–92 ms (header) to first frame, 39–69 ms responses.
- Not re-measured on the live site by this card; that runs after deploy.
