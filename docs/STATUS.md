# Status — Live Snapshot

> **Purpose:** Live project state and the exact next action. The single entry point.
> **Read when:** Every session, first.
> **Update when:** After every Step/checkpoint or any blocker/Git change (overwrite).
> **Synchronize with:** ROADMAP.md, CHECKPOINTS.md, VERSION_CONTROL.md, CHANGELOG.md, ISSUE_TRACKING.md.
> **Status:** Active.
> **Activation:** Standard profile + commercial/compliance overlay armed (privacy/store pages).

## Handoff (5 bullets)

- **State:** Milestone 0 initialization complete — Astro 7 static baseline, full
  docs system, governance validator, issue templates, CI, workflow seeds in
  place. Baseline committed and pushed. **Not started: Step 1 (STEP-0001).**
- **Next action:** Offer the pre-first-step AI calibration gate, then begin
  **STEP-0001** (content model + static shell) on branch
  `feature/STEP-0001-content-model-shell`.
- **Required reads:** `STATUS.md`, `ROADMAP.md`, `CHECKPOINTS.md`, then
  `DATA_STORAGE.md`, `ARCHITECTURE.md`, `TESTING.md` for STEP-0001.
- **Required checks:** `npm run build`, `npm run check`,
  `python3 scripts/validate-governance.py` (and `npm test` once STEP-0001 adds it).
- **Blockers:** `npm test` is **Blocked** until STEP-0001 adds Vitest (recorded;
  not merge-critical for the baseline).

## Active / next Step Packet

- **STEP-0001 — Content model + static shell** (versionable → target `v0.1.0`).
- One frozen outcome: typed content collections + Zod schemas + static shell +
  required routes rendering from sample content + Vitest units.
- Non-goals: visual polish (M2), deployment (M4), real product copy.
- Evidence method: command/log artifact + automated test.
- Proof classification: machine-verifiable.
- Acceptance: invalid content fails build; routes exist; build/check/test/
  validator pass; no backend.

## Machine-readable state

```yaml
schema_version: 1
profile: standard
active_overlays: [commercial-compliance-armed]
active_step: STEP-0001
current_step: STEP-0001
next_step: STEP-0002
branch: main
head: regenerate-live (git rev-parse HEAD)
product_tag: none
dirty: false
dirty_paths: []
remote_sync: origin (github.com/metekaplangit/solo-developer-portfolio-website)
due_checkpoints: none
blockers: [npm-test-blocked-until-STEP-0001]
required_reads: [STATUS.md, ROADMAP.md, CHECKPOINTS.md, DATA_STORAGE.md, ARCHITECTURE.md, TESTING.md]
required_checks: [npm run build, npm run check, scripts/validate-governance.py]
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
| Static build (`npm run build`) | Pass | Merge-critical | `output: "static"`, `dist/index.html`, exit 0 |
| Dependency audit (`npm audit`) | Pass | Merge-critical | `found 0 vulnerabilities` (yaml override) |
| Governance validator | Pass | Merge-critical | see baseline validator run in CHECKPOINTS/commit |
| Unit tests (`npm test`) | Blocked | Merge-critical (STEP-0001) | Vitest added in STEP-0001 |
| Deployment (Pages) | Blocked | Release-critical (M4) | Not started; documented in DEPLOYMENT.md |

## Checkpoints

None due (0 feature steps complete; baseline is non-feature). Calibration:
**pending** (offer before STEP-0001).

## Issues

None open. Fallback ledger: `docs/issues/LEDGER.md` (empty). GitHub Issues become
the owner of record once the remote is live.

## Compliance (Critical Operating Contract)

Followed: bounded intake (pre-answered), verified versions (Astro 7.0.5
corrected), docs-before-features, non-destructive Git, remote pushed, calibration
recorded as pending, validator gate installed. No deviations.

## Version control

Repo slug `solo-developer-portfolio-website` (local folder
`solo-dev-portfolio-website`). Baseline is **internal-only** (no product tag).
First product tag `v0.1.0` will follow STEP-0001. Remote: pushed to GitHub
(`origin`).
