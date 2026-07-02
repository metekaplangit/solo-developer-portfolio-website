import { describe, it, expect } from 'vitest';
import { canonicalPrivacyUrl, policyForProduct, productPolicies } from './privacy';
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
    dataNotCollected: [],
    thirdPartyServices: [],
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

describe('policyForProduct / productPolicies', () => {
  const policies = [policy('global'), policy('aurora-notes'), policy('pixel-drift')];

  it('finds a per-product policy by id', () => {
    expect(policyForProduct(policies, 'pixel-drift')?.productId).toBe('pixel-drift');
    expect(policyForProduct(policies, 'missing')).toBeUndefined();
  });

  it('excludes the global entry from per-product policies', () => {
    expect(productPolicies(policies).map((p) => p.productId)).toEqual([
      'aurora-notes',
      'pixel-drift',
    ]);
  });
});
