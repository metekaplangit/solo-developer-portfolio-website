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

- Completed **feature** Steps: **1** (STEP-0001).
- Calibration status: **completed** (2026-07-02).
- Next feature step: **STEP-0002**.
- Next-due: Markdown Consistency after feature step **2** (i.e. when STEP-0002
  completes); Discussion after **3**; Audit after **5**; Enhancement after **7**.

## Due now

**None.** 1 feature step complete; Markdown Consistency first falls due at
feature step 2. No checkpoint blocks the next packet.

## Ledger

| Checkpoint ID | Trigger (Step/event) | Type | Status | Report | Notes |
|---|---|---|---|---|---|
| — | Initialization (M0 baseline) | n/a | n/a | — | Non-feature; no checkpoint due |
| — | STEP-0001 complete (feature #1) | n/a | n/a | — | Below every-2 cadence; none due |

Immediate **event** review is required (regardless of cadence) for: profile/
overlay change, adding auth/payments/forms/analytics, public untrusted content,
new production platform, major dependency/engine change, or a security/data
incident. None have occurred.
