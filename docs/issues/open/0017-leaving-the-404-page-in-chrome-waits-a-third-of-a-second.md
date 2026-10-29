# 0017 Leaving the 404 page in Chrome waits a third of a second

- Severity: medium
- Reach: player
- Area: not-found page
- Found by: smooth-project 0001
- Filed: 2026-10-29
- Tried by: —
- Closed by: —

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
