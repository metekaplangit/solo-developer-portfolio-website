// What it does: lists every text run in dist/ that today's tie() would set differently.
// Run: npx tsx control/cards/<slug>/strict.mts
// Settles: whether "tie(run without its nbsp) === run" holds on a correct build.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { tie, NBSP } from '../../../src/lib/typography.ts';
const MARK = '\u0001';
const out: string[] = [];
const walk = (d: string) => { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) walk(p); else if (n.endsWith('.html')) check(p); } };
function check(p: string) {
  const html = readFileSync(p, 'utf8'); const at = html.indexOf('<body');
  const runs = html.slice(at).replace(/<script[\s\S]*?<\/script>/gi, MARK).replace(/<style[\s\S]*?<\/style>/gi, MARK).replace(/<[^>]+>/g, MARK).replace(/&nbsp;/g, NBSP).replace(/&amp;/g, '&').split(MARK).map((s) => s.replace(/[\n\r\t ]+/g, ' ').trim()).filter(Boolean);
  for (const r of runs) { const t = tie(r.split(NBSP).join(' ')); if (t !== r) out.push(`${p}: ${JSON.stringify(r.slice(0, 80))} -> ${JSON.stringify(t.slice(0, 80))}`); }
}
walk('dist');
console.log(out.length, 'differ'); console.log(out.slice(0, 25).join('\n'));
