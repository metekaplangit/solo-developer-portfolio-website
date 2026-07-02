# Status — Live Snapshot

> **Purpose:** Live project state and the exact next action. The single entry point.
> **Read when:** Every session, first.
> **Update when:** After every Step/checkpoint or any blocker/Git change (overwrite).
> **Synchronize with:** ROADMAP.md, CHECKPOINTS.md, VERSION_CONTROL.md, CHANGELOG.md, ISSUE_TRACKING.md.
> **Status:** Active.
> **Activation:** Standard profile + commercial/compliance overlay armed (privacy/store pages).

## Handoff (5 bullets)

- **State:** **STEP-0001 complete** — content model (Zod) + static shell + routes
  (home, Apps & Games, privacy global + per-product, support, about) merged to
  `main` and tagged **v0.1.0**. Milestone 1 done. 25 tests green.
- **Next action:** Plan and freeze **STEP-0002** (Milestone 2 — premium minimal
  product showcase: home/catalog/detail polish, media handling, SEO depth).
  Create its Task Card before editing.
- **Required reads:** `STATUS.md`, `ROADMAP.md`, `CHECKPOINTS.md`, then
  `UI_DESIGN.md`, `ARCHITECTURE.md`, `TESTING.md` for STEP-0002.
- **Required checks:** `npm run build`, `npm run check`, `npm test`,
  `python3 scripts/validate-governance.py`.
- **Blockers:** none.

## Last completed Step Packet

- **STEP-0001 — Content model + static shell** — **DONE**, merged to `main`,
  tagged **v0.1.0**. Task Card: `docs/tasks/STEP-0001.md` (evidence recorded).
- Delivered: Zod content model (Product/StoreLink/PrivacyPolicyEntry/MediaAsset),
  static shell + 7 routes rendering from content, 25 Vitest tests.

## Next Step Packet (to freeze)

- **STEP-0002 — Premium minimal product showcase** (Milestone 2; versionable →
  target `v0.2.0`). Not yet frozen — create `docs/tasks/STEP-0002.md` and branch
  `feature/STEP-0002-...` before editing. Scope candidates: product-detail page
  pattern, responsive/media polish on cards, real screenshot handling, SEO/social
  depth. One outcome only; split if it grows.

## Machine-readable state

```yaml
schema_version: 1
profile: standard
active_overlays: [commercial-compliance-armed]
active_step: none
current_step: STEP-0001
next_step: STEP-0002
branch: main
head: regenerate-live (git rev-parse HEAD)
product_tag: v0.1.0
dirty: false
dirty_paths: []
remote_sync: origin (github.com/metekaplangit/solo-developer-portfolio-website)
due_checkpoints: none
blockers: none
required_reads: [STATUS.md, ROADMAP.md, CHECKPOINTS.md, UI_DESIGN.md, ARCHITECTURE.md, TESTING.md]
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
| Static build (`npm run build`) | Pass | Merge-critical | 7 routes, `output: "static"`, exit 0 |
| Type + content check (`npm run check`) | Pass | Merge-critical | 0 errors / 0 warnings / 0 hints (25 files) |
| Unit tests (`npm test`) | Pass | Merge-critical | 25 passed (4 files) |
| Dependency audit (`npm audit`) | Pass | Merge-critical | `found 0 vulnerabilities` (yaml override) |
| Governance validator | Pass | Merge-critical | 40/40, exit 0 |
| Runtime route smoke | Pass | Advisory | all routes HTTP 200; 404 on unknown; a11y basics; 2 screenshots, no console errors |
| Deployment (Pages) | Blocked | Release-critical (M4) | Not started; documented in DEPLOYMENT.md |

## Checkpoints

Completed **feature** steps: **1** (STEP-0001). None due — Markdown Consistency
is due after feature step **2**. Calibration: **completed 2026-07-02**.

## Issues

None open. Fallback ledger: `docs/issues/LEDGER.md` (empty). GitHub Issues become
the owner of record once the remote is live.

## Compliance (Critical Operating Contract)

Followed: one frozen Step Packet (STEP-0001), risk-based tests shipped with the
code, all merge-critical gates Pass with evidence, non-destructive Git (merge
commit + tag), docs synchronized, validator passing. No deviations.

## Version control

Repo slug `solo-developer-portfolio-website` (local folder
`solo-dev-portfolio-website`). Latest product tag: **v0.1.0** (STEP-0001 merge
commit). Baseline (M0) remains internal-only. Remote: `origin` on GitHub,
in sync.
