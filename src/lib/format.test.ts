import { describe, it, expect } from 'vitest';
import { formatDate } from './format';

describe('formatDate', () => {
  it('formats a Date as "D Month YYYY"', () => {
    expect(formatDate(new Date('2026-06-20T00:00:00Z'))).toBe('20 June 2026');
  });

  it('accepts an ISO string', () => {
    expect(formatDate('2026-03-14')).toBe('14 March 2026');
  });

  it('returns empty string for missing or invalid input', () => {
    expect(formatDate(undefined)).toBe('');
    expect(formatDate(null)).toBe('');
    expect(formatDate('not-a-date')).toBe('');
  });
});
