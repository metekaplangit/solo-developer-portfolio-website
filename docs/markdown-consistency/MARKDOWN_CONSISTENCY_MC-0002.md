# Markdown Consistency Checkpoint MC-0002

- **Trigger:** Completion of feature step #4 (STEP-0004); cadence = every 2
  feature steps.
- **Reviewed range:** STEP-0003 (v0.3.0) → STEP-0004 (v0.4.0).
- **Date:** 2026-07-02.

## Checklist results

| Check | Result | Notes |
|---|---|---|
| Canonical ownership; no duplicated workflow | Pass | Deploy details owned by DEPLOYMENT.md; STATUS/ROADMAP link, don't duplicate. |
| Step/tag/branch/checkpoint agreement (STATUS ↔ ROADMAP ↔ CHECKPOINTS ↔ VERSION_CONTROL ↔ CHANGELOG) | Pass | All updated: last step STEP-0004, tag v0.4.0, next STEP-0005, feature count 4, MC-0002 logged. |
| Deployment reality matches docs | Pass | `base`/`site` in astro.config, `withBase()` in `src/lib/url.ts`, `deploy.yml`, robots URL, and DEPLOYMENT.md all agree. |
| Roadmap phase reorg coherent | Pass | M4 marked done; UI phase inserted; custom-domain moved to a deferred Milestone 5 with no renumbering of completed IDs. |
| Issue agreement | Pass | LEDGER-001 still open (low). |
| Zero-cost/static guardrail intact | Pass | Still `output: 'static'`; `@astrojs/sitemap` build-time; Pages hosting free; only new is a workflow. Validator guardrail green. |
| Append-only history | Pass | Released changelog entries append-only; Step IDs unchanged. |

## Findings

**No drift requiring repair.** The deployment/base-path changes are consistently
reflected across config, code, and docs, and the roadmap phase reorganization
preserves completed Step identities.

## Follow-ups

- Custom-domain revert steps are captured in DEPLOYMENT.md and ROADMAP Milestone 5
  (deferred). Next: **Audit** checkpoint due after feature step #5.
