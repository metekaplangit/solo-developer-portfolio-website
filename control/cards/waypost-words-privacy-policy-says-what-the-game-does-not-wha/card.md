# Waypost Words' privacy policy says what the game does, not what it lacks

bump: patch
screen: @privacy-waypost-words
screen: @privacy-sole-focus
screen: @privacy-index
unproven: Safari on a real iPhone — checked in headless Chrome at 1440 and 390

The studio never states what a product lacks, because a later release may add
it (STUDIO.md, 10 September 2026). The Waypost Words policy did, five ways: a
"What we never collect" card, a "No account needed" chip, a lead listing "no
account, no analytics, no advertising and no purchases" and play "without
connecting to the internet", and a retention line saying data "is never sent".

Now the lead and retention say what the game does: everything it keeps stays
on the iPhone or iPad and in the device's backup, and deleting the game removes
it. The crash note is described as the game's own "last problem report", which
the player can clear or copy into an email; read in the game's
src/ui/screens/Simple.tsx and src/core/storage/crashlog.ts on 2026-09-29.

Two absence answers stay, because Apple asks every policy for them (App Review
Guidelines 5.1.1(i), read 2026-09-29: what data, if any, is collected, and who
it is shared with): "No data collected" and "No third-party sharing".

`PolicyArticle` names an account only when there is one, so the "No account
needed" chip is gone from every policy page, Sole Focus and the site-wide one
included. Their own "What we never collect" lists are unchanged; that is their
content, not this card's.

A content test pins the empty list and the retention wording, and a built-output
test pins the page's chips and absence phrases. The content test was seen red
against the old policy; the built-output test's two forbidden phrases were on
the live page (metkapstudio.com) before this change.
