# Whatever the studio published last comes first, on every page

bump: minor
screen: @home
screen: @apps
screen: @support
screen: @privacy-index

Standing rule from the owner: whatever the studio published last takes first place everywhere on the site, and the rest move down by release date. Today that is Waypost Words (2026-10-26), then Magic Notes (2026-08-16), then Sole Focus (2026-07-15).

- **One order.** `sortProducts()` now puts released products first and, within a status, the newest `releaseDate` first (undated after dated, then by name). Apps & Games, Support and the product pages' related tiles already went through it; the privacy page's list, which sorted by policy title, now does too.
- **The home page features the newest release.** `newestRelease()` replaces the hand-set `featured` flag, which is gone from the schema and the 3 product files along with the comments that explained it. Publishing a product — `status: released` and its `releaseDate` — is the whole step.
- **Home with a phone product.** Waypost Words is the first phone product on the home page, and its portrait screenshots stood two to a row in a grid cut for Mac shots, each taller than the screen (the page was 7,479 px at 1440). Portrait shots now sit four to a row on a wide screen and two on a phone, rounded down to full rows, with image sizes to match: 3,377 px at 1440.
- **Captions.** File names cannot carry apostrophes, so 2 of those shots were captioned "A traveller s keepsakes" and "A surveyor s tools". A lone "s" between words is now the possessive it stood for.
- **Written down.** CLAUDE.md has a "Publishing a product" section with the rule and the one edit it takes; PRODUCT.md no longer says the featured product is chosen by hand.

Proof: a new built-output test reads the release dates from the product files and checks that the home page features the newest and that Apps & Games, Support and Privacy list every release newest first. It failed on all 4 pages before the change and passes now. Unit tests cover the new order (dates, undated, same-day ties, status) and `newestRelease`, and a caption test failed on the 2 broken captions before the fix. One existing check, which expected "Mac App Store" on the home page, held only while a Mac app was featured; it now accepts either store name. The home page was looked at whole at 1440 and 390 with Waypost Words featured.
