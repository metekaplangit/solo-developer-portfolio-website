import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// The site must never promise what a product will never do (2026-09-10).
//
// Every page here once carried at least one of these: "no ads", "no in-app
// purchases", "no subscription", "no tracking", "makes zero network requests",
// "there is no networking code in the application at all". Each was true when it
// was written. None of them is a fact about a product — they are commitments
// about what the studio will never do, and the studio keeps the option to add
// advertising, in-app purchases, subscriptions and network features to any
// future release. A claim like that is also the exact shape consumer-protection
// law treats as deceptive when it is later reversed.
//
// This reads `dist/` rather than the source on purpose. A source scan trips over
// its own explanatory comments — the ones above this line included — and, worse,
// it cannot see a claim assembled at build time from two fields that are
// innocent apart. What a visitor is shown is the only thing that matters here.
//
// THE PRIVACY PAGES ARE EXEMPT, and must stay that way. Apple requires a privacy
// policy that describes what an app does today, and those documents carry a date
// and are revised with the release that changes them. They are statements of
// current fact with a shelf life, not promises.

const DIST = 'dist';
const EXEMPT = ['privacy/'];

/** Phrase, and what it is a promise about. */
const FORBIDDEN: Array<[RegExp, string]> = [
  [/\bno ads\b/i, 'advertising'],
  [/\bad-free\b/i, 'advertising'],
  [/\bno advertising\b/i, 'advertising'],
  [/\bno tracking\b/i, 'tracking'],
  [/\bnothing tracked\b/i, 'tracking'],
  [/\bno analytics\b/i, 'analytics'],
  [/\bno subscription/i, 'subscriptions'],
  [/\bno in-app purchase/i, 'in-app purchases'],
  [/\bno sign-?up\b/i, 'accounts'],
  [/\bno account\b/i, 'accounts'],
  [/\bno cloud\b/i, 'networking'],
  [/\bno sync\b/i, 'networking'],
  [/\bno networking\b/i, 'networking'],
  [/\bno network requests\b/i, 'networking'],
  [/\bzero network requests\b/i, 'networking'],
  [/\bworks offline\b/i, 'networking'],
  [/\bfully offline\b/i, 'networking'],
  [/\bnothing (?:is )?downloaded\b/i, 'networking'],
];

function htmlFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...htmlFiles(full));
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** Visible text plus the meta/JSON-LD a search result shows — never markup. */
function readable(html: string): string {
  return html
    .replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi, ' $1 ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<meta\b[^>]*content=["']([^"']*)["'][^>]*>/gi, ' $1 ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#8202;|&nbsp;|&#160;/g, ' ')
    .replace(/\s+/g, ' ');
}

describe('no page promises what a product will never do', () => {
  const pages = htmlFiles(DIST)
    .map((f) => relative(DIST, f))
    .filter((f) => !EXEMPT.some((e) => f.startsWith(e)))
    .sort();

  it('finds pages to check at all', () => {
    expect(pages.length).toBeGreaterThan(5);
  });

  it.each(pages)('%s carries no such promise', (page) => {
    const text = readable(readFileSync(join(DIST, page), 'utf8'));
    const found = FORBIDDEN.filter(([re]) => re.test(text)).map(([re, about]) => {
      const m = text.match(re);
      const at = text.indexOf(m![0]);
      return `${about}: "${text.slice(Math.max(0, at - 45), at + m![0].length + 45).trim()}"`;
    });
    expect(found, `${page} promises what a product will never do`).toEqual([]);
  });
});
