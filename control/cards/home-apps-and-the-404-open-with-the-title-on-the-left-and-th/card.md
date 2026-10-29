# Home, Apps and the 404 open with the title on the left and the intro on the right

bump: patch
screen: @home
screen: @apps
screen: @not-found

Card A of plan 0009, from pick 1 of retouch-project 0003. Home, Apps and the 404
all opened on the left only, leaving the top-right of the first screen empty —
16.7% of it on Home, 13.7% on Apps, 50.9% on the 404 — while About already
opened on two sides. Closes issue 0011.

One shared rule now does it: `.opening` in `global.css`, About's five tracks at
64rem and up. The kicker and title span the first three, the lede and actions
sit in the fifth, standing on the title's last line. Below 64rem nothing moves.
Home's hero entrance selectors follow the new nesting, reduced motion unchanged.
The 404 gets a display-size title, its code as a sans label rather than mono,
and the section links as ruled rows with a chevron, so none sits alone on a
phone. Measured on this build at 1440: Home's largest first-screen empty region
16.7% → 9.0%, Apps 13.7% → 5.4%, the 404 50.9% → 33.3% (40.4% → 10.5% at 390).

The 404's half of issue 0010 came with it: the code label carried a tighter
leading than every other page's kicker, so its first line sat 2–3 px high (48
px below the header at 1440 against 50–51). It now sets as the kickers do, 50
px. A new `@every-route` test reads the first line of text on every route at
every width off the text's own box and fails any route more than 1 px from the
shared line; seen red on the 404 with the old leading (5 widths, 48 vs 51 and
32 vs 35), green with the fix. `/privacy/` is listed in it as issue 0010, which
stays open for that half, and the test fails the day the privacy page agrees.

Closes issue 0011
