# The product story sits on the label rail

bump: patch
screen: @sole-focus
screen: @magic-notes
screen: @waypost-words

Plan 0007, card D, from retouch-project 0002 part 1. The story below "What it
does" was one 752 px prose column hugging the left, with the maker's note in a
sticky aside beside it on Sole Focus and nothing at all beside it on Magic Notes
and Waypost Words — for about 2000 px the right 45% of the page stood empty.

The story is now one `.story` block on the page's own grid. From 64rem each
section heading sits on the 15rem label rail, level with its first paragraph,
and the prose runs in the `--measure-mid` column that starts on the same line
as the "What it does" list above it. Each section opens on a hairline across
both tracks; the opening paragraph reads as a lede; Common questions take the
same two tracks; a heading spans its section's rows so a three-line name never
pushes its own text down; and Waypost's story, which opens on a heading, starts
both tracks on the top line. The maker's note, where there is one, opens the
story on the same two tracks — "A note from the maker" on the rail. Under 64rem
the story stays one column. MakerNote still renders its own `<aside>`, not
nested in another.

Measured on the built site at 1440: whole-page largest empty region on Magic
Notes 5.5% (16.8% before), Sole Focus 4.9% (11.1% before, its largest gap is now
the opening's top-right, which card E fills), Waypost 6.4%; on Magic Notes
every `h2` box tops at the same y as its first paragraph (144/144, 392/392). At
390 nothing scrolls sideways. The story regions of all 3 pages were looked at
in the after pictures.
