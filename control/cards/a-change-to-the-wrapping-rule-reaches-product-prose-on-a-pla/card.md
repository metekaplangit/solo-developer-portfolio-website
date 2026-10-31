# A change to the wrapping rule reaches product prose on a plain build

bump: patch

Closes issue 0008

Issue 0008 re-checked as filed: with `'one'` added to `tie()`'s words, a plain
`npx astro build` left the Sole Focus page at 8 tied and 5 loose; a forced build
gave 9 and 4. Astro 7.4.2's content layer clears its store only when the
serialised config changes (`node_modules/astro/dist/content/content-layer.js`,
"Astro config changed"), and the tie plugin is a function, whose body never
reaches that string.

`astro.config.mjs` now fingerprints `src/lib/typography.ts` and
`src/lib/satteri-tie.ts` and puts the fingerprint in the plugin's name. An edit
to either file logs "Astro config changed / Clearing content store" on a plain
build; a build with nothing changed clears nothing, so ordinary builds stay as
quick as before.

Why the checks stayed green: T1 carries its own copy of the tie words, so a word
added to `tie()` never reached it, and the Markdown test only counted
non-breaking spaces. The new built-output test renders every Markdown body —
3 products and 4 policies — afresh with Sätteri and today's plugin, and holds
its visible text against the page in `dist/`. Seen red on the stale plain build
("/apps/sole-focus/ … was rendered with an older rule"), green after the fix
with the word added, and green again after it was taken out.
