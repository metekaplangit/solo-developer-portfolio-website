// Schema.org (JSON-LD) builders for SEO + AI-answer-engine discoverability.
// Deliberately truthful: `offers` is emitted only for released products with a
// declared price and an actionable store link (added in the STEP-0027 release
// pass); `aggregateRating` is still never emitted — we have no rating data, and
// fabricating either would violate both Google's structured-data guidelines and
// this project's honesty rules.
import { site } from './site';
import { PLATFORM_LABELS } from './products';
import { withBase } from './url';
import type { Product } from '../content/schema';

// Single source of truth for the canonical origin: `site` in astro.config.mjs,
// which Astro exposes as import.meta.env.SITE. Do NOT hardcode the domain here —
// canonical/OG/sitemap URLs already derive from the same config, and a second
// copy would silently keep emitting the old host after a domain change.
const ORIGIN = (import.meta.env.SITE ?? 'https://metkapstudio.com').replace(/\/+$/, '');

/**
 * Absolute-URL helper (schema.org expects fully-qualified URLs).
 * Routes internal paths through `withBase()` so JSON-LD agrees with the hrefs
 * actually rendered on the page when the site is served under a sub-path
 * (the GitHub Pages project-site fallback documented in astro.config.mjs).
 */
function abs(path: string): string {
  return path.startsWith('http') ? path : `${ORIGIN}${withBase(path)}`;
}

const publisher = { '@type': 'Organization', name: site.name, url: abs('/') } as const;


export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: abs('/'),
    logo: abs('/icon-512.png'),
    description: site.description,
    founder: { '@type': 'Person', name: site.person },
    sameAs: site.social.map((s) => s.url),
    email: site.supportEmail,
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: abs('/'),
    description: site.description,
    publisher,
  };
}

/**
 * SoftwareApplication (or VideoGame) for a single product. Truthful subset only —
 * see file header re: omitted rating. `offers` is emitted only for a released
 * product with a declared price and a store link a visitor can act on now (the
 * "release pass" the header defers to): anything less would fabricate data.
 */
export function softwareApplicationSchema(product: Product, description?: string) {
  const isGame = product.type === 'game';
  const store = product.storeLinks.find((l) => l.status === 'available');
  const offers =
    product.status === 'released' && product.price != null && store
      ? {
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: store.url,
          },
        }
      : {};
  return {
    '@context': 'https://schema.org',
    '@type': isGame ? 'VideoGame' : 'SoftwareApplication',
    name: product.name,
    description: description ?? product.summary,
    applicationCategory: isGame ? 'GameApplication' : 'ProductivityApplication',
    operatingSystem: product.platforms.map((p) => PLATFORM_LABELS[p] ?? p).join(', '),
    url: abs(`/apps/${product.slug}/`),
    ...(product.icon ? { image: abs(product.icon.path) } : {}),
    ...(product.features.length ? { featureList: product.features } : {}),
    ...offers,
    publisher,
  };
}

/** BreadcrumbList from an ordered list of {name, path}. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

/** ItemList for the apps-and-games catalog page. */
export function itemListSchema(products: Product[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Apps & Games',
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: abs(`/apps/${p.slug}/`),
    })),
  };
}
