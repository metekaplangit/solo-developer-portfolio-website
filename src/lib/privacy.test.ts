import { describe, it, expect } from 'vitest';
import { canonicalPrivacyUrl, productPolicyEntries } from './privacy';
import type { Product, PrivacyPolicyEntry } from '../content/schema';

function product(overrides: Partial<Product>): Product {
  return {
    id: 'x',
    name: 'X',
    slug: 'x',
    type: 'app',
    status: 'released',
    summary: 's',
    platforms: ['web'],
    storeLinks: [],
    supportUrl: '/support/',
    screenshots: [],
    features: [],
    featured: false,
    ...overrides,
  } as Product;
}

function policy(productId: string): PrivacyPolicyEntry {
  return {
    productId,
    title: `${productId} policy`,
    lastUpdated: new Date('2026-06-20'),
    dataCollected: [],
    dataUse: [],
    dataNotCollected: [],
    thirdPartyServices: [],
    storedLocally: [],
    permissions: [],
    retention: 'No data collected; nothing to retain or delete.',
    hasAccounts: false,
    contact: 'support@example.com',
    effectiveScope: 'scope',
    reviewStatus: 'reviewed',
  };
}

describe('canonicalPrivacyUrl', () => {
  it('uses the explicit policy URL when present', () => {
    expect(
      canonicalPrivacyUrl(product({ privacyPolicyUrl: '/privacy/aurora-notes/' })),
    ).toBe('/privacy/aurora-notes/');
  });

  it('falls back to the global policy URL', () => {
    expect(canonicalPrivacyUrl(product({ privacyPolicyUrl: undefined }))).toBe(
      '/privacy/global/',
    );
  });
});

describe('productPolicyEntries', () => {
  // Shaped like the collection entries the privacy pages actually hold.
  const entries = [policy('global'), policy('aurora-notes'), policy('pixel-drift')].map(
    (data) => ({ data }),
  );

  it('excludes the global entry from per-product policies', () => {
    expect(productPolicyEntries(entries).map((e) => e.data.productId)).toEqual([
      'aurora-notes',
      'pixel-drift',
    ]);
  });

  it('preserves the whole entry, not just its data', () => {
    const withExtras = entries.map((e) => ({ ...e, id: e.data.productId }));
    expect(productPolicyEntries(withExtras).map((e) => e.id)).toEqual([
      'aurora-notes',
      'pixel-drift',
    ]);
  });
});
