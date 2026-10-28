# The product page opening states its facts as a ledger

bump: patch
screen: @sole-focus
screen: @magic-notes
screen: @waypost-words

Plan 0007, card E, from retouch-project 0002 part 2. Every product page opened
with the lockup, summary and buttons on the left and the top-right of the first
screen empty, while the facts a visitor checks before clicking through — price,
requirement, who made it, how fast support answers — sat in two faint lines
under the buttons.

Those two lines are now a ruled ledger, a `<dl class="spec">` with one
`<div>` per fact: Price, Requires, Made by (linking to About) and Support
(linking to Support, "Usually within 2–3 business days" — the "usually" from
the old line kept, so it promises no more than before). Labels sit left in
faint tracked capitals, values right, a hairline above each row and one closing
the sheet. From 64rem the header is two columns and the ledger takes the right
one, its last rule level with the bottom of the buttons; under that it stacks
below the buttons. The get panel further down still shows FactsLine.

Read from the built pages: Magic Notes "Free / macOS 15 or later", Sole Focus
"Free / macOS 10.15 or later", Waypost Words "Free / iOS or iPadOS 15 or later",
each with Made by and Support. First-screen largest empty region at 1440: Magic
Notes 12.9% (24.6% before), Sole Focus 11.3%, Waypost 12.4%; inked share on
Magic Notes 69.9% (59.3% before). At 390 the ledger sits under the buttons and
nothing scrolls sideways. The Waypost opening at 1440 and Sole Focus's at 390
were looked at; the summary's break before "from one small window" at 390 is
issue 0007, already filed.
