# Wander Words has a product page and a privacy page before it ships

bump: minor
screen: @wander-words
screen: @privacy-wander-words
screen: @apps
screen: @home
screen: @privacy-index
unproven: the two addresses on the live site, checked by fetching them after the push

Wander Words, the studio's iPhone crossword word game, is finished but not
released. The owner needs its addresses to exist now so they can be written into
the game, and a link inside a shipped build cannot be changed afterwards. So it
gets `/apps/wander-words/` and `/privacy/wander-words/` the way Magic Notes got
its pages in STEP-0069: two content files, no component, page or style change.
`status: in-development` with no store links already renders "Not yet
available", and the avatar draws a monogram in place of the icon nobody has
chosen yet.

Everything on both pages was read from the game's own project on 2026-09-22 and
nothing there was changed. The features restate its README and code. The policy
restates its storage keys, its iOS privacy manifest (no collected data, no
tracking), and the absence of any network, analytics, advertising or purchase
code. It is marked draft, is scoped to the build as it stands before release,
and overrides two default sections: children, because the game is written for
players of all ages and the default says it is not directed at children; and
changes, which says plainly it is revised with any release that changes what the
game does with data. The owner's notes plan AdMob, and that release would have to
rewrite this page. No price, store link, release date, screenshot, icon, fit
statement or maker's note is claimed. The hue `#C6B4E8` is sampled from the
lavender edge of the lettered tile on the game's newest icon.

The fast lane could not run for any card: `npm audit --omit=dev` failed on
devalue 5.8.1 (issue 0001). `npm audit fix --omit=dev` moved it to 5.9.4 inside
Astro's own range, a 3-line lockfile change; it also pruned the dev tools from
`node_modules`, so `npm ci` put them back from the lockfile. Closes issue 0001.
The route tables in the screen suite, the capture script and CLAUDE.md now name
the two new routes, and the content and built-output suites pin the release
state and both addresses.
