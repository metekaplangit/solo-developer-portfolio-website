# The Google Play header uploads under Play Console's 2 MB limit with no visible loss

bump: patch
unproven: Play Console accepting the upload; the owner uploads it by hand

Play Console refused the developer page header: 2,637,458 bytes against "File size must be 2 MB or smaller". The same form's hint says "Up to 1 MB"; the owner said 2 MB is the limit, so that is what `prove.py` now holds it to, in place of the "no limit found" it had.

Every way under the limit was measured against the lossless original. JPEG's best under 2 MB, quality 99 at 4:4:4, was off by 6 shades, on the text itself, and quality 100 was 2.244 MB. A true 24-bit PNG with colours rounded to a step of 2 came to 1.96 MB and moved no pixel by more than 1 shade. But stretching the dark range showed that rounding everything merged the plain gradient's 1-shade steps into coloured 2-shade bands, so the plain gradient now stays exact too, along with the text and tiles, and only the phones are rounded. That is 1,996,186 bytes: 24-bit RGB, no alpha, 4096 x 2304, 44.8% of pixels moved by 1 shade and none by more.

`prove.py` was seen red twice: on the old file for its size, and on the rounded-everything file for a new check that the plain gradient matches the lossless rebuild exactly. It then passed all 12 covers, and Git shows only the Google Play file changed among them.
