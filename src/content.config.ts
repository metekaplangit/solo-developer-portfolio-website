// Astro content collections wiring. Schemas live in ./content/schema.ts so they
// can be unit-tested without the Astro runtime. See docs/DATA_STORAGE.md.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { productSchema, privacyPolicyEntrySchema } from './content/schema';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: productSchema,
});

const policies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/policies' }),
  schema: privacyPolicyEntrySchema,
});

export const collections = { products, policies };
