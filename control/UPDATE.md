# Putting this control into a project

Instructions for whoever is doing it — a person or an agent. Read the whole page
before touching anything; the last section is the one most often forgotten and the
one that makes the difference.

## Which of the three situations is this?

| The project has | Go to |
|---|---|
| An older version of **this** control | [A](#a-an-older-version-of-this-control) |
| No control at all | [B](#b-no-control-at-all) |
| A **different** control — task cards, a roadmap, a status file, its own scripts | [C](#c-a-different-control) |

## What moves, and what never does

```
control/
  loop.py        the system              ← copied in
  test_loop.py   its tests               ← copied in
  README.md      how to work a card      ← copied in
  UPDATE.md      this page               ← copied in
  project.py     this project's answers  ← NEVER copied over
  cards/         this project's history  ← NEVER copied, NEVER edited
  screens.json   when each screen ran    ← NEVER copied; it is that project's record
```

Four files are the system. Everything else in `control/` belongs to the project it
sits in, and an update that touches either of them has gone wrong.

## An adoption is a copy, and nothing else

Updating puts a fresh control in front of you, and reading it will produce
findings — it always does. Every one of them is out of scope for this session.

- **Change nothing in `control/` but what the copy brings.** Not a wording fix,
  not a tidier rule, not the small obvious bug you just spotted.
- **Park what you found.** One line, wherever this project keeps its notes,
  saying what you saw. It is not a card, and it is not this session's work.
- **Only a finding that actually stopped a card may become work**, and then it is
  its own card, started later, deliberately, from the newest copy.

**That last rule is now enforced rather than requested.** A card changing any of
the four system files cannot close without a `control:` line naming why — the
command that refused, or that it was asked for. It is one honest sentence when
the change is real, and it is unwritable for the change you only noticed while
reading. `control/README.md` has the field.

The loop this closes is a real one: an adoption reads the control, the read finds
something, fixing it makes this copy the newest, the next project adopts it and
finds the next thing. Weeks go that way and the product does not move.

Repairing what the copy itself broke is not a finding — that is finishing the
adoption, and it belongs in the same commit.

---

## A. An older version of this control

One command, run from the project that has the newer control:

```bash
python3 control/loop.py update /path/to/the/older/project
```

It refuses if a card is open there or the tree is dirty, copies the four files,
runs their tests in that project, and asks the new control to read that project's
answers. If either fails it puts the old files back and says why.

Then go to [the root files](#the-root-files-the-step-everybody-forgets).

**Push from the newest copy, always.** This control belongs to no project — it is
worked on wherever the work is, and the highest `CONTROL_VERSION` anywhere is the
real one. An update is a copy rather than a merge, so carrying an older copy over
a newer one throws that project's work away without a word. A project that is
behind adopts first and changes the control afterwards; `control/README.md` has
the whole rule, and a card that changes a system file from behind is refused.

## B. No control at all

1. Copy the four system files into `<project>/control/`, keeping their modes —
   `loop.py` is executable.
2. Run `python3 control/loop.py detect`. It reads the project, says what this
   stack can prove with, and writes `control/project.py` from what it found.
   **Read what it printed**, especially the `Possible —` lines: those are things
   this stack can reach and the project is not reaching yet. Correct anything it
   got wrong; a corrected file stays corrected, because detection never runs over
   one that already exists.
3. **Commit them.** `start` refuses a dirty tree, and the copy is the dirt.

   ```bash
   git add -A && git commit -m "Adopt the control"
   ```
4. Run `python3 control/loop.py start "anything"`. It prints `card started`, and
   this project is on the control.
5. Abandon that trial card: `git switch <trunk> && git branch -D card/anything`
   and delete `control/cards/anything/`.
6. Then [the root files](#the-root-files-the-step-everybody-forgets).

**There is no step for writing answers, and that is the point.** Every value has
one that holds in any repository, so the control works the moment it lands. Write
`control/project.py` when the product has something to say that is not the
ordinary answer — a test runner, screen tests, an installer — and until then do
not write it at all. `control/README.md` has the table, including what each value
means when nobody answers it.

The one worth knowing before the first card: with no `HEADLESS`, a card closes
having run no tests. Every `check` and every close says so, and the sentence goes
onto the commit — but if this product has a test command, that is the one answer
worth writing on day one.

Every step above was run in an empty repository in this order, because the order
this page used to give did not work: it sent you to `start` while the tree was
still dirty, so no trial card was ever created, and then told you to delete a
branch that had never existed.

**Add `__pycache__/` to `.gitignore` if it is not there already.** Running the
control's own tests writes bytecode beside them, and an untracked folder is a
dirty tree, and a dirty tree is what `start` refuses. `loop.py` will not write any
itself — it turns that off before importing anything — but the test run during an
update still can.

**The two hard requirements are Git and Python 3.9.** The branch is the card, the
tag is the version, and the rollback is Git — a folder with no repository cannot
use this. An older Python is refused on the first line rather than failing
somewhere confusing, except 3.7 and below, which cannot parse the file at all.

## C. A different control

The old one is **retired, not merged**. Two systems in one project means two answers
to every question, and the one that loses is whichever the agent read second.

1. Finish or abandon whatever is open in the old system. Nothing half-done survives
   a change of control.
2. Leave its history exactly where it is. Old task cards, roadmaps, status files
   and changelogs are the record of work that was really done — never rewrite them,
   never renumber them, never fold them into `control/cards/`. Move the folder aside
   if you like (`project-control/` → `project-control-retired/`) but do not edit what
   is in it.
3. Delete or disable its scripts, so nothing can be run by habit.
4. Follow **B** to install this one.
5. Then [the root files](#the-root-files-the-step-everybody-forgets).

**Versions carry over.** This control reads the version from the tags that already
exist, so a project at `v4.12.0` under an old system continues at `v4.12.1`.
Nothing is reset and no tag is rewritten.

---

## The root files: the step everybody forgets

An agent working in a project reads its instructions from the **root of the
workspace**, not from `control/`. Every one of these is such a file where it
exists:

```
AGENTS.md      CLAUDE.md      GEMINI.md      .cursor/rules/*.mdc
.github/copilot-instructions.md              CONVENTIONS.md
CONTRIBUTING.md
```

`AGENTS.md` is the one several of them read, so it is the one to get right first.
Two are worth knowing about:

- **`.cursor/rules/*.mdc`, not `.cursorrules`.** The old file is deprecated and is
  silently ignored in Cursor's agent mode — which is the mode that would be
  working a card, so a project relying on it has rules that quietly do not exist.
  An `.mdc` file needs `alwaysApply: true` in its frontmatter to load every time.
- **`.github/copilot-instructions.md`** is the repository-wide one Copilot reads.

Checked against each tool's current documentation in August 2026; both formats
move, so check again rather than trusting this list.

**If those still describe the old system, the agent will follow the old system**,
whatever is sitting in `control/`. One project ran for a month on a contract
nineteen versions out of date for exactly this reason, and every session that
noticed spent a card catching it up.

So in every root instruction file the project has:

1. **Delete** whatever describes the previous way of working — the old commands,
   the old card format, the old roadmap or status rules. Do not leave it as
   history; a reader cannot tell stale instructions from current ones.
2. **Add** this block, unchanged:

```markdown
## How work gets done here

This project is run one card at a time by the control in `control/`.

    python3 control/loop.py start "What a user will be able to do"
    # build it whole, running check as often as you like
    python3 control/loop.py check
    python3 control/loop.py finish

`control/README.md` is the whole of it, on one page: the card, the workshop, the
three testing tiers, and what happens when something fails. Read it before the
first card and you will not need it again.

There is no roadmap, no status file and no task-card ID. The branch is the active
card and the version tag is its permanent name.
```

3. If several of those files exist, put the same block in each. They are read by
   different agents and none of them reads the others.

## One more root file: `.gitignore`

A card's pictures are evidence, not history, and a project that pushes them grows
without anybody noticing. Add these two lines:

```
control/cards/*/before/
control/cards/*/after/
```

Do it at adoption rather than later. Git only applies an ignore rule to paths it
has never seen, so a project that pushes pictures for a while keeps them for ever
— removing them afterwards means rewriting history that has already been pushed.

Whatever is already tracked stays tracked, which is the right way round: it costs
nothing and it rewrites nothing. A project that pushed pictures before adopting
this keeps every one of them, on the remote and on disk — the pruning below only
ever touches files Git is not carrying.

**And they do not pile up.** Closing a card drops the picture folders of every
card past the newest `KEEP`, so a project that runs for years carries a season of
pictures rather than all of them. `KEEP` defaults to 25 and `SWEEP` to 3; answer
either in `project.py` if this product wants different ones. Only the pictures go;
every card's own words stay.

## Check it worked

**Commit the four files first.** `update` leaves them uncommitted on purpose, so
the whole thing can be undone by Git alone — and `start` refuses a dirty tree, so
without this the very next command is a refusal:

```bash
git add -A && git commit -m "Adopt control <n>"
python3 control/loop.py start "A first card here"
python3 control/loop.py check
```

`check` should print which control it is on, what it would run, and what still
stands in the way. Then abandon it:

```bash
git switch <trunk> && git branch -D card/a-first-card-here
```

If that works, the next real card will feel like nothing ever changed — which is
the point.
