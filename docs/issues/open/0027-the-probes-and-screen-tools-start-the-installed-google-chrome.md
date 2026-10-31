# 0027 The probes and screen tools start the installed Google Chrome when no browser path is set

- Severity: high
- Reach: test-only
- Area: test tooling
- Found by: session (plan 0020, card A)
- Filed: 2026-10-31
- Tried by: —
- Closed by: —

Doubt: no visitor ever meets it, so it could read `low`; it is `high` because
what stops is the owner's own Chrome — Cold Turkey quits every Chrome on a
profile without its extension within seconds, and the owner's goes with it.

## What happens
9 tools launch `/Applications/Google Chrome.app` whenever `PUPPETEER_EXECUTABLE_PATH`
is unset, or always: `scripts/capture.mjs`, `tests/screens/site.spec.ts`, and
`scripts/probe/` chaos, smooth, hunt, inspect, image, height and wrap-engines
(the last 4 name the installed Chrome with no way round it). Plan 0020's card A
ran the chaos storm without the variable for 7 minutes on 2026-10-31; the
browser closed under it part-way through config 5, which reads as Cold Turkey
quitting it. Plan 0019's loop card recorded the same fallback in `capture.mjs`
and the screen suite.

## How to see it
`grep -rn "Applications/Google Chrome" scripts tests`

## What should happen
Every tool runs only Playwright's own browsers (Chrome for Testing, Chromium,
its headless shell, WebKit), and refuses to start when it cannot find one,
rather than falling back to the installed Chrome.

## Evidence
- The grep above on 2026-10-31: 9 files.
- The first storm run of plan 0020's card A, read in the session (its file was
  overwritten by the re-run in Playwright's Chromium): 14 "Target page, context
  or browser has been closed" readings from step 1924 of config 5, with no
  `page crashed` line.
