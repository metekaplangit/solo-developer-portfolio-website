# The privacy page lists each policy as the same icon tile

bump: minor
screen: @privacy-index

Card B of plan 0003, from pick 2 of retouch-project 0001. The per-product
policies at the foot of `/privacy/` were three text cards, 416×96 each, carrying
a product name and nothing that showed which product it was.

Each policy is now the `ProductTile` card A made: the product's icon, its name,
and the line "Privacy policy · updated <date>", linking to `/privacy/<id>/`.
The words "privacy policy" also follow the name in a visually-hidden hint, so the
link's own text says where it goes. The date's spaces are non-breaking, because
"3 August / 2026" split across lines at 390 in the retouch run; at 390 it now
wraps whole onto its own line.

The page now reads the product collection to find each policy's product. A
policy whose product is missing is skipped rather than rendered without an icon.
The old `.policy-*` styles and the unused `withBase` import are gone.

The tiles stay lazy here. They sit below the whole website policy, far outside
the first screen, and the screen test agrees: no lazy image on screen.

Proved by: Headless Suite Testing, complete and green; Scoped Suite Testing on
@privacy-index, 14 of 14; after pictures at 1440 and 390.

unproven: a real phone — the coarse-pointer pass is an emulated one
