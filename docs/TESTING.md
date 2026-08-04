# Testing

> **Purpose:** Test strategy, commands, coverage expectations, and step-completion gates.
> **Read when:** Adding tests, defining Done, or wiring CI checks.
> **Update when:** Tools, commands, coverage, fixtures, or gates change.
> **Synchronize with:** ARCHITECTURE.md, DATA_STORAGE.md, DEPLOYMENT.md, SECURITY.md.
> **Status:** Active.
> **Activation:** Standard profile. Vitest and Lighthouse CI are active.

## Commands (local gates + the one deploy gate)

Run locally before merge. CI was retired on 2026-07-18, so **no automation gates
a merge** — "Merge-critical" below is a discipline, not an enforced check. The
only machine-enforced gate is Lighthouse accessibility, and it runs *after*
merge in `deploy.yml`, blocking the live publish rather than the merge.

| Check | Command | Gate class | Enforced by |
|---|---|---|---|
| Static build | `npm run build` | Merge-critical | local only |
| Type + content schema check | `npm run check` (`astro check`) | Merge-critical | local only |
| Governance validator | `python3 scripts/validate-governance.py` | Merge-critical | local only |
| Unit tests (`lib/` + schema) | `npm test` (Vitest — **added in STEP-0001**) | Merge-critical | local only |
| Build-output tests (`dist/`) | `npm run test:dist` (**added in STEP-0068**; needs a build first) | Merge-critical | local only |
| Rendered-geometry tests | `npm run test:ui` (**added in STEP-0080**; needs a build first) | Merge-critical for anything visible | local only |
| Route/link generation | `npm run build` (sitemap + required static routes) | Merge-critical for release | local only |
| Accessibility check | `npm run lhci` on built pages | Release-critical | **`deploy.yml` — blocks the live deploy** |

**Current baseline (2026-08-04):** 111 unit tests in 11 files, 14 build-output
tests, 8 rendered-geometry tests, and Lighthouse CI requiring accessibility
≥0.95 on built routes. An unavailable, crashed, or skipped merge-critical
verifier is `Blocked`, never `Pass`.

**Rendered-geometry tests** (`tests/geometry.test.ts`, STEP-0080) close the last
gap: what the browser LAYS OUT. `dist.test.ts` proves what is in the HTML;
neither it nor `astro check` notices a link that renders 18px tall, a page title
off the shared rail, a 400px void, or an above-the-fold image left lazy. Seven
of the eleven rules in `docs/CHECKLIST.md` said "read by a person", and two
defects had already survived exactly that (STEP-0078, STEP-0079).

It serves `dist/` from a throwaway `node:http` server and drives a real Chrome
through `puppeteer-core` — declared as a devDependency rather than borrowed from
`@lhci/cli`'s transitive tree, which is the STEP-0064 lesson. Nine routes at
320 / 390 / 768 / 1440 plus one coarse-pointer phone pass, ~65 seconds. Kept out
of `npm test` AND `npm run test:dist` so neither fast loop waits on a browser.

Two things to know before changing it. Headless Chrome detaches the navigating
frame intermittently (puppeteer/puppeteer#12294, #13397), so every reading
retries up to four times and replaces the browser on any failure — retrying a
whole route instead made three attempts fail on the same route. And when
breaking `dist/` deliberately to watch an assertion go red, use a style
**attribute**: the site's own CSP (STEP-0065) blocks an injected `<style>`
element, so the "broken" page renders perfectly and the assertion looks weak
when it is the CSP doing its job.

## Portfolio (risk-based)

Many fast **unit tests** for `src/lib/` (pure functions: link resolution,
canonical privacy URL, date formatting, the wrapping rule, grid arithmetic,
policy default text) and **schema tests** (valid, invalid, missing-field,
hostile content fixtures — invalid content MUST fail).

**Build-output tests** (`tests/dist.test.ts`, STEP-0068) close the gap those
leave. Every unit test proves a function; 14 components and 8 pages had nothing
between them and production but `astro build`, `astro check` and the deploy-time
a11y gate — none of which notices a wrong canonical URL, malformed JSON-LD, a
third-party script, a missing CSP, or the wrapping rule silently not reaching
rendered Markdown. That last one is why the suite exists in this shape: STEP-0064
found the packages applying that rule were reachable only as transitive
dependencies, so it could have stopped working without a single test going red.

They read `dist/` directly rather than rendering components in isolation — a
component harness proves a component, this proves the page a visitor gets, and it
adds no dependency to a project that keeps two runtime deps on purpose. Kept out
of `npm test` (own config, `vitest.dist.config.ts`) because that suite runs in
under a second and is run constantly; making it wait on a build is how a fast
suite stops being run.

**Every assertion in the build-output suite has been seen red.** Each was run
against deliberately broken output before being trusted — a localhost canonical,
malformed JSON-LD, a stripped CSP, an injected third-party script, non-breaking
spaces removed, and a deleted route. A test never seen to fail is not a test.

No E2E server tests (static site).

## Runner contract

Capture exit status without suppressing output; print failure logs
unconditionally; no false-green. An unavailable/crashed/skipped check is
`Blocked`, never `Pass`.

## Evidence mapping

Every Step acceptance criterion maps to an evidence method (command/log,
automated test, screenshot, or explicit Blocked) before implementation — see each
Task Card's **Evidence method** / **Proof classification** fields.

**Runtime / visual proof:** `npm run preview` on the built `dist/`, then a browser
(or Preview MCP) screenshot per route (home, catalog, product detail, privacy,
support/contact, about; plus a mobile viewport). This is the `manual-runtime` /
`needs-human-runtime` evidence for visual polish and store-reviewer readability
that automated build/route/a11y checks cannot fully cover.

## Definition of Done (per step)

Build + check + governance validator pass; unit/schema tests for new logic pass
(or Blocked with an infra issue); required routes present; accessibility checked
for user-facing pages; docs + STATUS updated; no secrets.
