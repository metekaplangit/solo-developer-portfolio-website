# Check plan 0007 landed, and fix what did not

bump: patch

The loop card for plan 0007, the 5 retouch redesigns from retouch-project 0002.
All 5 cards landed: A (v0.63.2) the policies as one ruled document, B (v0.63.3)
the support page as one picture, closing issue 0006, C (v0.63.4) the about page
as one picture, closing issue 0009, D (v0.63.5) the product story on the label
rail, E (v0.63.6) the opening's facts ledger. Each card measured its own page
on the built site at its close, and the readings held: no policy section is a
card, support gaps 72 / 72, About's first-screen empty region 7.7%, story
headings level with their text, and every ledger states its product's true
price and requirement.

The proofs were real: the widened claims test went red on the old support line
in B, and the new accent-panel test went red on `/about/` in C before either
fix. The seams held where cards met. D and E share the product page file, and
the Magic Notes page measured 4648 px tall at 1440 after both, the same as the
retouch copy that built them together. B and C share the colourless panel, and
no studio page draws an accent panel.

`walk.mjs` in this workshop took the visitor's path — home → Apps & Games →
Magic Notes → its privacy policy → Support → About — at 1440 and 390 with
Increase contrast off and on. It first read a planted 3000 px box and a list
stripped of its role as red. On the real pages nothing scrolls sideways; every
hairline the plan added (ledger rows, story sections, policy rows, the support
and about lists) is 0.09 in the default mode and 0.32 under the setting, and
the panels pick up their stronger fill there. The contrast-on Support page and
Magic Notes opening and story were looked at whole. Every screen the plan named,
plus @every-route and @increased-contrast, passed: 10 tests.

One thing it found was older than the plan: the "At a glance" chips on every
policy are an unstyled `ul` without `role="list"`, so iPhone VoiceOver reads
them as loose text. It was already there at 36d3bf6, outside this plan's work,
so it is filed as issue 0012 and left alone. Nothing needed fixing.
