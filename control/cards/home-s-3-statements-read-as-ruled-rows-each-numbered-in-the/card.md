# Home's 3 statements read as ruled rows, each numbered in the product's colour

bump: patch
screen: @home

Card B of plan 0009, from pick 3 of retouch-project 0003. The three statements
under the featured product read as captions: a small faint number on a line of
its own, then a title, then a 15px muted sentence, with far more air above the
band than below it.

Each statement is now a row the way the site sets anything it lists: a strong
hairline over it, its number hanging left of the title in the product's own
hue at 24px with tabular figures, the title in `--text-strong`, the sentence at
body size, 17px. The three columns still come from the same auto-fit grid. The
band no longer pads its own top, so it sits as the product's caption. The
number is `aria-hidden`; it is order, not content, and the three are already a
heading each.

Measured on this build, last ink above to the first rule and the last line to
the mosaic's first picture: 96 and 100px at 1440, 64 and 72px at 390. The first
reading said 119px below; that was the mosaic's scroll reveal still offset in a
browser that had not scrolled to it, so the measure settles `.reveal` first.
