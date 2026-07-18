# Enhancement Checkpoint ENH-0005

- **Trigger:** Feature step #35 (STEP-0036); Enhancement cadence every 7 (prior:
  ENH-0004 at #28).
- **Reviewed range:** ENH-0004 → HEAD, plus the open backlog and both design
  reviews.
- **Date:** 2026-07-17.

## Re-triage

| Item | Decision | Rationale |
|---|---|---|
| **More real products** | **Accepted — highest-value next (owner-driven)** | Now doubly motivated: fills the wider catalog/home (AUDIT-0007-F1) and exercises the multi-product paths (spotlight + card grid) that only one product currently tests. Blocked on a product existing. |
| **STEP-0033 updates/release-notes block** | Carried — trigger-armed | Unchanged: fires on first app update or second product. |
| Mid-width (~833px) featured polish | **New — parked (low)** | AUDIT-0007-F2: text column tall at the breakpoint. Cosmetic; open a small packet only if it bothers the user. |
| FAQPage JSON-LD | Carried (low) | Still the only missing rich-result surface; small code packet whenever chosen. |
| T4 shorter reading path / description refresh | Closed unless reopened | User selected T2/T5 only; prose-preserving refresh remains available on request (preview-first). |
| Cloudflare cache TTL + security headers | Carried (owner dashboard) | AUDIT-OD-0001 F3/F4; not repo-shippable. |
| Facets / purpose labels / compatibility notices / availability states | Parked until catalog growth | review-0002 COMP-06/08/10, AI-10. |

## New observations

- The redesign's width tokens (`--maxw` 78rem, `--maxw-prose` 43rem) are now the
  system-wide levers; future spacing work should adjust tokens, not per-page
  widths.
- With four content-driven leaf components (Download/Facts/Fit/Maker), the
  product header + spotlight are at a healthy density ceiling — prefer replacing
  over stacking (echoes DISC-0011-F2).

## Follow-ups

- Recommend **more products** as the next substantive packet; **FAQPage JSON-LD**
  as the next quick code packet. Next checkpoints: MC + Discussion after #36.
