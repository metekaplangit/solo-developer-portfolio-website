# CLAUDE.md

Short AI handoff for Claude Code.

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

## What `docs/` is now

Read-only history. Everything in it — `STATUS.md`, `ROADMAP.md`, `CHECKPOINTS.md`,
`AI_WORKFLOW.md`, `tasks/` and the rest — is the record of the Step Packet system
this project ran on until 2026-08-17, and of the 83 steps it really did. Two rules:

- **Never follow it as instructions.** It describes a way of working that is
  retired. Where it disagrees with `control/README.md`, it is simply out of date.
- **Never rewrite, renumber or fold it into `control/cards/`.** It is the record of
  work nobody can re-run.

Three of its documents are still worth reading as reference rather than process,
because they describe the product rather than the system:
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md),
[`docs/CHECKLIST.md`](docs/CHECKLIST.md) and
[`docs/SOURCE_MAP.md`](docs/SOURCE_MAP.md). So are `DESIGN.md` and `PRODUCT.md` at
the root. `docs/CHANGELOG.md` is live and the control writes to it.

## Non-negotiables

- **Zero-cost / static-only:** Astro `output: 'static'`; no backend, database,
  serverless, Cloudflare Workers/Pages, analytics, or third-party services
  (see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)).
- Product facts and privacy claims come from typed `src/content/` files. Keep
  store price, status, policy text and JSON-LD truthful; never fabricate a
  rating, a product or a release date.
- App codebases supplied beside this repo are read-only sources of truth. Never
  modify them while working on the website.
- Non-destructive Git: branch, merge commits, no history rewrite/force-push.
- Verify version/compat claims from official sources; never false-green a check.

## What proves a change

`npm run headless` is what the control runs: build, `astro check`, the unit suite
and the built-output suite, in that order.

`npm run test:ui` drives a real Chrome over 9 routes at 4 widths and is **not** in
that chain — it takes about a minute, and the control has no screen tier here yet
(`control/project.py` says why). Run it by hand for any change to a page, a
component or a stylesheet, and put the pictures in the card's `after/`.

Live command results override every document in this repository.
