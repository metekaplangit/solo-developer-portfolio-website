# Every policy's At a glance chips are read as a list

bump: patch
screen: @privacy-sole-focus
screen: @privacy-waypost-words
screen: @privacy-index
screen: @every-route

Closes issue 0012, found by plan 0007's loop card in the component plan 0007's
card A rewrote. Safari drops list semantics from a `ul` drawn without markers,
so iPhone VoiceOver reads its items as loose text (WebKit 304137, a duplicate
of the still-open 122320). The policy's "At a glance" chips were such a list.

The screen probe now records every visible `ul` or `ol` with no markers and no
`role="list"`, and each route's test fails on one. Run against the unfixed
build it went red on all 11 routes at every width and the phone pass, and
named 4 lists, not 1: the chips (`ul.glance`, 3 policy routes), the header
navigation (`ul.nav-list`) and footer links (`ul.footer-links`) on every page,
and the 404's links (`ul.links`). It is one rule, so all 4 now carry
`role="list"`; nothing they look like changed. After the fix, every route's
screen test passes, 12 in all, and the fast checks pass complete.
