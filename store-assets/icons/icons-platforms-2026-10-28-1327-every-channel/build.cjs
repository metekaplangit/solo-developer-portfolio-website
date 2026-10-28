// Renders the MetKap Studio logo for every platform from master/gem.svg and master/google-play-header.svg.
// Run from the repository root: node store-assets/icons/<this batch>/build.cjs
// Settles: every platform file comes from one master, at the size that platform asks for.
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const gem = path.join(dir, 'master/gem.svg');
// [folder, file, size, alpha] — alpha true writes a 32-bit PNG (opaque alpha channel), as Google Play asks.
const jobs = [
  ['google-play', 'metkap-studio-google-play-developer-icon-512.png', 512, true],
  ['x', 'metkap-studio-x-profile-photo-400.png', 400],
  ['facebook', 'metkap-studio-facebook-page-profile-720.png', 720],
  ['instagram', 'metkap-studio-instagram-profile-320.png', 320],
  ['threads', 'metkap-studio-threads-profile-320.png', 320],
  ['linkedin', 'metkap-studio-linkedin-company-logo-400.png', 400],
  ['youtube', 'metkap-studio-youtube-channel-profile-800.png', 800],
  ['tiktok', 'metkap-studio-tiktok-profile-1000.png', 1000],
  ['bluesky', 'metkap-studio-bluesky-avatar-1000.png', 1000],
  ['discord', 'metkap-studio-discord-server-icon-512.png', 512],
  ['reddit', 'metkap-studio-reddit-profile-avatar-256.png', 256],
  ['reddit', 'metkap-studio-reddit-community-icon-500.png', 500],
  ['twitch', 'metkap-studio-twitch-profile-800.png', 800],
  ['mastodon', 'metkap-studio-mastodon-avatar-400.png', 400],
  ['pinterest', 'metkap-studio-pinterest-profile-400.png', 400],
  ['github', 'metkap-studio-github-organization-avatar-500.png', 500],
  ['telegram', 'metkap-studio-telegram-channel-photo-640.png', 640],
  ['whatsapp', 'metkap-studio-whatsapp-business-profile-1080.png', 1080],
  ['universal', 'metkap-studio-logo-1024.png', 1024],
  ['universal', 'metkap-studio-logo-2048.png', 2048],
];
(async () => {
  for (const [folder, file, size, alpha] of jobs) {
    fs.mkdirSync(path.join(dir, folder), { recursive: true });
    let img = sharp(gem, { density: Math.max(300, Math.ceil(size / 1024 * 72 * 1.5)) }).resize(size, size).flatten({ background: '#15161a' });
    if (alpha) img = img.ensureAlpha();
    await img.png({ compressionLevel: 9 }).toFile(path.join(dir, folder, file));
  }
  await sharp(path.join(dir, 'master/google-play-header.svg'), { density: 300 }).resize(4096, 2304)
    .flatten({ background: '#15161a' }).png({ compressionLevel: 9 })
    .toFile(path.join(dir, 'google-play', 'metkap-studio-google-play-developer-header-4096x2304.png'));
  fs.copyFileSync(gem, path.join(dir, 'universal', 'metkap-studio-logo.svg'));
  console.log(jobs.length + 2, 'files written');
})();
