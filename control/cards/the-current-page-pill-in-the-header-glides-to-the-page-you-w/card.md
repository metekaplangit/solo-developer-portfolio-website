# The current-page pill in the header glides to the page you went to

bump: patch
screen: @home
screen: @apps
screen: @about
screen: @support
screen: @not-found
unproven: Safari was not driven; only Chrome (headless, shell mode)

The soft pill behind the current nav item now slides and resizes from the item you left to the one you chose, over 220 ms on the site's `--dur` / `--ease`, instead of cross-fading inside the header. The pill is its own empty `.nav-pill` element behind the label (`view-transition-name: nav-pill`), not the link's background, so only the pill travels and every label stays where it is. Both snapshots fill the moving group (`height: 100%`) so the pill widens without growing taller. Where it has no partner — the 404 has no current item, and Home's item is hidden on phones — it fades on the same 220 ms. The plan said 250 ms; the site's own 220 ms token was used instead of a one-off value.

Freezing the first version mid-flight showed the labels doubling: the current item turning bold widened it and pushed its neighbours, so the header's old and new snapshots disagreed by a few pixels. Every label now reserves its bold width (a hidden, zero-height bold copy in a one-column grid, out of the accessibility tree) with its text centred in it, so nothing in the row moves on a page change and the regular-to-bold cross-fade happens in place. This also ends the small sideways jiggle of the nav that every page change had before. The phone row's fit is unchanged: measured on the live site and on this build, 18 px hidden at 360 wide and 0 from 390 up, both before and after.

Measured with the workshop probe on the built site: Home → Apps, Apps → About and (at 390) Apps → Support each run one 220 ms `nav-pill` group; the settled pill matches its link exactly. Apps → a missing page and (at 390) the brand link to Home run a lone 220 ms fade-out. Reduced motion runs no animation. Pictures at 60 ms into the glide (`mid/`, animations slowed 10×) show the pill between items and every label single and in place. A new built-output test fails any page whose nav carries a pill outside its current item or more than one, seen red on a page given two. In 2 of 19 hops headless Chrome ran no view transition at all, pill or page; the same hops ran it on repeat, so this reads as the harness, not the pill.
