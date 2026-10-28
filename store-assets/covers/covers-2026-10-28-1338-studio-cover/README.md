# MetKap Studio cover — one file per platform

The studio cover picked on 2026-10-28, laid out again for each platform that takes a banner, header or cover. On the left are the gem, the name and "Small studio. Serious craft." Next to them are 3 tiles for games, apps and websites. Behind them is a tilted line of real Waypost Words phone screens, fading into the dark. `all-sizes.png` shows every file at once.

No picture here was generated. The tiles are SVG drawn for this cover (`build/glyphs/`), the gem is the site's own `public/favicon.svg`, and every screenshot is the studio's own, from `src/assets/waypost-words/screenshots/`.

Rebuild every file and check it:

    cd store-assets/covers/covers-2026-10-28-1338-studio-cover/build
    node glyphs/make-glyphs.cjs && node render-svg.cjs
    python3 platforms.py && python3 prove.py && python3 overview.py

## How each size is made

- **One background everywhere.** Every file uses the Google Play background, scaled to fill its width and trimmed top and bottom, so the same phones show at the same relative size, none repeated. The text and tiles are placed again for each shape (`platforms.py`).
- **The front stays in the safe box**: the part every device shows, clear of any profile photo drawn over the banner.
- **The text and the tiles are placed separately.** The gem and the name hold the far left of the safe box. The 3 tiles stand over the screenshots, at the master's 73.5% across, pulled in only where the safe box ends sooner.
- **16:9 files keep the master's proportions**; wider banners let the front grow, because they show small.
- `prove.py` measures every file: exact size, no alpha, under the platform's file limit where a source gave one, and the front inside the safe box. It exits 1 on any failure.

## Files

| Platform | File | Size | Safe box used | What the platform asks for | Source |
| --- | --- | --- | --- | --- | --- |
| Google Play | google-play/metkap-studio-google-play-developer-header-4096x2304.png | 4096 x 2304, 24-bit PNG | whole picture | developer page header 4096 x 2304, JPG or 24-bit PNG, no alpha; no file limit or crop stated | [Play Console Help](https://support.google.com/googleplay/android-developer/answer/6226441?hl=en) (official) |
| YouTube | youtube/metkap-studio-youtube-channel-banner-2560x1440.jpg | 2560 x 1440 | centre 1546 x 423 | 2560 x 1440, up to 6 MB; 1546 x 423 shows on every device | [havecamerawilltravel](https://havecamerawilltravel.com/youtube-banner-size/), [async](https://async.com/blog/youtube-banner-size/) (third-party) |
| Facebook | facebook/metkap-studio-facebook-page-cover-1702x630.jpg | 1702 x 630 | middle 62% of the width | shown at 820 x 312 on desktop and 640 x 360 on phones, which cut the sides; 1702 x 630 is twice the 851 x 315 canvas | [ContentStudio](https://contentstudio.io/blog/facebook-cover-photo-size), [Snappa](https://snappa.com/blog/facebook-cover-photo-size/) (third-party) |
| X | x/metkap-studio-x-header-1500x500.jpg | 1500 x 500 | top 64%, above the profile photo | 1500 x 500, 3:1 | [Linearity](https://www.linearity.io/guide/social-media-image-sizes) (third-party; X's own help page refused the fetch) |
| Bluesky | bluesky/metkap-studio-bluesky-banner-3000x1000.jpg | 3000 x 1000 | top 64%, above the profile photo | 3:1; guides say 1500 x 500 to 3000 x 1000, about 1 MB | [socialk.it](https://socialk.it/en/sizes/bluesky-banner-size), [PostEverywhere](https://posteverywhere.ai/blog/bluesky-image-sizes) (third-party) |
| Mastodon | mastodon/metkap-studio-mastodon-header-1500x500.jpg | 1500 x 500 | top 64%, above the profile photo | downscaled to 1500 x 500; PNG, JPG, GIF or WEBP up to 2 MB | [Mastodon docs](https://docs.joinmastodon.org/user/profile/) (official) |
| LinkedIn | linkedin/metkap-studio-linkedin-page-cover-1512x256.jpg | 1512 x 256 | right of the logo, from 15% | Page cover 1512 x 256, minimum and recommended; PNG or JPEG up to 3 MB | [LinkedIn Help](https://www.linkedin.com/help/linkedin/answer/a563309) (official) |
| Twitch | twitch/metkap-studio-twitch-profile-banner-1200x480.jpg | 1200 x 480 | middle 84% | profile banner 1200 x 480 is the most cited; up to 10 MB | [Moda](https://moda.app/resources/sizes/twitch-banner), [Snappa](https://blog.snappa.com/twitch-banner-size) (third-party, disagree) |
| Reddit | reddit/metkap-studio-reddit-banner-1600x480.jpg | 1600 x 480 | middle 88% | community banner 1600 x 480 is the most cited; one guide says 500 KB | [Moda](https://moda.app/resources/sizes/reddit-banner) (third-party, disagree) |
| Discord | discord/metkap-studio-discord-server-banner-960x540.png | 960 x 540 | below the server name at the top | server banner 960 x 540, 16:9 | [Discord Help](https://support.discord.com/hc/en-us/articles/360028716472), as quoted by search (official; the page refused the fetch) |
| GitHub | github/metkap-studio-github-social-preview-1280x640.jpg | 1280 x 640 | middle 88% | 1280 x 640 ideal, at least 640 x 320, under 1 MB | [GitHub Docs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview) (official) |
| Website | website/metkap-studio-website-link-preview-1200x630.png | 1200 x 630 | middle 88% | the site's own link preview; installed as `public/og-image.png` | this repository's `tests/dist.test.ts` |

Sources were read on 2026-10-28. Earlier guides gave LinkedIn's page cover as 4200 x 700; LinkedIn's own page now says 1512 x 256, and that is what this file follows. Check each platform's upload screen before trusting any one figure.

Measured by `prove.py` on 2026-10-28: all 12 pass. The largest file is the Google Play PNG at 2.7 MB. Every other file is under 400 KB, and each is under every limit a source gave.

## What else is here

- `build/` — the scripts, the 3 tile SVGs, and the rendered parts they need.
- `probe/` — the sheets the design was picked from, kept as the record of the choice. The 3 AI sheets (A–X) were rejected and the cover was built by hand from real screenshots instead. After them come the 21 background options; 21 was picked.
- `all-sizes.png` — every file on one page.
