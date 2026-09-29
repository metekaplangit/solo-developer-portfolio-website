# The home page describes a studio that makes iPhone games as well as Mac apps

bump: patch
screen: @home
screen: @apps
unproven: the App Store button on Waypost Words' band — no store link exists until Apple approves it

With Waypost Words about to go to App Review, the home page still described the
studio as making "small, native Mac software", and its deal promised every
product was "Built for the Mac, not wrapped from something else". Neither is
true of an iPhone and iPad game, and the second is false outright: the game is a
web build inside a Capacitor shell. The lede now says "for Mac, iPhone and iPad",
which is also what its own comment in `site.ts` always asked for (platform
neutral). The deal's first line is now "Personal. Every product is designed,
built and supported by one person." — checkable, and true whatever the platform.

The download button on the home hero and on every catalogue band had "Mac App
Store" written in as its label. The day Waypost Words gets its App Store link,
its band would have read "Mac App Store" on an iPhone game, and the button's
accessible name ("on the App Store") would no longer contain its visible label,
failing WCAG 2.5.3. `downloadLabel()` now names the store the button actually
opens; the two Mac products still read "Mac App Store".

A unit test pins the label for App Store, Mac App Store and no link at all, and
a built-output test pins the new home wording; both were seen red first. The
apps page came out identical apart from image-decoding noise in its screenshots.
