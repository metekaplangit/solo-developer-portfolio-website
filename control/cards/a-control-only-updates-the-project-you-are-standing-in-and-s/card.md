# A control only updates the project you are standing in, and says when it is behind

bump: patch
control: asked for by the owner, after an agent pushed control 19 into another project unasked

Three agents have read `update` as an errand. It takes a path and any project can
be named, so a session that has just improved the control goes round the others
and updates them all. It happened here on 2026-09-10: a loop over 8 projects was
interrupted by hand after the first, which was left with 4 modified files and no
commit. `start` refuses a dirty tree, so the next session to open that project
would have met a refusal it did not cause.

Words were never going to stop it. `UPDATE.md` already said push from the newest
copy, and that sentence is exactly what an agent acts on.

**The errand is removed.** `update` now resolves where the shell is standing and
refuses a target that is neither that folder nor above it, naming the command to
run in the other project instead. Standing in a project means somebody chose to
be there: the session that pays for the update is the session that owns the mess
if it goes wrong, and every other project stays as its own session left it. A
subfolder counts as standing in the project, because nobody runs commands from
the repository root every time.

**And the thing that made the sweep look necessary is gone too.** Being behind
used to surface only on a card that changed a control file — the one moment the
choice has already narrowed to adopt-first or fork. A project that never touched
the control was told nothing at all, which is how this one sat 4 versions behind
for 3 weeks with every command reporting itself healthy. `start` now says it, once,
and prints the exact command with both paths filled in. It costs one directory
sweep per card, which is the thing the rest of the file works to avoid; bought
deliberately, because `start` runs once per card and is already paying for branch,
disk and remote. Anything that goes wrong in the sweep is swallowed — a courtesy
line is never a reason a card cannot start.

`controls_elsewhere` carries the folder now, not just the name, because a notice
that cannot print a runnable command is one somebody has to decode. That widened
its tuple to 4, and the 5 places that unpacked 3 were widened with it.

Of the 7 new tests, 5 were seen red against control 19 first: the foreign target
was not refused, the refusal named no command, `start` looked for nothing newer
and swallowed nothing, and the search carried no path to print. The other 2 —
standing inside the project, and inside a subfolder of it — pass on 19 as well,
because 19 refuses nobody; they guard the new behaviour rather than cover the
bug, and that is worth saying plainly rather than counting them as 7.

One trap found while writing them: a target on an older control gets the files
copied and its tests run, and those tests would be these, which perform updates,
which run tests that perform updates. It hung the machine once here. Every target
in these tests claims a newer version, which stops `update` at "nothing to do" —
far enough to prove everything the tests are about.

`UPDATE.md` section A and the ownership rule in `README.md` are rewritten to match:
the command is run from the project being updated, and nothing on either page now
reads as an instruction to go round the others.

Nothing a visitor to the website can see has changed, and no site file was touched.
`CONTROL_VERSION` goes to 20. It is not pushed anywhere: the other 8 projects keep
control 19 and 14 until each is opened and adopts it.
