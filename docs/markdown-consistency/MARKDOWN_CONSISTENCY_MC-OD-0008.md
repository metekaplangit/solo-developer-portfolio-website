# Markdown Consistency Checkpoint MC-OD-0008 (on-demand)

- **Trigger:** On-demand wrap-up request (user going out) — verify cross-doc
  synchronization and a clean, ready repo after the STEP-0022 / v0.22.0 close.
- **Reviewed range:** Post-STEP-0022 (v0.22.0) whole-repo state.
- **Date:** 2026-07-03.

## Checklist results

| Check | Result | Notes |
|---|---|---|
| Step/tag/branch/checkpoint agreement | Pass | STATUS `current_step: STEP-0022`, `product_tag: v0.22.0`, feature steps **22**; ROADMAP STEP-0022 COMPLETE; CHECKPOINTS count 22 + MC-0011 logged + next feature step 23; CHANGELOG top release `[0.22.0]`. All agree. |
| Tag ↔ HEAD | Pass | `git tag --points-at HEAD` = **v0.22.0** on the STEP-0022 merge commit. |
| Canonical ownership / no duplicated workflow | Pass | VERSION_CONTROL.md is policy-only (no hardcoded "latest tag" to drift); the single current-tag value lives in STATUS + CHANGELOG. CLAUDE.md links to owner docs, doesn't copy them. |
| Startup/gate agreement (CLAUDE.md ↔ AI_WORKFLOW.md) | Pass | CLAUDE.md pre-merge gate = `npm run build && npm run check && python3 scripts/validate-governance.py`, matches recorded checks. |
| Code/paths reality matches docs | Pass | New `src/lib/schema.ts` + `src/components/JsonLd.astro` exist and are git-tracked; `schema` prop wired in BaseLayout + three pages, as documented. |
| Issue/blocker agreement | Pass | LEDGER-001/002 resolved; blockers: none. No new issues. |
| Append-only history preserved | Pass | Historical STEP-0021 rows and prior reports untouched; only additive files + owner updates this cycle. |
| Merge-critical gates | Pass | `npm run check` 0/0/0; `npm run build` 8 routes; `npm test` 34 passed; validator **40/40**. |
| Git hygiene | Pass | On `main`, 0 ahead / 0 behind `origin/main`, working tree clean, no stray/unmerged local branches, feature branch deleted after merge. |

## Findings

**No drift requiring repair.** All canonical docs, the tag, and the live site
agree on STEP-0022 / v0.22.0. The only remaining `STEP-0021` mentions are
historical checkpoint-log rows (DISC-0007 / ENH-0003), which are correctly
append-only. Repo is clean, committed, merged, pushed, and up to date.

## Follow-ups

- None outstanding. Next scheduled: Discussion after feature step #24; Audit
  after #25; Enhancement after #28. Next feature packet undecided (candidates:
  real product screenshots [asset-blocked], changelog block, Apple-submission
  checklist doc, Terms/disclaimer page, more products).
