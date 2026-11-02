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
summary: A notebook for Mac that does arithmetic. Write the sum as you would say it, and the answer lands beside the line.
platforms: [macos]
storeLinks:
  - store: mac-app-store
    url: https://apps.apple.com/us/app/magic-notes-calculator/id6797499171?mt=12
    status: available
# Free, verified from the listing. The price is what the listing says today and
# nothing more: this page carries no claim about advertising, in-app purchases,
# subscriptions or networking, in either direction, because those are decisions
# the studio keeps open. What the app does with data belongs on its privacy page.
price: "0"
# Identity colour, read from the app rather than chosen for the site. The Magic
# Notes icon is deliberately achromatic — a #4F5963 frame on near-white — and the
# app's own accent palette calls that family Graphite. This is the exact value
# the app renders Graphite as in dark appearance, which is the appearance this
# site's stage matches. See docs/tasks/STEP-0069.md for why the app's default
# accent (a burnt orange) was not used.
hue: "#B2BBC5"
fitFor: "You want to see how your budgets, quotes and loans add up."
fitNotFor: "You need a spreadsheet or a programmable calculator."
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
  - Write plain sentences and see the answers as you type
  - Money, percentages, units and cooking measures
  - Dates, times, durations, loans and interest rates
  - Powers, roots, rounding, number bases and statistics
  - Name a value, total a section, or ask about the lines above
  - 765 worked examples to insert with one press
  - English or Turkish, chosen by you, not by region
  - Add your own units, and exchange rates with the date each was true
  - Folders, pins, search, and replace with a preview
  - Undo all the way back, and backups that restore safely
  - Export to text, Markdown, PDF, print or a bundle of your whole library
  - Zen mode, Shortcuts, and Spotlight if you turn it on
releaseDate: 2026-08-16
lastUpdated: 2026-08-17
seo:
  title: Magic Notes — Write the Sum, Read the Answer
  description: A Mac notebook that answers arithmetic written in plain sentences — exact where it can be, and openly approximate where it cannot.
---

Write "rent 1,450 a month" and the year appears beside it. Write "12% of that"
and it knows what "that" was. Magic Notes reads ordinary sentences and keeps
every step on the page, so you can check the answer.

## Exact, or it says so

Every answer is exact, or clearly marked with ≈.

Approximate answers show the precision you chose. Write "to 6 decimal places" on
a line to change it for that line.

If a line can't be worked out, it tells you why and gives you a hint you can
open.

## Write in words, not formulas

Money, dates, units and loans all work in plain sentences, and so do rates such
as an amount per week.

Name a value and use it further down. Total a section. Ask a question of the
lines above it. Change one number at the top and watch the whole page follow.

The built-in guide, **What Can I Write?**, has 765 worked examples in 20
categories. Filter it, then press Insert to add one to your sheet. We test every
example against the app itself, so each one in the guide works.

## Your rates, your dates

You set each exchange rate, and the date it was true. Each conversion shows
which rate and date it used.

The app doesn't estimate a rate between two dates, so you can explain any figure
you show someone.

## A notebook, not a scratchpad

Keep as many sheets as you like, in folders, pinned and sorted the way you work.
Search the whole library. Find and replace with a preview first. Duplicate a
sheet as a starting point, and archive the sheets you are finished with.

Undo and redo go back as far as you need, and every sheet keeps a history of its
changes. Before a backup replaces anything, the app checks it first. Take the
work with you as plain text, Markdown, print, PDF, or a portable bundle of the
whole library.

## What happens to your notebooks

Spotlight search is off until you turn it on, and it only covers sheet titles and
the text you wrote.

The privacy policy says what Magic Notes stores and why. It is dated, so you can
see when it last changed.

## Common questions

**Where do my notebooks live?** In a folder on your Mac, with backups kept on
your Mac too. You can export them at any time.

**What if it can't answer a line?** It tells you why, right on that line, instead
of giving you a number that only looks right.

**Which languages does it read?** English or Turkish, whichever you pick in
Settings. The choice is never guessed from your region, and changing it never
rewrites what you have already written.

_If a line gives an answer you did not expect, write to us. We read every
message._
