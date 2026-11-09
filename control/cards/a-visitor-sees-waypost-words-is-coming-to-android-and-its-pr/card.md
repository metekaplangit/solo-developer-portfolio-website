# A visitor sees Waypost Words is coming to Android, and its privacy policy covers Google Play

bump: minor
screen: @waypost-words
screen: @privacy-waypost-words
screen: @home
screen: @apps
unproven: Google Play's review of this policy, which only a submission can answer
unproven: that the Android save holds the same things as the iPhone one, and that the studio never sees the backup: both are the owner's statements, not read from the game's code

The owner is taking Waypost Words to Google Play, and both of its pages still
described only iPhone and iPad. The policy now covers the game on iPhone, iPad and
Android, on the App Store and Google Play, names MetKap Studio and Waypost Words,
and says everything stays on the player's phone or tablet and in that device's own
backup. Google Play's User Data policy was read on 2026-11-09 before writing it,
and the Android facts were read from the game's source at v1.216.13: package,
minimum Android 7, backups allowed, and no internet permission in the merged
manifest.

Reading the whole rendered policy found 2 lines the request did not name. The
shared template says "Stored only on your device" and "nothing is uploaded to a
server", and a device backup can sit on the player's own backup service, so this
policy now overrides both. "Deleting the game removes it" went too, because Android
restores a backed-up save when the game is installed again. Absences the owner
listed (ads, purchases, sign-in, internet) stay off the page, under the studio's
standing rule and the existing test.

The game page names Android phones and tablets in its title, its summary, its
features and its requirements, adds "Android 7 or later", and says Android is coming
to Google Play, with a badge and a line in the Get panel. The App Store buttons stay
and there is no Google Play button. Android lives in a new `comingTo` field rather
than `platforms`, because `platforms` feeds the structured data beside an in-stock
App Store offer, and every tile on the site. So `operatingSystem` still says iOS and
iPadOS, and the tiles are unchanged. The summary and the requirement are shared
fields, so home and Apps & Games picked up the new wording, which is true there too.

The new field broke the local build: Astro's content cache kept the 2 untouched
product files without it. That is issue 0008's fault again, so the schema joined the
fingerprint that clears the cache, with a small test seen red first. Visitors were
never at risk, because a deploy builds with no cache. The longer requirement also
left "· iOS or iPadOS" alone on a phone line in the Get panel, so that row now states
the 2 systems as 2 facts.
