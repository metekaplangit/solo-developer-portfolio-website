# Product

## Register

brand

## Platform

web

## Users

People who follow small studios and pick their apps and games one at a time —
on a Mac, an iPhone or an iPad today, whichever a product runs on. They judge
craft closely and have strong feelings about privacy, accounts, and
subscriptions. They arrive from a store listing, a link or a search, and they
are deciding two things at once: is this product any good, and is the studio
behind it trustworthy. They can tell the difference between care and template,
and they are quick to dismiss anything that smells like marketing.

The studio is cross-platform, so its own pages speak to every one of them the
same way; only a product's page names that product's platform (owner,
2026-11-02).

## Product Purpose

The public home of MetKap Studio: it presents the studio's shipped software —
one file per product in `src/content/products/`; today Magic Notes, a Mac
notebook that answers arithmetic written in plain sentences, Sole Focus, a free
Pomodoro and count-up focus timer, and Waypost Words, a crossword word game for
iPhone and iPad — together with per-product privacy information and a direct
support route.

Success is **credibility**. A visitor should leave believing a careful,
honest studio is behind this, whether or not they install anything today. Downloads
matter, but trust is the goal the site is optimized for.

## Positioning

A small studio shipping quietly excellent software. It speaks as we, us, our and
MetKap Studio, never as I or by a person's name, and it never gives a headcount
or says "our team" (owner, 2026-11-02).

Owner-directed (2026-07-18): the positioning is deliberately **platform
neutral**. The first shipped product is Mac-only, but the studio is not, and
the site must not imply otherwise. Per-product pages still state their own
platform requirements (e.g. "macOS 10.15 or later").

## Conversion & proof

- **Primary CTA:** Download the featured product from its store. The featured
  product is always whatever the studio released last (owner, 2026-10-29) —
  Waypost Words since then, Magic Notes and Sole Focus before it. Nothing is
  flagged by hand; see "Publishing a product" in CLAUDE.md.
- **Secondary fallback:** not yet decided — open question for the owner
  (candidates: open the product page, or read the privacy/support pages).
- **The line a visitor should remember after ten seconds:** the motto, *Small
  studio. Serious craft.* (owner, 2026-11-02). It read "free, no
  account, no tracking, no subscription" until 2026-09-10, when every claim of
  that kind came off the site: they are promises about what the studio will never
  do, and the studio keeps the option to add advertising, in-app purchases,
  subscriptions and network features to any future release.
- **Belief ladder** (derived, pending owner confirmation) — before the download a
  visitor must believe, in order: this is a real studio and not an abandoned
  hobby page → the app does one thing genuinely well → what it costs and what it
  does with my data are stated plainly and kept current → if it breaks, a real
  person answers.
- **Proof on hand: none.** Sole Focus launched 2026-07-15 and there are no
  ratings, reviews, press, or partner logos yet. Trust must therefore be carried
  by craft, transparency, and verifiable specifics. Inventing reviews, ratings,
  testimonials, or logos is forbidden; when proof is absent, say nothing rather
  than imply.

## Brand Personality

Quiet, exacting, honest.

The voice is plain and unhurried: "you" for what the reader gets, "we" for our
side. Lines about the studio name no platforms. Buttons are 1 or 2 words, each
starting with a capital. No hype, no urgency, no exclamation marks, no growth-marketing
cadence. Claims are literal and checkable — a price, a system requirement, a
thing the app does not collect — because this audience verifies. Confidence shows
through precision, not volume.

## Anti-references

**A generic SaaS landing page.** Gradient hero, one giant metric, endless
identical feature cards, a "trusted by" logo wall, and stacked calls to action.
This is the explicit thing to design against.

## Design Principles

1. **Practice what you preach.** The site should behave like the software it
   sells: calm, fast, quiet, nothing that shouts. A page that violates the
   product's own values undermines the claim.
2. **Earn trust with evidence, not adjectives.** Prefer verifiable specifics
   (free today, macOS 10.15+, a dated privacy page) over marketing language. The
   audience checks. A specific must be a fact with a date on it, never a promise
   about what the studio will never do — "zero network requests" stood here as an
   example until 2026-09-10, and it is exactly the shape that is now banned.
3. **Craft is the argument.** For visitors who judge execution closely, the
   quality of the interface *is* the credibility case for the studio.
4. **Never fabricate proof.** No invented reviews, ratings, testimonials, or
   logos — ever. Absence is stated honestly and carried by other means.
5. **One clear path, quietly offered.** The download should always be findable
   without the page raising its voice to sell it.

## Accessibility & Inclusion

Accessibility is enforced mechanically rather than aspirationally: the deploy
pipeline runs a Lighthouse accessibility gate at **≥0.95** before it publishes,
so an accessibility regression blocks the deploy. Reduced-motion alternatives
are honored site-wide, focus states are visible, a skip link is present, and the
content schema makes alt text mandatory for every image.

No formal WCAG conformance level has been declared by the owner; the enforced
gate above is the current standard in practice.
