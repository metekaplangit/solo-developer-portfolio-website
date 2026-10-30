# Scrolling a site page no longer makes Chrome quit

bump: patch

Plan 0017, card A, from resolve-issues 0001. Closes issue 0013, as not a
defect of the site.

Issue 0013 said headless Chrome quits when the home, Magic Notes or Sole Focus
page is scrolled, and that a plain tall page with no site code scrolls fine.
The second half did not hold up. `scroll.mjs` in this workshop serves `dist/`
and scrolls every route in `scripts/routes.mjs` at 1536 and 414 px, beside two
controls on the same server and launch: a blank page left open, never
scrolled, and a plain 20000 px page scrolled the same way.

With the filed steps (`scrollTo` in 100 px steps, 2 runs) the blank page quit
4 of 4 times, 0.8 to 5.8 s after launch; the plain page 1 of 4; site pages 8 of
48, at random depths and on different pages each run. Scrolled the way a person
does (mouse wheel, 1 run): blank page 2 of 2, plain page 0 of 2, site pages 2
of 24. Chrome 156.0.8078.76 goes away whether or not anything scrolls and
whether or not the site's code is on the page, so this is the machine's
headless Chrome, which art-project 0001 also measured exiting on a blank page.
Nothing on the site changed.

No cheap test: there was no fault in the site to guard. The probe stays here as
the instrument, and its blank-page control is what any future report of this
kind should be held against first.
