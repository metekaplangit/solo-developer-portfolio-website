// Pure formatting helpers. No Astro/DOM imports — unit-tested in src/lib/*.test.ts.

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/** Format a date as e.g. "20 June 2026". Returns '' for missing input. */
export function formatDate(value: Date | string | undefined | null): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return DATE_FORMAT.format(date);
}
