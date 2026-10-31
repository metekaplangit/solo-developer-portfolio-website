// The arithmetic behind both screenshot galleries (ScreenshotShowcase): the Mac
// gallery, which moves one picture at a time, and the phone rail, which pages by
// as many shots as are in view. Pure, so it is unit-tested here rather than only
// by driving a browser.
//
// Both used to carry their own copy of this inside the component's script, and
// every fix to how a press, a resize or a quick run of taps lands (hunt-project,
// chaos-project and smooth-project 0001) had to be made twice.

/** How close the track must be to where it was sent to count as arrived, in px. */
export const ARRIVED_PX = 1;

export function clamp(value: number, lowest: number, highest: number): number {
  return Math.max(lowest, Math.min(highest, value));
}

/** Whether a track at `scrollLeft` has reached the offset it was sent to. */
export function arrived(scrollLeft: number, goal: number): boolean {
  return Math.abs(scrollLeft - goal) <= ARRIVED_PX;
}

/**
 * The picture a one-at-a-time gallery is showing: the one nearest the middle,
 * so the counter changes at the halfway point of any move.
 */
export function nearestPicture(scrollLeft: number, width: number, count: number): number {
  if (count < 1 || width <= 0) return 0;
  return clamp(Math.round(scrollLeft / width), 0, count - 1);
}

/** The first shot in view on the phone rail, `step` being one shot plus its gap. */
export function firstInView(scrollLeft: number, step: number): number {
  return step > 0 ? Math.round(scrollLeft / step) : 0;
}

/**
 * Whole shots in view on the phone rail. The last shot needs no gap after it,
 * so the track holds one gap more than its width would suggest.
 */
export function shotsInView(trackWidth: number, step: number, shotWidth: number): number {
  if (step <= 0) return 1;
  return Math.max(1, Math.round((trackWidth + (step - shotWidth)) / step));
}

/**
 * Where a press of Previous (-1) or Next (+1) sends the phone rail: a whole view
 * on from `first`, never past the last full view nor before the start.
 */
export function pageTarget(first: number, direction: number, perView: number, count: number): number {
  return clamp(first + direction * perView, 0, Math.max(0, count - perView));
}

/** The scroll offset that puts shot `first` at the rail's left edge. */
export function railOffset(first: number, step: number, maxScroll: number): number {
  return Math.min(first * step, maxScroll);
}

/**
 * Where keyboard focus goes when the gallery's arrows switch on and off (issue
 * 0025). A disabled button cannot hold focus, so an arrow switched off while
 * focused dropped it to the page body, and the arrow keys — heard only inside
 * the gallery — stopped working. Focus passes to the first arrow still on.
 * `null` when focus is not on an arrow going off, or no arrow is left on.
 */
export function focusHandOff<T>(focused: unknown, arrows: ReadonlyArray<{ el: T; off: boolean }>): T | null {
  if (!arrows.some((a) => a.el === focused && a.off)) return null;
  return arrows.find((a) => !a.off)?.el ?? null;
}
