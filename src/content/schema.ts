// Content contracts (the deterministic content model).
//
// These Zod schemas are the single source of truth for product and policy
// shape. They are defined here — separate from `src/content.config.ts` and from
// any Astro runtime — so they can be imported and unit-tested in isolation.
// See docs/DATA_STORAGE.md (owner) and docs/ARCHITECTURE.md.
import { z } from 'astro/zod';

/** A link to a product on an external store or platform. */
export const storeLinkSchema = z.object({
  store: z.enum([
    'app-store',
    'mac-app-store',
    'google-play',
    'steam',
    'github',
    'web',
    'other',
  ]),
  url: z.url(),
  status: z.enum(['available', 'coming-soon', 'unavailable']).default('available'),
  countryOrRegionLimit: z.string().optional(),
  notes: z.string().optional(),
});
export type StoreLink = z.infer<typeof storeLinkSchema>;

/** An image/media asset with required alt text and provenance. */
export const mediaAssetSchema = z.object({
  id: z.string().min(1),
  productId: z.string().min(1),
  type: z.enum(['icon', 'screenshot', 'hero', 'logo', 'press']),
  path: z.string().min(1),
  altText: z.string().min(1, 'every media asset requires alt text'),
  dimensions: z
    .object({
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    })
    .optional(),
  source: z.string().optional(),
  licenseOrOwnership: z.string().min(1),
});
export type MediaAsset = z.infer<typeof mediaAssetSchema>;

export const PLATFORMS = [
  'ios',
  'ipados',
  'macos',
  'android',
  'windows',
  'linux',
  'web',
  'steam',
] as const;

export const PRODUCT_STATUSES = [
  'planned',
  'in-development',
  'beta',
  'released',
  'archived',
] as const;

/**
 * A single app or game. `longDescription` is supplied by the Markdown body of
 * the content file, so it is not part of the frontmatter schema.
 */
export const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase kebab-case'),
  type: z.enum(['app', 'game']),
  status: z.enum(PRODUCT_STATUSES),
  summary: z.string().min(1).max(200),
  platforms: z.array(z.enum(PLATFORMS)).min(1),
  storeLinks: z.array(storeLinkSchema).default([]),
  supportUrl: z.string().default('/support/'),
  privacyPolicyUrl: z.string().optional(),
  screenshots: z.array(mediaAssetSchema).default([]),
  icon: mediaAssetSchema.optional(),
  features: z.array(z.string()).default([]),
  // Store price as a plain decimal string (e.g. "0", "4.99"), USD. Only set once
  // the product is actually purchasable/downloadable — it drives the truthful
  // `offers` JSON-LD emitted for released products (see lib/schema.ts).
  price: z
    .string()
    .regex(/^\d+(\.\d{2})?$/, 'price must be a plain decimal string like "0" or "4.99"')
    .optional(),
  // Verified system requirement shown beside the download CTA (e.g. "macOS
  // 10.15 or later"). Only set from a confirmed source (the live store
  // listing); optional so unreleased products degrade gracefully.
  requirements: z.string().min(1).optional(),
  // "For you if / Not for you if" pair (taste-round T2). Both must be present
  // to render; claims must restate existing truthful content (e.g. the
  // not-a-blocker FAQ answer), never introduce new capabilities.
  fitFor: z.string().min(1).optional(),
  fitNotFor: z.string().min(1).optional(),
  // First-person maker's note paragraphs opening the description (taste-round
  // T5). Published only with the maker's explicit approval of the exact copy.
  makerNote: z.array(z.string().min(1)).default([]),
  // One short, truthful privacy line for the first-glance facts row (e.g.
  // "Works offline — no account, no cloud, no tracking"). Must restate claims
  // already made (and tested) in the product's policy/content — never new ones.
  privacyFacts: z.string().min(1).optional(),
  releaseDate: z.coerce.date().optional(),
  lastUpdated: z.coerce.date().optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  featured: z.boolean().default(false),
});
export type Product = z.infer<typeof productSchema>;

/**
 * A privacy policy entry. `productId` is `'global'` for the site-wide overview,
 * or a real product id for a per-product policy. Prose lives in the Markdown
 * body.
 */
export const privacyPolicyEntrySchema = z.object({
  productId: z.string().min(1),
  title: z.string().min(1),
  lastUpdated: z.coerce.date(),
  dataCollected: z.array(z.string()).default([]),
  // Apple 5.1.1(i): all USES of collected data. Empty is fine when nothing is
  // collected.
  dataUse: z.array(z.string()).default([]),
  dataNotCollected: z.array(z.string()).default([]),
  thirdPartyServices: z.array(z.string()).default([]),
  // Data kept locally on the user's device (rendered as bullets in the
  // "keeping & deleting" section). Empty when nothing is stored.
  storedLocally: z.array(z.string()).default([]),
  // Optional device permissions the app may request (each a short "Name — why"
  // line), rendered as a bulleted "Permissions" section when present.
  permissions: z.array(z.string()).default([]),
  // Apple 5.1.1(i): retention/deletion policy AND how to revoke consent /
  // request deletion. REQUIRED so an incomplete policy fails the build. Keep it
  // short — one or two sentences on how the user deletes / requests deletion.
  retention: z
    .string()
    .min(1, 'Apple requires a data retention/deletion + how-to-request-deletion statement'),
  // Whether the product has user accounts. Apple 5.1.1(v) requires in-app
  // account deletion when accounts exist; the page surfaces a deletion note.
  hasAccounts: z.boolean().default(false),
  contact: z.string().min(1),
  effectiveScope: z.string().min(1),
  reviewStatus: z.enum(['draft', 'reviewed', 'published']).default('draft'),
});
export type PrivacyPolicyEntry = z.infer<typeof privacyPolicyEntrySchema>;
