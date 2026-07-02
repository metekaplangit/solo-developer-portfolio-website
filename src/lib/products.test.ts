import { describe, it, expect } from 'vitest';
import {
  sortProducts,
  getFeatured,
  visibleStoreLinks,
  hasStoreLinks,
  storeLabel,
  statusLabel,
} from './products';
import type { Product } from '../content/schema';

function make(overrides: Partial<Product>): Product {
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

describe('sortProducts', () => {
  it('orders by status rank then name, without mutating input', () => {
    const input = [
      make({ id: 'b', name: 'Beta', status: 'beta' }),
      make({ id: 'p', name: 'Planned', status: 'planned' }),
      make({ id: 'r2', name: 'Zeta', status: 'released' }),
      make({ id: 'r1', name: 'Alpha', status: 'released' }),
    ];
    const snapshot = [...input];
    const sorted = sortProducts(input);
    expect(sorted.map((p) => p.id)).toEqual(['r1', 'r2', 'b', 'p']);
    expect(input).toEqual(snapshot); // pure
  });
});

describe('getFeatured', () => {
  it('returns only featured products, sorted', () => {
    const products = [
      make({ id: 'a', name: 'A', featured: false }),
      make({ id: 'b', name: 'B', featured: true, status: 'beta' }),
      make({ id: 'c', name: 'C', featured: true, status: 'released' }),
    ];
    expect(getFeatured(products).map((p) => p.id)).toEqual(['c', 'b']);
  });
});

describe('visibleStoreLinks / hasStoreLinks', () => {
  const product = make({
    storeLinks: [
      { store: 'steam', url: 'https://s.example', status: 'available' },
      { store: 'github', url: 'https://g.example', status: 'unavailable' },
      { store: 'app-store', url: 'https://a.example', status: 'coming-soon' },
    ],
  });

  it('hides unavailable links', () => {
    expect(visibleStoreLinks(product).map((l) => l.store)).toEqual([
      'steam',
      'app-store',
    ]);
  });

  it('reports whether visible links exist', () => {
    expect(hasStoreLinks(product)).toBe(true);
    expect(hasStoreLinks(make({ storeLinks: [] }))).toBe(false);
  });
});

describe('labels', () => {
  it('maps store and status enums to display labels', () => {
    expect(storeLabel('mac-app-store')).toBe('Mac App Store');
    expect(statusLabel('in-development')).toBe('In development');
  });
});
