import { describe, it, expect } from 'vitest';
import {
  ARRIVED_PX,
  arrived,
  clamp,
  firstInView,
  focusHandOff,
  nearestPicture,
  pageTarget,
  railOffset,
  shotsInView,
} from './rail';

describe('clamp', () => {
  it('keeps a value inside its range, and the ends themselves', () => {
    expect(clamp(-3, 0, 5)).toBe(0);
    expect(clamp(0, 0, 5)).toBe(0);
    expect(clamp(3, 0, 5)).toBe(3);
    expect(clamp(5, 0, 5)).toBe(5);
    expect(clamp(9, 0, 5)).toBe(5);
  });
});

describe('arrived', () => {
  it('counts a track within one pixel of its goal as there, either side', () => {
    expect(arrived(400, 400)).toBe(true);
    expect(arrived(400 + ARRIVED_PX, 400)).toBe(true);
    expect(arrived(400 - ARRIVED_PX, 400)).toBe(true);
    expect(arrived(402, 400)).toBe(false);
    expect(arrived(398, 400)).toBe(false);
  });
});

describe('nearestPicture', () => {
  const width = 800;
  const count = 5;

  it('names every picture when the track rests on it', () => {
    for (let i = 0; i < count; i++) expect(nearestPicture(i * width, width, count)).toBe(i);
  });

  it('changes at the halfway point of a move, not before', () => {
    expect(nearestPicture(width * 0.49, width, count)).toBe(0);
    expect(nearestPicture(width * 0.5, width, count)).toBe(1);
    expect(nearestPicture(width * 3.6, width, count)).toBe(4);
  });

  it('never names a picture past either end, however far the track is pulled', () => {
    expect(nearestPicture(-200, width, count)).toBe(0);
    expect(nearestPicture(width * 9, width, count)).toBe(count - 1);
  });

  it('answers 0 for a track with no width or no pictures', () => {
    expect(nearestPicture(300, 0, count)).toBe(0);
    expect(nearestPicture(300, width, 0)).toBe(0);
  });
});

describe('the phone rail', () => {
  // Shots 200 wide with a 24 gap, as the rail lays them out.
  const shot = 200;
  const step = 224;
  const count = 10;

  it('counts the whole shots in view, the last needing no gap after it', () => {
    expect(shotsInView(4 * shot + 3 * 24, step, shot)).toBe(4);
    expect(shotsInView(2 * shot + 24, step, shot)).toBe(2);
    expect(shotsInView(shot, step, shot)).toBe(1);
  });

  it('never counts fewer than one shot in view', () => {
    expect(shotsInView(50, step, shot)).toBe(1);
    expect(shotsInView(0, 0, 0)).toBe(1);
  });

  it('names the first shot in view from the scroll offset', () => {
    expect(firstInView(0, step)).toBe(0);
    expect(firstInView(step * 3, step)).toBe(3);
    expect(firstInView(step * 3 + 100, step)).toBe(3);
    expect(firstInView(step * 3 + 120, step)).toBe(4);
    expect(firstInView(500, 0)).toBe(0);
  });

  it('pages a whole view at a time and stops at the last full view', () => {
    expect(pageTarget(0, 1, 4, count)).toBe(4);
    expect(pageTarget(4, 1, 4, count)).toBe(6);
    expect(pageTarget(6, 1, 4, count)).toBe(6);
    expect(pageTarget(6, -1, 4, count)).toBe(2);
    expect(pageTarget(2, -1, 4, count)).toBe(0);
    expect(pageTarget(0, -1, 4, count)).toBe(0);
  });

  it('pages one shot at a time when one is in view, reaching the last', () => {
    let first = 0;
    for (let i = 0; i < count + 3; i++) first = pageTarget(first, 1, 1, count);
    expect(first).toBe(count - 1);
  });

  it('stays at the start when every shot is already in view', () => {
    expect(pageTarget(0, 1, count + 2, count)).toBe(0);
  });

  it('puts a shot at the left edge, unless the track cannot scroll that far', () => {
    const maxScroll = count * step - 24 - 4 * step;
    expect(railOffset(0, step, maxScroll)).toBe(0);
    expect(railOffset(2, step, maxScroll)).toBe(2 * step);
    expect(railOffset(count - 1, step, maxScroll)).toBe(maxScroll);
  });
});

describe('focusHandOff', () => {
  const prev = { name: 'prev' };
  const next = { name: 'next' };

  it('passes focus to the arrow still on when the focused one switches off, at either end', () => {
    expect(focusHandOff(next, [{ el: prev, off: false }, { el: next, off: true }])).toBe(prev);
    expect(focusHandOff(prev, [{ el: prev, off: true }, { el: next, off: false }])).toBe(next);
  });

  it('leaves focus alone when the focused arrow stays on', () => {
    expect(focusHandOff(next, [{ el: prev, off: true }, { el: next, off: false }])).toBeNull();
    expect(focusHandOff(prev, [{ el: prev, off: false }, { el: next, off: false }])).toBeNull();
  });

  it('leaves focus alone when it is not on an arrow at all', () => {
    expect(focusHandOff(null, [{ el: prev, off: true }, { el: next, off: false }])).toBeNull();
    expect(focusHandOff({}, [{ el: prev, off: false }, { el: next, off: true }])).toBeNull();
  });

  it('has nowhere to go when every arrow is off', () => {
    expect(focusHandOff(next, [{ el: prev, off: true }, { el: next, off: true }])).toBeNull();
  });
});
