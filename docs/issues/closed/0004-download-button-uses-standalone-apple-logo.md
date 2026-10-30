# 0004 Every Download button shows Apple's logo on its own, which Apple's App Store marketing guidelines rule out

- Severity: medium
- Reach: player
- Area: download button
- Found by: art-project 0001
- Filed: 2026-10-28
- Tried by: —
- Closed by: v0.66.14, card the-download-button-carries-the-studio-s-own-mark-not-apple

Doubt: nothing reported so far shows Apple acting against a developer site for this, so `high` was not used. It rounds up to `medium` because the site is the support and marketing address App Review opens.

## What happens
`src/components/DownloadButton.astro` draws the Apple logo as a standalone glyph inside every Download button for an App Store or Mac App Store link. That is 2 or 3 buttons on the home page, Apps & Games and each product page.

## How to see it
Open `/apps/sole-focus/` or `/apps/waypost-words/`. The Apple logo sits to the left of "Download".

## What should happen
The button uses either Apple's own App Store badge, from Apple's marketing tools, or no Apple artwork at all. Apple's App Store marketing guidelines (developer.apple.com/app-store/marketing/guidelines, read 2026-10-28) say "Don't use the standalone Apple logo" and "Use only the badge artwork provided in these guidelines". Apple's trademark guidelines for third parties (apple.com/legal/intellectual-property/guidelinesfor3rdparties.html, read 2026-10-28) say "You may not use the Apple Logo … on or in connection with web sites" without a written licence.

## Evidence
- assets/0004/01-download-button-apple-logo.png — the Waypost Words Download button at 2x
- assets/0004/02-download-button-studio-mark.png — the same button after the fix, at 1440 px, enlarged 2x: the studio's download mark
- `src/components/DownloadButton.astro:50-54` — the inline Apple logo path
- art-project 0001 drew a studio-owned download mark in its place (picture 3 on that run's page, diff in `docs/skills/art-project/0001-2026-10-28.md`)
