import { describe, it, expect } from 'vitest';
import { bodyIntro } from './prose';
import { NBSP } from './typography';

const BODY = `First intro paragraph.

Second intro paragraph, with **bold** in it.

## Two ways to work

Run structured **Pomodoro** sessions with adjustable lengths.

When the work is open-ended, switch to **Chrono**, a count-up stopwatch.

## Private, offline, yours

No accounts. No cloud.

## Common questions

**Is it really free?** Yes.

_Free on the Mac App Store._
`;

describe('bodyIntro', () => {
  it('returns the paragraphs before the first heading, inline markup stripped', () => {
    expect(bodyIntro(BODY)).toEqual([
      'First intro paragraph.',
      // "with bold" opens a clause and "in" points forward, so the wrapping
      // rule (STEP-0062) holds them to what follows — this is body prose.
      `Second intro paragraph, with${NBSP}bold${NBSP}in${NBSP}it.`,
    ]);
  });

  it('returns an empty list for a body that opens with a heading', () => {
    expect(bodyIntro('## Only a heading\n\nText.')).toEqual([]);
  });
});
