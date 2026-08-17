# A card that changes a page cannot close without a browser proving it

bump: patch
screen: @home

The adoption of control 14 left one answer empty: `RENDERED`. The site had a real
browser suite — `npm run test:ui`, nine routes at four widths plus a coarse-pointer
phone pass — but the control could not see it. It finds a screen by globbing
`*.spec.ts` in one folder and reading `@tags` out of titles on lines beginning
`test(`, and this project had `tests/geometry.test.ts`, one `describe` of ten
`it()` blocks and not a tag anywhere. So every card that touched a page ran the
fast checks and closed, and the browser only ever ran when somebody remembered.

Nine routes are now nine screens. `tests/geometry.test.ts` became
`tests/screens/site.spec.ts`, and the ten `it()` blocks became one `test()` per
route — `the home page holds its geometry @home` — each applying the nine
per-page rules across all five readings and collecting every complaint before it
asserts. Nothing was dropped and nothing was loosened: the same probe, the same
limits, the same rules. What changed is that a failure names the page first and
the rule second, and that a route reports every rule it breaks rather than the
suite reporting the first rule any route breaks.

One rule refused to be per-route. The page-title indent is only wrong relative to
other routes — 88px on a product page against 72px on a policy page was the
STEP-0081 defect — so it stays whole, as its own test carrying `@every-route`.
That is also why `scripts/rendered.mjs` loads all nine routes whatever tags it is
handed: a run that loaded three could not check it at all. The tags decide which
screens the card is answerable for, not which pages are opened. 65 seconds, paid
only by a card that touched something a visitor can see.

Both were seen red first, against a deliberately broken `dist/`. A 3000px div on
`/about/` failed exactly one test — `the about page holds its geometry @about`,
naming all five widths, with the other nine green. A 40px margin on one policy
`h1` failed only `@every-route`, printing `68px (/apps/sole-focus/,
/apps/magic-notes/) vs 108px (/privacy/sole-focus/)` at every width. Rebuilt
clean: 10 passed, 64.66s, exit 0.

`scripts/capture.mjs` is the other half, and without it this tier would have
blocked the next card rather than helped it: the control asks a screen-changing
card for pictures and never for a way of taking them. It serves `dist/`, drives
the same Chrome, and writes one full-page PNG per route at 1440 and 390 into
whichever workshop folder it is given. It refuses a missing `dist/` by name,
because a picture of a stale build reports differences the change never made.

`INTERFACE` is `src/` and `public/`. The unit tests sit at `src/**/*.test.ts` and
the control matches prefixes rather than globs, so they count as screen files too
— which over-asks rather than under-asks. A card that touched only a unit test
writes one `unrendered:` line and closes, which is exactly what that field is for.

`@home` is named above although this card changed no page. It is how the wiring
gets proved end to end: the control resolving a tag from a title, running the
tier, and recording the screen in its ledger.
