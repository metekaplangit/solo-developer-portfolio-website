# 0024 A header link pressed many times adds extra Back steps

- Severity: medium
- Reach: absurd
- Area: header
- Found by: chaos-project 0001
- Filed: 2026-10-30
- Tried by: —
- Closed by: —

Doubt: likely the browser's own handling of links pressed during a page
change rather than the site; Severity rounded up.

## What happens
Pressing Apps & Games in the header 15 times, 150 ms apart, from the home
page ends on Apps & Games with 4 extra history entries, so Back has to be
pressed several times to return home. 15 presses 50 ms apart add 2; at
0 ms none. A double-click adds none.

## How to see it
Serve `dist/`, open `/`, click the header's Apps & Games link 15 times 150 ms
apart in Playwright, wait 2.5 s, read `history.length` (7; 3 expected).

## What should happen
One Back from Apps & Games returns home however many times the link was
pressed.

## Evidence
- Chrome 156 and WebKit 26.4 alike: history 3, 5 and 7 entries for 0, 50 and 150 ms apart.
- Double-click on 3 links in both engines: history +1 and one Back returns.
