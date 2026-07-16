# Enhancement Checkpoint ENH-0004

- **Trigger:** Scheduled cadence — Enhancement every 7 completed feature Steps;
  due at **feature step 28** (prior: ENH-0003 at 21).
- **Reviewed range:** STEP-0022 → STEP-0028 (v0.22.0 → v0.28.0) + open backlog.
- **Date:** 2026-07-15.

## Re-triage of backlog & candidates

| Item | Source | Decision | Rationale |
|---|---|---|---|
| **FAQPage JSON-LD** | AUDIT-0005-F3, DISC-0009-F2 | **Accepted — recommended next packet (STEP-0029)** | Small, code-only, completes the structured-data story; FAQ content already exists; release made the page rich-result eligible. |
| On-site changelog/updates block | ENH-0003 N1 | Carried | More valuable once the app ships its first update; revisit after 1–2 app releases. |
| More real products | ENH-0003 | Carried (owner-driven) | Highest long-term value (fills centered grids, second download button proves the multi-product design); blocked on a product existing. |
| Lighter-touch description refresh | Format B rejection follow-up | Carried | Prose-preserving type/spacing elevation; show rendered result before finalizing (standing rule). |
| Terms/disclaimer page | ENH-0003 | Carried | Optional; not required for a free, no-account app. |
| Cloudflare cache TTL + security headers | AUDIT-OD-0001 F3/F4 | Carried (owner dashboard action) | Not repo-shippable; click-by-click guide offered. |
| Unify product header / ProductAvatar rhythm | ENH-0002 N1/N2/E7 | Partially superseded | STEP-0028's header CTA reworked the detail header; remaining rhythm polish folded into any future description-refresh packet. |

## New enhancement observations (this cycle)

- The `DownloadButton` sm/md pattern generalizes cleanly to future stores
  (labels already mapped for Google Play/Steam/etc.) — no action needed now.
- Home hero fallback logic (primary shifts to "See apps & games" when no
  download exists) is the pattern to reuse for any future unreleased spotlight.

## Follow-ups

- Recommended: freeze **STEP-0029 — FAQPage JSON-LD** next session.
- Next scheduled checkpoints: Audit + Discussion + MC after feature step 30.
