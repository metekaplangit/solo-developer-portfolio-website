# Roadmap

> **Purpose:** Ordered Step Packets, the one Standard Workflow, checkpoint cadence, and acceptance boundaries.
> **Read when:** Selecting or planning the next step; every session.
> **Update when:** Steps, priorities, checkpoints, phases, or critical fixes change.
> **Synchronize with:** STATUS.md, CHECKPOINTS.md, VERSION_CONTROL.md, CHANGELOG.md.
> **Status:** Active.
> **Activation:** Standard profile.

## Checkpoint cadence (by completed feature Steps)

Markdown Consistency every **2**, Discussion every **3**, Audit every **5**,
Enhancement every **7**. Event/on-demand runs do not reset cadence.
`CHECKPOINTS.md` is the ledger; this file is the schedule.

## The one Standard Workflow

1. Confirm calibration resolved; read STATUS, ROADMAP, CHECKPOINTS, current
   owners (+ EXTERNAL_EDITOR when applicable).
2. Inspect files/worktree, profile/overlays, issues, Hotspot/Debt Watch, due
   checkpoints.
3. Select **one** Step Packet; research consequential uncertainty; freeze or
   split scope; branch from current `main`.
4. Implement only that outcome + required support; add risk-based tests +
   usability hooks.
5. Debug via escalation: ≤2 blind fixes, then official sources, then instrument
   the real build and read logs.
6. Run applicable checks + primary scenario; review scope, architecture,
   security/data, compatibility, debt.
7. Triage every finding; run due checkpoints; run governance validation.
8. Update canonical docs, STATUS, CHECKPOINTS, and Unreleased once; merge only
   after merge-critical Pass (merge commit).
9. Verify/close issues. For versionable work: pass version gates, finalize
   changelog, tag the merge commit, push when authorized. Internal work gets no
   tag. Deploy only via separate deployment gates.
10. Present outcome/evidence/risks/next packet; stop at acceptance unless bounded
    continuation was authorized.

## Milestones & Step Packets

### Milestone 0 — Initialization (this baseline)
Docs system, Git baseline, validator, workflow seeds, issue templates, CI,
remote. **Internal-only** (no product tag). Ends by stopping before Step 1.

### Milestone 1 — Content model + static shell

- **STEP-0001 — Content model + static shell** *(active/next; versionable → target `v0.1.0`)*
  - **Outcome:** typed content collections (Product, StoreLink,
    PrivacyPolicyEntry, MediaAsset) with Zod schemas, a base layout + nav +
    footer, and generated routes for home, catalog, privacy, support/contact,
    about rendering from sample content; Vitest added with schema + `lib` units.
  - **Acceptance:** invalid content fails the build; required routes exist and
    render from content files; `npm run build`, `npm run check`, `npm test`, and
    the governance validator pass; no backend introduced.
  - **Non-goals:** premium visual polish (M2), real product copy, deployment (M4),
    per-product privacy prose beyond samples.
  - **Evidence method:** command/log artifact + automated test.
  - **Proof classification:** machine-verifiable.
  - **Files:** `src/content.config.ts`, `src/content/**`, `src/layouts/**`,
    `src/components/**`, `src/pages/**`, `src/lib/**`, `vitest.config.ts`, tests.
  - **Checkpoint triggers:** completing STEP-0001 is feature-step #1 → Markdown
    Consistency becomes due after step #2.
  - **Rollback:** revert the feature merge commit; branch from baseline tag.

### Milestone 2 — Premium minimal showcase
Home, catalog, product-detail pattern, responsive cards, media handling, SEO/
social metadata. Accessibility checks merge-critical. (Steps enumerated when M1
completes.)

### Milestone 3 — Store-support pages
Global privacy page, per-product privacy routes, support/contact, about, footer
links. No placeholder legal text in release content. Commercial/compliance
overlay controls active.

### Milestone 4 — GitHub Pages deployment proof
Pages Actions workflow, custom-domain + Cloudflare DNS notes, HTTPS verification,
deploy smoke, rollback notes. Release-critical gates apply.

## Planning rules

Append-only Step identity/order. One active packet. Ad hoc fixes/audits/refactors
are normal packets and cannot bypass governance. Satisfy the REFACTORING
consolidation cadence before opening each new feature packet.
