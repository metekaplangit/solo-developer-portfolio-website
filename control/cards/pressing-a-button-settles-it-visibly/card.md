# Pressing a button settles it visibly

bump: patch
screen: @button-press
screen: @home

Plan 0017, card D, from resolve-issues 0001. Closes issue 0016.

Every filled or outlined button kept its 1px hover lift while it was pressed,
so the press settle never showed. `.btn:active` and the three hover rules
(`.btn-primary:hover`, `.btn-hue:hover`, `.btn-secondary:hover`) carry the
same weight, and the hover rules came later in `global.css`, so they won. A
mouse is always hovering when it presses. MDN's :active page says it plainly:
":active … will be overridden by any subsequent … :hover … that has at least
equal specificity" (read 2026-10-30).

The press rule now sits after every hover rule, with a comment saying why it
must stay there. Nothing else changed: the same 97% scale, the same 90 ms,
the same lift and glow on hover. Reduced motion still makes the settle
instant rather than animated.

Proof: a new screen test, "every kind of button settles when pressed
@button-press", forces each kind of button hovered, then hovered and pressed,
through Chrome's own debugging protocol on home, Apps & Games and Sole Focus.
It runs every transition to its end and reads the transform, so no pointer or
clock decides the result. On the unfixed CSS it failed for every kind of button
on every page (pressed `matrix(1, 0, 0, 1, 0, -1)`, still lifted). Now each
reads `matrix(0.97, 0, 0, 0.97, 0, 0)` pressed and the 1px lift hovered. The
home button, hovered and pressed, is pictured in `docs/issues/assets/0016/`.
The after pictures of the home page at rest look the same as before, as they
should: the change shows only under a pressed mouse.
