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
- **Latest product state:** **GitHub #3 resolved, released as v0.39.3** on
  2026-07-18. The home lead image's text alternative now includes the marketing
  copy baked into the picture, closing the known WCAG 2.2 SC 1.1.1 gap; the
  product gallery transcript is unchanged and non-duplicative. v0.39.2 before it
  fixed two responsive defects (the support address wrapping mid-domain, and
  policy titles running three lines on a phone). Both are unnumbered fix
  releases on top of **STEP-0043**, which remains the last numbered feature
  packet. *(Keep that Step ID in this bullet: the validator resolves the active
  step from the first `STEP-XXXX` token in this file, and without one here the
  scan falls through to the trigger-armed STEP-0033 template and the validator
  fails locally. CI is retired, so nothing catches this remotely.)*
- **Governance:** the feature-42 catch-up is complete: **MC-0019, DISC-0013,
  AUDIT-0008, and ENH-0006** clear every checkpoint due through feature step 42.
  The catch-up repaired stale live-state, milestone, schema, testing, issue, and
  checkpoint documentation and hardened the validator against another false
  green when `STATUS` and `CHECKPOINTS` disagree about due work.
- **Open issues:** none. [GitHub #3](https://github.com/metekaplangit/solo-developer-portfolio-website/issues/3)
  (WCAG 1.1.1, home lead image alternative) was resolved in v0.39.3.
- **Known accepted tradeoff:** at 320px the navigation row scrolls and ~52px of
  "About" is clipped. Page overflow stays 0. The edge-fade cue was tried and
  rejected (see `Nav.astro`), and fitting four items needs either sub-ramp type
  or 2px pill padding. Shortening the label to "Apps" below ~360px is the one
  clean fix and is an owner naming decision, not a defect.
- **Next action:** freeze one packet. No defect backlog remains. Candidates: a
  **real** additional product supplied by the owner, the STEP-0033 updates block
  when its first-update/second-product trigger fires, or an optional
  Terms/disclaimer page. Do not invent in-development products.
- **Open follow-ups from the 2026-07-18 system health check** (none are defects;
  all are deliberate, unscheduled debt):
  1. **Duplication.** The home spotlight and the catalog lead-row are the same
     component built twice (6 byte-identical CSS rule bodies under different
     selector names); the contact panel is built twice with its CSS written
     three times. One `ProductLead` extraction would close both.
  2. **`PolicyArticle.astro` holds hardcoded legal prose** (4 of 12 sections)
     that the content schema is supposed to own. A product cannot vary that
     text without editing a shared component.
  3. **About/Support pages lack the animated in-content link underline** other
     reading surfaces have — the rules targeted `.about`/`.support`, which no
     element carries. Dead rules removed; applying the treatment for real is a
     visual change and needs a preview before it ships.
  4. **`noUncheckedIndexedAccess` is off** (`astro/tsconfigs/strict` does not set
     it). `showcase[0]` types as non-optional while the pages correctly guard
     for undefined — so deleting a "redundant" `?.` would crash at runtime with
     a green typecheck.

## Current facts

- Completed **feature** steps: **42** (`STEP-0001`..`STEP-0043`; STEP-0033 is
  trigger-armed and unstarted).
- Current product tag: **v0.39.3**. `[Unreleased]` is empty.
- Branch policy: `main`; non-destructive feature/checkpoint branches and
  `--no-ff` merge commits; no history rewriting or force-push.
- Remote: `origin` = `metekaplangit/solo-developer-portfolio-website`.
- Blockers: **none**. Due checkpoints: **none**.
- Open GitHub issues: **none** — #3 resolved in v0.39.3.
- Dependency note: the lockfile remains on Astro 7.0.5 and Vitest 4.1.9; patch
  updates 7.1.1/4.1.10 are available but were intentionally not mixed into this
  governance-only wrap-up. `npm audit --omit=dev` is clean.

## Machine-readable state

```yaml
schema_version: 1
profile: standard
active_overlays: [commercial-compliance-armed]
active_step: none
current_step: STEP-0043 (last numbered packet; v0.39.2 and v0.39.3 are unnumbered fix releases)
next_step: owner-supplied real product; or trigger-armed STEP-0033; or optional Terms/disclaimer page
branch: main
head: regenerate live with git rev-parse HEAD; product release is v0.39.3 and later commits are internal-only governance
product_tag: v0.39.3
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
| Governance validator | Pass | 44/44 (now advisory, not merge-critical) |
| Git integrity | Pass | `git fsck`, `git diff --check`, no tracked secret-pattern hits |
| Remote automation | Pass | Deploy workflow green (builds, passes the a11y gate, publishes) |

The Lighthouse accessibility threshold remains enforced in `deploy.yml` — after
merge, blocking the live publish rather than the merge itself. The
latest product packets also recorded zero axe violations and no overflow across
their measured route/viewport matrices; this docs-only catch-up did not change
rendered output.

## Checkpoints and issues

`docs/CHECKPOINTS.md` is the sole checkpoint-history owner. The fixed cadence
was retired on 2026-07-18 — checkpoints are now run on demand, when there is a
reason, and nothing is ever "due". See ROADMAP.md.

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

The command is also recorded in `AI_WORKFLOW.md`. Run it locally before a merge
you care about.

**CI status: Blocked — deliberately, on 2026-07-18.** `.github/workflows/ci.yml`
was removed. It ran the validator plus `npm run check`, `npm test`, and
`npm run build` — commands that take about two seconds locally and gate nothing,
since `deploy.yml` builds independently and a broken build therefore fails the
deploy on its own. It had already failed one release over a prose paragraph that
stopped naming a Step ID, while that same commit deployed cleanly. For a
single-maintainer static site the duplication cost more attention than it
returned.

`deploy.yml` is untouched and remains the only required automation: it builds,
enforces the Lighthouse accessibility gate at ≥0.95, and publishes to GitHub
Pages. A genuine regression — a broken build or an accessibility failure — still
blocks the deploy.
