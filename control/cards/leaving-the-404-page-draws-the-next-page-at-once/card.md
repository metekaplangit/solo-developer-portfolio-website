# Leaving the 404 page draws the next page at once

bump: patch
unrendered: a timing, not a picture: leaving the not-found page reaches the next page's first frame about 280 ms sooner, proved by leave.mjs in this workshop and the built-output test "skips the view transition when leaving the not-found page, and only there"
unproven: the live site, until this deploys; a visitor's real Chrome on a phone

Plan 0017, card E, from resolve-issues 0001. Closes issue 0017.

Clicking a link on the 404 page held the old page for about a third of a
second before the next page drew. `leave.mjs` in this workshop serves the
built site the way GitHub Pages does, a 404 status for an unknown address, and
times each click to the new page's first animation frame in Chrome 156, with
the back-forward cache on as a visitor's is. Playwright turns it off by
default, and that alone made every page change slow, which is why the issue's
own control showed the wait everywhere.

Before: the header's home link from the 404 page reached its first frame
373–399 ms after the click, against responses at 55–81 ms. Leaving About the
same way took 60–80 ms. One change per case found the cause. With the 404
page's view transition removed, opted out, or skipped, the wait was gone. With
the same page served with status 200, it was gone too. Chrome never keeps a
404 response in its back-forward cache, and a cross-document view transition
out of a page it cannot keep held the next frame.

The fix is the smallest that reaches it: the not-found page alone skips its
transition on leaving. `BaseLayout` takes `leaveWithoutTransition`, which adds
a one-line `pageswap` listener calling `skipTransition()`, and `404.astro`
sets it. A CSS opt-out was the first choice, but the site ships one shared
stylesheet, so `@view-transition { navigation: none }` would have reached
every page. The new inline script's hash is listed in the CSP beside the
`pagereveal` one. After: 404 → home 105–119 ms by the page's own link and
60–92 ms by the header, 5 runs each, against responses at 39–69 ms. Every
other page keeps its hand-off.

Proof: a new built-output test, "skips the view transition when leaving the
not-found page, and only there", was red before the change and is green now.
The CSP inline-script test went red when the script landed and green once its
hash was listed. Fast checks pass whole.
