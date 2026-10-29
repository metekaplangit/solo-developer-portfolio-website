# Check plan 0009 landed, and fix what did not

bump: patch

The loop card of plan 0009. Three questions against the built site, nothing
else: does what was planned work as intended, is any of it broken, does the
project still stand up. All three hold; nothing needed fixing.

Read in the built site at 1440 and 390, cropped from a real Chrome: Home's
opening has the title left and the lede and both buttons right, standing on
"Serious craft."; its three statements sit under hairlines with the number in
the product's hue and 17px sentences; Apps opens on the same two sides; the 404
has the poster title and five ruled destinations, none alone on a line at 390;
Sole Focus opens on its claim, then "A note from the maker" titled like every
section under it, with Magic Notes on its claim and Waypost Words unchanged.

The seams: A and B share `src/pages/index.astro` and both render, the hero
entrance still animates only under `prefers-reduced-motion: no-preference`;
`.opening` is used by Home, Apps and the 404 only, so About's own grid is
untouched; the first line of text on every route agrees within 1px except
`/privacy/`, which is issue 0010 and listed as such. The proofs were real:
cards A and C each added a test seen red on the unfixed code first, and every
card closed through `finish` with its screens run.

Run here: `npm run headless` (exit 0) and the screen tests @home, @apps,
@not-found, @sole-focus, @magic-notes, @waypost-words, @about and @every-route
(9 passed, exit 0).
