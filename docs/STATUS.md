# Status — Live Snapshot

> **Purpose:** Live project state and the exact next action. The single entry point.
> **Read when:** Every session, first.
> **Update when:** After every Step/checkpoint or any blocker/Git change (overwrite).
> **Synchronize with:** ROADMAP.md, CHECKPOINTS.md, VERSION_CONTROL.md, CHANGELOG.md, ISSUE_TRACKING.md.
> **Status:** Active.
> **Activation:** Standard profile + commercial/compliance overlay armed (privacy/store pages).

## Handoff

- **Product:** MetKap Studio portfolio and store-support site, live at
  **https://metkapstudio.com/** over HTTPS. Static Astro output is hosted by
  GitHub Pages behind the Cloudflare proxy. Sole Focus is live on the Mac App
  Store; the support mailbox and published privacy pages are operational.
- **Latest product state:** **STEP-0081** gave the page title one indent. The
  wordmark, the first body paragraph and the first footer link share one left
  edge on all 9 routes; six routes start their `h1` there too. The two that lead
  with the identity lockup start inboard — which STEP-0061 recorded and the
  owner asked for — but they disagreed with each other: **+88px** on a product
  page against **+72px** on a policy page, because the lockup pushes the title
  in by the icon's width and the two headers used 72 and 56. 56 wins: it has a
  written reason on the policy component (policy titles are the longest on the
  site) where 72 had none, and it is what the product band already uses. Two
  identity sizes now, not three — 48 in a card, 56 wherever a product leads a
  surface. A new assertion holds it. Internal, no tag. Before it, **STEP-0080**
  made the rendered geometry a check
  rather than a habit. Seven of the eleven rules in `docs/CHECKLIST.md` said
  "read by a person", and STEP-0078 and STEP-0079 were both defects that
  survived exactly that. `npm run test:ui` serves `dist/` and drives a real
  Chrome over 9 routes × 4 widths plus a coarse-pointer phone pass, asserting:
  no sideways scroll, no text under 13px, every target 24px or exempt under
  SC 2.5.8, one shared left rail, a set sharing a height on a row, no gap wider
  than the rhythm, and nothing on screen left lazy. **8 assertions, 65s, and
  every one seen red first.** `puppeteer-core` is now a declared devDependency
  rather than borrowed from `@lhci/cli`'s transitive tree — the STEP-0064
  lesson. Two things the red-first pass taught: the site's own CSP silently
  defeats an injected `<style>`, so deliberate breaks must use style
  attributes; and the height rule cannot fail on this markup at all, because a
  grid stretches every item in a row — it was proved on a synthetic flex row
  and widened to look one level inside each cell, where the STEP-0076 defect
  actually lived. Internal, no tag. Before it, **STEP-0079** stopped the
  product icon waiting to
  load when a visitor is already looking at it. `ProductAvatar` hardcoded
  `loading="lazy"` from the day it was written, when it only ever appeared far
  down a page — an assumption STEP-0077 made false by putting the icon in the
  product band. Measured, it renders **165px** down a product page, **181px**
  down a policy page and **399px** down the catalog at 768px. A lazy image is
  skipped by the preload scanner, so it is not even queued until layout reaches
  it. One `eager` prop now, defaulting to lazy, set at the three above-the-fold
  call sites; the band passes its own flag through so the icon and the lead shot
  cannot disagree about which screen they are on. On 5 cold throttled runs the
  icon lands **800 → 421ms** on a product page and **703 → 379ms** on a policy
  page; on the catalog it does not move, and the card says so. No
  `fetchpriority` added — that hint belongs to the LCP image. Internal, no tag.
  Before it, **STEP-0078** put the shared standalone-link rule
  back in touch with the links it is supposed to govern. `global.css` grants a
  24px minimum height to a list of selectors, one of which — `.back a` — had
  matched nothing since the back link was renamed `.page-back`. So the back
  links on the two product pages and the policy pages rendered **18px** tall,
  and `.page-back`, which subtracts that padding from its own `padding-top`
  because it expects the rule to add it, left those routes **47px** from the
  header against everyone else's 48. The "More apps" row was a bare `<ul>`
  outside the rule entirely. Measured after: **0** standalone links under 24px
  on any route, back links **32.8px**, page-top identical everywhere. Not an
  accessibility fix — measured against SC 2.5.8 those links passed through the
  spacing exception; it is a shared rule that lost its surface. Internal, no
  tag. Before it, **STEP-0077** put an app icon beside its name in
  the catalog, the last of the five items the owner reported on 2026-08-03. The
  product page and both policy pages already used the shared identity lockup;
  the product band was the one surface that named a product without showing it,
  so `/apps/` and the home page were where a visitor met a product with no
  icon. The same lockup is reused at 56px, the over-line kept above it so the
  icon aligns with the name, and the icon link marked redundant so it adds no
  keyboard stop. Verified from the rendered DOM at 1440px and 390px.
  Shipped in **v0.48.0**. Before it, **STEP-0076** made the two privacy cards read as
  one set. They measured **96px against 66px** at 1440px with different bottom
  edges, because the card was a flex row that put the date beside the name when
  it fitted and beneath it when it did not — one component rendering two
  designs, chosen by how long a product is called. Both are grids now, name
  above date always, each filling its row: 96 / 96 at 1440, 900 and 390px, and
  no fixed height, so a third product cannot bring it back. Shipped in **v0.48.0**.
  Before it, **STEP-0075** closed the void the owner boxed on
  the product pages. It measured **144px** against 80px below the gallery — two
  rhythms stacked, the band around the gallery and the gallery's own padding
  each claiming the same space. Both duplicates removed rather than a pixel
  value invented; the page now reads 72 / 80 / 40 / 120 / 120, every value a
  token. Shipped in **v0.48.0**. Before it, **STEP-0074** removed the "Screenshot
  transcript"
  disclosure from under the gallery, as the owner asked. It was added as an
  accessibility affordance, so it was checked rather than assumed: it rendered
  nothing but each shot's `alt` string, and all 11 gallery images still carry
  theirs. A visible duplicate went, not a text alternative. Shipped in **v0.48.0**.
  Before it, **STEP-0073** made the wrapping rule actually reach
  the page. It has existed since STEP-0062 and most of the site bypassed it:
  product summaries rendered raw on three surfaces — the exact copy the owner
  pointed at, breaking as "…a Pomodoro" with "timer" alone on the next line —
  seven policy lists read straight from the content file, and every page's own
  lede written as literal JSX. Applied now where the content is read rather than
  where it is rendered. Named things bind as units too, longest match first, so
  a product name cannot split. Measured 156 → 0 untied pairs, 46 → 0 splittable
  names, and no bound run wider than 25 characters. Three dist assertions hold
  it, each seen red first. Internal, no tag. Before it, **STEP-0072** wrote the
  site's rules down.
  `docs/CHECKLIST.md` holds them in three groups — Text, Layout, Whitespace —
  each opening with the owner's own words, because the owner reported three
  defects of these three kinds in one sitting and ended each report asking for a
  checklist rather than a fix. Every rule names the failure it catches and says
  whether a machine or a person checks it; a table at the end lists exactly
  which suites enforce which rule, so no rule can be believed enforced when it
  is not. It is a document **and** an automated check, the owner's own choice at
  planning; STEP-0073 adds the enforcement, kept separate so a deliberately red
  suite never sits on `main`. Internal, no tag. Before it, **STEP-0071** fixed
  the one inconsistency a
  page-by-page comparison found: a privacy policy's opening paragraphs ran
  together, because `margin: 0` was right for the single-sentence lead every
  policy had until Magic Notes shipped a three-paragraph one. The app icon the
  owner asked for on that page was already being served — `PolicyArticle`
  renders it from the product's own `icon`, so STEP-0070 put it there — and
  nothing was changed for it. Shipped as **v0.47.1**. Before it, **STEP-0070**
  filled the two Magic Notes pages for
  real, because the app is being published and both of its URLs are hard-coded
  inside the shipped build. The product page now carries the shipped app icon
  and six real captures of the running application — the owner's own, nothing
  generated or imitated — each with alt text, plus a short set of common
  questions that restates what the page already says. The privacy policy is no
  longer marked `draft`: it was read against the application's **source** rather
  than its documentation (no networking API referenced anywhere, no analytics or
  advertising SDK linked, Spotlight indexing defaulting to off, four Shortcuts
  actions as the only system surface), and it now names the exact folder to
  remove to erase everything, because Magic Notes has no in-app erase-all. Price,
  store link, release date and maker's note are all still absent, all still
  unverified, and the "In development" badge stays. Shipped as **v0.47.0**.
  Before it, **STEP-0069** put a second product on the site.
  Magic Notes — a finished but unreleased macOS notebook that answers arithmetic
  written as plain sentences — now has `/apps/magic-notes/` and
  `/privacy/magic-notes/`, built from two content files and no code change. It
  exists because the app's own store submission draft already names that privacy
  URL, which until now returned a 404: Apple 5.1.1(i) needs it live at review
  time, and a URL baked into a shipped build cannot be corrected quietly. The
  page claims no download, no price and no release date, because none of those
  is verified — the app has no purchase code anywhere in its source. Its hue,
  `#B2BBC5`, is read from the app's own Graphite accent in dark appearance
  rather than picked for the site; the app's first-run orange was rejected for
  sitting two points from Sole Focus's. The policy ships as `reviewStatus:
  draft` — truthful to the app's documented controls, not yet read against the
  shipped build. Still the owner's alone, and not blocked on this site: the
  trademark search for the name, the price, and the App Store category.
  Before it, **STEP-0067..0068** were the last two packets from
  the AUDIT-0010 evaluation, both internal and both shipped after v0.45.0.
  STEP-0067 moved `PolicyArticle.astro`'s five hardcoded legal sections into the
  content schema, where an optional `sections` field lets one product override
  one section without touching a component every product shares. The published
  text is unchanged bar one genuinely missing space, and four sections that were
  raw JSX now go through the wrapping rule — they were the last body copy on the
  site exempt from it. STEP-0068 added a second vitest suite that reads the built
  `dist/**/*.html` directly, under its own config and its own script
  (`npm run test:dist`), because nothing between a broken page and production
  noticed a wrong canonical URL, malformed JSON-LD, a third-party script, a
  missing CSP, or the wrapping rule silently not reaching rendered Markdown.
  Each of its assertions was seen red against deliberately broken output first.
  No visual change shipped in either. Before them, **STEP-0064..0066** followed
  v0.45.0 as internal
  work, from the AUDIT-0010 whole-project evaluation (overall 84; security was
  the lowest area at 62). STEP-0064 declared `@astrojs/markdown-satteri` and
  `satteri`, which `astro.config.mjs` and `src/lib/satteri-tie.ts` imported
  while resolving only as dependencies *of* astro — an astro release dropping
  either would have broken the build with no warning, and a variant of that
  failure stops the wrapping rule reaching Markdown silently. STEP-0065 added a
  Content-Security-Policy to every page, which is what turns the stated control
  "no third-party script embeds" into an enforced one; its probe caught a defect
  the card would otherwise have shipped, because `--hue` is set as a style
  attribute and the first policy blocked every product colour on the site.
  STEP-0066 is this file. No visual change shipped in any of the three.
  Previously **STEP-0060..0063** shipped as **v0.45.0** — seven
  pieces of owner feedback from a hands-on pass over the live site, worked as
  four packets and measured on the built pages before and after. Every page now
  starts 48px below the header (it was 170 / 96 / 49 / 32 across seven pages);
  an app icon sits beside its name on one line and both back links share the
  page rail; no line of body text ends on a stray short word (22 → 0); the home
  page's three feature columns are 3 lines each and end level (they were 7/7/4);
  and the "What it does" grid has no empty slot at any width. Four rules are now
  named in `DESIGN.md` — Page-Top, Identity Lockup, Wrapping, Full-Row — each
  recording what it replaced, because two of them reverse earlier decisions that
  had good reasons at the time. Previously **STEP-0059** as **v0.44.11** — the
  support address is served as readable text again after Cloudflare's Email
  Address Obfuscation rewrote it at the edge. The Spectrum identity phase
  (STEP-0044..0049) and the motion phase (STEP-0054..0056) are both complete.
  *(Keep a Step ID in this bullet: the validator resolves the active step from
  the first `STEP-XXXX` token in this file, and without one here the scan falls
  through to the trigger-armed STEP-0033 template and the validator fails
  locally. CI is retired, so nothing catches this remotely.)*
- **Governance:** the feature-42 catch-up is complete: **MC-0019, DISC-0013,
  AUDIT-0008, and ENH-0006** clear every checkpoint due through feature step 42.
  The catch-up repaired stale live-state, milestone, schema, testing, issue, and
  checkpoint documentation and hardened the validator against another false
  green when `STATUS` and `CHECKPOINTS` disagree about due work.
- **Open issues:** none. [GitHub #3](https://github.com/metekaplangit/solo-developer-portfolio-website/issues/3)
  (WCAG 1.1.1, home lead image alternative) was resolved in v0.39.3.
- **Known accepted tradeoff:** at 320px the navigation row scrolls and ~52px of
  "About" is clipped. Page overflow stays 0. The edge-fade cue was tried and
  rejected (see `Nav.astro`), and fitting four items needs either sub-ramp type
  or 2px pill padding. Shortening the label to "Apps" below ~360px is the one
  clean fix and is an owner naming decision, not a defect.
- **Next action:** **nothing is blocked on you.** The AUDIT-0009 blocker is
  resolved: Cloudflare Web Analytics no longer injects
  `static.cloudflareinsights.com/beacon.min.js`. Verified 2026-08-01 —
  `curl -s https://metkapstudio.com/` returns exactly one `<script>` element,
  `type="application/ld+json"`, and zero matches for `cloudflare|beacon|
  analytics`. **STEP-0065** now enforces that boundary instead of merely
  stating it: every page carries a Content-Security-Policy, proved against a
  replay of the same injection. Should the setting ever be turned back on, the
  page breaks visibly rather than silently. Then: **STEP-0058** (AVIF for the LCP screenshot)
  was built, measured and **rejected** — AVIF came back 14-31% *larger* than the
  current WebP at every width, because these are UI screenshots rather than
  photographs. Nothing shipped; WebP-only stays. All five items the owner reported on
  2026-08-03 are worked and closed. Next is the owner's own instruction. Do not invent in-development
  products.
- **Open follow-ups from the 2026-07-18 system health check** (none are defects;
  all are deliberate, unscheduled debt):
  1. ~~**Duplication** — the home spotlight and the catalog lead-row built
     twice.~~ **Closed by STEP-0047**, which extracted `ProductBand.astro` as
     the one definition of a product at band scale; the component's own header
     records it. Listed as open here until AUDIT-0010 checked it (2026-08-01).
  2. ~~**`PolicyArticle.astro` holds hardcoded legal prose** — five of its
     sections are literal strings in the component when the content schema is
     supposed to own them.~~ **Closed by STEP-0067**, which moved all five into
     an optional `sections` field on the policy schema. AUDIT-0010 had ranked it
     the highest-value refactor in the codebase; a product whose legal text
     differs now overrides one section in its own content file.
  3. ~~**About/Support pages lack the in-content link underline.**~~ **Moot, not
     fixed — there was nothing to fix.** Checked against the built pages
     2026-08-01: every in-content link on both sits inside `.elsewhere`,
     `.products` or `.privacy-ref`, and all three ARE in the global underline
     selector list (`src/styles/global.css`). Neither page has a bare unclassed
     prose link. The original note misread the removal of dead `.about` /
     `.support` rules as a gap in coverage.
  4. **`noUncheckedIndexedAccess` is off** (`astro/tsconfigs/strict` sets only
     `strict: true`; the flag lives in `strictest`). `showcase[0]` types as
     non-optional while the pages correctly guard for undefined — so deleting a
     "redundant" `?.` would crash at runtime with a green typecheck. Measured
     2026-07-18: enabling it surfaces **exactly 7 errors** — `index.astro:158`,
     `apps/index.astro:74`, `ScreenshotShowcase.astro:354`, and 4 in tests. A
     contained packet, not an open-ended migration. The three source-side
     entries still stand; the test-side count predates STEP-0067/0068, which
     took the suite from 45 tests to 96 + 8, so re-measure before scoping.

## Current facts

- Completed **feature** steps: **79** (`STEP-0001`..`STEP-0081`; STEP-0033 is
  trigger-armed and unstarted, STEP-0058 closed measured-and-rejected).
- Products on the site: **2.** Sole Focus (released, Mac App Store) and Magic
  Notes (in development, no store link). The catalogue lists both; the home page
  still leads with Sole Focus alone, because only it is `featured`.
- Current product tag: **v0.48.1**. `[Unreleased]` is empty.
- Branch policy: `main`; non-destructive feature/checkpoint branches and
  `--no-ff` merge commits; no history rewriting or force-push.
- Remote: `origin` = `metekaplangit/solo-developer-portfolio-website`.
- Blockers: **none.** SMOOTH-0009-2 is resolved — the beacon is off the live
  site, and STEP-0065 makes its return break visibly. Due checkpoints: **none**.
- Open GitHub issues: **none** — #3 resolved in v0.39.3.
- Dependency note: **STEP-0064** declared `@astrojs/markdown-satteri` and
  `satteri`, which the build imported while resolving only as dependencies *of*
  astro. Adding them made npm re-resolve, so the lockfile moved to Astro 7.1.6
  inside the existing `^7.0.0` range — kept deliberately and proved: all 8
  routes rebuilt identically except astro's own `generator` meta string.
  `npm audit --omit=dev` is clean (3 production advisories cleared); 5 dev-only
  advisories remain under `@lhci/cli` and are named with their reason in
  `docs/SECURITY.md`.

## Machine-readable state

```yaml
schema_version: 1
profile: standard
active_overlays: [commercial-compliance-armed]
active_step: none
current_step: STEP-0081 (one shared indent for a page title that leads with the identity lockup). Live release v0.48.1.
next_step: NOT BLOCKED — the owner's 2026-08-04 UI polish batch (STEP-0078..0081) is complete. Then: the Magic Notes store link, price and release date once the app is accepted; or trigger-armed STEP-0033; or noUncheckedIndexedAccess (health-check follow-up 4)
branch: main
head: regenerate live with git rev-parse HEAD
product_tag: v0.48.1
live_url: https://metkapstudio.com/ (live, HTTPS enforced)
brand: MetKap Studio
domain: metkapstudio.com (live; Cloudflare proxy; https_enforced: true)
dirty: false
dirty_paths: []
remote_sync: origin (github.com/metekaplangit/solo-developer-portfolio-website)
due_checkpoints: none
blockers: none
required_reads: [STATUS.md, ROADMAP.md, CHECKPOINTS.md, SECURITY.md, DATA_STORAGE.md]
required_checks: [npm run build, npm run check, npm test, npm run test:dist, npm run test:ui, scripts/validate-governance.py]
calibration: completed
updated_at: 2026-08-03
```

Live commands override this snapshot. At startup regenerate branch/HEAD/dirty
state with `git status --porcelain --branch` and `git rev-parse HEAD`.

## Verified wrap-up gates (2026-07-18)

| Gate | Result | Evidence |
|---|---|---|
| Static build | Pass | `npm run build`: static output, 8 routes |
| Type/content check | Pass | `npm run check`: 0 errors, 0 warnings, 0 hints |
| Unit tests | Pass | `npm test`: 45/45 |
| Production dependency audit | Pass | `npm audit --omit=dev`: 0 vulnerabilities |
| Governance validator | Pass | 44/44 (now advisory, not merge-critical) |
| Git integrity | Pass | `git fsck`, `git diff --check`, no tracked secret-pattern hits |
| Remote automation | Pass | Deploy workflow green (builds, passes the a11y gate, publishes) |

Re-run on 2026-08-01 against `main` at STEP-0068, all by exit code: build 0
(8 routes), `npm run check` 0 errors / 0 warnings / 0 hints, `npm test` 96/96,
`npm run test:dist` 8/8, validator 44/44. The table above is the 2026-07-18
snapshot and its 45-test figure predates STEP-0067/0068.

The Lighthouse accessibility threshold remains enforced in `deploy.yml` — after
merge, blocking the live publish rather than the merge itself. The
latest product packets also recorded zero axe violations and no overflow across
their measured route/viewport matrices; this docs-only catch-up did not change
rendered output.

## Checkpoints and issues

`docs/CHECKPOINTS.md` is the sole checkpoint-history owner. The fixed cadence
was retired on 2026-07-18 — checkpoints are now run on demand, when there is a
reason, and nothing is ever "due". See ROADMAP.md.

GitHub Issues is the active issue owner. `docs/issues/LEDGER.md` is read-only
pre-remote history; LEDGER-001 and LEDGER-002 are resolved.

## Operating boundaries

- Keep Astro `output: 'static'`; no backend, database, serverless runtime,
  analytics, forms, accounts, or third-party runtime services.
- Product facts and privacy claims come from typed `src/content/` files. Keep
  store price/status, policy text, and JSON-LD truthful as the listing evolves;
  never fabricate ratings or products.
- App codebases supplied beside this repo are read-only sources of truth. Never
  modify them while working on the website.
- Freeze one Task Card before product work and stop at its acceptance boundary.

## Governance validator

```sh
python3 scripts/validate-governance.py
```

The command is also recorded in `AI_WORKFLOW.md`. Run it locally before a merge
you care about.

**CI status: Blocked — deliberately, on 2026-07-18.** `.github/workflows/ci.yml`
was removed. It ran the validator plus `npm run check`, `npm test`, and
`npm run build` — commands that take about two seconds locally and gate nothing,
since `deploy.yml` builds independently and a broken build therefore fails the
deploy on its own. It had already failed one release over a prose paragraph that
stopped naming a Step ID, while that same commit deployed cleanly. For a
single-maintainer static site the duplication cost more attention than it
returned.

`deploy.yml` is untouched and remains the only required automation: it builds,
enforces the Lighthouse accessibility gate at ≥0.95, and publishes to GitHub
Pages. A genuine regression — a broken build or an accessibility failure — still
blocks the deploy.

**It does not run on every push.** `deploy.yml` carries
`paths-ignore: ['docs/**']`, so a commit touching only `docs/` publishes
nothing and produces no workflow run at all — deliberate, since governance
prose does not change the built site. Two consequences worth holding:

- **No run is the expected result of a docs-only push, not a failed deploy.**
  Looking for a green run after one and finding nothing is the design working.
- **Content Markdown is not exempt.** Files under `src/content/` are build
  input, so a product fact, policy text or JSON-LD field edited there deploys
  normally. Only `docs/` is ignored.

Where a docs-only change must reach the live site anyway, run the workflow by
hand — it also carries `workflow_dispatch`.
