// Pure privacy-URL resolution. The canonical privacy URL for a product is stable
// and never depends on fragile query params. See docs/DATA_STORAGE.md.
import type { Product } from '../content/schema';

/**
 * Content id of the site-wide policy. Every other policy entry is per-product.
 * Single source of truth for the sentinel — it used to be a bare `'global'`
 * literal repeated across the lib, the pages, and PolicyArticle.
 */
export const GLOBAL_POLICY_ID = 'global';

/** Stable privacy URL for a product: explicit policy URL, else the global page. */
export function canonicalPrivacyUrl(product: Product): string {
  return product.privacyPolicyUrl ?? `/privacy/${GLOBAL_POLICY_ID}/`;
}

/**
 * Per-product policy entries only (excludes the site-wide overview).
 * Takes collection entries rather than unwrapped `.data`, because that is what
 * the privacy pages actually hold — they need the entry to render and to build
 * the route param.
 */
export function productPolicyEntries<T extends { data: { productId: string } }>(
  entries: T[],
): T[] {
  return entries.filter((e) => e.data.productId !== GLOBAL_POLICY_ID);
}
