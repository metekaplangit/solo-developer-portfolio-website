// Renders every size of the MetKap Studio gem from master/gem.svg and master/link-preview.svg.
// Run from the repository root: node store-assets/icons/<this batch>/build.cjs
// Settles: every web and social size comes from one master, none redrawn.
const sharp = require('sharp');
const path = require('path');
const dir = __dirname;
const gem = path.join(dir, 'master/gem.svg');
const jobs = [
  ['web/favicon-16.png', 16], ['web/favicon-32.png', 32], ['web/favicon-48.png', 48],
  ['web/apple-touch-icon-180.png', 180], ['web/icon-192.png', 192], ['web/icon-512.png', 512],
  ['web/icon-maskable-512.png', 512], ['master/gem-1024.png', 1024],
  ['social/avatar-320.png', 320], ['social/avatar-400.png', 400],
  ['social/avatar-500.png', 500], ['social/avatar-800.png', 800],
];
(async () => {
  for (const [out, size] of jobs) {
    await sharp(gem, { density: 600 }).resize(size, size).flatten({ background: '#15161a' }).png().toFile(path.join(dir, out));
  }
  await sharp(path.join(dir, 'master/link-preview.svg'), { density: 300 }).resize(1200, 630)
    .flatten({ background: '#15161a' }).png().toFile(path.join(dir, 'web/og-image.png'));
  console.log(jobs.length + 1, 'files rendered');
})();
