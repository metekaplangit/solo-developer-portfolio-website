# The Apps and Games page says what is on it and how to reach us

bump: patch
screen: @apps
screen: @magic-notes
screen: @sole-focus
unproven: the page as Cloudflare serves it, until the deploy has landed

The owner agreed this page sentence by sentence on 2026-11-02; the wording is in
docs/work/text/0001-2026-11-02.md. The line under the title and the search
description now say the list runs newest first and that you can email us, with
"one person" gone. The closing line drops "get in touch to hear when that is",
because nothing on the site notifies anyone. Its link to Support went with it. The
Sole Focus summary lost "stays out of your way".

The store button on the Mac apps now reads App Store instead of Mac App Store, by
the owner's 2 word rule, wherever those apps have one. It still opens the Mac App
Store listing, and the store is called App Store on a Mac too. Prose on the product
pages that names the Mac App Store is unchanged until those pages have their turn.

The page joined the agreed list in tests/dist.test.ts. Its rules were seen red on
the old build: the "one person" line and 2 Mac App Store buttons. 2 older tests that
pinned the old button label now pin the new one.
