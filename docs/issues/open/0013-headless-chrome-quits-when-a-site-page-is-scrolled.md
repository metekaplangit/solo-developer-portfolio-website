# 0013 Headless Chrome quits when a site page is scrolled

- Severity: high
- Reach: player
- Area: every page
- Found by: session (plan 0008, card E)
- Filed: 2026-10-29
- Tried by: —
- Closed by: —

Doubt: only headless Chrome 156 on this Mac was seen to quit; whether a
visitor's Chrome does the same is not known, so Reach is rounded up to
`player`.

## What happens

Scrolling the home page, Magic Notes or Sole Focus down in steps of 100 to
400 px makes the whole Chrome process quit somewhere between 300 and 1600 px.
It happens in both headless modes and with JavaScript switched off. A plain
tall page with no site code scrolls to the end in the same browser.

## How to see it

Serve `dist/` and scroll a page in steps of 100 px with puppeteer-core and
`/Applications/Google Chrome.app` (Chrome 156.0.8078.49). The probe used was
the `scrollTo` loop in
`control/cards/check-plan-0008-landed-and-fix-what-did-not/walk.mjs`.

## What should happen

The page scrolls to its end and the browser stays up.

## Evidence

- Same result on the build of `48c3215`, before plan 0008, so the plan's
  text changes did not cause it.
- The project's screen tests passed on @home, @magic-notes and @sole-focus
  in cards A–D of plan 0008, and a whole-page photo taken without scrolling
  works.
- The browser reports `disconnected`, not a page crash, so the cause inside
  Chrome is not known yet.
