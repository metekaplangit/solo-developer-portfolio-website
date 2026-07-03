// Schema.org (JSON-LD) builders for SEO + AI-answer-engine discoverability.
// Deliberately truthful: no `offers`/price or `aggregateRating` are emitted for
// products that aren't released — fabricating them would violate both Google's
// structured-data guidelines and this project's honesty rules. Those fields get
// added in the release pass, at which point the app page becomes eligible for
// the SoftwareApplication rich result.
import { site } from './site';
import type { Product } from '../content/schema';

const ORIGIN = 'https://metkapstudio.com';

/** Absolute-URL helper (schema.org expects fully-qualified URLs). */
function abs(path: string): string {
  return path.startsWith('http') ? path : `${ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}

const publisher = { '@type': 'Organization', name: site.name, url: `${ORIGIN}/` } as const;

/** Map our internal platform ids to human OS names for `operatingSystem`. */
const OS_NAMES: Record<string, string> = {
  macos: 'macOS',
  ios: 'iOS',
  ipados: 'iPadOS',
  windows: 'Windows',
  android: 'Android',
  linux: 'Linux',
  web: 'Web',
  steam: 'Steam',
};

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: `${ORIGIN}/`,
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
    url: `${ORIGIN}/`,
    description: site.description,
    publisher,
  };
}

/**
 * SoftwareApplication (or VideoGame) for a single product. Truthful subset only —
 * see file header re: omitted offers/rating.
 */
export function softwareApplicationSchema(product: Product, description?: string) {
  const isGame = product.type === 'game';
  return {
    '@context': 'https://schema.org',
    '@type': isGame ? 'VideoGame' : 'SoftwareApplication',
    name: product.name,
    description: description ?? product.summary,
    applicationCategory: isGame ? 'GameApplication' : 'ProductivityApplication',
    operatingSystem: product.platforms.map((p) => OS_NAMES[p] ?? p).join(', '),
    url: abs(`/apps/${product.slug}/`),
    ...(product.icon ? { image: abs(product.icon.path) } : {}),
    ...(product.features.length ? { featureList: product.features } : {}),
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
