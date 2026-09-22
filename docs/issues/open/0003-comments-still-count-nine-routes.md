# 0003 Screen-suite and capture comments still say the site has nine routes

- Severity: low
- Reach: test-only
- Area: test and capture tooling comments
- Found by: wrap-up, 2026-09-22
- Filed: 2026-09-22
- Tried by: —
- Closed by: —

## What happens
The site has 11 routes since v0.53.0 added the two Wander Words pages, and both route tables were updated, but the comments around them still say "nine".

## How to see it
`grep -n nine tests/screens/site.spec.ts scripts/capture.mjs`

## What should happen
The comments give the real count, or no count at all.

## Evidence
- `tests/screens/site.spec.ts:28`, `:29`, `:527`, `:605`
- `scripts/capture.mjs:20`, `:123`, `:129`
- Some describe history (nine routes at the time), so each line needs reading, not a blanket replace.
