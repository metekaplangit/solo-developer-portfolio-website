# Checkpoints Ledger

> **Purpose:** Live ledger of Discussion, Audit, Enhancement, and Markdown Consistency checkpoints.
> **Read when:** Before opening/closing any packet; before merge/tag.
> **Update when:** A checkpoint becomes due, runs, is missed, or is remediated.
> **Synchronize with:** ROADMAP.md, STATUS.md, AUDIT.md, DISCUSSION.md, ENHANCEMENTS.md, MARKDOWN_CONSISTENCY.md.
> **Status:** Active.
> **Activation:** Standard profile.

## Cadence (counts completed feature Steps)

| Checkpoint | Every N feature steps | Branch | Report path |
|---|---|---|---|
| Markdown Consistency | 2 | `markdown-consistency/<id>` | `docs/markdown-consistency/` |
| Discussion | 3 | `discussion/<id>` | `docs/discussions/` |
| Audit | 5 | `audit/<id>` | `docs/audits/` |
| Enhancement | 7 | `enhancement/<id>` | `docs/enhancements/` |

Event/on-demand runs do not reset cadence. Non-feature baselines/fixes/refactors/
docs/checkpoints are classified separately and do **not** advance the feature
counter.

## Counters

- Completed **feature** Steps: **26** (STEP-0001..STEP-0026).
- Calibration status: **completed** (2026-07-02).
- Next feature step: **STEP-0027**.
- Next-due: **Discussion** after feature step **27**; **Markdown Consistency +
  Enhancement** after **28**; **Audit** after **30**.

## Due now

**None.** **MC-0013** (due at feature step **26**) is **done** with the STEP-0026
/ v0.26.0 release. Prior: **AUDIT-0005**(25), **MC-0012 + DISC-0008**(24),
**MC-0011**(22), **DISC-0007 + ENH-0003**(21), **AUDIT-0004 + MC-0010**(20). Step
23 had none. Steps 17, 19 off-cadence. **DISC-0006 + MC-0009(18)**, **MC-0008(16)**
done (+ on-demand MC-OD-0001..0011; MC-OD-0012 = this wrap-up).

## Ledger

| Checkpoint ID | Trigger (Step/event) | Type | Status | Report | Notes |
|---|---|---|---|---|---|
| — | Initialization (M0 baseline) | n/a | n/a | — | Non-feature; no checkpoint due |
| — | STEP-0001 complete (feature #1) | n/a | n/a | — | Below every-2 cadence; none due |
| MC-0001 | STEP-0002 complete (feature #2) | Markdown Consistency | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-0001.md` | 1 drift found + repaired (duplicate M3 heading) |
| DISC-0001 | STEP-0003 complete (feature #3) | Discussion | Done | `docs/discussions/DISCUSSION_DISC-0001.md` | Fixed CI test gap; logged LEDGER-001 (monogram dup) |
| MC-0002 | STEP-0004 complete (feature #4) | Markdown Consistency | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-0002.md` | Synced deploy/base-path across docs; roadmap phase reorg |
| MC-OD-0001 | On-demand (user wrap-up) | Markdown Consistency (on-demand) | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-OD-0001.md` | Relabelled stale M2 heading; all owners in sync. Does not reset cadence. |
| AUDIT-0001 | STEP-0005 complete (feature #5) | Audit | Done | `docs/audits/AUDIT_AUDIT-0001.md` | All areas Pass; logged LEDGER-002 (a11y automation) + noted LEDGER-001 |
| MC-0003 | STEP-0006 complete (feature #6) | Markdown Consistency | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-0003.md` | Rebrand + roadmap reorder synced; no drift |
| DISC-0002 | STEP-0006 complete (feature #6) | Discussion | Done | `docs/discussions/DISCUSSION_DISC-0002.md` | Rebrand review; fixed stale About meta (DISC-0002-F1) |
| ENH-0001 | STEP-0007 complete (feature #7) | Enhancement | Done | `docs/enhancements/ENHANCEMENT_ENH-0001.md` | Accepted E1 (image pipeline) + E2 (a11y CI) to backlog; parked E3–E6 |
| MC-0004 | STEP-0008 complete (feature #8) | Markdown Consistency | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-0004.md` | Domain switch synced; live-HTTPS correctly recorded Blocked |
| MC-OD-0002 | On-demand (user wrap-up) | Markdown Consistency (on-demand) | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-OD-0002.md` | No drift at v0.8.0; domain consistent; HTTPS still Blocked. Does not reset cadence. |
| MC-OD-0003 | On-demand (user wrap-up) | Markdown Consistency (on-demand) | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-OD-0003.md` | HTTPS now live; fixed stale ROADMAP M5 follow-up. No other drift. Does not reset cadence. |
| DISC-0003 | STEP-0009 complete (feature #9) | Discussion | Done | `docs/discussions/DISCUSSION_DISC-0003.md` | App-review readiness reviewed; guidance-only finding (sample draft policy) |
| AUDIT-0002 | STEP-0010 complete (feature #10) | Audit | Done | `docs/audits/AUDIT_AUDIT-0002.md` | All areas Pass; logged avatar-dup (LEDGER-001) + tagline note |
| MC-0005 | STEP-0010 complete (feature #10) | Markdown Consistency | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-0005.md` | Sole Focus/placeholder removal synced; no drift |
| MC-OD-0004 | On-demand (user wrap-up) | Markdown Consistency (on-demand) | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-OD-0004.md` | v0.10.0 consistent; placeholder strings are test fixtures/history only. Does not reset cadence. |
| DISC-0004 | STEP-0012 complete (feature #12) | Discussion | Done | `docs/discussions/DISCUSSION_DISC-0004.md` | Privacy readability redesign reviewed; no blocking findings |
| MC-0006 | STEP-0012 complete (feature #12) | Markdown Consistency | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-0006.md` | Privacy redesign + schema fields synced; no drift |
| — | STEP-0013 complete (feature #13) | n/a | n/a | — | Off-cadence; no checkpoint due |
| MC-0007 | STEP-0014 complete (feature #14) | Markdown Consistency | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-0007.md` | UI polish + website privacy scope synced; no drift |
| ENH-0002 | STEP-0014 complete (feature #14) | Enhancement | Done | `docs/enhancements/ENHANCEMENT_ENH-0002.md` | Accepted N1/N2/E7 (unify product header + ProductAvatar) as next UI packet; O1 email routing pre-launch; carried E1–E3 |
| MC-OD-0005 | On-demand (user wrap-up) | Markdown Consistency (on-demand) | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-OD-0005.md` | Repaired CHECKPOINTS ledger lag (MC-0007) + ran the due ENH-0002; owners in sync at v0.14.0. Does not reset cadence. |
| DISC-0005 | STEP-0015 complete (feature #15) | Discussion | Done | `docs/discussions/DISCUSSION_DISC-0005.md` | Reviewed STEP-0013→0015; no blocking findings; LEDGER-001 resolved; research item C deferred. |
| AUDIT-0003 | STEP-0015 complete (feature #15) | Audit | Done | `docs/audits/AUDIT_AUDIT-0003.md` | All areas Pass; F1 LEDGER-001 resolved; F2 promote a11y CI (LEDGER-002); F3 screenshots (C) noted. |
| MC-0008 | STEP-0016 complete (feature #16) | Markdown Consistency | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-0008.md` | Appeal/motion pass synced; no drift; scroll-reveal accessibility (reduced-motion + @supports) noted. |
| — | STEP-0017 complete (feature #17) | n/a | n/a | — | Off-cadence; no checkpoint due |
| DISC-0006 | STEP-0018 complete (feature #18) | Discussion | Done | `docs/discussions/DISCUSSION_DISC-0006.md` | Privacy-completeness additions reviewed; truthful, meets Apple 5.1.1; flagged operational pre-launch follow-ups. |
| MC-0009 | STEP-0018 complete (feature #18) | Markdown Consistency | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-0009.md` | Privacy additions synced; no drift; no overclaiming. |
| MC-OD-0006 | On-demand (user wrap-up) | Markdown Consistency (on-demand) | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-OD-0006.md` | v0.18.0 consistent; support-email LIVE recorded across owners; no drift. Does not reset cadence. |
| — | STEP-0019 complete (feature #19) | n/a | n/a | — | Off-cadence; no checkpoint due |
| AUDIT-0004 | STEP-0020 complete (feature #20) | Audit | Done | `docs/audits/AUDIT_AUDIT-0004.md` | All areas Pass; findings info-only (screenshots C, reply-from email, app-side submission items). |
| MC-0010 | STEP-0020 complete (feature #20) | Markdown Consistency | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-0010.md` | Clickable-icon affordance synced; component-reused; a11y preserved; no drift. |
| DISC-0007 | STEP-0021 complete (feature #21) | Discussion | Done | `docs/discussions/DISCUSSION_DISC-0007.md` | Code-review remediation reviewed; redundant-link pattern a11y-safe (gate green); no regression. |
| ENH-0003 | STEP-0021 complete (feature #21) | Enhancement | Done | `docs/enhancements/ENHANCEMENT_ENH-0003.md` | Re-triage: C (screenshots) top but asset-blocked; accepted N1 changelog + N5 Apple checklist; N2 reply-as pre-launch. |
| MC-0011 | STEP-0022 complete (feature #22) | Markdown Consistency | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-0011.md` | JSON-LD addition additive + truthful (no fabricated offers/price/rating); docs/tag/step agree; zero client JS; no drift. |
| MC-0012 | STEP-0024 complete (feature #24) | Markdown Consistency | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-0012.md` | v2 listing copy applied consistently from one content file; truthful (no blocking claim); docs/tag/step agree at v0.24.0; no drift. |
| DISC-0008 | STEP-0024 complete (feature #24) | Discussion | Done | `docs/discussions/DISCUSSION_DISC-0008.md` | Reviewed v0.22.0–v0.24.0 (JSON-LD, screenshots, listing copy); copy truthful + on the product page; third-party copy treated as content not instructions; no blockers. |
| AUDIT-0005 | STEP-0025 complete (feature #25) | Audit | Done | `docs/audits/AUDIT_AUDIT-0005.md` | Full-system integrity pass over v0.21.0–v0.25.0; all areas pass; centered layout balanced with no overflow; only info/low notes (sparse until more products, owner pre-submit actions, FAQPage JSON-LD). |
| MC-OD-0007 | On-demand (user wrap-up) | Markdown Consistency (on-demand) | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-OD-0007.md` | v0.21.0 consistent; code-review remediation recorded + gate-verified; no drift. Does not reset cadence. |
| MC-OD-0008 | On-demand (user wrap-up) | Markdown Consistency (on-demand) | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-OD-0008.md` | v0.22.0 consistent; JSON-LD/tag/step agree; tag on HEAD; repo clean + in sync; no drift. Does not reset cadence. |
| MC-OD-0009 | On-demand (user wrap-up) | Markdown Consistency (on-demand) | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-OD-0009.md` | Post-v0.25.0 screenshot-gallery + a11y fixes shipped to prod (metkapstudio.com) but `main` is 6 commits ahead of `v0.25.0` and **untagged**, under CHANGELOG `[Unreleased]`. Repaired stale "latest tag v0.21.0" line in STATUS → v0.25.0 and documented the ahead-of-tag state across owners. Gates green (build 8 / check 0-0-0 / 36 tests / validator 40-40); repo clean, merged, pushed. **Open decision:** cut v0.26.0 or fold into next packet. Does not reset cadence. |
| MC-0013 | STEP-0026 complete (feature #26) | Markdown Consistency | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-0013.md` | Scheduled cadence checkpoint for the resolved release. Cut **v0.26.0** for the gallery: formalized STEP-0026 (retroactive Task Card), finalized CHANGELOG `[Unreleased]`→`[0.26.0]`, tagged the release merge, synced STATUS/ROADMAP/CHECKPOINTS. Fixed stale "feature steps: 24" → 26. Confirmed `main` == `v0.26.0` (tag on HEAD), owners agree, no drift. Gates green (build 8 / check 0-0-0 / 36 tests / validator 40-40). |
| MC-OD-0010 | On-demand (user wrap-up) | Markdown Consistency (on-demand) | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-OD-0010.md` | Post-v0.26.0 wrap-up. Repaired lagging CHECKPOINTS "Counters"/"Due now" (feature Steps **25→26**, next step **0026→0027**, next-due recomputed, on-demand range **..0008→..0009**) that the STEP-0026/MC-0013 pass left un-synced; STATUS on-demand range → ..0010. All owners now agree at v0.26.0; gates green (build 8 / check 0-0-0 / 36 tests / validator 40-40); repo clean, merged, pushed. Does not reset cadence. |
| MC-OD-0011 | On-demand (user wrap-up) | Markdown Consistency (on-demand) | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-OD-0011.md` | Post-v0.26.1 wrap-up. All owners agree at **v0.26.1** (scrollbar-gutter fix) — no drift. The attempted "Format B" description redesign was **reverted while uncommitted** (never touched `main`/docs), so nothing to clean. Synced on-demand range → ..0011 and tightened STATUS "main == v0.26.1" → "product v0.26.1; HEAD carries post-release checkpoint docs". Gates green (build 8 / check 0-0-0 / 36 tests / validator 40-40); repo clean, merged, pushed. Does not reset cadence. |
| MC-OD-0012 | On-demand (user wrap-up) | Markdown Consistency (on-demand) | Done | `docs/markdown-consistency/MARKDOWN_CONSISTENCY_MC-OD-0012.md` | Post-v0.26.1 wrap-up. **No drift** — the intervening turn was advisory only (a performance/efficiency health check; no code or doc changes), so all owners still agree at v0.26.1. Confirmed gates green (build 8 / check 0-0-0 / 36 tests / validator 40-40) and repo clean/in-sync; bumped on-demand range → ..0012 and genericized the STATUS `head:` note. Logged health-check findings as non-governance follow-ups (asset cache TTL, security headers, CI Node-20, FAQPage JSON-LD). Does not reset cadence. |
| AUDIT-OD-0001 | On-demand (user request: full-scale system audit) | Audit (on-demand) | Done | `docs/audits/AUDIT_AUDIT-OD-0001.md` | All 12 areas **Pass**; zero drift. Fixed F1 (all six GitHub Actions bumped off deprecated-Node-20 majors — checkout v7, setup-node v6, setup-python v6, configure-pages v6, upload-pages-artifact v5, deploy-pages v5; latest majors verified live) and F2 (deploy timeout 1200000→600000 = action max; STATUS note corrected). F3/F4 (asset cache TTL, security headers) are **owner Cloudflare-dashboard actions**; F5 FAQPage JSON-LD carried as next-packet candidate. Perf measured excellent (1.3 MB dist, zero JS bundles, 2–5 KB HTML wire, ~0.25 s loads). Does not reset cadence. |

Immediate **event** review is required (regardless of cadence) for: profile/
overlay change, adding auth/payments/forms/analytics, public untrusted content,
new production platform, major dependency/engine change, or a security/data
incident. None have occurred.
