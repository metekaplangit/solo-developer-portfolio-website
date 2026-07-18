# Markdown Consistency Checkpoint MC-0019

- **Trigger:** Scheduled catch-up through feature step 42. Covers missed
  Markdown Consistency milestones 38, 40, and 42 (prior MC-0018 at 36).
- **Reviewed range:** STEP-0038 → STEP-0043 (v0.36.0 → v0.39.1).
- **Date:** 2026-07-18.

## Results

| Check | Result | Evidence |
|---|---|---|
| Step/tag/count agreement | Pass | STEP-0043, v0.39.1, CHANGELOG top release, and feature count 42 agree. |
| Live handoff | Repaired | STATUS was reduced to current-only state; stale STEP-0031/0037, v0.30.0, gate counts, next actions, and checkpoint prose removed. |
| Cadence agreement | Repaired | ROADMAP now names the checkpoints that became due at 38/39/40/42; CHECKPOINTS and STATUS both record none due after this catch-up. |
| Ownership/navigation | Repaired | Schema ownership now points to `src/content/schema.ts`; issue ownership now points to active GitHub Issues; the pre-remote ledger is retired. |
| Product/testing reality | Repaired | Product schema fields, policy row treatment, active Vitest/Lighthouse gates, milestone status, and current backlog now match the repository. |
| Append-only history | Pass | Completed reports/releases remain unchanged; only overwrite-owned live docs and current ledgers were repaired. |

## Finding

The validator could pass 43/43 while CHECKPOINTS explicitly said four types were
overdue because it trusted only STATUS `due_checkpoints`. A new
`checkpoint.status_agrees_with_ledger` check now compares STATUS with the
CHECKPOINTS `Due now` section. This catch-up passes **44/44**.

## Verification

Build 8 routes; check 0/0/0; tests 45/45; production audit 0 vulnerabilities;
Git integrity clean; latest remote CI green.
