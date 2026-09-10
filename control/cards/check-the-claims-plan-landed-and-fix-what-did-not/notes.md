# Notes

Checked and held, so not worth a paragraph in the card:

- `npm run headless` green at v0.51.0's tree, exit 0 — 114 unit tests, 22 built-output.
- Scoped Suite Testing ran 8 screens for v0.51.0 and passed all 8.
- The facts line drops from three facts to two on a free product ("Free · macOS
  10.15 or later"), which is the one change a visitor notices. Read out of the
  built HTML rather than guessed at; the row still renders and does not collapse.
- `npm audit --omit=dev` exits 0. The dev-only `@lhci/cli` advisories remain, as
  the 2026-08-21 card decided.

Not this plan's scope, left alone and named for the owner:

- `docs/` is retired history and still carries the old claims throughout —
  `CHANGELOG.md`, the 83 step packets, `STATUS.md`. `CLAUDE.md` says never to
  rewrite it, and it is a record of work nobody can re-run, so nothing here
  touched it.

Live check, run after the Pages workflow for v0.51.0 completed (run 34454601923,
success, 1m55s):

    /                      clean
    /apps/sole-focus/      clean
    /apps/magic-notes/     clean
    /about/                clean
    /privacy/sole-focus/   no ads, no account, no cloud, no analytics

The last line is the intended result, not a miss. That page is the privacy policy
and those are its dated statements of current fact.
