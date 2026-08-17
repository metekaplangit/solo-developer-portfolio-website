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

# 2. No screen tier yet, deliberately, and this is the one gap worth knowing about.
#    `npm run test:ui` does drive a real Chrome over 9 routes at 4 widths — but the
#    control finds a named screen by reading `*.spec.ts` files for an `@tag` inside a
#    test title, and this project's suites are `*.test.ts` with no tags in them. So a
#    tag named on a card could not be resolved, and answering these would refuse every
#    card that touched a screen. Left empty until a card gives the geometry suite
#    per-route tags; `check` says out loud that no Scoped tier runs.
RENDERED: list[str] = []
RENDERED_TESTS = None

# 3. Empty for exactly as long as RENDERED is. A project naming screens it cannot
#    render refuses every card that touches one.
INTERFACE: tuple[str, ...] = ()
NOT_INTERFACE: tuple[str, ...] = ()

# 4. What a visitor would never notice changing. `docs/` is the whole of the previous
#    control — Step Packets, STATUS, ROADMAP, CHECKPOINTS and the rest — kept as the
#    record of work that was really done. It is read, never edited, and nothing in it
#    is product. `scripts/` holds only that system's retired validator.
PAPERWORK = (
    "control/",
    "docs/",
    "scripts/",
    ".github/",
    ".claude/",
    ".impeccable/",
    ".vscode/",
)

# 5. The trunk, and where product-facing history is kept. The changelog is not at the
#    root here; it has lived under `docs/` since the project was created.
TRUNK = "main"
CHANGELOG = ROOT / "docs" / "CHANGELOG.md"

# 6. `SIBLINGS` is deliberately NOT answered, and this project pays for it. Read this
#    before answering it.
#
#    The walk that finds the other copies goes up two folders and down two, because a
#    project normally sits at `<somewhere>/<heading>/<project>`. This one sits at
#    `VibeCoding/Sites/PortfolioSite/solo-dev-portfolio-website` — one folder deeper,
#    because the repository is a child of the folder that names the product. So the
#    walk searches `Sites/` alone and finds nothing, and the blindness is mutual: the
#    other projects walk down two from `VibeCoding/` and stop one short of this one.
#    Neither side can tell the other is ahead.
#
#    Answering it here was tried on 2026-08-17 and backed out the same hour. The guard
#    in `looking_in` returns the answer before it looks at the `here` argument, so a
#    project that answers `SIBLINGS` turns
#    `test_a_project_that_answers_nothing_looks_two_levels_wide` red — a permanently
#    failing control suite, bought to fix a courtesy check. Not worth it, and fixing
#    the guard is a change to the system files, which is a card of its own started
#    from the newest copy rather than something an adoption does.
#
#    Until then: before changing anything in `control/`, ask another project whether
#    it is ahead rather than asking this one.

# 7. Nothing stamps a version into a file here. The site is published from the tag by
#    `.github/workflows/deploy.yml`, and `package.json` carries `0.0.0` on purpose —
#    it is a private package that is never published to a registry.
