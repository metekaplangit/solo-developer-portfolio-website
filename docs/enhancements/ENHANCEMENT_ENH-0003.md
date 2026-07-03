# Enhancement Checkpoint ENH-0003

- **Trigger:** Completion of feature step #21 (STEP-0021); Enhancement cadence =
  every 7 feature steps (ran at #7, #14, now #21).
- **Reviewed range:** Whole product at v0.21.0.
- **Date:** 2026-07-03.

## Context

Since ENH-0002 (v0.14.0): app icon + current Sole Focus icon, UI-consistency,
research-driven polish + a11y CI gate, appeal/motion, privacy completeness,
support email live, premium craft, clickable icons, and this review remediation.
The site is live, static, zero-cost, accessible (gated), and polished. This
checkpoint re-triages the backlog.

## Candidate enhancements

| # | Idea | Benefit | Risk / cost | Disposition |
|---|---|---|---|---|
| C (E1) | **Real Sole Focus screenshots + device mockups** in the hero/detail (consume `MediaAsset` via `astro:assets` `<Image>`) | Highest remaining visual-credibility lever; makes the product concrete | Needs real screenshots (user export); build-time only, stays static | **Top roadmap packet — blocked on assets.** |
| N1 | **On-site changelog / "Updates" block** driven by dated content | Signals the product is alive; SEO | Small; content model already carries dates | **Roadmap candidate.** |
| N2 | **Reply-as support@** (Gmail "Send mail as" + SMTP relay, or iCloud custom domain) | Replies come from the brand address, not personal Gmail | User dashboard task; small | **Pre-launch nicety (user-run).** |
| N3 | **Terms / disclaimer page** (optional) | Liability framing; not required by Apple for a free no-data app | Small content page | **Parked** unless wanted. |
| N4 | **Per-page OG images** (satori/static, build-time) | Richer social link previews | Extra build step; stays static | **Roadmap (later).** |
| N5 | **Apple-submission checklist doc** (nutrition labels, `PrivacyInfo.xcprivacy`, email) | De-risks a Sole Focus submission | Doc only | **Accepted → do when submission nears.** |
| E4/E5 | View Transitions / light-theme toggle | — | Adds JS/scope | **Parked** (unchanged). |

## Original combination worth noting

- **Assets-ready content model still holds:** when C lands, wire `MediaAsset`
  (dimensions/alt/license) directly into `<Image>` so screenshots become
  optimized, responsive, and provenance-tracked from one source — the schema
  already carries what `<Image>` needs.

## Dispositions summary

- **Top accepted (blocked on assets):** C — real screenshots + device mockups.
- **Accepted → roadmap:** N1 (changelog block), N5 (Apple checklist doc).
- **Pre-launch (user-run):** N2 (reply-as support@).
- **Parked:** N3, N4, E4, E5.
- Nothing implemented in this checkpoint (append-only review). No security /
  license / complexity red flags; static + zero-cost ethos intact.

## Follow-ups

- Next Enhancement after feature step #28. Markdown Consistency after #22;
  Discussion after #24; Audit after #25.
