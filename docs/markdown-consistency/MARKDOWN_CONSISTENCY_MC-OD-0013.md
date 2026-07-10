# Markdown Consistency Checkpoint MC-OD-0013 (on-demand)

- **Trigger:** On-demand wrap-up request (user going out).
- **Reviewed range:** Since MC-OD-0012: **AUDIT-OD-0001** (full-system audit; CI
  actions modernized to Node-24 majors; deploy timeout corrected) and the
  **governance drift machine-checks packet** (`tool/governance-drift-checks`:
  validator 40→43 checks; counter/history de-duplication; slimmer wrap-up
  procedure documented in MARKDOWN_CONSISTENCY.md).
- **Date:** 2026-07-07.
- **Note:** First wrap-up under the new procedure — the drift classes previously
  reconciled by hand here are now validator-enforced, so this checkpoint is
  correspondingly shorter.

## Checklist results

| Check | Result | Notes |
|---|---|---|
| Machine-checked invariants (new) | Pass | `sync.product_tag_matches_git` (v0.26.1 == git), `sync.feature_step_count_agrees` (26 in both), `sync.changelog_top_release_matches_tag` (v0.26.1) — all green in the 43/43 validator run. |
| Manual reconciliation (what the validator can't see) | Pass | `due_checkpoints: none`, `blockers: none`; no stale "40/40" claims in live-state docs (STATUS gate table says 43/43); CHANGELOG `[Unreleased]` empty (both packets internal-only, correctly untagged and un-changelogged per VERSION_CONTROL); AUDIT-OD-0001 ledgered; ROADMAP untouched (no feature work). |
| Canonical ownership | Pass | Checkpoint history now lives only in the CHECKPOINTS ledger; STATUS keeps counters + next-due; "Due now" no longer tracks per-run ranges. |
| Merge-critical gates | Pass | build 8 routes; check 0/0/0; **36 tests**; validator **43/43**, exit 0. |
| CI/deploy reality | Pass | Both pipelines green on the upgraded action majors with zero deprecation/timeout warnings; validator's tag check degrades gracefully in CI's shallow checkout (verified in the CI log). Live site HTTP 200. |
| Git hygiene | Pass | On `main`, 0 ahead / 0 behind; clean tree; no stray branches/stashes; latest tag v0.26.1 on origin. |
| Append-only history | Pass | Only additive: this report + ledger row. |

## Findings

**No drift.** Both intervening packets synchronized their owners at merge time,
and the new validator checks now hold the previously drift-prone facts in place
mechanically.

## Follow-ups

- Unchanged open items: Cloudflare dashboard owner-actions (asset cache TTL,
  security headers — AUDIT-OD-0001 F3/F4); FAQPage JSON-LD as top next feature
  packet; lighter-touch description refresh (prose-preserving) when the user
  wants it.
- Next scheduled: Discussion after feature step 27; Markdown Consistency +
  Enhancement after 28; Audit after 30.
