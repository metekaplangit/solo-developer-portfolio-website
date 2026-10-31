# Every live page carries only the scripts the build wrote

bump: patch
unproven: the Cloudflare Web Analytics switch, which lives in the owner's dashboard

Plan 0019, card A, for issue 0002. Issue 0002 stays open: nothing here could
close it.

Re-checked as filed on 2026-10-31: `npm run test:live` against
https://metkapstudio.com fetched 12 of 12 routes and exited 1 with 36
problems — on every route, the Cloudflare Web Analytics beacon
(`static.cloudflareinsights.com/beacon.min.js`) is served though the build
never wrote it, and the page points at that third-party origin. Same fault as
filed on 2026-09-19, now on 12 routes instead of 9 because the live tier has
grown to cover every page.

Nothing in this repository can switch it off. The site is GitHub Pages behind
Cloudflare, the beacon is added at Cloudflare's edge, and the project is
static-only by rule, so no header, Worker or edge setting is written from here.
The live tier was left exactly as it is, still red, because red is the true
answer. The issue's Tried by line now says this, so the next run spends no
card learning it again; it closes when the owner turns Web Analytics off in
the Cloudflare dashboard and `npm run test:live` goes green.
