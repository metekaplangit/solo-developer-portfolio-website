import { describe, it, expect } from 'vitest';
import { evenColumns } from './grid';

describe('evenColumns', () => {
  it('fills every row for the case that was reported', () => {
    // 7 features in a 4-wide grid is 4 + 3 — the hole the owner boxed in red.
    // 8 in the same grid is 4 + 4.
    expect(evenColumns(7, 4)).toBe(1);
    expect(evenColumns(8, 4)).toBe(4);
    expect(evenColumns(8, 2)).toBe(2);
  });

  it('never returns more columns than fit', () => {
    expect(evenColumns(12, 2)).toBe(2);
    expect(evenColumns(12, 3)).toBe(3);
    expect(evenColumns(12, 4)).toBe(4);
  });

  it('never returns more columns than items', () => {
    // Three items in a four-wide grid is a short row too.
    expect(evenColumns(3, 4)).toBe(3);
    expect(evenColumns(2, 4)).toBe(2);
    expect(evenColumns(1, 4)).toBe(1);
  });

  it('falls back to one column for a prime count', () => {
    expect(evenColumns(5, 4)).toBe(1);
    expect(evenColumns(11, 4)).toBe(1);
  });

  it('picks the largest divisor, not the first that works', () => {
    expect(evenColumns(6, 4)).toBe(3);
    expect(evenColumns(9, 4)).toBe(3);
  });

  it('survives nonsense input rather than emitting invalid CSS', () => {
    // The return value is interpolated into `repeat(N, …)`; a 0 or a NaN there
    // silently breaks the whole grid.
    expect(evenColumns(0, 4)).toBe(1);
    expect(evenColumns(-3, 4)).toBe(1);
    expect(evenColumns(8, 0)).toBe(1);
    expect(evenColumns(Number.NaN, 4)).toBe(1);
  });

  it('always returns a whole number of columns', () => {
    for (let n = 1; n <= 24; n++) {
      for (const max of [2, 3, 4]) {
        const c = evenColumns(n, max);
        expect(Number.isInteger(c)).toBe(true);
        expect(c).toBeGreaterThanOrEqual(1);
        expect(c).toBeLessThanOrEqual(max);
        // The property the whole rule exists for.
        expect(n % c).toBe(0);
      }
    }
  });
});
