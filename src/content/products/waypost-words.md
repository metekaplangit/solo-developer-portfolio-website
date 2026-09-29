---
id: waypost-words
name: Waypost Words
slug: waypost-words
type: game
# Not released. No store link, no price and no release date — the page says so
# rather than implying a download that does not exist yet. Built ahead of the
# release so the addresses written into the game resolve before it ships, and
# so App Review finds this page describing the build it is reviewing.
# Called Wander Words until 2026-09-22, when another word game was found under
# that name. The old addresses forward here (src/pages/*/wander-words.astro),
# because a build of the game already carries them.
status: in-development
featured: false
summary: A crossword word game where you can spell every answer yourself or reach for a skill. Seven to unlock, four on the board, and three roads of crosswords to walk on iPhone and iPad.
# iPhone and iPad from one universal build: TARGETED_DEVICE_FAMILY "1,2" in the
# game's Xcode project and "Shipping now: iOS on iPhone and iPad" in its
# docs/architecture/platform.md, both read 2026-09-29.
platforms: [ios, ipados]
storeLinks: []
# Identity colour, read from the game rather than chosen for the site: the
# lavender side of the lettered tile on the game's icon. The game's world is a
# night purple; the darker purples in it fail contrast as chip text on this
# stage.
hue: "#C6B4E8"
supportUrl: /support/
privacyPolicyUrl: /privacy/waypost-words/
# The icon the game ships with: ios/App/App/Assets.xcassets/AppIcon.appiconset/
# AppIcon-512@2x.png in that project (commit 8a569180, 2026-09-06), scaled to
# 168px — three times the largest size this site draws it at.
icon:
  id: waypost-words-icon
  productId: waypost-words
  type: icon
  path: /media/waypost-words/icon.png
  altText: Waypost Words app icon — a white letter tile with a purple W, tilted on a starry night-purple ground
  licenseOrOwnership: owned
# Copy from the game's own listing batch, store-assets/listings/
# listings-2026-09-28-2007-skills-first-pack (COPY_PACK.md §4, the owner's pick,
# direction B), written against v1.215.21. Each claim there is traced to the
# game's source; the skill count, road lengths, devices and storage were read
# again from the source on 2026-09-29. Nothing here is a promise about a later
# release. The pack lists seven features; its bonus-jar line is left to the
# prose below, because seven cards cannot fill even rows (src/lib/grid.ts) and
# fell into one column.
features:
  - Trace letters on a wheel to fill the crossword above it
  - Seven skills to unlock, four to carry
  - Three travellers, 60 places, 1,500 stops
  - Weather that changes while you play
  - A daily puzzle, a daily gift and three daily goals
  - Made for iPhone and iPad, in portrait
lastUpdated: 2026-09-29
seo:
  title: Waypost Words — Crosswords with Seven Skills, for iPhone and iPad
  description: Trace letters on a wheel to fill the crossword, or reach for one of seven skills. Three roads to walk, under weather that changes as you play.
---

Spell it. Strike it. Rain letters on it. Trace letters on a wheel to spell a
word and it drops into the crossword above. Fill every answer and the road moves
on to its next stop.

## Seven skills, and something to watch

Lightning reveals a letter. A meteor opens the square you pick. A cloudburst
rains letters across the crossword, and Keystone opens the square two answers
share. Start with one skill, unlock the rest as you play, and carry four. Each
use costs coins you earn as you play.

## Three travellers

Halden walks home to the village he left twenty years ago. Nell Harrow follows
an old survey line to win back its names. Ada Pellow runs her boat route one
final time. Each road runs twenty places of twenty-five stops.

## Weather with a mind of its own

Rain turns to sleet and snow, fog settles along the ground, the wind lifts
leaves, and a storm brings lightning. A new sky every time you open the game.

## Something waiting on the road

Chests in the crossword, a mystery box, a wheel to spin, three crates, a
pedlar, and a bonus jar for every extra word you find.

_Waypost Words is not on the App Store yet. This page gets the store link and
the price the day it is. The support address answers in the meantime._
