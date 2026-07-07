# Markdown Consistency Checkpoint MC-OD-0009 (on-demand)

- **Trigger:** On-demand wrap-up request (user going out) — verify cross-doc
  synchronization and a clean, ready repo after the post-v0.25.0 screenshot-gallery
  enhancement shipped to production.
- **Reviewed range:** v0.25.0 → current `main` (HEAD `5d837af`), i.e. the 6
  post-tag commits that build and fix the Sole Focus screenshot gallery.
- **Date:** 2026-07-07.

## Checklist results

| Check | Result | Notes |
|---|---|---|
| Step/checkpoint agreement | Pass | STATUS `current_step: STEP-0025`; ROADMAP STEP-0025 COMPLETE; CHECKPOINTS through AUDIT-0005(25); no scheduled checkpoint due (next Markdown Consistency after feature step 26). This on-demand run does not reset cadence. |
| Tag ↔ HEAD | **Documented drift (deliberate, not repaired)** | `git tag --points-at HEAD` = **(none)**; `main` is **6 commits ahead of `v0.25.0`**. The post-tag work (swipeable gallery + two a11y fixes) shipped to production and is logged under CHANGELOG `[Unreleased]`. It was **not** run as a frozen Step Packet. Left untagged pending an explicit version decision — see Findings/Follow-ups. |
| Latest-tag value across owners | **Repaired** | STATUS "Version control" said `Latest product tag: **v0.21.0**` (stale since STEP-0022) — corrected to **v0.25.0** and annotated with the ahead-of-tag state. STATUS Handoff, machine-readable `head`/`product_tag`, and this ledger now agree. |
| CHANGELOG accuracy | Pass | `[Unreleased]` describes the gallery (user-facing) + internal notes; added one bullet recording the accessibility work (focusable track, list semantics, axe-clean). No released section rewritten. |
| Canonical ownership / no duplicated workflow | Pass | VERSION_CONTROL.md remains policy-only; the single current-tag value lives in STATUS + CHANGELOG; CLAUDE.md links owners, doesn't copy. |
| Startup/gate agreement (CLAUDE.md ↔ AI_WORKFLOW.md) | Pass | Pre-merge gate `npm run build && npm run check && python3 scripts/validate-governance.py` matches the checks run this cycle. |
| Code/paths reality matches docs | Pass | `src/components/ScreenshotShowcase.astro` is the gallery (git-tracked); rendered by `src/pages/apps/[slug].astro`; live at https://metkapstudio.com/apps/sole-focus/ (HTTP 200, gallery markup present). |
| Accessibility gate | Pass | Re-audited the live page with axe-core in-browser after fixes: **zero violations**. The deploy's Lighthouse a11y gate (≥0.95) passed (CI run 28855465208, 1m48s) after two fixes; the first two deploys correctly **blocked** at 0.91. |
| Issue/blocker agreement | Pass | LEDGER-001/002 resolved; blockers: none. No new issues. |
| Append-only history preserved | Pass | Prior reports and released CHANGELOG sections untouched; only additive files + owner updates this cycle. |
| Merge-critical gates | Pass | `npm run check` 0/0/0; `npm run build` 8 routes; `npm test` **36 passed**; validator **40/40**, exit 0. |
| Git hygiene | Pass | On `main`, 0 ahead / 0 behind `origin/main` (before this checkpoint commit), working tree clean; three feature/fix branches merged `--no-ff` then deleted; no stray/unmerged local branches. |

## Findings

**One item surfaced; it is a deliberate pending state, not silent drift.** The
screenshot-gallery enhancement and its accessibility fixes were shipped to
production in the prior session on a "deploy if you can" instruction, outside the
formal frozen-Step-Packet + version-tag flow. As a result `main` sits **6 commits
ahead of `v0.25.0`, untagged**, with the changes under CHANGELOG `[Unreleased]`.

This checkpoint did **not** invent a version or a retroactive Step Packet (that is
a product/governance decision for the user). Instead it made the docs tell the
truth: repaired the stale `v0.21.0` latest-tag line in STATUS, and recorded the
ahead-of-tag state consistently across STATUS (Handoff, Next Step Packet,
machine-readable block, Version control) and this ledger. All merge gates are
green and the repo is clean, merged, and pushed.

## Follow-ups

- **Open decision for the user (only outstanding item):** either **cut v0.26.0**
  — finalize CHANGELOG `[Unreleased]` → `[0.26.0]`, add a retroactive Task Card,
  and tag the existing gallery merge — **or** fold the gallery into the next
  packet's release. The code is live and gate-green either way; this is
  bookkeeping to restore the "main == latest tag" invariant.
- Next scheduled checkpoints (unchanged): Markdown Consistency after feature step
  26; Discussion after 27; Enhancement after 28; Audit after 30. Next feature
  packet undecided (candidates: changelog/updates block, FAQPage JSON-LD,
  Apple-submission checklist doc, Terms/disclaimer page, more products).
