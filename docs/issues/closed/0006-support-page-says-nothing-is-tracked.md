# 0006 The support page says "nothing is tracked", the never-promise shape the site removed on 2026-09-10

- Severity: low
- Reach: player
- Area: support page
- Found by: health-project 0002
- Filed: 2026-10-28
- Tried by: —
- Closed by: plan 0007 card B, "The support page reads as one picture" — the line reworded, the claims test widened and seen red first

Doubt: in context the line may mean "no ticket tracking" for support email rather than visitor tracking. It reads as either, which is the problem. Rounded to `low` because it is only seen.

## What happens
`/support/` says: "Email me directly — there's no form, no ticket number, and nothing is tracked." On 2026-09-10 (v0.51.0) the site dropped every promise about what the studio will never do, and `tests/no-business-model-claims.test.ts` forbids `nothing tracked`, but the phrase with "is" in the middle slips past it. health-project 0001 noted the line on 2026-09-19 and left it alone.

## How to see it
`grep -n 'nothing is tracked' src/pages/support/index.astro`

## What should happen
The support line states how support works today without promising that nothing will ever be tracked, and the claims test catches the phrase with words between "nothing" and "tracked".

## Evidence
- `src/pages/support/index.astro:32`
- `tests/no-business-model-claims.test.ts` — the `nothing tracked` pattern in `FORBIDDEN`
- `PRODUCT.md`, Conversion & proof — the 2026-09-10 decision
