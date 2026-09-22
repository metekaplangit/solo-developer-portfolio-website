# The game is Waypost Words on the site, at its own addresses

bump: minor
screen: @waypost-words
screen: @privacy-waypost-words
screen: @apps
screen: @home
unproven: the live site, until the deploy from this push finishes

The game was renamed from Wander Words to Waypost Words on 2026-09-22, after its
copyright review found another word game already live under the old name (the
game's own issue 0074). The game already carries the new name and the bundle id
`com.metkapstudio.waypostwords`; this site was the last place still saying
Wander Words.

The product and privacy entries are now `waypost-words`, so the pages live at
`/apps/waypost-words/` and `/privacy/waypost-words/`, and every visible name,
title, description and JSON-LD entry says Waypost Words. The icon and its hue
are unchanged, because the game's icon did not change.

A build of the game already links to the two old addresses, so they were kept
as forwarding pages rather than dropped: each sends the browser on at once,
points its canonical at the new page, is marked noindex and is left out of the
sitemap. `BaseLayout` gained one optional prop, `movedTo`, to do that, and
`MovedPage` renders the short notice shown for the instant before the forward.
The built-output suite pins all of it, the screen and capture route tables
carry the new tags, and `docs/work/handoff/0003-2026-09-22.md` gives the game's
own sessions the new addresses to switch to.

Proved by the fast checks complete, the 4 touched screens and the every-route
check in a real Chrome, and both old addresses loaded in the browser pane and
landing on the new pages. The changelog, closed cards and earlier handoffs keep
the old name, because they are the record of what was true then.
