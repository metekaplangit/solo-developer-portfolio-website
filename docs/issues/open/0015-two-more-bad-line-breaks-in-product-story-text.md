# 0015 2 more bad line breaks in product story text, not in issue 0007's list

- Severity: medium
- Reach: player
- Area: Waypost Words page, Magic Notes page
- Found by: text-project 0003
- Filed: 2026-10-29
- Tried by: card product-apps-and-about-text-breaks-where-a-reader-would, 2026-10-30 — the Magic Notes break is mended; the Waypost heading cannot be mended by layout: its ties leave only "Weather with a mind / of its own" in the 240px label rail, so only new words (the owner's, from the App Store listing) close it
- Closed by: —

Doubt: it could read `low` (only seen); it is filed `medium` to match issue 0007, which holds the same kind of fault, and doubt rounds up.

## What happens
2 pieces of story text break badly at the standard screen sizes. Neither is in issue 0007's list, which holds the rest of this kind.

- Waypost Words, heading "Weather with a mind of its own": at 1920 and 1536 wide it splits as "Weather with a mind / of its own", a long line over a short one (19 and 10 characters).
- Magic Notes, the story's opening paragraph: at 414 wide a line ends on "where" ("…and stops where / an honest answer stops.").

A site-wide wrap change does not mend them: in text-project 0003, switching paragraphs and list items from `balance` to `pretty` raised the site's breaks at the standard sizes from 35 to 82. Each needs its words changed. The Waypost Words heading is set to match its App Store listing word for word, so changing it is the owner's call.

## How to see it
Build, then open `/apps/waypost-words/` at 1536 px wide and `/apps/magic-notes/` at 414 px wide, and read where each line ends.

## What should happen
The heading splits into 2 even lines, or sits on 1. No line of the paragraph ends on a word that points into the next line.

## Evidence
- assets/0015/01-weather-heading-1536.png — the Waypost Words heading at 1536 px
- assets/0015/02-magic-notes-opening-414.png — the Magic Notes opening paragraph at 414 px
- assets/0015/03-magic-notes-opening-390-after.png — the same paragraph at 390 px after the rewording; no bad break
- assets/0015/04-weather-heading-1536-unchanged.png — the Waypost Words heading at 1536 px, still 19 / 10 characters
- docs/skills/text-project/0003-2026-10-29.md — readings for both
