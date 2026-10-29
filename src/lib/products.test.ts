import { describe, it, expect } from 'vitest';
import {
  sortProducts,
  newestRelease,
  visibleStoreLinks,
  hasStoreLinks,
  storeLabel,
  downloadLabel,
  statusLabel,
  platformLabel,
  relatedProducts,
  productHue,
  NEUTRAL_HUE,
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
    ...overrides,
  } as Product;
}

describe('sortProducts', () => {
  it('puts released first, newest release first, without mutating input', () => {
    const input = [
      make({ id: 'b', name: 'Beta', status: 'beta' }),
      make({ id: 'old', name: 'Alpha', status: 'released', releaseDate: new Date('2026-07-15') }),
      make({ id: 'undated', name: 'Aardvark', status: 'released' }),
      make({ id: 'new', name: 'Zeta', status: 'released', releaseDate: new Date('2026-10-26') }),
      make({ id: 'mid', name: 'Mu', status: 'released', releaseDate: new Date('2026-08-16') }),
      make({ id: 'p', name: 'Planned', status: 'planned' }),
    ];
    const snapshot = [...input];
    expect(sortProducts(input).map((p) => p.id)).toEqual(['new', 'mid', 'old', 'undated', 'b', 'p']);
    expect(input).toEqual(snapshot); // pure
  });

  it('breaks a same-day tie by name', () => {
    const day = new Date('2026-10-26');
    const sorted = sortProducts([
      make({ id: 'z', name: 'Zed', status: 'released', releaseDate: day }),
      make({ id: 'a', name: 'Ace', status: 'released', releaseDate: day }),
    ]);
    expect(sorted.map((p) => p.id)).toEqual(['a', 'z']);
  });
});

describe('newestRelease', () => {
  it('is whatever was released last, whatever its name or file order', () => {
    const products = [
      make({ id: 'mid', name: 'A', status: 'released', releaseDate: new Date('2026-08-16') }),
      make({ id: 'new', name: 'Z', status: 'released', releaseDate: new Date('2026-10-26') }),
      make({ id: 'beta', name: 'B', status: 'beta', releaseDate: new Date('2026-11-01') }),
    ];
    expect(newestRelease(products)?.id).toBe('new');
  });

  it('is nothing until something is released', () => {
    expect(newestRelease([make({ id: 'b', status: 'beta' })])).toBeUndefined();
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

describe('relatedProducts', () => {
  const all = [
    make({ id: 'a1', name: 'A1', type: 'app', status: 'released' }),
    make({ id: 'a2', name: 'A2', type: 'app', status: 'beta' }),
    make({ id: 'g1', name: 'G1', type: 'game', status: 'released' }),
  ];

  it('returns same-type products excluding self, sorted', () => {
    const result = relatedProducts(all, all[0], 3);
    expect(result.map((p) => p.id)).toEqual(['a2']);
  });

  it('returns nothing when no other same-type product exists', () => {
    expect(relatedProducts(all, all[2], 3)).toEqual([]);
  });

  it('respects the limit', () => {
    const many = [
      make({ id: 's', name: 'Self', type: 'app' }),
      make({ id: 'x1', name: 'X1', type: 'app' }),
      make({ id: 'x2', name: 'X2', type: 'app' }),
      make({ id: 'x3', name: 'X3', type: 'app' }),
    ];
    expect(relatedProducts(many, many[0], 2)).toHaveLength(2);
  });
});

describe('labels', () => {
  it('maps store and status enums to display labels', () => {
    expect(storeLabel('mac-app-store')).toBe('Mac App Store');
    expect(statusLabel('in-development')).toBe('In development');
  });

  it('renders human platform labels, passing unknown tokens through', () => {
    // review-0001 OPP-04: badges must never show raw schema tokens like 'macos'.
    expect(platformLabel('macos')).toBe('macOS');
    expect(platformLabel('ios')).toBe('iOS');
    expect(platformLabel('somefuture')).toBe('somefuture');
  });
});

describe('productHue', () => {
  it('returns the product’s authored hue', () => {
    expect(productHue(make({ hue: '#ff9245' }))).toBe('#ff9245');
  });

  it('falls back to the neutral hue when none is authored', () => {
    // An unclaimed band reads as studio chrome, not as a product with a
    // forgotten colour — so the fallback is the site's own near-white.
    expect(productHue(make({}))).toBe(NEUTRAL_HUE);
  });
});

describe('downloadLabel', () => {
  it('names the store the button opens, so an iPhone game never reads "Mac App Store"', () => {
    const ios = make({
      storeLinks: [{ store: 'app-store', url: 'https://apps.apple.com/app/id1', status: 'available' }],
    });
    const mac = make({
      storeLinks: [{ store: 'mac-app-store', url: 'https://apps.apple.com/app/id2', status: 'available' }],
    });
    expect(downloadLabel(ios)).toBe('App Store');
    expect(downloadLabel(mac)).toBe('Mac App Store');
  });

  it('is undefined when nothing can be downloaded yet', () => {
    expect(downloadLabel(make({ storeLinks: [] }))).toBeUndefined();
    const soon = make({
      storeLinks: [{ store: 'app-store', url: 'https://apps.apple.com/app/id1', status: 'coming-soon' }],
    });
    expect(downloadLabel(soon)).toBeUndefined();
  });
});
