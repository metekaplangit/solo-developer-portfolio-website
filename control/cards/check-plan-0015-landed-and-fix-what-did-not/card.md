# Check plan 0015 landed, and fix what did not

bump: patch
unproven: a real iPhone in Safari — WebKit through Playwright at 320 and 390 wide with touch only

The loop card for plan 0015, against its bar: does what card A built work the
way it was supposed to, is any of it broken, does the site still stand up. Scope
was exactly what A touched. It found nothing to fix, so this card changes no
product file.

Driven (a phone walk on the built site, Chrome 156 and Playwright WebKit, 320
and 390 wide, touch on): on Sole Focus, Magic Notes and Waypost Words the store
button and "Privacy policy" both measure 52 px and sit inside the window; the
store button goes to the product's App Store listing; the page's other buttons
keep a site height; tapping "Privacy policy" opens that product's policy.
60 of 60 checks held.

Looked at: card A's after picture at 390 (Sole Focus) — the two buttons one
height, the facts sheet and gallery below unmoved.

Proof was real: A's new rule ("button heights in one set") was seen red on the
unfixed code on all 3 product pages at 320, 390 and the phone pass, and green
at its close in v0.66.8, with @support, @about and @every-route swept beside it.

Left as lines, not fixed: in Playwright WebKit, closing a page hung the walk
until it reused one page instead — the harness, not the site (as in plan 0014's
check). A walk picture taken straight after load caught the row mid-fade, blank;
the card's own after picture was used instead.
