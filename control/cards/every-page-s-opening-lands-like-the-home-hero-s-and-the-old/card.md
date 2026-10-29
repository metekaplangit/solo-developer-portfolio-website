# Every page's opening lands like the home hero's, and the old page leaves first

bump: minor
screen: @home
screen: @apps
screen: @magic-notes
screen: @about
screen: @support
screen: @privacy-sole-focus
screen: @not-found
unproven: Safari's view transition, and Firefox's plain load, were not driven; only Chrome was

Changing page used to cross-fade the two whole pages for 420 ms, so for a moment both pages' text sat on top of each other, and every page except home simply appeared when you arrived from a link. Now the old page alone fades out in 160 ms on a new leaving role (`--dur-leave`, `--ease-in` in global.css), the new page sits under it untouched, and each page's opening lands the way the home hero always has: its parts, marked `data-land="1"` to `"4"` in reading order, rise 12 px and fade in over 420 ms, 60 ms apart. The rule is now one rule in global.css, so the home hero's own copy in index.astro is gone; its timing is unchanged (measured delays 0/60/120/180 ms, settled by 474 ms).

Arriving through a view transition, the opening waits 160 ms for the old page to go. CSS has no lasting signal that a page arrived that way, so a one-line classic inline `pagereveal` listener in BaseLayout adds `vt-in` to the root only when a transition is really running. That is a departure from plan 0011's "CSS only", taken because the alternatives either blocked clicks for the whole rise or played the opening under the leaving page. Astro does not hash `is:inline` scripts, so its hash is listed in astro.config.mjs, and a new built-output test checks that every inline script the site ships is allowed by the policy; it was seen red without the hash and green with it, and on the way it caught its own first pattern wrongly matching the JSON-LD blocks.

Measured with the workshop probe (headless Chrome, shell mode, built site): all 7 kinds of page land in order on direct load; Apps → Magic Notes runs the old page out in 160 ms with the opening starting at 172 ms; with reduced motion on, nothing animates and the opening is fully visible on the first frame. Firefox has no cross-document view transitions, so there it is an ordinary load with the opening's rise.
