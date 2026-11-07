# Visitors can follow the studio on Facebook, Instagram and X from every page

bump: minor
screen: @home
screen: @about
unproven: the footer on the other routes was not photographed; it passed the built-HTML test and the @every-route layout check, and is the same component
unproven: a Windows high-contrast theme with a light background was not tried; the marks follow the text colour there

Every page's footer now ends with the studio's 3 accounts, after the
"© 2026 MetKap Studio." line, and the About page's contact panel offers them
under "Follow us". Each is a 44px link around a 24px mark that opens the
account in a new tab, named "MetKap Studio on Facebook" (and so on) for screen
readers, with `rel="me"`.

The marks are the platforms' own official files, unchanged, in
`src/assets/brand/`: Instagram's white glyph and X's logo from the brand packs
the owner downloaded, and Facebook's white secondary logo read out of its
official Illustrator file by `ai-to-svg.py` here. That drawing matched the
official 2084px PNG with 0 differing pixels away from the edges (only edge
smoothing differs). They are drawn inline as vectors, so they stay sharp at any
zoom; a 3x render was checked by eye. White is the one colour all 3 brands
allow, and it keeps the chrome achromatic. DESIGN.md gains the Official Marks
Rule.

The new built-output tests (every route's footer, the About panel, no platform
name as visible text) were seen red on the old build first.
