---
id: magic-notes
name: Magic Notes
slug: magic-notes
type: app
# Live on the Mac App Store since 2026-08-16 (STEP-0082). Status, store link,
# price and release date were held empty by STEP-0069 until the app was
# accepted; every fact below is read from Apple's own listing for id 6797499171,
# not from the app's submission draft.
status: released
# The home spotlight, by the owner's decision on 2026-08-17 (STEP-0083). Exactly
# ONE product is featured at a time — `index.astro` gives the hero a product's
# hue only on that condition — so Sole Focus was unfeatured in the same change.
featured: true
summary: A Mac writing pad that does the arithmetic. Write the sum the way you would say it, and the answer lands beside the line — exactly, or not at all.
platforms: [macos]
storeLinks:
  - store: mac-app-store
    url: https://apps.apple.com/us/app/magic-notes-calculator/id6797499171?mt=12
    status: available
# Free, verified from the listing. No "no in-app purchases" claim anywhere on
# this page: the listing exposes no purchase list either way, and an absent
# badge is not evidence.
price: "0"
privacyFacts: "Works offline — no account, no cloud, no tracking"
# Identity colour, read from the app rather than chosen for the site. The Magic
# Notes icon is deliberately achromatic — a #4F5963 frame on near-white — and the
# app's own accent palette calls that family Graphite. This is the exact value
# the app renders Graphite as in dark appearance, which is the appearance this
# site's stage matches. See docs/tasks/STEP-0069.md for why the app's default
# accent (a burnt orange) was not used.
hue: "#B2BBC5"
fitFor: "You do consequential arithmetic while writing — a budget, a quote, a renovation, a loan — and you would rather see the working than trust one number."
fitNotFor: "You want a programmable calculator, a spreadsheet, or a computer-algebra system — Magic Notes is a notebook that answers, and deliberately stops there."
requirements: macOS 15 or later
supportUrl: /support/
privacyPolicyUrl: /privacy/magic-notes/
# The shipped app icon, taken from the app's own icon batch of 2026-08-02
# (store-assets/icons/icons-2026-08-02-1357-shipped-core-ring). Deliberately
# achromatic — the #4F5963 mark the hue above is read from.
icon:
  id: magic-notes-icon
  productId: magic-notes
  type: icon
  path: /media/magic-notes/icon.svg
  altText: Magic Notes app icon — a grey open-cube outline with a small ring at its centre, on a pale silver tile
  licenseOrOwnership: owned
# Real capture from the running app, supplied by the owner on 2026-08-03. The
# window chrome in these frames reads v0.309.0 — they were taken before the
# version bump, and no claim on this page depends on the number shown.
screenshots:
  - id: magic-notes-shot-kitchen-quote
    productId: magic-notes
    type: screenshot
    path: 01-words-in-answers-out.png
    altText: A Magic Notes sheet called Kitchen Quote in the dark theme, with a folder sidebar on the left and every material and labour line answered in a column on the right, ending in subtotals and a total.
    bakedInText: "Words in, answers out."
    dimensions: { width: 2880, height: 1800 }
    licenseOrOwnership: owned
  - id: magic-notes-shot-statistics-and-recipe
    productId: magic-notes
    type: screenshot
    path: 02-a-notebook-that-counts.png
    altText: The Magic Notes Statistics window showing a breakdown of 276 lines by kind and the biggest sheets in the library, beside a recipe sheet scaling grams, cups, litres and oven temperatures.
    bakedInText: "276 lines, and it counts them."
    dimensions: { width: 2880, height: 1800 }
    licenseOrOwnership: owned
  - id: magic-notes-shot-themes
    productId: magic-notes
    type: screenshot
    path: 03-themes-that-read-all-day.png
    altText: Three Magic Notes windows fanned out in the light theme, the front one a Japan Trip Budget sheet where named costs add up to a trip total and a split between two people.
    bakedInText: "Themes that read all day."
    dimensions: { width: 2880, height: 1800 }
    licenseOrOwnership: owned
  - id: magic-notes-shot-skills
    productId: magic-notes
    type: screenshot
    path: 04-inside-your-notebook.png
    altText: Two light-themed Magic Notes Statistics windows side by side — an Overview counting line types and the biggest sheets, and a Skills tab showing level 18 of 100, an eight-day streak, and the hundred named ranks.
    bakedInText: "See what your notebook is made of."
    dimensions: { width: 2880, height: 1800 }
    licenseOrOwnership: owned
  - id: magic-notes-shot-dependencies
    productId: magic-notes
    type: screenshot
    path: 05-change-one-line.png
    altText: A Magic Notes sheet called Running the Car where five named monthly costs feed a monthly total, a yearly total, an increase of six per cent, and a weekly figure, each answered on its own line.
    bakedInText: "Change one line. Everything follows."
    dimensions: { width: 2880, height: 1800 }
    licenseOrOwnership: owned
  - id: magic-notes-shot-dates-and-times
    productId: magic-notes
    type: screenshot
    path: 06-what-time-is-it-there.png
    altText: A Magic Notes sheet called Flying to Tokyo answering the time in Tokyo and London, the difference between them, days until a date, workdays added to a date, and time arithmetic in minutes.
    bakedInText: "What time is it there, exactly?"
    dimensions: { width: 2880, height: 1800 }
    licenseOrOwnership: owned
features:
  - Answers in a column beside your writing, live as you type
  - Plain sentences rather than a calculator syntax
  - Percentages, money, units, cooking measures, dates, times and durations
  - Loans, rates, powers and roots, rounding, number bases and statistics
  - Named values, section totals, and questions asked of the lines above
  - 765 worked examples in the built-in guide, one press to insert
  - English or Turkish input, chosen by you rather than by your region
  - Custom units, and exchange-rate snapshots stamped with the day they were true
  - Folders, pinning, library-wide search, and previewed find and replace
  - A revision timeline per sheet, guarded backup restore, and unlimited undo
  - Export to plain text, Markdown, print, PDF, or a portable library bundle
  - Zen mode, Shortcuts actions, and Spotlight indexing that is off until you ask
releaseDate: 2026-08-16
lastUpdated: 2026-08-17
seo:
  title: Magic Notes — Write the Sum, Read the Answer
  description: A Mac notebook that answers arithmetic written in plain sentences — exact where it can be, and openly approximate where it cannot. Offline, no account, no tracking.
---

Write "rent 1,450 a month" and the year appears beside it. Write "12% of that"
and it knows what "that" was. Magic Notes reads ordinary sentences, keeps the
working in front of you, and stops where an honest answer stops.

## Exact, or it says so

The engine keeps only values it can represent exactly. Anything approximate is
marked with ≈, to the precision you chose, and a written request such as "to 6
decimal places" overrides that on its own line.

Anything impossible is refused **on the line**, with the reason and a hint you
can open. Most calculators round quietly and hand you something that looks
exact. You are never left holding a confident wrong number.

## Written in words, not in syntax

It reads the arithmetic people actually write. Percentages, money, units,
cooking measures, dates, times and durations, loans and interest, rates such as
an amount per week, powers and roots, rounding, factors and combinations,
number bases, and statistics over the lines above.

Name a value and use it further down. Total a section. Ask a question of the
lines above it. Change one number at the top and watch the whole page follow.

The built-in guide, **What Can I Write?**, holds 765 worked examples in twenty
categories — filter it, then press Insert to drop one straight into your sheet.
Every example is run against the real engine by the test suite, so nothing in
the guide teaches a form the app does not have.

## Your rates, your dates

Exchange rates are yours. You enter them, each with the date it was true, and a
conversion names the exact snapshot it used.

Nothing is downloaded, interpolated or invented — so a figure you show someone
else is a figure you can account for.

## A notebook, not a scratchpad

Keep as many sheets as you like, in folders, pinned and sorted the way you work.
Search the whole library. Find and replace with a preview first. Duplicate a
sheet as a starting point, and archive what you are finished with.

Undo and redo go back as far as you need, every sheet keeps a revision timeline,
and backups restore under a guard that checks before it replaces anything. Take
the work with you as plain text, Markdown, print, PDF, or a portable bundle of
the whole library.

## Nothing leaves this Mac

No account. No sync. No cloud. No analytics, no tracking identifiers, no
advertising. The app does not need the network to do its job, and it does not
use one.

Spotlight indexing is off until you turn it on, and covers only sheet titles and
the text you wrote, on this Mac.

## Common questions

**Does it need the internet?** No. There is no networking code in the
application at all — no account, no sync, no analytics, no advertising.

**Where do my notebooks live?** In a folder on your own Mac, backed up locally
and restorable under a guard that checks before it replaces anything. Export to
plain text, Markdown, print, PDF, or a bundle of the whole library at any time.

**What if it cannot answer a line?** It refuses that line where you wrote it and
tells you why, rather than rounding quietly or returning a number that only
looks right.

**Which languages does it read?** English or Turkish, whichever you pick in
Settings. The choice is never guessed from your region, and changing it never
rewrites what you have already written.

_Free on the Mac App Store. The support address answers if a line does not do
what you expected._
