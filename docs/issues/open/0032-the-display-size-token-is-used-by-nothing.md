# 0032 The `--display` size token is used by nothing

- Severity: low
- Reach: test-only
- Area: src/styles/global.css
- Found by: health-project 0004 (left alone by health-project 0005 and 0006 too)
- Filed: 2026-11-07
- Tried by: —
- Closed by: —

## What happens
`src/styles/global.css`:117 declares `--display: clamp(2.75rem, 7vw, 4.75rem);`.
No rule reads `var(--display)`; the site's display sizes are `--display-1`, `-2`
and `-3` (the comment at :124-126). A session reaching for "the display size"
can pick the token nothing uses.

## How to see it
`grep -rn "var(--display)" src` — no match.

## What should happen
The unused token is gone, or it is what the display steps are built from.
Removing a rendered token is a code change, which a health run never makes.

## Evidence
- The grep above on 2026-11-07: 0 matches; reported by health-project 0004, 0005 and 0006.
