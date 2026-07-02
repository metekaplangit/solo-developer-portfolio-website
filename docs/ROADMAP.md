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

### Milestone 1 — Content model + static shell ✅ DONE (v0.1.0)

- **STEP-0001 — Content model + static shell** *(COMPLETE — merged, tagged `v0.1.0`, 2026-07-02)*
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

### Milestone 2 — Premium minimal showcase ✅ core DONE (v0.2.0)

- **STEP-0002 — Product detail page pattern** *(COMPLETE — merged, tagged `v0.2.0`,
  2026-07-02)*. Delivered `/apps/<slug>/` detail pages, card→detail links,
  related products, per-product SEO. Markdown Consistency **MC-0001** run (no drift).
- *Visual polish now lives in the UI/Design phase below* (site-wide theme, real
  image-optimization pipeline, richer social cards).

### Milestone 3 — Core site essentials ✅ DONE (v0.3.0)

- **STEP-0003 — Core site essentials** *(COMPLETE — merged, tagged `v0.3.0`,
  2026-07-02).* Custom 404, `robots.txt`, auto sitemap, favicon; CI now runs
  `npm test`. Discussion **DISC-0001** run (fixed CI test gap; logged monogram
  duplication as LEDGER-001).
- *Store-support page content polish* (per-product privacy prose, support/about
  refinement) folds into product-content work, deferred per user steer.

### Milestone 4 — GitHub Pages deployment ✅ DONE (v0.4.0)

- **STEP-0004 — GitHub Pages deployment (project site)** *(COMPLETE — merged,
  tagged `v0.4.0`, live, 2026-07-02).* Base-path config + `withBase()` links,
  `deploy.yml` (Actions→Pages), Pages enabled. **Custom domain deferred** to the
  end of the project per user decision. Markdown Consistency **MC-0002** run.

### Phase: UI / Design (dark-premium Apple-minimal) *(active — next steps)*

UI-only phase. Allowed: visual system, tokens, layout, motion, accessibility.
**Forbidden without a separate packet:** product/data/schema/logic changes.

- **STEP-0005 — Design system + home** *(COMPLETE — merged, tagged `v0.5.0`,
  2026-07-02).* "Light dark" graphite tokens, SF Pro scale, restrained accent,
  soft depth + translucent sticky header, tasteful motion, buttons, elevated
  cards, cinematic home. **Audit AUDIT-0001** run (feature step #5; all Pass).
- **STEP-0006 — Rebrand to MetKap Studio** *(COMPLETE — merged, tagged `v0.6.0`,
  2026-07-02).* Brand = "MetKap Studio" (wordmark/title/hero/footer/SEO) via
  `site.ts`; About attributes the studio to Mete Kaplan. Checkpoints **MC-0003 +
  DISC-0002** run (feature step #6). *Reorder note:* the rebrand was inserted at
  the user's request ahead of the theme rollout, which moved from STEP-0006 →
  STEP-0007 (no completed IDs renumbered).
- **STEP-0007 — Theme rollout to remaining pages** *(COMPLETE — merged, tagged
  `v0.7.0`, 2026-07-02).* Shared `PageHeader`; polished catalog, detail (button
  CTAs, panel header, gradient screenshots), privacy article panel, support
  (email as primary button), about. **Enhancement ENH-0001** run (feature step
  #7) — accepted E1/E2 to backlog. The UI/Design phase is effectively complete.

### Milestone 5 — Custom domain (metkapstudio.com) ✅ code DONE (v0.8.0)

- **STEP-0008 — Custom domain** *(COMPLETE code/GitHub side — merged, tagged
  `v0.8.0`, 2026-07-02).* `site` → metkapstudio.com, `base` → `/`, `public/CNAME`,
  robots/sitemap domain, `support@metkapstudio.com`, Pages custom domain set.
  Markdown Consistency **MC-0004** run. **Release-critical live-HTTPS is BLOCKED**
  pending user-side Cloudflare DNS + GitHub cert (records + steps in
  `DEPLOYMENT.md`).
- **Follow-up (small):** once DNS resolves — enable Enforce HTTPS, verify
  `metkapstudio.com` 200 + `www`→apex, GitHub domain verification, Cloudflare
  Email Routing for `support@`, DNSSEC.

## Backlog — accepted enhancements (from ENH-0001)

Not scheduled yet; promote to a Step Packet when triggered.

- **Real image-optimization pipeline** (`astro:assets` `<Image>`) consuming the
  existing `MediaAsset` schema — do when real screenshots/icons exist (E1).
- **Automated accessibility / Lighthouse CI** on built pages — ties off
  LEDGER-002 (E2).
- Later/parked: per-page OG images (E3), View Transitions (E4), light theme +
  toggle (E5), press-kit/devlog (E6). See `docs/enhancements/ENHANCEMENT_ENH-0001.md`.

## Planning rules

Append-only Step identity/order. One active packet. Ad hoc fixes/audits/refactors
are normal packets and cannot bypass governance. Satisfy the REFACTORING
consolidation cadence before opening each new feature packet.
