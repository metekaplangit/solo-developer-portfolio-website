# A visitor or App Reviewer sees Waypost Words described as the build going to the App Store

bump: minor
screen: @waypost-words
screen: @privacy-waypost-words
screen: @apps
screen: @home
unproven: the live site after deploy — checked by fetching it once the push lands, not by this card
unproven: App Review itself

The owner is about to submit Waypost Words, and the product page, privacy
policy and catalogue still described the build of 2026-09-22: iPhone only,
offline play as a feature, a monogram instead of the icon, and a haptics
setting the game no longer has. This card re-reads the game project (read-only,
v1.215.21, build 1215021) and brings every Waypost Words surface in line with
the build a reviewer will install.

The product page now takes its words from the game's own newest listing batch,
`listings-2026-09-28-2007-skills-first-pack` (direction B, the owner's pick),
which traces every claim to the game's source. Platforms are iOS and iPadOS,
read from `TARGETED_DEVICE_FAMILY = "1,2"`. The offline-play feature is gone —
the schema already forbids promising what a later release may change, and the
listing batch left it out on purpose. Its seven features became six, because
seven cannot fill even rows and fell into one column; the bonus jar is still in
the prose. The icon is the one the game ships with, scaled to 168px.

The privacy policy was re-checked line by line against the source: the save's
settings are sound, music, reduced motion and text size (haptics was dropped
from the save, so listing it was false), the privacy manifest declares nothing
collected and no tracking, the only native packages are Capacitor's app,
preferences, splash-screen and status-bar, and every `fetch` loads a file
bundled in the app. It now names iPhone and iPad, and its review status moved
from draft to reviewed on that evidence. The content test pins the platforms,
the reviewed status, the icon, and the absence of both haptics and an offline
promise; it was seen red against the old content first.
