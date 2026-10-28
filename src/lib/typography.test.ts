import { describe, it, expect } from 'vitest';
import { tie, bindPhrases, NBSP, PHRASES } from './typography';

describe('tie', () => {
  it('binds the stray article the owner actually reported', () => {
    // Verbatim from the home hero, where the line broke after "and a".
    const out = tie('each with a plain privacy page and a real person answering support.');
    expect(out).toContain(`a${NBSP}plain`);
    expect(out).toContain(`and${NBSP}a`);
    expect(out).toContain(`a${NBSP}real`);
  });

  it('leaves a word that can legitimately end a line', () => {
    // "calm", "Mac" and "timer" are short but point at nothing after them, so
    // they are fine line endings. Tying them would only build long
    // unbreakable runs for no gain.
    expect(tie('a calm Mac timer')).toBe(`a${NBSP}calm Mac timer`);
  });

  it('does not tie a word that closes a clause', () => {
    expect(tie('nothing to see, and more below')).toBe(
      // "see," closes its clause, so it stays free; "and more" open the next
      // one and are held to it.
      `nothing to${NBSP}see, and${NBSP}more${NBSP}below`,
    );
  });

  it('refuses a pair too long to wrap in a narrow column', () => {
    expect(tie('with counterrevolutionaries')).toBe('with counterrevolutionaries');
  });

  it('sees every adjacent pair, not every second one', () => {
    // The lookahead's whole purpose. A regex consuming both words would skip
    // "it/to" entirely.
    expect(tie('get it to the point')).toBe(`get it${NBSP}to${NBSP}the${NBSP}point`);
  });

  it('is idempotent', () => {
    const once = tie('a plain privacy page and a real person');
    expect(tie(once)).toBe(once);
  });

  it('does not touch newlines', () => {
    // A newline is a wrap the author chose; reflowing it is not this rule's job.
    expect(tie('the\nnext line')).toBe('the\nnext line');
  });

  it('returns empty input unchanged', () => {
    expect(tie('')).toBe('');
  });
});

describe('tie — the breaks the text review measured', () => {
  it('holds a figure to the word it counts', () => {
    expect(tie('replies in 2–3 business days')).toContain(`2–3${NBSP}business`);
    expect(tie('765 worked examples')).toContain(`765${NBSP}worked`);
  });

  it('holds the opening words of a clause together', () => {
    // A clause starting with one word at a line end: "…iPad, each / with".
    const out = tie('for Mac, iPhone and iPad, each with a plain page.');
    expect(out).toContain(`each${NBSP}with`);
    expect(out).toContain(`iPhone${NBSP}and`);
  });

  it('never starts a line with a dash', () => {
    expect(tie('Support goes straight to me — I usually reply.')).toContain(`me${NBSP}— I`);
    expect(tie('pages 2 – 4 here')).toContain(`2${NBSP}– 4`);
  });

  it('never splits a short hyphenated word at its hyphen', () => {
    expect(tie('a count-up stopwatch')).toContain('count\u2011up');
    expect(tie('open-ended work')).toContain('open\u2011ended');
    // Too long to hold in a narrow column, so it keeps its breakable hyphen.
    expect(tie('internationalization-ready')).toBe('internationalization-ready');
  });

  it('never binds a run too wide for the 320px column, even run twice', () => {
    // The budget T4 holds the built site to. Chained ties and a second pass
    // over already-tied text are the two ways a run grew past it.
    const lines = [
      'Each product has its own privacy page, and every one of them is kept current.',
      'Support goes straight to me. If something breaks you hear back — usually within 2–3 business days.',
      'Write the sum as you would say it, and the answer lands beside the line.',
      'A crossword game for iPhone and iPad. Trace every answer yourself, or reach for a skill — seven to unlock, four to carry.',
      'You want a calm, native Mac timer that lives in your menu bar and opens straight to a usable timer.',
    ];
    for (const line of lines) {
      for (const out of [tie(line), tie(tie(line))]) {
        for (const run of out.split(/[ \t\n]/)) {
          expect(run.length, run).toBeLessThanOrEqual(30);
        }
      }
      expect(tie(tie(line))).toBe(tie(line));
    }
  });
});

describe('tie — proof the check can fail', () => {
  it('is not silently a no-op', () => {
    // A rule that stopped doing anything would leave every assertion above
    // still green if they only checked the OUTPUT. This one pins the input.
    const raw = 'a plain privacy page and a real person';
    expect(raw).not.toContain(NBSP);
    expect(tie(raw)).toContain(NBSP);
    expect(tie(raw)).not.toBe(raw);
  });
});

describe('bindPhrases — named things wrap as one thing (CHECKLIST T2)', () => {
  it('binds a product name', () => {
    expect(bindPhrases('I built Sole Focus because')).toBe(
      `I built Sole${NBSP}Focus because`,
    );
  });

  it('prefers the longest match, so the store name does not lose its Mac', () => {
    // 'App Store' is a substring of 'Mac App Store'. Bound shortest-first, the
    // inner match would consume the space and leave "Mac" free to break away —
    // the exact defect, one word to the left.
    expect(bindPhrases('on the Mac App Store today')).toBe(
      `on the Mac${NBSP}App${NBSP}Store today`,
    );
  });

  it('is idempotent', () => {
    const once = bindPhrases('Sole Focus and Magic Notes');
    expect(bindPhrases(once)).toBe(once);
  });

  it('leaves text holding no named thing alone', () => {
    expect(bindPhrases('a calm private timer')).toBe('a calm private timer');
  });

  it('never publishes a phrase too long for the narrowest column (T4)', () => {
    for (const p of PHRASES) expect(p.length).toBeLessThanOrEqual(22);
  });
});

describe('tie binds the phrase before the pair rule sees it', () => {
  it('keeps "a Pomodoro timer" whole — the break the owner reported', () => {
    // Before this, the pair rule bound "a" to "Pomodoro" and stopped, so the
    // line ended on "a Pomodoro" and "timer" dropped alone to the next one.
    expect(tie('a Pomodoro timer and a stopwatch')).toContain(
      `a${NBSP}Pomodoro${NBSP}timer`,
    );
  });

  it('is not silently a no-op on phrases', () => {
    const raw = 'Sole Focus is on the Mac App Store';
    expect(raw).not.toContain(NBSP);
    expect(tie(raw)).toContain(`Sole${NBSP}Focus`);
    expect(tie(raw)).toContain(`Mac${NBSP}App${NBSP}Store`);
  });
});
