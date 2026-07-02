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
  `main` and tagged **v0.2.0**. 28 tests green. Markdown Consistency MC-0001 run.
- **Next action:** Plan and freeze **STEP-0003** — begin Milestone 3 (store-support
  pages: global + per-product privacy polish, support/about refinement, footer)
  or continue M2 polish. Create its Task Card before editing.
- **Required reads:** `STATUS.md`, `ROADMAP.md`, `CHECKPOINTS.md`, then
  `UI_DESIGN.md`, `SECURITY.md` (privacy/legal boundary), `TESTING.md`.
- **Required checks:** `npm run build`, `npm run check`, `npm test`,
  `python3 scripts/validate-governance.py`.
- **Blockers:** none.

## Last completed Step Packet

- **STEP-0002 — Product detail page pattern** — **DONE**, merged to `main`,
  tagged **v0.2.0**. Task Card: `docs/tasks/STEP-0002.md` (evidence recorded).
- Delivered: `/apps/<slug>/` detail pages for every product, card→detail links,
  related-products section, per-product SEO. 10 routes total, 28 tests.
- (Prior: STEP-0001 — content model + static shell, v0.1.0.)

## Next Step Packet (to freeze)

- **STEP-0003** (Milestone 3 — store-support pages; versionable → target
  `v0.3.0`). Not yet frozen — create `docs/tasks/STEP-0003.md` and branch before
  editing. Candidates: polished global privacy page, per-product privacy prose
  review, support/about refinement, footer legal links. One outcome only; keep
  privacy/legal language clear and non-advisory (see `SECURITY.md`).

## Machine-readable state

```yaml
schema_version: 1
profile: standard
active_overlays: [commercial-compliance-armed]
active_step: none
current_step: STEP-0002
next_step: STEP-0003
branch: main
head: regenerate-live (git rev-parse HEAD)
product_tag: v0.2.0
dirty: false
dirty_paths: []
remote_sync: origin (github.com/metekaplangit/solo-developer-portfolio-website)
due_checkpoints: none
blockers: none
required_reads: [STATUS.md, ROADMAP.md, CHECKPOINTS.md, UI_DESIGN.md, SECURITY.md, TESTING.md]
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
| Static build (`npm run build`) | Pass | Merge-critical | 10 routes, `output: "static"`, exit 0 |
| Type + content check (`npm run check`) | Pass | Merge-critical | 0 errors / 0 warnings / 0 hints (26 files) |
| Unit tests (`npm test`) | Pass | Merge-critical | 28 passed (4 files) |
| Dependency audit (`npm audit`) | Pass | Merge-critical | `found 0 vulnerabilities` (yaml override) |
| Governance validator | Pass | Merge-critical | 40/40, exit 0 |
| Runtime route smoke | Pass | Advisory | all routes HTTP 200; 404 on unknown; a11y basics; 2 screenshots, no console errors |
| Deployment (Pages) | Blocked | Release-critical (M4) | Not started; documented in DEPLOYMENT.md |

## Checkpoints

Completed **feature** steps: **2** (STEP-0001, STEP-0002). **Markdown Consistency
MC-0001 run** at step 2 (no drift; `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-0001.md`).
Next: **Discussion** due after feature step **3**; Markdown Consistency after
step **4**. Calibration: completed 2026-07-02.

## Issues

None open. Fallback ledger: `docs/issues/LEDGER.md` (empty). GitHub Issues become
the owner of record once the remote is live.

## Compliance (Critical Operating Contract)

Followed: one frozen Step Packet (STEP-0001), risk-based tests shipped with the
code, all merge-critical gates Pass with evidence, non-destructive Git (merge
commit + tag), docs synchronized, validator passing. No deviations.

## Version control

Repo slug `solo-developer-portfolio-website` (local folder
`solo-dev-portfolio-website`). Latest product tag: **v0.2.0** (STEP-0002 merge
commit); prior **v0.1.0** (STEP-0001). Baseline (M0) remains internal-only.
Remote: `origin` on GitHub, in sync.
