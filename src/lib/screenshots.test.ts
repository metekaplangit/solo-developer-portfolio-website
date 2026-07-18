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
});
