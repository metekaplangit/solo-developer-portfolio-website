# 0029 `site.headline` is used nowhere, and its comment calls it the home headline

- Severity: low
- Reach: test-only
- Area: src/lib/site.ts
- Found by: health-project 0003 (left alone by health-project 0001 and 0002 too)
- Filed: 2026-10-31
- Tried by: —
- Closed by: —

## What happens
`src/lib/site.ts`:14-17 declares `headline: 'Brilliant Products for All'` with
a comment calling it the "Home hero headline … Kept here, not inline, so the
wording has one owner". Nothing reads it: the home page's headline has been
"Small studio. Serious craft." since `docs/CHANGELOG.md`:800. A session that
trusts the comment edits a string nobody sees. `lede` (line 18-20) points at
it as its reason for being platform neutral.

## How to see it
`grep -rn "\.headline" src` — no match.

## What should happen
Either the field goes, with the `lede` comment no longer leaning on it, or the
comment says it is unused and why it is kept. The comment was owner-directed on
2026-07-18, so which one is the owner's call.

## Evidence
- `grep -rn "headline" src scripts tests` on 2026-10-31: only comments and CSS
  notes outside `src/lib/site.ts`.
