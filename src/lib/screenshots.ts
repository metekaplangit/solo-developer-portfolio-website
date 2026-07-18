// Resolve a content-collection screenshot path to the imported image asset that
// `astro:assets` needs for build-time optimization.
//
// Content stays the source of truth: a product's `screenshots[].path` holds a
// bare filename (e.g. `01-one-quiet-app.png`) plus its alt text and order. The
// actual bytes live under `src/assets/**/screenshots/` (NOT `public/`) so Astro
// can generate responsive WebP at build time. This module eagerly imports every
// such asset and maps it by filename so a page can look the metadata up.
import type { ImageMetadata } from 'astro';

const modules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/screenshots/*.{png,jpg,jpeg,webp,avif}',
  { eager: true },
);

const byFile = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(modules)) {
  const file = path.split('/').pop();
  if (file) byFile.set(file, mod.default);
}

/** Look up the imported image metadata for a `screenshots[].path` (or filename). */
export function resolveScreenshot(pathOrFile: string): ImageMetadata | undefined {
  const file = pathOrFile.split('/').pop();
  return file ? byFile.get(file) : undefined;
}

/**
 * Humanize a screenshot filename into a short display title for the gallery
 * transcript (STEP-0032): strip directory, extension, and any leading order
 * prefix ("01-"), replace dashes, capitalize the first letter.
 * "01-one-quiet-app.png" -> "One quiet app".
 */
export function screenshotTitle(pathOrFile: string): string {
  const file = pathOrFile.split('/').pop() ?? pathOrFile;
  const base = file.replace(/\.[a-z0-9]+$/i, '').replace(/^\d+[-_]/, '');
  const words = base.replace(/[-_]+/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}
