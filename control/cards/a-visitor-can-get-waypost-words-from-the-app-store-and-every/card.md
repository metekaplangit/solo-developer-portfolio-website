# A visitor can get Waypost Words from the App Store, and every page says it is out

bump: minor
screen: @waypost-words
screen: @apps
screen: @privacy-index
screen: @privacy-waypost-words
unproven: Safari on a real iPhone — checked in headless Chrome at 1440 and 390
unproven: the live site after deploy — Cloudflare sits between dist/ and a visitor

Waypost Words went live on the App Store on 26 October 2026. Every fact the
site now shows about the release was read from Apple's lookup endpoint for id
6817343620 on 27 October, not from the submission draft: free, iOS 15.0 or
later (iPadOS 15.0 on iPad), released 26 October, version 1.215.23, and the
listing's own address, which answers 200. The product file now says released,
links that address, carries the price, the requirement and the release date,
and its closing line says it is free on the App Store instead of promising a
link "the day it is". With those three in place the page emits its JSON-LD
offer, the Download and App Store buttons appear on the product page and on its
Apps & Games band, and the "Not yet available" panel is gone.

Every page was read as built text afterwards. Apps & Games no longer says its
products are "released or on its way", and its meta description no longer says
"released, in beta, and planned" — all three are released. The game's privacy
policy said it described the game "as it is built for its first release"; it
now says "as first released on the App Store", dated 27 October. The game was
read again between the reviewed build and the shipped one: only a Settings
line, styles, the launch screen and build numbers changed — no storage key,
save field, package or network call — so every data line still holds. One false
line turned up beside it: the privacy overview said "some apps collect data the
website doesn't", when every policy's collected-data list is empty. It now says
each policy covers what that app or game keeps on the device. Home still shows
only the featured product, Magic Notes, as decided in STEP-0083.

The fast checks could not pass as found: npm audit reported 8 production
vulnerabilities published since the last card (astro, vite, sharp, zod and
others). `npm audit fix` cleared all 8 without a breaking change, moving Astro
to 7.4.2. Pictures of every route before and after show the 7 routes this card
did not touch unchanged to the pixel, Magic Notes at 1440 aside by 0.04%;
home's before was caught mid fade-in. Three new tests were seen red on the old
content first: the released game pinned in the content suite, and in the
built-output suite its offer and store link, no waiting words on any page it
appears on, and no claim that an app collects data. All 44 internal links
resolve and every outside link answers 200.
