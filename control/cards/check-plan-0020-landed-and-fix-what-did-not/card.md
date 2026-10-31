# Check plan 0020 landed, and fix what did not

bump: patch

Plan 0020, card B, the loop card for resolve-issues 0004's 1 card. Nothing
needed fixing.

- A (v0.66.31): issue 0026 sits in `docs/issues/closed/` with its Closed by
  line naming v0.66.31 and the card. The rail settled on a whole shot in 1,600
  driven rounds and 4 storms, all run in card A on the finished code, so they
  were not run again here.
- The proof was real: `aimAfterResize`'s test was seen red on today's
  behaviour (2 of its 4 checks) before the fix; the driver proved its own
  reading on a rail held half-way; the probe's new exact reading caught a real
  break (253 px, storm seed 3) between card A's two fixes, so it detects.
- Must keep working: quick presses, a resize mid-glide, arrow focus at the
  ends and native scrolling — the screen suite (23 of 23, including
  @gallery-presses, @gallery-resize, @gallery-focus and @waypost-rail) passed
  in Chrome for Testing on v0.66.31.
- Seams: card A was the only card; its probe changes (exact reading, replay
  `--config` and `--since`) were each used in card A after being made.

Left alone: issues 0027 (tools that can start the installed Chrome) and 0028
(Chrome refusing the support email link in a storm), both filed by card A.
