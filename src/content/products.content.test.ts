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

  // Release state (STEP-0027): the app is live on the Mac App Store, so the
  // content must carry the released status and the verified store link — this
  // is what renders the download button and the truthful offers JSON-LD.
  it('is released with an available Mac App Store link', () => {
    expect(product.status).toBe('released');
    const mas = product.storeLinks.find((l) => l.store === 'mac-app-store');
    expect(mas).toBeDefined();
    expect(mas?.status).toBe('available');
    expect(mas?.url).toBe(
      'https://apps.apple.com/us/app/sole-focus-pomodoro-timer/id6788789811?mt=12',
    );
  });

  it('declares a price so released offers JSON-LD can be emitted truthfully', () => {
    expect(product.price).toBe('0');
    expect(product.releaseDate).toBeDefined();
  });
});
