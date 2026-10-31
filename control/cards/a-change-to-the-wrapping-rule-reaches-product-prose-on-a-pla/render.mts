// What it does: renders each Markdown body with today's rule (satteri + the tie plugin) and
// compares its visible text with the same body in dist/.
// Run: npx tsx control/cards/<slug>/render.mts
// Settles: whether a test outside Astro can see a build that kept an older rule.
import { readFileSync } from 'node:fs';
import { markdownToHtml } from 'satteri';
import satteriTie from '../../../src/lib/satteri-tie.ts';
const MARK = '\u0001';
const text = (h: string) => h.replace(/<[^>]+>/g, MARK).replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').split(MARK).map((x) => x.replace(/[\n\r\t ]+/g, ' ').trim()).filter(Boolean).join('|');
const pairs: Array<[string, string]> = [
  ['src/content/products/sole-focus.md', 'dist/apps/sole-focus/index.html'],
  ['src/content/products/magic-notes.md', 'dist/apps/magic-notes/index.html'],
  ['src/content/products/waypost-words.md', 'dist/apps/waypost-words/index.html'],
];
for (const [src, out] of pairs) {
  const md = readFileSync(src, 'utf8').replace(/^---[\s\S]*?\n---\n/, '');
  const { html } = await markdownToHtml(md, { hastPlugins: [satteriTie], features: { gfm: true, smartPunctuation: true } } as never);
  const built = readFileSync(out, 'utf8');
  const parts = [...built.matchAll(/<div class="prose story-prose[^"]*"[^>]*>([\s\S]*?)<\/div>/g)].map((m) => m[1]).join('');
  const a = text(html), b = text(parts);
  console.log(src, a === b ? 'SAME' : 'DIFFER', a.length, b.length);
  if (a !== b) { let i = 0; while (a[i] === b[i]) i++; console.log('  today:', JSON.stringify(a.slice(i - 30, i + 40))); console.log('  dist: ', JSON.stringify(b.slice(i - 30, i + 40))); }
}
