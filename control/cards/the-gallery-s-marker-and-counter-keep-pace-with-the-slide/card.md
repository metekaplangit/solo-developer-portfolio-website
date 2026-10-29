# The gallery's marker and counter keep pace with the slide

bump: patch
screen: @magic-notes
screen: @sole-focus
screen: @waypost-words
screen: @waypost-rail
unproven: Safari was not driven; only Chrome (headless, shell mode). Browsers without scroll timelines keep the old stretching dot, which was not driven either

Closes issue 0014.

In the Mac screenshot gallery the white marker under the dots now rides the track's own scroll: one `.dot-marker` element, animated by a named scroll timeline (`timeline-scope` on the gallery, `scroll-timeline` on the track), sits wherever the slides are — between two dots mid-move, on a dot once the snap settles — whether the move came from an arrow, a dot, a key, a swipe or a trackpad. It is a single animation over the whole scroll range, not one per dot over part of it, which is the case WebKit 284526 breaks at the last slide. Browsers without scroll timelines keep today's stretching dot. The counter and the dots' `aria-current` now follow the slide nearest the middle, so they change as a move passes halfway, not once a slide is 60% in; the IntersectionObserver is replaced by one scroll listener batched to a frame.

The row of dots never wraps any more. Each dot's slot is its full hit area (28 px, 44 px on touch) unless the row would not fit, and then every slot narrows equally (container query units) — Magic Notes' 6 dots used to wrap to 2 rows on a 320 px phone and now sit in one row at 43 × 44 px, which a marker needs to have a straight path.

Issue 0014: inactive dots are now half the text colour, 4.7:1 on the stage (they were 30%, 2.4:1), with hover going to the full text colour. The screen suite gained a rule that holds every text-less button's painted mark to 3:1 against what it sits on, composited the way the browser paints it; it was seen red on the old dots (2.43:1 at every width on both galleries) and passes now.

Building it turned up one trap: the build's minifier folds `animation-timeline` into the `animation` shorthand, which no browser accepts, so the marker's whole animation was silently dropped and it never moved. The marker uses longhands, as the site's scroll reveal already does, with a comment saying why.

Measured with the workshop probe, sampling every frame after the gallery's own frame step: an arrow, a key press and a jump from dot 1 to dot 6 each keep the marker within 0.01 px of where the scroll says it should be in every frame, at 1440, 390 and 320 (touch); the counter equals the nearest slide in every frame and matches the current dot; a swipe let go at 45% settles back with the marker on dot 1. With reduced motion the scroll, marker and number jump in one frame.
