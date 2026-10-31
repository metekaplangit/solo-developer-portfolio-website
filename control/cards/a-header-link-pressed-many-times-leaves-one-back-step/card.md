# A header link pressed many times leaves one Back step

bump: patch

Closes issue 0024 — not reproduced.

Nothing in the site changed. Issue 0024 was re-checked in both engines it
named, at the versions it named — Chrome 156 (Playwright's Chrome for Testing
156.0.8078.4, not the installed browser) and WebKit 26.4 — with `presses.mjs`
in this workshop: from `/`, the header's Apps & Games link pressed 15 times at
0, 50 and 150 ms apart, then `history.length` read and Back pressed once.

- Try 1, the steps as written (Playwright clicks on the link): 1 new history
  entry and one Back home, at every spacing, in both engines.
- Try 2, the way a hand presses (raw mouse clicks on the link's centre on a
  fixed clock, as the chaos probe drives it): the same, 6 of 6.
- Control: the same script against the site built from `9a6539c`, the commit
  that filed the issue, also gave 1 entry every time — so this is not a fix
  that landed since; the 7 entries the issue saw did not come back under the
  same browsers.

No cheap test is added: a test written for a fault nobody can make fail would
never have been seen red.
