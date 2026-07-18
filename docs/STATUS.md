# Status — Live Snapshot

> **Purpose:** Live project state and the exact next action. The single entry point.
> **Read when:** Every session, first.
> **Update when:** After every Step/checkpoint or any blocker/Git change (overwrite).
> **Synchronize with:** ROADMAP.md, CHECKPOINTS.md, VERSION_CONTROL.md, CHANGELOG.md, ISSUE_TRACKING.md.
> **Status:** Active.
> **Activation:** Standard profile + commercial/compliance overlay armed (privacy/store pages).

## Handoff (5 bullets)

- **State: STEP-0034 + STEP-0035 complete — taste-round T2 + T5 shipped,
  released together as v0.33.0** (user-approved copy: For/Not-for fit cells at
  the top of the details; maker's note opening the description; FactsLine
  overflow fix; 45 tests; DISC-0011 + MC-0017 run). Taste round closed: T1/T3
  declined, T4 closed unless reopened. New standing rule: no fabricated
  product-UI imagery in mockups — real screenshots or abstract blocks only.
- **Prior: STEP-0032 — screenshot transcript, v0.32.0**
  (review-0002 AI-07: native-details text alternative for the gallery, five
  humanized titles + alt-text descriptions, zero JS; 43 tests; **MC-0016** run
  at feature step 32). Design round for the taste-tier review ideas published
  as an artifact — user picks pending; STEP-0033 (updates/release-notes block)
  is trigger-armed, do not start before the first app update.
- **Prior: STEP-0031 — first-glance facts, v0.31.0.**
  Adopted review-0002's consolidated top finding: one quiet `FactsLine` under
  the download CTA on the product header + home spotlight ("Free — no in-app
  purchases, no subscription · macOS 10.15 or later · Works offline — no
  account, no cloud, no tracking"), plus the maker/support trust line on the
  spotlight. New optional `privacyFacts` field; 41 tests. Review-0002's 30
  ideas fully dispositioned in ROADMAP (adopted → 0031/0032; deferred →
  STEP-0033 trigger-armed; taste-tier → design round; rest declined/parked).
- **Prior: STEP-0030 — purchase-decision info, v0.30.0**
  (review-0001 OPP-04/07: human "macOS" platform badges from one shared map
  also feeding JSON-LD; verified "Requires macOS 10.15 or later" beside the
  header download button; truthful maker/support trust line linking
  About/Support; 40 tests). **AUDIT-0006 + DISC-0010 + MC-0015** (the step-30
  checkpoint trio) run alongside.
- **Prior: STEP-0029 — small-screen usability, v0.29.0**
  (external review-0001 remediation: compact scrollable mobile header, 146→94px
  at 390px; ≥44px touch targets for nav + gallery dots; zero-JS). Review
  dispositions: OPP-02 declined (deliberate CTA repetition), OPP-03/05/06
  deferred (taste-sensitive, preview-first). STEP-0030 (purchase-decision info)
  ships next with the step-30 checkpoint trio.
- **Prior: STEP-0028 — top-of-page download buttons, v0.28.0.** A reusable `DownloadButton.astro` (Apple mark + "Download on the
  Mac App Store", accent primary, product-aware aria-label) now leads the home
  hero, the home spotlight, the product detail header, and the catalog card —
  the download is findable at the top of every relevant page; the bottom "Get
  it" section remains. Verified on all surfaces in preview + live. **MC-0014 +
  ENH-0004** (due at feature step 28) run alongside.
- **Prior: 🎉 SOLE FOCUS LIVE ON THE MAC APP STORE — STEP-0027, v0.27.0.** Verified listing: "Sole Focus: Pomodoro Timer", seller Mete
  Kaplan, Mac, **Free** (https://apps.apple.com/us/app/sole-focus-pomodoro-timer/id6788789811?mt=12).
  The site now renders a primary **Mac App Store** download button in "Get it"
  (plus the catalog card link), "Released" badges everywhere, a truthful `offers`
  JSON-LD block (price 0 USD, InStock, store URL — the deferred release pass),
  release date 2026-07-15, and no "coming soon" copy. **38 tests** green (2 new
  release-state assertions). **DISC-0009** (Discussion due at feature step 27)
  run alongside.
- **Prior: v0.26.x** — swipeable screenshot gallery (STEP-0026, v0.26.0) +
  scrollbar-gutter layout-shift fix (v0.26.1); **AUDIT-OD-0001** full-system
  audit (all areas pass; CI modernized) and governance drift machine-checks
  (validator 43/43).
- **Live:** **metkapstudio.com** over HTTPS via the **Cloudflare proxy**; gem
  logo; Sole Focus product + scannable, website-scoped privacy pages.
- **Support email — DONE (2026-07-03):** `support@metkapstudio.com` receives mail
  via Cloudflare Email Routing (catch-all → verified Gmail); SPF + DKIM + DMARC
  live; verified end-to-end (inbox delivery). See DEPLOYMENT.md.
- **Pre-launch items — CLOSED by the live release (2026-07-15):** the app passed
  App Review and is live, which required the App-Privacy labels and privacy
  manifest (app-side, owner-completed). The long-standing "add the Mac App Store
  link once published" website blocker is **done** (STEP-0027).
- **Next action:** the ship-blockers are cleared. Candidates: **`FAQPage`
  JSON-LD** (natural follow-on to the release-pass structured data), on-site
  **changelog/updates block**, more products (fills the now-centered grids),
  optional Terms/disclaimer page, lighter-touch description refresh
  (prose-preserving — Format B rejected). Freeze a Task Card before editing.
- **Required reads:** `STATUS.md`, `ROADMAP.md`, `CHECKPOINTS.md`, `SECURITY.md`,
  `DATA_STORAGE.md`.
- **Blockers:** none. Keep the policy and structured data truthful as the listing
  evolves (ratings JSON-LD stays out until real rating data exists — see
  `lib/schema.ts` header and `SECURITY.md`).

## Working with app codebases (convention)

The user provides each app's full codebase folder (e.g. `../PromodoApp/` for Sole
Focus) as **read-only** source of truth (product info, privacy, icon). **Never
modify those folders.** Learn from them and build website content here. Key files
to read: `README.md`, `docs/PRIVACY.md`, `appstore/REVIEW_NOTES.md`, app icon,
`src-tauri/tauri.conf.json` (name/version/bundle id).

## Last completed Step Packet

- **STEP-0031 — First-glance facts** — **DONE**, merged, tagged **v0.31.0**.
  Task Card: `docs/tasks/STEP-0031.md` (review-0002 adoption; FactsLine on
  header + spotlight; spotlight trust line; privacyFacts field + test).
- Prior: **STEP-0030 — purchase-decision info** (v0.30.0, with the step-30
  checkpoint trio) and **STEP-0029 — small-screen usability** (v0.29.0), both
  review-0001 remediation. Task Cards: `docs/tasks/STEP-0029.md`/`STEP-0030.md`.
- Prior: **STEP-0028 — Top-of-page download buttons** — merged, tagged
  **v0.28.0**. Task Card: `docs/tasks/STEP-0028.md`. Delivered: reusable
  `DownloadButton.astro` placed on home hero (leading), spotlight, detail
  header, catalog card; graceful fallbacks for unreleased products; bottom
  "Get it" retained. **MC-0014 + ENH-0004** run (feature step 28).
- Prior: **STEP-0027 — Release pass: Sole Focus live on the Mac App Store** —
  merged, tagged **v0.27.0**. Task Card: `docs/tasks/STEP-0027.md`.
- Delivered: verified store URL wired as the primary "Get it" download button
  (+ catalog card link); status flipped to Released site-wide from the one
  content file; truthful `offers` JSON-LD (price 0 USD, InStock, store URL) via
  a new optional `price` content field; release date recorded; "coming soon"
  copy removed; 2 new release-state tests (38 total). **DISC-0009** run
  (Discussion due at feature step 27).
- Prior packet: **STEP-0026 — Swipeable product screenshot gallery** — merged,
  tagged **v0.26.0**. Task Card: `docs/tasks/STEP-0026.md`.
- Delivered: rebuilt `ScreenshotShowcase.astro` from a vertical stack into a
  single-image gallery (CSS scroll-snap track + progressive-enhancement script):
  one large screenshot at a time (size unchanged), left/right arrows, dots, live
  counter, native swipe, keyboard ←/→; compact regardless of shot count; honors
  `prefers-reduced-motion`. Bigger accent-styled arrows/dots per follow-up. Fixed
  three carousel a11y violations to keep the Lighthouse gate ≥0.95; verified
  axe-clean. **MC-0013** (due at feature step 26) run — no drift.
- (Prior: STEP-0025 centered layout v0.25.0 + AUDIT-0005; STEP-0024 v2 listing
  copy v0.24.0; STEP-0023 real screenshots v0.23.0; STEP-0022 JSON-LD v0.22.0;
  … v0.1.0.)

## Next Step Packet (to freeze)

- **Not yet chosen.** Candidates: **`FAQPage` JSON-LD** (natural follow-on to
  the release-pass structured data), **changelog/updates block**, **more real
  products**, **optional Terms/disclaimer page**, lighter-touch description
  refresh (prose-preserving). (Screenshots → v0.23.0; copy → v0.24.0; gallery →
  v0.26.0; release pass → v0.27.0.) One outcome only.

## Machine-readable state

```yaml
schema_version: 1
profile: standard
active_overlays: [commercial-compliance-armed]
active_step: none
current_step: STEP-0035
next_step: FAQPage JSON-LD; or changelog/updates block, more products, Apple-submission checklist doc, Terms/disclaimer page
branch: main
head: regenerate-live (git rev-parse HEAD) — STEP-0035 merge, tagged v0.33.0 (covers STEP-0034+0035; HEAD may carry post-release checkpoint docs)
product_tag: v0.33.0
live_url: https://metkapstudio.com/ (live, HTTPS enforced)
brand: MetKap Studio
domain: metkapstudio.com (live; cert approved; https_enforced: true)
dirty: false
dirty_paths: []
remote_sync: origin (github.com/metekaplangit/solo-developer-portfolio-website)
due_checkpoints: none
blockers: none
required_reads: [STATUS.md, ROADMAP.md, CHECKPOINTS.md, UI_DESIGN.md, ARCHITECTURE.md]
required_checks: [npm run build, npm run check, npm test, scripts/validate-governance.py]
calibration: completed
updated_at: 2026-07-17
```

> The live Git block above is validator/observed-owned. Regenerate with
> `git status --porcelain --branch` and `git rev-parse HEAD`; live results
> override this prose.

## Governance validator

```
python3 scripts/validate-governance.py
```
Recorded here, in `AI_WORKFLOW.md`, and in `.github/workflows/ci.yml` (CI runs it).

## Profile & overlays

Standard profile. Commercial/compliance overlay **armed** (activates its controls
when privacy/store-support pages with real product/policy text are built — M3).
No escalation triggers observed. No maturity thresholds breached (baseline).

## Gate table (baseline)

| Gate | Result | Class | Evidence |
|---|---|---|---|
| Static build (`npm run build`) | Pass | Merge-critical | 8 routes (1 real product) + sitemap/robots/404/favicon, `output: "static"` |
| Type + content check (`npm run check`) | Pass | Merge-critical | 0 errors / 0 warnings / 0 hints |
| Unit tests (`npm test`) | Pass | Merge-critical | 38 passed (incl. release-state + screenshot content tests); run in CI |
| Dependency audit (`npm audit --omit=dev`) | Pass | Merge-critical | production/shipped deps: `found 0 vulnerabilities`. Dev-only CI tooling (`@lhci/cli`) has transitive advisories that never ship. |
| Accessibility gate (Lighthouse CI) | Pass | Merge-critical (a11y) | `accessibility ≥ 0.95` asserted as error on all built pages; verified green in CI (PR #1). Perf/SEO/best-practices are warnings. |
| Governance validator | Pass | Merge-critical | 43/43, exit 0 (now incl. 3 cross-doc sync checks: product_tag↔git tag, STATUS↔CHECKPOINTS feature count, CHANGELOG↔tag) |
| Runtime visual (home) | Pass | Manual-runtime | dark-premium theme; desktop + mobile screenshots; no console errors; no overflow |
| Deployment code/config (domain) | Pass | Merge-critical | build at root; CNAME/canonical/robots on metkapstudio.com; Pages cname set |
| Live domain HTTPS | Pass | Release-critical (channel) | cert approved; https 200 + valid TLS; http→https 301; enforce_https on; www→apex |

## Checkpoints

Completed **feature** steps: **34** (STEP-0001..0030) — this counter is
machine-cross-checked against CHECKPOINTS by the validator. Next-due: Markdown
Consistency after 32; Discussion after 33; Enhancement after 35; Audit after 35
(AUDIT-0006 + DISC-0010 + MC-0015 done at 30). The full
checkpoint history — scheduled and on-demand (MC-OD-*, AUDIT-OD-*) — lives only
in the **CHECKPOINTS ledger** (single owner; deliberately not duplicated here —
duplicated history caused recurring drift, repaired at MC-OD-0009/0010).
On-demand runs do not reset cadence. Calibration: completed 2026-07-02.

## Issues

- **LEDGER-001** — **RESOLVED in STEP-0015 (v0.15.0):** the icon-or-monogram
  avatar was duplicated in ProductCard + detail; centralised in
  `src/components/ProductAvatar.astro`, now also used by the privacy header.
- **LEDGER-002** — **RESOLVED in STEP-0017 (v0.17.0):** added a Lighthouse CI
  **accessibility gate** (`lighthouserc.json` + `ci.yml`/`deploy.yml`) that fails
  on accessibility regressions; verified green in real CI. Visual-regression
  snapshots remain out of scope (not required by the gate).

Neither is release-blocking. Fallback ledger: `docs/issues/LEDGER.md`.

## Compliance (Critical Operating Contract)

Followed: one frozen Step Packet (STEP-0001), risk-based tests shipped with the
code, all merge-critical gates Pass with evidence, non-destructive Git (merge
commit + tag), docs synchronized, validator passing. No deviations.

## Version control

Repo slug `solo-developer-portfolio-website` (local folder
`solo-dev-portfolio-website`). Latest product tag: **v0.30.0** (STEP-0030 purchase-decision
info); prior v0.29.0, v0.28.0, v0.27.0, v0.26.1,
v0.26.0 (STEP-0026), v0.25.0..v0.1.0. Baseline (M0) internal-only. Remote:
`origin`, in sync (product tag `v0.30.0`; HEAD may carry post-release checkpoint
docs). **Live channel:** GitHub Pages + custom
domain **metkapstudio.com** (HTTPS enforced).

**Note on STEP-0026 structure:** the gallery shipped across three merges (feature
+ two a11y fixes) under a "deploy if you can" instruction rather than one clean
packet→branch→merge. STEP-0026 formalizes the packet retroactively and tags the
release merge; the code was already live and gate-green. Standing rule going
forward: ship autonomously (commit/merge/push/deploy/tag) — see AI_WORKFLOW.md.

**Deploy reliability note:** GitHub Pages' publish step (`actions/deploy-pages`)
intermittently sits in `deployment_queued` and times out (GitHub-side congestion;
our build is fast and always succeeds). `deploy.yml` is a **single job** (Node
from `.nvmrc`, npm cache, no build→deploy artifact handoff) with `paths-ignore:
docs/**`, `cancel-in-progress: true`, and the deploy timeout at the action's
10-min maximum (600000 ms; higher values are clamped). Also note
GitHub Pages hard-caps responses at `cache-control: max-age=600` — after a green
deploy your **browser** may show the old page for ≤10 min; verify with
`curl -sI` or a hard-refresh/incognito, not a normal reload. If a deploy fails,
re-run it (transient). **Instant visitor freshness is now in place:** the
**Cloudflare proxy is enabled** (orange-cloud apex `A` + `www` `CNAME`, SSL/TLS
`Full (strict)`, Always-Use-HTTPS on) and verified 2026-07-02 — `server:
cloudflare` on HTTP/2 200, clean `http→https` 301 (no loop), `cf-cache-status:
DYNAMIC` (HTML served fresh; static assets edge-cached). See DEPLOYMENT.md.
