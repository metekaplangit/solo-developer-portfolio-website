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
- **DONE (2026-07-02):** DNS live, cert approved, **Enforce HTTPS on**,
  `https://metkapstudio.com` 200 + `www`→apex verified. Domain fully live/secure.
- **Optional user extras (not blocking):** Cloudflare Email Routing for
  `support@metkapstudio.com`, DNSSEC, GitHub domain verification.

### Milestone 6 — App Store review readiness ✅ DONE (v0.9.0)

- **STEP-0009 — App Store review readiness** *(COMPLETE — merged, tagged
  `v0.9.0`, 2026-07-02).* Privacy pages present Apple Guideline 5.1.1(i) as
  labeled sections (collect / use / third-party equal-protection + no-AI /
  retention+deletion / contact); schema **requires** the retention/deletion
  statement; support response line (1.5); corrected support email in policies;
  SECURITY.md developer-responsibility + not-legal-advice note. Discussion
  **DISC-0003** run (feature step #9).
- **Developer responsibility (ongoing, per real app):** keep each policy
  truthful, set `hasAccounts: true` + in-app deletion when accounts exist, enable
  Cloudflare Email Routing, disclose third-party AI, get human/legal review. See
  `SECURITY.md`.

### Milestone 7 — Real products ▶ in progress

- **STEP-0010 — Sole Focus (first real product)** *(COMPLETE — merged, tagged
  `v0.10.0`, 2026-07-02).* Published Sole Focus (calm local-first Pomodoro +
  stopwatch for macOS, in development) with an accurate review-ready privacy
  policy and its real icon; retired the 3 placeholder demo products. Learned from
  the read-only `../PromodoApp/` codebase. **Audit AUDIT-0002 + Markdown
  Consistency MC-0005** run (feature step #10).
- **Next real-product packets:** one per app the user supplies (each folder is
  read-only). Add screenshots + Mac App Store link for Sole Focus once published.
- **STEP-0011 — Studio Gem brand logo** *(COMPLETE — merged, tagged `v0.11.0`,
  2026-07-02).* Installed the studio favicon + PWA icon set + web manifest + OG
  image + nav logo mark from the user's icon-generator export v0001. No scheduled
  checkpoint at feature step #11.
- **STEP-0012 — Privacy readability redesign** *(COMPLETE — merged, tagged
  `v0.12.0`, 2026-07-02).* Rebuilt `PolicyArticle` (at-a-glance chips + separated
  headlined sections + bullets); added `storedLocally`/`permissions`; tightened
  policy content. Full Apple 5.1.1(i) preserved. **Discussion DISC-0004 +
  Markdown Consistency MC-0006** run (feature step #12).
- **STEP-0013 — Privacy app icon + current Sole Focus icon** *(COMPLETE —
  merged, tagged `v0.13.0`, 2026-07-02).* Added an optional app-icon tile to the
  privacy page header (resolved by `productId`); replaced the Sole Focus icon
  with the app's current SVG export, shared with the home card. No scheduled
  checkpoint at feature step #13.
- **STEP-0014 — UI polish + website privacy scope** *(COMPLETE — merged, tagged
  `v0.14.0`, 2026-07-02).* Shared `--maxw-prose` column across content pages
  (consistent alignment, no overflow desktop/mobile); unified the product icon
  across detail + privacy; fixed the `·Support` separator; retitled the main
  privacy page "MetKap Studio Website Privacy Policy" with an explicit
  website-vs-apps opening. **Markdown Consistency MC-0007** run (feature step #14).
- **STEP-0015 — Research-driven UI polish + a11y fix** *(COMPLETE — merged, tagged
  `v0.15.0`, 2026-07-03).* Applied salvaged deep-research findings: new shared
  `ProductAvatar` (card/detail/privacy — resolves LEDGER-001); WCAG-AA `--faint`
  contrast fix; reading column tightened to 40rem; dropped stacked card borders.
  Research item **C (hero/detail product screenshots) deferred** — needs assets.
  **Discussion DISC-0005 + Audit AUDIT-0003** run at feature step #15.
- **STEP-0016 — Appeal & motion (tasteful)** *(COMPLETE — merged, tagged
  `v0.16.0`, 2026-07-03).* From a lean study of top App Store creator sites
  (Things, Raycast): home **featured product spotlight**, app-page **feature
  grid**, CSS-only **scroll-reveal** motion (reduced-motion + `@supports` guarded,
  zero JS). Kept honest — no fabricated badges/press/testimonials/screenshots.
  **Markdown Consistency MC-0008** run (feature step #16). Research item **C
  (real screenshots + device mockups) still deferred** — needs assets.
- **STEP-0017 — Automated accessibility gate (Lighthouse CI)** *(COMPLETE —
  merged, tagged `v0.17.0`, 2026-07-03).* `@lhci/cli` + `lighthouserc.json`
  (accessibility ≥0.95 as error; perf/SEO/best-practices warn); `accessibility`
  job in CI + a11y gate in the deploy before publish. **Resolves LEDGER-002.**
  Also fixed the validator's detached-HEAD blindspot in CI. Verified green in
  real CI (PR #1). No scheduled checkpoint at feature step #17.

## Backlog — accepted enhancements (from ENH-0001 / ENH-0002)

Not scheduled yet; promote to a Step Packet when triggered.

- **Unify the product header + `ProductAvatar`** (ENH-0002 N1/N2/E7): one lockup
  (icon-or-monogram + name/title) shared by the card, detail, and privacy pages;
  standardize page-top vertical rhythm. Resolves LEDGER-001 (now ripe). Strong
  next UI packet.
- **Home hero treatment** (ENH-0002 N3) + on-site **changelog/updates block**
  (C1) — polish follow-ups.
- **Real image-optimization pipeline** (`astro:assets` `<Image>`) consuming the
  existing `MediaAsset` schema — do when real screenshots/icons exist (E1).
- **Automated accessibility / Lighthouse CI** on built pages — ties off
  LEDGER-002 (E2).
- **Pre-launch (user-run):** Cloudflare **Email Routing** so
  `support@metkapstudio.com` receives mail — before Sole Focus ships (ENH-0002 O1).
- Later/parked: per-page OG images (E3), View Transitions (E4), light theme +
  toggle (E5), press-kit/devlog (E6). See `ENHANCEMENT_ENH-0001.md` / `ENH-0002.md`.

## Planning rules

Append-only Step identity/order. One active packet. Ad hoc fixes/audits/refactors
are normal packets and cannot bypass governance. Satisfy the REFACTORING
consolidation cadence before opening each new feature packet.
