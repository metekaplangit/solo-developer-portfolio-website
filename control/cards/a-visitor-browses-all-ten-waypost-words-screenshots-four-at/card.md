# A visitor browses all ten Waypost Words screenshots, four at a time, with arrows

bump: minor
screen: @waypost-words
screen: @apps
screen: @waypost-rail
unproven: Safari and a real touch screen — the arrows were driven in headless Chrome at 1440 and 390 only

The owner asked for four screenshots on the game's page with the rest reachable
by arrows. The page had four in a plain grid, and six of the owner's ten iPhone
store screenshots were not on the site at all. All ten are now in the content
(the game's `store-assets/screenshots/Mobile`, 1320×2868, converted to JPEG,
alt text written from each picture), and the portrait branch of
`ScreenshotShowcase` is a rail: one scroll-snap track, four whole shots in view
from 40rem and two below, Previous and Next arrows that page one view at a time
and disable at each end, a live "1–4 of 10" count, the keyboard arrows, and
swipe. The first four load at once and the rest stay lazy until brought in. On
a phone the arrows sit just inside the rail; the first version pushed them past
the edge, where the screen cut the Next arrow in half.

Proved by driving it. A new screen test presses Next until it disables and then
Previous, at 1440 and at 390, and checks the count and the arrow states at each
end. This machine's Chrome detaches a page about one time in three (measured
again here: 3 of 6 phone-width probes), so that test runs with reduced motion,
short waits and eight attempts. The geometry suite's "lazy image already on
screen" rule measured against the window only, and flagged the fifth shot,
which sits past the rail's edge and is hidden by it — the case the rule's own
comment says should stay lazy. It now clips to any scrolling ancestor; making
the fourth visible shot lazy was tried and the rule still catches it at 768 and
1440.

The first close timed out: the whole screen suite hung for its 240-second hook
budget once, where it normally takes 37. A detached page does not always throw —
a call on it can wait out the launch's 120-second protocol timeout — so each rail
attempt now has a 20-second deadline and a 10-second step timeout. Two runs after
that passed in 38 and 66 seconds. The arrow test carries its own tag,
`@waypost-rail`, because the control wants one test per tag; `CLAUDE.md` lists it.
