// The wrapping rule (STEP-0062).
//
// A line of body copy must never end on a stray short word — "…a plain privacy
// page and a" with "real person answering support." beneath it. The reader's
// eye is thrown to the next line holding nothing, and the phrase is split at
// the one point it has no seam.
//
// CSS cannot do this. `text-wrap: pretty` was already applied site-wide and the
// defect was still on every page, because `pretty` only rescues the LAST line
// of a paragraph (an orphan) — it does not look at where the short words fall
// in the middle. Chrome's own documentation says so. The remedy that does work
// is the typographer's one: bind the short word to the word after it with a
// non-breaking space, so the pair wraps as a unit.
//
// Pure and unit-tested — no Astro, no DOM. Applied to Markdown through the
// rehype plugin in `astro.config.mjs`, and to the site's own strings by calling
// `tie()` where they are rendered.

/** U+00A0. Named, because a literal one is invisible in a diff. */
export const NBSP = ' ';

/**
 * Words that must not be left at the end of a line: articles, conjunctions,
 * prepositions, and the short verbs and pronouns that behave like them.
 *
 * Deliberately not "every word under N letters" — "calm", "Mac", "free" and
 * "each" are all short and all perfectly good line endings. What makes a word
 * unusable at a line end is that it points FORWARD to the next word; length is
 * only correlated with that.
 */
const TIE_WORDS = new Set([
  'a', 'an', 'the',
  'and', 'or', 'nor', 'but', 'so', 'yet', 'if', 'as', 'than', 'that',
  'of', 'to', 'in', 'on', 'at', 'by', 'for', 'from', 'with', 'into', 'onto',
  'over', 'under', 'via', 'per',
  'is', 'are', 'was', 'were', 'be', 'been', 'no', 'not',
  // Auxiliaries. They point at the verb that has not arrived yet, so a line
  // ending on one reads as unfinished in the same way an article does —
  // "Each product has / its own privacy policy".
  'has', 'have', 'had', 'can', 'will', 'do', 'does', 'did',
  'it', 'its', 'my', 'your', 'our', 'their', 'his', 'her', 'this', 'these',
  'you', 'we', 'they', 'i',
]);
// Deliberately absent: 'up', 'off', 'out'. They are as often particles closing
// a phrase ("set it up", "find out") as prepositions opening one, and tying a
// particle to the next sentence's first word is a worse break than the one it
// prevents.

/**
 * The longest pair `tie()` will create, in characters.
 *
 * A non-breaking space removes a wrap opportunity, and a long enough unbreakable
 * run overflows a narrow column — the one defect this site never accepts. At
 * 320px the narrowest text column is ~272px, which is ~30 characters at the
 * small body size; 22 keeps a comfortable margin under that.
 */
const MAX_PAIR = 22;

/** A word character for this purpose — letters, digits, and the apostrophes. */
const WORDISH = /[\p{L}\p{N}’'`-]/u;

function isTieWord(word: string): boolean {
  // Leading punctuation is not part of the word — an opening bracket or quote
  // is stripped. Trailing punctuation deliberately is NOT: "…the end of it,"
  // closes a clause, and a word followed by a comma or a full stop is a
  // legitimate place for a line to break.
  const bare = word.replace(/^[^\p{L}\p{N}]+/u, '');
  if (!/^\p{L}+$/u.test(bare)) return false;
  return TIE_WORDS.has(bare.toLowerCase());
}

/**
 * Bind every stray short word to the word that follows it.
 *
 * The match consumes only the left word and the gap, with the right word behind
 * a lookahead. That matters: a global regex that consumed BOTH words would step
 * past the right one, so in "get it to the point" it would examine "get/it" and
 * "to/the" and never once look at "it/to" — every second pair invisible. The
 * lookahead makes the scan see every adjacent pair.
 *
 * Idempotent, so it is safe to apply twice — a string that passes through both
 * the Markdown plugin and a component gets the same result.
 */
export function tie(text: string): string {
  if (!text) return text;

  // `[ \t]` rather than `\s`: a newline is a wrap the author chose, and
  // replacing one would reflow their paragraph. `[^\s]` on the left excludes
  // an existing NBSP, which is what makes this idempotent.
  return text.replace(/([^\s]+)([ \t]+)(?=([^\s]+))/gu, (match, left, _gap, right) => {
    if (!isTieWord(left)) return match;
    // Only the word itself counts toward the pair length, not punctuation
    // trailing it — a full stop cannot cause an overflow on its own.
    const rightWord = right.match(new RegExp(`^${WORDISH.source}+`, 'u'))?.[0] ?? right;
    if (left.length + 1 + rightWord.length > MAX_PAIR) return match;
    return `${left}${NBSP}`;
  });
}

/**
 * The same rule, across an element boundary.
 *
 * `tie()` sees one string, so it cannot help with "…and <strong>Study mode</strong>",
 * where "and" is the last word of one text node and the word it points at lives
 * inside the next element. That is not an edge case in Markdown — bold and
 * links fall mid-sentence constantly, and it was the last defect left on the
 * site after everything else was tied.
 *
 * Takes the text node's value and the first word of whatever follows it, and
 * returns the value with its trailing space bound when the rule applies.
 */
export function tieAcross(value: string, nextWord: string): string {
  const m = value.match(/(\S+)[ \t]$/u);
  if (!m || !nextWord) return value;
  const left = m[1]!;
  if (!isTieWord(left)) return value;
  const rightWord = nextWord.match(new RegExp(`^${WORDISH.source}+`, 'u'))?.[0] ?? nextWord;
  if (!rightWord) return value;
  if (left.length + 1 + rightWord.length > MAX_PAIR) return value;
  return `${value.slice(0, -1)}${NBSP}`;
}
