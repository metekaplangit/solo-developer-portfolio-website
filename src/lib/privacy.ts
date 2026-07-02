// Pure privacy-URL resolution. The canonical privacy URL for a product is stable
// and never depends on fragile query params. See docs/DATA_STORAGE.md.
import type { Product, PrivacyPolicyEntry } from '../content/schema';

/** Stable privacy URL for a product: explicit policy URL, else the global page. */
export function canonicalPrivacyUrl(product: Product): string {
  return product.privacyPolicyUrl ?? '/privacy/global/';
}

/** The per-product policy entry, or undefined if the product uses the global one. */
export function policyForProduct(
  policies: PrivacyPolicyEntry[],
  productId: string,
): PrivacyPolicyEntry | undefined {
  return policies.find((p) => p.productId === productId);
}

/** Per-product policies only (excludes the global overview). */
export function productPolicies(policies: PrivacyPolicyEntry[]): PrivacyPolicyEntry[] {
  return policies.filter((p) => p.productId !== 'global');
}
