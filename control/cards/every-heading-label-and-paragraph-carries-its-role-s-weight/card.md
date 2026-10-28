# Every heading, label and paragraph carries its role's weight, leading and spacing

bump: patch
screen: @every-route
unproven: Safari on a real Mac — rendered in headless Chrome only

Card A of plan 0006, pick 3 of style-project 0001. Weight, line height and
letter-spacing used to be typed by hand in each component: 4 weights, 13 line
heights and 14 letter-spacings across 10 sizes. They now come from tokens in
`global.css` — `--weight-text/strong/display` (400/600/700),
`--leading-display/heading/ui/body` (0.96/1.12/1.35/1.6, buttons 1.2), and
`--track-optical`, a clamp that is 0 at body size and tightens to -0.04em from
40px, plus `--track-caps` 0.08em for uppercase labels. No font size moved.

Ported from the report's `type.patch` onto `0b1e248` unchanged. Measured on the
built site with the style run's script: weights 3 (400/600/700), line heights 6
(0.96, 1, 1.12, 1.2, 1.35, 1.6), letter-spacings 7, lowest text contrast 5.71:1
as before. The home hero holds its two-line poster lock at 0.96. The home page
is 8px shorter at 1440 and 7px taller at 390. `DESIGN.md` now gives the new
values and records them as the Type Role Rule.
