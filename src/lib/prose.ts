// Reading structured sections out of a content file's Markdown body.
//
// A product's long description is prose, deliberately: it is the copy the owner
// approved, and duplicating any of it into frontmatter so a page can show it
// would create two sources for one sentence. Instead the page reads the prose
// it needs through here, so every surface quotes the same approved words.
//
// Pure and unit-tested — no Astro, no Markdown renderer. See docs/ARCHITECTURE.md.

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
 * The paragraphs before the first `##` heading, in order.
 */
export function bodyIntro(body: string): string[] {
  return (split(body)[0] ?? '')
    .split(/\n\s*\n/)
    .map(strip)
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
      const text = nl === -1 ? '' : strip((chunk.slice(nl).split('\n_')[0] ?? ''));
      return { title, text };
    })
    .filter((s) => s.title.length > 0 && !exclude.includes(s.title));
}
