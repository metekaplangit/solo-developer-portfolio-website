"""Tests for the control itself.

Every defect this tool has had was found by forcing a state by hand: a parser
reading prose as a field, a Git call eating a letter, a rollback that stopped at
the first file it could not restore. Not one was noticed while writing the code,
and nothing would have caught a seventh.

Plain `unittest`, so the tool's own tests need nothing installed that the tool
does not already need.
"""
from __future__ import annotations

import ast
import importlib.util
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location("loop", Path(__file__).with_name("loop.py"))
assert spec and spec.loader
loop = importlib.util.module_from_spec(spec)
spec.loader.exec_module(loop)


class WithAnswers(unittest.TestCase):
    """A test that needs a screen supplies one, rather than borrowing the project's.

    Borrowing broke twice, in two different ways: in a project whose product lives
    somewhere else the assertions were simply false, and in a project with no
    screens at all `INTERFACE[0]` raised before any assertion ran. Neither had
    anything to do with what was being tested.
    """

    SCREEN = "app/App.tsx"

    def setUp(self) -> None:
        self.kept = (loop.INTERFACE, loop.NOT_INTERFACE, loop.PAPERWORK, loop.PAPERWORK_FILES, loop.RENDERED, loop.RENDERED_TESTS)
        loop.INTERFACE = ("app/",)
        loop.NOT_INTERFACE = ("app/tests/", "app/build.config")
        loop.PAPERWORK = ("control/", "docs/")
        loop.PAPERWORK_FILES = {"CHANGELOG.md"}
        # The runner as well as the paths. Supplying the screens and borrowing the
        # way they run is half an answer: a product with screens and no runner is a
        # real project — this control was adopted by one — and there these tests
        # asked the project for a path that was not there and read a refusal about
        # RENDERED being empty as the refusal they were checking for. Four errored
        # and one passed the wrong assertion, all of it about the project rather
        # than about the rule under test.
        loop.RENDERED = ["a-screen-runner"]
        loop.RENDERED_TESTS = loop.ROOT / "app" / "screens"

    def tearDown(self) -> None:
        loop.INTERFACE, loop.NOT_INTERFACE, loop.PAPERWORK, loop.PAPERWORK_FILES, loop.RENDERED, loop.RENDERED_TESTS = self.kept


class ReadingACard(unittest.TestCase):
    def test_fields_come_from_the_head(self) -> None:
        card = "# A card\n\nbump: patch\nscreen: @real\n\nI tried three things.\nscreen: reloading was what settled it.\nbump: only after everything passed.\n"
        self.assertEqual(loop.field(card, "screen"), "@real")
        self.assertEqual(loop.field(card, "bump"), "patch")

    def test_prose_alone_sets_nothing(self) -> None:
        # No head at all: the fields live only in the prose, and must not be read.
        card = "# A card\n\nSome prose.\n\nbump: minor\n"
        self.assertEqual(loop.field(card, "bump"), "")

    def test_a_card_with_no_prose_has_no_body(self) -> None:
        self.assertEqual(loop.body_of("# T\n\nbump: patch\nscreen:\n"), "")
        self.assertNotEqual(loop.body_of("# T\n\nbump: patch\n\nSomething.\n"), "")

    def test_a_heading_alone_is_not_a_body(self) -> None:
        self.assertEqual(loop.body_of("# Only a heading\n"), "")


class WhatCountsAsWhat(WithAnswers):
    """Tested against answers this test supplies, never against this project's.

    These once read the real calibration, so they asserted that one project's own
    folder was a screen — true there and false everywhere else. Pushing the control
    into a fresh project failed four tests for no reason but that, and the update
    rolled itself back. A test of the system has to hold in every project it is in.
    """

    def test_what_the_answers_call_a_screen_is_a_screen(self) -> None:
        for path in ("app/index.html", "app/pictures/logo.png", "app/main.tsx"):
            self.assertTrue(loop.is_interface(path), path)

    def test_tests_and_configuration_are_not_screens(self) -> None:
        for path in ("app/tests/x.spec.ts", "app/build.config.js", "rules/board.ts", "control/loop.py"):
            self.assertFalse(loop.is_interface(path), path)

    def test_paperwork_is_what_a_user_never_sees(self) -> None:
        self.assertTrue(loop.is_paperwork("control/loop.py"))
        self.assertTrue(loop.is_paperwork("CHANGELOG.md"))
        self.assertFalse(loop.is_paperwork("app/main.tsx"))

    def test_the_tier_follows_what_changed(self) -> None:
        # A page, not the control's own source: that earns a tier now, because 5
        # cards changed it and ran nothing. See ChangingTheControlIsNotPaperwork.
        self.assertEqual(loop.tier_for(["control/README.md"], ""), "none")
        self.assertEqual(loop.tier_for(["rules/board.ts"], []), "Headless")
        self.assertEqual(loop.tier_for([self.SCREEN], ["@tag"]), "Scoped")
        self.assertEqual(loop.tier_for([], ""), "none")


class Slugs(unittest.TestCase):
    def test_ordinary_titles(self) -> None:
        self.assertEqual(loop.slugify('A card with "quotes"'), "a-card-with-quotes")
        self.assertEqual(loop.slugify("Ünïcödé çard"), "unicode-card")

    def test_a_title_of_punctuation_is_refused(self) -> None:
        with self.assertRaises(loop.Stop):
            loop.slugify("-- --")

    def test_a_slug_never_runs_away(self) -> None:
        self.assertLessEqual(len(loop.slugify("x" * 200)), 60)


class Refusals(WithAnswers):
    def setUp(self) -> None:
        super().setUp()
        self.card = loop.CARDS / "a-card" / "card.md"

    def problems(self, text: str, changed: list[str], removed: set[str] | None = None) -> list[str]:
        return loop.problems(self.card, text, changed, removed or set())

    def test_an_empty_card_is_refused_for_every_reason_at_once(self) -> None:
        found = self.problems("# T\n\nbump:\nproof:\n", [])
        self.assertGreaterEqual(len(found), 3)

    def test_a_screen_with_no_proof_is_refused(self) -> None:
        found = self.problems("# T\n\nbump: patch\n\nBody.\n", [self.SCREEN, "control/cards/a-card/card.md"])
        self.assertTrue(any("screen file" in one for one in found), found)

    def test_a_bad_bump_is_refused(self) -> None:
        found = self.problems("# T\n\nbump: major\n\nBody.\n", ["control/cards/a-card/card.md"])
        self.assertTrue(any("bump" in one for one in found), found)

    def test_another_workshop_is_refused(self) -> None:
        found = self.problems("# T\n\nbump: patch\n\nBody.\n", ["control/cards/a-card/card.md", "control/cards/someone-else/card.md"])
        self.assertTrue(any("other card workshop" in one for one in found), found)

    def test_removing_another_workshop_is_allowed(self) -> None:
        # Handed in as a removal, so tidying somebody else's leftovers passes.
        found = self.problems(
            "# T\n\nbump: patch\n\nBody.\n",
            ["control/cards/a-card/card.md", "control/cards/gone-for-good/card.md"],
            {"control/cards/gone-for-good/card.md"},
        )
        self.assertFalse(any("other card workshop" in one for one in found), found)

    def test_a_card_that_touched_nothing_of_its_own_is_refused(self) -> None:
        found = self.problems("# T\n\nbump: patch\n\nBody.\n", [self.SCREEN])
        self.assertTrue(any("workshop" in one for one in found), found)


class Restoring(unittest.TestCase):
    def test_a_rollback_never_raises_and_names_what_survived(self) -> None:
        with tempfile.TemporaryDirectory() as room:
            here = Path(room)
            kept, gone = here / "kept.txt", here / "gone.txt"
            kept.write_text("before")
            saved = loop.snapshot(kept, gone)
            kept.write_text("after")
            gone.write_text("appeared")
            self.assertEqual(loop.restore(saved), [])
            self.assertEqual(kept.read_text(), "before")
            self.assertFalse(gone.exists())

    def test_a_file_it_cannot_put_back_is_named_rather_than_raised(self) -> None:
        with tempfile.TemporaryDirectory() as room:
            here = Path(room)
            target = here / "locked" / "file.txt"
            target.parent.mkdir()
            target.write_text("before")
            saved = loop.snapshot(target)
            target.write_text("after")
            target.parent.chmod(0o555)
            try:
                self.assertEqual(loop.restore(saved), ["file.txt"])
            finally:
                target.parent.chmod(0o755)


class Pictures(unittest.TestCase):
    def prepare(self, room: str, before: dict[str, bytes], after: dict[str, bytes]) -> Path:
        workshop = Path(room) / "card"
        for name, files in (("before", before), ("after", after)):
            (workshop / name).mkdir(parents=True)
            for key, value in files.items():
                (workshop / name / key).write_bytes(value)
        return workshop

    def test_identical_screens_are_dropped(self) -> None:
        with tempfile.TemporaryDirectory() as room:
            workshop = self.prepare(room, {"a.png": b"same"}, {"a.png": b"same"})
            self.assertTrue(loop.prune_before(workshop))
            self.assertFalse((workshop / "before").exists())

    def test_a_screen_that_moved_keeps_both(self) -> None:
        with tempfile.TemporaryDirectory() as room:
            workshop = self.prepare(room, {"a.png": b"one"}, {"a.png": b"two"})
            self.assertFalse(loop.prune_before(workshop))
            self.assertTrue((workshop / "before").exists())

    def test_a_screen_on_one_side_only_keeps_both(self) -> None:
        with tempfile.TemporaryDirectory() as room:
            workshop = self.prepare(room, {"a.png": b"same"}, {"a.png": b"same", "b.png": b"new"})
            self.assertFalse(loop.prune_before(workshop))


class Calibration(unittest.TestCase):
    """Nothing is required, and every answer has one that works anywhere.

    Three answers used to be refused by name until a project filled them in, and
    that refusal was the first thing every new project met. It is gone on purpose:
    the trunk comes from Git, the paperwork is the same everywhere, and no fast
    checks is a true statement about a folder of documents rather than a gap.

    What is left to hold is that the defaults are real — an answer defaulting to
    something empty would put the refusal back as a crash further down.
    """

    def test_no_answer_is_required(self) -> None:
        self.assertFalse(hasattr(loop, "calibrated"), "a required-answer gate is back")
        self.assertFalse(hasattr(loop, "CALIBRATION"), "a required-answer list is back")

    def test_the_trunk_is_never_empty(self) -> None:
        self.assertTrue(loop.TRUNK)

    def test_the_paperwork_is_answered_for_any_project(self) -> None:
        # Whatever this project says, the control's own folder is paperwork in it —
        # otherwise a card that only touches the control asks for a screen test.
        self.assertTrue(loop.PAPERWORK)
        self.assertTrue(any("control" in one for one in loop.PAPERWORK))

    def test_an_unanswered_project_gets_the_default(self) -> None:
        # `answer` is the whole mechanism, so it is what gets asked. A name nobody
        # has ever written hands back exactly what the control offered.
        self.assertEqual(loop.answer("A_NAME_NOBODY_HAS_ANSWERED", "fallback"), "fallback")


class Unproven(unittest.TestCase):
    def test_every_entry_is_read_in_order(self) -> None:
        card = "# T\n\nbump: patch\nunproven: real phones\nunproven: a store review\n\nBody.\n"
        self.assertEqual(loop.entries(card, "unproven"), ["real phones", "a store review"])

    def test_prose_that_looks_like_one_is_not_one(self) -> None:
        card = "# T\n\nbump: patch\n\nBody.\nunproven: this sentence is prose.\n"
        self.assertEqual(loop.entries(card, "unproven"), [])

    def test_a_card_naming_none_is_fine(self) -> None:
        self.assertEqual(loop.entries("# T\n\nbump: patch\n\nBody.\n", "unproven"), [])

    def test_a_blank_entry_is_refused(self) -> None:
        # Somebody started writing it and stopped, which is neither a claim nor a
        # record — and the old system published two cards under exactly that.
        found = loop.problems(loop.CARDS / "a-card" / "card.md", "# T\n\nbump: patch\nunproven:\n\nBody.\n", ["control/cards/a-card/card.md"], set())
        self.assertTrue(any("unproven" in one for one in found), found)


class AProjectWithNoScreenRunner(unittest.TestCase):
    """A product with screens and no way to render one is a real project.

    This control was adopted by one, and the whole suite fell over: five tests
    borrowed the project's answers rather than supplying their own, and `problems`
    itself raised on a card that named a screen while nothing on disk could run
    one. A refusal is the right answer there; a traceback is not, and a control
    that cannot be adopted without editing it is not a control.
    """

    def setUp(self) -> None:
        self.kept = (loop.INTERFACE, loop.RENDERED, loop.RENDERED_TESTS)
        loop.INTERFACE = ("app/",)
        loop.RENDERED = []
        loop.RENDERED_TESTS = None

    def tearDown(self) -> None:
        loop.INTERFACE, loop.RENDERED, loop.RENDERED_TESTS = self.kept

    def test_a_named_screen_is_refused_rather_than_raising(self) -> None:
        card = "# A title\n\nbump: patch\nscreen: @a-screen\n\nA body.\n"
        found = loop.problems(Path("control/cards/x/card.md"), card, ["docs/notes.md", "control/cards/x/card.md"])
        self.assertTrue([one for one in found if "no screen test carries" in one], found)

    def test_the_prefix_matches_nothing_rather_than_everything(self) -> None:
        # `""` would be the tempting empty answer, and every path starts with it.
        self.assertEqual(loop.rendered_tests_prefix(), "")
        card = "# A title\n\nbump: patch\nscreen: @a-screen\n\nA body.\n"
        found = loop.problems(Path("control/cards/x/card.md"), card, ["docs/notes.md", "control/cards/x/card.md"])
        self.assertTrue([one for one in found if "neither a screen nor a screen test" in one], found)

    def test_a_screen_change_says_the_runner_is_missing(self) -> None:
        card = "# A title\n\nbump: patch\n\nA body.\n"
        found = loop.problems(Path("control/cards/x/card.md"), card, ["app/App.tsx", "control/cards/x/card.md"])
        self.assertTrue([one for one in found if "RENDERED is empty" in one], found)


class ProjectIndependence(unittest.TestCase):
    """The tool must name this product only where a different one would answer differently."""

    def source(self) -> list[str]:
        """The tool's lines, with comments and docstrings blanked out.

        Prose may quote a path while explaining why it is no longer used, and the
        first version of this test failed on the sentence describing the very leak
        it was written to prevent.
        """
        kept: list[str] = []
        inside = False
        for line in Path(loop.__file__).read_text(encoding="utf-8").splitlines():
            fences = line.count('"""')
            body = "" if inside else line.split("#")[0]
            if fences and not inside:
                body = line.split('"""')[0]
            if fences % 2:
                inside = not inside
            kept.append(body)
        return kept

    #: Names that belong to one product's shape, never to a control.
    LOCAL = ("apps", "packages", "npm", "npx", "vite", "playwright", "node_modules", "src")

    @staticmethod
    def pieces(line: str) -> list[str]:
        """Every path segment and word inside every string literal on this line.

        The first version of this test looked for `"apps/"` as a substring, and the
        leak it missed was written `ROOT / "apps" / "web" / "package.json"` — the
        same path with the slashes outside the quotes. Segments rather than
        substrings, so a path spelled either way is the same to it, and so an
        ordinary word like "happens" is never mistaken for "apps".
        """
        found: list[str] = []
        for double, single in re.findall(r'"([^"]*)"|\'([^\']*)\'', line):
            for piece in re.split(r"[/\s]+", double or single):
                if piece:
                    found.append(piece)
        return found

    def answers_end(self, lines: list[str]) -> int:
        """Where the block of answers stops and the system starts.

        It used to be `def calibrated`, the gate that refused an unanswered
        project. That gate is gone — nothing is required any more — so the marker
        is the first ordinary function after the answers instead.
        """
        return next(index for index, line in enumerate(lines) if line.startswith("def where("))

    def discovering_the_trunk(self, lines: list[str]) -> range:
        """The lines of `trunk_from_git`, which is allowed to name the usual trunks.

        Its entire job is working out what this repository calls its trunk, and it
        cannot do that without naming the two candidates it falls back on. Every
        other line in the file is still held to the rule.
        """
        start = next(index for index, line in enumerate(lines) if line.startswith("def trunk_from_git"))
        after = next(index for index, line in enumerate(lines) if index > start and line.startswith("TRUNK ="))
        return range(start, after)

    def recognising_a_stack(self, lines: list[str]) -> range:
        """The lines of `what_can_be_proved`, which is allowed to name ecosystems.

        Its entire job is recognising other people's conventions — a test script, a
        browser driver, a crate manifest — and it cannot do that without naming
        them. What the rule forbids is naming *this product*, and none of those is
        this product: they mean the same thing in every repository on the machine.
        """
        start = next(index for index, line in enumerate(lines) if line.startswith("def what_can_be_proved"))
        after = next(index for index, line in enumerate(lines) if index > start and line.startswith("def answers_from"))
        return range(start, after)

    def test_no_product_path_outside_the_answers(self) -> None:
        lines = self.source()
        end = self.answers_end(lines)
        allowed = self.recognising_a_stack(lines)
        # Code only: a comment may quote a path while explaining why it is gone.
        offenders = [
            f"{index + 1}: {line.strip()}"
            for index, line in enumerate(lines)
            if index not in allowed
            if index > end and any(piece in self.LOCAL for piece in self.pieces(line))
        ]
        self.assertEqual(offenders, [], "these name this product outside the answers")

    def test_the_guard_would_have_caught_the_leak_it_missed(self) -> None:
        # The exact line that sat in the tool for 12 cards, spelled exactly as it was.
        leak = '    saved = snapshot(card, CHANGELOG, index, ROOT / "apps" / "web" / "package.json")'
        self.assertIn("apps", self.pieces(leak))

    def test_an_ordinary_word_is_not_a_product_path(self) -> None:
        innocent = '    raise Stop("this happens when the source is unreadable")'
        self.assertEqual([piece for piece in self.pieces(innocent) if piece in self.LOCAL], [])

    def test_the_trunk_is_answered_rather_than_assumed(self) -> None:
        lines = self.source()
        end = self.answers_end(lines)
        allowed = self.discovering_the_trunk(lines)
        offenders = [
            f"{index + 1}: {line.strip()}"
            for index, line in enumerate(lines)
            if index not in allowed
            # Inside a string, however it is spelled: `"main"`, `"main...HEAD"`, or
            # a sentence in a refusal. Looking only for the quoted word let a
            # `git diff main...HEAD` through, which broke every project whose trunk
            # is called something else. Looking for the bare word instead flagged
            # Python's own `def main()`, which is not the trunk at all.
            if index > end and re.search(r"""["'][^"']*\bmain\b""", line)
        ]
        self.assertEqual(offenders, [], "the trunk is calibrated as TRUNK; nothing should spell it out")

    def test_the_screen_test_prefix_comes_from_the_calibrated_path(self) -> None:
        # Its own path, for the same reason every other test here supplies its own:
        # a project that answers RENDERED_TESTS with nothing has no prefix to
        # derive, and this test would be reporting that rather than the rule.
        kept = loop.RENDERED_TESTS
        loop.RENDERED_TESTS = loop.ROOT / "app" / "screens"
        try:
            self.assertTrue(loop.rendered_tests_prefix().endswith("/"))
            self.assertIn(loop.rendered_tests_prefix().rstrip("/"), loop.RENDERED_TESTS.as_posix())
        finally:
            loop.RENDERED_TESTS = kept


class Pictures2(WithAnswers):
    """A card that changed a screen has to show it."""

    def problems(self, room: str, changed: list[str], shots: dict[str, float] | None = None, touched: float | None = None) -> list[str]:
        workshop = Path(room) / "card"
        (workshop / "after").mkdir(parents=True)
        for name, when in (shots or {}).items():
            shot = workshop / "after" / name
            shot.write_bytes(b"png")
            os.utime(shot, (when, when))
        if not shots:
            (workshop / "after").rmdir()
        return loop.problems(workshop / "card.md", "# T\n\nbump: patch\nscreen: @x\n\nBody.\n", changed, set())

    def test_a_screen_change_with_no_pictures_is_refused(self) -> None:
        with tempfile.TemporaryDirectory() as room:
            found = self.problems(room, [self.SCREEN])
            self.assertTrue(any("no pictures" in one for one in found), found)

    def test_a_card_that_changed_no_screen_needs_none(self) -> None:
        with tempfile.TemporaryDirectory() as room:
            found = self.problems(room, ["control/loop.py"])
            self.assertFalse(any("no pictures" in one for one in found), found)


class SayingWhatProvedIt(unittest.TestCase):
    def test_a_card_that_ran_no_tier_says_so(self) -> None:
        said = loop.proved("none", [])
        self.assertIn("no tier ran", said)
        self.assertNotIn("none Suite Testing", said)

    def test_a_headless_card_names_its_tier(self) -> None:
        self.assertEqual(loop.proved("Headless", []), "proved by Headless Suite Testing")

    def test_a_scoped_card_names_the_test_as_well(self) -> None:
        self.assertEqual(loop.proved("Scoped", ["@tag"]), "proved by Scoped Suite Testing and @tag")


class TheScreenField(unittest.TestCase):
    def test_a_card_names_its_screen_test_with_screen(self) -> None:
        self.assertEqual(loop.screen_test("# T\n\nbump: patch\nscreen: @tag\n\nBody.\n"), "@tag")

    def test_the_old_name_is_refused_rather_than_ignored(self) -> None:
        # Ignoring it would be worse: the card would look like it named a screen
        # test and would quietly close as Headless.
        found = loop.problems(
            loop.CARDS / "a-card" / "card.md",
            "# T\n\nbump: patch\nproof: @tag\n\nBody.\n",
            ["control/cards/a-card/card.md"],
            set(),
        )
        self.assertTrue(any("called `screen:` now" in one for one in found), found)

    def test_prose_saying_proof_is_still_prose(self) -> None:
        found = loop.problems(
            loop.CARDS / "a-card" / "card.md",
            "# T\n\nbump: patch\n\nThe proof: it worked.\n",
            ["control/cards/a-card/card.md"],
            set(),
        )
        self.assertFalse(any("called `screen:` now" in one for one in found), found)


class NamingSeveralScreens(WithAnswers):
    def test_every_screen_line_is_read(self) -> None:
        card = "# T\n\nbump: patch\nscreen: @one\nscreen: @two\nscreen: @three\n\nBody.\n"
        self.assertEqual(loop.screen_tests(card), ["@one", "@two", "@three"])

    def test_a_card_naming_none_runs_headless(self) -> None:
        self.assertEqual(loop.tier_for([self.SCREEN], []), "Headless")

    def test_a_card_naming_three_runs_scoped(self) -> None:
        self.assertEqual(loop.tier_for([self.SCREEN], ["@a", "@b", "@c"]), "Scoped")

    def test_the_same_screen_twice_is_refused(self) -> None:
        found = loop.problems(
            loop.CARDS / "a-card" / "card.md",
            "# T\n\nbump: patch\nscreen: @same\nscreen: @same\n\nBody.\n",
            ["control/cards/a-card/card.md", self.SCREEN],
            set(),
        )
        self.assertTrue(any("named twice" in one for one in found), found)

    def test_all_three_are_said_as_proof(self) -> None:
        self.assertEqual(loop.proved("Scoped", ["@a", "@b"]), "proved by Scoped Suite Testing and @a, @b")


class WhichTagsTheRemoteIsMissing(unittest.TestCase):
    """The guard that stops a card starting on top of an unpushed close.

    It had no test at all, and it was the slowest thing in the tool: it asked the
    remote about every local tag, one call each, so on a project with 127 of them
    `start` spent over two minutes on the one path where you most want a fast
    answer. One call answers the whole question, and this is the decision that
    call feeds.
    """

    LISTED = (
        "aaa\trefs/tags/v1.0.0\n"
        "bbb\trefs/tags/v1.1.0\n"
        # An annotated tag is listed twice: the tag object, then the commit it
        # peels to. Every tag this tool makes is annotated, so the real listing
        # always looks like this and the tests should too.
        "ccc\trefs/tags/v1.1.0^{}\n"
    )

    def test_a_tag_the_remote_has_is_not_waiting(self) -> None:
        self.assertEqual(loop.unpushed_tags(["v1.0.0", "v1.1.0"], self.LISTED), [])

    def test_a_tag_the_remote_lacks_is_waiting(self) -> None:
        self.assertEqual(loop.unpushed_tags(["v1.0.0", "v1.2.0"], self.LISTED), ["v1.2.0"])

    def test_an_annotated_tag_listed_twice_is_still_just_one_tag(self) -> None:
        # Green with or without the peel being stripped, and kept anyway: it is
        # the shape every real listing has. Tried both ways rather than assumed.
        self.assertEqual(loop.unpushed_tags(["v1.1.0"], self.LISTED), [])

    def test_a_remote_that_answered_with_nothing_leaves_every_tag_waiting(self) -> None:
        self.assertEqual(loop.unpushed_tags(["v1.0.0", "v1.1.0"], ""), ["v1.0.0", "v1.1.0"])

    def test_the_order_given_is_the_order_reported(self) -> None:
        # It goes into a `git push` line the reader is meant to run, so a set
        # would hand them a different command every time.
        self.assertEqual(
            loop.unpushed_tags(["v1.3.0", "v1.2.0", "v1.4.0"], self.LISTED),
            ["v1.3.0", "v1.2.0", "v1.4.0"],
        )

    def test_nothing_local_means_nothing_waiting(self) -> None:
        self.assertEqual(loop.unpushed_tags([], self.LISTED), [])

    def test_the_remote_holding_more_than_we_do_is_not_our_problem(self) -> None:
        self.assertEqual(loop.unpushed_tags(["v1.0.0"], self.LISTED), [])


class TheGuardAsksTheRemoteOnce(unittest.TestCase):
    """One call, whatever the tag count. Counted rather than timed.

    Timing would measure the machine and the network; the number of calls is what
    was actually wrong and is the same on every machine.
    """

    def test_one_remote_call_however_many_tags(self) -> None:
        calls: list[list[str]] = []

        def counted(command: list[str], timeout: int = 1800) -> subprocess.CompletedProcess[str]:
            calls.append(command)
            if command[:2] == ["git", "ls-remote"]:
                return subprocess.CompletedProcess(command, 0, "aaa\trefs/tags/v1.0.0\n", "")
            return subprocess.CompletedProcess(command, 0, "", "")

        kept_run, kept_git = loop.run, loop.git
        try:
            loop.run = counted
            loop.git = lambda *args: "\n".join(f"v1.{n}.0" for n in range(200)) if args[0] == "tag" else "1"
            loop.unpushed_report()
        finally:
            loop.run, loop.git = kept_run, kept_git

        remote = [command for command in calls if command[:2] == ["git", "ls-remote"]]
        self.assertEqual(len(remote), 1, f"asked the remote {len(remote)} times for 200 tags")


class NothingLocalTravels(unittest.TestCase):
    """An update carries the system and nothing else.

    A stricter version of this searched the three files for this project's own
    paths, deriving them from the calibration. It could not work: run in another
    project it forbids *that* project's answers, and these tests legitimately use
    made-up paths like `src/main.py` as fixtures. It failed in the target for
    reasons that had nothing to do with the target.

    What holds instead is the rule underneath it — `loop.py` names no product path
    in its code, which `ProjectIndependence` above checks properly — plus this:
    only three files move, and neither the answers nor the cards are among them.
    """

    def test_an_update_copies_only_the_system(self) -> None:
        self.assertEqual(set(loop.SYSTEM_FILES), {"loop.py", "test_loop.py", "README.md", "UPDATE.md"})

    def test_it_never_copies_the_answers_or_the_cards(self) -> None:
        self.assertNotIn("project.py", loop.SYSTEM_FILES)
        self.assertNotIn("cards", loop.SYSTEM_FILES)

    def test_it_never_copies_a_suite_that_would_recurse(self) -> None:
        # Copying the update tests in means an update runs tests that perform
        # updates, which run tests that perform updates. It hung, once.
        self.assertNotIn("test_update.py", loop.SYSTEM_FILES)


class ProjectsWithNoScreens(unittest.TestCase):
    """A library, a command-line tool, a folder of documents.

    Requiring an answer for "where are the screens" turned "this product has
    nothing to look at" into a refusal, which is a great many real projects.
    """

    def setUp(self) -> None:
        self.kept = loop.INTERFACE
        loop.INTERFACE = ()

    def tearDown(self) -> None:
        loop.INTERFACE = self.kept

    def test_a_screenless_project_still_starts(self) -> None:
        # Nothing to answer and nothing to refuse; what is left to hold is that a
        # project with no screens still has somewhere to merge into.
        self.assertTrue(loop.TRUNK)

    def test_nothing_is_ever_a_screen_there(self) -> None:
        self.assertFalse(loop.is_interface("src/main.py"))
        self.assertFalse(loop.is_interface("anything/at/all.txt"))

    def test_so_no_card_is_ever_asked_for_one(self) -> None:
        found = loop.problems(
            loop.CARDS / "a-card" / "card.md",
            "# T\n\nbump: patch\n\nBody.\n",
            ["control/cards/a-card/card.md", "src/main.py"],
            set(),
        )
        self.assertFalse(any("screen" in one for one in found), found)


class TitlesWithQuotesInThem(unittest.TestCase):
    """A test title is allowed an apostrophe, and the scanner has to survive one."""

    def test_an_apostrophe_does_not_cut_the_title_short(self) -> None:
        source = "test(\"the round's best word gets a sweep @shimmer-on-a-record\", async () => {"
        titles = [body for _, body in re.findall(loop.TEST_TITLE, source)]
        self.assertEqual(titles, ["the round's best word gets a sweep @shimmer-on-a-record"])

    def test_a_backtick_title_still_reads(self) -> None:
        source = "test(`a plain title @a-tag`, async () => {"
        titles = [body for _, body in re.findall(loop.TEST_TITLE, source)]
        self.assertEqual(titles, ["a plain title @a-tag"])


class TheScreenLedger(unittest.TestCase):
    """When each screen last ran, and which have gone longest without.

    The gap this closes: a card runs the screens it names, so a screen nobody has
    named can stay red for card after card and every close still prints green. Two
    of them did exactly that for 6 cards.
    """

    def test_never_run_beats_merely_old(self) -> None:
        # A screen that ran once was at least right once. A screen that has never
        # run has never been true and has never been false, so it goes first.
        lagging = loop.longest_unrun({"@old": "1.2.0"}, ["@old", "@never"], 2)
        self.assertEqual(lagging, [("@never", "never"), ("@old", "1.2.0")])

    def test_oldest_version_first_among_those_that_have_run(self) -> None:
        kept = {"@a": "1.10.0", "@b": "1.9.0", "@c": "1.44.1"}
        lagging = loop.longest_unrun(kept, ["@a", "@b", "@c"], 3)
        self.assertEqual([tag for tag, _ in lagging], ["@b", "@a", "@c"])

    def test_versions_are_compared_as_numbers_not_as_text(self) -> None:
        # "1.9.0" sorts after "1.10.0" as text, which would name the wrong screen.
        self.assertLess(loop.as_number("1.9.0"), loop.as_number("1.10.0"))
        self.assertEqual(loop.as_number("not a version"), (-1,))

    def test_a_leading_v_is_the_same_version(self) -> None:
        self.assertEqual(loop.as_number("v1.44.0"), loop.as_number("1.44.0"))

    def test_only_asks_for_as_many_as_it_was_asked_for(self) -> None:
        known = [f"@screen-{one}" for one in range(20)]
        self.assertEqual(len(loop.longest_unrun({}, known, 5)), 5)

    def test_a_missing_ledger_reads_as_nothing_rather_than_raising(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            kept, loop.LEDGER = loop.LEDGER, Path(folder) / "screens.json"
            try:
                self.assertEqual(loop.read_ledger(), {})
            finally:
                loop.LEDGER = kept

    def test_a_corrupt_ledger_reads_as_nothing_rather_than_raising(self) -> None:
        # A half-written file must never stop a card closing. The worst it may cost
        # is one round of the reminder being wrong.
        with tempfile.TemporaryDirectory() as folder:
            broken = Path(folder) / "screens.json"
            broken.write_text("{not json", encoding="utf-8")
            kept, loop.LEDGER = loop.LEDGER, broken
            try:
                self.assertEqual(loop.read_ledger(), {})
            finally:
                loop.LEDGER = kept

    def test_the_ledger_never_travels_to_another_project(self) -> None:
        # It is this project's history. Copying it would tell another project that
        # screens it has never heard of ran at versions it never had.
        self.assertNotIn("screens.json", loop.SYSTEM_FILES)

    def test_the_line_names_what_was_stale_before_this_card_ran(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            kept, loop.LEDGER = loop.LEDGER, Path(folder) / "screens.json"
            screens, loop.every_screen = loop.every_screen, lambda: ["@named", "@ignored"]
            try:
                lagging, waiting = loop.remember_screens(["@named"], "1.50.0")
                # The screen this card just ran is not offered back as neglected.
                self.assertEqual(lagging, [("@ignored", "never")])
                self.assertEqual(waiting, 1)
                self.assertEqual(loop.read_ledger(), {"@named": "1.50.0"})
            finally:
                loop.LEDGER, loop.every_screen = kept, screens

    def test_the_neglected_ones_that_ride_along_are_the_longest_unrun(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            kept, loop.LEDGER = loop.LEDGER, Path(folder) / "screens.json"
            loop.LEDGER.write_text(
                '{"@old": "1.2.0", "@newer": "1.9.0", "@oldest": "1.1.0"}', encoding="utf-8"
            )
            screens, loop.every_screen = loop.every_screen, lambda: [
                "@mine",
                "@never",
                "@old",
                "@newer",
                "@oldest",
            ]
            # A screen runner, because `sweeping` offers nothing to a product that
            # has no screens — and reading this project's answer is what made these
            # pass here and fail in a project whose `RENDERED` is empty.
            rendered, loop.RENDERED = loop.RENDERED, ["a-runner"]
            try:
                # Never-run first, then oldest, and the card's own is never offered
                # back to it — it is already running.
                self.assertEqual(loop.sweeping(["@mine"], 3), ["@never", "@oldest", "@old"])
            finally:
                loop.LEDGER, loop.every_screen, loop.RENDERED = kept, screens, rendered

    def test_it_takes_only_as_many_as_it_was_asked_for(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            kept, loop.LEDGER = loop.LEDGER, Path(folder) / "screens.json"
            screens, loop.every_screen = loop.every_screen, lambda: [f"@s{one}" for one in range(40)]
            rendered, loop.RENDERED = loop.RENDERED, ["a-runner"]
            try:
                # A backlog of forty must never become a card that runs forty screens.
                self.assertEqual(len(loop.sweeping([], loop.SWEEP)), loop.SWEEP)
            finally:
                loop.LEDGER, loop.every_screen, loop.RENDERED = kept, screens, rendered

    def test_a_product_with_no_screen_runner_sweeps_nothing(self) -> None:
        # `RENDERED` empty means this product has no screens at all. Offering it
        # neglected ones would be offering it tests it has no way to run.
        rendered, loop.RENDERED = loop.RENDERED, []
        try:
            self.assertEqual(loop.sweeping([]), [])
        finally:
            loop.RENDERED = rendered

    def test_a_swept_screen_is_written_down_so_it_is_not_picked_forever(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            kept, loop.LEDGER = loop.LEDGER, Path(folder) / "screens.json"
            screens, loop.every_screen = loop.every_screen, lambda: ["@named", "@swept", "@rest"]
            rendered, loop.RENDERED = loop.RENDERED, ["a-runner"]
            try:
                # What `finish` records is the card's screens *and* the ones that rode
                # along. Recording only the named ones would pick the same neglected
                # screen on every card from here to the end of the project.
                loop.remember_screens(["@named", "@swept"], "1.50.0")
                self.assertEqual(
                    loop.read_ledger(), {"@named": "1.50.0", "@swept": "1.50.0"}
                )
                self.assertEqual(loop.sweeping(["@named"], 3), ["@rest", "@swept"])
            finally:
                loop.LEDGER, loop.every_screen, loop.RENDERED = kept, screens, rendered

    def test_check_says_which_neglected_screens_would_ride_along(self) -> None:
        # Named at check as well as at the close, so they are never a surprise
        # arriving at the one moment somebody is trying to finish.
        with tempfile.TemporaryDirectory() as folder:
            kept, loop.LEDGER = loop.LEDGER, Path(folder) / "screens.json"
            screens, loop.every_screen = loop.every_screen, lambda: ["@mine", "@neglected"]
            rendered, loop.RENDERED = loop.RENDERED, ["a-runner"]
            try:
                said = loop.tier_detail("Scoped", ["@mine"])
                self.assertIn("@mine", said)
                self.assertIn("@neglected", said)
                self.assertIn("longest without running", said)
            finally:
                loop.LEDGER, loop.every_screen, loop.RENDERED = kept, screens, rendered

    def test_a_project_with_no_screens_writes_no_ledger(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            kept, loop.LEDGER = loop.LEDGER, Path(folder) / "screens.json"
            screens, loop.every_screen = loop.every_screen, list
            try:
                self.assertEqual(loop.remember_screens([], "1.50.0"), ([], 0))
                self.assertFalse(loop.LEDGER.exists())
            finally:
                loop.LEDGER, loop.every_screen = kept, screens

    def test_a_tag_is_read_from_a_title_with_an_apostrophe_in_it(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            spec = Path(folder) / "a.spec.ts"
            spec.write_text('test("the round\'s best word @a-tag", async () => {', encoding="utf-8")
            kept, loop.RENDERED_TESTS = loop.RENDERED_TESTS, Path(folder)
            try:
                self.assertEqual(loop.every_screen(), ["@a-tag"])
            finally:
                loop.RENDERED_TESTS = kept


class TheNeglectLine(unittest.TestCase):
    """5 names must never stand in for an unknown number of screens."""

    def test_it_says_how_many_and_how_many_more(self) -> None:
        line = loop.neglect_line([("@a", "never"), ("@b", "1.2.0")], 64)
        self.assertIn("64 screen(s)", line)
        self.assertIn("and 62 more", line)

    def test_no_more_when_the_names_are_all_of_them(self) -> None:
        line = loop.neglect_line([("@a", "never")], 1)
        self.assertNotIn("more", line)
        self.assertIn("1 screen(s)", line)

    def test_every_name_carries_when_it_last_ran(self) -> None:
        line = loop.neglect_line([("@a", "never"), ("@b", "1.44.0")], 2)
        self.assertIn("@a (never)", line)
        self.assertIn("@b (1.44.0)", line)


class WhatTheInstallerStamps(unittest.TestCase):
    """A product that stamps a version has to say where, or a rollback restores nothing."""

    def setUp(self) -> None:
        self.kept = (loop.INSTALLER, loop.STAMPED)

    def tearDown(self) -> None:
        loop.INSTALLER, loop.STAMPED = self.kept

    def test_stamping_somewhere_unnamed_is_refused(self) -> None:
        loop.INSTALLER, loop.STAMPED = Path("installer.py"), ()
        with self.assertRaises(loop.Stop) as raised:
            loop.stamp_targets()
        self.assertIn("STAMPED is empty", str(raised.exception))

    def test_stamping_nowhere_and_naming_nothing_is_fine(self) -> None:
        # A library, a command-line tool, a folder of documents. Empty is an answer.
        loop.INSTALLER, loop.STAMPED = None, ()
        loop.stamp_targets()

    def test_a_named_file_that_is_not_there_is_refused_by_name(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            loop.INSTALLER = Path(folder) / "installer.py"
            loop.STAMPED = (Path(folder) / "nowhere.json",)
            with self.assertRaises(loop.Stop) as raised:
                loop.stamp_targets()
            self.assertIn("nowhere.json", str(raised.exception))

    def test_a_named_file_that_is_there_passes(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            target = Path(folder) / "package.json"
            target.write_text("{}", encoding="utf-8")
            loop.INSTALLER, loop.STAMPED = Path(folder) / "installer.py", (target,)
            loop.stamp_targets()


class AnAnswerThisProjectHasNotGivenYet(unittest.TestCase):
    """Adding an answer to the control must not crash the projects that predate it.

    This was found by the portability tests, not by reading: 5 of them stopped with
    `ImportError: cannot import name 'STAMPED'` the moment a new answer was added.
    Every project on the old file would have got a traceback on every command.
    """

    def test_a_missing_answer_reads_as_its_default(self) -> None:
        self.assertEqual(loop.answer("NOTHING_HAS_EVER_ANSWERED_THIS", ()), ())

    def test_an_answer_that_is_there_is_used(self) -> None:
        # Whatever this project actually said, not the default handed in.
        self.assertEqual(loop.answer("TRUNK", "not-this"), loop.project.TRUNK)

    def test_a_project_that_answered_nothing_at_all_still_loads(self) -> None:
        # The furthest version of the same problem: not a missing answer but a
        # missing file. It used to exit 1 with a page of instructions, which made
        # the first minute of every new project a configuration exercise.
        self.assertIn("ANSWERED", dir(loop))
        self.assertTrue(loop.TRUNK, "an unanswered project would merge into nothing")


class WhatTheControlSaysItIsRunning(unittest.TestCase):
    """A message may never assert the shape of somebody else's checks.

    "8 stages" was true of the project this control grew up in and of nothing else.
    In a project whose fast checks are one command it was simply a made-up number,
    printed as fact on every card.
    """

    def test_no_message_counts_stages_it_cannot_see(self) -> None:
        """Read as code, and only the strings that could ever be printed.

        This used to pair quotes with a regex across the whole file, which is not
        a tokeniser: whether any given literal was seen at all depended on how
        many quote characters happened to sit above it. It passed by luck, and an
        edit hundreds of lines away flipped the pairing and made it fail on the
        docstring that *explains* why "8 stages" was removed.

        So the source is parsed, and docstrings are skipped. Prose about a mistake
        is not the mistake.
        """
        tree = ast.parse(Path(loop.__file__).read_text(encoding="utf-8"))
        docstrings = set()
        for node in ast.walk(tree):
            if isinstance(node, (ast.Module, ast.ClassDef, ast.FunctionDef, ast.AsyncFunctionDef)):
                first = node.body[0] if node.body else None
                if isinstance(first, ast.Expr) and isinstance(first.value, ast.Constant):
                    docstrings.add(id(first.value))
        for node in ast.walk(tree):
            if not isinstance(node, ast.Constant) or not isinstance(node.value, str):
                continue
            if id(node) in docstrings:
                continue
            self.assertNotRegex(node.value, r"\d+ stages", "the control cannot know how many stages a project has")

    def test_headless_names_no_screens(self) -> None:
        self.assertEqual(loop.tier_detail("Headless", []), "everything fast that renders nothing, no screens")

    def test_scoped_names_every_screen_it_will_run(self) -> None:
        detail = loop.tier_detail("Scoped", ["@one", "@two"])
        self.assertIn("2 screens: @one, @two", detail)

    def test_one_screen_is_not_called_screens(self) -> None:
        self.assertIn("1 screen: @only", loop.tier_detail("Scoped", ["@only"]))

    def test_scoped_with_nothing_named_does_not_claim_screens(self) -> None:
        # Reachable when a card names screens the runner then filters away; better
        # to say "no screens" than to print "then 0 screens:" with nothing after it.
        self.assertEqual(loop.tier_detail("Scoped", []), "everything fast that renders nothing, no screens")


class ThePagesAgreeWithTheSystem(unittest.TestCase):
    """Two pages travel with this control, and a stale page is worse than none.

    Every drift found in one health check: the page said 3 system files when there
    were 4, said the answers live at the top of `loop.py` when they had moved to
    `project.py`, listed 7 of the 8 answers, and quoted a refusal in words the tool
    has never printed. Nothing checked any of it.
    """

    PAGES = ("README.md", "UPDATE.md")

    def page(self, name: str) -> str:
        return (Path(loop.__file__).with_name(name)).read_text(encoding="utf-8")

    def test_every_answer_the_control_reads_is_written_down(self) -> None:
        source = Path(loop.__file__).read_text(encoding="utf-8")
        # Wrapped ones count. `STAMPED` is `tuple(answer(...))` and `SWEEP` is
        # `int(answer(...))`, and reading only the bare form meant an answer
        # could be added, be read
        # on every command, and never appear on the page nobody would think to
        # check — which is exactly what this test exists to stop.
        answers = set(re.findall(r'^(\w+) = (?:\w+\()*answer\("(\w+)"', source, re.MULTILINE))
        self.assertTrue(answers, "no calibrated answers found — this test has stopped testing anything")
        readme = self.page("README.md")
        for _, name in sorted(answers):
            self.assertIn(name, readme, f"{name} is an answer this control reads and README.md never mentions it")

    def test_the_page_carries_the_bar_for_changing_the_control(self) -> None:
        """The one thing on this page that is about restraint rather than mechanics.

        Every control before this one grew until half of every week went on the
        loop instead of on the product, and it grew from reasonable changes. The
        page says what a change has to be worth. A page can be edited by anyone
        and prose has no other way of surviving, so this is how it survives.
        """
        readme = self.page("README.md")
        self.assertIn("## The bar for changing this", readme, "the bar is gone from the page")
        for promise in ("simpler, leaner, faster", "Do not volunteer imperfections"):
            self.assertIn(promise, readme, f"the page no longer says: {promise}")

    def test_the_adoption_page_says_an_adoption_changes_nothing_else(self) -> None:
        """The restraint rule aimed at the one session most likely to break it.

        An adoption reads all four files, a read finds something, fixing it makes
        this copy the newest, and the next project adopts and finds the next
        thing. That is weeks of the loop and none of the product. Prose is the
        only thing standing in the way of it, so it is pinned like the bar is.
        """
        update = self.page("UPDATE.md")
        self.assertIn("## An adoption is a copy, and nothing else", update, "the adoption rule is gone from the page")
        for promise in ("Park what you found", "actually stopped a card"):
            self.assertIn(promise, update, f"the page no longer says: {promise}")

    def test_both_pages_say_the_same_number_of_system_files(self) -> None:
        many = {1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six"}[len(loop.SYSTEM_FILES)]
        for name in self.PAGES:
            self.assertIn(many, self.page(name), f"{name} does not say there are {many} system files")

    def test_every_system_file_is_named_on_both_pages(self) -> None:
        for name in self.PAGES:
            page = self.page(name)
            for travelling in loop.SYSTEM_FILES:
                self.assertIn(travelling, page, f"{name} never mentions {travelling}, which travels")

    def test_both_pages_warn_that_the_local_files_never_travel(self) -> None:
        for name in self.PAGES:
            page = self.page(name)
            for local in ("project.py", "cards/", loop.LEDGER.name):
                self.assertIn(local, page, f"{name} never says {local} stays put")

    def test_neither_page_names_a_file_only_one_project_has(self) -> None:
        """The pages travel, so a path outside `control/` is a promise the next
        project cannot keep.

        `README.md` told every project to run `node scripts/capture.mjs` for its
        before-and-after pictures, and to keep its screen list in
        `scripts/screens.mjs`. Both are one project's own scripts; a project
        adopting this control gets a page naming commands it does not have — and
        by the time anyone finds out, `check` is already refusing to close a card
        for want of pictures nobody could take.

        `loop.py` never had this fault: it demands `after/` exists and says
        nothing at all about how a picture is made. `ProjectIndependence` pins
        that for the code. This pins the same rule for the prose.

        Narrow on purpose. The stricter version of this — deriving forbidden
        paths from the calibration and searching every travelling file — is the
        one described in `NothingLocalTravels`, and it could not work. This asks
        one question with no project in it: does every path with a file
        extension on these two pages live under `control/`?
        """
        anywhere = re.compile(r"[\w<>./-]*/[\w<>.-]+\.(?:py|mjs|js|ts|tsx|sh|json|toml|yml|yaml)")
        for name in self.PAGES:
            for path in anywhere.findall(self.page(name)):
                self.assertIn(
                    "control/",
                    path,
                    f"{name} names {path}, which only this project has — say what is needed, not which file does it",
                )

    def test_the_pages_do_not_send_anyone_to_the_wrong_file_for_the_answers(self) -> None:
        # They lived at the top of the system file once. A page that still says so
        # sends the next adoption to edit the one file it must never edit.
        readme = self.page("README.md")
        self.assertNotIn("top of `control/loop.py`", readme)
        self.assertIn("control/project.py", readme)


class ChangingTheControlIsNotPaperwork(unittest.TestCase):
    """A card that edits the control runs the fast checks, page or no page.

    5 cards in a row changed `loop.py` and closed with `no tier ran`, because
    `control/` is paperwork. A lint error sat in the control for all 5 of them and
    the first thing to notice was a hand-run of the suite.
    """

    def test_a_control_source_file_earns_a_tier(self) -> None:
        self.assertEqual(loop.tier_for(["control/loop.py"], []), "Headless")

    def test_and_a_screen_named_beside_it_still_makes_it_scoped(self) -> None:
        self.assertEqual(loop.tier_for(["control/loop.py"], ["@a"]), "Scoped")

    def test_a_page_beside_the_control_is_still_paperwork(self) -> None:
        self.assertEqual(loop.tier_for(["control/README.md", "control/UPDATE.md"], []), "none")

    def test_a_card_is_never_the_control_however_it_is_spelled(self) -> None:
        # A workshop may hold a throwaway Python probe. That is not the control.
        self.assertFalse(loop.is_the_control_itself("control/cards/a-card/probe.py"))
        self.assertEqual(loop.tier_for(["control/cards/a-card/card.md"], []), "none")

    def test_the_answers_file_counts_too(self) -> None:
        # Miscalibrating is exactly the change most worth running the checks after.
        self.assertTrue(loop.is_the_control_itself("control/project.py"))


# At the end, and it has to stay there. It sat two thirds of the way up this
# file once, so `python3 control/test_loop.py` ran 22 of 92 tests and printed OK
# — everything defined below it never even loaded. A suite that reports green
# having skipped most of itself is worse than one that will not run at all.
if __name__ == "__main__":
    unittest.main()


class TheWorkshopPrune(unittest.TestCase):
    """Dropping the pictures of cards nobody is comparing against any more.

    Every test here builds a real folder and a real Git repository rather than
    stubbing one, because the two things most worth proving — that the ordering
    comes from commits and that a tracked file is never touched — are facts about
    Git and cannot be proved against a fake.
    """

    def setUp(self) -> None:
        self.folder = tempfile.TemporaryDirectory()
        self.root = Path(self.folder.name)
        self.kept = (loop.ROOT, loop.CARDS)
        loop.ROOT, loop.CARDS = self.root, self.root / "control" / "cards"
        loop.CARDS.mkdir(parents=True)
        self.here("init", "-q", "-b", "main")
        self.here("config", "user.email", "a@b.c")
        self.here("config", "user.name", "Test")
        (self.root / ".gitignore").write_text(
            "control/cards/*/before/\ncontrol/cards/*/after/\n", encoding="utf-8"
        )
        self.here("add", "-A")
        self.here("commit", "-qm", "ignore the pictures")

    def tearDown(self) -> None:
        loop.ROOT, loop.CARDS = self.kept
        self.folder.cleanup()

    def here(self, *args: str) -> None:
        subprocess.run(["git", *args], cwd=self.root, check=True, capture_output=True, text=True)

    def close_card(self, slug: str, *, pictures: bool = True, tracked: bool = False) -> Path:
        """One card, committed the way `finish` commits one."""
        card = loop.CARDS / slug
        (card / "after").mkdir(parents=True)
        (card / "card.md").write_text(f"# {slug}\n\nbump: patch\n\nBody.\n", encoding="utf-8")
        if pictures:
            (card / "after" / "01.png").write_bytes(b"not really a png")
        self.here("add", "-A")
        if tracked and pictures:
            # A project that pushed pictures before they were ignored.
            self.here("add", "-f", "--", f"control/cards/{slug}/after/01.png")
        self.here("commit", "-qm", slug)
        return card

    def test_the_order_comes_from_commits_and_not_from_the_disk(self) -> None:
        for slug in ("first", "second", "third"):
            self.close_card(slug)
        # Touched out of order on purpose: a modification time is reset by a clone,
        # a copy or a restore, so anything reading them would order these wrongly.
        (loop.CARDS / "first" / "card.md").touch()
        self.assertEqual(loop.cards_newest_first(), ["third", "second", "first"])

    def test_a_card_git_has_never_seen_is_not_in_the_order(self) -> None:
        self.close_card("closed")
        (loop.CARDS / "being-worked-on" / "after").mkdir(parents=True)
        # It is somebody's open card. It has no commit, so it cannot be ranked and
        # must never be pruned.
        self.assertEqual(loop.cards_newest_first(), ["closed"])

    def test_nothing_is_dropped_while_the_project_is_younger_than_the_window(self) -> None:
        for slug in ("one", "two", "three"):
            self.close_card(slug)
        self.assertEqual(loop.prune_workshops(25), [])
        for slug in ("one", "two", "three"):
            self.assertTrue((loop.CARDS / slug / "after" / "01.png").exists(), slug)

    def test_the_newest_keep_their_pictures_and_the_rest_lose_them(self) -> None:
        for slug in ("oldest", "middle", "newest"):
            self.close_card(slug)
        self.assertEqual(loop.prune_workshops(2), ["oldest/after"])
        self.assertFalse((loop.CARDS / "oldest" / "after").exists())
        self.assertTrue((loop.CARDS / "middle" / "after" / "01.png").exists())
        self.assertTrue((loop.CARDS / "newest" / "after" / "01.png").exists())

    def test_the_card_s_own_words_are_never_touched(self) -> None:
        for slug in ("oldest", "newest"):
            self.close_card(slug)
        loop.prune_workshops(1)
        # The whole point of pruning pictures rather than cards: the record stays,
        # on disk and on the remote, and the tree does not go dirty.
        self.assertTrue((loop.CARDS / "oldest" / "card.md").is_file())
        self.assertEqual(
            subprocess.run(
                ["git", "status", "--porcelain"],
                cwd=self.root,
                capture_output=True,
                text=True,
                check=True,
            ).stdout.strip(),
            "",
        )

    def test_a_picture_git_is_carrying_is_never_deleted(self) -> None:
        self.close_card("oldest", tracked=True)
        self.close_card("newest")
        self.assertEqual(loop.prune_workshops(1), [])
        # Deleting it would show as a deletion, dirty the tree, refuse the next
        # start, and reach the remote on the following close.
        self.assertTrue((loop.CARDS / "oldest" / "after" / "01.png").exists())

    def test_a_folder_holding_anything_else_keeps_its_folder(self) -> None:
        card = self.close_card("oldest")
        self.close_card("newest")
        (card / "after" / "why.md").write_text("a note somebody left", encoding="utf-8")
        self.here("add", "-f", "--", "control/cards/oldest/after/why.md")
        self.here("commit", "-qm", "a note")
        self.assertEqual(loop.prune_workshops(1), [])
        self.assertFalse((card / "after" / "01.png").exists())
        self.assertTrue((card / "after" / "why.md").is_file())

    def test_the_card_being_worked_on_is_never_pruned(self) -> None:
        # "Git has not seen it" used to stand in for "it is open", and the two are
        # not the same: committing a card as work in progress is an ordinary thing
        # to do, and it made that card's pictures prunable while it was being
        # worked on. A stress test lost a card's pictures exactly that way.
        card = self.close_card("mine")
        self.close_card("newer")
        open_at, loop.open_card_slug = loop.open_card_slug, lambda: "mine"
        try:
            # Keeping none at all, so nothing but the open card can survive — and
            # it does, which is the point. `newer` going is correct.
            dropped = loop.prune_workshops(0)
            self.assertNotIn("mine/after", dropped)
            self.assertEqual(dropped, ["newer/after"])
            self.assertTrue((card / "after" / "01.png").exists())
        finally:
            loop.open_card_slug = open_at

    def test_it_only_looks_back_as_far_as_it_needs_to(self) -> None:
        for slug in ("one", "two", "three", "four"):
            self.close_card(slug)
        # Unbounded, this walks every commit that ever added a card — 1.5 seconds
        # at 1200 of them, on every close, growing for ever. The answer at the
        # front is the same either way, and the front is all the pruner reads.
        self.assertEqual(loop.cards_newest_first(2), ["four", "three"])
        self.assertEqual(loop.cards_newest_first()[:2], ["four", "three"])

    def test_the_words_it_carries_are_read_from_the_index(self) -> None:
        self.close_card("kept")
        (loop.CARDS / "never-committed").mkdir()
        self.assertEqual(loop.tracked_cards(), {"kept"})

    def test_a_card_with_no_pictures_costs_nothing_and_says_nothing(self) -> None:
        self.close_card("oldest", pictures=False)
        (loop.CARDS / "oldest" / "after").rmdir()
        self.close_card("newest")
        self.assertEqual(loop.prune_workshops(1), [])

    def test_a_prune_that_cannot_run_never_fails_a_close(self) -> None:
        # It runs after the card is committed, merged, tagged and pushed. Nothing
        # about tidying a folder is worth failing a close that already succeeded —
        # and "nothing" means whatever went wrong, not a list of the two kinds
        # somebody thought of. A stress test broke it with a TypeError.
        for blow_up in (self.raise_stop, self.raise_os, self.raise_anything):
            order, loop.cards_newest_first = loop.cards_newest_first, blow_up
            try:
                self.assertEqual(loop.prune_workshops(1), [], blow_up.__name__)
            finally:
                loop.cards_newest_first = order

    @staticmethod
    def raise_stop(most: int | None = None) -> list[str]:
        raise loop.Stop("git is not available here")

    @staticmethod
    def raise_os(most: int | None = None) -> list[str]:
        raise OSError("the disk went away")

    @staticmethod
    def raise_anything(most: int | None = None) -> list[str]:
        raise TypeError("somebody changed this signature")


class SayingWhatWasPruned(unittest.TestCase):
    def test_a_close_that_dropped_nothing_says_nothing(self) -> None:
        printed: list[str] = []
        said, loop.say = loop.say, printed.append
        try:
            loop.say_pruned([])
            self.assertEqual(printed, [])
        finally:
            loop.say = said

    def test_a_long_list_is_counted_rather_than_recited(self) -> None:
        printed: list[str] = []
        said, loop.say = loop.say, printed.append
        try:
            loop.say_pruned([f"card-{one}/after" for one in range(7)])
            self.assertIn("dropped 7 picture folder(s)", printed[0])
            self.assertIn("and 4 more", printed[0])
        finally:
            loop.say = said


class TheAnswersThatHaveDefaults(unittest.TestCase):
    """Two numbers a project may set and almost every project will not.

    `SWEEP` and `KEEP` were written into the system as plain constants, which made
    the control decide something that depends entirely on the product: a screen
    test taking half a minute is a different bargain from one taking two seconds,
    and a product photographing a phone at three times scale cannot keep as many
    pictures as one whose screens are a few kilobytes. Answered with a default,
    a project that says nothing is unaffected and one that cares can say so.
    """

    def source(self) -> str:
        return Path(loop.__file__).read_text(encoding="utf-8")

    def test_both_are_answered_rather_than_fixed_in_the_system(self) -> None:
        source = self.source()
        for name in ("SWEEP", "KEEP"):
            self.assertRegex(
                source,
                rf'(?m)^{name} = int\(answer\("{name}", \d+\)\)',
                f"{name} is fixed in the control rather than answered by the project",
            )

    @staticmethod
    def control_seeing(**answers: int):
        """A second, independent copy of the control, loaded as a project would.

        Not a reload of the one under test — that would leave every other test in
        this file looking at whichever module happened to survive. This builds a
        fresh one from the same source with the answers set first, which is the
        order a real project has: `project.py` is read on import.
        """
        for name, value in answers.items():
            setattr(loop.project, name, value)
        try:
            fresh = importlib.util.spec_from_file_location("loop_again", Path(loop.__file__))
            module = importlib.util.module_from_spec(fresh)
            fresh.loader.exec_module(module)
            return module
        finally:
            for name in answers:
                delattr(loop.project, name)

    def test_a_project_that_says_nothing_runs_on_the_documented_defaults(self) -> None:
        # Asked of a control loaded with the answers taken away, never of this
        # project's own values. An earlier version asserted that *this* project
        # answered neither, which is true here and false in any project that
        # answers one — and these tests are run inside the target before an update
        # is allowed to land, so a test about this project blocks that adoption.
        put_back = {
            name: getattr(loop.project, name)
            for name in ("SWEEP", "KEEP")
            if hasattr(loop.project, name)
        }
        for name in put_back:
            delattr(loop.project, name)
        try:
            bare = self.control_seeing()
            self.assertEqual((bare.SWEEP, bare.KEEP), (3, 25))
        finally:
            for name, value in put_back.items():
                setattr(loop.project, name, value)

    def test_a_project_that_answers_them_is_obeyed_all_the_way_down(self) -> None:
        theirs = self.control_seeing(SWEEP=7, KEEP=2)
        self.assertEqual((theirs.SWEEP, theirs.KEEP), (7, 2))
        # And the functions that use them, not merely the names: a constant read
        # into a default argument at definition time is the thing that could have
        # been wired up wrongly and still passed a check on the name alone.
        self.assertEqual(
            theirs.prune_workshops.__defaults__, (2,), "prune ignored the project's KEEP"
        )
        self.assertEqual(theirs.sweeping.__defaults__, (7,), "the sweep ignored the project's SWEEP")

    def test_neither_can_refuse_a_project_that_predates_them(self) -> None:
        # A missing answer must never raise, or adding one to the control would
        # break every project that had not hand-edited its own file.
        self.assertEqual(loop.answer("SWEEP", 3), 3)
        self.assertEqual(loop.answer("KEEP", 25), 25)


class TheSystemNamesNoProject(unittest.TestCase):
    """Nothing that travels may name the project it happens to be sitting in.

    The four system files are copied verbatim into every other project. A fact
    about this one stated in any of them arrives there as a lie, and the control
    has that scar already: one project's test folder was once written into a rule
    and matched nothing anywhere else. This is the cheap general guard — a page
    that names its own project is a page somebody wrote from where they were
    standing.
    """

    #: Words the control says about itself, so a project called one of them is not
    #: accused of having leaked into a file that was always going to contain it.
    #: A blunt exception rather than a clever test: this guard is a heuristic, and
    #: a heuristic that blocks an adoption is worse than one with a hole in it.
    ITS_OWN = frozenset(
        {"control", "cards", "card", "loop", "git", "project", "update", "readme", "screens", "docs"}
    )

    def test_no_travelling_file_names_the_project_it_is_in(self) -> None:
        here = loop.ROOT.name.lower()
        if here in self.ITS_OWN:
            self.skipTest(f"this project is called {here}, which the control says about itself")
        for name in loop.SYSTEM_FILES:
            text = (Path(loop.__file__).with_name(name)).read_text(encoding="utf-8")
            self.assertNotIn(here, text.lower(), f"{name} travels to every project and names this one")

    def test_a_project_named_after_the_control_is_not_accused(self) -> None:
        # Adoption must never be blocked by what somebody called their folder.
        for word in ("control", "cards", "loop"):
            self.assertIn(word, self.ITS_OWN)


class TheControlRunsOneTool(unittest.TestCase):
    """Everything the control executes by name, and there is only one.

    Git is the one hard requirement — the branch is the card, the tag is the
    version, and the rollback is Git — so the control names it and nothing else.
    Every other command a project needs comes from `project.py`: what runs fast,
    what drives a screen, what stamps a release. A build tool, a test runner or a
    package manager written into `loop.py` would be this control deciding that
    every project it is ever copied into uses the same stack.

    Read from the syntax tree rather than by searching for words, because prose is
    full of false positives — `README.md` says "make" as a verb twice — and what
    matters is not what a file mentions but what it runs.
    """

    @staticmethod
    def executables() -> list[str]:
        """Every command spelled out in the source, as opposed to answered.

        A list whose first element is a plain string is a command the control
        chose. One starting with `sys.executable` is the Python it is already
        running in, and one starting with `*RENDERED` came from the project — both
        are Starred or Attribute nodes rather than constants, so neither shows up
        here, which is exactly right.
        """
        tree = ast.parse(Path(loop.__file__).read_text(encoding="utf-8"))
        named: list[str] = []
        for node in ast.walk(tree):
            if not isinstance(node, ast.Call):
                continue
            called = node.func
            name = called.attr if isinstance(called, ast.Attribute) else getattr(called, "id", "")
            if name != "run":
                continue
            for argument in node.args:
                if not isinstance(argument, ast.List) or not argument.elts:
                    continue
                first = argument.elts[0]
                if isinstance(first, ast.Constant) and isinstance(first.value, str):
                    named.append(first.value)
        return named

    def test_the_only_tool_it_names_is_git(self) -> None:
        found = self.executables()
        self.assertTrue(found, "no commands found at all — this test has stopped testing anything")
        self.assertEqual(sorted(set(found)), ["git"])

    def test_a_stack_specific_command_would_be_caught(self) -> None:
        # Written the way somebody would really write it, so the guard is proved
        # against the mistake rather than against a tidy example of one.
        leak = ast.parse('run(["npm", "run", "build"], timeout=60)')
        call = leak.body[0].value
        self.assertEqual(call.args[0].elts[0].value, "npm")

    def test_what_a_project_answers_is_never_counted(self) -> None:
        # `run([*RENDERED, *named])` is the control running whatever this project
        # said. It must not read as the control choosing a tool.
        passed = ast.parse('run([*RENDERED, *named])')
        call = passed.body[0].value
        self.assertNotIsInstance(call.args[0].elts[0], ast.Constant)


class TheContractPointsAtRealTests(unittest.TestCase):
    """Every test named in `loop.py`'s own contract exists.

    The contract sends whoever is changing the control to the tests that hold it
    rather than restating them, which is the right way round — and it makes those
    names a thing that can go stale. The first draft of it cited a class that had
    never existed, invented while writing the paragraph.
    """

    def test_every_class_the_contract_names_is_a_class(self) -> None:
        contract = ast.get_docstring(ast.parse(Path(loop.__file__).read_text(encoding="utf-8")))
        self.assertIn("Changing this file", contract or "", "the contract has gone from loop.py")
        # Every backticked CamelCase word. Narrower than that — a list of the
        # names already known — is a guard that only catches names it was told
        # about, which the first version of this test was, and it passed happily
        # while the contract pointed at a class that did not exist.
        # `project.py` has a dot, `update` is lower case, and `KEEP` and
        # `CONTROL_VERSION` are shouted — a class name is the only backticked word
        # that starts upper and then goes on in lower case.
        cited = {
            name
            for name in re.findall(r"`([A-Z][A-Za-z]+)`", contract)
            if not name.isupper()
        }
        self.assertTrue(cited, "the contract names no tests — it has stopped pointing anywhere")

        tests = ast.parse(Path(__file__).read_text(encoding="utf-8"))
        classes = {node.name for node in tests.body if isinstance(node, ast.ClassDef)}
        missing = sorted(cited - classes)
        self.assertEqual(missing, [], "the contract in loop.py names tests that do not exist")


class TellingSomebodyWhatToDoNext(unittest.TestCase):
    """The two places this control used to leave somebody at a dead end."""

    def test_an_update_says_to_commit_before_the_next_card(self) -> None:
        # It leaves the four files uncommitted so Git alone can undo it, and
        # `start` refuses a dirty tree — so "done" on its own walked whoever ran
        # it straight into a refusal on their next command.
        source = Path(loop.__file__).read_text(encoding="utf-8")
        closing = re.search(r'say\(f?"Done — commit those four files[^"]*"\)', source)
        self.assertIsNotNone(closing, "update no longer says what to do before the next card")

    def test_the_page_says_it_too(self) -> None:
        page = (Path(loop.__file__).with_name("UPDATE.md")).read_text(encoding="utf-8")
        check = page[page.index("## Check it worked") :]
        self.assertIn("git commit", check, "the page still sends somebody into a refusal")
        self.assertLess(
            check.index("git commit"),
            check.index("loop.py start"),
            "the page says to commit after starting a card, which is the wrong way round",
        )


class SayingWhatWentIntoGit(unittest.TestCase):
    """A project still committing its card pictures is told, once per card."""

    def setUp(self) -> None:
        self.folder = tempfile.TemporaryDirectory()
        self.root = Path(self.folder.name)
        self.kept = (loop.ROOT, loop.CARDS)
        loop.ROOT, loop.CARDS = self.root, self.root / "control" / "cards"
        loop.CARDS.mkdir(parents=True)
        subprocess.run(["git", "init", "-q", "-b", "main"], cwd=self.root, check=True)
        for pair in (("user.email", "a@b.c"), ("user.name", "T")):
            subprocess.run(["git", "config", *pair], cwd=self.root, check=True)
        self.printed: list[str] = []
        self.said, loop.say = loop.say, self.printed.append

    def tearDown(self) -> None:
        loop.ROOT, loop.CARDS = self.kept
        loop.say = self.said
        self.folder.cleanup()

    def card_with_pictures(self, slug: str, *, ignored: bool) -> Path:
        if ignored:
            (self.root / ".gitignore").write_text(
                "control/cards/*/before/\ncontrol/cards/*/after/\n", encoding="utf-8"
            )
        card = loop.CARDS / slug
        (card / "after").mkdir(parents=True)
        (card / "card.md").write_text("# c\n\nbump: patch\n\nBody.\n", encoding="utf-8")
        (card / "after" / "01.png").write_bytes(b"png")
        subprocess.run(["git", "add", "-A"], cwd=self.root, check=True, capture_output=True)
        subprocess.run(["git", "commit", "-qm", slug], cwd=self.root, check=True, capture_output=True)
        return card

    def test_a_card_that_pushed_its_pictures_is_told_what_to_add(self) -> None:
        card = self.card_with_pictures("noisy", ignored=False)
        loop.say_if_pictures_were_pushed(card)
        self.assertEqual(len(self.printed), 1)
        said = self.printed[0]
        self.assertIn("went into Git", said)
        # The remedy, spelled out, because a warning without one is just a worry.
        self.assertIn("control/cards/*/before/", said)
        self.assertIn("control/cards/*/after/", said)

    def test_a_card_whose_pictures_stayed_on_disk_hears_nothing(self) -> None:
        card = self.card_with_pictures("quiet", ignored=True)
        loop.say_if_pictures_were_pushed(card)
        # Silence is the whole point: this project ignores them, and a line on
        # every close for ever is how a useful notice becomes one nobody reads.
        self.assertEqual(self.printed, [])

    def test_a_card_with_no_pictures_at_all_hears_nothing(self) -> None:
        card = loop.CARDS / "wordy"
        card.mkdir(parents=True)
        (card / "card.md").write_text("# c\n\nbump: patch\n\nBody.\n", encoding="utf-8")
        loop.say_if_pictures_were_pushed(card)
        self.assertEqual(self.printed, [])


class TheCloseCountsItsOwnTidying(unittest.TestCase):
    def test_the_tidy_is_inside_the_clock(self) -> None:
        # It used to sit outside it, so a close that really took 2.3 seconds
        # reported 0.6 — the pruning was the missing 1.7 and nobody could see it.
        source = Path(loop.__file__).read_text(encoding="utf-8")
        for line in source.splitlines():
            if "prune_workshops()" in line and "def " not in line:
                self.assertIn(
                    "        ",
                    line[: len(line) - len(line.lstrip())] + "        ",
                    "the prune is not inside a timed block",
                )
        self.assertIn('with timed("tidy"):', source, "the tidying is not timed at all")


class LeavingNothingBehind(unittest.TestCase):
    """The control does not litter the project it is installed in.

    Importing `project.py` used to write `control/__pycache__/`. An untracked
    folder is a dirty tree and a dirty tree is what `start` refuses, so a project
    that had just adopted this control could never open its first card — and every
    command run to find out why made the folder again. The projects that survived
    it had `__pycache__/` in `.gitignore` already and never knew.
    """

    def test_bytecode_is_turned_off_before_anything_is_imported(self) -> None:
        source = Path(loop.__file__).read_text(encoding="utf-8")
        off = source.index("sys.dont_write_bytecode = True")
        # Before `import project`, or the answers are compiled on the way past and
        # the folder exists before the flag is ever read.
        self.assertLess(off, source.index("import project"))

    def test_running_a_command_writes_no_bytecode(self) -> None:
        # The real thing rather than a reading of the source: a fresh interpreter,
        # the module imported the way `loop.py` imports it, and nothing left.
        with tempfile.TemporaryDirectory() as folder:
            here = Path(folder)
            for name in ("loop.py", "project.py"):
                (here / name).write_bytes(Path(loop.__file__).with_name(name).read_bytes())
            done = subprocess.run(
                [sys.executable, str(here / "loop.py"), "check"],
                cwd=here,
                capture_output=True,
                text=True,
            )
            self.assertNotIn("Traceback", done.stderr, done.stderr)
            self.assertFalse((here / "__pycache__").exists(), "a command left bytecode behind")


class TheAdoptionPageCanBeFollowed(unittest.TestCase):
    """Section B's steps, in the order they actually work.

    The order this page used to give did not: it sent somebody to `start` while
    the tree was still dirty, so no trial card was ever created, and then told
    them to delete a branch that had never existed. `start` checks the answers
    before it checks the tree, which is why the refusal looked like it was working.
    """

    def page(self) -> str:
        return (Path(loop.__file__).with_name("UPDATE.md")).read_text(encoding="utf-8")

    def test_the_commit_comes_before_the_trial_card(self) -> None:
        section = self.page()
        section = section[section.index("## B. No control at all") : section.index("## C. ")]
        self.assertLess(
            section.index("git commit"),
            section.index('loop.py start "anything"'),
            "section B still sends somebody to start with a dirty tree",
        )

    def test_the_page_says_to_ignore_the_bytecode(self) -> None:
        self.assertIn("__pycache__/", self.page())


class AControlThatIsBehindWillNotBeChanged(unittest.TestCase):
    """The one way an improvement to the control can be lost.

    Nobody owns it. It is worked on wherever the work happens, and the newest
    copy anywhere is the real one — so two projects both editing `loop.py` is a
    fork, and an update is a copy rather than a merge. The copy throws the older
    side away without saying so.

    A fork is only possible while a project is behind, so being behind is what
    gets refused, and only on the cards that would actually cause one.
    """

    def elsewhere(self, *projects: tuple[str, str]) -> Path:
        """A folder of projects, each holding a control on the version given."""
        room = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, room, ignore_errors=True)
        for name, version in projects:
            control = room / name / "control"
            control.mkdir(parents=True)
            (control / "loop.py").write_text(f'CONTROL_VERSION = "{version}"\n', encoding="utf-8")
        return room

    def copy_of_here(self, name: str, *, changed: bool) -> Path:
        """A project holding this very control, byte for byte or one byte off."""
        room = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, room, ignore_errors=True)
        control = room / name / "control"
        control.mkdir(parents=True)
        for system in loop.SYSTEM_FILES:
            body = (Path(loop.__file__).with_name(system)).read_bytes()
            control.joinpath(system).write_bytes(body + (b"\n# edited\n" if changed and system == "UPDATE.md" else b""))
        return room

    def looking_at(self, room: Path):
        """This control, told to look there and nowhere else."""
        setattr(loop.project, "SIBLINGS", (room,))
        try:
            fresh = importlib.util.spec_from_file_location("loop_siblings", Path(loop.__file__))
            module = importlib.util.module_from_spec(fresh)
            fresh.loader.exec_module(module)
            return module
        finally:
            delattr(loop.project, "SIBLINGS")

    def test_it_finds_the_other_copies_and_says_which_is_ahead(self) -> None:
        control = self.looking_at(self.elsewhere(("Older", "2"), ("Newer", "99")))
        self.assertEqual(
            {name for name, _, _ in control.controls_elsewhere()}, {"Older", "Newer"}
        )
        self.assertEqual([name for name, _, _ in control.ahead_of_here()], ["Newer"])

    def test_a_card_that_changes_the_control_from_behind_is_refused(self) -> None:
        control = self.looking_at(self.elsewhere(("Newer", "99")))
        card = "# A title\n\nbump: patch\n\nA body.\n"
        found = control.problems(Path("card.md"), card, ["control/loop.py"])
        self.assertTrue(
            any("fork" in one for one in found),
            f"changing the control from behind was allowed: {found}",
        )

    def test_a_card_that_changes_nothing_in_the_control_is_never_asked(self) -> None:
        control = self.looking_at(self.elsewhere(("Newer", "99")))
        card = "# A title\n\nbump: patch\n\nA body.\n"
        found = control.problems(Path("card.md"), card, ["docs/notes.md"])
        self.assertFalse([one for one in found if "fork" in one], found)

    def test_being_the_newest_is_not_refused(self) -> None:
        control = self.looking_at(self.elsewhere(("Older", "1")))
        card = "# A title\n\nbump: patch\n\nA body.\n"
        found = control.problems(Path("card.md"), card, ["control/loop.py"])
        self.assertFalse([one for one in found if "fork" in one], found)

    def test_the_same_version_holding_different_files_is_caught(self) -> None:
        """The one thing a version number cannot say about itself.

        Edit `loop.py` and forget to raise the number, and every project that
        checks sees a number that agrees and content that does not. Nothing said a
        word, and the fork only surfaced when one copy overwrote the other.
        """
        control = self.looking_at(self.copy_of_here("Twin", changed=True))
        self.assertEqual(control.diverged_from_here(), ["Twin"])
        card = "# A title\n\nbump: patch\n\nA body.\n"
        found = control.problems(Path("card.md"), card, ["control/loop.py"])
        self.assertTrue(
            any("calls itself control" in one for one in found),
            f"a silent fork was allowed: {found}",
        )

    def test_the_same_version_holding_the_same_files_is_fine(self) -> None:
        control = self.looking_at(self.copy_of_here("Twin", changed=False))
        self.assertEqual(control.diverged_from_here(), [])
        card = "# A title\n\nbump: patch\n\nA body.\n"
        found = control.problems(Path("card.md"), card, ["control/loop.py"])
        self.assertFalse([one for one in found if "calls itself control" in one], found)

    def test_a_copy_that_is_simply_behind_is_not_called_a_fork(self) -> None:
        control = self.looking_at(self.elsewhere(("Older", "1")))
        self.assertEqual(control.diverged_from_here(), [])

    def test_a_fingerprint_needs_every_system_file(self) -> None:
        room = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, room, ignore_errors=True)
        (room / "control").mkdir(parents=True)
        (room / "control" / "loop.py").write_text("CONTROL_VERSION = \"7\"\n", encoding="utf-8")
        self.assertIsNone(loop.fingerprint(room / "control"), "a half-copied control was fingerprinted anyway")

    def test_being_behind_is_said_before_a_disagreement_about_this_version(self) -> None:
        # Both can be true at once, and only one of them is worth acting on:
        # adopting the newer copy settles the other by replacing it.
        control = self.looking_at(self.elsewhere(("Newer", "99")))
        card = "# A title\n\nbump: patch\n\nA body.\n"
        found = [one for one in control.problems(Path("card.md"), card, ["control/loop.py"]) if "fork" in one or "calls itself" in one]
        self.assertEqual(len(found), 1, found)
        self.assertIn("adopt the newer one", found[0])

    def test_a_folder_that_is_not_there_is_not_an_error(self) -> None:
        control = self.looking_at(Path("/no/such/place/at/all"))
        self.assertEqual(control.controls_elsewhere(), [])

    def test_looking_nowhere_is_a_thing_a_project_may_answer(self) -> None:
        setattr(loop.project, "SIBLINGS", ())
        try:
            fresh = importlib.util.spec_from_file_location("loop_nowhere", Path(loop.__file__))
            module = importlib.util.module_from_spec(fresh)
            fresh.loader.exec_module(module)
            self.assertEqual(module.controls_elsewhere(), [])
        finally:
            delattr(loop.project, "SIBLINGS")

    def test_a_project_that_answers_nothing_looks_two_levels_wide(self) -> None:
        """The default reaches the whole tree, not the shelf this project is on.

        A project sits at `<somewhere>/<heading>/<project>`, and the copy that is
        ahead is almost never on the same shelf — it is a tool, or an app, or the
        one project kept under a heading nobody thought to list. Looking only
        beside this project found none of them, and the six headings named by
        hand to work around that missed the seventh the day it was created.
        """
        room = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, room, ignore_errors=True)
        for where in ("Games/Beside", "Tools/UnderAnother", "AtTheTop"):
            control = room / where / "control"
            control.mkdir(parents=True)
            (control / "loop.py").write_text('CONTROL_VERSION = "99"\n', encoding="utf-8")

        found = {name for name, _, _ in loop.controls_elsewhere(here=room / "Games" / "Mine")}
        self.assertEqual(
            found,
            {"Beside", "UnderAnother", "AtTheTop"},
            "the default search did not reach every depth a project is kept at",
        )

    def test_the_default_search_is_not_run_until_it_is_asked_for(self) -> None:
        """Import must not touch the disk for this.

        The whole reason the check is affordable is that a card leaving the
        control alone never pays for it. A default worked out while the module
        loads is a directory sweep on `start`, on every `check`, and on every
        `finish` — paid by every card, to answer a question almost none of them
        ask.
        """
        source = Path(loop.__file__).read_text(encoding="utf-8")
        top = source.split("def looking_in", 1)[0]
        self.assertNotIn(
            "iterdir()",
            top,
            "the search folders are worked out at import, so every command pays for a disk sweep",
        )


class ACardCanSayTheChangeIsNotOneYouCanSee(WithAnswers):
    """`unrendered:`, and the two things it is allowed to buy.

    Files a person can look at and a change a person can look at are not the same
    thing. A sound, a save format, a constant nothing draws — all live among the
    pixels, and all were asked for a screen test and a photograph of a screen that
    had not moved. Seven cards in one sitting attached identical pictures, which is
    a record saying a screen was checked when it was not.
    """

    CARD = "# A title\n\nbump: patch\nunrendered: sound only, proved by @a-sound-test\n\nA body.\n"

    def files(self, *paths: str) -> list[str]:
        return [*paths, "control/cards/x/card.md"]

    def test_a_screen_change_that_says_it_needs_no_screen_test(self) -> None:
        found = loop.problems(Path("control/cards/x/card.md"), self.CARD, self.files(self.SCREEN))
        self.assertFalse([one for one in found if "screen:" in one and "name every test" in one], found)

    def test_and_needs_no_pictures(self) -> None:
        found = loop.problems(Path("control/cards/x/card.md"), self.CARD, self.files(self.SCREEN))
        self.assertFalse([one for one in found if "no pictures" in one], found)

    def test_without_it_both_are_still_demanded(self) -> None:
        plain = "# A title\n\nbump: patch\n\nA body.\n"
        found = loop.problems(Path("control/cards/x/card.md"), plain, self.files(self.SCREEN))
        self.assertTrue([one for one in found if "name every test" in one], found)
        self.assertTrue([one for one in found if "no pictures" in one], found)

    def test_an_empty_one_is_refused(self) -> None:
        card = "# A title\n\nbump: patch\nunrendered:\n\nA body.\n"
        found = loop.problems(Path("control/cards/x/card.md"), card, self.files(self.SCREEN))
        self.assertTrue([one for one in found if "`unrendered:` is empty" in one], found)

    def test_it_cannot_be_claimed_beside_a_named_screen(self) -> None:
        card = self.CARD.replace("A body.", "A body.").replace(
            "unrendered: sound only, proved by @a-sound-test",
            "unrendered: sound only\nscreen: @something",
        )
        found = loop.problems(Path("control/cards/x/card.md"), card, self.files(self.SCREEN))
        self.assertTrue([one for one in found if "both" in one], found)

    def test_it_cannot_be_claimed_when_no_screen_file_changed(self) -> None:
        found = loop.problems(Path("control/cards/x/card.md"), self.CARD, self.files("docs/notes.md"))
        self.assertTrue([one for one in found if "no screen file changed" in one], found)

    def test_the_tier_is_headless_because_nothing_is_named(self) -> None:
        self.assertEqual(loop.tier_for([self.SCREEN], []), "Headless")

    def test_the_reason_reaches_the_commit(self) -> None:
        source = Path(loop.__file__).read_text(encoding="utf-8")
        self.assertIn('f"\\nUnrendered: {one}"', source, "the claim never reaches the history")

    def test_the_page_explains_it(self) -> None:
        readme = (Path(loop.__file__).with_name("README.md")).read_text(encoding="utf-8")
        self.assertIn("unrendered:", readme, "README.md never mentions the field")


def a_bare_project(room: Path) -> Path:
    """A git repository holding the control and answering nothing at all.

    No `project.py`, no test runner, no changelog, no remote. Git, markdown and a
    folder — which is what this control claims to need, so it is what the claim
    gets tested against.
    """
    home = room / "AProject"
    (home / "control").mkdir(parents=True)
    for name in loop.SYSTEM_FILES:
        source, target = loop.CONTROL / name, home / "control" / name
        target.write_bytes(source.read_bytes())
        target.chmod(source.stat().st_mode)
    (home / "README.md").write_text("# A project\n", encoding="utf-8")
    (home / ".gitignore").write_text("__pycache__/\n", encoding="utf-8")
    (home / "src").mkdir()
    (home / "src" / "thing.py").write_text("VALUE = 1\n", encoding="utf-8")
    for command in (
        ["git", "init", "--quiet"],
        # Rather than `init -b`, which is newer than some of the Git this may meet.
        ["git", "symbolic-ref", "HEAD", "refs/heads/main"],
        ["git", "config", "user.email", "control@example.invalid"],
        ["git", "config", "user.name", "The Control"],
        ["git", "add", "-A"],
        ["git", "commit", "--quiet", "-m", "A project"],
    ):
        subprocess.run(command, cwd=home, check=True, capture_output=True, text=True)
    return home


def loop_in(home: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, "control/loop.py", *args],
        cwd=home, capture_output=True, text=True, timeout=300, check=False,
    )


class ARepositoryThatAnswersNothing(unittest.TestCase):
    """The control dropped into a bare repository, with no `project.py` at all.

    This is the one path every project walks exactly once, and it was the least
    tested thing in the system. A project adopting the control found out what was
    wrong with adoption by doing it, then fixed the control to get past it — which
    made that project the newest copy, which the next project adopted, which found
    the next thing. Whole days went that way, and none of them moved a product.

    So the claim gets a test instead of a paragraph.
    """

    def test_a_bare_repository_closes_a_whole_card(self) -> None:
        with tempfile.TemporaryDirectory() as room:
            home = a_bare_project(Path(room))
            started = loop_in(home, "start", "A first card here")
            self.assertEqual(started.returncode, 0, started.stdout + started.stderr)

            card = home / "control" / "cards" / "a-first-card-here" / "card.md"
            card.write_text(
                "# A first card here\n\nbump: minor\n\nProved the control needs no answers.\n",
                encoding="utf-8",
            )
            (home / "src" / "thing.py").write_text("VALUE = 2\n", encoding="utf-8")

            checked = loop_in(home, "check")
            self.assertEqual(checked.returncode, 0, checked.stdout + checked.stderr)

            closed = loop_in(home, "finish")
            self.assertEqual(closed.returncode, 0, closed.stdout + closed.stderr)

            tags = subprocess.run(["git", "tag", "--list"], cwd=home, capture_output=True, text=True, check=True)
            self.assertTrue(tags.stdout.strip(), "the card closed without a version tag")

    def test_it_says_out_loud_that_nothing_fast_ran(self) -> None:
        # The one danger in letting HEADLESS be empty: a card closing green having
        # proved nothing. It is allowed, and it is never quiet.
        with tempfile.TemporaryDirectory() as room:
            home = a_bare_project(Path(room))
            loop_in(home, "start", "A first card here")
            (home / "control" / "cards" / "a-first-card-here" / "card.md").write_text(
                "# A first card here\n\nbump: patch\n\nA body.\n", encoding="utf-8"
            )
            (home / "src" / "thing.py").write_text("VALUE = 2\n", encoding="utf-8")
            said = loop_in(home, "check").stdout
            self.assertIn("no fast checks", said.lower(), said)

    def test_the_pages_no_longer_promise_a_refusal(self) -> None:
        # The exact sentence that went stale: both pages said an empty value was
        # refused by name, which was the behaviour this card removed. A page that
        # describes a refusal nobody will ever see is worse than no page.
        for name in ("README.md", "UPDATE.md"):
            page = (Path(loop.__file__).with_name(name)).read_text(encoding="utf-8")
            self.assertNotIn("is refused the first time it is needed", page, name)

    def test_the_page_says_the_file_is_optional(self) -> None:
        readme = (Path(loop.__file__).with_name("README.md")).read_text(encoding="utf-8")
        self.assertIn("optional", readme, "README.md never says project.py can be left out")

    def test_the_trunk_comes_from_git_when_nobody_answered(self) -> None:
        with tempfile.TemporaryDirectory() as room:
            home = a_bare_project(Path(room))
            started = loop_in(home, "start", "A first card here")
            self.assertNotIn("TRUNK", started.stderr, started.stderr)
            self.assertEqual(started.returncode, 0, started.stdout + started.stderr)


class TheModeOfAFileSurvivesBeingWritten(unittest.TestCase):
    """`loop.py` is executable, and an update used to hand back a copy that was not.

    `atomic_write` builds a new file beside the target and moves it into place, so
    the replacement arrived with default permissions and the executable bit was
    gone. Git tracks that bit, so the tree went dirty on its own — and a dirty tree
    is exactly what `start` refuses, which made the very next command after an
    update a refusal nobody could explain.
    """

    def test_writing_a_file_again_keeps_its_mode(self) -> None:
        with tempfile.TemporaryDirectory() as room:
            path = Path(room) / "loop.py"
            path.write_bytes(b"one")
            path.chmod(0o755)
            loop.atomic_write(path, b"two")
            self.assertEqual(path.stat().st_mode & 0o777, 0o755)

    def test_a_copy_carries_the_mode_it_was_handed(self) -> None:
        with tempfile.TemporaryDirectory() as room:
            path = Path(room) / "loop.py"
            loop.atomic_write(path, b"one", mode=0o755)
            self.assertEqual(path.stat().st_mode & 0o777, 0o755)


class ThePythonItNeedsIsStated(unittest.TestCase):
    """`str.removeprefix` is 3.9, and it is used where a branch name is trimmed.

    On 3.8 this file parses and then dies with an AttributeError inside a Git call,
    which reads like a bug in the project rather than a Python that is too old.
    """

    def test_it_names_a_floor(self) -> None:
        self.assertGreaterEqual(loop.NEEDS_PYTHON, (3, 9))

    def test_it_checks_before_it_uses_anything_that_new(self) -> None:
        # The call, not the name: the block that states the floor explains itself by
        # naming the method, and matching that would have the rule pass on its own
        # documentation while the real call sat above it.
        source = Path(loop.__file__).read_text(encoding="utf-8")
        self.assertLess(
            source.index("NEEDS_PYTHON"),
            source.index(".removesuffix("),
            "the floor is checked after the thing it protects",
        )


class ChangingTheControlSaysWhy(unittest.TestCase):
    """Only a real block earns a change to the system files.

    Both pages already said it — *only a finding that actually stopped a card may
    become work* — and neither page could enforce it, so every adoption that read
    the control found something and fixed it. That made the reading project the
    newest copy, and the next project adopted it and found the next thing.

    The field turns the sentence into a refusal. It is deliberately easy to
    satisfy honestly and impossible to satisfy silently: what it stops is not a
    considered change, it is the one nobody would have written a line for.
    """

    SYSTEM = "control/loop.py"
    MINE = "control/cards/x/card.md"

    def found(self, card: str, changed: list[str] | None = None) -> list[str]:
        return loop.problems(Path(self.MINE), card, changed or [self.SYSTEM, self.MINE], set())

    def test_a_card_touching_the_system_needs_the_field(self) -> None:
        found = self.found("# A title\n\nbump: patch\n\nA body.\n")
        self.assertTrue([one for one in found if "`control:`" in one], found)

    def test_a_reason_lets_it_through(self) -> None:
        card = "# A title\n\nbump: patch\ncontrol: finish refused this card because after/ was older than the code\n\nA body.\n"
        self.assertFalse([one for one in self.found(card) if "`control:`" in one], self.found(card))

    def test_an_empty_one_is_not_a_reason(self) -> None:
        found = self.found("# A title\n\nbump: patch\ncontrol:\n\nA body.\n")
        self.assertTrue([one for one in found if "`control:`" in one], found)

    def test_every_system_file_is_covered(self) -> None:
        # The page and the update instructions are as easy to polish as the code,
        # and a rule covering only loop.py would send the polish there instead.
        for name in loop.SYSTEM_FILES:
            found = self.found("# A title\n\nbump: patch\n\nA body.\n", [f"control/{name}", self.MINE])
            self.assertTrue([one for one in found if "`control:`" in one], f"{name}: {found}")

    def test_a_card_that_leaves_the_system_alone_never_sees_it(self) -> None:
        found = self.found("# A title\n\nbump: patch\n\nA body.\n", ["src/thing.py", self.MINE])
        self.assertFalse([one for one in found if "`control:`" in one], found)

    def test_this_project_s_own_answers_are_not_the_system(self) -> None:
        # `project.py` is where a product says what it does differently. Changing it
        # is ordinary product work and has nothing to do with the travelling system.
        found = self.found("# A title\n\nbump: patch\n\nA body.\n", ["control/project.py", self.MINE])
        self.assertFalse([one for one in found if "`control:`" in one], found)

    def test_the_reason_reaches_the_commit(self) -> None:
        # Same standard as `unproven:`. A reason that lives only in a card nobody
        # reopens is a reason nobody ever weighs against the next one.
        source = Path(loop.__file__).read_text(encoding="utf-8")
        self.assertIn('f"\\nControl: {one}"', source, "the reason never reaches the history")

    def test_both_pages_say_the_field_exists(self) -> None:
        for name in ("README.md", "UPDATE.md"):
            page = (Path(loop.__file__).with_name(name)).read_text(encoding="utf-8")
            self.assertIn("control:", page, f"{name} never mentions the field")


class WhatAProjectCanProve(unittest.TestCase):
    """Reading a project to find out what it is able to prove with.

    A project used to arrive with an empty `project.py` and stay that way until
    somebody typed 82 lines into it, and a project nobody typed them into simply
    went quiet — one ran 910 commits without ever photographing a screen, and
    nothing in the control said a word about it.

    So the control reads what is actually installed. Two answers come out of it
    and they are different questions: what this project runs *today*, and what its
    stack makes *possible* and it is not using. The second is the one that catches
    a silent project.
    """

    def found(self, room: str, files: dict[str, str]) -> loop.Capability:
        home = Path(room)
        for name, text in files.items():
            path = home / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text, encoding="utf-8")
        return loop.what_can_be_proved(home)

    def test_a_node_project_with_a_test_script_gets_a_headless_command(self) -> None:
        with tempfile.TemporaryDirectory() as room:
            able = self.found(room, {"package.json": '{"scripts": {"test": "vitest run"}}'})
            self.assertTrue(able.headless, "no fast checks were worked out")

    def test_a_screen_runner_is_recognised_when_it_is_installed(self) -> None:
        with tempfile.TemporaryDirectory() as room:
            able = self.found(room, {
                "package.json": '{"devDependencies": {"@playwright/test": "1.62.1"}}',
                "e2e/a.spec.ts": "test('a @thing', async () => {})",
            })
            self.assertTrue(any("screen" in one.lower() for one in able.possible), able.possible)

    def test_a_stack_that_could_render_and_does_not_is_named(self) -> None:
        # The whole point. A desktop shell and a test runner and no screen suite is
        # a project that can prove its pixels and has chosen not to.
        with tempfile.TemporaryDirectory() as room:
            able = self.found(room, {
                "package.json": '{"scripts": {"test": "vitest run"}, "dependencies": {"@tauri-apps/api": "2.11.1"}}',
                "src-tauri/tauri.conf.json": "{}",
            })
            self.assertTrue(able.possible, "a Tauri project was told nothing is reachable")
            self.assertFalse(able.rendered, "a screen runner was invented out of nothing")

    def test_a_folder_of_documents_claims_nothing(self) -> None:
        with tempfile.TemporaryDirectory() as room:
            able = self.found(room, {"notes.md": "# Notes\n"})
            self.assertFalse(able.headless)
            self.assertFalse(able.rendered)

    def test_it_names_no_single_ecosystem(self) -> None:
        # A control that only understood one language would be a control for one
        # kind of project. Several unrelated stacks are recognised, or this is
        # calibration for Node wearing a general name.
        with tempfile.TemporaryDirectory() as room:
            rust = self.found(room, {"Cargo.toml": "[package]\nname = 'a'\n"})
            self.assertTrue(rust.headless, "a Rust project was understood as nothing")
        with tempfile.TemporaryDirectory() as room:
            python = self.found(room, {"pyproject.toml": "[project]\nname = 'a'\n"})
            self.assertTrue(python.headless, "a Python project was understood as nothing")
        with tempfile.TemporaryDirectory() as room:
            go = self.found(room, {"go.mod": "module a\n"})
            self.assertTrue(go.headless, "a Go project was understood as nothing")

    def test_a_native_shell_is_reachable_rather_than_runnable(self) -> None:
        # A simulator is not a tier and never becomes one. It is named as something
        # a card reaches by hand, which is what `unproven:` is for.
        with tempfile.TemporaryDirectory() as room:
            able = self.found(room, {
                "package.json": '{"dependencies": {"@capacitor/ios": "8.5.0"}}',
                "ios/App/App.xcodeproj/project.pbxproj": "",
            })
            self.assertTrue(any("simulator" in one.lower() for one in able.possible), able.possible)

    def test_what_it_could_not_work_out_is_said_rather_than_guessed(self) -> None:
        with tempfile.TemporaryDirectory() as room:
            able = self.found(room, {"package.json": "{}"})
            self.assertTrue(able.unknown, "a project with no test script claimed to be fully understood")

    def test_it_writes_answers_only_where_there_are_none(self) -> None:
        with tempfile.TemporaryDirectory() as room:
            home = Path(room)
            (home / "control").mkdir()
            (home / "package.json").write_text('{"scripts": {"test": "vitest run"}}', encoding="utf-8")
            written = loop.write_answers(home)
            self.assertTrue(written, "nothing was written into a project with no answers")
            self.assertIn("HEADLESS", (home / "control" / "project.py").read_text(encoding="utf-8"))
            # And never a second time: those answers are the project's, and a
            # detection running over them would throw away whatever was corrected.
            self.assertFalse(loop.write_answers(home), "it overwrote answers that already existed")

    def test_the_answers_it_writes_are_readable_python(self) -> None:
        with tempfile.TemporaryDirectory() as room:
            home = Path(room)
            (home / "control").mkdir()
            (home / "package.json").write_text('{"scripts": {"test": "vitest run"}}', encoding="utf-8")
            loop.write_answers(home)
            # Parsed rather than eyeballed: a file that does not compile turns the
            # very next command into a traceback, which is the impression this whole
            # detection exists to prevent.
            ast.parse((home / "control" / "project.py").read_text(encoding="utf-8"))

    def test_a_project_already_photographing_is_told_nothing_about_it(self) -> None:
        # `possible` is what this project is not doing. Telling somebody to do what
        # they already do is the line that stops all the others being read.
        with tempfile.TemporaryDirectory() as room:
            home = Path(room)
            (home / "package.json").write_text(
                '{"scripts": {"test": "vitest run"}, "devDependencies": {"@playwright/test": "1.62.1"}}',
                encoding="utf-8",
            )
            (home / "e2e").mkdir()
            nagged = loop.what_can_be_proved(home)
            quiet = loop.what_can_be_proved(home, photographs=True)
            self.assertTrue(any("RENDERED" in one for one in nagged.possible), nagged.possible)
            self.assertFalse(any("RENDERED" in one for one in quiet.possible), quiet.possible)
            # And what it found is unchanged — only the advice went quiet.
            self.assertEqual(quiet.rendered_tests, nagged.rendered_tests)

    def test_detect_is_a_command(self) -> None:
        self.assertIn("detect", loop.COMMANDS)

    def test_both_pages_say_it_exists(self) -> None:
        for name in ("README.md", "UPDATE.md"):
            page = (Path(loop.__file__).with_name(name)).read_text(encoding="utf-8")
            self.assertIn("detect", page, f"{name} never mentions it")
