# 0018 A link to a page not yet visited shows nothing until it arrives

- Severity: low
- Reach: player
- Area: page changes
- Found by: smooth-project 0001
- Filed: 2026-10-29
- Tried by: —
- Closed by: v0.66.28, card a-link-to-a-page-not-yet-visited-answers-at-once

## What happens
Tapping a link to a page the visitor has not opened yet leaves the old page
standing, unchanged, for the whole network round trip: 200–345 ms in Chrome
on a Mac, 177–455 ms in Safari's engine, 190–245 ms on a throttled phone.
The same link to a page already visited answers in 10–60 ms. Nothing is
fetched ahead of the tap, and links have no press state of their own.

## How to see it
`node scripts/probe/smooth-probe.mjs drive` against https://metkapstudio.com:
every `page change` line, `toFirstFrame` against `toResponse`.

## What should happen
The tap answers within about 100 ms (the premium range for a tap) — the next
page already in the cache, fetched while the link was in view or hovered.

## Evidence
- Live, 4 lanes: first frame follows the HTML response by 1–15 ms on every
  uncached page change, so the wait is the network, not the site's code.
- Most of these sit inside the 300 ms screen-change budget and the browser
  shows its own progress, which is why smooth-project 0001 left it a line.
- Stack idea from that run: Astro's built-in `prefetch` (HTML only; Safari
  falls back to `fetch()`, which the 600 s cache then serves).
- assets/0018/01-page-changes-before.jsonl — smooth probe, Chromium, dist served with 250 ms delay: first visits 264–291 ms to a first frame
- assets/0018/02-page-changes-after.jsonl — the same with prefetch on: every page change 10–61 ms
