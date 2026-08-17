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

// Magic Notes went live on the Mac App Store on 2026-08-16 (STEP-0082), which
// closes the case STEP-0069 opened: its pages were built ahead of the release
// so the URLs inside the submitted binary would resolve, and everything the
// product could not yet support — a download, a price, a release date — was
// pinned empty. Those three pins now assert the opposite of the truth, so they
// are replaced rather than deleted: the risk simply flipped from claiming a
// release that had not happened to failing to show one that has.
describe('Magic Notes product content', () => {
  const product = productSchema.parse(frontmatter('src/content/products/magic-notes.md'));
  const policy = privacyPolicyEntrySchema.parse(
    frontmatter('src/content/policies/magic-notes.md'),
  );

  // Every value here was read from Apple's lookup endpoint for id 6797499171 on
  // 2026-08-17, not from the app's own submission draft — the draft is what the
  // studio asked for, the listing is what visitors can actually act on.
  it('is released, free, and links the verified Mac App Store listing', () => {
    expect(product.status).toBe('released');
    const mas = product.storeLinks.find((l) => l.store === 'mac-app-store');
    expect(mas).toBeDefined();
    expect(mas?.status).toBe('available');
    expect(mas?.url).toBe(
      'https://apps.apple.com/us/app/magic-notes-calculator/id6797499171?mt=12',
    );
    expect(product.price).toBe('0');
    expect(product.releaseDate?.toISOString().slice(0, 10)).toBe('2026-08-16');
  });

  // The listing is titled "Magic Notes Calculator"; the product is called Magic
  // Notes. The same split Sole Focus already lives with ("Sole Focus Pomodoro
  // Timer"), and it is deliberate — a store title carries search keywords, a
  // product name does not. Pinned so a later sync with the listing cannot drag
  // the keyword suffix onto the site.
  it('keeps the product name, not the store listing title', () => {
    expect(product.name).toBe('Magic Notes');
  });

  it('pins the verified system requirement shown beside the download button', () => {
    // Verified against the live listing: macOS 15.0 or later.
    expect(product.requirements).toBe('macOS 15 or later');
  });

  // STEP-0070 replaced the "no images" pin: the owner supplied the shipped icon
  // and six real captures on 2026-08-03, so the risk flips to Sole Focus's —
  // a broken reference or a missing alt text on a page a store reviewer opens.
  it('declares six screenshots, each with alt text and an asset that exists', () => {
    expect(product.screenshots).toHaveLength(6);
    for (const shot of product.screenshots) {
      expect(shot.type).toBe('screenshot');
      expect(shot.altText.trim().length).toBeGreaterThan(0);
      const assetPath = join(root, 'src/assets/magic-notes/screenshots', basename(shot.path));
      expect(existsSync(assetPath), `missing asset for "${shot.path}"`).toBe(true);
    }
  });

  it('carries the shipped app icon, and the file is there', () => {
    expect(product.icon).toBeDefined();
    expect(product.icon?.path).toBe('/media/magic-notes/icon.svg');
    expect(product.icon?.altText.trim().length).toBeGreaterThan(0);
    expect(existsSync(join(root, 'public/media/magic-notes/icon.svg'))).toBe(true);
  });

  // The page a store reviewer lands on must not read as a stub. This pins the
  // two things that made it one: no imagery, and a policy still marked draft.
  it('serves a policy that has been read against the shipped app', () => {
    expect(policy.reviewStatus).toBe('reviewed');
    expect(policy.permissions.length).toBeGreaterThan(0);
    expect(policy.thirdPartyServices).toHaveLength(0);
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
