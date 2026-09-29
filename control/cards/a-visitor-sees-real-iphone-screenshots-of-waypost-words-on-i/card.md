# A visitor sees real iPhone screenshots of Waypost Words on its page

bump: minor
screen: @waypost-words
screen: @apps
screen: @sole-focus
screen: @magic-notes
unproven: the live site after deploy — checked by fetching it once the push lands, not by this card

Waypost Words' page had no pictures of the game, and the page itself said it
would carry them once they were real. They are: the owner's store screenshots
sit in the game project under `store-assets/screenshots/Mobile`, real captures
from a 6.9-inch iPhone at 1320×2868. Four of them are on the page now — a
lightning strike, a meteor, a traveller's chest of keepsakes, and the home
screen — converted to JPEG and otherwise untouched, with alt text written from
what each one shows.

The gallery was built for Mac windows: one slide at a time in a frame fixed at
2880:1800, so a phone capture would have been squashed flat. `ScreenshotShowcase`
now looks at the first shot, and when it is taller than wide lays the shots side
by side in a plain grid instead — four in a row from 40rem, two on a phone, no
script and nothing to swipe. The catalogue band on Apps & Games had the same
problem at a larger size, so its lead shot is held to 18rem and centred when it
is portrait. Landscape products take exactly the path they took before.

The first close failed the geometry suite: the grid had copied the carousel's
lazy loading for shots 2 to 4, but unlike carousel slides they are not tucked
off to the side — the whole row is on the first screen, where a lazy image is
queued late for nothing. All four load eagerly now, and the first keeps the one
priority hint.

A content test pins four portrait shots whose files exist, and a built-output
test pins the phone grid on Waypost Words and the carousel still on Sole Focus;
both were seen red against the build before this change. Sole Focus and Magic
Notes were photographed before and after: identical, apart from one dot caught
mid-transition on Sole Focus at 390px.
