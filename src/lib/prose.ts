// Reading structured sections out of a content file's Markdown body.
//
// A product's long description is prose, deliberately: it is the copy the owner
// approved, and duplicating any of it into frontmatter so a page can show it
// would create two sources for one sentence. Instead the page reads the prose
// it needs through here, so every surface quotes the same approved words.
//
// Pure and unit-tested — no Astro, no Markdown renderer. See docs/ARCHITECTURE.md.

import { tie } from './typography';

/** Strip the small amount of inline Markdown that appears in these bodies. */
function strip(s: string): string {
  return s
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/_/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Strip, then apply the wrapping rule (STEP-0062).
 *
 * `tie()` has to come after the stripping: the rule looks at which word follows
 * which, and while the asterisks are still on, "**Pomodoro** sessions" reads as
 * a word beginning with `*`.
 *
 * Used for body text only, never for a section title. Headings already get
 * `text-wrap: balance` (DESIGN.md §3), which solves the same problem better for
 * a short centred string — and a heading that is one tied unit cannot balance.
 */
function stripProse(s: string): string {
  return tie(strip(s));
}

/**
 * Split a body on its `##` headings. The leading `\n` matters: without it a
 * body whose very first line is a heading has no newline before it, the split
 * finds nothing, and the whole document is returned as "intro".
 */
function split(body: string): string[] {
  return `\n${body}`.split(/\n## /);
}

export interface ProseSection {
  title: string;
  text: string;
}

/**
 * The first sentence of a passage.
 *
 * The home page shows three of a product's sections side by side, and the full
 * sections are wildly different lengths — measured 7, 7 and 4 lines, so the
 * third column stopped 74px short of the other two and the row read as
 * lopsided. Shortening the sections themselves is not the fix: they are also
 * the product page's description, where the detail belongs.
 *
 * So the home page takes the opening sentence and the product page keeps
 * everything. That leaves ONE source for each sentence — the rule this module
 * exists to hold — and makes the columns match by writing the three openings to
 * a similar length rather than by truncating with an ellipsis.
 *
 * A boundary is a `.`, `!` or `?` followed by whitespace and a capital, so
 * "e.g." and "2.5" do not split. Text with no boundary is returned whole.
 */
export function firstSentence(text: string): string {
  const m = text.match(/^.*?[.!?](?=\s+\p{Lu})/su);
  return (m?.[0] ?? text).trim();
}

/**
 * The paragraphs before the first `##` heading, in order.
 */
export function bodyIntro(body: string): string[] {
  return (split(body)[0] ?? '')
    .split(/\n\s*\n/)
    .map(stripProse)
    .filter(Boolean);
}

/**
 * Every `## Heading` section of the body as `{ title, text }`, in document
 * order, with `exclude` titles dropped.
 *
 * Implemented by splitting rather than by one multiline regex: a `$` terminator
 * under the `m` flag ends at the first LINE break, which silently truncates a
 * multi-paragraph section to its opening line — a real bug this replaced.
 */
export function bodySections(body: string, exclude: string[] = []): ProseSection[] {
  return split(body)
    .slice(1)
    .map((chunk) => {
      const nl = chunk.indexOf('\n');
      const title = strip(nl === -1 ? chunk : chunk.slice(0, nl));
      // A trailing `_italic closing line_` is a sign-off, not part of the
      // section, so it is cut here rather than shown as body copy.
      const text = nl === -1 ? '' : stripProse((chunk.slice(nl).split('\n_')[0] ?? ''));
      return { title, text };
    })
    .filter((s) => s.title.length > 0 && !exclude.includes(s.title));
}
