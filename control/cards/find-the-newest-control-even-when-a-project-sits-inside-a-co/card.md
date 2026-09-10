# Find the newest control even when a project sits inside a container folder

bump: patch
control: asked for by the owner, after this project was found four versions behind with nothing to say so

This project sat on control 14 for three weeks while six others ran 18, and the
control's own check reported nothing newer anywhere. The check was not wrong so
much as blind: `controls_elsewhere` compared against an empty list and said what
an empty list says.

The cause is one folder. The walk that finds other copies goes up two and down
two, because a project normally sits at `<somewhere>/<heading>/<project>`. This
one sits at `VibeCoding/Sites/PortfolioSite/solo-dev-portfolio-website`, one
deeper, because the repository is a child of the folder that names the product.
So its anchor landed on `Sites/` and it could see nothing outside that shelf —
and the blindness was mutual, because every other project walked down two from
`VibeCoding/` and stopped at `PortfolioSite`, one short of the repository. Neither
side could tell the other was ahead. Measured before the change: this project saw
0 copies, and RecentsApp saw 7 of the 8 that exist.

Two halves, because the two directions have different owners.

The half that is everybody's problem is the descent, and it is fixed in the
system itself. `projects_under` now opens a child that is neither a project nor a
repository — no `control/loop.py`, no `.git` — and treats it as a folder that
names a product. A child holding either is the thing being looked for rather than
a container of it, and is never descended into, which is what keeps this to one
extra listing per container instead of a sweep of every source tree in the way.
Copies are keyed by path now as well, because the place and its headings are both
searched and a heading is reached twice.

The half that is this project's own is its anchor, still one level too low, and
the control already provides the answer for it: `SIBLINGS`, computed from `ROOT`
so moving the tree changes nothing. Answering it needed the guard in `looking_in`
fixed first — it returned the answer before it looked at `here`, so any project
that answered turned this suite red. That cost is why `project.py` carried a
written note from 2026-08-17 saying the answer was tried and backed out the same
hour. The note is now the answer.

Two of the four new tests were seen red against control 18 before the fix: the
nested project was walked past, and an answered `SIBLINGS` overrode a test
pretending to sit elsewhere. The other two guard behaviour the new code
introduces — a repository is looked at rather than opened, and one copy reached
twice is counted once — so they pass either way, and that is worth saying plainly
rather than counting them as bug covers.

After: this project sees all 8 other copies, and the descent reaches this
repository from `Sites/` for every project that walks there. Verified by running
the search from RecentsApp's position and by listing what `projects_under`
returns for `Sites/`.

Nothing a visitor to the website can see has changed, and no site file was
touched. `CONTROL_VERSION` goes to 19, which makes this copy the newest, and it
is pushed out to the other eight projects from here.
