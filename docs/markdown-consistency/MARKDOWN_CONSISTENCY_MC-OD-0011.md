# Markdown Consistency Checkpoint MC-OD-0011 (on-demand)

- **Trigger:** On-demand wrap-up request (user going out) — verify cross-doc
  synchronization and a clean, ready repo after the v0.26.1 patch and the
  reverted "Format B" description-redesign attempt.
- **Reviewed range:** v0.26.0 → **v0.26.1** (scrollbar-gutter layout-shift fix)
  and the subsequent uncommitted-then-reverted Format B work.
- **Date:** 2026-07-07.

## Checklist results

| Check | Result | Notes |
|---|---|---|
| Tag / release agreement | Pass | STATUS (`product_tag: v0.26.1`), STATUS "Version control" (Latest product tag **v0.26.1**), and CHANGELOG top release `[0.26.1]` all agree. `v0.26.1` is on origin. |
| Current step / feature count | Pass | `current_step: STEP-0026`; feature Steps **26** in both STATUS and CHECKPOINTS. v0.26.1 is a compatible **fix**, not a feature step, so the counter and cadence are unchanged. |
| Tag ↔ HEAD | Pass (documented) | `v0.26.1` tags the fix merge. Before this checkpoint HEAD == the tag; the MC-OD-0011 commit is **docs-only** (internal), so HEAD then sits just ahead of the tag — product state is still v0.26.1. STATUS now states this precisely rather than "main == v0.26.1". |
| Reverted Format B — no residue | Pass | The attempted icon-panel ("Format B") description redesign (`SectionPanels.astro`, a `sections` schema field, edits to `sole-focus.md` / `[slug].astro`) was **reverted while still uncommitted** — it never reached `main`, the tag, the live site, or any doc. Grep confirms no `SectionPanels` / "Format B" references in `docs/` or `src/`. Nothing to repair. |
| Due checkpoints | Pass | `due_checkpoints: none`. Next scheduled: Discussion after feature step 27; Markdown Consistency + Enhancement after 28; Audit after 30. This on-demand run does not reset cadence. |
| Canonical ownership / no duplicated workflow | Pass | Current-tag value lives in STATUS + CHANGELOG; VERSION_CONTROL policy-only; the standing autonomous-shipping rule is stated once in AI_WORKFLOW.md. |
| Code/paths reality matches docs | Pass | Detail page renders the original prose sections + Highlights grid (Format B removed); live at https://metkapstudio.com/apps/sole-focus/ (HTTP 200). No code changed this cycle (docs-only). |
| CHANGELOG accuracy | Pass | `[Unreleased]` = "Nothing pending"; `[0.26.1]`/`[0.26.0]` intact; no released section rewritten. |
| Issue/blocker agreement | Pass | LEDGER-001/002 resolved; blockers none; no new issues. |
| Append-only history preserved | Pass | Prior reports/releases and completed ledger rows untouched; only additive files + on-demand-range bumps this cycle. |
| Merge-critical gates | Pass | `npm run check` 0/0/0; `npm run build` 8 routes; `npm test` **36 passed**; validator **40/40**, exit 0. |
| Git hygiene | Pass | On `main`, 0 ahead / 0 behind `origin/main` (before this checkpoint commit); working tree clean; no stray/unmerged branches; no stashes; `v0.26.1` tag on origin. |

## Findings

**No drift.** Everything agrees at **v0.26.1**. The v0.26.1 patch synchronized its
own owners at release time, and the Format B redesign was reverted before it
touched anything tracked — so there was nothing to clean beyond this checkpoint's
own bookkeeping (on-demand range → 0011, and a small precision fix to the STATUS
"main == v0.26.1" wording so it stays accurate once docs land past the tag).

## Follow-ups

- **Open (product, not blocking):** the description sections still read as "boring"
  to the user, but the icon-panel "Format B" redesign was rejected on sight and
  reverted. A future redesign should take a **different, lighter-touch** approach
  (elevate typography/spacing within the prose feel) and be shown rendered before
  finalizing. Not a governance item.
- Next scheduled checkpoints unchanged (Discussion after 27; MC + Enhancement
  after 28; Audit after 30). Next feature packet undecided.
