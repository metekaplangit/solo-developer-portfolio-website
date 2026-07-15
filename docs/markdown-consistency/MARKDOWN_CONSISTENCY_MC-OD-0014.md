# Markdown Consistency Checkpoint MC-OD-0014 (on-demand)

- **Trigger:** On-demand wrap-up request (user going out).
- **Reviewed range:** Since MC-OD-0013: **STEP-0027 / v0.27.0** — the release
  pass (Sole Focus live on the Mac App Store) — plus its DISC-0009 discussion
  checkpoint.
- **Date:** 2026-07-15.

## Checklist results

| Check | Result | Notes |
|---|---|---|
| Machine-checked invariants | Pass | `sync.product_tag_matches_git` (v0.27.0 == git), `sync.feature_step_count_agrees` (27 in both), `sync.changelog_top_release_matches_tag` (v0.27.0) — validator **43/43**. |
| Manual reconciliation | Pass | `due_checkpoints: none`, `blockers: none` (ship-blockers closed by the live release); DISC-0009 ledgered; Task Card STEP-0027 complete with evidence; ROADMAP/STATUS/CHANGELOG all carry the release consistently; no stale "coming soon"/"in development" copy anywhere in content or docs' live-state sections. |
| Release-state reality matches docs | Pass | Live site verified this session: Mac App Store button with the verified listing URL, Released badges, offers JSON-LD (price 0, InStock), home "1 shipped"; 2 content tests pin status/URL/price. |
| Merge-critical gates | Pass | build 8 routes; check 0/0/0; **38 tests**; validator 43/43, exit 0. Deploy green through the a11y gate; v0.27.0 tag on origin. |
| Git hygiene | Pass | On `main`, 0 ahead / 0 behind; clean tree; no stray branches/stashes/untracked. |
| Append-only history | Pass | Only additive this run: this report + ledger row. |

## Findings

**No drift.** The release pass synchronized every owner at merge time and the
validator's sync checks hold the release facts (tag, counters, CHANGELOG) in
place mechanically.

## Follow-ups

- Recommended next packet (per DISC-0009): **FAQPage JSON-LD**. Other candidates:
  changelog/updates block, more products, Terms page, prose-preserving
  description refresh. Owner habit: mention App Store listing changes
  (name/price) so the site's offers/copy stay truthful — tests pin current values.
- Cloudflare dashboard owner-actions still open (asset cache TTL, security
  headers — AUDIT-OD-0001 F3/F4).
- Next scheduled: **Markdown Consistency + Enhancement after feature step 28**;
  **Audit after 30**.
