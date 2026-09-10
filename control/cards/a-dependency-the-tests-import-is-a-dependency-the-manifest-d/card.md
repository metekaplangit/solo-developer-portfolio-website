# A dependency the tests import is a dependency the manifest declares

bump: patch

`src/content/products.content.test.ts` has imported `parse` from `yaml` since
the content suite was written, and `yaml` was never in `dependencies` or
`devDependencies`. It appeared in `package.json` only under `overrides`, which
pins a version for the tree and installs nothing of its own.

It resolved anyway, and that is the whole problem. Vite brings `yaml` in under
Astro, and `@astrojs/language-server` brings it in under `@astrojs/check`, and
npm hoists it to the top of `node_modules` where a bare `import 'yaml'` finds
it. Neither of those packages owes us that. Either one dropping the dependency,
or npm choosing to nest it rather than hoist it, turns the unit suite red on a
clean install with a resolution error that nothing in this repository explains.

So `yaml@^2.9.0` is now a declared devDependency, at the version already
resolved, and the override reads `$yaml` rather than a second literal range.
npm refuses an override that names a version conflicting with a direct
dependency of the same name — `EOVERRIDE`, seen once before this landed — and
`$yaml` is the form that points the override at whatever the direct dependency
says. One version, stated once, and the override keeps doing what it was put
there to do on the very first commit: hold the whole tree to a single `yaml`.

Proved by the fast checks and by the scanner that found it. `npx knip` reported
`Unlisted dependencies (1) — src/content/products.content.test.ts: yaml` before
this change and reports no unlisted dependency after it. `npm ls yaml --depth=0`
now answers with `yaml@2.9.0` as a direct entry rather than nothing. The fast
checks pass whole: 0 errors from `astro check`, 114 unit tests, 22 built-output
tests, exit 0.
