# 0010 The privacy overview and the 404 page start closer to the header than every other page

- Severity: low
- Reach: player
- Area: page top
- Found by: retouch-project 0002
- Filed: 2026-10-28
- Tried by: plan 0009 card A fixed the 404 half (its kicker now sets at body leading: 50 px at 1440, 34 px at 390) and added the `@every-route` page-top test, which lists `/privacy/` as this issue and fails the day it agrees
- Closed by: v0.66.21, card the-privacy-overview-starts-on-the-same-page-top-line-as-eve

## What happens
The first content on every route sits 50–51 px below the header at 1440 px and 34–35 px at 390 px — except `/privacy/` (40 px and 27 px) and `/404` (45 px and 29 px). Moving between pages, those two jump up. DESIGN.md's Page-Top Rule says every page begins the same distance below the header.

## How to see it
Measured with the retouch-project screen script (scratch, not kept): the top of the first inked box inside `<main>` minus the header's bottom, per route.

| Route | 1440 | 390 |
| --- | --- | --- |
| every other route | 50–51 | 34–35 |
| `/privacy/` | 40 | 27 |
| `/404` | 45 | 29 |

Likely causes, not confirmed: `/privacy/` opens on a policy title with no eyebrow and no back link, so the line box of the large title sits higher; `/404` opens on a small mono code line.

## What should happen
Both routes start their first content on the same `--page-top` line as the rest.

## Evidence
- assets/0010/01-privacy-vs-support-top.png — the top of `/privacy/` above the top of `/support/` at 1440; the privacy title starts higher
- assets/0010/02-privacy-top-1440-after.png — `/privacy/` at 1440 after the fix: the "Privacy" eyebrow on the page-top line
