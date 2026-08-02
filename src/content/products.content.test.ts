// Content-level guard for the real product markdown (not just the schema in the
// abstract). The risk introduced with real screenshots is a broken image
// reference or a missing alt text, so this asserts every Sole Focus screenshot
// validates, carries alt text, and points at an asset file that actually exists.
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, basename } from 'node:path';
import { parse } from 'yaml';
import { productSchema, privacyPolicyEntrySchema } from './schema';

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

  // First-glance facts (STEP-0031): the facts line renders from these fields;
  // privacyFacts must only restate the already-tested policy claims.
  // Taste-round T2/T5 (STEP-0034/0035): both render only from these fields and
  // the copy was explicitly user-approved — pin it so changes are deliberate.
  it('carries the approved fit statement', () => {
    expect(product.fitFor).toContain('calm, native Mac timer');
    expect(product.fitNotFor).toContain('website blocker');
  });

  it('carries the approved maker note', () => {
    expect(product.makerNote).toHaveLength(2);
    // "I" is bound to "built" by the wrapping rule (STEP-0062) — the schema
    // ties every prose field as it is read.
    expect(product.makerNote[0]?.replace(/ /g, ' ')).toContain('I built Sole Focus');
  });

  it('carries the first-glance facts fields', () => {
    expect(product.requirements).toBe('macOS 10.15 or later');
    expect(product.privacyFacts).toBe('Works offline — no account, no cloud, no tracking');
  });

  it('pins the verified system requirement shown beside the download button', () => {
    // Verified against the live Mac App Store listing (macOS 10.15+). Update
    // deliberately if the app's requirement changes.
    expect(product.requirements).toBe('macOS 10.15 or later');
  });
});

// Magic Notes (STEP-0069) is the opposite case to Sole Focus: a finished app
// that has NOT been released. Its pages exist so the URLs already written into
// its store submission draft resolve. The risk here is the reverse of a broken
// image — it is a claim the product cannot yet support (a download, a price, a
// release date), or a privacy URL that drifts from the one being submitted.
describe('Magic Notes product content', () => {
  const product = productSchema.parse(frontmatter('src/content/products/magic-notes.md'));
  const policy = privacyPolicyEntrySchema.parse(
    frontmatter('src/content/policies/magic-notes.md'),
  );

  it('claims no release: no store link, no price, no release date', () => {
    expect(product.status).toBe('in-development');
    expect(product.storeLinks).toHaveLength(0);
    expect(product.price).toBeUndefined();
    expect(product.releaseDate).toBeUndefined();
  });

  it('promises no images it does not have', () => {
    expect(product.screenshots).toHaveLength(0);
    expect(product.icon).toBeUndefined();
  });

  // The URL below is quoted verbatim in the app's submission sheet. Once a
  // build carrying it is accepted, the link cannot be corrected quietly — so
  // the page it points at is pinned here rather than left to a rename.
  it('serves the privacy URL the store submission names', () => {
    expect(product.privacyPolicyUrl).toBe('/privacy/magic-notes/');
    expect(policy.productId).toBe('magic-notes');
    expect(policy.contact).toBe('support@metkapstudio.com');
  });

  it('states the deletion route Apple 5.1.1(i) requires, with no account to delete', () => {
    expect(policy.hasAccounts).toBe(false);
    expect(policy.dataCollected).toHaveLength(0);
    expect(policy.retention).toMatch(/delete/i);
  });

  it('carries its own hue so the catalogue reads as two products', () => {
    // Read from the app's own Graphite accent in dark appearance, not chosen
    // for the site (DESIGN.md §2). Must differ from Sole Focus's orange.
    expect(product.hue).toBe('#B2BBC5');
  });

  it('lays its feature grid out in full rows', () => {
    // The full-row rule (STEP-0063): a count with no divisor <= 4 collapses the
    // grid to one column. 12 gives 4 wide and 2 mid, both full.
    expect(product.features.length % 4).toBe(0);
  });
});
