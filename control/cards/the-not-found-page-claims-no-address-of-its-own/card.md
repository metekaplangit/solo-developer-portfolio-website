# The not-found page claims no address of its own

bump: patch
unrendered: only the page head changes — the not-found page drops its canonical and og:url and gains noindex; nothing on screen moves

Closes issue 0021.

Plan 0019, card C. Re-checked as filed: `dist/404.html` carried
`<link rel="canonical" href="https://metkapstudio.com/404/">` and the same
`og:url`, an address nothing is built at, while the page answers for every
mistyped address.

`BaseLayout` takes a new `noAddress` prop for a page with no address of its
own. With it, the page names no canonical and no `og:url`, and carries
`noindex` the way the moved Wander Words pages already do. `404.astro` sets it.
Every other page's canonical and `og:url` are unchanged.

Why the old test stayed green: "carries exactly one canonical URL" exempted
the not-found page from its target check instead of holding it, so a wrong
address there could never fail it. That exemption is gone. The cheap test is
in the built-output suite: on every built page, every canonical and `og:url`
names an address the build serves, and the not-found page names none and
carries `noindex`. Seen red on the unfixed build (`/404 names
https://metkapstudio.com/404/`, twice), green after. `npm run headless` exit
0 (150 unit, 54 built-output).
