# Ship with a dependency tree the security doc's own gate would pass

bump: patch

`docs/SECURITY.md` names one dependency control and calls it "the gate, and it is
the one that matters": `npm audit --omit=dev` must be clean at merge, because
nothing dev-only reaches a visitor. Measured 2026-08-21 during the security gate,
it was not clean and nothing anywhere ran it. Two high advisories sat in the
production tree, both transitive under `astro@7.1.6` — `js-yaml@4.3.0`
(GHSA-5p4m-2wfm-xmqj, quadratic CPU in `!!omap` resolution, the CVE-2026-59870 fix
not backported) and `nanoid@3.3.16` (GHSA-2v37-7h3g-55p8, custom generators looping
forever at size zero, reached through `vite` → `postcss`).

Neither is reachable by a visitor and neither was fixed because it was: this site
is `output: 'static'`, so not one line of either package runs after the build, and
the only YAML the build parses is frontmatter the owner wrote. What was actually
wrong is that a control this project wrote down as merge-critical had no command
behind it, so the day a genuinely exploitable advisory lands in the production tree
nothing would have said a word. `npm audit fix` moved them to `js-yaml@4.3.1` and
`nanoid@3.3.18` inside the ranges `astro` already allows — no direct dependency
changed, no major moved, and `astro@7.1.6` itself carries no advisory against the
GitHub Advisory Database as of 2026-08-21.

The gate is now a command. `npm run audit` is `npm audit --omit=dev`, and it runs
first in the `headless` chain — before the build, so a bad dependency stops a card
in a second rather than after four minutes of work. Strict on purpose: no
`--audit-level`, because the doc says clean and clean is what it now means. The one
cost is that the fast checks need the network, and offline they fail loudly at step
one rather than quietly skipping the check — which is the right way round for a
control whose whole job is to notice something new.

Seen red first, which is the only reason it counts. Against `HEAD`'s lockfile in a
throwaway copy outside the project, `npm audit --omit=dev` exits 1 and prints "2
high severity vulnerabilities". Against the tree this card leaves behind it exits 0
and prints "found 0 vulnerabilities".

The 10 remaining advisories are all dev-only, in `@lhci/cli@0.15.1`'s own ageing
tree (`inquirer`, `external-editor`, `tmp`, `uuid`). They are left alone
deliberately: `npm audit fix --force` resolves them by installing `@lhci/cli@0.1.0`,
which would take the blocking accessibility gate out of the deploy workflow. Trading
a live a11y gate for advisories on a CI runner that never reads untrusted input is a
worse product, not a safer one.
