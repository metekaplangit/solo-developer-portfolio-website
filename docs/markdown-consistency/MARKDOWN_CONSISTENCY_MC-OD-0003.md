# Markdown Consistency Checkpoint MC-OD-0003 (on-demand)

- **Trigger:** On-demand (user wrap-up request). **Does not reset** the scheduled
  cadence (next scheduled Markdown Consistency is due after feature step #10).
- **Reviewed range:** Repository state at `v0.8.0`, after HTTPS went live on
  metkapstudio.com.
- **Date:** 2026-07-02.

## Checklist results

| Check | Result | Evidence |
|---|---|---|
| Step/tag/feature agreement | Pass | STATUS `current_step: STEP-0008`, `product_tag: v0.8.0`, `blockers: none`; CHANGELOG `[0.8.0]`; CHECKPOINTS feature count 8. |
| Domain live-state vs docs | Pass | STATUS `domain: … https_enforced: true`, HTTPS gate = **Pass**, no stale "provisioning/pending" mentions (0). CHANGELOG Unreleased notes domain fully live over HTTPS. |
| Domain consistency (config/code) | Pass | `metkapstudio.com` in `astro.config` (×2), `CNAME`, `robots.txt`; `support@metkapstudio.com` in `site.ts`. |
| Live Git vs STATUS | Pass | `main`, HEAD `80833ff` == `origin/main`, clean, only `main` branch; matches STATUS. |
| Referenced reports exist | Pass | STEP-0008 card, MC-0004, MC-OD-0002 present. |
| Append-only / no duplicated workflow | Pass | Unchanged; one Milestone-5 heading. |

## Findings

- **MC-OD-0003-F1 (repaired):** ROADMAP Milestone 5 still had a "once DNS
  resolves — enable Enforce HTTPS…" follow-up note, but HTTPS is now live and
  enforced. Updated to mark HTTPS/verification **DONE** and leave only the
  genuinely-optional user extras (Cloudflare Email Routing, DNSSEC, GitHub domain
  verification).

Otherwise no drift. A future AI session can resume from `STATUS.md` alone; the
site is fully live and secure.

## Follow-ups

- Optional user extras remain (email routing, DNSSEC) — non-blocking.
- Next scheduled: Discussion after feature step #9; Audit + Markdown Consistency
  after #10. Next feature packet undecided (changelog block / a11y CI / real
  content).
