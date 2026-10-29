# The 404 says Not found on 1 line, with a plain line under it

bump: patch
screen: @not-found

Card A of plan 0010, pick 5 of text-project 0003. The 404's title was "Page
not found", and at every common width it broke as "Page not / found", leaving
"found" alone under the display type. The line under it was the sentence every
site uses. The title is now "Not found." and the line says what probably
happened and where to go: "The link may be old, or the address mistyped. Every
page on the site is one click from here." The tab title stays "Page not found".

Measured on the built site with the text-project measuring script: the title
sits on 1 line at 1920, 1536 and 414, and the line under it takes 2 lines on
desktop and 3 at 414, with 0 bad breaks at all 3 widths (report 0003 counted
6 before). The 5 ruled destination rows and the title-left, intro-right opening
from plan 0009 are untouched. `npm run headless` passed (exit 0, 130 and 38
tests); the 404 was photographed before and after at 1440 and 390.
