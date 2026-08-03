// Pure product/domain helpers. Operate on plain schema types (not Astro entries)
// so they are decoupled and unit-testable. See docs/ARCHITECTURE.md.
import type { Product, StoreLink } from '../content/schema';
import { tie } from './typography';

/**
 * A product's summary, with the wrapping rule applied (CHECKLIST T1/T2).
 *
 * Read through here by every surface that shows it — the card, the band and the
 * product page all rendered `product.summary` raw, which is why the Sole Focus
 * lead on `/apps/` broke as "…a Pomodoro" with "timer" on the next line. One
 * accessor rather than three call sites: a fourth surface cannot forget.
 */
export function productSummary(product: Product): string {
  return tie(product.summary);
}

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

/**
 * Human platform labels (review-0001 OPP-04): the schema stores lowercase
 * tokens ('macos'); every user-facing surface and the JSON-LD builder render
 * through this one map so labels can never drift apart.
 */
export const PLATFORM_LABELS: Record<string, string> = {
  macos: 'macOS',
  ios: 'iOS',
  ipados: 'iPadOS',
  android: 'Android',
  windows: 'Windows',
  linux: 'Linux',
  web: 'Web',
  steam: 'Steam',
};

export function platformLabel(platform: string): string {
  return PLATFORM_LABELS[platform] ?? platform;
}

/**
 * The neutral hue a product band falls back to when the product has not
 * authored one. Deliberately the site's own near-white rather than a second
 * chromatic voice: an unclaimed band should read as studio chrome, not as a
 * product whose colour someone forgot to pick.
 */
export const NEUTRAL_HUE = '#f2f3f6';

/**
 * The identity colour a product paints its band with (DESIGN.md §2, One Voice
 * Per Band). Every surface that renders a product band reads the hue through
 * this one function, so a product can never end up with two different colours
 * on two different pages.
 */
export function productHue(product: Product): string {
  return product.hue ?? NEUTRAL_HUE;
}
