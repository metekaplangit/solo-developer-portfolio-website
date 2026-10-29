# The About opening says who I am in 2 plain sentences under a heading that breaks cleanly

bump: patch
screen: @about

Card B of plan 0010, pick 1 of text-project 0003. The About heading read "One
person, making software that behaves." and broke after "making" at every
common width. The introduction ran 5 lines, said "studio" twice in one sentence
and hedged ("try to keep them"). The heading is now "I make software that
behaves.", the introduction is "I’m Mete Kaplan, and MetKap Studio is just me. I
make small apps and games, and I answer every email about them myself.", and the
contact line is "A bug, a question, an idea: write to me." The name still comes
from `site.person`, and the values grid and the Get in touch panel are as they were.

Measured on the built site: the heading is 2 lines ("I make software / that
behaves.") at 1920, 1536 and 414; the introduction is 3 lines on desktop and 4
at 414; the contact line is 1 line at all 3. 0 bad breaks across the 3 pieces
(report 0003 counted 7 before). This mends the 3 About rows that issue 0007
lists; 0007 stays open for its other rows. At 414 the introduction splits "apps
/ and games", which no break rule flags. `npm run headless` passed (exit 0); About
photographed before and after at 1440 and 390.
