# 0002 Every live page is served a Cloudflare analytics script the build never wrote

- Severity: medium
- Reach: player
- Area: live site
- Found by: health-project 0001
- Filed: 2026-09-19
- Tried by: —
- Closed by: —

## What happens
Cloudflare Web Analytics injects `static.cloudflareinsights.com/beacon.min.js` into every page at metkapstudio.com. The page's Content-Security-Policy blocks it, so nothing is tracked, but the served page carries a third-party script while the website privacy policy says no analytics or tracking. Recorded in `CLAUDE.md` since 2026-09-10; the setting is in the Cloudflare dashboard, not this repository.

## How to see it
`npm run test:live`

## What should happen
`npm run test:live` passes: the served HTML carries only what `dist/` holds.

## Evidence
- `npm run test:live` on 2026-09-19: exit 1, red on all 9 of the 9 routes it fetches, each with "a <script> the build never wrote is being served — https://static.cloudflareinsights.com/beacon.min.js/…" and "points at a third-party origin the build never wrote".
