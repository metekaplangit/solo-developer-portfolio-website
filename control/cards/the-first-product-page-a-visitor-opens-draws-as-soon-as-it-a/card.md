# The first product page a visitor opens draws as soon as it arrives

bump: patch

Plan 0012, card A, from smooth-project 0001. Product pages carried a 15 KB
stylesheet of their own (`_slug_.*.css`) that home and Apps never loaded, so
the first product page a visitor opened waited one more round trip before it
could draw. Measured live: home → product first frame at 379 ms in Chrome on a
Mac, 386 ms in Safari's engine and 573–610 ms on a throttled phone, against
1–15 ms after the HTML response for every other page change.

`astro.config.mjs` now sets Vite's `build.cssCodeSplit: false`, and Astro 7.4.2
honours it: every page links the one `style.*.css` (55 KB, 9.5 KB compressed),
fetched with the first page and read from the cache by every later one. The
CSP meta still validates; the fast checks and the dist suite are green.

The new dist test, "links the same stylesheets on every page", was red on the
unfixed build (`/404` linked BaseLayout alone, home linked BaseLayout + index)
and is green now. Before and after pictures: the openings differ between any 2
captures of the same build (the entrance caught mid-flight), so they were
compared below 600 px. Only home differed there, in the Waypost Words phone
block; every element in that block has identical computed styles and animation
state in the old live build and the new one, motion on and off, so the
difference is in the screenshot pixels, not in a rule. The live re-measure comes
in smooth-project 0001's closing block, after the deploy.
