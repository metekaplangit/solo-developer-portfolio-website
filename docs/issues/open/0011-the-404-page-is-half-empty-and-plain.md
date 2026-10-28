# 0011 The 404 page is half empty, and its last link wraps alone on a phone

- Severity: low
- Reach: player
- Area: 404
- Found by: retouch-project 0002
- Filed: 2026-10-28
- Tried by: —
- Closed by: —

Doubt: it could be called a design want rather than a fault; filed because retouch-project files a far-from-premium part that missed its 5.

## What happens
`/404` is a small code line, a title, one sentence and a row of 5 plain text links. At 1440 px the largest empty region is 50.9% of the screen (bottom left, 576 × 464); at 390 px it is 40.4%, and the link row breaks so "About" sits alone on its own line. Nothing on it looks like the rest of the site's care: no product, no route back to the apps beyond a bare word.

## How to see it
Open any missing address, e.g. `/nothing-here`, at 1440 and 390 px.

## What should happen
A lost visitor gets a composed page in the site's own look that fills its screen on purpose and offers the ways on, with no orphaned link.

## Evidence
- assets/0011/01-404-1440.png — the page at 1440
- assets/0011/02-404-390.png — the page at 390, "About" alone on the second link line
