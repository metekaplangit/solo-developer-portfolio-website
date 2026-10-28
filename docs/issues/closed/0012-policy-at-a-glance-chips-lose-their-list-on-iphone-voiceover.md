# 0012 The "At a glance" chips on every privacy policy lose their list on iPhone VoiceOver

- Severity: low
- Reach: player
- Area: privacy policies
- Found by: plan 0007 loop card (check-plan-0007-landed-and-fix-what-did-not)
- Filed: 2026-10-28
- Tried by: —
- Closed by: card "Every policy's At a glance chips are read as a list" — `role="list"` on the chips, nav, footer and 404 links; the screen probe now fails any unmarked list without it, seen red on every route first

Doubt: whether today's iOS VoiceOver still drops the list — WebKit 304137 (Dec 2025, duplicate of open 122320 since 23 Feb 2026) says it does; not heard on a device here. Rounded up to `low` since only a screen-reader user meets it.

## What happens
`src/components/PolicyArticle.astro` renders the policy's summary chips as `<ul class="glance" aria-label="At a glance">` styled with no bullets and no `role="list"`. Safari on iOS drops list semantics from an unstyled list, so VoiceOver reads "No data collected", "No third-party sharing" as loose text rather than a 2-item list. Every other unstyled list the site draws carries `role="list"`.

## How to see it
`node control/cards/check-plan-0007-landed-and-fix-what-did-not/walk.mjs` after a build: `/privacy/magic-notes/` reads `1 unstyled list(s) without role=list` at both widths and both contrast modes, naming `ul.glance`. It was already there at 36d3bf6, before plan 0007.

## What should happen
The chips keep their list semantics everywhere, like the site's other unstyled lists.

## Evidence
- `src/components/PolicyArticle.astro` — the `ul.glance` line
- https://bugs.webkit.org/show_bug.cgi?id=304137
