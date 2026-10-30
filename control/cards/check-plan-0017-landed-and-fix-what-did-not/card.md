# Check plan 0017 landed, and fix what did not

bump: patch

Plan 0017, card F, the loop card for resolve-issues 0001's 5 cards. Nothing
needed fixing.

Each card's outcome, held against the built site:

- A (v0.66.13): issue 0013 closed as not a defect, both tries named in the
  file. Nothing in the site changed, so there was nothing to break.
- B (v0.66.14): `walk.mjs` in this workshop checks every Download button on
  the 5 pages that carry one: 11 buttons, each with the studio's mark, none
  with Apple's logo, accessible names intact ("Download Sole Focus on the Mac
  App Store").
- C (v0.66.15): the screen rule for line breaks runs on every route and passed
  in the card's close; issue 0015 stays open for the owner's words, carried in
  `BREAKS_KNOWN`.
- D (v0.66.16): `@button-press` passes.
- E (v0.66.17): the built-output test passes; the live timing is below.

The seam no single card owned: B drew the new mark inside the Download button
and D changed how every button answers a press. The walk forces each Download
button hovered, then hovered and pressed: all 11 lift 1px and settle to 97%.

Must keep working: `BaseLayout` sits under every page and card E ran no
screens, so this card ran `@not-found @every-route @home @waypost-rail
@privacy-magic-notes @privacy-sole-focus @about @button-press` on a fresh
build: 9 tests, all passed. Each fix's cheap test exists and was seen red
first (B, C, D and E's cards name the red run). Every closed issue file sits
in `closed/` with its `Closed by` naming its tag and card.

On the live site, after deploy run 41121976337 finished green: the walk read
the same 11 Download buttons, all correct. `leave.mjs --live` (card E's
workshop) timed 5 runs each. 404 → home reached its first frame 2–21 ms after
its response, with no view transition, by the page's link (one run's response
alone took 369 ms) and by the header's. About → home took 4–16 ms, with its
transition. Before card E, the header case held 300 ms past the response.
