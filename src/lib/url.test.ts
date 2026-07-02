import { describe, it, expect } from 'vitest';
import { joinBase } from './url';

describe('joinBase', () => {
  it('prefixes a root-absolute path under a sub-path base', () => {
    expect(joinBase('/solo-developer-portfolio-website', '/apps/')).toBe(
      '/solo-developer-portfolio-website/apps/',
    );
  });

  it('handles a trailing-slash base without doubling slashes', () => {
    expect(joinBase('/repo/', '/privacy/')).toBe('/repo/privacy/');
  });

  it('adds a leading slash to the path when missing', () => {
    expect(joinBase('/repo', 'about/')).toBe('/repo/about/');
  });

  it('returns "/" for the root under an empty base', () => {
    expect(joinBase('/', '/')).toBe('/');
  });

  it('leaves external, mailto, and anchor links untouched', () => {
    expect(joinBase('/repo', 'https://example.com')).toBe('https://example.com');
    expect(joinBase('/repo', 'mailto:a@b.com')).toBe('mailto:a@b.com');
    expect(joinBase('/repo', '#main')).toBe('#main');
  });
});
