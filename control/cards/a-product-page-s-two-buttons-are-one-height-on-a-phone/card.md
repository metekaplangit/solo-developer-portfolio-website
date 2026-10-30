# A product page's two buttons are one height on a phone

bump: patch
screen: @sole-focus
screen: @magic-notes
screen: @waypost-words

Plan 0015, card A, from inspect-project 0001 finding 1.

Under a product's name the store button is `.btn-lg` (52 px) and "Privacy
policy" a plain `.btn` (44 px). On one line flex stretch made both 52; once the
row wrapped on a phone nothing stretched the privacy link, so it stood at 44
under a 52 px button: Sole Focus and Magic Notes at 320 and 393, Waypost Words
at 320. The flexbox spec sizes each wrapped line from its own items (CSS
Flexbox 1, Editor's Draft 8 May 2026), so stretch can never even out a wrapped
row.

Now `.action-row .btn` takes the store button's existing 3.25rem height
(`src/pages/apps/[slug].astro`), so the set is one height on one line or two.
The privacy link keeps its own type size and padding; no new value.

Proof, on the built site:

- New screen rule: every `.btn` sharing one parent renders one height, on every
  route at every width. Seen red on the unfixed code on all 3 product pages
  ("@320 button heights in one set — div.action-row: "Mac App Store" 52 /
  "Privacy policy" 44", the same at 390 and the phone pass), green now.
- inspect-probe re-measure of the 3 product pages, 45 views (5 sizes × 100%,
  200% zoom, increased contrast): both buttons 52 px at every size at 100%;
  nothing worse than the first sweep on any reader.
- Left as it was: at 200% zoom on a phone (160 and 197 px wide) the store
  label wraps onto 2 lines and stands taller than the privacy link, the same as
  before this card — issue 0022's narrow-window family.
