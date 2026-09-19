# 0001 The fast checks stop at npm audit: devalue below 5.9.1

- Severity: high
- Reach: player
- Area: build checks
- Found by: health-project 0001
- Filed: 2026-09-19
- Tried by: —
- Closed by: —

Doubt: nothing a visitor sees breaks (devalue only runs at build time), but every card's check stops, so it is rounded up to high.

## What happens
`npm run headless` exits 1 at its first step, `npm audit --omit=dev`, so the build, `astro check` and both test suites never run inside it, and `python3 control/loop.py check` cannot pass for any card.

## How to see it
`npm run headless`, or `npm audit --omit=dev` alone.

## What should happen
The audit reports 0 vulnerabilities and the chain runs to the end.

## Evidence
- `npm audit --omit=dev` on 2026-09-19: `devalue <5.9.1`, moderate, GHSA-9rgm-9g3h-6x36 (DoS via malformed input), "fix available via npm audit fix".
- `npm ls devalue`: `astro@7.3.2 -> devalue@5.8.1`.
- The rest of the chain run by hand on the same code: build, `astro check` 0 errors, 114 unit tests and 22 built-output tests all pass.
