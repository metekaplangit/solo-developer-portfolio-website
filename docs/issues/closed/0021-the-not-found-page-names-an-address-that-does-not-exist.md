# 0021 The not-found page names an address that does not exist as its own

- Severity: low
- Reach: player
- Area: not-found page
- Found by: hunt-project 0001
- Filed: 2026-10-29
- Tried by: —
- Closed by: v0.66.27, card the-not-found-page-claims-no-address-of-its-own

## What happens
`dist/404.html` carries `<link rel="canonical" href="https://metkapstudio.com/404/">`
and the same `og:url`. No page is built at `/404/`, and the not-found page is
served for every mistyped address, so each of them tells search engines and
link previews that it is a page called `/404/`.

## How to see it
`grep -o '<link rel="canonical"[^>]*>' dist/404.html` after a build.

## What should happen
The not-found page carries no canonical or `og:url`, or carries `noindex`
like the moved pages do.

## Evidence
- `src/layouts/BaseLayout.astro:36` builds the canonical from the page's own path for every page, the not-found page included.
- Search engines drop a page answered with a 404 status on their own, so nothing is known to be harmed; filed because it is a wrong fact the page states.
