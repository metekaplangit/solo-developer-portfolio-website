# The Sole Focus story says what the app does, once

bump: patch
screen: @sole-focus

Plan 0008, card C: pick 4 of text-project 0002.

The story on the Sole Focus page said several things twice (its 2 opening
paragraphs both said the timer is ready at once; the progress section said
"never a chore, and never a streak") and leaned on advert words
("distraction-free", "glanceable", "soothing", "gentle"). It now says each
thing once, in plain words, and claims nothing the
page did not claim before. Counted from the Markdown, without headings and
without the privacy paragraph: 262 words before, 193 after. The heading "Calm,
and always in reach" is now "Always in reach", and the comment on the features
list that names it was updated to match.

The "Two ways to work" body stays split in 2 paragraphs, so none runs past 4
lines at 414. "Zen mode" and "Study mode" are held together with no-break
spaces. The privacy paragraph and Common questions are unchanged, and the
built-output test of more than 20 no-break spaces in the body passed.

Measured in the built page: 0 bad breaks at 1920, 1536 and 414. At 320 there
are 3, 2 of them in text this card did not touch (the support-time row and the
unchanged privacy paragraph); 320 is judged for fit only, and nothing scrolls
sideways there.
