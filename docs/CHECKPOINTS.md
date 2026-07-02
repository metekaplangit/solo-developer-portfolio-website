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

- Completed **feature** Steps: **0**.
- Calibration status: **pending** (offered before Step 1 / STEP-0001).
- Next feature step: **STEP-0001**.
- Next-due: Markdown Consistency after feature step **2**; Discussion after **3**;
  Audit after **5**; Enhancement after **7**.

## Due now

**None.** No feature step has completed yet, so no scheduled checkpoint is due.
The baseline (Milestone 0) is a non-feature step.

## Ledger

| Checkpoint ID | Trigger (Step/event) | Type | Status | Report | Notes |
|---|---|---|---|---|---|
| — | Initialization (STEP baseline) | n/a | n/a | — | Baseline is non-feature; no checkpoint due |

Immediate **event** review is required (regardless of cadence) for: profile/
overlay change, adding auth/payments/forms/analytics, public untrusted content,
new production platform, major dependency/engine change, or a security/data
incident. None have occurred.
