# A shared link to the site shows the studio cover: the gem, the name and the games, apps and websites it makes

bump: patch
unrendered: public/og-image.png is only read by sites that preview a shared link; no page of the site draws it, and tests/dist.test.ts still holds it at 1200 x 630
unproven: how each platform's upload screen crops its file; nothing was uploaded, and most safe areas come from third-party guides
unproven: what Facebook, X, LinkedIn and the rest actually show when a link to the site is shared; their caches were not refreshed

The owner asked for a cover in every size Google Play, the social channels and the website use. The design was picked across 3 rounds and 21 backgrounds. On the left are the gem, "MetKap Studio" and the site's own headline, with "craft." in the site's orange. Beside them are 3 tiles drawn for this cover: a games controller, an apps grid and a browser window. Behind them is a line of tall Waypost Words phone screens, tilted 9 degrees and fading into the dark. Screens with a yellow board or a large caption were left out. No picture was generated: the tiles are hand-drawn SVG, and every screenshot is the studio's own.

store-assets/covers/covers-2026-10-28-1338-studio-cover/ holds 12 files, 1 per platform. Each is laid out again from its parts for that platform's shape, never cropped. The lockup and tiles are kept inside what the platform shows on every device, and clear of the profile photo that X, Bluesky, Mastodon and LinkedIn draw over the bottom left. At the owner's request the text and the tiles are placed separately. The gem and name always hold the far left of that area. The 3 tiles stand on their own over the screenshots, at the master's 73.5% across, pulled in only where a safe box ends sooner. build/prove.py measured every file: the exact size, no alpha, under each file-size limit a source gave, and the lockup and tiles inside the safe box. It was first seen failing 3 times: on an unsourced file-size limit, and on a gem and on tiles that rounded past Facebook's safe edge. All 3 were fixed. The README lists each size beside its source.

The website's link preview was the gem alone. It is now the same cover at 1200 x 630, copied byte for byte from the batch's website file.
