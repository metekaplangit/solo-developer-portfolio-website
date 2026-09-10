"""This project's answers. The only file in `control/` a different product changes.

`loop.py`, `test_loop.py`, `README.md` and `UPDATE.md` are the system: replace all
four to update the control, and nothing here moves. This file and `cards/` are ours.

Written by `detect` on 2026-08-17 and corrected by hand in the same sitting.
Detection reads the ordinary conventions; three things here are not ordinary — the
fast checks are four npm scripts rather than one, the changelog lives under `docs/`,
and this project sits one folder deeper than the walk that finds the other copies.
"""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# 1. Everything fast that renders nothing. Four commands, so `package.json` chains
#    them behind one name: the static build, `astro check`, the unit suite under
#    `src/`, and the suite that reads the built `dist/` HTML. The last one needs the
#    build, which is why the order is fixed and why it is one script rather than a
#    list somebody has to keep in step.
HEADLESS = ["npm", "run", "headless"]

# 2. One named screen test, driven in a real Chrome against the built site. Every
#    argument after these is one screen tag from the card.
#
#    The runner loads every route whatever it is given: one rule in the suite
#    compares the page-title indent of each route against all the others, so a run
#    that loaded three of them could not check it. About a minute, paid only by a
#    card that touched something a visitor can see. The tags choose which screens
#    the card is answerable for, never which pages load — `scripts/rendered.mjs`
#    says the same thing at the top of the file.
RENDERED = ["node", "scripts/rendered.mjs"]

# 3. Where those tests live, so a tag can be found by reading rather than by running
#    the suite. The control globs `*.spec.ts` directly inside this folder and reads
#    `@tags` out of titles on lines beginning `test(` — which is why the suite uses
#    `test(` and not `it(`, and why it is a `.spec.ts`.
RENDERED_TESTS = ROOT / "tests" / "screens"

# 4. What a visitor can see. Every route is built out of `src/`, and `public/` is
#    served untouched, so both count.
#
#    The unit tests sit beside the code they test, at `src/**/*.test.ts`, and this is
#    a prefix match rather than a glob, so there is no way to spell them out here.
#    They are therefore counted as screen files, which over-asks rather than
#    under-asks: a card that only touched a unit test says `unrendered:` in one line
#    and closes. That is the field's purpose — a change living among the pixels
#    without moving any.
INTERFACE = ("src/", "public/")
NOT_INTERFACE: tuple[str, ...] = ()

# 5. What a visitor would never notice changing. `docs/` is the whole of the previous
#    control — Step Packets, STATUS, ROADMAP, CHECKPOINTS and the rest — kept as the
#    record of work that was really done. It is read, never edited, and nothing in it
#    is product.
#
#    `scripts/` as a whole is NOT here, and that is on purpose: it holds the screen
#    runner and the capture script, and a card that changes how screens are proved
#    should still run the fast checks. Only the retired validator underneath it is
#    paperwork.
PAPERWORK = (
    "control/",
    "docs/",
    "scripts/retired/",
    ".github/",
    ".claude/",
    ".impeccable/",
    ".vscode/",
)

# 6. The trunk, and where product-facing history is kept. The changelog is not at the
#    root here; it has lived under `docs/` since the project was created.
TRUNK = "main"
CHANGELOG = ROOT / "docs" / "CHANGELOG.md"

# 7. Where the other projects are, because the walk cannot reach them from here.
#
#    The default walks up two folders and down two, because a project normally sits
#    at `<somewhere>/<heading>/<project>`. This one sits at
#    `VibeCoding/Sites/PortfolioSite/solo-dev-portfolio-website` — one folder deeper,
#    because the repository is a child of the folder that names the product. So the
#    walk anchored on `Sites/` and saw no other copy at all, and this project sat on
#    control 14 for three weeks while six others ran 18, with nothing to say so.
#
#    Control 19 fixed the half of that which is everybody's problem: the search now
#    opens a folder that is neither a project nor a repository, so every other
#    project can see this one. The other half is this project's own — its anchor is
#    still one level too low — and this is the answer the control provides for it.
#
#    Computed rather than written out, so moving the whole tree changes nothing:
#    up three from the repository is the folder all the headings sit under.
SIBLINGS = (ROOT.parent.parent.parent,)

# 8. Nothing stamps a version into a file here. The site is published from the tag by
#    `.github/workflows/deploy.yml`, and `package.json` carries `0.0.0` on purpose —
#    it is a private package that is never published to a registry.
