import { describe, it, expect } from 'vitest';
import { tie, NBSP } from './typography';

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
