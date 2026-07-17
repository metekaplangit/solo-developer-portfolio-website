# Discussion Checkpoint DISC-0010

- **Trigger:** Scheduled cadence — Discussion every 3 feature steps; due at
  **feature step 30** (prior: DISC-0009 at 27).
- **Reviewed range:** STEP-0028 → STEP-0030 (v0.28.0 → v0.30.0), including the
  first adoption of an **external design review** (review-0001).
- **Date:** 2026-07-17.

## Review

**External-review adoption worked as designed.** The third-party report was
treated as evidence, not authority: each finding got an explicit disposition —
OPP-01/04/07/08 adopted (objective, verified against source before acting),
OPP-02 declined because it contradicted the user's explicit top-of-page CTA
intent, OPP-03/05/06 deferred under the preview-first rule for taste-sensitive
changes. Dispositions are recorded in the Task Cards and ROADMAP, so a future
session can see *why* each finding was or wasn't taken.

**Truthfulness held.** The new requirements line was verified against the live
App Store listing before publication; the trust line quotes the Support page's
own reply-window promise; platform labels now come from one map so JSON-LD and
badges cannot diverge.

**Process.** Card-first on both packets; one slip (v0.29.0 pushed over a real
validator failure — see AUDIT-0006-F1) caught and repaired within the session;
the validator's step/ROADMAP check proved its worth by catching the miss.

## Findings

| ID | Severity | Finding | Disposition |
|---|---|---|---|
| DISC-0010-F1 | info | The support reply-window promise is now on the purchase path; it must stay operationally true or be removed. | **Note** — owner habit. |
| DISC-0010-F2 | low | Push-after-validate should be gated, not chained (echo of AUDIT-0006-F1). | **Adopted** as working practice going forward. |

No blocking findings.

## Follow-ups

- Recommended next packet remains **FAQPage JSON-LD**.
- Next scheduled: MC after 32; Discussion after 33; Enhancement + Audit after 35.
