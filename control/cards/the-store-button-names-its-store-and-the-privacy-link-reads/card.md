# The store button names its store and the privacy link reads Privacy policy everywhere

bump: patch
screen: @home
screen: @apps
screen: @sole-focus
screen: @magic-notes
screen: @waypost-words

Card C of plan 0010, pick 3 of text-project 0003. The same store button read
"Mac App Store" on Home and Apps & Games and "Download" on the product pages,
and the link to a product's privacy policy went by three names: "Privacy" under
each band, "Privacy details" on the product page, "Privacy policy" in its Get
panel. The product page's two download buttons now pass `downloadLabel(product)`
as Home and the bands already did, so every one names its store, and both other
privacy links read "Privacy policy". The nav and footer "Privacy" links are the
site section, not a policy, and stay as they are. Home's "See Magic Notes"
scrolls to the band below rather than opening the page, so it keeps its own word.

Read from the built site: all 11 download buttons across Home, Apps & Games and
the 3 product pages show "Mac App Store" or "App Store", none shows "Download",
and each `aria-label` ("Download Sole Focus on the Mac App Store") still contains
its visible label, as WCAG 2.5.3 asks. "Privacy details" appears nowhere in
`dist/`; the 3 bands on Apps & Games each end in "Privacy policy". Issue 0004
(the standalone Apple mark) is left open. `npm run headless` passed (exit 0); the
5 screens were photographed before and after.
