# A visitor can get Waypost Words on Google Play from every page that offers it

bump: minor
screen: @waypost-words
screen: @home
screen: @apps
screen: @privacy-waypost-words

Waypost Words went live on Google Play. The owner sent the listing on 2026-11-11,
and it was read that day: public, free, by MetKap Studio, rated Everyone, dated
9 November 2026. Android moved from "coming soon" to the game's platforms, the
Google Play link joined the App Store one, and every "coming" line went: the badge,
the Get panel note and the summary, which now reads "for iPhone, iPad and Android
phones and tablets".

Each place that offered the App Store showed only the first store, so each now
shows one button per store a visitor can use: the game page's opening and its Get
panel, the product band on Home and Apps & Games, and Home's opening, which
features the newest release. `downloadLinks()` in `src/lib/products.ts` is the one
list they all read. The structured data now names Android and carries one offer per
store; a product on one store keeps the single offer it always had. The button's
accessible name said "on the Google Play", so stores now take "the" only where a
sentence does: "on the App Store", "on Google Play".

The release date stays 26 October 2026, the game's first release. The privacy
policy already covered Google Play and needed no change. `ProductCard` still shows
one "Download" button, because no built page draws it today. The `comingTo` field
stays in the schema, empty, for the next product announced ahead of a store.
