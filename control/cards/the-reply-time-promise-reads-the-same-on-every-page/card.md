# The reply-time promise reads the same on every page

bump: patch
screen: @about
screen: @sole-focus
screen: @magic-notes
screen: @waypost-words

Plan 0005, card D: piece 4 of text-project 0001.

The promise about support replies was worded 4 ways. It now follows the
Support page's own line, "I usually reply within 2–3 business days": the About
card reads "Support email comes straight to me. I read every message, and I
usually reply within 2–3 business days.", and every product page's trust line
reads "Made by Mete Kaplan, who answers support personally — usually within
2–3 business days.", its phrases held together with `tie()`. The 2 sign-off
lines in `MakerNote.astro` use the same wording, but neither renders on any page
today: they belong to the `quiet` and `lead` tones, and no page uses `lead`
while the home spotlight's product has no maker note.

Measured in headless Chrome: the About card takes 2 lines at 1440 like its
siblings, with no bad break (it had a stranded start and a short last line);
the trust line takes 1 line on desktop and 2 at 390, with no bad break. The
Support line itself is unchanged.
