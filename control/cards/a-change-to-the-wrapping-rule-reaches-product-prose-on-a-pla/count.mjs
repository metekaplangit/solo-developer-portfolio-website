// What it does: counts "your" followed by a non-breaking space in the built Sole Focus page.
// Run: node control/cards/<slug>/count.mjs
// Settles: whether a word added to tie() reached the Markdown prose in dist/.
import { readFileSync } from 'node:fs';
const html = readFileSync('dist/apps/sole-focus/index.html', 'utf8');
const tied = (html.match(/\byour( |&nbsp;|&#160;|&#xa0;)/gi) || []).length;
const loose = (html.match(/\byour /gi) || []).length;
console.log(`tied ${tied}  loose ${loose}`);
