# The Waypost Words arrows work however the page was reached

bump: patch
screen: @waypost-words
screen: @waypost-rail
unproven: a real iPhone in Safari — proved in Playwright's WebKit 26.4 build

Plan 0012, card B, from smooth-project 0001. In Safari's engine, arriving at
Waypost Words from the home page through the page change, the phone rail's Next
arrow was switched off although 10 screenshots were waiting: the click timed
out, and only a swipe woke it. Loaded directly it worked, and Chrome always did.

A per-frame probe showed why. `initPhones()` measured the rail once, 18 ms in,
when the product stylesheet had not applied yet — the track as wide as its view,
the first slide unstyled — so it decided there was nothing to scroll. It only
measured again on a scroll or a window resize, and the layout settling is
neither. WebKit bug 261655 (open since 2023) is the engine side: a module
script there can run before the stylesheet in front of it.

The rail now re-measures through a ResizeObserver on the track and its first
slide, through the same frame-throttled `render()` the scroll already used, so
it costs nothing while nothing changes size. The `@waypost-rail` screen test
now also squeezes the slides until nothing can scroll, then gives them their
size back with no scroll and no window resize, and expects Next on and the
right count at 1440 and 390. Those checks were red on the unfixed code ("1–10
of 10", Next off) and are green now, with the rail's paging checks still green. In WebKit, home → Waypost Words through the
band, the arrow is live and pages the rail, 2 of 2 tries — on a build that also
has card A's single stylesheet, so that probe alone does not separate the two.
