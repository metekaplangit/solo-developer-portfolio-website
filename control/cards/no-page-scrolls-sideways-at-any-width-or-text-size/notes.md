# Notes

- wide.mjs before: 53 page views wider than the window in Chrome, 53 in WebKit (12 sizes x 13 routes).
- Tried (injected CSS, CSP bypassed): body overflow-wrap:anywhere + chip white-space:normal → 0 in Chrome.
  Adding the nav wrap → 0 in both engines.
- capture.mjs pictures do not repeat with nothing changed (page-opening motion); shots.mjs with reduced
  motion and decoded images repeats within 1 shade of 255, so pixdiff ignores differences of 8 or less.
- Old vs new at 1440/390/320: every 320 page is 36px taller (the nav's second row); Waypost Words at 1440
  broke "and something to watch" mid-word in the 15rem label rail → headings keep overflow-wrap:normal
  above 40rem.
