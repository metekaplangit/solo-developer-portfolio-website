# Every probe and screen tool runs only Playwright's own browsers

bump: patch
unrendered: test tooling only — no page the site serves changed; the screen suite's @home and the capture script were run to prove the tools still drive a browser

Closes issue 0027.

Nine tools could start the installed Google Chrome: the capture script, the
screen suite, and the chaos, smooth, hunt, inspect, image, height and
wrap-engines probes. Most fell back to it when `PUPPETEER_EXECUTABLE_PATH` was
unset; four named it with no way round. Cold Turkey quits every Chrome on a
profile without its extension, and the owner's own window went with it.

All nine now take their browser from one place, `scripts/browsers.mjs`. It finds
the newest Chromium (Chrome for Testing) in Playwright's cache, by revision
number rather than by name, falls back to Playwright's headless shell, and finds
WebKit the same way. It honours `PUPPETEER_EXECUTABLE_PATH` only when that points
into an automation cache. Anything else, the installed Chrome above all, is
refused with a message saying how to install Playwright's browsers. When none is
found the tool refuses to start, which was the old behaviour for a missing
browser anyway.

The cheap test is `src/lib/automation-browsers.test.ts`. It reads every tool
under `scripts/` and `tests/` and fails if one names an installed Chrome or
Chromium, or passes an `executablePath` without importing the shared lookup. It
also pins the lookup itself: it refuses outside paths, refuses an empty cache,
picks the newest revision by number, and falls back to the headless shell. Seen
red first, 18 of 30 on the unfixed code (both rules failing in all 9 files),
then green.

Proof run with no browser variable set: `npm run headless` exit 0 (174 unit,
87 built-output). The screen suite's `@home` passed. `node scripts/capture.mjs`
photographed home at 1440 and 390. The wrap-engines probe ran in Playwright's
Chromium and WebKit. Pointing the variable at the installed Chrome made capture
refuse with exit 1. `grep -rn "Applications/Google Chrome" scripts tests` now
prints nothing (9 files before).
