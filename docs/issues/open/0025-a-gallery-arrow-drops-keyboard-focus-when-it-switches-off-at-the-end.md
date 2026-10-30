# 0025 A gallery arrow drops keyboard focus when it switches off at the end

- Severity: medium
- Reach: player
- Area: screenshot galleries
- Found by: session (plan 0016 card C, evaluate-project 0001)
- Filed: 2026-10-30
- Tried by: —
- Closed by: —

Doubt: whether a screen reader user notices more than a keyboard user does;
rounded to `medium` because the arrow keys stop working until focus is put
back inside the gallery.

## What happens
On the Waypost Words phone rail, pressing Next until the last view switches Next off with `disabled`.
A disabled button cannot hold focus, so focus falls to the page body: the
focus ring disappears, and Left and Right arrow keys no longer move the
gallery, because they are only listened for inside it.

## How to see it
On `/apps/waypost-words/`, Tab to Next and press Enter until it greys out, then
press Left. Nothing moves; `document.activeElement` is `body`. Previous at the
start and the Mac gallery on `/apps/sole-focus/` switch off by the same code;
only the rail's Next was driven.

## What should happen
Reaching the end leaves focus inside the gallery — on the arrow that still
works, or on the arrow itself kept focusable — so the keys keep working and the
focus ring stays visible.

## Evidence
- Browser pane, 2026-10-30, v0.66.11: after 2 presses on Next the rail read
  `7–10 of 10`, Next `disabled`, focus `null`; 3 Left presses did nothing. With
  focus put on Previous, 2 Left presses paged back to `1–4 of 10`.
- Present before plan 0016: `ScreenshotShowcase.astro` at `f571749` sets
  `prev.disabled` / `next.disabled` the same way (lines 551-552, 656-657).
