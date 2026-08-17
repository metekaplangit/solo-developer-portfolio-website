#!/usr/bin/env python3
"""One card, one loop, one file.

Three commands. `start` cuts a branch and writes a card. `check` says what would
stop that card closing, in under a second, writing nothing. `finish` runs the
tests, works out the version, commits, merges, tags and pushes — or puts
everything back exactly as it was.

What is deliberately absent, because it was measured and found to cost more than
it gave: a declared scope, a roadmap, a status file, an ID scheme, and a command
that checks the tool's own parts agree. **The branch is the active card, and the
version tag is the card's permanent name.** Nothing else has to be kept in sync
with anything, which is the whole point.

Cards themselves are kept for ever; their *pictures* are not. Those are gitignored,
so they live on one machine and nowhere else, and a project with a thousand cards
would carry gigabytes of screenshots nobody will open again. `KEEP` sets how many
cards keep theirs.

The one rule here that is not a command is the loop itself, and it lives in the
project's own instructions: a failing check gets 3 attempts each naming its
theory, then research, then 3 more, with no ceiling.

Changing this file
------------------
It is copied verbatim into every project that uses this control, so a fact about
one project written here arrives everywhere as a lie. Four things have to hold,
and the tests beside this file hold three of them — read the failure, not this
paragraph, because a rule with teeth is worth more than a rule on a page:

  - It names no project. `ProjectIndependence`, `TheSystemNamesNoProject`.
  - It runs one tool, Git, and takes every other command from `project.py`.
    `TheControlRunsOneTool`.
  - A new answer defaults rather than raises, and `CONTROL_VERSION` goes up, or
    `update` will not carry the change into anything. `TheAnswersThatHaveDefaults`.

The fourth is the one no test can answer, so it is the one to actually ask:
**does this make the control bigger, and is that worth it?** This system is small
on purpose — a card is a heading, two fields and prose — and every gate that
earns its place makes the next one easier to wave through.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import sys
import time
import types
import unicodedata
from pathlib import Path

#: The oldest Python this control runs on, said out loud rather than discovered.
#:
#: `str.removeprefix` and `str.removesuffix` arrived in 3.9 and are used where a
#: tag or a branch name is trimmed. On 3.8 this file parses perfectly and then
#: dies with an `AttributeError` somewhere inside a Git call, which reads like a
#: bug in the project rather than a Python that is too old.
#:
#: The honest limit of this check: 3.7 and older fail to *parse* — the walrus in
#: `problems` is a syntax error — and nothing written inside a file can catch
#: that, because the whole file is parsed before any line of it runs. Catching
#: those would need a second file to launch this one, which is more machinery
#: than the case is worth.
NEEDS_PYTHON = (3, 9)
if sys.version_info < NEEDS_PYTHON:
    print(
        f"FAIL :: this control needs Python {'.'.join(str(part) for part in NEEDS_PYTHON)} or newer, "
        f"and this is {'.'.join(str(part) for part in sys.version_info[:3])}.",
        file=sys.stderr,
    )
    raise SystemExit(1)

# Nothing this tool imports leaves a `.pyc` behind.
#
# Not tidiness. Importing `project.py` writes `control/__pycache__/`, an untracked
# folder is a dirty tree, and a dirty tree is what `start` refuses — so a project
# that had just adopted this control could never open its first card, and every
# command it ran to find out why made the folder again. The projects that survived
# it had `__pycache__/` in `.gitignore` already and never knew. Measured at about
# eight milliseconds an invocation, against a `check` that takes over a second.
sys.dont_write_bytecode = True

sys.path.insert(0, str(Path(__file__).resolve().parent))

ROOT = Path(__file__).resolve().parent.parent
CONTROL = ROOT / "control"

#: Which control this project is on. Bumped when the system itself changes shape,
#: so any project can be asked what it has and whether it is behind.
CONTROL_VERSION = "14"
CARDS = CONTROL / "cards"
# When each screen last ran, kept beside the cards because it is this project's
# history and not part of the control. It never travels with an update.
LEDGER = CONTROL / "screens.json"

COMMAND = f"{sys.executable} control/loop.py"

BRANCH_RE = re.compile(r"card/[a-z0-9]+(?:-[a-z0-9]+)*")
VERSION_RE = re.compile(r"v(\d+)\.(\d+)\.(\d+)")
BUMPS = ("minor", "patch")

# ---------------------------------------------------------------------------
# Everything specific to this product lives in `control/project.py`, so this file
# can be replaced wholesale to update the control and nothing local is lost.
# ---------------------------------------------------------------------------
try:
    import project

    ANSWERED = True
except ModuleNotFoundError as missing:
    if missing.name != "project":
        raise
    # No answers is not a broken project. It is a Git repository with this control
    # just dropped into it, and that has to work on the spot — otherwise the first
    # thing anybody does with a system whose whole promise is "one card, one loop"
    # is spend an afternoon configuring it, and then fixing the control until the
    # configuration is accepted. That loop cost more days than the control saved.
    #
    # So every answer below has a default that is true of any repository, and an
    # absent file simply means all of them. `project.py` is where a product says
    # what it does *differently* — a test runner, a screen runner, an installer —
    # and a product with none of those never needs the file at all.
    project = types.SimpleNamespace()
    ANSWERED = False


def answer(name: str, default: object) -> object:
    """One calibrated answer, or a default when this project's file predates it.

    `from project import NEW_THING` was how this used to read, and it meant that
    adding a single answer to the control raised `ImportError` in every project
    that had not hand-edited its own file — a crash with a traceback, on every
    command, from an update that was supposed to be instant.

    The file's own promise was already the opposite: *a value left empty is refused
    the first time it is needed, by name*. A missing value is now simply an empty
    one, and `calibrated()` refuses it in those words.
    """
    return getattr(project, name, default)


CHANGELOG = answer("CHANGELOG", ROOT / "CHANGELOG.md")
HEADLESS = answer("HEADLESS", [])
INSTALLER = answer("INSTALLER", None)
INTERFACE = answer("INTERFACE", ())
NOT_INTERFACE = answer("NOT_INTERFACE", ())
#: What a person would never notice changing, in any repository there is.
#:
#: These two used to be empty and required, which made "somewhere to put the
#: control and its notes" a thing every project had to state before it could open
#: a card. They are the same two folders and the same handful of root files in
#: every project this has ever been in; a product that keeps its documents
#: somewhere else says so and its answer replaces these.
PAPERWORK = answer("PAPERWORK", ("control/", "docs/"))
PAPERWORK_FILES = answer(
    "PAPERWORK_FILES",
    {"CHANGELOG.md", "README.md", "AGENTS.md", "CLAUDE.md", "GEMINI.md", ".gitignore", ".editorconfig", ".gitattributes"},
)
RENDERED = answer("RENDERED", [])
RENDERED_TESTS = answer("RENDERED_TESTS", None)
STAMPED = tuple(answer("STAMPED", ()) or ())

#: Where to look for the other copies of this control.
#:
#: The control belongs to no project. It is worked on wherever the work happens,
#: and the newest copy anywhere is the real one — so there is exactly one way to
#: lose an improvement, and it is to make a second one somewhere else. Two
#: projects both editing `loop.py` is a fork, and a fork has to be merged by hand
#: because an update is a copy.
#:
#: So this is where a project looks to find out whether it is behind before it
#: changes anything. Folders, each holding projects: every `*/control/loop.py`
#: under them is another copy.
#:
#: Unanswered — which is the ordinary case — the folders are worked out from
#: where this project sits. See `looking_in`. Answer it with an explicit list
#: where projects are kept somewhere that walk cannot reach, or with `()` to
#: look nowhere at all.
SIBLINGS = answer("SIBLINGS", None)


def looking_in(here: Path | None = None) -> tuple[Path, ...]:
    """The folders to search, worked out at the moment something asks.

    **Why it is worked out rather than listed.** The copy that is ahead is almost
    never on the same shelf. Projects are kept under headings — apps here, games
    there, tools somewhere else — and the control travels between them, so the
    one search that matters is the one that crosses headings. Looking only beside
    this project, which is what the default used to do, could not find any of
    them; and the way round that was to name every heading by hand in
    `project.py`, which missed the seventh heading on the day it was created.

    So the walk is up two and down two. A project lives at
    `<somewhere>/<heading>/<project>`, so two levels up is the place all the
    headings sit under, and everything at this project's own depth beneath it is
    another project. The place itself is included as well as its children, which
    covers a project kept directly under it without needing a rule of its own.

    **Nothing is named.** Not the folder, not the headings. Rename the lot,
    move them to another disk, add a heading tomorrow — the walk finds them,
    because it starts from where this project actually is rather than from
    somebody's memory of the layout.

    **And it is a function rather than a constant on purpose.** The whole reason
    this check is affordable is that a card leaving the control alone never pays
    for it. Worked out while the module loads, it would be a directory sweep on
    every `start`, every `check` and every `finish` — paid by every card, to
    answer a question almost none of them ask.
    """
    if SIBLINGS is not None:
        return tuple(Path(one) for one in SIBLINGS)
    home = (here or ROOT).parent
    try:
        return (home.parent, *sorted(one for one in home.parent.iterdir() if one.is_dir()))
    except OSError:
        # No heading above this one, or it cannot be read. The shelf this project
        # is on is still worth looking at, and is what this used to be.
        return (home,)

#: How many neglected screens ride along with a Scoped tier.
#:
#: Small on purpose. Every one of these is a screen the card did not touch, so
#: every one is time the card pays for somebody else's rot — and a number large
#: enough to hurt is a number somebody turns off. Three costs seconds and drains
#: a long backlog within a few dozen cards.
#:
#: Answered rather than fixed, because what it costs depends on the product: a
#: screen test that takes half a minute is a different bargain from one that takes
#: two seconds. A project that says nothing gets three.
SWEEP = int(answer("SWEEP", 3))

#: How many cards keep their pictures on disk.
#:
#: The pictures are evidence rather than history — they are gitignored, so they
#: live on one machine and are backed up by nothing, and a long-running project
#: would otherwise carry every screenshot it ever took. Only the pictures go;
#: every card's own words stay, on disk and on the remote.
#:
#: Answered rather than fixed for the same reason: a product whose screens are a
#: few kilobytes can afford to keep far more of them than one photographing a
#: phone at three times scale. A project that says nothing keeps twenty-five.
KEEP = int(answer("KEEP", 25))

#: Nothing is required, and that is the whole of it.
#:
#: There used to be three answers a project had to give before it could open its
#: first card — `HEADLESS`, `PAPERWORK` and `TRUNK` — each refused by name until
#: somebody filled it in. Every one of them now has an answer that is true of any
#: repository: the trunk comes from Git, the paperwork is the same two folders
#: everywhere, and no fast checks means no fast checks, said out loud at every
#: check and every close rather than treated as a gap.
#:
#: What that buys is the thing this control kept failing at: it works the moment
#: it lands, so adopting it is a copy and never a debugging session.


def where(path: Path) -> str:
    """A path as somebody would type it, and never an exception.

    `relative_to` raises for anything outside the repository, which turned a
    refusal message into a crash the first time a test handed it a temporary
    folder. A message is the last thing that should fail.
    """
    try:
        return path.relative_to(ROOT).as_posix()
    except ValueError:
        return path.as_posix()


def rendered_tests_prefix() -> str:
    """Where this project's screen tests live, as a repository-relative prefix.

    Derived from the calibrated path rather than written out a second time. A
    One project's own test folder was written out here, in the middle of a rule,
    until somebody asked whether this tool was project-independent. It matched
    nothing in any other project, so the rule silently never applied there.

    Empty when this project answered no path, and the callers ask before they use
    it. `""` cannot be returned instead: every string starts with it, so the one
    rule that reads this would quietly pass for every file in the repository.
    """
    return f"{RENDERED_TESTS.relative_to(ROOT).as_posix()}/" if RENDERED_TESTS else ""


def is_interface(path: str) -> bool:
    """Whether changing this file could change what somebody sees."""
    return path.startswith(INTERFACE) and not path.startswith(NOT_INTERFACE)


class Stop(Exception):
    """Something is wrong and nothing has been written."""


def say(line: str) -> None:
    """One plain sentence about what just happened.

    Everything this tool prints is read by a person, so it reads like something a
    person would say. `PASS validate :: tier=scoped changed_files=8` tells you the
    run happened; it does not tell you what happened, and somebody watching a card
    being worked could not say from it whether the pictures were taken.
    """
    print(f"  \u2022 {line}", flush=True)


def run(command: list[str], timeout: int = 1800) -> subprocess.CompletedProcess[str]:
    """Every command gets a time limit, so nothing hangs for ever."""
    return subprocess.run(command, cwd=ROOT, text=True, capture_output=True, timeout=timeout, check=False)


def git(*args: str) -> str:
    result = run(["git", *args], timeout=120)
    if result.returncode:
        raise Stop(f"git {' '.join(args)} failed: {(result.stderr or result.stdout).strip().splitlines()[-1:] or ['no output']}")
    # Trailing newlines only. Stripping whitespace eats the leading space of the
    # first line of `git status --porcelain`, whose first two columns are the status
    # and may be blank — so the first changed file in every list silently lost its
    # first character — a path beginning `app/` was read as `pp/`, matching nothing.
    return result.stdout.rstrip("\n")


def trunk_from_git() -> str:
    """The branch work merges into, asked of Git rather than of the project.

    Every repository already knows this, and asking it removes the last answer a
    project had to give before it could do anything at all. Three questions, in
    falling order of how much they actually know:

    The remote's own head is the real answer where there is a remote, because it
    is what that repository calls its default branch rather than what this clone
    happens to be sitting on. Failing that, the branch we are on now — but never a
    card branch, which is a branch this control made and would merge into itself.
    Failing that, whichever of the two usual names exists here.

    Placed below `run` rather than up with the other answers because it needs one,
    and worked out only when nobody answered — so a project that names its trunk
    pays nothing for this, which is most of them.
    """
    head = run(["git", "symbolic-ref", "--short", "refs/remotes/origin/HEAD"], timeout=30)
    if head.returncode == 0 and (name := head.stdout.strip()):
        return name.split("/", 1)[-1]
    here = run(["git", "branch", "--show-current"], timeout=30).stdout.strip()
    if here and not here.startswith("card/"):
        return here
    for guess in ("main", "master"):
        if run(["git", "rev-parse", "--verify", "--quiet", guess], timeout=30).returncode == 0:
            return guess
    return "main"


TRUNK = answer("TRUNK", "") or trunk_from_git()


def atomic_write(path: Path, data: bytes, mode: int | None = None) -> None:
    """Written beside the target and moved into place, so an interrupted run never leaves half a file.

    The mode travels with it. A replacement is a *new* file moved over the old
    one, so it arrived with default permissions and `loop.py` came out of an
    update no longer executable. Git tracks that bit, so the tree went dirty by
    itself, and a dirty tree is precisely what `start` refuses — which made the
    first command after an update a refusal with no visible cause.

    Unhanded, the mode of whatever is being replaced is kept. Handed one — which
    is what a copy does — the source's mode wins, so a target that never had the
    bit gets it from the copy that does.
    """
    temporary = path.with_name(f".{path.name}.tmp")
    try:
        temporary.write_bytes(data)
        if mode is None and path.exists():
            mode = path.stat().st_mode
        if mode is not None:
            temporary.chmod(mode)
        temporary.replace(path)
    finally:
        temporary.unlink(missing_ok=True)


def snapshot(*paths: Path) -> dict[Path, tuple[bytes, int] | None]:
    """The bytes and the mode, because putting back only the bytes is not putting back."""
    return {path: (path.read_bytes(), path.stat().st_mode) if path.exists() else None for path in paths}


def restore(saved: dict[Path, tuple[bytes, int] | None]) -> list[str]:
    """Put every file back, and never raise while doing it.

    Whatever broke the close may be the very thing that stops a file being written
    back — an unwritable directory takes the rollback down with it. Raising here
    stopped at the first file and left the rest changed: a probe found the version
    stamp still sitting in the build after a failed close, which is the one thing a
    rollback exists to prevent.

    So each file is tried on its own, and anything that could not be put back is
    named in the refusal rather than left silent.
    """
    survived: list[str] = []
    for path, kept in saved.items():
        try:
            atomic_write(path, kept[0], mode=kept[1]) if kept is not None else path.unlink(missing_ok=True)
        except OSError:
            survived.append(path.name)
    return survived


def slugify(title: str) -> str:
    folded = unicodedata.normalize("NFKD", title).encode("ascii", "ignore").decode().lower()
    slug = re.sub(r"[^a-z0-9]+", "-", folded).strip("-")[:60].rstrip("-")
    if not slug:
        raise Stop("a title needs letters or numbers in it")
    return slug


def branch() -> str:
    name = git("branch", "--show-current")
    if not name:
        raise Stop("detached HEAD is not supported")
    return name


def dirty() -> list[str]:
    # -uall, because a brand-new directory is otherwise reported as one entry — the
    # folder, not the files in it — and the first card ever written vanished from view.
    # `__pycache__` is ignored because the control makes it: importing this
    # project's answers writes it, so the very first command in a fresh project
    # refused with "uncommitted changes" about a folder it had just created.
    return sorted({
        path for path in (line[3:].split(" -> ")[-1] for line in git("status", "--porcelain", "-uall").splitlines() if line)
        if "__pycache__/" not in path and not path.endswith(".pyc")
    })


def is_paperwork(path: str) -> bool:
    return path in PAPERWORK_FILES or path.startswith(PAPERWORK)


def changed_files() -> list[str]:
    """Everything this card has touched, committed or not, against main."""
    against = git("diff", "--name-only", f"{TRUNK}...HEAD").splitlines()
    return sorted(set(against) | set(dirty()))


def has_remote() -> bool:
    """Whether this project has anywhere to publish to at all.

    A project with no remote is an ordinary thing — something local, something not
    shared yet — and closing a card in one used to merge, tag, and then fail telling
    you to push to a remote that does not exist. The card was done; the tool said it
    had failed.
    """
    return run(["git", "remote", "get-url", "origin"], timeout=30).returncode == 0


def remote_ready() -> None:
    """Main must be clean, and level with the remote, before and after the work."""
    if branch() == TRUNK and dirty():
        raise Stop(f"{TRUNK} has uncommitted changes; commit or put them aside first")
    if not has_remote():
        return
    if run(["git", "fetch", "--quiet", "origin", TRUNK], timeout=60).returncode:
        raise Stop("the remote could not be reached; try again when it answers")
    ahead = git("rev-list", "--count", f"refs/remotes/origin/{TRUNK}..{TRUNK}")
    behind = git("rev-list", "--count", f"{TRUNK}..refs/remotes/origin/{TRUNK}")
    if behind != "0":
        raise Stop(f"the remote has {behind} commit(s) {TRUNK} does not; fetch and fast-forward before starting")
    if ahead != "0":
        # Named with its tags, not just as "unpushed commits". A close whose push failed
        # leaves the merge and the tag here and the remote with neither; being told to
        # push main alone would send the commit and strand the tag for ever, which is
        # exactly the promise — both or neither — that the atomic push exists to keep.
        waiting = unpushed_report()
        both = " ".join([TRUNK, *waiting])
        raise Stop(f"{TRUNK} has {ahead} unpushed commit(s)" + (f" and {len(waiting)} unpushed tag(s)" if waiting else "") + f"; send them together: git push --atomic origin {both}")


def unpushed_tags(local: list[str], listed: str) -> list[str]:
    """Which of these local tags the remote has never been given.

    Pure, and separate from the asking, because the asking is a network call and
    this is the part that was wrong. `listed` is the raw output of one
    `git ls-remote --tags origin`.

    An annotated tag is listed twice — the tag object, then `refs/tags/<name>^{}`
    for the commit it points at — and every tag this tool makes is annotated. The
    peel is stripped for tidiness rather than for correctness: the unpeeled line
    is listed too, so the name matches with or without it. Said plainly because
    the obvious guess is that this is load-bearing, and a test written against
    that guess passes no matter which way it is written.

    Order is the caller's, not sorted: it goes straight into a `git push` line
    somebody is meant to run, and a set would hand them a different command every
    time they hit this.
    """
    on_remote = {
        line.split("refs/tags/")[-1].removesuffix("^{}")
        for line in listed.splitlines()
        if "refs/tags/" in line
    }
    return [tag for tag in local if tag and tag not in on_remote]


def unpushed_report() -> list[str]:
    """The tags waiting to go, asked of the remote in a single call.

    It used to ask once per tag. On a project with 127 of them that is 127 network
    round trips — over two minutes — on the one path where somebody is being told
    they forgot to push, which is exactly when they want an answer now. One call
    returns every tag the remote has, and `unpushed_tags` does the rest.

    A remote that cannot be reached leaves every tag looking unpushed, which is
    the safe direction: the message names too many rather than too few, and
    `git push --atomic` is happy to be told about a tag it already has.
    """
    listed = run(["git", "ls-remote", "--tags", "origin"], timeout=60)
    return unpushed_tags(git("tag", "--list", "v[0-9]*").splitlines(), listed.stdout)


def versions() -> set[tuple[int, int, int]]:
    """Every version that exists anywhere, so a number is never reused or guessed."""
    found = {VERSION_RE.fullmatch(tag) for tag in git("tag", "--list", "v[0-9]*").splitlines()}
    listed = run(["git", "ls-remote", "--tags", "origin"], timeout=60)
    if listed.returncode == 0:
        for line in listed.stdout.splitlines():
            ref = line.split("refs/tags/")[-1].removesuffix("^{}")
            found.add(VERSION_RE.fullmatch(ref))
    return {tuple(int(part) for part in match.groups()) for match in found if match}


def on_main() -> tuple[int, int, int]:
    """The highest version this history actually reached."""
    reached = set()
    for tag in git("tag", "--merged", TRUNK, "--list", "v[0-9]*").splitlines():
        if match := VERSION_RE.fullmatch(tag):
            reached.add(tuple(int(part) for part in match.groups()))
    return max(reached, default=(0, 0, 0))


def next_version(bump: str) -> tuple[str, list[str]]:
    """Derived from what exists, never typed by anyone — and it says what it stepped over.

    A tag that exists but is not in this history pushes the next number past it, and
    the jump is silent: v1.16.7 to v1.18.0 reads as something enormous when in fact
    somebody planted a tag. The numbers passed over are named, because a gap nobody
    explains is a gap somebody will explain wrongly later.
    """
    known = versions()
    major, minor, patch = max(known, default=(0, 0, 0))
    nxt = (major, minor + 1, 0) if bump == "minor" else (major, minor, patch + 1)
    while nxt in known:
        nxt = (nxt[0], nxt[1], nxt[2] + 1)
    here = on_main()
    wanted = (here[0], here[1] + 1, 0) if bump == "minor" else (here[0], here[1], here[2] + 1)
    stepped = []
    if wanted != nxt:
        stepped = sorted("v{}.{}.{}".format(*one) for one in known if wanted <= one < nxt)
    return "v{}.{}.{}".format(*nxt), stepped


def workshop_for(name: str) -> Path:
    """The card's own folder — everything about it lives here and nowhere else.

    A card is a loop, and a loop needs somewhere to work: the screens before and
    after, a script written to break something, notes on what was tried and failed.
    All of it was going to a shared folder that the next card overwrote, or to a
    temporary directory that was gone by morning, so the evidence behind every
    finding was thrown away as soon as it was written down.

    One folder per card means there is never a decision about where something goes.
    """
    if not BRANCH_RE.fullmatch(name):
        raise Stop(f"{name} is not a card branch; start a card, or switch to the one you are working on")
    return CARDS / name.removeprefix("card/")


def card_for(name: str) -> Path:
    return workshop_for(name) / "card.md"


def prune_before(workshop: Path) -> bool:
    """Drop `before/` when nothing moved, so the repository only carries pictures worth looking at.

    A before-and-after where nothing changed is two copies of the same thing, and
    keeping both for every card would put tens of megabytes of duplicate screens
    into the history for no reader.
    """
    before, after = workshop / "before", workshop / "after"
    if not (before.is_dir() and after.is_dir()):
        return False
    names = {path.name for path in before.iterdir()} | {path.name for path in after.iterdir()}
    if any(not (before / name).is_file() or not (after / name).is_file() or (before / name).read_bytes() != (after / name).read_bytes() for name in names):
        return False
    for path in sorted(before.iterdir()):
        path.unlink()
    before.rmdir()
    return True


# A card is a heading, then its fields, then prose. The fields are read from the
# head alone — everything before the first blank line that follows them — because
# reading the whole file means a sentence beginning "proof: reloading was what
# settled it" is read as the card's proof. That exact bug bit the old system six
# times in a month, and this rebuilt it on the first day.
HEAD_RE = re.compile(r"(?ms)\A#[^\n]*\n(.*?)(?:\n\s*\n|\Z)")


def head_of(text: str) -> str:
    match = HEAD_RE.match(text)
    return match.group(1) if match else ""


def entries(text: str, key: str) -> list[str]:
    """Every line in the head with this key, in the order they were written.

    A card may name more than one thing it could not prove, and they are separate
    facts rather than a sentence with commas in it: each one ends up on its own
    line of the commit, where somebody reading `git log` a year from now can see
    them one at a time.
    """
    return [value.strip() for value in re.findall(rf"(?m)^{key}:[ \t]*(.*)$", head_of(text))]


def field(text: str, key: str) -> str:
    match = re.search(rf"(?m)^{key}:[ \t]*(.*)$", head_of(text))
    return match.group(1).strip() if match else ""


def body_of(text: str) -> str:
    """Everything that is not the heading and not the fields."""
    return text.replace(f"#{text.splitlines()[0].lstrip('#')}", "", 1).replace(head_of(text), "", 1).strip() if text.strip() else ""


def tests_carrying(tag: str) -> list[str]:
    """Which rendered tests carry this tag, found by reading the files.

    Read rather than asked of the runner, because the runner takes a second and a
    half to answer and this has to be free enough to run after every edit. The
    runner asks the same question again at closing time; this one only exists so a
    typed tag is caught now instead of after the whole suite has run.
    """
    if not RENDERED_TESTS:
        return []
    found = []
    for spec in sorted(RENDERED_TESTS.glob("*.spec.ts")) if RENDERED_TESTS.is_dir() else []:
        # The title runs to the *matching* quote, not to the first quote of any kind.
        # A title reading "the round's best word ... @a-tag" ended at the apostrophe,
        # so the tag fell outside it and the card was refused for a tag its test had.
        titles = [
            found_title
            for _, found_title in re.findall(TEST_TITLE, spec.read_text(encoding="utf-8"))
        ]
        found += [f"{spec.name}: {title}" for title in titles if tag in title]
    return found


def every_screen() -> list[str]:
    """Every screen tag any test carries, whether or not a card has ever named it.

    The point of the ledger is the screens nobody has named, so the list cannot come
    from the cards. It comes from the tests, which is the only place that knows a
    screen exists at all.
    """
    if not RENDERED_TESTS or not RENDERED_TESTS.is_dir():
        return []
    tags: set[str] = set()
    for spec in sorted(RENDERED_TESTS.glob("*.spec.ts")):
        for _, title in re.findall(TEST_TITLE, spec.read_text(encoding="utf-8")):
            tags.update(re.findall(r"@[a-z0-9][a-z0-9-]*", title))
    return sorted(tags)


def cards_newest_first(most: int | None = None) -> list[str]:
    """The cards Git has seen, newest first, by the commit that closed it.

    `most` bounds how far back to look, and bounding it is the whole reason this
    is fast. Unbounded it walks every commit that ever added a card: 1.5 seconds
    at 1200 cards, growing for ever, paid on every close. Asked for the newest 26
    it is 58 milliseconds and gives the same answer at the front, which is the
    only part anybody uses — the pruner needs to know what to keep, and everything
    else on disk is by definition older.

    Git rather than the disk, and this is the whole reason it is not two lines of
    `sorted(CARDS.iterdir())`. A modification time is reset by a clone, a copy, a
    restore from a backup, or a checkout — so on a fresh clone every card would
    look like it landed at once, and a pruner reading that would take whichever
    the filesystem happened to hand back first. The commit that added a card's
    `card.md` is the commit that closed it, and that ordering is the same on every
    machine for ever.

    A card folder Git has never seen is not in this list at all, which is the
    right answer for one being worked on right now.
    """
    inside = f"{CARDS.relative_to(ROOT).as_posix()}/"
    bound = [f"-n{most}"] if most is not None else []
    listed = git("log", "--diff-filter=A", "--name-only", "--format=", *bound, "--", f"{inside}*/card.md")
    order: list[str] = []
    for line in listed.splitlines():
        path = line.strip()
        if not path.startswith(inside) or not path.endswith("/card.md"):
            continue
        slug = path[len(inside) : -len("/card.md")]
        if slug and "/" not in slug and slug not in order:
            order.append(slug)
    return order


def open_card_slug() -> str:
    """The card being worked on right now, or nothing when no card is.

    The branch is the card, so the branch is the answer. Never raises: this is
    asked while tidying, and a tidy that fails because nobody is on a card branch
    would be refusing to work at the one moment there is nothing to protect.
    """
    try:
        return branch().removeprefix("card/")
    except Stop:
        return ""


def tracked_cards() -> set[str]:
    """Every card Git is carrying the words of, by folder name.

    Cheap where walking the log is not — 22 milliseconds against 1.5 seconds at
    1200 cards, because it reads the index rather than the history.
    """
    inside = f"{CARDS.relative_to(ROOT).as_posix()}/"
    listed = git("ls-files", "--", f"{inside}*/card.md")
    return {
        line.strip()[len(inside) : -len("/card.md")]
        for line in listed.splitlines()
        if line.strip().startswith(inside) and line.strip().endswith("/card.md")
    }


def tracked_under(folder: Path) -> set[str]:
    """Every path Git is carrying beneath this folder, as it names them."""
    listed = git("ls-files", "--", folder.relative_to(ROOT).as_posix())
    return {line.strip() for line in listed.splitlines() if line.strip()}


def prune_workshops(keep: int = KEEP) -> list[str]:
    """Drop the pictures of every card older than the newest `keep`.

    Only the pictures, and only the ones Git is not carrying. A tracked file
    deleted here would show up as a deletion, dirty the tree, refuse the next
    `start`, and reach the remote on the following close — which is the opposite
    of what this is for. Projects that pushed pictures before they were ignored
    keep every one of them.

    Never raises. This runs after a card has already been committed, merged,
    tagged and pushed, and nothing about tidying a folder is worth failing a close
    that has already succeeded.
    """
    dropped: list[str] = []
    try:
        # What to keep, rather than what to drop. Asking for the newest few is
        # bounded work; asking for every card there has ever been is not, and the
        # answer to "is this one of the newest" is the same either way.
        keeping = set(cards_newest_first(keep))
        # And never the card being worked on. "Git has not seen it" used to stand
        # in for "it is open", and the two are not the same: somebody who commits
        # a card as work in progress — an ordinary thing to do — had made theirs
        # prunable. The branch says which card is open, and it says so exactly.
        keeping.add(open_card_slug())
        known = tracked_cards()
        for slug in sorted(one.name for one in CARDS.iterdir() if one.is_dir()):
            if slug in keeping or slug not in known:
                continue
            for name in ("before", "after"):
                folder = CARDS / slug / name
                if not folder.is_dir():
                    continue
                carried = tracked_under(folder)
                for shot in sorted(folder.iterdir()):
                    if shot.is_file() and where(shot) not in carried:
                        shot.unlink()
                # Removed only once it is genuinely empty, so a tracked picture or
                # anything else somebody put there keeps its folder.
                if not any(folder.iterdir()):
                    folder.rmdir()
                    dropped.append(f"{slug}/{name}")
    except Exception:  # noqa: BLE001 - deliberate, and the reason is the next line
        # Anything at all. This runs after the card is committed, merged, tagged
        # and pushed, so the close has already succeeded and there is nothing left
        # to undo — a tidy-up that turned a finished close into a traceback would
        # be the worst trade this tool could make. Narrower than this was not a
        # guarantee: a stress test handed it the wrong argument count and the
        # TypeError went straight past `(OSError, Stop)` and out of the close.
        return dropped
    return dropped


def read_ledger() -> dict[str, str]:
    """What ran when, or nothing at all the first time."""
    try:
        kept = json.loads(LEDGER.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}
    return {tag: str(when) for tag, when in kept.items() if isinstance(tag, str)} if isinstance(kept, dict) else {}


def as_number(version: str) -> tuple[int, ...]:
    """A version as something sortable, and lowest of all when it is not one."""
    parts = version.lstrip("v").split(".")
    try:
        return tuple(int(one) for one in parts)
    except ValueError:
        return (-1,)


def sweeping(named: list[str], most: int = SWEEP) -> list[str]:
    """The screens riding along with this card's own, longest unrun first.

    The neglect line has always printed which screens have gone longest without
    running, and printing turned out not to be catching: three screens in the
    project this control grew up in were red for an unknown number of cards while
    every close said green, and they were found by a card that happened to reuse
    their harness. The list was on screen the whole time.

    So a few of them run. Longest-first, so nothing starves, and only a few, so no
    card is ever held up by the whole backlog — sixty screens drain in twenty
    cards without anybody deciding to look.
    """
    if not RENDERED:
        return []
    waiting = [tag for tag in every_screen() if tag not in named]
    return [tag for tag, _ in longest_unrun(read_ledger(), waiting, most)]


def longest_unrun(kept: dict[str, str], known: list[str], most: int = 5) -> list[tuple[str, str]]:
    """The screens gone longest without running, never-run ones first.

    Never-run beats old on purpose. A screen that has run at some point was at least
    right once; one that has never run has never been true and never been false.
    """
    ranked = sorted(known, key=lambda tag: (as_number(kept[tag]) if tag in kept else (-1,), tag))
    return [(tag, kept.get(tag, "never")) for tag in ranked[:most]]


def neglect_line(lagging: list[tuple[str, str]], waiting: int) -> str:
    """The reminder, worded so 5 names never stand in for an unknown number.

    On a fresh ledger every screen reads "never", and 5 names out of 64 look like
    5 screens. The count carries the weight; the names are only where to start.
    """
    named = ", ".join(f"{tag} ({when})" for tag, when in lagging)
    more = f" — and {waiting - len(lagging)} more" if waiting > len(lagging) else ""
    return f"{waiting} screen(s) this card did not run; longest without — {named}{more}"


def remember_screens(named: list[str], version: str) -> tuple[list[tuple[str, str]], int]:
    """Write down what just ran, and hand back what has gone longest without.

    Written before the commit so it travels with the card that earned it, rather
    than sitting uncommitted and blocking the next start.
    """
    known = every_screen()
    if not known:
        return [], 0
    kept = read_ledger()
    # Read before the write, so the line names what was stale *coming into* this
    # card rather than reporting the screens this card just ran as fresh.
    waiting = [tag for tag in known if tag not in named]
    lagging = longest_unrun({**kept}, waiting)
    kept.update({tag: version for tag in named})
    atomic_write(LEDGER, (json.dumps(dict(sorted(kept.items())), indent=2) + "\n").encode())
    return lagging, len(waiting)


def screen_tests(text: str) -> list[str]:
    """Every screen test this card named, in the order it named them.

    Repeatable, because the rule this serves says so: what the work touched, named
    — one screen, four screens, twenty. The number is never fixed and never the
    limit. A single line was my simplification, and it cost a card that touched
    three screens the record of two of them.
    """
    return [one for one in entries(text, "screen") if one]


def screen_test(text: str) -> str:
    """The screen test this card named, from `screen:`.

    It was called `proof:` until somebody read a card, saw the word proof, and
    asked where the picture was. It never held a picture — it holds the tag of one
    rendered test — but a field called proof in a system that also keeps pictures
    is a field that answers a question nobody asked.
    """
    return field(text, "screen")


def is_the_control_itself(path: str) -> bool:
    """A Python file of the control, which is code however much it looks like paperwork.

    `control/` is paperwork in every project that has calibrated it that way, and
    it should be: a page or a card is not something to run a build for. But the
    control is *in* there, with its own tests, and 5 cards in a row changed it and
    ran nothing at all. A lint error sat in it the whole time.
    """
    here = f"{CONTROL.relative_to(ROOT).as_posix()}/"
    cards = f"{CARDS.relative_to(ROOT).as_posix()}/"
    return path.startswith(here) and not path.startswith(cards) and path.endswith(".py")


def tier_for(changed: list[str], named: list[str]) -> str:
    if any(is_the_control_itself(path) for path in changed):
        # Its own tests run inside the fast checks, so this is how they run at all.
        return "Scoped" if named else "Headless"
    if not changed or all(is_paperwork(path) for path in changed):
        return "none"
    return "Scoped" if named else "Headless"


def removed_from(changed: list[str]) -> set[str]:
    """Which of these paths are gone rather than merely different."""
    return {path for path in changed if not (ROOT / path).exists()}


def problems(card: Path, text: str, changed: list[str], removed: set[str] | None = None) -> list[str]:
    """Everything wrong with this card, all of it, in one pass.

    Gathered rather than raised one at a time. Learning three faults costs three
    laps when each is raised on its own, and every one of them was true from the
    moment the work started.
    """
    found: list[str] = []
    if any(path in {f"control/{name}" for name in SYSTEM_FILES} for path in changed):
        # Every control before this one died of a hundred reasonable improvements,
        # and both pages already said so: *only a finding that actually stopped a
        # card may become work*. Prose could not enforce it, so an adoption read the
        # four files, found something — reading always does — fixed it, and became
        # the newest copy for the next project to adopt and read and find the next
        # thing. That is the loop this field closes.
        #
        # It is trivial to satisfy honestly: name the command that refused, or say
        # it was asked for. What it cannot survive is the change nobody would write
        # a line for, which is exactly the one that should not be happening.
        if not [one for one in entries(text, "control") if one]:
            found.append(
                "this card changes the control and has no `control:` line — say which command refused, "
                "or that it was asked for. A change nobody can name a reason for is the one that "
                "turned every previous control into the work instead of the tool"
            )
        # The control is nobody's. It is worked on wherever the work is, and the
        # newest copy anywhere is the real one — so the only way to lose an
        # improvement is to make a second one somewhere else while this copy is
        # behind. An update is a copy, not a merge, and a copy throws the older
        # side away without saying so.
        if behind := ahead_of_here():
            found.append(
                "this card changes the control and "
                + ", ".join(f"{name} is on {version}" for name, version, _ in behind)
                + f" while this project is on {CONTROL_VERSION} — adopt the newer one here first, "
                "or this change is a fork somebody has to merge by hand"
            )
        elif twins := diverged_from_here():
            # Almost always this project: the control has been edited and the
            # number has not been raised yet, which is the first thing the card
            # was going to have to do anyway. Said as the likely cause, because a
            # message that opens with "somebody, somewhere" is one nobody acts on.
            found.append(
                f"{', '.join(twins)} also calls itself control {CONTROL_VERSION} and holds different files — "
                f"raise CONTROL_VERSION here if this card is the change, or find out which copy is right; "
                "a version that is not raised is a fork nothing can see"
            )
    if not body_of(text):
        found.append("the card has no body — write what you did, in your own words, so the next person is not reading a diff")
    bump = field(text, "bump")
    if bump not in BUMPS:
        found.append(f"`bump:` is {bump or 'empty'} — write minor when a user can newly do something, patch otherwise")
    named = screen_tests(text)
    screens = [path for path in changed if is_interface(path)]
    """
    `unrendered:` — the card's own word that this change is not one you can see.

    Files a person can look at and a change a person can look at are not the same
    thing, and the control only knows the first. A sound, a save format, a name, a
    comment, a constant nothing draws: all of them live in the same folders as the
    pixels, so all of them were asked for a screen test and a photograph of a
    screen that had not moved. Seven cards in one sitting attached identical
    pictures to prove nothing had changed, which is worse than no evidence — it is
    a record that says a screen was checked when it was not.

    So a card may say so instead, and give its reason. It buys exactly two things:
    no `screen:` required, and no pictures required. Nothing else moves. The fast
    checks still run complete, and the reason is carried onto the commit exactly
    as `unproven:` is, because a claim nobody can verify belongs in the history
    rather than in somebody's memory.

    It is trusted, and it has to be — the control cannot look at a screen. That is
    the same trust `unproven:` already runs on, and it is kept honest the same
    way: it is written down, it is permanent, and it is refused where it would be
    a lie about work that plainly did change something.
    """
    unseen = [one for one in entries(text, "unrendered") if one]
    if any(not one for one in entries(text, "unrendered")):
        found.append("`unrendered:` is empty — say why this change is not one a person can see, or take the line out")
    if unseen and named:
        found.append("this card says both `unrendered:` and `screen:` — a card that opens a screen is not an unseen change; drop whichever is untrue")
    if unseen and not screens:
        found.append("`unrendered:` is written but no screen file changed — nothing was going to be asked for, so take the line out")
    if screens and not named and not unseen:
        if not RENDERED:
            # A product with screens and no way to run one. "Name every test that
            # opens what you changed" sends somebody looking for tests that cannot
            # exist; the two answers disagreeing is the thing to say instead.
            found.append(
                f"{len(screens)} screen file(s) changed ({', '.join(screens[:3])}) and RENDERED is empty in "
                "control/project.py, so no screen test can ever run — answer RENDERED, or leave INTERFACE empty "
                "if this product has nothing to look at"
            )
        else:
            found.append(f"{len(screens)} screen file(s) changed and no `screen:` is named ({', '.join(screens[:3])}) — name every test that opens what you changed")
    for one in named:
        if not one.startswith("@"):
            found.append(f"`screen:` is {one} — each line names one screen test by its tag, written as @something")
            continue
        carrying = tests_carrying(one)
        if not carrying:
            found.append(f"no screen test carries {one} — tag the test that opens this screen, or correct the tag")
        elif len(carrying) > 1:
            found.append(f"{len(carrying)} tests carry {one} and one line names one test: {', '.join(carrying)}")
    if len(named) != len(set(named)):
        found.append("the same screen is named twice — each `screen:` line names a different one")
    # A card that writes a screen test changes no screen, and refusing its named
    # screens on that basis meant a new test could never run at the close that added it.
    tests_here = rendered_tests_prefix()
    if named and not any(is_interface(path) or (tests_here and path.startswith(tests_here)) for path in changed):
        found.append(f"{len(named)} screen(s) named but neither a screen nor a screen test has changed — drop the `screen:` lines, or the card is not doing what it says")
    if not changed:
        found.append(f"nothing has changed since {TRUNK} — there is no card here yet")
    # Pictures, enforced rather than remembered. Two cards closed green in one batch
    # with no `after/` at all, because taking them was a step nothing asked for — and
    # the person who wanted to look at them found nothing there.
    #
    # `after/` only. A `before/` has to be taken before the work starts, and a card
    # that forgot could never go back and get one, which is how a good idea becomes a
    # gate people work around. The previous card's `after/` is the before.
    screens = [path for path in changed if is_interface(path)]
    if screens and not unseen:
        shots = sorted((card.parent / "after").glob("*.png")) if (card.parent / "after").is_dir() else []
        if not shots:
            found.append(f"this card changed {len(screens)} screen file(s) and has no pictures of them — capture into {where(card.parent)}/after/ before closing")
        else:
            newest = max((ROOT / path).stat().st_mtime for path in screens if (ROOT / path).exists())
            stale = [shot.name for shot in shots if shot.stat().st_mtime < newest]
            if stale:
                found.append(f"{len(stale)} picture(s) in after/ are older than the code they show ({', '.join(stale)}) — capture them again")
    mine = f"{where(card.parent)}/"
    # A card that names nothing unproven is a card claiming everything was proved,
    # which is usually true and always worth having said on purpose. A blank line is
    # neither: somebody started writing it and stopped.
    if entries(text, "proof"):
        # Silently ignoring it would be worse than refusing: the card would look
        # like it named a screen test and would quietly close as Headless.
        found.append("this card says `proof:` — that field is called `screen:` now, because it names a screen test and never held a picture")
    if any(not one for one in entries(text, "unproven")):
        found.append("`unproven:` is empty — name what nothing here could reach, or take the line out")
    if not any(path.startswith(mine) for path in changed):
        found.append("nothing in the card's own workshop has changed — the card belongs in the commit it describes")
    # Closing does `git add -A`, which sweeps whatever is lying about. A card abandoned
    # by deleting its branch leaves its workshop on disk, and the next card to close
    # published it: a card describing work that never happened, with a version behind it.
    # Tidying somebody else's leftovers is allowed; adding to their card is not. So a
    # removal passes — otherwise the guard would refuse the very cleanup it exists to
    # ask for, which it did on its first run.
    #
    # Handed in rather than read off the disk here, so this decision can be tested
    # without a repository standing behind it. Reading the filesystem inside a rule
    # also made "deleted" and "not written yet" indistinguishable.
    gone = removed_from(changed) if removed is None else removed
    others = sorted({path[len(CARDS.relative_to(ROOT).as_posix()) + 1:].split("/")[0] for path in changed if path.startswith(f"{CARDS.relative_to(ROOT).as_posix()}/") and not path.startswith(mine) and path not in gone})
    if others:
        found.append(f"{len(others)} other card workshop(s) would be swept into this commit: {', '.join(others)} — close them, or delete what is left of them")
    return found


def command_start(args: argparse.Namespace) -> None:
    slug = slugify(args.title)
    workshop = CARDS / slug
    card = workshop / "card.md"
    if workshop.exists():
        raise Stop(f"a card called {slug} already exists; give this one a different title")
    if branch() != TRUNK:
        raise Stop(f"you are on {branch()}; finish that card before starting another")
    # Being on main is not the same as having nothing open. Walking away from a card —
    # switching to main and leaving its branch behind — let a second one start, and a
    # third, with nothing anywhere saying the first was still half-written.
    if open_cards := [name for name in git("branch", "--list", "card/*", "--format=%(refname:short)").splitlines() if name]:
        raise Stop(f"{len(open_cards)} card(s) are still open: {', '.join(open_cards)}; finish one, or abandon it with git branch -D <name>")
    remote_ready()
    target = f"card/{slug}"
    git("switch", "-c", target)
    try:
        workshop.mkdir(parents=True, exist_ok=True)
        atomic_write(card, f"# {args.title}\n\nbump:\nscreen:\n".encode())
    except (OSError, Stop) as exc:
        card.unlink(missing_ok=True)
        if workshop.is_dir() and not any(workshop.iterdir()):
            workshop.rmdir()
        git("switch", TRUNK)
        git("branch", "-D", target)
        raise Stop(f"start put everything back: {exc}") from exc
    say(f"Control {CONTROL_VERSION} — card started: {args.title}")
    say(f"Branch created — {target}")
    say(f"Workshop made — {where(workshop)}/ for the card, its pictures, its notes, anything")
    say(f"Next: write what you did into {where(card)}, then run check as you go")


#: The files that are the system. Everything else in `control/` is this project's.
#: `test_update.py` is deliberately not here. It builds whole projects and updates
#: them, so copying it into a target means the update's own verification runs tests
#: that perform updates — which run tests that perform updates. It hung the first
#: time it was tried. It is the source project's proof that updating works, not
#: something every project needs a copy of.
# A test's title, from its opening quote to the matching one. Named rather than
# inlined so the control's own tests can hold it against a title with an
# apostrophe in it — which is what broke the first version.
TEST_TITLE = r"(?m)^\s*test(?:\.\w+)?\s*\(\s*(['\"`])((?:\\.|(?!\1).)*)\1"

SYSTEM_FILES = ("loop.py", "test_loop.py", "README.md", "UPDATE.md")


def version_of(source: Path) -> str:
    """Which control a folder holds, read from its own source."""
    found = re.search(r'(?m)^CONTROL_VERSION = "([^"]+)"', (source / "loop.py").read_text(encoding="utf-8"))
    if not found:
        raise Stop(f"{where(source)}/loop.py does not say which control it is")
    return found.group(1)


def fingerprint(folder: Path) -> str | None:
    """What the four system files in a folder actually are, as one short digest.

    The version number is a promise, and a promise can be broken by hand: edit
    `loop.py` without raising `CONTROL_VERSION` and every project that checks sees
    a number that matches and content that does not. Nothing would have said a
    word, and the fork would only surface when one copy overwrote the other.

    So the number is checked against the files rather than trusted on its own.
    Read live from both sides — no stored fingerprint, nothing to keep in sync,
    and no way for it to be stale.
    """
    parts: list[bytes] = []
    for name in SYSTEM_FILES:
        try:
            parts.append((folder / name).read_bytes())
        except OSError:
            return None
    return hashlib.sha256(b"\0".join(parts)).hexdigest()[:12]


def controls_elsewhere(here: Path | None = None) -> list[tuple[str, str, str | None]]:
    """Every other copy of this control the search can see, newest first.

    Cheap on purpose: one listing per folder searched, and a regex over one file
    per project found. It is only ever called when a card has actually changed a
    system file, so a project that never touches the control never pays for it.

    `here` is where to pretend this project sits, and only the tests pass it.

    Anything unreadable is skipped rather than raised. This is a courtesy check
    on folders that belong to other projects, and a folder that has been renamed,
    half-copied or is being written to while this runs is not this project's
    problem to report.
    """
    seen: list[tuple[str, str, str | None]] = []
    for folder in looking_in(here):
        try:
            beside = sorted(Path(folder).expanduser().resolve().iterdir())
        except OSError:
            continue
        for project_folder in beside:
            target = project_folder / "control"
            if target == CONTROL or not (target / "loop.py").is_file():
                continue
            try:
                found = re.search(r'(?m)^CONTROL_VERSION = "([^"]+)"', (target / "loop.py").read_text(encoding="utf-8"))
            except OSError:
                continue
            if found:
                seen.append((project_folder.name, found.group(1), fingerprint(target)))
    return sorted(seen, key=lambda one: as_number(one[1]), reverse=True)


def ahead_of_here() -> list[tuple[str, str, str | None]]:
    """The copies that are further along than this one."""
    return [one for one in controls_elsewhere() if as_number(one[1]) > as_number(CONTROL_VERSION)]


def diverged_from_here() -> list[str]:
    """Copies claiming this very version while holding something else.

    The one thing a version number cannot catch about itself. Same number,
    different files: one of the two was edited without the number being raised,
    and until that is settled neither copy can be carried anywhere — whichever
    moves overwrites work that never announced itself.
    """
    mine = fingerprint(CONTROL)
    if mine is None:
        return []
    return [
        name
        for name, version, theirs in controls_elsewhere()
        if version == CONTROL_VERSION and theirs is not None and theirs != mine
    ]


def command_update(args: argparse.Namespace) -> None:
    """Put this control into another project, and leave that project's work alone.

    Pushed rather than pulled, because a project on an older control has no update
    command to pull with — the first adoption of any project would always be a
    hand copy otherwise, which is the thing this exists to stop.

    Three files are the system; everything else in a `control/` folder belongs to
    the project it sits in. So an update is a copy — but a copy that cannot be
    walked back from is not one to run casually, and a newer control may want an
    answer that project has never given.

    So the new one is tried before it is kept: its own tests are run there, and it
    is asked to read that project's answers. Anything short of both puts the old
    files back, untouched.
    """
    there = Path(args.project).expanduser().resolve()
    if there.name == "control":
        there = there.parent
    target = there / "control"
    if not all((target / name).is_file() for name in SYSTEM_FILES):
        raise Stop(f"{there} does not hold a control — expected {'/'.join(('control', SYSTEM_FILES[0]))} and its two companions")
    if target == CONTROL:
        raise Stop("that is this project's own control; point at another project")

    def theirs(*command: str) -> str:
        done = subprocess.run(["git", *command], cwd=there, text=True, capture_output=True, timeout=120, check=False)
        return done.stdout.rstrip("\n") if done.returncode == 0 else ""

    if open_cards := [one for one in theirs("branch", "--list", "card/*", "--format=%(refname:short)").splitlines() if one]:
        raise Stop(f"{len(open_cards)} card(s) are open there: {', '.join(open_cards)}; finish or abandon them before changing the control under them")
    if theirs("status", "--porcelain", "-uall").strip():
        raise Stop(f"{there.name} has uncommitted changes; commit them so this update can be undone by Git alone")

    was, now = version_of(target), CONTROL_VERSION
    say(f"{there.name} is on control {was}; this one is control {now}")
    if int(now) <= int(was):
        say("Nothing to do — that project is already on this control or newer")
        return

    saved = snapshot(*(target / name for name in SYSTEM_FILES))
    for name in SYSTEM_FILES:
        source = CONTROL / name
        # The source's mode, not the target's: an update is a copy, and a copy of
        # an executable file is executable. A target that had lost the bit gets it
        # back from the copy rather than keeping its own broken answer.
        atomic_write(target / name, source.read_bytes(), mode=source.stat().st_mode)
    say(f"Copied {', '.join(SYSTEM_FILES)} — that project's answers and cards were not touched")

    tested = subprocess.run([sys.executable, "-m", "unittest", "discover", "-s", str(target), "-p", "test_*.py"], cwd=there, text=True, capture_output=True, timeout=300, check=False)
    loads = subprocess.run([sys.executable, str(target / "loop.py"), "check"], cwd=there, text=True, capture_output=True, timeout=120, check=False)
    unreadable = "Traceback" in loads.stderr
    if tested.returncode or unreadable:
        restore(saved)
        why = "its own tests failed there" if tested.returncode else "it could not read that project's answers"
        last = (tested.stderr or loads.stderr).strip().splitlines()[-1:] or ["no output"]
        raise Stop(f"control {now} was put back because {why}: {last[0]}")
    say(f"Control {now} passed its own tests there and read {there.name}/control/project.py")
    # The four files are left uncommitted on purpose, so this can be undone by Git
    # alone — but `start` refuses a dirty tree, so saying "done" and stopping sent
    # whoever ran this straight into a refusal on their very next command.
    say(f"Done — commit those four files in {there.name}, then its next card works as though nothing happened")


class Capability:
    """What a project runs today, and what its stack would let it run.

    Two questions that look like one and are not. `headless` and `rendered` are
    commands that exist here now. `possible` is the interesting half: things this
    stack can reach and this project is not reaching — a desktop shell with no
    screen suite, a phone shell nobody has opened a simulator against.

    A project that answers the first and ignores the second is exactly the failure
    this reads for: one ran 910 commits proving its behaviour and never once its
    pixels, and nothing anywhere said so.
    """

    def __init__(self) -> None:
        self.headless: list[str] = []
        self.rendered: list[str] = []
        self.rendered_tests: str = ""
        self.possible: list[str] = []
        self.unknown: list[str] = []


def reading(path: Path) -> str:
    """A file's text, or nothing at all. Detection never fails on an unreadable file."""
    try:
        return path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return ""


def what_can_be_proved(home: Path, photographs: bool = False) -> Capability:
    """Read a project and work out what it is able to prove with.

    Every signal here is an ecosystem's own convention — a manifest that means one
    thing everywhere it appears — never a fact about any particular product. That
    is what makes this the same code in every project: it recognises stacks, and it
    has never heard of yours.

    It reads and nothing else. No command is run, no browser opened, no device
    booted; a wrong guess here is a line somebody corrects, never a suite that ran
    the wrong thing and said green.
    """
    able = Capability()
    manifest = reading(home / "package.json")
    packaged = json.loads(manifest) if manifest.strip().startswith("{") else {}
    if not isinstance(packaged, dict):
        packaged = {}
    scripts = packaged.get("scripts") if isinstance(packaged.get("scripts"), dict) else {}
    depended = {
        **(packaged.get("dependencies") or {}),
        **(packaged.get("devDependencies") or {}),
    }

    # The fast checks, in the order a project would want them found: its own script
    # first, because a project that wrote one meant it, then the language default.
    if manifest and isinstance(scripts, dict) and scripts.get("test"):
        able.headless = ["npm", "test"]
    elif (home / "Cargo.toml").is_file():
        able.headless = ["cargo", "test"]
    elif (home / "pyproject.toml").is_file() or (home / "setup.py").is_file():
        able.headless = [Path(sys.executable).name, "-m", "pytest"]
    elif (home / "go.mod").is_file():
        able.headless = ["go", "test", "./..."]
    elif (home / "Package.swift").is_file():
        able.headless = ["swift", "test"]
    elif manifest:
        able.unknown.append("no test script in package.json — HEADLESS is the one answer worth writing by hand")
    else:
        able.unknown.append("no manifest recognised — write HEADLESS by hand, or leave it empty if nothing runs")

    # Screens. A runner that is installed is a runner that can be driven; where the
    # tests live is a separate question, and a project may have one without the other.
    drivers = [name for name in ("@playwright/test", "playwright", "cypress", "webdriverio") if name in depended]
    homes = [one for one in ("e2e", "tests/shots", "screens", "integration") if (home / one).is_dir()]
    if drivers and homes:
        able.rendered_tests = homes[0]
    # `possible` is what this project is *not* doing. A project already
    # photographing its screens is told none of this, because a line telling
    # somebody to do what they already do is the line that stops all of them
    # being read.
    if photographs:
        pass
    elif drivers and homes:
        able.possible.append(f"screen tests: {drivers[0]} is installed and {homes[0]}/ exists — RENDERED is worth answering")
    elif drivers:
        able.possible.append(f"screen tests: {drivers[0]} is installed and no suite was found — one screen, one test, one tag")
    elif able.headless:
        # The silent case, said out loud. A project with a runner and no screen
        # driver can add one; a project told nothing never learns that it could.
        able.possible.append("screen tests: no browser driver is installed — nothing here can photograph a screen yet")

    # Shells nothing automated reaches. Named as reachable by hand rather than as a
    # tier, because a tier is something the control runs and it can run none of these.
    for marker, said in (
        ("ios", "an iOS simulator is reachable by hand — a card proves that seam or names it unproven"),
        ("android", "an Android emulator is reachable by hand — a card proves that seam or names it unproven"),
        ("src-tauri", "a desktop shell is here — its screens are drivable, and its own suite is separate"),
    ):
        if (home / marker).is_dir():
            able.possible.append(said)
    return able


def answers_from(able: Capability) -> str:
    """The file a project would have written by hand, written from what was read."""
    lines = [
        '"""This project\'s answers, worked out by `detect` and yours to correct.',
        "",
        "Every value here was read from this project rather than typed. Anything wrong",
        "is wrong because a convention was read the ordinary way and this project is not",
        "ordinary — correct it and it stays corrected, because detection never runs over",
        "a file that already exists.",
        '"""',
        "from __future__ import annotations",
        "",
        "from pathlib import Path",
        "",
        "ROOT = Path(__file__).resolve().parent.parent",
        "",
        f"HEADLESS = {able.headless!r}",
        f"RENDERED = {able.rendered!r}",
    ]
    lines.append(f"RENDERED_TESTS = ROOT / {able.rendered_tests!r}" if able.rendered_tests else "RENDERED_TESTS = None")
    lines += [
        "",
        "# What a person can see. Empty for exactly as long as RENDERED is: a project",
        "# naming screens it cannot render refuses every card that touches one.",
        "INTERFACE: tuple[str, ...] = ()",
        "NOT_INTERFACE: tuple[str, ...] = ()",
        "",
    ]
    if able.possible:
        lines.append("# What this stack could prove and this project is not proving yet:")
        lines += [f"#   - {one}" for one in able.possible]
        lines.append("")
    if able.unknown:
        lines.append("# What detection could not work out:")
        lines += [f"#   - {one}" for one in able.unknown]
        lines.append("")
    return "\n".join(lines)


def write_answers(home: Path) -> bool:
    """Write the answers, and never over answers that are already there.

    A project's own file outranks anything read from a manifest: it is where a
    correction lives, and a detection that overwrote it would undo the correction
    every time somebody ran it.
    """
    target = home / "control" / "project.py"
    if target.exists():
        return False
    target.parent.mkdir(parents=True, exist_ok=True)
    atomic_write(target, answers_from(what_can_be_proved(home)).encode())
    return True


def command_detect(_args: argparse.Namespace) -> None:
    """Say what this project can prove, and fill in its answers if it has none."""
    able = what_can_be_proved(ROOT, photographs=bool(RENDERED))
    # What this project does today comes from its answers, not from detection — a
    # screen runner is a script a project writes, and no manifest can reveal one.
    # Printing a detected `rendered` here said "none configured" in a project with
    # 83 screens, which is the opposite of what the line was for.
    say(f"Runs today — {' '.join(HEADLESS) if HEADLESS else 'no fast checks'}")
    say(f"Photographs today — {' '.join(RENDERED) if RENDERED else 'no screens'}")
    say(f"Detection found — {' '.join(able.headless) if able.headless else 'no fast checks'}")
    for one in able.possible:
        say(f"Possible — {one}")
    for one in able.unknown:
        say(f"Could not work out — {one}")
    if write_answers(ROOT):
        say("Wrote control/project.py from what was read — read it, correct anything wrong, commit it")
    else:
        say("control/project.py is already there and was not touched — those answers are this project's")


def command_check(_args: argparse.Namespace) -> None:
    card = card_for(branch())
    if not card.is_file():
        raise Stop(f"no card at {card.relative_to(ROOT)}; this branch has nothing behind it")
    text = card.read_text(encoding="utf-8")
    changed = changed_files()
    if found := problems(card, text, changed):
        raise Stop(f"{len(found)} thing(s) stand between this card and closing:\n" + "\n".join(f"  - {one}" for one in found))
    named = screen_tests(text)
    tier = tier_for(changed, named)
    detail = "nothing a user would notice" if tier == "none" else tier_detail(tier, named)
    # Read from the last fetch rather than fetching, so this stays under a second. It is
    # a warning, not a refusal: closing fetches for real and refuses there.
    behind = git("rev-list", "--count", f"{TRUNK}..refs/remotes/origin/{TRUNK}") if run(["git", "rev-parse", "--verify", "--quiet", f"refs/remotes/origin/{TRUNK}"], timeout=30).returncode == 0 else "0"
    unnamed = [one for one in entries(text, "unproven") if one]
    unseen = [one for one in entries(text, "unrendered") if one]
    say(f"Control {CONTROL_VERSION} — card read, {len(changed)} file(s) changed so far")
    if not ANSWERED:
        say(f"No control/project.py — running on the ordinary answers, and merging into {TRUNK}")
    if not HEADLESS:
        say("No fast checks are configured — HEADLESS is empty, so a card closes here having run nothing fast")
    screens = [path for path in changed if is_interface(path)]
    if screens and unseen:
        say(f"Screen files changed — {len(screens)}, and this card says none of it can be seen: {'; '.join(unseen)}")
    elif screens:
        shots = len(list((card.parent / "after").glob("*.png"))) if (card.parent / "after").is_dir() else 0
        say(f"Screens changed — {len(screens)}, opened by {', '.join(screen_tests(text))}, {shots} picture(s) taken")
    if unnamed:
        say(f"Unproven — {len(unnamed)} seam(s) will be written onto the commit")
    if behind != "0":
        say(f"Remote — {behind} commit(s) ahead of us; closing will refuse until we catch up")
    say(f"Would run {tier} Suite Testing — {detail}" if tier != "none" else "Would run no tier — nothing a user would notice has changed")
    say("Nothing stands between this card and closing")


SPENT: dict[str, float] = {}


def timed(name: str):
    """Record what a stage cost, so 'it feels slow' can become a number.

    Nothing here measured itself, so every complaint about the system being slow
    had to be answered by timing it by hand. The whole headless suite is about
    nine seconds of real work; without a number printed every time, that is an
    opinion.
    """
    class Stage:
        def __enter__(self) -> None:
            self.started = time.monotonic()

        def __exit__(self, *_: object) -> None:
            SPENT[name] = SPENT.get(name, 0.0) + time.monotonic() - self.started

    return Stage()


def tier_detail(tier: str, named: list[str]) -> str:
    """What a tier is about to run, in words this control can actually stand behind.

    It used to say "8 stages", which was true of the project this control grew up
    in and of nothing else — a made-up number reported as fact in every other
    project. The control hands one command to the fast checks and does not know
    what is inside it, so it says what it knows.
    """
    fast = "everything fast that renders nothing" if HEADLESS else "no fast checks are configured, so nothing fast will run"
    if tier != "Scoped" or not named:
        return f"{fast}, no screens"
    # Said here as well as at the close, so the neglected ones are never a surprise
    # arriving at the one moment somebody is trying to finish.
    swept = sweeping(named)
    riding = f", and {len(swept)} gone longest without running: {', '.join(swept)}" if swept else ""
    return f"{fast}, then {len(named)} screen{'' if len(named) == 1 else 's'}: {', '.join(named)}{riding}"


def proved(tier: str, named: list[str]) -> str:
    """What proved this card, in words somebody would say out loud.

    "proved by none Suite Testing" is what comes of building a sentence out of a
    variable. A card that ran no tier proved nothing, and saying so plainly is the
    entire reason the tier is on the commit at all.
    """
    if tier == "none":
        return "no tier ran — nothing a user would notice changed"
    # A tier that ran no fast checks is not the same claim as one that ran them and
    # passed, and the commit is where that difference has to survive: it is read a
    # year later by somebody deciding whether this change was ever proved.
    nothing = "" if HEADLESS else " with no fast checks configured, so nothing fast was proved"
    return f"proved by {tier} Suite Testing" + (f" and {', '.join(named)}" if named else "") + nothing


def spent_line() -> str:
    return " · ".join(f"{name} {cost:.1f}s" for name, cost in SPENT.items()) + f" · total {sum(SPENT.values()):.1f}s"


def run_tier(tier: str, named: list[str]) -> list[str]:
    """Headless always runs whole. Scoped is headless, the screens the card named,
    and a few the ledger says have gone longest without running.

    Hands back the swept ones, because they have now run and the ledger has to say
    so — a screen picked every time and never recorded is a screen this would keep
    picking forever.

    Whole Suite Testing is not reachable from here on purpose: running every screen
    is the user's to ask for by name, and a card that could ask for it would.
    """
    if tier == "none":
        say("No tier ran — this card changed nothing a user would notice")
        return []
    # Your tier first, always. It is the one name that means the same thing in every
    # project; the screen it happens to open here is a detail after it.
    say(f"Running {tier} Suite Testing — {tier_detail(tier, named)}")
    if HEADLESS:
        with timed("headless"):
            headless = run(HEADLESS)
        if headless.returncode:
            raise Stop("the headless suite failed:\n" + (headless.stdout or headless.stderr).strip())
        say("Headless Suite Testing passed — everything fast that renders nothing")
    else:
        # The one danger in letting this be empty, said at the volume it deserves.
        # A card closing green having run nothing is allowed — a folder of documents
        # has nothing to run — but it is never quiet about it, and the same sentence
        # is carried onto the commit so the history cannot read as proven either.
        say("No fast checks are configured — HEADLESS is empty, so nothing fast ran and nothing fast was proved")
    if tier != "Scoped":
        return []

    if not RENDERED:
        raise Stop("RENDERED is empty in control/project.py, so no screen test can run — answer it there, or stop naming screens")
    swept = sweeping(named)
    if swept:
        say(f"Sweeping {len(swept)} neglected screen{'' if len(swept) == 1 else 's'} alongside — {', '.join(swept)}")
    # One invocation for both, because the runner builds and serves the product
    # before it opens anything: asking twice pays that twice for no more proof.
    # The runner refuses a test that was skipped rather than run, so reaching here
    # means every screen named was actually drawn and actually looked at.
    with timed("screens"):
        rendered = run([*RENDERED, *named, *swept])
    if rendered.returncode:
        inherited = (
            f"\n\n{', '.join(swept)} came from the ledger rather than from this card. A failure "
            "there is older than this work — fix it or say why, but it is not yours by accident."
            if swept
            else ""
        )
        raise Stop(
            f"{', '.join(named + swept)} did not all run and pass:\n"
            + (rendered.stdout or rendered.stderr).strip()
            + inherited
        )
    ran = len(named) + len(swept)
    say(f"{ran} screen{'' if ran == 1 else 's'} ran and passed — {', '.join(named + swept)} really opened and looked at")
    return swept


def stamp_targets() -> None:
    """Refuse a product that stamps a version into nowhere it will admit to.

    Not a style rule. The snapshot taken before a close is what puts the version
    back when the close fails, and it can only put back files it was told about.
    A product that stamps and names nothing rolls back to a tree still carrying the
    version of a release that never happened.
    """
    if INSTALLER and not STAMPED:
        raise Stop("STAMPED is empty in control/project.py while INSTALLER is set — name the file(s) the installer writes the version into, or a failed close cannot put the version back")
    for path in STAMPED:
        if not path.is_file():
            raise Stop(f"STAMPED names {where(path)} and there is no such file — correct control/project.py, or a failed close would restore nothing")


def stamp(version: str) -> None:
    # Empty is an answer, not a gap: a library, a command-line tool or a folder of
    # documents may have nothing to stamp a version into. A path that is set and
    # missing is different — that is a mistake, and the old system published
    # thirty-four releases stamping nothing because it treated the two the same.
    if not INSTALLER:
        say("Nothing to stamp — this product writes its version nowhere")
        return
    if not INSTALLER.is_file():
        raise Stop(f"there is no {INSTALLER.relative_to(ROOT)}; the version has nowhere to go and nothing would be stamped")
    stamped = run([sys.executable, str(INSTALLER), "--stamp", version], timeout=300)
    if stamped.returncode:
        raise Stop(f"{version} could not be stamped into the build: {(stamped.stderr or stamped.stdout).strip()}")


def write_changelog(version: str, title: str) -> None:
    text = CHANGELOG.read_text(encoding="utf-8") if CHANGELOG.exists() else "# Changelog\n"
    if f"\n## {version}\n" in f"\n{text}\n":
        raise Stop(f"the changelog already records {version}")
    lines = text.splitlines(keepends=True)
    at = next((index for index, line in enumerate(lines) if line.startswith("## ")), len(lines))
    lines.insert(at, f"## {version}\n\n- {title}\n\n")
    atomic_write(CHANGELOG, "".join(lines).encode())


def say_if_pictures_were_pushed(card: Path) -> None:
    """Say so when a card's pictures went into Git rather than staying on disk.

    Only when this card just committed some, never because an older one did.
    A project that pushed pictures before they were ignored keeps them for ever
    and cannot be helped by a message; one that is still committing them can be,
    and will stop hearing this the moment it adds the two lines.

    Nothing is refused. This is a project's own choice about its own repository —
    a control that blocked a close over it would be governing rather than helping.
    """
    committed: list[str] = []
    for name in ("before", "after"):
        folder = card / name
        if folder.is_dir():
            committed += [line for line in git("ls-files", "--", where(folder)).splitlines() if line.strip()]
    if not committed:
        return
    more = f" and {len(committed) - 1} more" if len(committed) > 1 else ""
    say(
        f"{len(committed)} picture(s) went into Git — {committed[0]}{more}. They are evidence "
        "rather than history and the remote will carry them for ever; add "
        "control/cards/*/before/ and control/cards/*/after/ to .gitignore to keep them on disk."
    )


def say_pruned(dropped: list[str]) -> None:
    """Say what the workshop let go of, and say nothing at all when it let go of
    nothing — which is every close in a project younger than `KEEP` cards."""
    if not dropped:
        return
    named = ", ".join(dropped[:3])
    more = f" — and {len(dropped) - 3} more" if len(dropped) > 3 else ""
    say(f"Workshop pruned — dropped {len(dropped)} picture folder(s) past the newest {KEEP} cards: {named}{more}")


def command_finish(_args: argparse.Namespace) -> None:
    target = branch()
    card = card_for(target)
    if not card.is_file():
        raise Stop(f"no card at {card.relative_to(ROOT)}")
    text = card.read_text(encoding="utf-8")
    changed = changed_files()
    if found := problems(card, text, changed):
        raise Stop(f"{len(found)} thing(s) stand between this card and closing:\n" + "\n".join(f"  - {one}" for one in found))
    # Asked again here, not only at start. Someone else can push while a card is open,
    # and without this the close merged and tagged into a divergence it then could not
    # push — leaving local history ahead of a remote that had moved, which is the worst
    # state this tool can produce and the one it promised never to.
    with timed("checks"):
        remote_ready()
        stamp_targets()
    title = text.splitlines()[0].lstrip("# ").strip()
    named = screen_tests(text)
    tier = tier_for(changed, named)
    swept = run_tier(tier, named)

    # Decided next to the tag that will carry it, rather than reused from check: the
    # suite can run for many minutes, and another card may have taken the number.
    publishing = timed("publish")
    publishing.__enter__()
    version, stepped = next_version(field(text, "bump"))
    if stepped:
        say(f"Stepped over {', '.join(stepped)} — {'that tag exists' if len(stepped) == 1 else 'those tags exist'} already and this history never reached {'it' if len(stepped) == 1 else 'them'}")
    product = any(not is_paperwork(path) for path in changed)
    index = ROOT / Path(git("rev-parse", "--git-path", "index"))
    say(f"Version worked out — {version}, from the tags that already exist")
    if prune_before(card.parent):
        say("Dropped before/ — every screen came out identical, so it was two copies of one picture")
    saved = snapshot(card, CHANGELOG, index, LEDGER, *STAMPED)
    try:
        stamp(version)
        lagging, waiting = remember_screens(named + swept, version)
        if lagging:
            say(neglect_line(lagging, waiting))
        if product:
            write_changelog(version, title)
        git("add", "-A", "--", ".")
        # Carried onto the commit beside the tier, because a green close otherwise
        # reads as everything proven — and the seams no tier here can reach are
        # exactly the ones nobody remembers a year later.
        unproven = "".join(f"\nUnproven: {one}" for one in entries(text, "unproven") if one)
        # Beside it, and for the same reason: a card that photographed nothing
        # should say so in the history rather than look like one that forgot.
        unproven += "".join(f"\nUnrendered: {one}" for one in entries(text, "unrendered") if one)
        # And the reason this card was allowed to touch the system at all. In the
        # history rather than only on the card, because the question it answers —
        # is this control growing for good reasons? — is asked of the log.
        unproven += "".join(f"\nControl: {one}" for one in entries(text, "control") if one)
        say("Committed — one commit, carrying what proved it and what it did not")
        git("commit", "-m", title, "-m", f"Proof: {tier}" + (f" — {', '.join(named)}" if named else "") + unproven)
    except (OSError, Stop) as exc:
        survived = restore(saved)
        left = f"; could not put back: {', '.join(survived)}" if survived else ""
        raise Stop(f"finish put everything back: {exc}{left}") from exc
    git("switch", TRUNK)
    git("merge", "--ff-only", target)
    say(f"Merged into {TRUNK} and tagged {version}")
    git("tag", "-a", version, "-m", f"{version} {title}")
    if not has_remote():
        git("branch", "-d", target)
        publishing.__exit__()
        with timed("tidy"):
            say_if_pictures_were_pushed(card.parent)
            say_pruned(prune_workshops())
        say(f"Done — {version}, {proved(tier, named)}; no remote, so nothing was pushed")
        say(f"Took {spent_line()}")
        return
    pushed = run(["git", "push", "--atomic", "origin", TRUNK, version], timeout=300)
    if pushed.returncode:
        print(f"FAIL finish :: {version} is merged and tagged here but the push failed; run: git push --atomic origin {TRUNK} {version}", file=sys.stderr)
        raise SystemExit(1)
    git("branch", "-d", target)
    publishing.__exit__()
    say(f"Pushed {TRUNK} and {version} together")
    say(f"Branch deleted — {target} is finished")
    # Last, after everything that could fail. The pictures are gitignored, so
    # dropping them changes nothing Git can see and nothing that has to be undone.
    # Inside the clock, though: it used to sit outside it, and a close that really
    # took 2.3 seconds reported 0.6 because the tidying was not counted.
    with timed("tidy"):
        say_if_pictures_were_pushed(card.parent)
        say_pruned(prune_workshops())
    say(f"Done — {version}, {proved(tier, named)}")
    say(f"Took {spent_line()}")


#: Named once, so the parser and the tests cannot disagree about what exists.
COMMANDS = {
    "start": command_start,
    "check": command_check,
    "finish": command_finish,
    "update": command_update,
    "detect": command_detect,
}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    start = commands.add_parser("start", help="cut a branch and write a card")
    start.add_argument("title")
    commands.add_parser("check", help="say what would stop this card closing; writes nothing")
    update = commands.add_parser("update", help="put this control into another project")
    update.add_argument("project", help="that project's folder, or its control/ folder")
    commands.add_parser("finish", help="test, version, commit, merge, tag, push")
    commands.add_parser("detect", help="say what this project can prove, and write its answers if it has none")
    args = parser.parse_args()
    try:
        COMMANDS[args.command](args)
    except (OSError, Stop, subprocess.TimeoutExpired) as exc:
        print(f"FAIL {args.command} :: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
