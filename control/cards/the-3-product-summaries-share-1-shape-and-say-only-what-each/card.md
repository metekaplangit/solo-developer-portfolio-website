# The 3 product summaries share 1 shape and say only what each app does

bump: patch
screen: @home
screen: @apps
screen: @sole-focus
screen: @magic-notes
screen: @waypost-words

Plan 0005, card C: piece 3 of text-project 0001.

The 3 summaries now share one shape — what the product is and which device it
is for, then what it does for you — so they read as a set on Apps & Games, the
home band and each product page. The Magic Notes one no longer ends "exactly,
or not at all": the app shows approximate answers with ≈, so the claim was not
true.

Measured in headless Chrome on the built pages: each summary takes 2 lines at
1920 and 1440 (they were 3, 2 and 3 side by side on Apps & Games), with no bad
break at 1920, 1440, 390 or 320 and no page overflow. The longest is now 121
characters, against 179.
