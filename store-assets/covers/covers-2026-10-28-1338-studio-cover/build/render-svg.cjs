// Renders the vector pieces the cover uses (the gem mark and the 3 category tiles) to PNG.
// Run: node render-svg.cjs   (from the repo root or anywhere; paths are absolute)
// Settles: every vector reaches the layout at full size, never a scaled-up bitmap.
const path = require('path');
const fs = require('fs');
const repo = path.resolve(__dirname, '../../../..');
const sharp = require(path.join(repo, 'node_modules/sharp'));
const out = path.join(__dirname, 'parts');
fs.mkdirSync(out, { recursive: true });

// The gem without its tile, so it sits on the cover's own ground.
const gem = fs.readFileSync(path.join(repo, 'public/favicon.svg'), 'utf8')
  .replace(/<rect width="1024" height="1024" fill="url\(#m3bg\)"\/>/, '');

const jobs = [
  ['gem-mark.png', Buffer.from(gem)],
  ['cat-games.png', fs.readFileSync(path.join(__dirname, 'glyphs/games.svg'))],
  ['cat-apps.png', fs.readFileSync(path.join(__dirname, 'glyphs/apps.svg'))],
  ['cat-websites.png', fs.readFileSync(path.join(__dirname, 'glyphs/websites.svg'))],
];
(async () => {
  for (const [name, svg] of jobs) {
    await sharp(svg, { density: 288 }).png().toFile(path.join(out, name));  // drawn straight at 4096, so every size is a clean average of many pixels
  }
  console.log('rendered', jobs.length);
})();
