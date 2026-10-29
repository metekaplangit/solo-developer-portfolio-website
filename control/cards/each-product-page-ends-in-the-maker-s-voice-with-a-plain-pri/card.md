# Each product page ends in the maker's voice, with a plain privacy line

bump: patch
screen: @sole-focus
screen: @magic-notes
screen: @waypost-words

Card D of plan 0010, pick 4 of text-project 0003. The 3 product stories ended
on a closing line in the third person about a support address, and the Sole
Focus and Magic Notes privacy paragraphs read like a policy summary. The
privacy paragraph on both now reads "The privacy policy says what <name> stores
and why. It is dated, and it changes in the same release as the app.", and
each story's closing italic line is first person, ending "write to me. I read
every message." Waypost Words keeps its privacy wording and its listing words;
only its closing line changed.

Read from the built site after clearing `.astro` and `node_modules/.astro`
(issue 0008): the old "support address answers" line appears on none of the 3
pages, and the new closing line is the last italic paragraph on each. Measured
with the text-project measuring script at 1920, 1536 and 414: the privacy lines
take 2 lines on desktop and 3 at 414, the closing lines 1 on desktop and 2 at
414, with 0 bad breaks in any of them. `npm run headless` passed (exit 0, 130
and 38 tests); the 3 pages were photographed before and after.
