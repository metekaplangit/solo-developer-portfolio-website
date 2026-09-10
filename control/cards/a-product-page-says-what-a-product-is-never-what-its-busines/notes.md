# Notes

## The dependency wall, and why this card moved the lockfile

`npm run headless` opens with `npm run audit`, and it failed before this card had
changed a line of product code. 5 production advisories had been published since
2026-08-21 against a lockfile nobody had touched — a critical pair in
`astro <=7.2.7` (remote code execution through AVIF image optimization,
GHSA-26w7-cxv4-gfx2, and an authorization bypass when stripping the configured
base, GHSA-376h-93r7-7g6f), plus high advisories in `sharp`, `smol-toml`, `svgo`
and `js-yaml`.

Not this card's work and not this card's fault: `git status` showed
`package.json` and `package-lock.json` untouched, so the tree was exactly HEAD's
and the advisories were new publications against it. But the gate is first in the
chain by design and the card could not close behind it.

`npm audit fix`, no `--force`, everything inside the ranges `package.json`
already allows: astro 7.1.6 → 7.3.2, sharp → 0.35.4, svgo → 4.1.0,
js-yaml → 4.3.2, smol-toml → 1.8.0. No direct dependency changed.
`npm audit --omit=dev` then exits 0, "found 0 vulnerabilities". `npm audit fix`
itself still exits 1 on the dev-only `@lhci/cli` tree, left alone for exactly the
reason the 2026-08-21 card recorded: `--force` resolves those by installing
`@lhci/cli@0.1.0` and takes the accessibility gate out of the deploy workflow.

The astro minor bump is why every check was re-run from the build up rather than
only the ones this card's edits touched.

## The probe

`scripts/probe/height-probe.mjs` stays. It answers one question in about 15
seconds — how tall is each route at each width, and does a full-page screenshot
of it survive — and that question came up twice in one sitting. Its three-line
header says what it does, how to run it, and what it settles.
