# 0019 The live tier never fetches the Waypost Words pages

- Severity: medium
- Reach: test-only
- Area: live tier
- Found by: hunt-project 0001
- Filed: 2026-10-29
- Tried by: —
- Closed by: the card "Every check covers every page the site builds" (plan 0016 A), 2026-10-30 — `scripts/live.mjs` reads `scripts/routes.mjs`; `npm run test:live` now reads `12 of 12 route(s) fetched`, both Waypost Words pages among them; the built-output test "has every check that covers every page read that table" seen red first

## What happens
`npm run test:live` checks 9 routes, written out by hand in `scripts/live.mjs`.
The site has 11 pages people can reach. The 2 it never fetches are
`/apps/waypost-words/` and `/privacy/waypost-words/` — the pages the game
itself links to, and the policy App Review opens. Whatever sits in front of the
site could change those 2 pages and the live tier would not say so.

## How to see it
`npm run build`, then `npm run test:live`. Its first line reads
`9 of 9 route(s) fetched`, while `dist/sitemap-0.xml` lists 11 pages.

## What should happen
The live tier fetches every page the build makes that a visitor can reach,
read from `dist/` or the sitemap rather than a list kept by hand.

## Evidence
- `scripts/live.mjs:43` — the `ROUTES` table, 9 entries, no Waypost Words.
- Run 2026-10-29: `Live tier — https://metkapstudio.com, 9 of 9 route(s) fetched and held against dist/.`
- The same table shape went stale once before: issue 0003 (comments still count 9 routes).
