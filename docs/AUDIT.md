# Audit

> **Purpose:** Quality audit procedure and report format.
> **Read when:** An Audit checkpoint is due (every 5 feature steps) or on demand.
> **Update when:** Audit scope, format, or cadence changes.
> **Synchronize with:** CHECKPOINTS.md, ROADMAP.md, STATUS.md, ISSUE_TRACKING.md.
> **Status:** Active.
> **Activation:** Standard profile. First scheduled audit due after feature step 5.

## Cadence

Every **5** completed feature Steps, plus on demand. Report:
`docs/audits/AUDIT_<checkpoint-id>.md` (delta-based; names its evidence range).

## Scope

Correctness and traceability (need → packet → criteria → tests → docs →
changelog); documented-vs-actual architecture and dependency direction; the
**zero-cost / static-only guardrails** (no forbidden deps/services introduced);
tests + usability; UI/accessibility; security/privacy (secrets, audit clean,
provenance); Git/fresh-clone hygiene; docs synchronization (Section 18 contract);
issue hygiene; and **AI followability** (can another model act from files alone).

## Method

Full comprehension pass + scheduled `AI_SEARCH.md` refresh. Grade each area with
the shared vocabulary (`Pass`/`Warn`/`Fail`/`Blocked`/`Needs Repair`). Every
actionable finding becomes a tracked issue with priority and milestone. Fix
small/clear/critical findings; schedule larger work as packets. Evidence:
commands, sources, and before/after where relevant.

## Followability rule

If another AI model cannot identify current state and the exact next action
without chat history, the audit result cannot be `Pass`.
