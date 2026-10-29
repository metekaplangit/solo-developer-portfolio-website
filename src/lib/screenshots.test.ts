// screenshotTitle drives the gallery transcript's visible titles (STEP-0032);
// a wrong split would render raw filenames to visitors.
import { describe, it, expect } from 'vitest';
import { screenshotTitle } from './screenshots';

describe('screenshotTitle', () => {
  it('humanizes an ordered screenshot filename', () => {
    expect(screenshotTitle('01-one-quiet-app.png')).toBe('One quiet app');
    expect(screenshotTitle('05-choose-your-theme.png')).toBe('Choose your theme');
  });

  it('handles paths, no order prefix, and underscores', () => {
    expect(screenshotTitle('media/shots/02-day-and-long-game.webp')).toBe('Day and long game');
    expect(screenshotTitle('zen_mode.png')).toBe('Zen mode');
  });

  // A file name cannot carry an apostrophe, so `a-traveller-s-keepsakes` lost
  // it and the home page captioned it "A traveller s keepsakes". A lone "s"
  // between two words is the possessive the name could not spell.
  it('gives a possessive its apostrophe back', () => {
    for (const [file, title] of [
      ['03-a-traveller-s-keepsakes.jpg', 'A traveller’s keepsakes'],
      ['07-a-surveyor-s-tools.jpg', 'A surveyor’s tools'],
      ['the-studio-s-own.png', 'The studio’s own'],
    ]) {
      expect(screenshotTitle(file)).toBe(title);
    }
    expect(screenshotTitle('01-s-mode.png')).toBe('S mode');
  });
});
