// Astro's content cache keeps a parsed entry until that entry's file or the
// config's serialised form changes, so a file the content layer only imports
// never clears it. Issue 0008 met this with the wrapping rule. A new schema field
// with a default then met it again: the 2 product files nobody had touched came
// back without the field, and their pages failed to build. Each file below shapes
// every entry, so each has to reach the fingerprint in astro.config.mjs.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('the content cache clears when what shapes an entry changes', () => {
  const config = readFileSync(join(process.cwd(), 'astro.config.mjs'), 'utf8');
  const fingerprinted = config.match(/createHash\('sha256'\)[\s\S]*?\.digest\(/)?.[0] ?? '';

  it.each(['src/lib/typography.ts', 'src/lib/satteri-tie.ts', 'src/content/schema.ts'])(
    '%s is in the fingerprint',
    (file) => {
      expect(fingerprinted).toContain(`./${file}`);
    },
  );
});
