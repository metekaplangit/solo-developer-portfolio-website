# The studio's gem logo fills its tile, so it reads clearly in tabs, on home screens and in link previews

bump: patch
screen: @home
screen: @apps
screen: @not-found
unproven: the home-screen icon on a real iPhone and on an Android launcher's maskable crop
unproven: the link preview as X, LinkedIn, Slack and iMessage actually draw it

The owner kept the gem logo exactly as it was: the same rounded diamond frame, the same stone, the same periwinkle-to-indigo gradient on the same charcoal ground. Only its size changed. The mark filled 55% of its tile and now fills 79.3%, so it holds up at 16 px in a browser tab and in the 28 px header mark. The corners sit 39.6% of the tile from the centre, inside the 40% circle that Android and the social sites crop to. It was measured with 0 accent pixels outside that circle, and centred to 0.3 px.

Every icon the site serves was rendered again from one vector master: favicon.svg, the 16, 32 and 48 favicons, the 180 apple-touch icon, and the manifest's 192, 512 and maskable 512. The link preview was a 1024 square, and sites crop previews to about 1.91:1, which would have cut the top and bottom off the larger diamond. It is now 1200 x 630, with the mark centred at 406 px. The pictures show the header mark larger on home, Apps & Games and the 404 page, and nothing else on those pages moved.

The master, the spec, every size, 4 social profile pictures and the script that renders them all live in store-assets/icons/icons-web-2026-10-28-1320-larger-gem/, with BATCH.md recording how the owner got there.

Two built-output tests now hold this in place. One checks that every icon a page or the manifest names is served at the size it declares; it went red with a 16 px file standing in for the 32. The other checks that the link preview is 1200 x 630; it went red on the old square preview.
