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
  `main`, tagged **v0.4.0**, and **deployed live to GitHub Pages**. 33 tests
  green. Markdown Consistency MC-0002 run.
- **Live URL:** `https://metekaplangit.github.io/solo-developer-portfolio-website/`
  (project site; custom domain deferred to a late step).
- **Next action:** **STEP-0005 — dark-premium Apple-minimal design system + home**
  (UI/design phase begins). Freeze its Task Card before editing.
- **Required reads:** `STATUS.md`, `ROADMAP.md`, `CHECKPOINTS.md`, then
  `UI_DESIGN.md`, `ARCHITECTURE.md`.
- **Required checks:** `npm run build`, `npm run check`, `npm test`,
  `python3 scripts/validate-governance.py`.
- **Blockers:** none. (Custom domain + on-domain robots/HTTPS deferred to a late
  deployment step, by user decision.)

## Last completed Step Packet

- **STEP-0004 — GitHub Pages deployment (project site)** — **DONE**, merged to
  `main`, tagged **v0.4.0**, live. Task Card: `docs/tasks/STEP-0004.md`.
- Delivered: base-path config + `withBase()` link helper (all links based),
  `deploy.yml` (Actions→Pages), Pages enabled. Domain deferred.
- (Prior: STEP-0003 essentials v0.3.0; STEP-0002 detail v0.2.0; STEP-0001 v0.1.0.)

## Next Step Packet (to freeze)

- **STEP-0005 — Dark-premium Apple-minimal design system + home** (UI phase;
  versionable → target `v0.5.0`). Elevated "light dark" theme (graphite surfaces,
  not black), refined type scale (SF Pro), restrained accent, soft depth
  (hairline borders, gentle shadows, translucent sticky header), generous
  spacing, tasteful motion (reduced-motion respected). Apply to tokens + shell +
  home first; roll to other pages in following steps. One outcome; split if it
  grows. **UI-only phase** — no product/data/logic changes.

## Machine-readable state

```yaml
schema_version: 1
profile: standard
active_overlays: [commercial-compliance-armed]
active_step: none
current_step: STEP-0004
next_step: STEP-0005
branch: main
head: regenerate-live (git rev-parse HEAD)
product_tag: v0.4.0
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
| Runtime route smoke | Pass | Advisory | based routes 200; nav aria-current correct under base |
| Deployment (Pages project site) | Pass | Release-critical (channel) | live URL 200; custom domain deferred |

## Checkpoints

Completed **feature** steps: **4** (STEP-0001..0004). Checkpoints run: MC-0001
(step 2), DISC-0001 (step 3), **MC-0002** (step 4;
`docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-0002.md`). Next: **Audit**
after step **5**; Discussion after step **6**; MC after step **6**. Calibration:
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
`solo-dev-portfolio-website`). Latest product tag: **v0.4.0** (STEP-0004 merge
commit); prior v0.3.0, v0.2.0, v0.1.0. Baseline (M0) internal-only. Remote:
`origin`, in sync. **Live channel:** GitHub Pages project site (Actions deploy).
