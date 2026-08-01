// The full-row rule (STEP-0063).
//
// A card grid must never end on a short row — four boxes above, three below,
// and a hole where the fourth should be. `repeat(auto-fit, minmax(…, 1fr))`
// cannot avoid it: auto-fit decides the column count from the available WIDTH
// and has no idea how many items it is about to lay out, so any count that is
// not a multiple of the column count leaves a gap.
//
// The fix is to choose the column count from the item count instead: the
// largest number of columns that fits AND divides the items evenly. Seven
// items in a four-wide grid become 4+3 (a hole); eight items become 4+4.
//
// Pure and unit-tested — no Astro, no DOM.

/**
 * The largest column count not exceeding `max` that divides `count` evenly.
 *
 * Returns 1 for a count with no usable divisor — a prime number of items
 * genuinely cannot form a full rectangle wider than one column, and one column
 * is at least honest. Callers that would rather be wide than full should say so
 * explicitly rather than have this quietly round up; see `.card-grid`, which
 * keeps `auto-fit` for grids where a short last row does not read as a defect.
 */
export function evenColumns(count: number, max: number): number {
  if (!Number.isFinite(count) || !Number.isFinite(max)) return 1;
  if (count <= 0 || max <= 0) return 1;
  const ceiling = Math.min(Math.floor(max), Math.floor(count));
  for (let cols = ceiling; cols > 1; cols--) {
    if (count % cols === 0) return cols;
  }
  return 1;
}
