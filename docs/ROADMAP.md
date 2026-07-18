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
- **STEP-0027 — Release pass: Sole Focus LIVE on the Mac App Store** *(COMPLETE —
  merged, tagged `v0.27.0`, 2026-07-15).* The app shipped:
  https://apps.apple.com/us/app/sole-focus-pomodoro-timer/id6788789811?mt=12
  (listing verified: "Sole Focus: Pomodoro Timer", seller Mete Kaplan, Mac,
  Free). Wired the verified URL as the primary **Mac App Store** download button
  in "Get it" (+ catalog card link); flipped `status: released` site-wide from
  the single content file (badges, home "shipped" counter); added a truthful
  `offers` JSON-LD block (price 0 USD, InStock, store URL) gated on
  released+price+available-link via a new optional `price` content field — the
  release pass deferred in `lib/schema.ts`; removed "coming soon" copy; recorded
  `releaseDate` 2026-07-15; added 2 release-state content tests (38 total).
  **Discussion DISC-0009** run (feature step #27).
- **STEP-0028 — Top-of-page download buttons** *(COMPLETE — merged, tagged
  `v0.28.0`, 2026-07-15).* User request: the sole download CTA sat at the bottom
  of the product page. Added a reusable `DownloadButton.astro` (Apple mark +
  "Download on the Mac App Store", accent primary, aria-label includes product;
  md/sm sizes; renders nothing without an available link) and placed it
  top-of-page everywhere relevant: home hero (leading action, with
  "See apps & games" falling back to primary when no download exists), home
  spotlight, product detail header, catalog card. Bottom "Get it" retained.
  Verified on all three surfaces in preview + live. **MC-0014 + ENH-0004** run
  (feature step #28).

- **STEP-0029 — Small-screen usability (review-0001 remediation)** *(COMPLETE —
  merged, tagged `v0.29.0`, 2026-07-17).* Adopted external design review
  findings OPP-01 + OPP-08 (`project-designer` review-0001): narrow-screen
  header = brand row + single horizontally scrollable nav row with right-edge
  fade (zero-JS; measured 146px → 94px at 390px; no overflow at 390/320); nav
  links + gallery dots get ≥44px hit areas on coarse pointers with visual size
  unchanged. Declined OPP-02 (CTA repetition is deliberate user intent);
  deferred OPP-03/05/06 (taste-sensitive; preview-first).
- **STEP-0030 — Purchase-decision info (review-0001 remediation)** *(COMPLETE —
  merged, tagged `v0.30.0`, 2026-07-17).* Adopted OPP-04 + OPP-07: human
  platform labels from one shared map (badges + JSON-LD `operatingSystem`);
  verified "Requires macOS 10.15 or later" line beside the header download
  button (new optional `requirements` content field); truthful maker/support
  trust line ("Made by Mete Kaplan · direct support, usually replies in 2–3
  business days") linking About/Support. 2 new tests (40 total).
  **AUDIT-0006 + DISC-0010 + MC-0015** run (feature step #30).

- **STEP-0031 — First-glance facts** *(COMPLETE — merged, tagged `v0.31.0`,
  2026-07-17).* Adopted design-review-0002 COMP-01 + USER-02 (high-confidence:
  explicit price before store click-through) + USER-05 + USER-04: one reusable
  `FactsLine.astro` (price/requirements/privacyFacts from structured content,
  renders nothing when absent) under the download CTA on the product header and
  home spotlight; spotlight gained the maker/support trust line; middot-spacing
  fix in trust lines. New optional `privacyFacts` schema field; content test
  pins it (41 tests).

- **STEP-0032 — Screenshot transcript** *(COMPLETE — merged, tagged `v0.32.0`,
  2026-07-17).* Adopted review-0002 AI-07: native `<details>` "Screenshot
  transcript" below the gallery listing every shot as a humanized title
  (`screenshotTitle()` from the filename, unit-tested) + its alt-text
  description; zero JS; gallery untouched. **MC-0016** run (feature step #32).

- **STEP-0034 + STEP-0035 — Taste-round T2 + T5** *(COMPLETE — merged, released
  together as `v0.33.0`, 2026-07-17).* User-approved from the rendered taste
  round: `FitStatement.astro` ("For you if / Not for you if", detail body) and
  `MakerNote.astro` (accent-bordered first-person note opening the description,
  signed from `site.person`). Copy pinned by content tests. Includes the
  FactsLine overflow fix. **DISC-0011**(33) + **MC-0017**(34) run. Taste-round
  outcome: T2/T5 shipped; **T1 (workflow strip) + T3 (captions) declined** this
  round; **T4 (shorter reading path) closed unless the user reopens it**.

- **STEP-0036 — Wider, image-forward redesign** *(COMPLETE — merged, tagged
  `v0.34.0`, 2026-07-17).* User-directed: the site read too narrow/cramped with
  text stacking vertically. Widened the shell (`--maxw` 68→78rem) and reading
  columns (`--maxw-prose` 40→43rem); rebuilt the home featured panel to be
  image-dominant (screenshot column 1.45fr vs 0.85fr text) with the bullet-
  highlight stack removed and more padding; widened the product gallery to
  72rem (matched `sizes`). Presentation-only, zero JS; no overflow at
  1440/960/390. Rival benchmark: Panic/Rogue Amoeba/Things/Raycast (wide,
  big-imagery, minimal-text). **AUDIT-0007 + ENH-0005** run (feature #35).

- **STEP-0037 — Alignment & polish pass** *(COMPLETE — merged, tagged
  `v0.35.0`, 2026-07-17).* User-directed follow-on to STEP-0036: mismatched
  button sizes and ragged text. Fix at the system level — one shared `.btn`
  height (48px; featured CTA 56/49/49 → 48/48/48), download leads via
  fill/width/glyph; widened featured text column (0.85→1fr) so the lede wraps
  3 not 4 lines and the trust line fits one row; `FactsLine` refactored to break
  only between facts. Overflow-swept all 7 routes at 390/1280. **MC-0018 +
  DISC-0012** run (feature #36).

- **STEP-0038 — Full-site "Graphite Refined" restructure** *(COMPLETE —
  merged, tagged `v0.36.0`, 2026-07-18).* User-directed, adopting an external
  design handoff they approved ("much simpler, much more effective, much more
  visually appealing"), against the standing complaint that text is "cramped up
  into spaces". All four primary pages rebuilt on one shared band system — one
  idea per band, `--gutter`/`--band-y` rhythm, prose capped by `--measure`,
  imagery leading. Bands own vertical rhythm only; the horizontal rail comes
  from `main.container`, giving one left edge from nav brand to footer (hero was
  ~150px inboard; Support/Privacy titles up to 232px at 1440). Home hero CTA
  names the product; home closes on the real `makerNote`. `MakerNote`
  side-stripe removed; hero entrance no longer gates content on opacity.
  **Declined from the handoff:** its two invented placeholder products + "3
  total" count, and its invented first-person maker quote. 0 overflow across 56
  page/width checks; 0 axe violations across 7 routes. No checkpoint due
  (feature #37).

- **STEP-0039 — Short labels, platform-neutral name, last pages on the system**
  *(COMPLETE — merged, tagged `v0.37.0`, 2026-07-18).* User-directed follow-on
  to STEP-0038: download buttons cut to "Download" (home hero "Mac App Store")
  with accessible names kept full so WCAG 2.5.3 still holds; headline changed
  to "Brilliant Products for All" and studio-level copy made platform neutral
  (`PRODUCT.md` positioning updated to agree; per-product platform requirements
  untouched); Support, Privacy overview, per-product policy and 404 rebuilt on
  the band system with the site's panel/card treatment. 404 was the last
  surface still centring itself. 56 geometry checks — 0 overflow, 0 misaligned
  headings; 0 axe violations across 8 routes. No checkpoint due (feature #38).

- **STEP-0040 — Critique follow-ups** *(COMPLETE — merged, tagged `v0.37.1`,
  2026-07-18).* From the second `/impeccable critique` of the home page (25/40,
  trend 24 → 25). Mobile nav restored to full visibility ("Home" hidden ≤40rem
  since the brand lockup links home; 135px was previously hidden with About
  entirely off-screen); FactsLine separator moved to `::before` so wrapped rows
  never end on a middot; `MakerNote` consolidated to one component with `lead` /
  `inline` tones; one accent primary per page; hero `sizes` matched to the
  measured slot + 1600w step; dead `.875rem` CSS and ~192px footer void removed.
  Owner kept the headline and the App Store lead image (recorded in
  `.impeccable/critique/ignore.md`); the hero-names-the-product P0 was flagged,
  not actioned. **Open:** lead image alt text omits its baked-in marketing copy
  (WCAG 1.1.1). 64 geometry checks 0 overflow; 0 axe violations. No checkpoint
  due (feature #39).

- **STEP-0041 — Layout rhythm & composition** *(COMPLETE — merged, tagged
  `v0.38.0`, 2026-07-18).* `/impeccable layout`, dual isolated assessments; the
  layout-scoped detector returned 0 findings (uniform spacing passes every
  rule — the documented blind spot). Closed a **latent horizontal overflow**
  (single-token product name → 87px document overflow at 320px), pinned the
  footer (1273px of bare background under /404), replaced one band-gap value
  with three applied per relationship, removed the hero's accidental 141px
  double-pad, and composed the prose band's ~400×1464px dead region into a
  two-column layout with the maker's note alongside. Also: `<dl>` pairs,
  single-item grid stretch, a third left edge, and four divergent pill
  paddings. 72 geometry checks 0 overflow; 0 axe violations. **Deferred:**
  card-grid consolidation, `/` vs `/apps/` differentiation. No checkpoint due
  (feature #40).

- **STEP-0042 — Consistency pass** *(COMPLETE — merged, tagged `v0.39.0`,
  2026-07-18).* Owner-annotated screenshots: ragged box sizes on both policy
  pages, a mismatched lede colour, an over-large home hero gap, a maker note
  leaving half its container empty. Root cause: four separate card definitions
  (four paddings, two radii, two title sizes, four grid floors) plus
  `align-items: start` disabling stretch. Replaced with one shared
  `.card`/`.card-grid`/`.row-stack` system; privacy sections rebuilt as one
  full-width row per line with a heading rail and bullets (owner's explicit
  direction), applied to site and per-product policies. 64 geometry checks
  0 overflow; **0 ragged rows**; 0 axe violations. Lands STEP-0041's deferred
  card-grid consolidation. No checkpoint due (feature #41).

## Review-0002 dispositions (external design review, 2026-07-17)

Source: `project-designer` design-library, review-0002 (30 ideas). Recorded so
future reviews and sessions do not re-litigate:

- **Adopted:** COMP-01/USER-02/USER-05/USER-04 → STEP-0031; AI-07 (screenshot
  transcript) → STEP-0032.
- **Deferred, trigger-armed:** COMP-02 + COMP-04 (+optional COMP-09 RSS) →
  STEP-0033 (release-notes/updates block; trigger = first app update or second
  product). Card exists; do not start before the trigger.
- **Taste-tier, preview-first (design round pending user picks):** USER-01
  workflow strip, USER-03 fit statement, USER-06 gallery captions, USER-07
  shorter reading path (merged with the open prose-preserving description
  refresh; second independent review to flag it), COMP-05 maker note.
- **Parked until catalog growth:** COMP-06 facets, COMP-08 compatibility
  notices, COMP-10 purpose labels, AI-10 availability states.
- **Declined:** AI-08 save-data mode (no field problem; 1.3 MB site), AI-01
  light theme (deliberate dark-premium brand; tokens keep it possible), AI-02
  shareable gallery anchors, AI-05 locale-readiness (no demand), AI-06
  contextual 404 (needs client JS, marginal), COMP-03 support-path split and
  USER-09 feedback mailto (nice-to-have; revisit with support volume), USER-08
  mobile hero screenshot (LCP/duplication tradeoff on a perf-lean site),
  USER-10 gallery chrome relabel (gallery is a liked, working surface).

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
