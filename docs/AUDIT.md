# Audit

> **Purpose:** Quality audit procedure and report format.
> **Read when:** Running an Audit checkpoint.
> **Update when:** Audit scope or format changes.
> **Synchronize with:** CHECKPOINTS.md, ROADMAP.md, STATUS.md, ISSUE_TRACKING.md.
> **Status:** Active.
> **Activation:** Standard profile. Run on demand.

## When to run

On demand — before a release you care about, or when quality feels uncertain.
There is no step-count schedule (cadence retired 2026-07-18; see ROADMAP.md).
Report: `docs/audits/AUDIT_<checkpoint-id>.md` (delta-based; names its evidence range).

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
