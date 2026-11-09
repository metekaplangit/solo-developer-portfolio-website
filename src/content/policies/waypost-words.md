---
productId: waypost-words
title: Waypost Words Privacy Policy
lastUpdated: 2026-11-09
dataCollected: []
dataUse: []
# Empty on purpose. The studio never states what a product lacks, because a
# later release may add it (STUDIO.md, 10 September 2026), and this list renders
# as "What we never collect". What the build does is in storedLocally below; the
# one absence Apple asks a policy to state — what data, if any, is collected
# (App Review Guidelines 5.1.1(i), read 2026-09-29) — is the template's "What we
# collect" answer, which describes this build only.
dataNotCollected: []
thirdPartyServices: []
storedLocally:
  - Your game progress — journeys, coins, skills, skies, bonus words, experience and daily progress
  - Settings — sound, music, reduced motion and text size
  - A note of the last unexpected stop, if there was one, shown only to you
permissions: []
# Android restores a backed-up save whenever the game is installed again
# (developer.android.com/identity/data/autobackup, read 2026-11-09), so "deleting
# the game removes it" on its own would be false there.
retention: "Everything Waypost Words keeps stays on your own phone or tablet and in that device's own backup. Deleting the game removes it from the device. A copy already in a backup follows that backup's own settings, and can come back if you reinstall the game."
hasAccounts: false
contact: support@metkapstudio.com
effectiveScope: The Waypost Words game by MetKap Studio for iPhone, iPad and Android phones and tablets, on the App Store and Google Play.
# Android, read on 2026-11-09 from the game's source at v1.216.13 (versionCode
# 1216013, package com.metkapstudio.waypostwords): android/app/src/main/
# AndroidManifest.xml and the release merged manifest ask for no internet or
# other user-facing permission, allowBackup is true with no backup rules, and
# minSdkVersion is 24, Android 7. Saves go to Capacitor Preferences, which is
# SharedPreferences there, and Auto Backup covers those by default. That the
# game keeps the same things as on iPhone, and that the studio never sees the
# backup, are the owner's statements of 2026-11-09.
# Checked against Google Play's User Data policy, read 2026-11-09
# (support.google.com/googleplay/android-developer/answer/10144311): a labelled
# policy on a public URL naming the listing's entity or the app, with a contact,
# what is handled and shared, secure handling, and retention and deletion.
# Read again on 2026-10-27 against v1.215.23 (build 1215023), the build Apple
# released on 2026-10-26: between v1.215.21 and it the game changed a Settings
# line, its styles, its launch screen and its build numbers — no storage key,
# save field, native package or network call — so every line below still holds.
# Read from the game's source on 2026-09-29, at v1.215.21 (build 1215021),
# the build then being prepared for App Review: its storage keys and save schema
# (settings are sound, music, reduced motion and text size — the haptics setting
# was removed from the save, so it is no longer listed), its iOS privacy manifest
# (no collected data, no tracking, no tracking domains), its native packages
# (Capacitor app, preferences, splash screen and status bar only), and the
# absence of any network, analytics, advertising or purchase code: every fetch
# in the source loads a file bundled inside the app. Revise it with the release
# that changes any of this.
reviewStatus: reviewed
sections:
  # Named as the rest of this policy names it, not by the default's "This app".
  collected: "Nothing. Waypost Words doesn't collect personal data."
  # The defaults say "stored only on your device" and "nothing is uploaded to a
  # server". A device backup can sit on the player's own backup service, so
  # neither holds here. These two say where the save really is.
  storedLabel: "Kept on your phone or tablet, and in that device's own backup:"
  protection: "Everything above stays on your phone or tablet and in that device's own backup. MetKap Studio holds no copy, so there's no central copy to be breached, leaked, or handed over to anyone."
  # General audience, not child-directed (owner's decision, 2026-09-22). "All
  # ages, children included" would read as a child-directed service under COPPA
  # once advertising is added, which limits the ads allowed and can require
  # parental consent. Keep this in step with the App Store age rating answers.
  children: "Waypost Words is a word game made for a general audience, and it isn't directed at children. It collects no personal data from anyone, so it holds nothing about children either."
  changes: "This policy describes Waypost Words on iPhone, iPad and Android, on the App Store and Google Play. It is revised with any release on either store that changes what the game does with data, and the Updated date at the top always shows the current version."
---

Waypost Words is a game by MetKap Studio. This policy covers it on iPhone and
iPad from the App Store, and on Android phones and tablets from Google Play.

Everything Waypost Words keeps stays on your phone or tablet: your progress
through the game and your settings, in the game's own storage and in your
device's own backup.

On Android, that save may be included in your own device backup if you have
backups turned on. MetKap Studio doesn't see it.

If the game ever stops unexpectedly, it writes a short note of what happened on
your device and shows it to you as its last problem report. You can clear it,
or copy it into an email to support yourself.
