# Markdown Consistency Checkpoint MC-OD-0006 (on-demand)

- **Trigger:** On-demand (user wrap-up request). **Does not reset** the scheduled
  cadence (next scheduled Markdown Consistency + Audit after feature step #20).
- **Reviewed range:** Repository state at `v0.18.0` + the internal-docs commit
  `47f81ac` ("support email LIVE"). No new feature step since v0.18.0.
- **Date:** 2026-07-03.

## Checklist results

| Check | Result | Evidence |
|---|---|---|
| Step/tag/feature agreement | Pass | STATUS `current_step: STEP-0018`, `product_tag: v0.18.0`, `dirty: false`, `due_checkpoints: none`, `blockers: none`; CHANGELOG `[0.18.0]`; CHECKPOINTS feature count 18. |
| Content reality vs docs | Pass | On disk: 1 product (`sole-focus`), 2 policies (`global`, `sole-focus`), icon at `public/media/sole-focus/icon.svg`. Matches STATUS/DATA_STORAGE. |
| Live Git vs STATUS | Pass | `main`, HEAD `47f81ac` == `origin/main`, working tree clean, 0 ahead / 0 behind, only `main` branch (feature branches pruned). |
| Support-email milestone recorded | Pass | `support@metkapstudio.com` LIVE (Cloudflare Email Routing + SPF/DKIM/DMARC, verified inbox delivery) consistently reflected in STATUS, DEPLOYMENT, ROADMAP, SECURITY, CHANGELOG. Pre-launch blocker cleared; STATUS blockers = none. |
| No stale "email pending" drift | Pass | Only remaining "enable email routing" mention is in `MARKDOWN_CONSISTENCY_MC-0009.md` — an **append-only historical checkpoint** written before setup; correct to leave untouched. |
| Checkpoint ledger | Pass | DISC-0006 + MC-0009 logged at step 18; no scheduled checkpoint due until step 20 (Audit + MC), 21 (Discussion + Enhancement). |
| Read-only source convention | Pass | `../PromodoApp/` recorded read-only; unchanged. |
| Canonical ownership / append-only | Pass | Historical task cards + checkpoint reports untouched; single milestone headings; no duplicated versions. |

## Findings

**No drift requiring repair.** All current-state docs agree at v0.18.0, and the
operational support-email milestone is consistently recorded across owners. The
one older "email routing" reference is an append-only historical report and is
correctly preserved.

## Follow-ups

- Next scheduled: **Audit + Markdown Consistency after feature step #20**;
  **Discussion + Enhancement after #21**.
- Remaining pre-launch items are **app-side, not website**: App Store Connect
  App-Privacy labels ("Data Not Collected"), the app's `PrivacyInfo.xcprivacy`
  privacy manifest, and real Sole Focus screenshots (research item C).
