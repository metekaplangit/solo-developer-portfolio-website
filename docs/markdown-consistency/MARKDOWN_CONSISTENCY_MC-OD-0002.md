# Markdown Consistency Checkpoint MC-OD-0002 (on-demand)

- **Trigger:** On-demand (user wrap-up request). **Does not reset** the scheduled
  cadence (next scheduled Markdown Consistency is due after feature step #10).
- **Reviewed range:** Repository state at `v0.8.0` / commit `25b57b3` (custom
  domain live; HTTPS cert provisioning).
- **Date:** 2026-07-02.

## Checklist results

| Check | Result | Evidence |
|---|---|---|
| Current step / tag agreement | Pass | STATUS `current_step: STEP-0008`, `product_tag: v0.8.0`; CHANGELOG `[0.8.0]`; CHECKPOINTS feature count 8; ROADMAP Milestone 5 = code DONE (v0.8.0). |
| Domain consistency | Pass | `metkapstudio.com` agrees across `astro.config.mjs`, `public/CNAME`, `public/robots.txt`, `src/lib/site.ts`, `DEPLOYMENT.md`. No stale project-site `base` in config (0 refs). `example.com` remains only in unit-test fixtures (intended). |
| Live-state vs docs | Pass | Live Git: `main`, HEAD `25b57b3` == `origin/main`, clean. Pages `cname: metkapstudio.com`, cert **provisioning**, `https_enforced: false` — matches STATUS blockers + gate table (HTTP live Pass; HTTPS Blocked). |
| Blocked recorded honestly | Pass | HTTPS-on-domain is `Blocked` (cert provisioning), not claimed passing; HTTP-live is `Pass` with evidence. |
| Referenced reports/task cards exist | Pass | STEP-0008 card + MC-0004 present; all prior reports intact. |
| Canonical ownership / no duplicated workflow | Pass | DEPLOYMENT owns domain/DNS detail; STATUS links. One Milestone-5 heading. |
| STATUS machine-state keys | Pass | All required keys present. |
| Append-only history | Pass | Released changelog + Step IDs unchanged. |

## Findings

**No drift requiring repair.** The custom-domain switch is consistently reflected
across config, code, and docs, and the in-progress HTTPS certificate is correctly
recorded as `Blocked` (not a pass). A future AI session can resume from
`STATUS.md` alone.

## Follow-ups

- When the GitHub certificate finishes: enable Enforce HTTPS, verify
  `https://metkapstudio.com/` 200, then flip the STATUS HTTPS gate to Pass.
- Next scheduled checkpoints: Discussion after feature step #9; Audit + Markdown
  Consistency after #10.
