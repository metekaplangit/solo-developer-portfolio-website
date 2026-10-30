# 0013 Headless Chrome quits when a site page is scrolled

- Severity: high
- Reach: player
- Area: every page
- Found by: session (plan 0008, card E)
- Filed: 2026-10-29
- Tried by: —
- Closed by: not a defect, v0.66.13, card scrolling-a-site-page-no-longer-makes-chrome-quit

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

## Closed

Not the site. Card `scrolling-a-site-page-no-longer-makes-chrome-quit`, 2026-10-30, Chrome 156.0.8078.76, every route in
`scripts/routes.mjs` at 1536 and 414 beside 2 controls served by the same server (`scroll.mjs` in that card's workshop):

- Try 1, the steps as filed (`scrollTo` in 100 px steps), 2 runs: a blank page with no site code, never scrolled, quit 4 of 4 times
  (0.8–5.8 s after launch); the plain 20000 px page quit 1 of 4; site pages 8 of 48, at random depths and on different pages each run.
- Try 2, the way a person scrolls (mouse wheel, 100 px a notch), 1 run: blank page 2 of 2, plain page 0 of 2, site pages 2 of 24.

The browser goes away whether or not a page scrolls and whether or not site code is loaded, so it is this machine's headless
Chrome (also measured by art-project 0001: "exits about 4 s after launch … on a blank page"), not something a visitor's browser
meets on these pages.
