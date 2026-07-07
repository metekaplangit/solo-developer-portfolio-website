// Content-level guard for the real product markdown (not just the schema in the
// abstract). The risk introduced with real screenshots is a broken image
// reference or a missing alt text, so this asserts every Sole Focus screenshot
// validates, carries alt text, and points at an asset file that actually exists.
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, basename } from 'node:path';
import { parse } from 'yaml';
import { productSchema } from './schema';

const root = fileURLToPath(new URL('../../', import.meta.url));

function frontmatter(relPath: string): unknown {
  const raw = readFileSync(join(root, relPath), 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error(`no frontmatter in ${relPath}`);
  return parse(match[1]);
}

describe('Sole Focus product content', () => {
  const product = productSchema.parse(frontmatter('src/content/products/sole-focus.md'));

  it('declares five screenshots', () => {
    expect(product.screenshots).toHaveLength(5);
  });

  it('every screenshot has non-empty alt text and an existing asset file', () => {
    for (const shot of product.screenshots) {
      expect(shot.type).toBe('screenshot');
      expect(shot.altText.trim().length).toBeGreaterThan(0);
      const assetPath = join(root, 'src/assets/sole-focus/screenshots', basename(shot.path));
      expect(existsSync(assetPath), `missing asset for "${shot.path}"`).toBe(true);
    }
  });
});
