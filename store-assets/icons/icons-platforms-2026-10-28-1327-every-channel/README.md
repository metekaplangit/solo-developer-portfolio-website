# MetKap Studio logo — one file per platform

The gem logo picked on 2026-10-28 (see `../icons-web-2026-10-28-1320-larger-gem/`), rendered for Google Play and each social channel at the size it asks for. Every file comes from `master/gem.svg` through `build.cjs`, none is redrawn. Rebuild them all with:

    node store-assets/icons/icons-platforms-2026-10-28-1327-every-channel/build.cjs

## The rule for each size

Where the sources disagree, the file is at the **largest** size any of them recommends. A platform shrinks a big upload cleanly; it blurs a small one.

The mark fills 79% of every square. Nearly every platform crops the picture to a circle, and the mark stays inside it on every file (measured: 0 mark pixels outside the circle).

## Files

| Platform | File | Size | What the platform asks for | Source |
| --- | --- | --- | --- | --- |
| Google Play | google-play/metkap-studio-google-play-developer-icon-512.png | 512 x 512, 32-bit PNG | developer page icon: 512 x 512, 32-bit PNG; icons up to 1024 KB, sRGB | [Play Console Help](https://support.google.com/googleplay/android-developer/answer/6226441?hl=en) (official), [icon spec](https://developer.android.com/google-play/resources/icon-design-specifications) (official) |
| Google Play | google-play/metkap-studio-google-play-developer-header-4096x2304.png | 4096 x 2304, 24-bit PNG, no alpha | developer page header: 4096 x 2304, JPG or 24-bit PNG without alpha | [Play Console Help](https://support.google.com/googleplay/android-developer/answer/6226441?hl=en) (official) |
| X | x/metkap-studio-x-profile-photo-400.png | 400 x 400 | 400 x 400, under 2 MB, shown as a circle | [X Help](https://help.x.com/articles/20823) (official) |
| Facebook | facebook/metkap-studio-facebook-page-profile-720.png | 720 x 720 | guides say 180 at least, up to 720 for high quality; shown as a circle | [Smash Balloon](https://smashballoon.com/ultimate-facebook-cheat-sheet), [PostFast](https://postfa.st/sizes/facebook/profile) (third-party) |
| Instagram | instagram/metkap-studio-instagram-profile-320.png | 320 x 320 | stored at 320 x 320, shown as a circle | [Moda](https://moda.app/resources/sizes/instagram-profile-picture) (third-party) |
| Threads | threads/metkap-studio-threads-profile-320.png | 320 x 320 | 320 x 320; follows the Instagram photo unless set separately | [Linearity](https://linearity.io/blog/threads-size-guide/) (third-party) |
| LinkedIn | linkedin/metkap-studio-linkedin-company-logo-400.png | 400 x 400 | company page logo 400 x 400, at least 268, under 3 MB | [Linearity](https://linearity.io/blog/linkedin-size-guide/), [Figma](https://www.figma.com/resource-library/linkedin-size-guide/) (third-party) |
| YouTube | youtube/metkap-studio-youtube-channel-profile-800.png | 800 x 800 | 800 x 800, shown as a circle | [Snappa](https://snappa.com/blog/youtube-image-sizes/) (third-party) |
| TikTok | tiktok/metkap-studio-tiktok-profile-1000.png | 1000 x 1000 | shown at 200 x 200; guides suggest up to 1000 | [PostFast](https://postfa.st/sizes/tiktok/profile), [Linearity](https://linearity.io/blog/tiktok-size-guide/) (third-party) |
| Bluesky | bluesky/metkap-studio-bluesky-avatar-1000.png | 1000 x 1000 | guides say 400 to 1000; about 1 MB per image | [PostEverywhere](https://posteverywhere.ai/blog/bluesky-image-sizes), [socialk.it](https://socialk.it/en/sizes/bluesky-profile-picture-size) (third-party) |
| Discord | discord/metkap-studio-discord-server-icon-512.png | 512 x 512 | server icon 512 x 512, shown as a circle | [Instasize](https://instasize.com/size-guides/discord/server-icon) (third-party) |
| Reddit | reddit/metkap-studio-reddit-profile-avatar-256.png | 256 x 256 | profile avatar 256 x 256, shown as a circle | [Postiz](https://postiz.com/tools/reddit-photo-resizer) (third-party) |
| Reddit | reddit/metkap-studio-reddit-community-icon-500.png | 500 x 500 | community icon: guides say 256 to 500 | [Moda](https://moda.app/resources/sizes/reddit-community-icon) (third-party) |
| Twitch | twitch/metkap-studio-twitch-profile-800.png | 800 x 800 | guides say 256 or 800 | [Moda](https://moda.app/resources/sizes/twitch-profile-picture) (third-party) |
| Mastodon | mastodon/metkap-studio-mastodon-avatar-400.png | 400 x 400 | 400 x 400 | [socialk.it](https://socialk.it/en/sizes/mastodon-profile-picture-size) (third-party) |
| Pinterest | pinterest/metkap-studio-pinterest-profile-400.png | 400 x 400 | one guide says 165 x 165; 400 gives room | [PostSyncer](https://postsyncer.com/tools/photo-resize/pinterest) (third-party, thin) |
| GitHub | github/metkap-studio-github-organization-avatar-500.png | 500 x 500 | about 500 x 500, under 1 MB | [GitHub Docs](https://docs.github.com/enterprise/2.3/user/articles/setting-your-profile-picture) (official, for personal avatars) |
| Telegram | telegram/metkap-studio-telegram-channel-photo-640.png | 640 x 640 | channel photo 512 x 512 or larger | [Spoki](https://spoki.com/en/blog/the-complete-guide-to-images-in-social-media-whatsapp-facebook-and-telegram) (third-party) |
| WhatsApp | whatsapp/metkap-studio-whatsapp-business-profile-1080.png | 1080 x 1080 | business profile: guides say 640 to 1080, shown as a circle | [Chat Armin](https://chatarmin.com/en/blog/whats-app-image-size-guide), [Moda](https://share.moda.app/resources/sizes/whatsapp-profile-picture) (third-party) |
| Anywhere else | universal/metkap-studio-logo.svg, -1024.png, -2048.png | vector, 1024, 2048 | for any site not listed, press kits and print | — |

Sources were read on 2026-10-28. Only Google Play, X and GitHub came from the platform's own pages; the rest are third-party guides, which disagree with each other. Check a platform's upload screen before trusting any one figure.

The Apple App Store has no developer-page picture, so nothing here is for it. Each app's own icon is made in that app's project.

Every file is well under every size limit found: the largest square is 80 KB, and the Play header is 132 KB.
