// Pure product/domain helpers. Operate on plain schema types (not Astro entries)
// so they are decoupled and unit-testable. See docs/ARCHITECTURE.md.
import type { Product, StoreLink } from '../content/schema';

const STATUS_RANK: Record<Product['status'], number> = {
  released: 0,
  beta: 1,
  'in-development': 2,
  planned: 3,
  archived: 4,
};

const STORE_LABELS: Record<StoreLink['store'], string> = {
  'app-store': 'App Store',
  'mac-app-store': 'Mac App Store',
  'google-play': 'Google Play',
  steam: 'Steam',
  github: 'GitHub',
  web: 'Website',
  other: 'Link',
};

export function storeLabel(store: StoreLink['store']): string {
  return STORE_LABELS[store];
}

/** Featured products, in display order. */
export function getFeatured(products: Product[]): Product[] {
  return sortProducts(products.filter((p) => p.featured));
}

/** Sort by release status, then name (stable, pure — does not mutate input). */
export function sortProducts(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const byStatus = STATUS_RANK[a.status] - STATUS_RANK[b.status];
    return byStatus !== 0 ? byStatus : a.name.localeCompare(b.name);
  });
}

/** Store links a visitor can act on now (hide 'unavailable'). */
export function visibleStoreLinks(product: Product): StoreLink[] {
  return product.storeLinks.filter((link) => link.status !== 'unavailable');
}

export function hasStoreLinks(product: Product): boolean {
  return visibleStoreLinks(product).length > 0;
}

/**
 * Other products of the same type as `product`, excluding itself, sorted and
 * limited. Pure — safe for unit testing.
 */
export function relatedProducts(
  all: Product[],
  product: Product,
  limit = 3,
): Product[] {
  return sortProducts(
    all.filter((p) => p.id !== product.id && p.type === product.type),
  ).slice(0, limit);
}

const STATUS_LABELS: Record<Product['status'], string> = {
  released: 'Released',
  beta: 'Beta',
  'in-development': 'In development',
  planned: 'Planned',
  archived: 'Archived',
};

export function statusLabel(status: Product['status']): string {
  return STATUS_LABELS[status];
}
