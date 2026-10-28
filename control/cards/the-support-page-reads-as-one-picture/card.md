# The support page reads as one picture

bump: patch
screen: @support

Plan 0007, card B, from retouch-project 0002 part 4. Closes issue 0006.

The support page was 4 bands at uneven gaps (40, 120, 40 px at 1440): the hero,
then the address in a separate band below it with Sole Focus's orange wash
(`.panel-accent` falling back to the default hue on a studio page), then 3
lifted boxes for "What to include", then the products. Now the headline and the
address are one opening band — hero left, a colourless `.panel` right from
64rem with a small "Write to" label, the mono address, the reply note and the
Email support button, top-aligned so it never rises above the page-top line.
"What to include" is a numbered, ruled `ol` of 3 (`role="list"` kept, since
Safari drops list semantics from an unstyled list), and the products band sits
on the same rhythm.

The hero line said "there's no form, no ticket number, and nothing is
tracked" — the never-promise shape the site dropped on 2026-09-10. It now says
"there's no form and no ticket number." The claims test only knew the bare
phrase "nothing tracked", so its pattern now allows up to 3 words between
"nothing" and "tracked"; run against the old build it went red on
`support/index.html` with the old sentence, and is green on the new one.

Measured on the built site at 1440: gaps between the 3 groups 72 / 72; page
height 1079 (1246 before); first-screen weight −5.3% of the width off centre
(−9.4% before). At 390 the panel stacks under the lede, gaps 48 / 48, nothing
scrolls sideways. Both pictures were looked at whole.
