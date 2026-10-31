// What it does: the strict rule check, only inside the elements that hold rendered Markdown.
// Run: npx tsx control/cards/<slug>/strict2.mts
// Settles: whether "today's tie() over the run equals the run" holds on a correct build.
import { readFileSync } from 'node:fs';
import { tie, NBSP } from '../../../src/lib/typography.ts';
const MARK = '\u0001';
let n = 0; const out: string[] = [];
for (const s of ['apps/sole-focus', 'apps/magic-notes', 'apps/waypost-words', 'privacy', 'privacy/sole-focus', 'privacy/magic-notes', 'privacy/waypost-words']) {
  const html = readFileSync(`dist/${s}/index.html`, 'utf8');
  for (const m of html.matchAll(/<div class="(?:prose story-prose|policy-lead)[^"]*"[^>]*>([\s\S]*?)<\/div>/g)) {
    const runs = m[1].replace(/<(code|pre)[\s\S]*?<\/\1>/gi, MARK).replace(/<[^>]+>/g, MARK).replace(/&nbsp;/g, NBSP).replace(/&amp;/g, '&').split(MARK).map((x) => x.replace(/[\n\r\t ]+/g, ' ').trim()).filter(Boolean);
    for (const r of runs) { n++; const t = tie(r.split(NBSP).join(' ')); if (t !== r) out.push(`${s}: ${JSON.stringify(r.slice(0, 90))}\n   -> ${JSON.stringify(t.slice(0, 90))}`); }
  }
}
console.log(n, 'runs,', out.length, 'differ'); console.log(out.slice(0, 20).join('\n'));
