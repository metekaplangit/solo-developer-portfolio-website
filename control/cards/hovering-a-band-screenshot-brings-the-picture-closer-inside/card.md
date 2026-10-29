# Hovering a band screenshot brings the picture closer inside a frame that stays still

bump: patch
screen: @home
screen: @apps
unproven: Safari was not driven; `isolation: isolate` is there for its clipping of a scaled child, unmeasured. Touch has no hover, so phones see only the keyboard-focus case, which was not driven on a touch device

Pointing at a product band's screenshot — the Mac picture or the pair of phones — or tabbing to it no longer lifts the whole frame 3 px. The frame stays exactly where it is, its hairline brightens (white at 9% to the strong border's 18%), and the picture inside eases forward to 1.025: 600 ms on `--ease-out` going in, `--dur-slow` (420 ms) coming back. 600 ms is slower than the site's other answers on purpose: it reads as a camera easing forward rather than a control reacting. Each phone leans inside its own frame. With reduced motion only the hairline changes.

Measured with the workshop probe (`probe.mjs`, headless Chrome, shell mode, built Apps page at 1440): on hover the Mac picture is within 0.0015 of 1.025 by 261 ms and back within 0.0015 of 1 by 183 ms of leaving (the ease-out curve front-loads both); the phones the same, 266 / 182 ms; the frame's box is identical in every sample before, during and after. Keyboard focus leans and brightens the same way (the frame's box changed there only because focusing scrolled the page). Reduced motion: scale stays 1, hairline brightens. `corners.mjs` photographed the top-left and bottom-right corners at rest and fully leaning: just outside the curve is the band's background in both states, just inside is the picture, so the scaled picture never paints past the rounded edge in Chrome.
