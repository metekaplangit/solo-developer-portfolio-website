# Status — Live Snapshot

> **Purpose:** Live project state and the exact next action. The single entry point.
> **Read when:** Every session, first.
> **Update when:** After every Step/checkpoint or any blocker/Git change (overwrite).
> **Synchronize with:** ROADMAP.md, CHECKPOINTS.md, VERSION_CONTROL.md, CHANGELOG.md, ISSUE_TRACKING.md.
> **Status:** Active.
> **Activation:** Standard profile + commercial/compliance overlay armed (privacy/store pages).

## Handoff (5 bullets)

- **Latest (v0.26.1, patch):** fixed a **layout-shift** where the header logo/title
  (and all centered content) jumped ~5px sideways when navigating between a page
  that scrolls and one that doesn't (vertical-scrollbar width change). Reserved the
  scrollbar gutter globally (`html { scrollbar-gutter: stable }`); measured shift
  **5px → 0**, no horizontal overflow at 1440/375. CSS-only compatible fix.
- **State:** **STEP-0026 complete** — **swipeable product screenshot gallery**,
  released **v0.26.0**. The Sole Focus screenshot section is now a
  gallery/carousel: one large image at a time (size unchanged), left/right
  arrows + dots + swipe + keyboard, a live counter, compact regardless of
  screenshot count. Accent-styled, bigger arrows/dots per follow-up. Shipped to
  production; three initial deploys correctly blocked at Lighthouse a11y 0.91
  until three carousel axe violations were fixed → re-audited **axe-clean** and
  the a11y gate passed. **36 tests** green; **MC-0013** (due at feature step 26)
  run — no drift. Released **v0.26.0** (product state of `main`); HEAD carries the
  post-release MC-0013 checkpoint docs.
- **Prior: STEP-0025** — centered, balanced layout site-wide (v0.25.0);
  **AUDIT-0005** full-system integrity pass — all areas pass.
- **Live:** **metkapstudio.com** over HTTPS via the **Cloudflare proxy**; gem
  logo; Sole Focus product + scannable, website-scoped privacy pages.
- **Support email — DONE (2026-07-03):** `support@metkapstudio.com` receives mail
  via Cloudflare Email Routing (catch-all → verified Gmail); SPF + DKIM + DMARC
  live; verified end-to-end (inbox delivery). See DEPLOYMENT.md.
- **Pre-launch (operational, NOT website) still open before submitting Sole
  Focus:** set App Store Connect App-Privacy labels to "Data Not Collected";
  confirm the app's `PrivacyInfo.xcprivacy` privacy manifest.
- **Next action:** screenshots (v0.23.0), listing copy (v0.24.0), centered
  layout (v0.25.0), and the screenshot **gallery (v0.26.0)** are **DONE**.
  Remaining candidates: `FAQPage` JSON-LD, on-site **changelog/updates block**,
  more products (fills the now-centered grids), Apple-submission checklist doc,
  optional Terms/disclaimer page. Freeze a Task Card before editing.
- **Required reads:** `STATUS.md`, `ROADMAP.md`, `CHECKPOINTS.md`, `SECURITY.md`,
  `DATA_STORAGE.md`.
- **Blockers:** none. **Before Sole Focus ships:** (support email now LIVE ✓) add
  real screenshots + the Mac App Store link once published; set App-Privacy labels
  + privacy manifest (app side); keep the policy truthful (see `SECURITY.md`).

## Working with app codebases (convention)

The user provides each app's full codebase folder (e.g. `../PromodoApp/` for Sole
Focus) as **read-only** source of truth (product info, privacy, icon). **Never
modify those folders.** Learn from them and build website content here. Key files
to read: `README.md`, `docs/PRIVACY.md`, `appstore/REVIEW_NOTES.md`, app icon,
`src-tauri/tauri.conf.json` (name/version/bundle id).

## Last completed Step Packet

- **STEP-0026 — Swipeable product screenshot gallery** — **DONE**, merged,
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

- **Not yet chosen.** Candidates: **changelog/updates block**, **`FAQPage`
  JSON-LD** (the new FAQ is a natural fit), **Apple-submission checklist doc**,
  **optional Terms/disclaimer page**, **more real products**. (Screenshots →
  v0.23.0; listing copy → v0.24.0; gallery → v0.26.0.) One outcome only.

## Machine-readable state

```yaml
schema_version: 1
profile: standard
active_overlays: [commercial-compliance-armed]
active_step: none
current_step: STEP-0026
next_step: FAQPage JSON-LD; or changelog/updates block, more products, Apple-submission checklist doc, Terms/disclaimer page
branch: main
head: regenerate-live (git rev-parse HEAD) — v0.26.1 released; HEAD carries post-release MC-OD-0011 checkpoint docs (product == v0.26.1)
product_tag: v0.26.1
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
updated_at: 2026-07-07
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
| Unit tests (`npm test`) | Pass | Merge-critical | 36 passed (incl. required-retention negative test + screenshot content tests); run in CI |
| Dependency audit (`npm audit --omit=dev`) | Pass | Merge-critical | production/shipped deps: `found 0 vulnerabilities`. Dev-only CI tooling (`@lhci/cli`) has transitive advisories that never ship. |
| Accessibility gate (Lighthouse CI) | Pass | Merge-critical (a11y) | `accessibility ≥ 0.95` asserted as error on all built pages; verified green in CI (PR #1). Perf/SEO/best-practices are warnings. |
| Governance validator | Pass | Merge-critical | 40/40, exit 0 |
| Runtime visual (home) | Pass | Manual-runtime | dark-premium theme; desktop + mobile screenshots; no console errors; no overflow |
| Deployment code/config (domain) | Pass | Merge-critical | build at root; CNAME/canonical/robots on metkapstudio.com; Pages cname set |
| Live domain HTTPS | Pass | Release-critical (channel) | cert approved; https 200 + valid TLS; http→https 301; enforce_https on; www→apex |

## Checkpoints

Completed **feature** steps: **26** (STEP-0001..0026). Checkpoints run through
step 10, then **DISC-0004 + MC-0006**(12); **MC-0007 + ENH-0002**(14);
**DISC-0005 + AUDIT-0003**(15); **MC-0008**(16); **DISC-0006 + MC-0009**(18);
**AUDIT-0004 + MC-0010**(20); **DISC-0007 + ENH-0003**(21); **MC-0011**(22);
**MC-0012 + DISC-0008**(24); **AUDIT-0005**(25); **MC-0013**(26); steps 11, 13,
17, 19, 23 had no scheduled checkpoint. Plus on-demand MC-OD-0001..**0011**
(0011 = this wrap-up). Next: Discussion after 27; Markdown Consistency +
Enhancement after 28; Audit after 30. On-demand runs do not reset cadence.
Calibration: completed 2026-07-02.

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
`solo-dev-portfolio-website`). Latest product tag: **v0.26.1** (compatible CSS
fix — `scrollbar-gutter` layout-shift; `fix/scrollbar-gutter-layout-shift` merge);
prior v0.26.0 (STEP-0026), v0.25.0..v0.1.0. Baseline (M0) internal-only. Remote:
`origin`, in sync (product tag `v0.26.1`; HEAD carries post-release checkpoint
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
docs/**`, `cancel-in-progress: true`, and a 20-min deploy timeout. Also note
GitHub Pages hard-caps responses at `cache-control: max-age=600` — after a green
deploy your **browser** may show the old page for ≤10 min; verify with
`curl -sI` or a hard-refresh/incognito, not a normal reload. If a deploy fails,
re-run it (transient). **Instant visitor freshness is now in place:** the
**Cloudflare proxy is enabled** (orange-cloud apex `A` + `www` `CNAME`, SSL/TLS
`Full (strict)`, Always-Use-HTTPS on) and verified 2026-07-02 — `server:
cloudflare` on HTTP/2 200, clean `http→https` 301 (no loop), `cf-cache-status:
DYNAMIC` (HTML served fresh; static assets edge-cached). See DEPLOYMENT.md.
