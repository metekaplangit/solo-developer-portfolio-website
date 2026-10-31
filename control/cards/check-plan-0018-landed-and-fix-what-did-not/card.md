# Check plan 0018 landed, and fix what did not

bump: patch
screen: @page-top

Plan 0018, card F, the loop card for resolve-issues 0002's 5 cards. One thing
needed fixing, and it was in the proof, not the site: the page-top test raced
the home page's intro.

Each card's outcome, held against the built site:

- A (v0.66.19): the built-output test renders every product and policy body
  with today's wrapping rule and matches what `dist/` shows. Passes.
- B (v0.66.20): `wide.mjs` in this workshop found 0 page views wider than the
  window in Chromium and in WebKit; `@narrow-and-large-text` passes.
- C (v0.66.21): `@page-top` passes with its known list empty. The live privacy
  page serves the "Privacy" eyebrow.
- D (v0.66.22): `@gallery-focus` passes; `focusHandOff` has 9 unit lines.
- E (v0.66.23): issue 0024 closed as not reproduced, both tries named in the
  file. Nothing in the site changed, so there was nothing to break.

The seam no single card owned: B reflowed every page for narrow windows and
large text, and D moved focus inside the galleries. `seam-walk.mjs` presses
each gallery's Next to the end by keyboard on a 390px phone with text at 150%,
in Chromium and WebKit: all 4 walks keep focus inside, the arrow key still
moves the gallery, and the page fits the window.

The fault this card fixed: run on the fresh build, `@page-top` read the home
page's first line at 38px (320 wide) and 46px (390) against a line of 35.
`home-top.mjs` in this workshop showed why. The home intro rises for 420 ms
and the test read every route at 400 ms, so the line was still moving and a
busy machine caught it further down. At rest it sits at 34px, on the line.
`readOnce` now plays every clock-driven animation to its end before reading,
so each reading is of the page at rest. Seen red before, green after: 8 tests,
`@narrow-and-large-text @page-top @gallery-focus @every-route @privacy-index
@waypost-words @sole-focus @home`.

Every fix's cheap test exists: 0008 in `tests/dist.test.ts`, 0022, 0010 and
0025 in the screen suite, 0025's logic also in `src/lib/rail.test.ts`. Each was
seen red first in its own card. The live site serves the new stylesheet
(`overflow-wrap:anywhere`) from `ca0d6be`.

Every browser this plan's checks drove was Playwright's own Chrome for Testing
or WebKit, through `PUPPETEER_EXECUTABLE_PATH`: the owner asked mid-plan that
the installed Google Chrome be left alone, and card B's first runs had used it.
