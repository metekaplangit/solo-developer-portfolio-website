# Markdown Consistency Checkpoint MC-0004

- **Trigger:** Completion of feature step #8 (STEP-0008); cadence = every 2
  feature steps.
- **Reviewed range:** STEP-0007 (v0.7.0) → STEP-0008 (v0.8.0).
- **Date:** 2026-07-02.

## Checklist results

| Check | Result | Notes |
|---|---|---|
| Step/tag/checkpoint agreement | Pass | STATUS current STEP-0008, tag v0.8.0; CHECKPOINTS feature count 8; CHANGELOG [0.8.0]; ROADMAP Milestone 5 done. |
| Domain reality vs docs | Pass | `astro.config` (`site` metkapstudio.com, `base '/'`), `public/CNAME`, `robots.txt` sitemap, `site.ts` support email, and DEPLOYMENT.md all agree on metkapstudio.com. |
| Deployment ownership | Pass | DEPLOYMENT.md owns the DNS records + GitHub/HTTPS/email steps; STATUS links, does not duplicate. |
| Blocked state recorded honestly | Pass | Live-HTTPS on the domain is marked Blocked-pending-DNS in STATUS + Task Card with exact user steps; not claimed as passing. |
| Memory ↔ docs | Pass | `brand-and-domain` memory (metkapstudio.com) now realized; support email switched as noted. |
| Referenced reports/task cards exist | Pass | STEP-0008 task card + MC-0004 present. |
| Append-only history / no duplicated workflow | Pass | Unchanged. |

## Findings

**No drift requiring repair.** The custom-domain switch is consistently reflected
across config, code, and docs. The one legitimately-incomplete item (live HTTPS
on the domain) is correctly recorded as `Blocked` pending user-side Cloudflare DNS
+ GitHub certificate provisioning — not as a pass.

## Follow-ups

- Verify `https://metkapstudio.com/` 200 + `www`→apex redirect once DNS
  propagates; then enable "Enforce HTTPS" and (recommended) domain verification.
- Next Markdown Consistency after step 10 (with the Audit); Discussion after 9.
