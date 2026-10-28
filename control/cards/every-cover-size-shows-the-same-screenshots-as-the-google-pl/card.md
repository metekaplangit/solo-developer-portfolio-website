# Every cover size shows the same screenshots as the Google Play cover, with none repeated

bump: patch
unrendered: public/og-image.png is only read by sites that preview a shared link; no page of the site draws it, and tests/dist.test.ts still holds it at 1200 x 630
unproven: how each platform's upload screen crops its file; nothing was uploaded

The owner saw that the wide covers, LinkedIn most of all, filled their width by drawing a longer line of phone screens. That repeated the same screens and shrank them, so the banner looked like a different picture from the Google Play cover. Every size now uses the Google Play background itself. It is scaled to fill the banner's width and trimmed top and bottom, so each one shows the same phones in the same places, larger on the wide shapes and never repeated.

The text and the 3 tiles are still placed for each shape as before: the text at the far left of what the platform shows, the tiles over the screenshots. The Google Play file is byte for byte unchanged. build/prove.py measured all 12 again: size, no alpha, file limits, and the front inside each safe box. The site's link preview is the new website file, copied byte for byte.
