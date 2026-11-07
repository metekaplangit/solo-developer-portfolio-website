# 0033 `site.brand` repeats `site.name`

- Severity: low
- Reach: test-only
- Area: src/lib/site.ts
- Found by: health-project 0004 (left alone by health-project 0005 and 0006 too)
- Filed: 2026-11-07
- Tried by: —
- Closed by: —

## What happens
`src/lib/site.ts` declares `name: 'MetKap Studio'` and `brand: 'MetKap Studio'`.
`brand` is read once, by `src/components/Nav.astro`:18; `name` everywhere else.
Two fields holding one fact invite a session to change one and not the other.

## How to see it
`grep -rn "site\.brand" src` — 1 match, `Nav.astro`:18.

## What should happen
One field holds the studio's name, read everywhere. That changes product code,
which a health run never touches.

## Evidence
- The grep above on 2026-11-07; reported by health-project 0004, 0005 and 0006.
