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
  `main` and tagged **v0.3.0**. 28 tests green. Discussion DISC-0001 run.
- **Next action:** Plan and freeze **STEP-0004** — Milestone 4 (GitHub Pages
  deployment proof: Actions→Pages workflow, custom domain + Cloudflare DNS notes,
  HTTPS verification, deploy smoke, rollback). Create its Task Card before editing.
- **Required reads:** `STATUS.md`, `ROADMAP.md`, `CHECKPOINTS.md`, then
  `DEPLOYMENT.md`, `VERSION_CONTROL.md`, `SECURITY.md`.
- **Required checks:** `npm run build`, `npm run check`, `npm test`,
  `python3 scripts/validate-governance.py`.
- **Blockers:** none. (Note: sitemap/robots use a placeholder domain until M4.)

## Last completed Step Packet

- **STEP-0003 — Core site essentials** — **DONE**, merged to `main`, tagged
  **v0.3.0**. Task Card: `docs/tasks/STEP-0003.md` (evidence recorded).
- Delivered: custom 404, `robots.txt`, auto sitemap (`@astrojs/sitemap`), favicon;
  CI now runs `npm test` (DISC-0001 fix). 11 routes total, 28 tests.
- (Prior: STEP-0002 detail pages v0.2.0; STEP-0001 content model v0.1.0.)

## Next Step Packet (to freeze)

- **STEP-0004** (Milestone 4 — GitHub Pages deployment proof; versionable →
  target `v0.4.0`). Not yet frozen — create `docs/tasks/STEP-0004.md` and branch
  before editing. Scope: Actions→Pages deploy workflow, `public/CNAME` +
  custom-domain/Cloudflare DNS notes, HTTPS verification, deploy smoke, rollback;
  update `site`/robots domain. Some proof may be `Blocked` pending the real
  domain — record exact manual steps.

## Machine-readable state

```yaml
schema_version: 1
profile: standard
active_overlays: [commercial-compliance-armed]
active_step: none
current_step: STEP-0003
next_step: STEP-0004
branch: main
head: regenerate-live (git rev-parse HEAD)
product_tag: v0.3.0
dirty: false
dirty_paths: []
remote_sync: origin (github.com/metekaplangit/solo-developer-portfolio-website)
due_checkpoints: none
blockers: none
required_reads: [STATUS.md, ROADMAP.md, CHECKPOINTS.md, DEPLOYMENT.md, VERSION_CONTROL.md, SECURITY.md]
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
| Unit tests (`npm test`) | Pass | Merge-critical | 28 passed; now also run in CI |
| Dependency audit (`npm audit`) | Pass | Merge-critical | `found 0 vulnerabilities` |
| Governance validator | Pass | Merge-critical | 40/40, exit 0 |
| Runtime route smoke | Pass | Advisory | robots/sitemap/favicon 200; unknown→404 custom page; screenshot; no console errors |
| Deployment (Pages) | Blocked | Release-critical (M4) | Not started; documented in DEPLOYMENT.md |

## Checkpoints

Completed **feature** steps: **3** (STEP-0001..0003). Checkpoints run: **MC-0001**
(step 2), **DISC-0001** (step 3; `docs/discussions/DISCUSSION_DISC-0001.md`).
Next: Markdown Consistency after step **4**; **Audit** after step **5**. Calibration:
completed 2026-07-02.

## Issues

- **LEDGER-001** (`type:technical-debt`, `priority:low`) — monogram logic
  duplicated in `ProductCard.astro` + `apps/[slug].astro` (2 uses). Watch;
  extract on 3rd use per REFACTORING. From DISC-0001. Not release-blocking.

Fallback ledger: `docs/issues/LEDGER.md`. GitHub Issues become the owner of
record once the finding warrants it / at first maintained release.

## Compliance (Critical Operating Contract)

Followed: one frozen Step Packet (STEP-0001), risk-based tests shipped with the
code, all merge-critical gates Pass with evidence, non-destructive Git (merge
commit + tag), docs synchronized, validator passing. No deviations.

## Version control

Repo slug `solo-developer-portfolio-website` (local folder
`solo-dev-portfolio-website`). Latest product tag: **v0.3.0** (STEP-0003 merge
commit); prior v0.2.0, v0.1.0. Baseline (M0) remains internal-only. Remote:
`origin` on GitHub, in sync.
