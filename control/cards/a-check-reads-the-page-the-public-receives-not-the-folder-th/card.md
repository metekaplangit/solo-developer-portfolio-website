# A check reads the page the public receives, not the folder the build wrote

bump: minor

`npm run test:live` is new. It fetches every one of the nine routes from
`https://metkapstudio.com`, reads the HTML that actually came back, and holds it
against the same page in `dist/`. Three things fail it: a `<script>` element the
build never wrote, a third-party origin the build never pointed at, and a served
page with no Content-Security-Policy. Every failure names the route and the
exact URL. Point it somewhere else with `npm run test:live -- <url>`.

**Why this was missing and why it matters.** Every other check in this project
reads `dist/`. Nothing between `dist/` and a visitor belongs to this
repository, and on 2026-09-10 that was not a hypothetical: Cloudflare Web
Analytics was injecting `static.cloudflareinsights.com/beacon.min.js` into every
live page, against the "no analytics, no third-party services" control in
`CLAUDE.md`, and every gate here was green. The page's own CSP blocked the
script so nothing tracked — `docs/SECURITY.md` and the CSP comment in
`astro.config.mjs` both say that is exactly what it is for, and it worked. But
the only reason anybody knew was that somebody opened the site and looked. This
card is that look, written down and repeatable.

Two decisions worth keeping. It compares **served bytes against built bytes**
rather than loading the page in a browser: a browser shows what survived the
CSP, and the served HTML shows what was sent, which is the thing that changed.
And it sends a real browser `Accept: text/html` header, because Cloudflare only
injects into responses it takes for page navigations — a bare `fetch()` gets a
clean page back and reports all-well. That cost a wrong answer once during the
check-up before it was noticed, so it is written down at the top of the script.

**It is not in `npm run headless`, and no card has to run it.** That tier runs
on every card, offline, in seconds; a network fetch inside it would turn an
unrelated card red the first time a CDN hiccupped. This one is for after a
deploy, and for whenever something in front of the site might have moved.

Seen red and seen green before it was trusted:

- Against the live site: **exit 1**, 27 problems across all 9 routes, each
  naming `https://static.cloudflareinsights.com`.
- Against `astro preview` serving the very same `dist/` on 5757: **exit 0**,
  `Every served page matches its build`.

**It stays red until somebody switches Cloudflare Web Analytics off**, and that
is a setting in the Cloudflare dashboard, not a file here. `CLAUDE.md` now says
so where the tiers are described, so the next person to run it and see red
learns what it means rather than assuming the check is broken.

`docs/STATUS.md` records this beacon as verified gone on 2026-08-01. That was
true when it was written and `CLAUDE.md` says `docs/` is read-only history, so
it is left exactly as it is.

Proved by Headless Suite Testing complete — `npm audit --omit=dev` clean,
0 errors from `astro check`, 114 unit tests, 22 built-output tests, exit 0 —
plus the two runs of the new tier above. No screen file changed and nothing a
visitor sees is different; this card adds a way of looking, not a thing to look
at.
