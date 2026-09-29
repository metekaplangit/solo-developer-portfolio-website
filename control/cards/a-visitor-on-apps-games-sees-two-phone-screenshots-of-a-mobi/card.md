# A visitor on Apps & Games sees two phone screenshots of a mobile game

bump: patch
screen: @apps
screen: @home
unproven: Safari on a real iPhone — checked in headless Chrome and the app's browser pane only

The owner reported Waypost Words had no picture on Apps & Games. It had one:
the live page serves it, and it loads when a browser scrolls to it (288×626 in
the browser pane on metkapstudio.com, and at 1024 in `scripts/probe/image-probe.mjs`).
What showed no picture was this project's own capture at 390 — a full-page
screenshot never scrolls, so a lazy image far down the page is never requested
and comes out as an empty frame. The last card's picture of it was exactly that,
and nobody looked at it. `scripts/capture.mjs` now loads every image before the
picture, the way scrolling would.

The single phone capture, held to 18rem and centred, also left most of the band
empty. The owner's call: a mobile product shows its first two captures side by
side. `ProductBand` now does that for any product whose lead shot is portrait,
in a 34rem pair that sits two across even at 390. The Mac products keep their
one wide window, untouched.

A built-output test pins two images in the Waypost Words band and one wide
shot each for the two Mac products; it was seen red against the build before.
