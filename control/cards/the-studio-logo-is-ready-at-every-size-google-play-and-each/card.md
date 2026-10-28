# The studio logo is ready at every size Google Play and each social channel asks for

bump: patch
unproven: each platform's upload screen; nothing was uploaded, and most sizes come from third-party guides, not the platforms

The owner asked for the gem logo in every size Google Play and the social channels require, in one folder, named for each platform. The current rules were read for Google Play, X, Facebook, Instagram, Threads, LinkedIn, YouTube, TikTok, Bluesky, Discord, Reddit, Twitch, Mastodon, Pinterest, GitHub, Telegram and WhatsApp. Only Google Play, X and GitHub came from the platforms' own pages. The rest came from third-party guides that disagree, so each file takes the largest size any of them recommends.

store-assets/icons/icons-platforms-2026-10-28-1327-every-channel/ now holds 1 folder per platform. They contain 22 files in all: the 19 platform files, plus the vector logo and 1024 and 2048 copies for anywhere else. Every file is named metkap-studio-<platform>-<use>-<size>.png. The Google Play developer icon is the 32-bit PNG Play asks for, and its 4096 x 2304 header is a PNG without alpha. Every file was measured: the right size, the mark at 79% of the square, 0 mark pixels outside a circle crop, and the largest square at 80 KB. The README lists each file beside what its platform asks for and the source for that figure.

Nothing on the website changed. The files are rendered from the same master as the site's icons by the batch's own build.cjs.
