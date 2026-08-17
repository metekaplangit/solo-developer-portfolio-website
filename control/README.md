# How work gets done here

One card, one loop, one file. Everything below fits on this page on purpose — if
it needed a manual, it would be the wrong system.

## The loop

```bash
python3 control/loop.py start "What a user will be able to do"
# build it whole, running check as often as you like
python3 control/loop.py check
python3 control/loop.py finish
```

`start` cuts a branch and makes your workshop. `check` says what would stop the
card closing, in under a second, writing nothing. `finish` runs the tests, works
out the version, commits, merges, tags and pushes — or puts everything back
exactly as it was.

There is a fourth, and it runs once in a project's life:

```bash
python3 control/loop.py detect
```

It reads the project — manifests, lockfiles, folders — and says what this stack
can prove with. Then it writes `control/project.py` from what it found, unless
one is already there, in which case it touches nothing. It runs no command, opens
no browser and boots no device; a wrong guess is a line somebody corrects, never
a suite that ran the wrong thing and said green.

The half worth reading is what it calls **possible**: things the stack can reach
and the project is not reaching. A desktop shell whose screens are drivable and
has no screen suite. A phone shell nobody has opened a simulator against. A
project ran 910 commits proving its behaviour and never once its pixels, and
nothing anywhere said so — that line is what says so.

## The card

```markdown
# What a person can newly do

bump: minor
screen: @a-test-that-opens-that-screen
unrendered: a sound, proved by @a-sound-test
unproven: a real device
control: only on a card that changes the system itself

What you actually did, in your own words. Two or three paragraphs, written for
whoever reads this in a year, not for a machine.
```

A heading, two fields, and prose. That is the whole contract.

- **`bump:`** — `minor` when a user can newly do something, `patch` otherwise.
- **`screen:`** — a screen test that opens something you changed. **Repeatable:
  one line per screen**, as many as the work touched. Leave it out entirely when
  nothing a player sees has changed. It names a *test*, never a picture — pictures
  are the `after/` folder, and the two are different evidence.
- **`unrendered:`** — optional, and repeatable. Say it when your change lives in
  the files a person can look at and is not a change a person can look at: a
  sound, a save format, a constant nothing draws. It buys exactly two things — no
  `screen:` is required and no pictures are — and nothing else moves; the fast
  checks still run complete. Give the reason, because it is carried onto the
  commit. It is trusted, and it has to be: the control cannot look at a screen.
  It is refused beside a `screen:` line, and refused on a card that changed no
  screen file at all, since nothing was going to be asked for.
- **`control:`** — required, and only, on a card that changes one of the four
  system files. One line saying why this change is allowed: the command that
  refused, or that it was asked for. It is carried onto the commit, so the log
  answers "is this control growing for good reasons" without opening a card.
  Nothing else needs it, `control/project.py` included — that is this project's
  answers, not the system.
- **`unproven:`** — optional, and repeatable. One line for each thing nothing
  here could reach: a real device, a native shell, a store review, a sound nobody
  can hear. Each one is carried onto the commit, because a green close otherwise
  reads as everything proven.
- **The prose** — what you actually did, in your own words. A card cannot close
  without it.

Fields are read from the head only, so a sentence beginning `proof:` further down
is a sentence.

## Your workshop

`start` makes `control/cards/<slug>/` and everything about the card lives in it:

```
control/cards/<slug>/
  card.md      the card
  notes.md     what you tried, and what failed
  before/      screens as they were
  after/       screens as they are
```

Put anything in there — a script written to break something, a dump, a
comparison. There is never a decision about where a thing goes.

`before/` is dropped at closing when every screen turned out identical, because
that is two copies of one picture.

**The pictures stay on the machine that took them, and not for ever.** `before/`
and `after/` are gitignored, so they never reach the remote. They are evidence for
whoever is working the card, not history, and Git never forgets a blob once it has
one — a project that pushes screenshots for a few hundred cards is carrying every
one of them for the life of the repository.

So closing a card drops the picture folders of every card past the newest `KEEP`,
and says how many it let go of. Only the pictures, and only the ones Git is not
carrying: every card's own words stay, on disk and on the remote, and a project
that pushed pictures before they were ignored keeps every one of them.

Which cards are the newest `KEEP` comes from Git — the commit that added a card's
`card.md` is the commit that closed it. Never from the disk: a clone or a restore
resets every modification time at once, and a pruner reading those would throw
away whichever the filesystem happened to hand back first.

Nothing about the guard changes: the control looks for the pictures on disk, so a
screen-changing card still cannot close without them.

**A card that changed a screen cannot close without pictures of it.** `after/` is
required, and a picture older than the code it shows is refused as stale — capture
again. Unless the card says `unrendered:`, which is the way out for a change that
lives among the pixels without moving any: seven cards in one sitting once
attached identical pictures to prove nothing had changed, and that is worse than
no evidence — it is a record saying a screen was checked when it was not.

`before/` is not required: it has to be taken before the work starts, and a
card that forgot could never go back for one. The previous card's `after/` is the
before.

## Planning more than one card

Some work arrives as a batch: a review that found six things, an adoption that
wants five refactors, a feature that is genuinely three outcomes.

**Write one plan file. Do not write cards ahead.**

```
docs/plans/0001-2026-08-14.md
```

Take the highest number in the folder, add one, four digits. Three lines at the
top saying what produced it, the date, and what it covers. Then prose: what is
coming, in what order, what depends on what, and what was deliberately left out.

Then work it one card at a time, starting each from the plan as you reach it.

Three things to know about that file:

- **Nothing reads it but you.** The tool does not know it exists, so it can never
  disagree with anything, and nothing can be blocked by it being wrong.
- **It goes stale, and that is the trade.** Finish a card and the plan still says
  it is coming. That is a sentence to ignore, against a roadmap that could stop a
  card from closing.
- **It is prose, not a queue.** Order and reasoning are the point. A list of
  titles is something you already have — it is called `control/cards/`.

**Why cards are not written ahead.** A card is a folder, and `start` refuses a
folder that already exists — deliberately. A planned card and an open card would
look identical on disk, and the difference between "somebody is working on this"
and "somebody thought about this once" is not one to leave to a reading of the
filesystem.

## Before and after

Photograph the screens you are about to change into `before/`, make your change,
photograph them again into `after/`. **However this project takes a picture** —
its own capture script, its screen tests writing PNGs, a headless run you drive
by hand. The control asks for the pictures and never for a particular way of
getting them, because the way is different in every project and a page that named
one would be wrong in the next.

Two rules are worth knowing before you take them:

- **Build first.** A picture of a stale build reports differences your change
  never made.
- **Take it after the code it shows.** A picture older than the code is refused
  as stale, by name, and you will have to take it again.

A screen your project has no way of reaching is a screen nobody can photograph,
so wherever this project keeps the list of what a screen is and how to get to
it, add yours when your change is somewhere new.

## What runs, and when

| Tier | What runs | When |
|---|---|---|
| **Headless** | build, types, lint, every unit test | always, complete, never filtered |
| **Scoped** | all of the above, the screen tests you named, and 3 gone longest without running | when you changed a screen |
| **Whole** | all of the above plus every screen test | never from here — ask for it by name |

A card that touched only `control/`, `docs/` or `reviews/` runs nothing and says
`no tier ran`.

A screen nobody names can go red and stay red while every close prints green.
That is not a worry, it is a thing that happened: 2 of them once did for 6 cards,
and later 3 more were found only because a card happened to reuse their harness.

So a Scoped tier takes 3 of them with it, whichever have gone longest without
running, and a red one refuses the close and says it came from the ledger rather
than from your card. Nothing starves — never-run comes before merely old — and
nothing is held up by the whole backlog, which drains at 3 a card without anybody
deciding to look.

Every close still names what is left, longest first:

```
66 screen(s) this card did not run; longest without — @a-thing (never), @another (1.20.2) — and 61 more
```

That is the price of a Scoped tier, printed rather than argued about.

## When something fails

Three attempts, each naming its theory before the edit. Then research — the exact
message, the official documentation, then what real people hit. Then three more.
No ceiling. The only stop is a round that learned nothing new.

Never make a check pass by weakening it. A test you have not seen fail is not a
test.

## Versions

Worked out from the tags that already exist, never typed. One card, one version,
one annotated tag, and the tag is the card's permanent name. A number that gets
stepped over is reported rather than passed silently.

Main and the tag are pushed together or not at all.

## What this does not have, and why

| Not here | Because |
|---|---|
| A declared scope | It is a guess made before the work exists, and it is wrong by default |
| A roadmap | The branch says what is open; Git says what is done |
| A status file | The branch is the status |
| An ID scheme | The version tag is a better name than `TC-0043` was |
| A retention window for cards | Cards are words; Git keeps them for ever |

## Who owns this control

Nobody. Not the project you are reading it in.

It is worked on wherever the work happens: you are building something, the loop
gets in your way, you fix the loop and carry on building. There is no repository
for it, no home project, and no version of it that is authoritative because of
where it sits. **The newest copy across all your projects is the real one**, and
it is newest because its `CONTROL_VERSION` is highest — nothing else decides.

That gives one straight line and exactly one way to break it. An update is a
copy, not a merge, so two projects both improving `loop.py` is a fork, and
copying either one over the other throws the loser away without saying so.

So the line is kept straight rather than merged: **be on the newest copy before
you change anything.** A project that is behind adopts first and then makes its
change on top, which makes its own copy the newest, which is what the next
project adopts. Finding out is automatic, and a card that changes a system file
while another project is ahead is refused with both versions named.

**Where it looks is worked out, not written down.** A project sits at
`<somewhere>/<heading>/<project>`, so the control walks up two and searches
down two: the place all your headings sit under, every heading in it, and every
project under those. Nothing is named — not the folder, not the headings — so a
heading added tomorrow is searched the same day, and moving or renaming the lot
changes nothing. `SIBLINGS` answers it explicitly for projects kept somewhere
that walk cannot reach, and `()` says look nowhere.

**The number is checked against the files, not trusted.** A version is a promise,
and a promise can be broken by hand: edit `loop.py` without raising
`CONTROL_VERSION` and every project that looks sees a number that agrees and
content that does not. So both sides are fingerprinted — the four system files,
read live, no stored digest to go stale — and two copies calling themselves the
same version while holding different files is refused as its own thing. Almost
always that is this project, mid-change, before the number went up.

The check is a courtesy, not a guarantee. It only sees what is under the one
place it walks up to, and it cannot help at all if you change two controls in
the same afternoon. What saves you then is that every change to this control went through
a card: the reasoning is in `control/cards/`, and the diff is in Git, so
re-applying it onto the other copy is reading one card rather than remembering.

## The bar for changing this

Every control before this one died the same way, and it was not from one bad
decision. It was a hundred reasonable ones — each of them a real improvement,
each worth doing on its own — until half of every week went on the loop instead
of on the thing being built.

So the question before any change to these four files is never *is this
imperfect*. Everything is imperfect, permanently, and that list has no end. It is:

> **Will this make the loop simpler, leaner, faster, or the results better —
> noticeably?**

No is the ordinary answer. Say it in one line and go back to the product.

Yes means the change is surgical: the smallest edit that gets the whole effect,
tested, seen red before it was seen green, and thought about for what it touches
around it as much as for itself. One card, one version, like anything else.

**And adoption is never the moment.** A session that has just updated this control
has all four files open in front of it and will find something — that is what
reading does. `control/UPDATE.md` says what happens to it: a parked line, not a
card. Repairing what the copy itself broke is the exception, because that is the
adoption finishing rather than a change to the control.

**And a rule for whoever is helping.** Do not volunteer imperfections. A control
grows fastest when one side keeps pointing at small true things and the other
keeps agreeing they are worth fixing — that is what half of every week is made
of, and it arrives politely, one reasonable item at a time. If something is
genuinely costing time, say so once, with what it costs. Otherwise it stays
unsaid.

## Updating the control, or putting it in a new project

```
control/
  loop.py        the system                ← replace to update
  test_loop.py   its tests                 ← replace to update
  README.md      this page                 ← replace to update
  UPDATE.md      how to put it in a project ← replace to update
  project.py     this project's answers    ← never touched
  cards/         this project's history    ← never touched
  screens.json   when each screen last ran ← never touched
```

Copy those four files in and the project is on the new control. Nothing local
moves: your answers, your screen ledger and every card you have ever closed stay
exactly where they are.

`control/UPDATE.md` is the procedure for doing that, including the root
instruction files that every adoption forgets.

A project with the system files and no `project.py` at all simply works. Every
answer has one that is true of any repository, so an absent file means all of
them, and `check` says so rather than leaving it to be guessed:

```
  • No control/project.py — running on the ordinary answers, and merging into main
  • No fast checks are configured — HEADLESS is empty, so a card closes here
    having run nothing fast
```

That is the difference between adopting this control and configuring it. Copy
the four files into any Git repository and the next card works; `project.py` is
where a product says what it does *differently*, and a product with no test
runner, no screens and no installer never needs the file at all.

`start` and `check` both say which control you are on:

```
  • Control 2 — card started: A hint lights one word you have not found
```

**What an update never does.** It never touches a finished card. Those are
history, and a control that rewrote them would be rewriting the record of work
nobody can re-run.

## Calibration

`control/project.py` holds everything specific to this project, and it is the only
file in `control/` a different product changes. The system files know none of it.

**Nothing here is required, and the file itself is optional.** Every value has an
answer that holds in any repository, so a control dropped into a bare Git
repository opens a card straight away.

| Value | Answers | Unanswered |
|---|---|---|
| `HEADLESS` | what runs fast and renders nothing | nothing runs, said at every check and close |
| `RENDERED` | how one named screen test runs | no Scoped tier ever runs |
| `RENDERED_TESTS` | where those tests live | no tag can be found by reading |
| `INTERFACE` / `NOT_INTERFACE` | what a person can see, and what only looks like it | nothing is a screen, so no card needs one |
| `PAPERWORK` / `PAPERWORK_FILES` | folders and single files a user would never notice changing | `control/`, `docs/`, and the usual root files |
| `TRUNK` | the branch work merges into | asked of Git: the remote's head, else this branch, else `main` |
| `CHANGELOG` | where product-facing history is kept | `CHANGELOG.md`, created when first written to |
| `INSTALLER` | how a release is stamped and built | nothing is stamped |
| `STAMPED` | the file(s) that installer writes the version into, so a failed close can put it back | nothing to put back |
| `SWEEP` | how many neglected screens ride along with a Scoped tier | 3 |
| `KEEP` | how many cards keep their pictures on disk | 25 |
| `SIBLINGS` | folders holding your other projects, so this one can tell whether it is behind | worked out by walking up; `()` to look nowhere |

The one that is worth saying out loud: `HEADLESS` empty means a card can close
having run no tests at all. That is a true statement about a folder of documents
and a dangerous one about a product, so it is never quiet — `check` says it, the
close says it, and the sentence is carried onto the commit.

**And it needs Python 3.9 or newer.** `str.removeprefix` is 3.9, so an older one
would die inside a Git call rather than say what was wrong; it now says so on the
first line. Python 3.7 and older cannot be caught this way — the file fails to
parse before any check in it runs.

The control's own tests read `loop.py` back and refuse any product path, any
spelled-out trunk and any message counting steps it cannot see — so the next thing
to leak out of the answers fails the suite rather than quietly matching nothing in
somebody else's project.

Seven more read **these two pages** back against the system: every answer named
here, every travelling file named on both pages, every local file said to stay
put, nobody sent to the wrong file for the answers, and the bar above still on
the page. A page that goes stale
fails the suite now, which is how all of that drifted in the first place.
