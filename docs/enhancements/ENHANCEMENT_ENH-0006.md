# Enhancement Checkpoint ENH-0006

- **Trigger:** Feature step 42 catch-up (prior ENH-0005 at 35).
- **Reviewed range:** ENH-0005 → HEAD, current backlog, official search guidance,
  dependency state, and the six-step design arc.
- **Date:** 2026-07-18.

## Re-triage

| Item | Decision | Rationale |
|---|---|---|
| GitHub #3 lead-image text alternative | **Recommended next small fix** | Concrete accessibility gap; bounded; no product invention required. |
| More real products | **Highest product value; owner-triggered** | Exercises catalog paths and adds genuine value, but only when a real product exists. |
| STEP-0033 updates block | Carried, trigger-armed | Start only on first app update or second product. |
| FAQPage JSON-LD | **Retired as SEO packet** | Google removed FAQ rich results in May 2026. Visible FAQs remain useful content, but markup no longer promises a portfolio rich-result benefit. |
| Dependency refresh | Optional maintenance packet | Astro 7.1.1 and Vitest 4.1.10 are available; current locks are green and vulnerability-free. |
| Terms/disclaimer, per-page OG images | Optional | Bounded static additions; prioritize only with a concrete need. |
| View Transitions, light theme, facets, press kit | Parked | No current user/product evidence justifies the added surface or maintenance. |

## Current-source evidence

- Google Search documentation update, June 2026: FAQ rich-result documentation
  was removed because the feature stopped appearing in Search on May 7, 2026:
  https://developers.google.com/search/updates
- Google structured-data guidance still favors accurate, visible, relevant
  JSON-LD generally, but markup does not guarantee a rich result:
  https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- `npm outdated` on 2026-07-18 supplied the dependency availability noted above.

No new feature was started during this checkpoint.
