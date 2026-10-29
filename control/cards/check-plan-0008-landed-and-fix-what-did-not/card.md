# Check plan 0008 landed, and fix what did not

bump: patch

The loop card for plan 0008, the 4 text rewrites picked from text-project 0002.
All 4 cards landed: A (v0.63.9) Magic Notes' 3 home statements, B (v0.63.10)
the For you if / Not for you if lines, C (v0.63.11) the Sole Focus story, D
(v0.63.12) the deal. Each card measured its own text in the built site at its
close: 0 bad breaks left at 1920, 1536 and 414 on the 3 pages the plan touched.

The seams held. A and B both edit the Magic Notes file and B and C the Sole
Focus file; applying the text-project's tested diff to `48c3215` and comparing
it with main leaves only 2 intended differences, both in the Sole Focus file:
the features comment renamed to the new heading, and 1 source line rewrapped.
The must-keep test phrases, the privacy paragraphs and Common questions are
unchanged, and the no-break-space floor test passed in every card.

`walk.mjs` in this workshop reads home → Magic Notes → Sole Focus at 1536 and
414: every line the plan wrote is shown, every line it replaced is gone, no
page scrolls sideways, no page error, every image loads. It went red on a
planted 3000 px box and planted old lines first. The 6 whole-page photos were
looked at in full, and nothing on them is broken. This card changes no screen,
so the control runs no screen test for it; @home, @magic-notes and @sole-focus
ran and passed in cards A–D.

One thing it found is older than the plan: scrolling any of these pages makes
headless Chrome 156 on this Mac quit, with or without JavaScript, while a plain
page scrolls fine. The build of `48c3215` does the same, so it is filed as
issue 0013 and left alone; the walk loads lazy images without scrolling
instead. Nothing needed fixing.

A line below the bar: at a 403 px wide window the third home statement, "You
set each exchange rate, and the date it was true.", wraps to 2 lines where its
2 siblings take 1; at 414 all 3 take 1.
