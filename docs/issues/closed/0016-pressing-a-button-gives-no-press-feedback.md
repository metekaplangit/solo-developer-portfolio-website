# 0016 Pressing a button gives no press feedback

- Severity: medium
- Reach: player
- Area: buttons
- Found by: motion-project 0001
- Filed: 2026-10-29
- Tried by: —
- Closed by: v0.66.16, card pressing-a-button-settles-it-visibly

Doubt: a missing press answer is only seen, which reads as `low`, but it is a
designed response that should show and does not; rounded up to `medium`.

## What happens
Every filled or outlined button — `.btn-primary`, `.btn-hue`, `.btn-secondary`,
which is every button on the site — keeps its hover lift (`translateY(-1px)`)
while it is pressed. The press settle `.btn:active { transform: translateY(0)
scale(0.97) }` in `src/styles/global.css` never shows. Both rules have the same
specificity (2 classes / pseudo-classes), and the `:hover` rules come after
`:active` in the file, so with a mouse — which is always hovering when it
presses — the hover rule wins.

## How to see it
Hover any button on the live site, for example the hero button on `/`, and
hold the mouse button down: it stays lifted and full size. The product
avatars and tiles, whose `:active` rule comes after their `:hover`, do settle.

## What should happen
While pressed, the button drops back and scales to 0.97 in 90 ms, then
returns on release, as the comment above the rule says.

## Evidence
- Headless Chrome on https://metkapstudio.com/, 3 runs: hover moved the
  button (settled in 215–232 ms), mouse down and mouse up changed nothing
  across 31 frames each.
- The served stylesheet, read in the browser pane: `.btn:active` is rule 0;
  `.btn-primary:hover`, `.btn-hue:hover`, `.btn-secondary:hover` are rules 1–3,
  each `translateY(-1px)`.
- assets/0016/01-home-button-hovered.png — the home hero button after the fix, held hovered: lifted 1px
- assets/0016/02-home-button-pressed.png — the same button hovered and pressed: settled to 97%
