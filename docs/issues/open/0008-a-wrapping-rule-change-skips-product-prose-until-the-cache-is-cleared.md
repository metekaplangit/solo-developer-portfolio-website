# 0008 A change to the wrapping rule does not reach product prose until the content cache is cleared

- Severity: medium
- Reach: test-only
- Area: build, fast checks
- Found by: plan 0005, card A
- Filed: 2026-10-28
- Tried by: —
- Closed by: —

Doubt: deploys build from a fresh checkout, so visitors likely get the fresh render; not checked against a deploy log. Rounded to `medium` because the fast checks went green on text the change never reached.

## What happens
After `src/lib/typography.ts` changed, `npm run build` (and so `npm run headless`) rendered the product pages' Markdown prose from Astro's content cache, made with the old rule. The built site measured 100 bad breaks; after `npx astro build --force` the same code measured 30. The unit and dist suites passed both times.

## How to see it
1. Change `tie()` in `src/lib/typography.ts` so it binds a new word.
2. `npm run build`, then look for that binding in `dist/apps/sole-focus/index.html`: it is missing from the prose.
3. `npx astro build --force` and look again: it is there.

## What should happen
A build after a change to the Markdown plugin or `tie()` renders the prose with the new rule, so the fast checks test what a visitor would get.

## Evidence
- `src/lib/satteri-tie.ts` — the rehype plugin that calls `tie()` on Markdown bodies
- `astro build --help`: "--force  Clear the content layer and content collection cache, forcing a full rebuild."
- Measurements in plan 0005 card A's notes: 100 before the forced build, 30 after
