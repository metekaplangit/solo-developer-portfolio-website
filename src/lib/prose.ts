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

/**
 * The paragraphs before the first `##` heading, in order.
 */
export function bodyIntro(body: string): string[] {
  return (split(body)[0] ?? '')
    .split(/\n\s*\n/)
    .map(stripProse)
    .filter(Boolean);
}
