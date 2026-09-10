# A product page says what a product is, never what its business model will never become

bump: minor
screen: @home
screen: @about
screen: @apps
screen: @sole-focus
screen: @magic-notes

The site promised, in 18 places, that these products carry no advertising, no
in-app purchases, no subscription, no tracking and no networking. Every one of
those was true the day it was written, and the owner's instruction on 2026-09-10
was to stop saying any of it: first releases are generally free of most things,
but advertising, in-app purchases and features that need the network are all
decisions that stay open, and a website that has promised otherwise is a website
that has to be walked back.

So none of them was softened. "Currently free of ads" is still an objective claim
about the product, it still has to be maintained, and it reads as a warning that
ads are coming. What came off is the whole category, and what stayed is the set of
facts that survive any business model: the price the store listing shows today,
the platform, the system requirement, and that a real person answers support. The
FTC's own guidance on advertising is the reason the category is the unit rather
than each sentence — an objective claim must be truthful and substantiated, and
making one and then reversing it after acquiring users is the shape consumer
protection law treats as deceptive.

`privacyFacts` is gone from the schema rather than emptied. It existed to carry
one sentence — "Works offline — no account, no cloud, no tracking" — onto every
facts row and every product band, and a field with that name left in place is an
invitation to refill it. Its slot in the schema now holds the reason it is not
there. `FactsLine` lost the same sentence and the "no in-app purchases, no
subscription" half of its price fact, so a free product's facts line reads "Free ·
macOS 10.15 or later" instead of three facts, which is the one change a visitor
will actually notice. The home page's deal band traded two promises for two
checkable things, the about page's "Offline and fast" and "No dark patterns"
values were rewritten to the thing underneath them that does not change, and
`site.ts`, `PRODUCT.md` and both products' prose, summaries, features, maker note,
fit statements and SEO descriptions lost theirs.

**The privacy pages are deliberately untouched**, on the owner's decision. Apple
requires a privacy policy that describes what an app does today, and App Store
Connect disclosures must be kept accurate whenever practices change. Those
documents are dated statements of current fact with a shelf life, not promises,
and stripping them would have left the products with no privacy policy at all.
Both product pages now point at theirs where they used to make the claim
themselves.

What keeps it from coming back is `tests/no-business-model-claims.test.ts`, and it
reads `dist/` rather than the source on purpose: a source scan trips over its own
explanatory comments, and it cannot see a claim assembled at build time out of two
innocent fields. Eighteen forbidden phrases across five categories, every built
page except `privacy/`, which is exempt by name and must stay that way. Seen red
first against the pre-change build — 5 of 10 pages failed, naming the claim and
quoting the 90 characters around it — then green against this one.

`scripts/capture.mjs` had to be repaired before this card could be photographed at
all, and that is the only reason it was touched. Driven across all nine routes in
one browser it dies part way through: `Page.captureScreenshot` returns "Session
closed" and the next `newPage` fails with "Failed to open a new tab", so the
process itself has gone. Measured rather than guessed — a probe written into
`scripts/probe/height-probe.mjs` reports `/apps/magic-notes/` at 390 as the tallest
page at 7059px and photographs it fine on its own, while `/apps/sole-focus/` at
5833px died as the seventh picture of a run. It is the accumulation, not any one
page: eighteen full-page captures of pages carrying 2880×1800 screenshots is more
than Chrome survives in one process here. A browser's life is now two pictures,
and a picture that still fails is retried once in a fresh browser. 18 of 18, exit
0, with two retries reported.

unproven: a real phone — the coarse-pointer pass is an emulated one
