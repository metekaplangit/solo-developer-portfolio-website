import { describe, it, expect } from 'vitest';
import { bodyIntro, bodySections, firstSentence } from './prose';
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
      // "with" and "in" are bound to what follows by the wrapping rule
      // (STEP-0062) — this is body prose, so it is tied.
      `Second intro paragraph, with${NBSP}bold in${NBSP}it.`,
    ]);
  });

  it('returns an empty list for a body that opens with a heading', () => {
    expect(bodyIntro('## Only a heading\n\nText.')).toEqual([]);
  });
});

describe('bodySections', () => {
  it('returns every section in document order', () => {
    expect(bodySections(BODY).map((s) => s.title)).toEqual([
      'Two ways to work',
      'Private, offline, yours',
      'Common questions',
    ]);
  });

  // The bug this function exists to avoid: a `$` terminator under /m ends at the
  // first line break, which truncated multi-paragraph sections to one line.
  it('keeps every paragraph of a multi-paragraph section', () => {
    const [first] = bodySections(BODY);
    expect(first!.text).toContain('Run structured Pomodoro sessions');
    expect(first!.text).toContain(`switch to${NBSP}Chrono`);
  });

  // Titles are NOT tied: a heading gets `text-wrap: balance`, and one bound
  // unit cannot balance. Pinned so a future change to `strip` cannot quietly
  // start tying them.
  it('leaves section titles untied', () => {
    for (const s of bodySections(BODY)) {
      expect(s.title).not.toContain(NBSP);
    }
    expect(bodySections(BODY)[0]!.title).toBe('Two ways to work');
  });

  it('drops excluded titles', () => {
    expect(bodySections(BODY, ['Common questions']).map((s) => s.title)).toEqual([
      'Two ways to work',
      'Private, offline, yours',
    ]);
  });

  it('cuts a trailing italic sign-off out of the last section', () => {
    const last = bodySections(BODY).at(-1)!;
    expect(last.text).not.toContain('Free on the Mac App Store');
  });

  it('returns nothing for a body with no headings', () => {
    expect(bodySections('Just prose, no headings.')).toEqual([]);
  });
});

describe('firstSentence', () => {
  it('takes the opening sentence and leaves the rest', () => {
    expect(firstSentence('One thing. Then another thing entirely.')).toBe('One thing.');
  });

  it('does not split on an abbreviation or a decimal', () => {
    // The reason the boundary requires a following capital: without it,
    // "e.g." and "2.5" both look like sentence ends.
    expect(firstSentence('Adjustable from 2.5 minutes upward, e.g. for a short break.')).toBe(
      'Adjustable from 2.5 minutes upward, e.g. for a short break.',
    );
  });

  it('handles ! and ?', () => {
    expect(firstSentence('Really? Yes, really.')).toBe('Really?');
  });

  it('returns a single-sentence passage whole', () => {
    expect(firstSentence('Only one sentence here.')).toBe('Only one sentence here.');
  });

  it('returns empty input unchanged', () => {
    expect(firstSentence('')).toBe('');
  });
});
