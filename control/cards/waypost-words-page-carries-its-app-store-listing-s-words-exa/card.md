# Waypost Words' page carries its App Store listing's words exactly

bump: patch
screen: @waypost-words
unproven: Safari on a real iPhone — checked in headless Chrome at 1440 and 390

The game's listing batch (store-assets/listings/listings-2026-09-28-2007-
skills-first-pack, COPY_PACK.md §4) wrote the website's words, and the page
carried them only in part: the title was re-cased, the bonus-jar bullet was cut
to keep the feature grid even, the headline had been folded into the first
paragraph, and one sentence was the site's own.

Now the page title, headline, summary, meta description, the four sections and
all seven bullets are the listing's, word for word. The seven skills from the
App Store description (§3) are listed under the skills section, with its line
that each use costs coins earned in play, so a reviewer reads the same skill
names here as in the listing. An eighth bullet, "26 skies to buy with your
coins", is also the description's own, and keeps the grid at 4+4; the 26 was
read again in the game's src/core/game/godmode.ts.

The product prose had no list style, so `[slug].astro` gains one matching its
paragraphs. A content test pins the exact title, all seven bullets and all
seven skill lines; it was seen red against the page before this change.
