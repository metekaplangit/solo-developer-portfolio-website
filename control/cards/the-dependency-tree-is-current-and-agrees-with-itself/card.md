# The dependency tree is current and agrees with itself

bump: patch

Seven packages were behind. They are current now, as one set rather than one at
a time: `@astrojs/markdown-satteri` 0.3.5 to 0.4.1, `satteri` 0.9.4 to 0.10.5,
`@astrojs/check` 0.9.9 to 0.9.10, `@astrojs/sitemap` 3.7.3 to 3.7.4,
`puppeteer-core` 24.43.1 to 25.10.0, `vitest` 4.1.11 to 5.0.0, and `typescript`
5.9.3 to 6.0.3. `astro` was already on 7.3.2, which is current.

Three things ride on this beyond being newer. `puppeteer-core` 24.43.1 sits
inside an open high advisory and 25.10.0 does not, and it is a direct
dependency — `npm audit --omit=dev` was already clean, but the full tree carried
it. The markdown pipeline stops being installed twice: `astro` 7.3.2 carries
`@astrojs/markdown-satteri` 0.4.1 of its own, while `astro.config.mjs` was
handing it a processor built by a root copy pinned at 0.3.5; `npm ls` now shows
one copy, deduped. And the screen tier measured 25.8s where it measured 52.8s
before, on the same machine over the same nine routes.

**TypeScript 7.0.2 was tried and is excluded.** `astro check` exits 1 with
`Cannot read properties of undefined (reading 'fileExists')` from inside
`@astrojs/language-server`, and `@astrojs/check` 0.9.10 declares its peer as
`typescript@^5.0.0 || ^6.0.0`. 6.0.3 is the newest this project can hold until
that peer widens. This is worth not rediscovering.

The three sets of breaking changes were read from the primary release notes and
each checked against this code rather than assumed. Vitest 5 defaults
`clearMocks` to true, removes `test.sequential`, and throws on `vi.mock` or
`vi.hoisted` called outside the top level — this project has no mock, no spy and
no `.sequential` anywhere under `src/` or `tests/`. puppeteer-core 25 is ESM
only and returns promises from `executablePath` and `defaultArgs` — the project
is `"type": "module"` throughout, and none of its three call sites calls
`executablePath()`; all three pass a path in as an option. TypeScript 6 removes
`moduleResolution: classic`, forbids `esModuleInterop: false`, and deprecates
the ES3 and ES5 targets — `tsconfig.json` extends `astro/tsconfigs/strict` and
sets only `strictNullChecks`.

**The pictures need explaining, and the explanation is the interesting part.**
Six of eighteen came out different. Before reading anything into that, the
capture was run twice with nothing at all changed between the two runs, as
`control/README.md` asks: three of those same screens came out different against
themselves. So the capture is not deterministic and a raw before-versus-after
comparison here proves nothing either way.

The number that does answer it: the pre-upgrade dependency set was reinstalled
from the v0.51.5 lockfile in a throwaway clone, built, and its `dist/` compared
against this one. `diff -r` reports **all 110 built files byte-identical**. The
upgrade changed the tools and changed nothing they produce, so every picture
difference above is capture noise. The throwaway clone is deleted.

No `screen:` line, because no file under `src/` or `public/` changed and the
control rightly refuses one that names screens the card did not touch. The
screen tier was still run, by hand, because the toolchain that renders the
pages is exactly what moved.

Proved by Headless Suite Testing complete, plus the screen tier run by hand — the fast checks whole (0 errors from
`astro check`, 114 unit tests, 22 built-output tests, `npm audit --omit=dev`
clean), then the screen tier over all nine routes at four widths plus the phone
pass, 11 tests, exit 0.
