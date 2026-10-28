# Common questions read as ruled question-and-answer pairs

bump: patch
screen: @magic-notes
screen: @sole-focus
screen: @waypost-words

Card E of plan 0003, from pick 5 of retouch-project 0001, the weakest of the
five. "Common questions" was a run of paragraphs, each opening on a bold
question, so a visitor scanning for one question had to read every answer.

Each question is now its own 20px line over its answer, the pairs ruled apart
by the same hairline the feature list uses, with one more rule under the last
pair. The closing italic note sits apart in the faint tone. It is presentation
only, scoped to paragraphs after `#common-questions` inside `.prose`, so no
content file changed and every other prose section looks as before.

`:has()` carries it. MDN, `:has()`, modified 2026-08-11: widely available since
December 2023, and a `:has()` may not sit inside another `:has()`. None does
here; the last-pair rule puts its `:has()` inside `:not()`.

Magic Notes and Sole Focus have the section. Waypost Words has none, and its
page is unchanged: its built HTML has no `#common-questions`.

Proved by: Headless Suite Testing, complete and green; Scoped Suite Testing on
@magic-notes @sole-focus @waypost-words, 14 of 14; after pictures at 1440 and 390.

unproven: a real phone — the coarse-pointer pass is an emulated one
