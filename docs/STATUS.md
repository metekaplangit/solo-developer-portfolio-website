# Status — Live Snapshot

> **Purpose:** Live project state and the exact next action. The single entry point.
> **Read when:** Every session, first.
> **Update when:** After every Step/checkpoint or any blocker/Git change (overwrite).
> **Synchronize with:** ROADMAP.md, CHECKPOINTS.md, VERSION_CONTROL.md, CHANGELOG.md, ISSUE_TRACKING.md.
> **Status:** Active.
> **Activation:** Standard profile + commercial/compliance overlay armed (privacy/store pages).

## Handoff

- **Product:** MetKap Studio portfolio and store-support site, live at
  **https://metkapstudio.com/** over HTTPS. Static Astro output is hosted by
  GitHub Pages behind the Cloudflare proxy. Sole Focus is live on the Mac App
  Store; the support mailbox and published privacy pages are operational.
- **Latest product state:** **Responsive touch-up packet complete, released as
  v0.39.2** on 2026-07-18. The support address now holds one line on a phone
  (it was breaking between `.co` and `m` at 320px) and policy titles scale down
  on narrow screens (three lines and 139px of header became two lines and 59px
  at 390px). Desktop rendering is unchanged. STEP-0043 before it quieted the
  home maker note; STEP-0042 consolidated the shared card/row system.
- **Governance:** the feature-42 catch-up is complete: **MC-0019, DISC-0013,
  AUDIT-0008, and ENH-0006** clear every checkpoint due through feature step 42.
  The catch-up repaired stale live-state, milestone, schema, testing, issue, and
  checkpoint documentation and hardened the validator against another false
  green when `STATUS` and `CHECKPOINTS` disagree about due work.
- **Open issue:** [GitHub #3](https://github.com/metekaplangit/solo-developer-portfolio-website/issues/3)
  tracks the known WCAG 1.1.1 gap: the home lead image alternative omits
  meaningful marketing copy baked into that image. It is not release-blocking,
  but is the recommended next small fix packet.
- **Next action:** freeze one packet. Recommended: resolve **#3**. Product-growth
  alternatives are another **real** product supplied by the owner, the
  STEP-0033 updates block when its first-update/second-product trigger fires, or
  an optional Terms/disclaimer page. Do not invent in-development products.

## Current facts

- Completed **feature** steps: **42** (`STEP-0001`..`STEP-0043`; STEP-0033 is
  trigger-armed and unstarted).
- Current product tag: **v0.39.2**. `[Unreleased]` is empty.
- Branch policy: `main`; non-destructive feature/checkpoint branches and
  `--no-ff` merge commits; no history rewriting or force-push.
- Remote: `origin` = `metekaplangit/solo-developer-portfolio-website`.
- Blockers: **none**. Due checkpoints: **none**.
- Open GitHub issues: **#3 only** as of the 2026-07-18 wrap-up.
- Dependency note: the lockfile remains on Astro 7.0.5 and Vitest 4.1.9; patch
  updates 7.1.1/4.1.10 are available but were intentionally not mixed into this
  governance-only wrap-up. `npm audit --omit=dev` is clean.

## Machine-readable state

```yaml
schema_version: 1
profile: standard
active_overlays: [commercial-compliance-armed]
active_step: none
current_step: responsive-touchups (post STEP-0043)
next_step: fix GitHub issue #3; or owner-supplied real product; or trigger-armed STEP-0033
branch: main
head: regenerate live with git rev-parse HEAD; product release is v0.39.2 and later commits are internal-only governance
product_tag: v0.39.2
live_url: https://metkapstudio.com/ (live, HTTPS enforced)
brand: MetKap Studio
domain: metkapstudio.com (live; Cloudflare proxy; https_enforced: true)
dirty: false
dirty_paths: []
remote_sync: origin (github.com/metekaplangit/solo-developer-portfolio-website)
due_checkpoints: none
blockers: none
required_reads: [STATUS.md, ROADMAP.md, CHECKPOINTS.md, SECURITY.md, DATA_STORAGE.md]
required_checks: [npm run build, npm run check, npm test, scripts/validate-governance.py]
calibration: completed
updated_at: 2026-07-18
```

Live commands override this snapshot. At startup regenerate branch/HEAD/dirty
state with `git status --porcelain --branch` and `git rev-parse HEAD`.

## Verified wrap-up gates (2026-07-18)

| Gate | Result | Evidence |
|---|---|---|
| Static build | Pass | `npm run build`: static output, 8 routes |
| Type/content check | Pass | `npm run check`: 0 errors, 0 warnings, 0 hints |
| Unit tests | Pass | `npm test`: 45/45 |
| Production dependency audit | Pass | `npm audit --omit=dev`: 0 vulnerabilities |
| Governance validator | Pass | 44/44 after cadence-agreement hardening |
| Git integrity | Pass | `git fsck`, `git diff --check`, no tracked secret-pattern hits |
| Remote automation | Pass | latest `main` CI run green; product-release deploy green |

The Lighthouse accessibility threshold remains enforced in CI/deploy. The
latest product packets also recorded zero axe violations and no overflow across
their measured route/viewport matrices; this docs-only catch-up did not change
rendered output.

## Checkpoints and issues

`docs/CHECKPOINTS.md` is the sole checkpoint-history owner. Next cadence after
this catch-up: Markdown Consistency at feature **44**, Discussion and Audit at
**45**, Enhancement at **49**. On-demand runs do not reset cadence.

GitHub Issues is the active issue owner. `docs/issues/LEDGER.md` is read-only
pre-remote history; LEDGER-001 and LEDGER-002 are resolved.

## Operating boundaries

- Keep Astro `output: 'static'`; no backend, database, serverless runtime,
  analytics, forms, accounts, or third-party runtime services.
- Product facts and privacy claims come from typed `src/content/` files. Keep
  store price/status, policy text, and JSON-LD truthful as the listing evolves;
  never fabricate ratings or products.
- App codebases supplied beside this repo are read-only sources of truth. Never
  modify them while working on the website.
- Freeze one Task Card before product work and stop at its acceptance boundary.

## Governance validator

```sh
python3 scripts/validate-governance.py
```

The command is also recorded in `AI_WORKFLOW.md` and run by CI.
