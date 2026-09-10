# Check the claims plan landed, and fix what did not

bump: patch

The loop card for the plan in `docs/plans/0001-2026-09-10.md`. Its scope is
exactly what that plan's one card touched, its bar is good enough rather than
perfect, and it asks three questions: did the work happen, is anything broken,
does the project still stand up.

**It found one thing, and it was the kind that outlives the card that missed it.**
`PRODUCT.md` had three claims, not one. v0.51.0 fixed the ten-second line and the
belief ladder, and left both Design Principles alone: principle 1 told whoever
reads it that the site should behave like software that is "calm, fast, nothing
tracked", and principle 2 held up "(free, macOS 10.15+, zero network requests)" as
the model of a verifiable specific to prefer over marketing language. That second
one is worse than a stale sentence on a page — it is an instruction to a future
session to write the exact claim the whole plan removed, sitting in the document
that session reads before it writes any copy. Both are now what they were reaching
for: "calm, fast, quiet, nothing that shouts", and "free today, macOS 10.15+, a
dated privacy page", with one line saying what stood there and why it cannot again.

Everything else held. All eighteen claim sites are gone from the two product
content files, both pages, `site.ts` and the components; `privacyFacts` survives
nowhere but as the guard comment occupying its old slot in the schema; and the
three privacy pages are untouched — `git diff v0.50.2..v0.51.0` over
`src/content/policies/` and `PolicyArticle.astro` is empty, which is what the
owner decided and what Apple requires.

**The proof was real, and this card made it prove itself twice.** v0.51.0's guard
was seen red against the pre-change build, 5 of 10 pages. That is evidence the
mechanism works, not evidence the exemption is right, so this card planted "No
ads, ever." in the about page's own values and rebuilt: exit 1, one page named,
the phrase quoted with its surroundings, `advertising` named as the category.
Removed and rebuilt: exit 0. The guard checks 7 pages and skips 3, which is every
built page except `privacy/` — the exemption is exactly as wide as it was written
to be, and no wider.

The seam the plan could not check is the deployed site, and this card looked. At
the time v0.51.0 was pushed, metkapstudio.com still served every old claim, with a
`last-modified` of 2026-08-21 — the Pages workflow was mid-run, not missing. Named
here rather than assumed, and confirmed served before this card closed.

Nothing else was touched. The two screens v0.51.0 did not run — `@support` and
`@every-route` — were left to the ledger, which is what the ledger is for, and
neither covers anything this plan changed.
