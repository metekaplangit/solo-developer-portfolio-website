# The gallery arrows become 1 fine chevron in the site's own glass

bump: patch
screen: @sole-focus
screen: @magic-notes
screen: @waypost-words

Plan 0004, card A — piece 1 of art-project 0001. Closes issue 0005.

All 4 arrow glyphs in `ScreenshotShowcase.astro` (the Mac gallery and the phone
rail, previous and next) are now a 20-unit chevron drawn at 20px with a 2px round
line, in place of the 24-unit, 28px one. The button is 48px instead of 56px and
wears the same glass as the counter chip: a fill mixed from `--bg` at 62%, the
strong hairline and the 8px blur. The `--shadow-lg` lift is gone, so the button
carries 3 cues rather than 4, and the hardcoded `rgba(22, 23, 27, 0.78)` — the
graphite ground retired by the Spectrum swap — is gone with it. Hover still fills
in the product hue, the disabled arrow still hides at the ends, and touch
devices keep their 48px arrows.

`tests/dist.test.ts` gained "the retired graphite ground": every built stylesheet
and page must be free of `#16171b` in any spelling the minifier emits. It was run
against the unfixed build first and failed on `_astro/_slug_…css` with
`#16171bc7`, the arrows' fill; it passes now.

Before and after pictures of the 3 product pages differ only in a box around the
next arrow (prev is hidden at the start), and enlarged crops show the chevron
reading clearly over Sole Focus's dark screenshot and Waypost Words' bright
purple one. `npm run headless` passed: 125 unit and 36 built-output tests.
