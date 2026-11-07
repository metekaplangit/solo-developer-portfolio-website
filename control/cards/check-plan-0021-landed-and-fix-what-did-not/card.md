# Check plan 0021 landed, and fix what did not

bump: patch
unrendered: test tooling only — the smooth probe's CPU reading; no page the site serves changed

Plan 0021's loop card, after cards A to E (v0.67.1 to v0.67.5).

What each card left, checked on 2026-11-07 against main:

- A (issue 0027): `grep -rn "Applications/Google Chrome" scripts tests`
  prints nothing. Every tool takes its browser from `scripts/browsers.mjs`.
  With no browser variable set, the screen suite, capture, the wrap-engines
  probe, the storm (in card C) and the smooth probe all ran in Playwright's
  Chromium.
- B (issue 0015): left open, honestly. The Tried by line and the Evidence name
  the reading, 315px needed against a 240px rail, and the 2 choices that are
  the owner's.
- C (issue 0028): closed as not reproduced, both tries in its Closed by line.
- D (issue 0029): no `headline` in `site.ts`. The home page still shows its
  lede, and the new test requires every `site` field to be read.
- E (issue 0030): PRODUCT.md's Users section no longer says Mac-only, "the
  person behind it" or single-audience.

The seam no card owned: card A pointed the smooth probe at Playwright's
Chromium, but its CPU reading still picked out "its own" processes by the name
"Google Chrome" plus `--headless` or `Helper`. That matches the owner's real
Chrome helpers, so the probe's CPU figures could include the owner's browser.
Fixed: it now counts only the processes descended from the probe itself.
Matching Playwright's cache instead was tried first; it counted other
sessions' test browsers, reading 9, 76, then 196 CPU-seconds a minute. With
the process tree it reads 7.2 CPU-seconds in a minute of `hold`. Card A's test
gained a rule that no tool picks out processes by the Chrome name, seen red on
the smooth probe first, then green.

Proof: `npm run headless` exit 0 (195 unit, 87 built-output). Screens `@home`,
`@about`, `@support` and `@waypost-words` passed. `smooth-probe.mjs hold
--minutes 1` exit 0.
