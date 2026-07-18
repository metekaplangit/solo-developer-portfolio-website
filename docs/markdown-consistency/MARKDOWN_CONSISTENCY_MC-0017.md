# Markdown Consistency Checkpoint MC-0017

- **Trigger:** Scheduled cadence — due at **feature step 34** (STEP-0035).
  Prior: MC-0016 at 32.
- **Reviewed range:** STEP-0034 + STEP-0035 (released together as **v0.33.0**).
- **Date:** 2026-07-17.

## Checklist results

| Check | Result | Notes |
|---|---|---|
| Machine-checked invariants | Pass | Post-tag: product_tag v0.33.0 == git tag == CHANGELOG top; feature count **34** in both owners; validator 43/43. |
| Release structure | Pass (documented) | Two packets (STEP-0034 fit statement, STEP-0035 maker note) share **one release tag v0.33.0**: packet 1's intermediate merge referenced a component landing in packet 2, so tagging it standalone would have pinned a non-building state. Local-only tag re-placed **before any push** (no published history touched); every pushed tag builds green. Version count ≠ step count is accepted precedent (cf. v0.26.1). |
| Approved-copy integrity | Pass | Fit + maker-note copy pinned by content tests, matching the user-approved artifact text verbatim. |
| Traceability | Pass | Cards 0034/0035 complete; DISC-0011 ledgered (incl. the FactsLine overflow regression fix); ROADMAP taste-round dispositions updated (T2/T5 shipped; T1/T3 declined this round; T4 closed-unless-user-reopens). |
| Merge-critical gates | Pass | build 8 / check 0-0-0 / **45 tests** / validator 43/43. |

## Findings

**No drift.** One process lesson recorded (tag only after a packet's tree is
self-contained — caught pre-push by the packet checklist).

## Follow-ups

- Next-due: **Enhancement + Audit after feature step 35** (next feature step).
