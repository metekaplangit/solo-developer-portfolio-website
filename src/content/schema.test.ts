import { describe, it, expect } from 'vitest';
import {
  productSchema,
  privacyPolicyEntrySchema,
  storeLinkSchema,
  mediaAssetSchema,
} from './schema';

const validProduct = {
  id: 'aurora-notes',
  name: 'Aurora Notes',
  slug: 'aurora-notes',
  type: 'app',
  status: 'released',
  summary: 'A calm notes app.',
  platforms: ['ios', 'macos'],
};

describe('productSchema', () => {
  it('accepts a minimal valid product and applies defaults', () => {
    const result = productSchema.parse(validProduct);
    expect(result.storeLinks).toEqual([]);
    expect(result.supportUrl).toBe('/support/');
    expect(result.featured).toBe(false);
  });

  it('rejects a non-kebab-case slug', () => {
    const r = productSchema.safeParse({ ...validProduct, slug: 'Aurora Notes' });
    expect(r.success).toBe(false);
  });

  it('rejects an empty platforms array', () => {
    const r = productSchema.safeParse({ ...validProduct, platforms: [] });
    expect(r.success).toBe(false);
  });

  it('rejects an unknown product type', () => {
    const r = productSchema.safeParse({ ...validProduct, type: 'tool' });
    expect(r.success).toBe(false);
  });

  it('rejects an empty summary', () => {
    const r = productSchema.safeParse({ ...validProduct, summary: '' });
    expect(r.success).toBe(false);
  });

  it('coerces ISO date strings to Date', () => {
    const r = productSchema.parse({ ...validProduct, releaseDate: '2026-03-14' });
    expect(r.releaseDate).toBeInstanceOf(Date);
  });
});

describe('mediaAssetSchema', () => {
  const validAsset = {
    id: 'a1',
    productId: 'aurora-notes',
    type: 'screenshot',
    path: '/media/a.png',
    altText: 'A screenshot',
    licenseOrOwnership: 'owned',
  };

  it('accepts a valid asset', () => {
    expect(mediaAssetSchema.safeParse(validAsset).success).toBe(true);
  });

  it('rejects an asset with empty alt text', () => {
    const r = mediaAssetSchema.safeParse({ ...validAsset, altText: '' });
    expect(r.success).toBe(false);
  });
});

describe('storeLinkSchema', () => {
  it('rejects an invalid url', () => {
    const r = storeLinkSchema.safeParse({ store: 'steam', url: 'not-a-url' });
    expect(r.success).toBe(false);
  });

  it('defaults status to available', () => {
    const r = storeLinkSchema.parse({ store: 'github', url: 'https://example.com' });
    expect(r.status).toBe('available');
  });
});

describe('privacyPolicyEntrySchema', () => {
  const validPolicy = {
    productId: 'global',
    title: 'Privacy Overview',
    lastUpdated: '2026-06-20',
    retention: 'No data is collected, so there is nothing to retain or delete.',
    contact: 'support@example.com',
    effectiveScope: 'This website.',
  };

  it('accepts a valid policy and defaults arrays + reviewStatus', () => {
    const r = privacyPolicyEntrySchema.parse(validPolicy);
    expect(r.dataCollected).toEqual([]);
    expect(r.dataUse).toEqual([]);
    expect(r.storedLocally).toEqual([]);
    expect(r.permissions).toEqual([]);
    expect(r.hasAccounts).toBe(false);
    expect(r.reviewStatus).toBe('draft');
    expect(r.lastUpdated).toBeInstanceOf(Date);
  });

  it('rejects a policy missing the retention/deletion statement (Apple 5.1.1)', () => {
    const { retention, ...rest } = validPolicy;
    expect(privacyPolicyEntrySchema.safeParse(rest).success).toBe(false);
  });

  it('rejects a policy without a scope', () => {
    const { effectiveScope, ...rest } = validPolicy;
    expect(privacyPolicyEntrySchema.safeParse(rest).success).toBe(false);
  });

  it('rejects an unknown review status', () => {
    const r = privacyPolicyEntrySchema.safeParse({
      ...validPolicy,
      reviewStatus: 'approved',
    });
    expect(r.success).toBe(false);
  });
});
