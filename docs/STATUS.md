# Status — Live Snapshot

> **Purpose:** Live project state and the exact next action. The single entry point.
> **Read when:** Every session, first.
> **Update when:** After every Step/checkpoint or any blocker/Git change (overwrite).
> **Synchronize with:** ROADMAP.md, CHECKPOINTS.md, VERSION_CONTROL.md, CHANGELOG.md, ISSUE_TRACKING.md.
> **Status:** Active.
> **Activation:** Standard profile + commercial/compliance overlay armed (privacy/store pages).

## Handoff (5 bullets)

- **State:** **STEP-0016 complete** — **more appealing / dynamic UI** (tasteful
  register), informed by studying top App Store / Mac App Store creator sites.
  Home **featured product spotlight**; app-page **feature grid**; CSS-only
  **scroll-reveal** motion (reduced-motion + `@supports` guarded, zero JS). Kept
  honest — no fabricated badges/press/testimonials/screenshots. Merged, tagged
  **v0.16.0**. 34 tests green. **MC-0008** run.
- **Live:** **metkapstudio.com** over HTTPS via the **Cloudflare proxy**; gem
  logo; Sole Focus product + scannable, website-scoped privacy pages.
- **Next action:** **deferred: hero/detail product screenshots + device mockups
  (research item C)** — the biggest remaining visual lever, needs real Sole Focus
  shots. Also: **a11y/Lighthouse CI** (LEDGER-002, audit-recommended, doubly
  relevant now motion is in), changelog block, email-routing pre-launch. Freeze a
  Task Card before editing.
- **Required reads:** `STATUS.md`, `ROADMAP.md`, `CHECKPOINTS.md`, `SECURITY.md`,
  `DATA_STORAGE.md`.
- **Blockers:** none. **Before Sole Focus ships:** enable Cloudflare Email Routing
  so `support@metkapstudio.com` receives mail; add real screenshots + the Mac App
  Store link once published; keep the policy truthful (see `SECURITY.md`).

## Working with app codebases (convention)

The user provides each app's full codebase folder (e.g. `../PromodoApp/` for Sole
Focus) as **read-only** source of truth (product info, privacy, icon). **Never
modify those folders.** Learn from them and build website content here. Key files
to read: `README.md`, `docs/PRIVACY.md`, `appstore/REVIEW_NOTES.md`, app icon,
`src-tauri/tauri.conf.json` (name/version/bundle id).

## Last completed Step Packet

- **STEP-0016 — Appeal & motion (tasteful)** — **DONE**, merged, tagged
  **v0.16.0**. Task Card: `docs/tasks/STEP-0016.md`.
- Delivered: home **featured product spotlight**; app-page **feature grid**;
  CSS-only **scroll-reveal** motion (`animation-timeline: view()`, reduced-motion +
  `@supports` guarded, zero JS). Based on a lean study of Things + Raycast; kept
  honest (no fabricated social proof). MC-0008 run.
- (Prior: STEP-0015 research polish + a11y v0.15.0; STEP-0014 UI polish + privacy
  scope v0.14.0; … v0.1.0.)

## Next Step Packet (to freeze)

- **Not yet chosen.** Candidates: **hero/detail product screenshots + device
  mockups (research item C — deferred, needs assets)**, **a11y/Lighthouse CI**
  (LEDGER-002, audit-recommended), **changelog/updates block**, **more real
  products**. One outcome only.

## Machine-readable state

```yaml
schema_version: 1
profile: standard
active_overlays: [commercial-compliance-armed]
active_step: none
current_step: STEP-0016
next_step: research item C (hero/detail screenshots + device mockups, deferred — needs assets); or a11y CI (LEDGER-002), changelog block, more products
branch: main
head: regenerate-live (git rev-parse HEAD)
product_tag: v0.16.0
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
| Dependency audit (`npm audit`) | Pass | Merge-critical | `found 0 vulnerabilities` |
| Governance validator | Pass | Merge-critical | 40/40, exit 0 |
| Runtime visual (home) | Pass | Manual-runtime | dark-premium theme; desktop + mobile screenshots; no console errors; no overflow |
| Deployment code/config (domain) | Pass | Merge-critical | build at root; CNAME/canonical/robots on metkapstudio.com; Pages cname set |
| Live domain HTTPS | Pass | Release-critical (channel) | cert approved; https 200 + valid TLS; http→https 301; enforce_https on; www→apex |

## Checkpoints

Completed **feature** steps: **15** (STEP-0001..0015). Checkpoints run through
step 10, then **DISC-0004 + MC-0006**(12); steps 11 and 13 had no scheduled
checkpoint; **MC-0007 + ENH-0002**(14); **DISC-0005 + AUDIT-0003**(15); **MC-0008**(16).
Plus on-demand MC-OD-0001..0005. Next: Discussion after 18; Audit after 20;
Enhancement after 21; MC after 18. Calibration: completed 2026-07-02.

## Issues

- **LEDGER-001** — **RESOLVED in STEP-0015 (v0.15.0):** the icon-or-monogram
  avatar was duplicated in ProductCard + detail; centralised in
  `src/components/ProductAvatar.astro`, now also used by the privacy header.
- **LEDGER-002** (`type:accessibility`, `priority:low`) — no automated a11y /
  visual-regression check; UI verified manually. From AUDIT-0001. Advisory.

Neither is release-blocking. Fallback ledger: `docs/issues/LEDGER.md`.

## Compliance (Critical Operating Contract)

Followed: one frozen Step Packet (STEP-0001), risk-based tests shipped with the
code, all merge-critical gates Pass with evidence, non-destructive Git (merge
commit + tag), docs synchronized, validator passing. No deviations.

## Version control

Repo slug `solo-developer-portfolio-website` (local folder
`solo-dev-portfolio-website`). Latest product tag: **v0.16.0** (STEP-0016 merge
commit); prior v0.15.0..v0.1.0. Baseline (M0) internal-only. Remote: `origin`,
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
