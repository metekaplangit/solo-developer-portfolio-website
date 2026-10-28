# Every cover is crystal clear: lossless where the platform allows, with no halo or smudge on the text, gem and tiles

bump: patch
unrendered: public/og-image.png is only read by sites that preview a shared link; no page of the site draws it, and tests/dist.test.ts still holds it at 1200 x 630
unproven: what each platform does to an upload; most of them recompress, and nothing was uploaded

The owner asked that the icons and covers be top quality and sharp, with nothing blurry and no edge artifacts. Both sets were measured. The icons were already clean: every one is drawn straight from the vector at its exact size, byte for byte, so nothing is shrunk and nothing can ring. They were left alone.

The covers had 2 faults. The worse one was saving 9 of them as JPEG at quality 88 to 92 with half-resolution colour. Measured against a lossless rebuild, that left the text, the orange "craft." and the tiles up to 65 shades off, on about 14,700 pixels of the Bluesky cover's front. Every cover is now lossless PNG, which fits every limit any source gave. The exception is Bluesky, whose PNG is 1.02 MB against a ~1 MB limit; it is a 98-quality JPEG with full colour detail, 9 shades off at most. The smaller fault: the gem and tiles were shrunk from 1024 px drawings with a sharpening filter, which left them up to 27 shades off a clean render along their edges. They are now drawn at 4096 and averaged down, which cannot leave a halo, and they land within a few shades of a clean render.

build/prove.py gained a check for this. It rebuilds each cover losslessly and compares the text and tiles: a PNG must match exactly, a JPEG within 16 shades. It was seen failing on the old Bluesky setting (63 shades) before it passed all 12. The site's link preview is the new website file, copied byte for byte.
