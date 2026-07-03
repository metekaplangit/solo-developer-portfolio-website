# Status — Live Snapshot

> **Purpose:** Live project state and the exact next action. The single entry point.
> **Read when:** Every session, first.
> **Update when:** After every Step/checkpoint or any blocker/Git change (overwrite).
> **Synchronize with:** ROADMAP.md, CHECKPOINTS.md, VERSION_CONTROL.md, CHANGELOG.md, ISSUE_TRACKING.md.
> **Status:** Active.
> **Activation:** Standard profile + commercial/compliance overlay armed (privacy/store pages).

## Handoff (5 bullets)

- **State:** **STEP-0020 complete** — **clickable product icons**. A product's
  icon now links to that product (home spotlight, cards, privacy page) via an
  optional `href` on the shared `ProductAvatar` (hover-lift + press + `Open
  <product>` label); the detail-page icon stays unlinked (self page). Merged,
  tagged **v0.20.0**. 34 tests green. **AUDIT-0004 + MC-0010** run.
- **Live:** **metkapstudio.com** over HTTPS via the **Cloudflare proxy**; gem
  logo; Sole Focus product + scannable, website-scoped privacy pages.
- **Support email — DONE (2026-07-03):** `support@metkapstudio.com` receives mail
  via Cloudflare Email Routing (catch-all → verified Gmail); SPF + DKIM + DMARC
  live; verified end-to-end (inbox delivery). See DEPLOYMENT.md.
- **Pre-launch (operational, NOT website) still open before submitting Sole
  Focus:** set App Store Connect App-Privacy labels to "Data Not Collected";
  confirm the app's `PrivacyInfo.xcprivacy` privacy manifest.
- **Next action:** **deferred: hero/detail product screenshots (research item C)**
  — biggest visual lever, needs assets. Also: Apple-submission checklist doc,
  changelog block, optional Terms/disclaimer page. Freeze a Task Card before editing.
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

- **STEP-0020 — Clickable product icons** — **DONE**, merged, tagged **v0.20.0**.
  Task Card: `docs/tasks/STEP-0020.md`.
- Delivered: optional `href` on `ProductAvatar` makes the icon a link to the
  product (card/spotlight/privacy); hover-lift + press + `Open <product>` a11y
  label; detail-page icon unlinked; excluded from content-link underline. **Audit
  AUDIT-0004 + MC-0010** run.
- (Prior: STEP-0019 premium craft v0.19.0; STEP-0018 privacy completeness v0.18.0;
  … v0.1.0.)

## Next Step Packet (to freeze)

- **Not yet chosen.** Candidates: **hero/detail product screenshots (research
  item C — needs assets)**, **changelog/updates block**, **Apple-submission
  checklist doc**, **optional Terms/disclaimer page**, **more real products**.
  One outcome only.

## Machine-readable state

```yaml
schema_version: 1
profile: standard
active_overlays: [commercial-compliance-armed]
active_step: none
current_step: STEP-0020
next_step: research item C (hero/detail screenshots, needs assets); or changelog block, Apple-submission checklist doc, Terms/disclaimer page, more products
branch: main
head: regenerate-live (git rev-parse HEAD)
product_tag: v0.20.0
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
updated_at: 2026-07-03
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
| Unit tests (`npm test`) | Pass | Merge-critical | 34 passed (incl. required-retention negative test); run in CI |
| Dependency audit (`npm audit --omit=dev`) | Pass | Merge-critical | production/shipped deps: `found 0 vulnerabilities`. Dev-only CI tooling (`@lhci/cli`) has transitive advisories that never ship. |
| Accessibility gate (Lighthouse CI) | Pass | Merge-critical (a11y) | `accessibility ≥ 0.95` asserted as error on all built pages; verified green in CI (PR #1). Perf/SEO/best-practices are warnings. |
| Governance validator | Pass | Merge-critical | 40/40, exit 0 |
| Runtime visual (home) | Pass | Manual-runtime | dark-premium theme; desktop + mobile screenshots; no console errors; no overflow |
| Deployment code/config (domain) | Pass | Merge-critical | build at root; CNAME/canonical/robots on metkapstudio.com; Pages cname set |
| Live domain HTTPS | Pass | Release-critical (channel) | cert approved; https 200 + valid TLS; http→https 301; enforce_https on; www→apex |

## Checkpoints

Completed **feature** steps: **20** (STEP-0001..0020). Checkpoints run through
step 10, then **DISC-0004 + MC-0006**(12); **MC-0007 + ENH-0002**(14);
**DISC-0005 + AUDIT-0003**(15); **MC-0008**(16); **DISC-0006 + MC-0009**(18);
**AUDIT-0004 + MC-0010**(20); steps 11, 13, 17, 19 had no scheduled checkpoint.
Plus on-demand MC-OD-0001..0006. Next: Discussion + Enhancement after 21; MC
after 22; Audit after 25. Calibration: completed 2026-07-02.

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
`solo-dev-portfolio-website`). Latest product tag: **v0.20.0** (STEP-0020 merge
commit); prior v0.19.0..v0.1.0. Baseline (M0) internal-only. Remote: `origin`,
in sync. **Live channel:** GitHub Pages + custom domain **metkapstudio.com**
(HTTPS enforced).

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
