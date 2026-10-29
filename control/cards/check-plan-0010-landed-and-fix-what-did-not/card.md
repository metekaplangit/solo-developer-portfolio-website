# Check plan 0010 landed, and fix what did not

bump: patch

Loop card of plan 0010 (`docs/plans/0010-2026-10-29.md`), after cards A to E
closed as v0.63.18 to v0.63.22. Nothing needed fixing; this card changes no
product file.

Read from a clean build (`.astro` and `node_modules/.astro` cleared first):

- A, the 404: the title is "Not found.", the tab title "Page not found — MetKap
  Studio", and the 5 destination rows (Home, Apps & Games, Privacy, Support,
  About) are all there.
- B, About: the heading, introduction (the name still from `site.person`) and
  contact line are as planned; the values grid and Get in touch panel unchanged.
- C, labels: 11 download buttons across Home, Apps & Games and the 3 product
  pages, 0 reading "Download", 0 whose `aria-label` misses its visible label;
  "Privacy details" appears nowhere. Home's "See Magic Notes" is unchanged.
- D and E, same 2 files: both changes are present together on Sole Focus and
  Magic Notes; none of the old feature words remain; the closing line is still
  the last italic paragraph on all 3 product pages. Waypost Words' listing
  words are held by `products.content.test.ts`, which passes.
- Seam C against D: the Get panel's "Privacy policy" link sits under the new
  sentence "The privacy policy says…", one name for one thing.

Measured with the text-project measuring script at 1440 and 390 over the 7
routes: every piece the plan touched, 0 bad breaks and 0 clipped at 1440. At
390, 2 of the 8 Sole Focus feature items wrap to 2 lines, and "Chrono, a
stopwatch / for open‑ended work" is flagged as a stranded phrase start; 390 is
the phone pass, outside the 3 widths the plan held these items to, and every
item wrapped there before. Left as a line. The other 390 flag, in the Magic
Notes story paragraph ("…number bases / and statistics…"), is text no card of
this plan touched. `npm run headless` passed through finish; the 7 screens
photographed at 1440 and 390 and looked at.
