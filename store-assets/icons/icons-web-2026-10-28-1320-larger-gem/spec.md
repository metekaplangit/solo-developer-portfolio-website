# MetKap Studio gem — spec

The metaphor: a cut gem seen from above — a rounded diamond frame holding one round stone.

| Part | Value (on a 1024 canvas) |
| --- | --- |
| Canvas | 1024 x 1024, full-bleed square; the platform rounds the corners |
| Ground | linear gradient, top-left `#24262c` to bottom-right `#15161a` |
| Frame | rounded square 646 x 646, corner radius 123, rotated 45 degrees about the centre |
| Cutout | rounded square 384 x 384, corner radius 74, same rotation, filled `#15161a` |
| Stone | circle, radius 94, at the centre |
| Accent | linear gradient `#aab4ff` to `#6b79f0`, top-left to bottom-right of each shape's own box (on the rotated frame this reads top to bottom) |
| Frame weight | 131 px each side, measured along the frame's own axis |

Container maths:

- The frame's outer extent is 646 x sqrt(2) - 2 x 123 x (sqrt(2) - 1) = 811.7 px, or 79.3% of the tile on both axes.
- The diamond's corners lie 405.9 px from the centre, which is 39.6% of the tile width. The strictest safe area is the maskable icon's circle at 40%, so the whole mark survives a circle crop, a squircle and a rounded square.
- Optical correction: none needed. The mark is point-symmetric and measured centred to 0.3 px.

Link preview (1200 x 630): the same mark at 0.5 x, 406 px tall, centred, on the same ground. Previews crop to about 1.91:1, so a square preview loses the diamond's top and bottom.

History: this is the mark installed 2026-07 (STEP-0011) at 1.43 x its old size. The old mark filled 55% of its tile.
