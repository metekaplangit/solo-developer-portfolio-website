# Check plan 0012 landed, and fix what did not

bump: patch

Plan 0012, card C, the loop card. Nothing needed fixing.

- A landed: every page in `dist/` and on metkapstudio.com links the one
  `style.B9Gz8UL_.css`. Live, home → a product page now draws 4 ms after its
  HTML arrives in Chrome on a Mac (262 ms, was 379), 26 ms in Safari's engine
  (272, was 386) and 58 ms on a throttled phone (309, was 611) — in line with
  every other page change on that same profile (25–52 ms).
- B landed: in Safari's engine at 390 px, home → Waypost Words through the
  band, the rail's Next answers in under 16 ms and pages the rail; before, the
  click timed out. Chrome unchanged.
- Each fix left its cheap test, and each was seen red on the unfixed code: the
  dist test "links the same stylesheets on every page", and the late-size checks
  inside the `@waypost-rail` screen test.
- Must keep working, held: Scoped Suite Testing over @home, @sole-focus,
  @magic-notes, @waypost-words and @waypost-rail is green (the CSP rule runs on
  every route there); live, both galleries and the rail answer every input in
  16–56 ms in Chrome, Safari's engine and the throttled phone.
- First visit costs 0.2–4.3 KB more (compressed): the small pages now carry the
  product pages' styles. Cold loads' time from first byte to largest paint held
  (median 154 → 160 ms); the server's first byte varied (median 280 → 432 ms).
- Not changed by this plan, and still filed: leaving the 404 page in Chrome
  (issue 0017, 329 ms), unvisited pages arriving bare (issue 0018).
