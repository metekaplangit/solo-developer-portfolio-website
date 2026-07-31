import { describe, it, expect } from 'vitest';
import { bodyIntro, bodySections } from './prose';

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
      'Second intro paragraph, with bold in it.',
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
    expect(first!.text).toContain('switch to Chrono');
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
