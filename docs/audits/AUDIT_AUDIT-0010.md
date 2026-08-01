# Audit Checkpoint AUDIT-0010 — Whole-project evaluation

- **Trigger:** On-demand whole-project evaluation (`/evaluate-project`).
- **Reviewed range:** HEAD `12fe809` (v0.45.0), clean tree on `main`, in sync
  with `origin`. Local build plus the live site at `https://metkapstudio.com/`.
- **Date:** 2026-08-01.
- **Impact bar:** a finding earns a Step Packet only if the owner would feel it,
  pay for it, lose data to it, or be stopped by it. Everything below that bar is
  recorded here in one line and deliberately left alone.
- **Scope:** development-phase areas only. Privacy & legal, running cost and
  store readiness were not requested and are out of scope — not scored, not
  averaged in.

## What was read

Wide pass: layout, `CLAUDE.md`, `PRODUCT.md`, `DESIGN.md`, `astro.config.mjs`,
`package.json`, `docs/STATUS.md`, `docs/ROADMAP.md`, the deploy workflow, and
223 commits of history with per-file churn.

Deep pass: `src/pages/index.astro` and `src/pages/apps/[slug].astro` (the two
most-changed pages), `src/components/PolicyArticle.astro` and
`ProductBand.astro`, `src/layouts/BaseLayout.astro`, `src/styles/global.css`
(1012 lines, the highest-churn file in the repo), and the pure modules
`grid.ts`, `prose.ts`, `typography.ts`. Plus the built `dist/` and the live
HTML and response headers.

## Checks run

| Check | Result |
|---|---|
| `npm run build` | exit 0 |
| `npm test` | exit 0 — 10 files, 83 tests |
| `npm run check` | exit 0 — 49 files, 0 errors, 0 warnings, 0 hints |
| `python3 scripts/validate-governance.py` | exit 0 — 44 checks passed |
| `curl` the live site | HTTP 200, one `<script>` on the page (JSON-LD only) |

Nothing was changed while scoring.

---

## Seniority verdict

**Senior**, with stretches that read as veteran.

Three concrete things decided it:

1. **`src/lib/typography.ts`.** The wrapping rule is a real typographic
   algorithm — a curated tie-word set with a stated reason for every inclusion
   and three deliberate exclusions (`up`, `off`, `out`), a `MAX_PAIR` ceiling
   derived from the narrowest measured column, and a regex whose lookahead is
   explained because consuming both words would have made every second pair
   invisible. It is idempotent by construction and unit-tested. A mid-range
   developer writes `text-wrap: pretty` and moves on; this file explains, with
   a citation, why that does not work.
2. **The `--hue` remapping in `src/pages/apps/[slug].astro:240`.** One style
   block redefines four accent tokens at the page root, so the download button,
   badges, gallery controls and focus ring all take the product's colour and no
   component knows hues exist. That is the correct level to solve it at, and
   the comment says why.
3. **The comments record what was measured and what was rejected.** `170 / 96 /
   49 / 32 across seven pages`, `205px (~25ch) at 68rem`, `four equal 273px
   tracks`, `576px against a 604px slot at 1440`. A specificity bug in the hero
   stagger is documented with the reason it silently never ran. Reversed
   decisions state what they replaced. This is a codebase that can be picked up
   cold.

**Where it is uneven.** The application layer is senior throughout; the
*operational* layer is not. There is no Content-Security-Policy anywhere, and
this project has already been burned once by a third-party script appearing on
the live site without anyone noticing. Eleven npm advisories sit unaddressed.
That gap — excellent code, thin operational guard — is the useful finding here.

Judged from the artifact only.

---

## Scorecard

Worst first.

| Area | Score | Why | Biggest lift |
|---|---:|---|---|
| Security | 62 | No CSP, no `referrer-policy`, no `x-content-type-options` on any response or in any document. A Cloudflare edge injection put a third-party beacon on every live page and nothing detected it. No secrets in the repo; no runtime, forms, auth or user input. | A `<meta http-equiv="Content-Security-Policy">` in `BaseLayout.astro`. It is the one control that turns silent edge injection into a visible break. |
| Dependencies | 68 | Only 2 runtime deps and 4 dev deps — minimal by design. But `npm audit` reports 11 advisories (5 high, all build-time-only), and `astro.config.mjs` plus `src/lib/satteri-tie.ts` import `@astrojs/markdown-satteri` and `satteri`, neither declared in `package.json` — both are transitive deps of `astro`. | Declare the two satteri packages, then take the non-breaking `npm audit fix`. |
| Observability & logging | 70 | No error reporting, no analytics, by stated policy. Nothing will tell the owner the site is broken except visiting it. Deliberate and defensible at this size, so not treated as a defect. | Nothing worth building. The deploy gate is the practical substitute. |
| Tests & coverage | 72 | 721 test lines against 4308 source lines. Every pure module is tested and tests carry the reason they exist (`review-0001 OPP-04`). But 14 components and 8 pages have no rendering test — `astro build`, `astro check` and the Lighthouse a11y gate are the only things between a broken page and production. | One build-output assertion suite over `dist/`: canonical URLs, JSON-LD validity, no page overflow markers. |
| Hidden bugs / correctness | 80 | Build, type check and 83 tests all green. Past defects are documented with the measurement that found them. The undeclared satteri imports are the one latent build-breaker: `npm update astro` inside `^7.0.0` can drop them with no warning. | Same as Dependencies — declaring them removes the trap. |
| Documentation | 82 | 27 canonical docs, a validator enforcing cross-document consistency, `SOURCE_MAP.md`, and a changelog that matches the tags. Rare quality for a solo project. Deduction is drift: `STATUS.md` still lists the analytics decision as the pending next action (the live site now serves zero third-party scripts), still lists the `ProductLead` extraction as open (done in STEP-0047 — `ProductBand.astro:4` says so), and still lists the About/Support underline gap (moot — every in-content link on both pages sits in `.elsewhere` / `.products` / `.privacy-ref`, all covered by the global rule). | Refresh the three stale follow-ups in `STATUS.md`. |
| Engineering principles | 85 | SRP and DRY hold: pure logic lives in `src/lib/*`, components stay presentational, tokens are declared once. One clear Open/Closed violation — `PolicyArticle.astro` hardcodes the prose for five legal sections that the content schema is supposed to own, so a second product with different wording means editing a shared component. | Move the five hardcoded sections into the policy schema. |
| Code smells | 87 | Very few. `global.css` at 1012 lines carries tokens, reset and ~15 component classes in one file — large but ordered and commented. Page-level `<style>` blocks run long (190 and 180 lines). No dead code found; removed rules are noted as removed. | Nothing at the bar. The `PolicyArticle` prose is the only smell that costs anything. |
| Accessibility | 88 | Skip link, correct landmarks, `aria-labelledby` throughout, visually-hidden section headings, persistent underlines added specifically for WCAG 1.4.1, `prefers-reduced-motion` guards on every animation, and an alt-text policy reasoned against SC 1.1.1. A Lighthouse accessibility gate at ≥0.95 blocks every deploy. Known: ~52px of "About" clips at 320px (WCAG 1.4.10), accepted by the owner. | The 320px nav decision, which is a naming call, not a code fix. |
| Error & crash handling | 88 | Nothing runs at runtime, so nothing can crash. 404 page present. `resolveScreenshot` returns undefined and every caller filters. Bad content fails the build loudly via the zod schema. | None at the bar. |
| Architecture & refactoring | 88 | Clean layering: content → schema → lib → components → pages. Static-only guardrails are stated in `astro.config.mjs` and *enforced* by the governance validator (`guardrail.astro_output_static`, `guardrail.no_ssr_or_paid_adapters`), so the boundary cannot erode silently. `ProductBand` is a real completed extraction. | The `PolicyArticle` schema move is the only structural work outstanding. |
| Build & release | 88 | One deploy workflow with least-privilege permissions, Node pinned from `.nvmrc`, `npm ci`, concurrency cancel, docs-only path skipping, and a Lighthouse accessibility gate that blocks the live deploy. A local governance validator gates merges. `package.json` stays at `0.0.0` while tags carry the real version — deliberate for a private package, but no tooling can derive the version from the manifest. | Nothing at the bar. |
| Design patterns | 90 | Idiomatic Astro throughout: content collections with a zod schema, `astro:assets` for responsive images, token remapping instead of prop-drilling, pure functions for anything testable. The `evenColumns` grid rule solves a problem CSS genuinely cannot. | None. |
| Stress / resilience | 90 | Static files on GitHub Pages behind Cloudflare. No process, no state, nothing to exhaust. | None. |
| Wording & translations | 90 | English only, deliberately. Copy is unusually careful, and a build-time typographic engine enforces consistency across Markdown and component strings alike. | None. |
| UI/UX | 90 | Recently hand-tuned across four packets with before/after measurements on the built pages. Four named rules in `DESIGN.md`, each recording what it replaced. One accepted tradeoff at 320px. | None at the bar. |
| Feature completeness | 92 | The site does what `PRODUCT.md` says. Catalog scaffolding is dormant by an explicit condition (`hasCatalog = products.length > 1`) rather than half-built. | None. |
| Performance | 93 | **Zero JavaScript files in `dist/`** — one 1093-byte inline module is the entire client runtime. WebP responsive images with `sizes` measured against the real slot, `fetchpriority` set on exactly one image per page with the reason cited. Lighthouse runs on every deploy. | None. |

**Overall: 84.** Weighted toward the four craft areas and the areas with live
user impact (accessibility, performance, UI/UX), since this is a five-page
static site whose entire job is to be read. Nothing scored under 40.

**Not applicable:**

- **Memory** — no long-lived runtime; a 1KB inline module for one page lifetime.
- **Data persistence** — nothing is stored, read back, or migrated anywhere.

**Below the impact bar, recorded and left alone:**

- `global.css` at 1012 lines could be split; it is ordered and commented, and
  splitting it would cost more in cross-file lookups than it saves.
- Page-level `<style>` blocks in `index.astro` and `[slug].astro` run long.
- `package.json` version stays `0.0.0` while git tags carry the real one.
- No `twitter:title` / `twitter:description`; both correctly fall back to the
  Open Graph tags.
- Eight of eleven npm advisories are dev-only and fixing them needs a breaking
  `@lhci/cli` downgrade — not worth it.

---

## Ranked refactors from the craft reading

Direction only, ranked by what they unblock rather than by lines touched.

1. **Move `PolicyArticle`'s hardcoded legal prose into the policy schema.**
   Five sections — "What we never collect" is data-driven but "How your data is
   protected", "Children's privacy", "Your rights", "Contact & requests" and
   "Changes to this policy" are literal strings in the component, some behind
   ternaries on `collectsData` / `storesLocally`. Unblocks: a second product
   whose legal text differs from Sole Focus's, without editing shared code.
2. **Declare the satteri packages.** Two lines in `package.json`. Unblocks any
   `astro` update being safe.
3. **A build-output test suite.** Assert against `dist/` what no unit test can
   see: canonical URLs, valid JSON-LD, the tie rule actually applied to
   rendered Markdown. Unblocks confident refactoring of the component layer,
   which is currently the untested half of the codebase.

---

## What happened next

Recorded so a later session re-planning from this file does not re-propose work
that is already done. Everything above was written before any fix started; this
section was appended after.

| Card | Became | State |
|---|---|---|
| Declare the satteri packages | STEP-0064 | Merged, pushed |
| Content-Security-Policy | STEP-0065 | Merged, pushed, live |
| Retire three stale STATUS claims | STEP-0066 | Merged, pushed |
| Policy prose into the content schema | STEP-0067 | Merged, pushed |
| Build-output test suite | STEP-0068 | Merged, pushed |

All five closed in one pass, each on its own branch with its own proof and merge
commit. Final gates on `main`: build 0, check 0/0/0, 96 unit tests, 8
build-output tests, validator 44 checks, `npm audit --omit=dev` 0. The deploy
workflow ran the Lighthouse accessibility gate and passed, which is the one check
that cannot run on this machine — and the live site now serves the CSP.

**Two findings the run produced that the scorecard above could not have:**

1. **The CSP probe caught a defect before it shipped.** The first policy blocked
   inline style attributes, which is how `--hue` carries the Spectrum identity —
   every product colour on the site would have silently reverted to the
   achromatic default. Scoring found the missing control; only driving it found
   what enforcing it would break.
2. **The validator caught a gap the run had left.** Three internal packets had
   cards and commits but no ROADMAP entries. The project's own tooling named it.

**Left open, unchanged:** STATUS follow-up #4 — `noUncheckedIndexedAccess` is
off, and enabling it surfaces exactly 7 errors (measured 2026-07-18). It
describes a latent runtime crash behind a green typecheck, it is a contained
packet, and it did not make the five only because the cap is five. It is the
strongest candidate for the next run.

## Sources consulted

- [Astro Best Practices 2026](https://agnitestudio.com/blog/astro-best-practices/) — confirmed this project already follows the static-first / no-global-third-party-scripts guidance; nothing new to add to the area list.
- [The 2026 Guide to Software Supply Chain Security](https://cloudsmith.com/blog/the-2026-guide-to-software-supply-chain-security-from-static-sboms-to-agentic-governance) and [How to Evaluate an npm Package — 2026](https://blog.gaborkoos.com/posts/2026-05-29-How-to-Evaluate-an-npm-Package-2026-Edition/) — dependency *provenance* is now treated as a first-class check, which is what raised the undeclared-transitive-import finding from a note to a card.
- [Sonar — What is Code Quality (2026)](https://www.sonarsource.com/resources/library/code-quality-2026/) — method check. Its position that passing tests do not evidence structural quality is why the four craft areas were read as one sitting rather than inferred from the green suite.

Where the sources and this project's own judgement disagreed: the supply-chain
guidance calls for automated dependency scanning as a merge blocker. Followed in
part — the provenance finding became a card, but a scanning gate was not
proposed, because eleven build-time-only advisories on a site that ships no
JavaScript would generate recurring noise for a single maintainer with no
corresponding risk. The project's "minimal process, no ceremony" position wins
here.
