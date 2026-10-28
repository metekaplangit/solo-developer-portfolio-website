# 0007 31 bad line breaks remain in interface text that the wrap rule cannot mend

- Severity: medium
- Reach: player
- Area: whole site
- Found by: text-project 0001
- Filed: 2026-10-28
- Tried by: —
- Closed by: —

Doubt: it could read `low` (only seen), but a torn line is the "ugly" that `medium` names; doubt rounds up.

## What happens
Lines of interface text end on a word that points forward ("…has its own / privacy page"), on the first word of a new phrase ("One person, making / software that behaves."), or leave a block uneven. text-project 0001 measured 173 such breaks across the site's interface text at 1920, 1440 and 390 px wide (legal pages not counted). In a throwaway copy its site-wide wrap rule alone brings that to 36, and its 5 rewrites together to 31. These 31 need their words changed; no CSS or tie rule mends them without making unbreakable runs that overflow 320 px. They are listed below as they stand **after** those rewrites. If none of the rewrites is built, all 173 are still live.

## How to see it
Build, then read each line's last word at 1920, 1440 and 390 px on the routes below. Measured by the text-project measuring script (scratch, not kept).

| Route | Text | Width and kind |
| --- | --- | --- |
| `/apps/` | Every app and game the studio makes. Each product has its ow… | 1920 forward-word, 1440 forward-word, 390 forward-word |
| `/apps/sole-focus/` | Your settings, sessions and presets are yours, and every one… | 1920 forward-word, 1440 forward-word, 390 forward-word |
| `/apps/magic-notes/` | You want a programmable calculator, a spreadsheet, or a comp… | 1920 forward-word, 1440 forward-word |
| `/apps/magic-notes/` | The engine keeps only values it can represent exactly. Anyth… | 1920 stranded-start, 1440 stranded-start |
| `/about/` | One person, making software that behaves.… | 1920 stranded-start, 1440 stranded-start, 390 stranded-start |
| `/about/` | MetKap Studio is the one-person studio of Mete Kaplan. I bui… | 1920 forward-word, 1440 forward-word, 390 stranded-start |
| `/about/` | Collect as little as possible, and say so plainly. Every pro… | 1920 forward-word, 1440 forward-word, 390 forward-word |
| `/` | Documented. Every product has its own privacy page, kept cur… | 390 forward-word |
| `/apps/` | More is in progress. Nothing gets announced here until it’s … | 390 stranded-start |
| `/apps/sole-focus/` | You need a website blocker, team tracking, or cross-device s… | 390 stranded-start |
| `/apps/sole-focus/` | Sole Focus is a calm, distraction-free focus timer for your … | 390 stranded-start |
| `/apps/sole-focus/` | Zen mode shrinks everything to a small, always-on-top window… | 390 stranded-start |
| `/apps/sole-focus/` | What the app stores, and what it does with it, is set out on… | 390 forward-word |
| `/apps/sole-focus/` | I built Sole Focus because every timer I tried wanted to be … | 390 forward-word |
| `/apps/magic-notes/` | It reads the arithmetic people actually write. Percentages, … | 390 stranded-start |
| `/apps/magic-notes/` | What the app stores, and what it does with it, is set out on… | 390 forward-word |
| `/apps/waypost-words/` | Reveal a letter: one letter from an answer you haven’t found… | 390 stranded-start |
| `/apps/waypost-words/` | Reveal a square: the letter in the square you pick.… | 390 stranded-start |
| `/about/` | Questions, bugs, or ideas — the door’s open.… | 390 stranded-start |

## What should happen
No line of interface text at the standard sizes ends on a forward-pointing word or strands a phrase's first 1–2 words. Each piece is reworded so its phrases fit their lines.

## Evidence
- assets/0007/01-about-heading.png — the About heading at 1440 px: "One person, making / software that behaves."
- docs/skills/text-project/0001-2026-10-28.md — readings before and after, and the wrap rule's diff
