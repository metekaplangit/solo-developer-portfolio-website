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
  `main`, tagged **v0.5.0**, and **live**. 33 tests green. **Audit AUDIT-0001**
  run (feature step #5) — all areas Pass, 2 low advisories logged.
- **Live URL:** `https://metekaplangit.github.io/solo-developer-portfolio-website/`
  (project site; custom domain deferred to a late step).
- **Next action:** **STEP-0006 — roll the dark-premium theme across the remaining
  pages** (catalog, product detail, privacy, support, about, 404 — bespoke polish
  on top of the shared tokens). Freeze its Task Card before editing.
- **Required reads:** `STATUS.md`, `ROADMAP.md`, `CHECKPOINTS.md`, then
  `UI_DESIGN.md`, `ARCHITECTURE.md`.
- **Required checks:** `npm run build`, `npm run check`, `npm test`,
  `python3 scripts/validate-governance.py`.
- **Blockers:** none. (Custom domain deferred to a late step, by user decision.)

## Last completed Step Packet

- **STEP-0005 — Dark-premium Apple-minimal design system + home** — **DONE**,
  merged to `main`, tagged **v0.5.0**, live. Task Card: `docs/tasks/STEP-0005.md`.
- Delivered: "light dark" graphite token system, SF Pro scale, restrained accent,
  soft depth + translucent sticky header, tasteful motion (reduced-motion aware),
  button styles, elevated cards, and a cinematic home. UI-only.
- (Prior: STEP-0004 deploy v0.4.0; STEP-0003 v0.3.0; STEP-0002 v0.2.0; STEP-0001 v0.1.0.)

## Next Step Packet (to freeze)

- **STEP-0006 — Theme rollout to remaining pages** (UI phase; versionable →
  target `v0.6.0`). Apply the design system's bespoke polish to catalog, product
  detail, privacy (global + per-product), support, about, and 404 — they already
  inherit the tokens; refine their page-specific layouts, spacing, and depth. One
  page-group per packet if it grows. **UI-only** — no product/data/logic changes.

## Machine-readable state

```yaml
schema_version: 1
profile: standard
active_overlays: [commercial-compliance-armed]
active_step: none
current_step: STEP-0005
next_step: STEP-0006
branch: main
head: regenerate-live (git rev-parse HEAD)
product_tag: v0.5.0
live_url: https://metekaplangit.github.io/solo-developer-portfolio-website/
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
| Static build (`npm run build`) | Pass | Merge-critical | 11 routes + sitemap/robots/404/favicon, `output: "static"` |
| Type + content check (`npm run check`) | Pass | Merge-critical | 0 errors / 0 warnings / 0 hints |
| Unit tests (`npm test`) | Pass | Merge-critical | 33 passed (incl. `withBase`); run in CI |
| Dependency audit (`npm audit`) | Pass | Merge-critical | `found 0 vulnerabilities` |
| Governance validator | Pass | Merge-critical | 40/40, exit 0 |
| Runtime visual (home) | Pass | Manual-runtime | dark-premium theme; desktop + mobile screenshots; no console errors; no overflow |
| Deployment (Pages project site) | Pass | Release-critical (channel) | live URL 200; custom domain deferred |

## Checkpoints

Completed **feature** steps: **5** (STEP-0001..0005). Checkpoints run: MC-0001
(2), DISC-0001 (3), MC-0002 (4), **AUDIT-0001** (5;
`docs/audits/AUDIT_AUDIT-0001.md`), plus on-demand MC-OD-0001. Next: Discussion +
Markdown Consistency after step **6**; Audit after step **10**. Calibration:
completed 2026-07-02.

## Issues

- **LEDGER-001** (`type:technical-debt`, `priority:low`) — monogram logic
  duplicated (2 uses). Watch; extract on 3rd use. From DISC-0001.
- **LEDGER-002** (`type:accessibility`, `priority:low`) — no automated a11y /
  visual-regression check; UI verified manually. From AUDIT-0001. Advisory.

Neither is release-blocking. Fallback ledger: `docs/issues/LEDGER.md`.

## Compliance (Critical Operating Contract)

Followed: one frozen Step Packet (STEP-0001), risk-based tests shipped with the
code, all merge-critical gates Pass with evidence, non-destructive Git (merge
commit + tag), docs synchronized, validator passing. No deviations.

## Version control

Repo slug `solo-developer-portfolio-website` (local folder
`solo-dev-portfolio-website`). Latest product tag: **v0.5.0** (STEP-0005 merge
commit); prior v0.4.0..v0.1.0. Baseline (M0) internal-only. Remote: `origin`,
in sync. **Live channel:** GitHub Pages project site (Actions deploy).
