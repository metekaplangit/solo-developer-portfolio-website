# Checkpoints Ledger

> **Purpose:** Live ledger of Discussion, Audit, Enhancement, and Markdown Consistency checkpoints.
> **Read when:** Before opening/closing any packet; before merge/tag.
> **Update when:** A checkpoint becomes due, runs, is missed, or is remediated.
> **Synchronize with:** ROADMAP.md, STATUS.md, AUDIT.md, DISCUSSION.md, ENHANCEMENTS.md, MARKDOWN_CONSISTENCY.md.
> **Status:** Active.
> **Activation:** Standard profile.

## Cadence (counts completed feature Steps)

| Checkpoint | Every N feature steps | Branch | Report path |
|---|---|---|---|
| Markdown Consistency | 2 | `markdown-consistency/<id>` | `docs/markdown-consistency/` |
| Discussion | 3 | `discussion/<id>` | `docs/discussions/` |
| Audit | 5 | `audit/<id>` | `docs/audits/` |
| Enhancement | 7 | `enhancement/<id>` | `docs/enhancements/` |

Event/on-demand runs do not reset cadence. Non-feature baselines/fixes/refactors/
docs/checkpoints are classified separately and do **not** advance the feature
counter.

## Counters

- Completed **feature** Steps: **10** (STEP-0001..STEP-0010).
- Calibration status: **completed** (2026-07-02).
- Next feature step: **STEP-0011**.
- Next-due: **Discussion** + **Markdown Consistency** after feature step **12**;
  next Enhancement after **14**; Audit after **15**.

## Due now

**None.** MC-0001(2), DISC-0001(3), MC-0002(4), AUDIT-0001(5), MC-0003+DISC-0002(6),
ENH-0001(7), MC-0004(8), DISC-0003(9), AUDIT-0002+MC-0005(10) done (+ on-demand
MC-OD-0001/0002/0003). Nothing falls due until step 12. No checkpoint blocks the
next packet.

## Ledger

| Checkpoint ID | Trigger (Step/event) | Type | Status | Report | Notes |
|---|---|---|---|---|---|
| — | Initialization (M0 baseline) | n/a | n/a | — | Non-feature; no checkpoint due |
| — | STEP-0001 complete (feature #1) | n/a | n/a | — | Below every-2 cadence; none due |
| MC-0001 | STEP-0002 complete (feature #2) | Markdown Consistency | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-0001.md` | 1 drift found + repaired (duplicate M3 heading) |
| DISC-0001 | STEP-0003 complete (feature #3) | Discussion | Done | `docs/discussions/DISCUSSION_DISC-0001.md` | Fixed CI test gap; logged LEDGER-001 (monogram dup) |
| MC-0002 | STEP-0004 complete (feature #4) | Markdown Consistency | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-0002.md` | Synced deploy/base-path across docs; roadmap phase reorg |
| MC-OD-0001 | On-demand (user wrap-up) | Markdown Consistency (on-demand) | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-OD-0001.md` | Relabelled stale M2 heading; all owners in sync. Does not reset cadence. |
| AUDIT-0001 | STEP-0005 complete (feature #5) | Audit | Done | `docs/audits/AUDIT_AUDIT-0001.md` | All areas Pass; logged LEDGER-002 (a11y automation) + noted LEDGER-001 |
| MC-0003 | STEP-0006 complete (feature #6) | Markdown Consistency | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-0003.md` | Rebrand + roadmap reorder synced; no drift |
| DISC-0002 | STEP-0006 complete (feature #6) | Discussion | Done | `docs/discussions/DISCUSSION_DISC-0002.md` | Rebrand review; fixed stale About meta (DISC-0002-F1) |
| ENH-0001 | STEP-0007 complete (feature #7) | Enhancement | Done | `docs/enhancements/ENHANCEMENT_ENH-0001.md` | Accepted E1 (image pipeline) + E2 (a11y CI) to backlog; parked E3–E6 |
| MC-0004 | STEP-0008 complete (feature #8) | Markdown Consistency | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-0004.md` | Domain switch synced; live-HTTPS correctly recorded Blocked |
| MC-OD-0002 | On-demand (user wrap-up) | Markdown Consistency (on-demand) | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-OD-0002.md` | No drift at v0.8.0; domain consistent; HTTPS still Blocked. Does not reset cadence. |
| MC-OD-0003 | On-demand (user wrap-up) | Markdown Consistency (on-demand) | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-OD-0003.md` | HTTPS now live; fixed stale ROADMAP M5 follow-up. No other drift. Does not reset cadence. |
| DISC-0003 | STEP-0009 complete (feature #9) | Discussion | Done | `docs/discussions/DISCUSSION_DISC-0003.md` | App-review readiness reviewed; guidance-only finding (sample draft policy) |
| AUDIT-0002 | STEP-0010 complete (feature #10) | Audit | Done | `docs/audits/AUDIT_AUDIT-0002.md` | All areas Pass; logged avatar-dup (LEDGER-001) + tagline note |
| MC-0005 | STEP-0010 complete (feature #10) | Markdown Consistency | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-0005.md` | Sole Focus/placeholder removal synced; no drift |
| MC-OD-0004 | On-demand (user wrap-up) | Markdown Consistency (on-demand) | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-OD-0004.md` | v0.10.0 consistent; placeholder strings are test fixtures/history only. Does not reset cadence. |

Immediate **event** review is required (regardless of cadence) for: profile/
overlay change, adding auth/payments/forms/analytics, public untrusted content,
new production platform, major dependency/engine change, or a security/data
incident. None have occurred.
