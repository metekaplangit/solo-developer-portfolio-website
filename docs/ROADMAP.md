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
- **STEP-0018 — Privacy policy completeness** *(COMPLETE — merged, tagged
  `v0.18.0`, 2026-07-03).* Added **Security / Children's privacy / Your rights /
  Changes** sections to every privacy policy (derived; "This website" vs "This
  app"; truthful to collects-nothing). Meets/exceeds Apple 5.1.1 content bar.
  From researching Flexibits' policy + Apple rejection criteria. **Discussion
  DISC-0006 + Markdown Consistency MC-0009** run (feature step #18). Operational
  pre-launch follow-ups (email routing, App-Privacy labels, privacy manifest)
  tracked in STATUS.
- **STEP-0019 — Premium craft polish** *(COMPLETE — merged, tagged `v0.19.0`,
  2026-07-03).* Tactile buttons (press + top-edge highlight + hover glow),
  animated content-link underlines, refined card-hover edge, `::selection` +
  custom scrollbar + smooth scroll, `text-wrap: balance`/`pretty` + `tabular-nums`,
  scroll-reveal on about/support/privacy. All CSS-only, zero-JS, reduced-motion-
  safe. From a lean study of Linear + micro-interaction best practices. No
  scheduled checkpoint at feature step #19.
- **STEP-0020 — Clickable product icons** *(COMPLETE — merged, tagged `v0.20.0`,
  2026-07-03).* Optional `href` on `ProductAvatar` makes a product's icon a link
  to that product (home spotlight, cards, privacy page); hover-lift + press +
  `Open <product>` a11y label; detail-page icon left unlinked (self page).
  **Audit AUDIT-0004 + Markdown Consistency MC-0010** run (feature step #20).
- **STEP-0021 — Code-review remediation** *(COMPLETE — merged, tagged `v0.21.0`,
  2026-07-03).* Resolved the two `/code-review` findings: the redundant icon link
  is made presentational (`tabindex=-1`+`aria-hidden`) where it duplicates an
  adjacent link (mouse-clickable preserved; privacy icon stays primary); the
  `ProductAvatar` markup was de-duplicated (dynamic `<Wrapper>`). Verified
  a11y-safe via the Lighthouse CI gate (PR #2). **Discussion DISC-0007 +
  Enhancement ENH-0003** run (feature step #21).
- **STEP-0022 — Structured data (SEO/AEO JSON-LD)** *(COMPLETE — merged, tagged
  `v0.22.0`, 2026-07-03).* Closed the only FAIL from the SEO/AEO audit: added
  Schema.org JSON-LD via new `src/lib/schema.ts` builders + an injection-safe
  `JsonLd.astro`, wired through an optional `schema` prop on `BaseLayout`.
  Home = `Organization`+`WebSite`; `/apps/` = `ItemList`+`BreadcrumbList`; each
  product = `SoftwareApplication`|`VideoGame`+`BreadcrumbList`. Graphs kept
  truthful (no offers/price/rating for the unreleased app); zero client JS.
  **Markdown Consistency MC-0011** run (feature step #22).
- **STEP-0023 — Real Sole Focus screenshots** *(COMPLETE — merged, tagged
  `v0.23.0`, 2026-07-07).* Closed **research item C** (the biggest visual lever,
  blocked on assets until the user supplied them). Five 2880×1800 marketing
  screenshots now lead the site: a full-width `ScreenshotShowcase` gallery on the
  detail page and the lead shot in the homepage spotlight. Optimized at build via
  `astro:assets` (14 MB PNG → ~900 KB responsive WebP; no PNG shipped); driven
  from product content via `resolveScreenshot`; zero client JS. No scheduled
  checkpoint at feature step #23.
- **STEP-0024 — Store-listing copy (v2 pack)** *(COMPLETE — merged, tagged
  `v0.24.0`, 2026-07-07).* Applied the reviewed, competitor/ASO-grounded v2 copy
  pack to the Sole Focus page: new summary, sharper feature highlights, refreshed
  SEO title/description, and a description split into scannable sections
  (Two ways to work · Calm, and always in reach · See your progress · Private,
  offline, yours) plus a short FAQ. Truthful throughout — no blocking claim;
  privacy stated exactly. One content file feeds every surface + JSON-LD.
  **Markdown Consistency MC-0012 + Discussion DISC-0008** run (feature step #24).
- **STEP-0025 — Centered layout (system-wide alignment)** *(COMPLETE — merged,
  tagged `v0.25.0`, 2026-07-07).* Fixed the site-wide "pushed to the left"
  imbalance. Presented three mockup directions (A centered column · B tighter
  shell · C centered-symmetric); user chose **A**. Centered every reading column
  (`margin-inline: auto`) and made card grids center under their centered headers
  (`auto-fit` + capped width + centered tracks). CSS-only, zero JS, no overflow;
  convention documented at the `--maxw-prose` token. **Audit AUDIT-0005** run
  (feature step #25) as the full-system integrity pass — all areas pass.
- **STEP-0026 — Swipeable product screenshot gallery** *(COMPLETE — merged,
  tagged `v0.26.0`, 2026-07-07).* Rebuilt `ScreenshotShowcase.astro` from a
  vertical stack into a single-image gallery (CSS scroll-snap track + a small
  progressive-enhancement script): one large screenshot at a time (size
  unchanged), left/right arrows + dots + native swipe + keyboard ←/→ + live
  counter; compact regardless of shot count; honors `prefers-reduced-motion`.
  Bigger accent-styled arrows/dots per user follow-up. Fixed three carousel a11y
  violations (`aria-hidden-focus`, `aria-required-children`,
  `scrollable-region-focusable`) so the Lighthouse a11y gate (≥0.95) stays green;
  verified axe-clean. Shipped across three merges (feature + two a11y fixes),
  formalized as this packet. **Markdown Consistency MC-0013** run (feature step
  #26). *(Structure note: shipped under a "deploy if you can" instruction, not a
  pre-frozen packet; STEP-0026 formalizes it retroactively.)*

## Backlog — accepted enhancements (from ENH-0001 / ENH-0002 / ENH-0003)

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
