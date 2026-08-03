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
      `nothing to${NBSP}see, and${NBSP}more below`,
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
