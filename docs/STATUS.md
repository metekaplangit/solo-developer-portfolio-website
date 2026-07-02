# Status — Live Snapshot

> **Purpose:** Live project state and the exact next action. The single entry point.
> **Read when:** Every session, first.
> **Update when:** After every Step/checkpoint or any blocker/Git change (overwrite).
> **Synchronize with:** ROADMAP.md, CHECKPOINTS.md, VERSION_CONTROL.md, CHANGELOG.md, ISSUE_TRACKING.md.
> **Status:** Active.
> **Activation:** Standard profile + commercial/compliance overlay armed (privacy/store pages).

## Handoff (5 bullets)

- **State:** **STEP-0012 complete** — **privacy pages redesigned for readability**
  (at-a-glance chips + strictly separated headlined sections + bullets; long
  retention prose split into `storedLocally`/`permissions` bullets). Merged,
  tagged **v0.12.0**, deployed. 34 tests green. **DISC-0004 + MC-0006** run
  (feature step #12).
- **Live:** **metkapstudio.com** over HTTPS; gem logo; Sole Focus product +
  scannable privacy pages.
- **Next action:** pick the next packet — **changelog/updates block**,
  **a11y/Lighthouse CI** (LEDGER-002), **Cloudflare proxy** (faster/instant
  freshness), or **more real products**. Freeze a Task Card before editing.
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

- **STEP-0012 — Privacy readability redesign** — **DONE**, merged, tagged
  **v0.12.0**, live. Task Card: `docs/tasks/STEP-0012.md`.
- Delivered: `PolicyArticle` rebuilt (at-a-glance chips + separated `<h2>`
  sections + bullets); added `storedLocally`/`permissions` schema fields; tightened
  policy content (short lead, split retention). Still full Apple 5.1.1(i).
- (Prior: STEP-0011 logo v0.11.0; STEP-0010 Sole Focus v0.10.0; … v0.1.0.)

## Next Step Packet (to freeze)

- **Not yet chosen.** Candidates: **changelog/updates block**, **a11y/Lighthouse
  CI** (LEDGER-002), **more real products** (user supplies each codebase). See
  `ROADMAP.md` backlog. One outcome only.

## Machine-readable state

```yaml
schema_version: 1
profile: standard
active_overlays: [commercial-compliance-armed]
active_step: none
current_step: STEP-0012
next_step: undecided (changelog block / a11y CI / Cloudflare proxy / more products)
branch: main
head: regenerate-live (git rev-parse HEAD)
product_tag: v0.12.0
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
updated_at: 2026-07-02
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

Completed **feature** steps: **12** (STEP-0001..0012). Checkpoints run through
step 10, then **DISC-0004 + MC-0006**(12); step 11 had no scheduled checkpoint.
Plus on-demand MC-OD-0001..0004. Next: **Markdown Consistency after step 14**;
**Discussion + Audit after 15**. Calibration: completed 2026-07-02.

## Issues

- **LEDGER-001** (`type:technical-debt`, `priority:low`) — product avatar
  (icon-or-monogram) duplicated in ProductCard + detail. Ripe; extract a
  `ProductAvatar` next refactor pass. From DISC-0001 / AUDIT-0002.
- **LEDGER-002** (`type:accessibility`, `priority:low`) — no automated a11y /
  visual-regression check; UI verified manually. From AUDIT-0001. Advisory.

Neither is release-blocking. Fallback ledger: `docs/issues/LEDGER.md`.

## Compliance (Critical Operating Contract)

Followed: one frozen Step Packet (STEP-0001), risk-based tests shipped with the
code, all merge-critical gates Pass with evidence, non-destructive Git (merge
commit + tag), docs synchronized, validator passing. No deviations.

## Version control

Repo slug `solo-developer-portfolio-website` (local folder
`solo-dev-portfolio-website`). Latest product tag: **v0.12.0** (STEP-0012 merge
commit); prior v0.11.0..v0.1.0. Baseline (M0) internal-only. Remote: `origin`,
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
re-run it (transient). **Instant visitor freshness** requires enabling the
Cloudflare proxy (orange-cloud, SSL/TLS Full-strict, cache rules) — a documented
future step, not yet done.
