# Roadmap

> **Purpose:** Ordered Step Packets, the one Standard Workflow, checkpoint cadence, and acceptance boundaries.
> **Read when:** Selecting or planning the next step; every session.
> **Update when:** Steps, priorities, checkpoints, phases, or critical fixes change.
> **Synchronize with:** STATUS.md, CHECKPOINTS.md, VERSION_CONTROL.md, CHANGELOG.md.
> **Status:** Active.
> **Activation:** Standard profile.

## Checkpoints — on demand (cadence retired 2026-07-18)

There is no longer a step-count schedule. The fixed cadence (Markdown
Consistency every 2 steps, Discussion every 3, Audit every 5, Enhancement
every 7) generated recurring work on a timer rather than in response to
anything changing, which is overhead a single maintainer does not need.

Run a checkpoint when there is a reason to: after a run of related packets,
before a release you care about, or when something feels drifted. Record it in
`CHECKPOINTS.md` as before — that file remains the ledger. Nothing is "due".

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
  headings; 0 axe violations across 8 routes. **MC became due at feature #38**
  and was cleared in the feature-42 catch-up (MC-0019).

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
  (WCAG 1.1.1; now GitHub #3). 64 geometry checks 0 overflow; 0 axe violations.
  **Discussion became due at feature #39** and was cleared in the feature-42
  catch-up (DISC-0013).

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
  card-grid consolidation, `/` vs `/apps/` differentiation. **MC + Audit became
  due at feature #40** and were cleared in the feature-42 catch-up (MC-0019 +
  AUDIT-0008).

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

- **STEP-0043 — Quiet home maker note** *(COMPLETE — merged, tagged `v0.39.1`,
  2026-07-18).* Owner-directed: multiple small identical boxes, very subtle, so
  the featured product keeps the focus. New `quiet` tone on `MakerNote` — three
  cells with a transparent fill and one hairline, no shadow or accent, heading
  32px → 15px faint. Subtlety via flatness rather than size, because the
  spotlight is an elevated gradient panel. Identical width and height verified
  at ten widths; fixed an orphan cell that stretched to double width at
  744–820px and stacked cells that sized to their own copy. **MC + Discussion +
  Enhancement became due at feature #42** and were cleared in the feature-42
  governance catch-up (MC-0019 + DISC-0013 + ENH-0006).

### Phase: Spectrum identity (owner-selected makeover) ▶ in progress

Owner ran a mockup round on 2026-07-31 (five whole-site options, rendered from
the real content and screenshots) and selected option **E — "Spectrum"**: a
near-black stage, full-bleed poster bands, and colour supplied by the product
rather than by the site. Six packets, in dependency order. Two named rules in
`DESIGN.md` are deliberately replaced by STEP-0045 (Never-Black → Near-Black
Floor; One Voice → One Voice Per Band); both replacements are recorded there,
not re-litigated per packet.

Every packet merges to `main` and therefore publishes, so each one is scoped to
leave the site coherent on its own — the token swap in STEP-0045 re-skins all
eight routes at once precisely because every route already draws from `:root`.

- **STEP-0044 — Per-product hue in the content model** *(COMPLETE — merged,
  2026-07-31).* Optional six-digit-hex `hue` on the product schema plus
  `productHue()`/`NEUTRAL_HUE` in `lib/products.ts`; Sole Focus declares
  `#ff9245`, taken from its own icon. Nothing consumes it yet, so no rendered
  output changed. Nine new tests (54 total). Internal — no tag.
- **STEP-0045 — Spectrum identity: tokens, chrome, replaced rules** *(COMPLETE
  — merged, tagged `v0.40.0`, 2026-07-31).* Near-black stage `#08090c`,
  achromatic chrome (`--accent` is white), product hue plumbed to every band,
  three button heights, radii 10/18/24, rail `clamp(1.25rem,5vw,4.5rem)`, shell
  `--maxw 86rem`. Three named rules replaced and recorded in `DESIGN.md`:
  Never-Black → **Near-Black Floor**, One Voice → **One Voice Per Band**, One
  Height → **One Height Per Set**. In-content link underlines became persistent
  (achromatic chrome means colour alone can no longer mark a link, WCAG 1.4.1).
  15 contrast pairs computed, 0 below AA (lowest 5.44:1); 56 page-states swept,
  0 overflow. A nav Download pill from the mockup was **declined** — it
  reintroduces the narrow-screen clipping review-0001 OPP-01 fixed.
- **STEP-0046 — Home as the poster** *(COMPLETE — merged, tagged `v0.41.0`,
  2026-07-31).* Studio hero (capped at `min(82vh, 900px)`), hue-painted product
  band, three statements read from the product's own approved prose, a mosaic of
  the four remaining screenshots, the promise band, the maker note. **All five**
  real screenshots now appear on the home page; one did before. Owner chose the
  headline "Small studio. / Serious craft." from four options. New: `bleed` prop
  on `BaseLayout` + `.rail` (a `100vw` bleed was rejected — `scrollbar-gutter:
  stable` makes it overflow), and `src/lib/prose.ts` so approved copy has one
  source. Writing that helper's tests caught a real defect first. 21 page-states
  swept, 0 overflow.
- **STEP-0047 — Product surfaces: catalog and detail** *(COMPLETE — merged,
  tagged `v0.42.0`, 2026-07-31).* One shared `ProductBand.astro` now serves the
  home page and the catalog; the catalog lead-row that duplicated the home
  spotlight is gone, closing 2026-07-18 health-check follow-up #1. The catalog
  is one band per product, each in its own hue. A product's own page remaps four
  accent tokens once on a wrapper, so the download button, badges, gallery
  controls and focus ring all speak that product's colour without any component
  knowing hues exist. The detail page's gallery/fit/features/prose sections keep
  their structure deliberately — working, tested surfaces; residual drift is
  STEP-0049's to measure. 21 page-states swept, 0 overflow.
- **STEP-0048 — Reading surfaces + the display ramp** *(COMPLETE — merged,
  tagged `v0.43.0`, 2026-07-31).* The eight routes carried **four different h1
  sizes**; they now come from one three-step ramp (`--display-1` home hero,
  `--display-2` page mastheads via `.page-title`, `--display-3` a product's
  name). Privacy, support, about and 404 joined the system. Closes 2026-07-18
  health-check **follow-up #3**: the in-content underline targeted
  `.about`/`.support`, which nothing carried, so the rules were dead — it now
  targets `.elsewhere a` and `.products a` and is proved by computed style.
  Follow-up #2 (hardcoded policy prose) stays queued on purpose. 56 page-states
  swept across all eight routes, 0 overflow.
- **STEP-0049 — Harmony sweep across all eight routes** *(COMPLETE — merged,
  tagged `v0.44.0`, 2026-07-31; phase closer).* 8 routes × 7 widths = **56
  page-states** measured for rail equality, button-height membership and
  overflow. Found and fixed three real defects: the product name started 227px
  from the edge at 1440 while every other h1 started at 99 (avatar in a left
  grid column — head now stacks); the policy title had the same defect at 108px
  on a 390px phone; and the product name rendered 32px on its own page against
  60px in every band, because its scoped rule was not reaching the built
  stylesheet. Ramp now measures 112 / 68 / 60px across the site. Final: 56
  page-states, **0 findings**. Left open on purpose: the brand mark is still
  periwinkle, the last chromatic thing in the studio chrome.

The Spectrum phase is complete.

### Phase: UI polish (owner-requested) ▶ in progress

Owner, 2026-07-31, after the makeover: *"make sure every UI element we have is
nicely sized, positioned aligned, categorized and meaningfully placed… This is
NOT a full-design UI request. This is a UI polish request."* Four packets, each
a measured conformance fix rather than a design change.

- **STEP-0050 — Spacing and type on the scale** *(COMPLETE — merged, tagged
  `v0.44.1`, 2026-07-31).* The banded routes hand-rolled six `clamp()` padding
  expressions, rendering 96/80/80/80/48px on the home page — 80px belonging to
  no scale — while the four `--band-y-*` rhythm tokens sat unused. Snapped to
  the tokens (96/72/72/72/40), every move ≤8px, no new step needed. One
  `--text-lede` role replaces two clamps a pixel apart, and `MakerNote`'s raw
  `1.05rem` is now `--text-base`. 0 off-scale band paddings at two widths on
  both banded routes; 56 page-states swept, 0 overflow.
- **STEP-0051 — One chip, one definition** *(COMPLETE — merged, tagged
  `v0.44.2`, 2026-07-31).* `padding: 0.25rem 0.6rem` appeared verbatim in three
  components; there is now one `.chip` in `global.css` with size as a named
  modifier (`.chip-lg` keeps the at-a-glance row deliberately louder).
  Consolidating settled two real defects: the neutral badge carried a fill AND
  a hairline, breaking Single-Cue, and the gallery counter's fill was a
  hardcoded `rgba(22,23,27,0.6)` — the **retired** graphite ground left behind
  by the STEP-0045 swap. Padding moved to the space scale (4px 12px). The
  counter's live update could not be proved locally (it runs on an
  IntersectionObserver, which does not fire in the harness here) and was
  **confirmed working on the live site** after deploy: `1 / 5` → `2 / 5` on the
  next-arrow, active dot advancing with it.
- **STEP-0052 — Every target reaches 24px** *(COMPLETE — merged, tagged
  `v0.44.3`, 2026-07-31).* Five standalone link groups measured 19–21px tall
  against the WCAG 2.2 SC 2.5.8 (AA) minimum of 24×24: the footer row, the
  back/breadcrumb links, the 404 destinations, the supported-products list and
  the About "elsewhere" list. One shared rule in `global.css` rather than five
  copies (the lesson STEP-0051 had just paid for). Height comes from block
  padding on an inline-flex box, so type, colour and the underline are
  untouched. **406 targets measured across 8 routes × 3 widths, 0 failures**;
  the 38 still under 24px are all inline in a sentence, where the exception
  applies.
- **STEP-0053 — The hero image loads first, at the right size** *(COMPLETE —
  merged, tagged `v0.44.4`, 2026-07-31; phase closer).* `fetchpriority="high"`
  on exactly one image per page — the product band's lead shot on `/` and
  `/apps/`, the gallery's first slide on the product page — carried by the same
  prop as `loading="eager"` so the two cannot drift apart. The home mosaic's
  `sizes` under-declared its slot (`40vw` = 576px against a 604px slot), so the
  browser was picking a variant one step too small; corrected to `42vw` with a
  1400w step for DPR-2 Retina. Build grew 1.4MB → 1.5MB (4 new variants), stated
  on the card rather than hidden. 11 images measured, 0 undersized.

The UI-polish phase is complete.

### Phase: Motion polish (owner-requested) ▶ in progress

Owner, 2026-07-31: *"look for areas where we can add animations and effects… only
meaningful, smooth, dynamic animations… This is NOT a full-design UI request."*
Three packets. Declined and recorded rather than built: Astro's `ClientRouter`
(turns a static site into an SPA and contradicts the no-runtime guardrail), a
pointer-reactive glow (a continuous rAF loop on a site whose argument is calm
software), loading skeletons (nothing here is async), and parallax / typing text
/ counting numbers (all on the anti-reference page `DESIGN.md` names).

- **STEP-0054 — Motion roles, and the hero entrance finished** *(COMPLETE —
  merged, tagged `v0.44.5`, 2026-07-31).* One 220ms duration drove everything
  from a link colour to a button press; now three named roles (120/220/420ms)
  plus `--ease-out` for entrances, with the default deliberately unmoved. The
  hero fades as well as rises. **Two real defects found:** the hero stagger had
  never run — the delays lost on specificity to the wildcard rule and every
  child computed 0s — and `astro check` had been failing since v0.44.4 because
  STEP-0053's last edit put a JSX comment inside an `<Image>` attribute list and
  the check was not re-run after it.
- **STEP-0055 — The reveal, actually running, and staggered** *(COMPLETE —
  merged, tagged `v0.44.6`, 2026-08-01).* **The scroll-reveal had never run in
  the built site.** Written as `animation: reveal-rise linear both` +
  `animation-timeline: view()`, the minifier folded them into
  `animation: linear both reveal-rise view()` — a timeline is not legal in that
  shorthand, so the browser dropped it and every `.reveal` computed
  `animation-name: none` with zero running animations. It shipped invisibly
  because the designed fallback is "content fully visible". Fixed with
  longhands; 21 revealed elements now each report a live `view()` timeline.
  Siblings stagger by shifting their own entry range (a scroll animation has no
  clock, so `animation-delay` does nothing), counted with `of .reveal` because
  a visually-hidden `h2` was making a plain `nth-child` off by one. The nav
  "settle" was **attempted and removed** — three tries, timeline attached but
  progress always `null`; new motion that cannot be shown to work is not motion
  to ship.
- **STEP-0056 — Page-to-page continuity** *(COMPLETE — merged, tagged
  `v0.44.7`, 2026-08-01; phase closer).* Native `@view-transition` — CSS only,
  **zero bytes of script** — on all eight routes, so every navigation is a
  hand-off rather than a hard cut. Header and footer carry their own
  `view-transition-name` so persistent chrome does not cross-fade against
  itself, which is the usual way this feature looks broken. Astro's
  `ClientRouter` was declined: it would turn the static site into an SPA and
  require every script to be re-initialised per navigation, against the
  no-runtime guardrail. The shared-element **morph was deliberately deferred** —
  its whole value is visual and appearance is not observable in the harness
  here; take it as a follow-up once the cross-fade has been watched live.

The motion phase is complete.

## Follow-ups from ENH-0007 (logic review against the field, 2026-08-01)

- **STEP-0057 — The reveal rises instead of dropping first** *(COMPLETE —
  merged, tagged `v0.44.10`, 2026-08-01).* `animation-fill-mode` back to `both`
  from the `none` of v0.44.9. With `none` the animation contributes nothing
  before `entry 5%`, so an element renders at its final position and then jumps
  22px down the instant the range opens — a drop-then-rise on every reveal. The
  reading that argued for `none` came from a probe whose viewport had no height,
  and a scroll axis with no scrollbar makes a ViewTimeline inactive by spec, so
  "progress stuck at 0" was the only thing it could report. `both` is safe here
  because v0.44.8's real win is kept: the keyframes carry no `opacity`, so the
  worst case is a 22px offset and never a hidden element. The fade stays
  deleted — `DESIGN.md` §6 is right regardless of the bad measurement.

- **STEP-0059 — The support email survives the edge** *(COMPLETE — merged,
  tagged `v0.44.11`, 2026-08-01).* Cloudflare's Email Address Obfuscation was
  rewriting `support@metkapstudio.com` at the edge into a `__cf_email__` span
  and a `/cdn-cgi/l/email-protection` link that only an injected script decoded,
  so with JavaScript off the site's only support contact did not render at all.
  Measured by AUDIT-0009, which drove the **live site** rather than the build —
  `dist` had the address twice, the served page had it zero times. A
  `SupportEmail` component now wraps a slot in Cloudflare's documented
  `<!--email_off-->` opt-out at all seven places the address reaches HTML. The
  markers are inert comments when the feature is off, so this holds whatever the
  zone is set to, and unlike the dashboard toggle it is something this
  repository can prove. Wrapping a **slot** rather than rendering the link is
  deliberate: the first version emitted the `<a>` via `set:html`, which dropped
  the caller's `data-astro-cid` scope and turned the About-page link white
  against its muted siblings. JSON-LD needs no wrapper — the edge serves
  `application/ld+json` addresses untouched. All 8 built pages are
  byte-identical to the previous release once the markers are stripped.

- **STEP-0060 — One page-top distance, halved** *(COMPLETE — merged, tagged
  `v0.45.0`, 2026-08-01).* Two owner reports about arriving on a page and
  reading nothing. Measured before: the gap from the header's bottom edge to the
  first ink was 170px on home, 96px on apps/about/support/privacy-index/404,
  49px on a policy page and 32px on a product page — four answers to one
  question. New `--page-top` token (half `--band-y-lg` by construction) on the
  first band of every route; all eight now measure 48px. The home hero also
  loses `min-height` and vertical centring: with `align-items: center` the slack
  was inserted equally above the eyebrow and below the buttons, which is exactly
  the two bands the owner boxed. Hero band 738 → 542px at 1440.

- **STEP-0061 — One identity lockup, one back-link placement** *(COMPLETE —
  merged, tagged `v0.45.0`, 2026-08-01).* The product and policy headers put the
  app icon on its own row above the title, and the policy back link inherited
  the prose column's centring — 370.5px from the edge at 1440 against the
  product page's 98.5px, the same link in two places. Two shared rules:
  `.page-back` (placement, matching NN/G's navigation guidance) and `.identity`
  (icon left, name right, one line). Header blocks 23-32% shorter; both back
  links now on the shared rail at 390/1024/1440. **This reverses the stacking
  decision of 2026-07-31 knowingly** — that decision existed so a product `h1`
  would start on the shared rail, and it no longer does. The owner asked for the
  lockup explicitly after seeing the stacked version live twice; the old
  reasoning is kept in the `.identity` comment so it is not rediscovered and
  reverted. Also fixed an unclosed CSS comment that had been silently swallowing
  `.head-body` and `.tags`.

- **STEP-0062 — The wrapping rule, and three columns that match** *(COMPLETE —
  merged, tagged `v0.45.0`, 2026-08-01).* 22 paragraphs across the eight routes
  ended a line on a stray article, preposition or auxiliary; now 0. **CSS was
  not the fix and had already been tried** — `text-wrap: pretty` was applied
  site-wide and every defect was still present, because `pretty` only rescues a
  paragraph's last line. `tie()` in `src/lib/typography.ts` binds the short word
  to the next with a non-breaking space, reaching Markdown through a Sätteri
  hast plugin, content prose through one `.transform()` in the schema, and the
  site's own strings at their definition points. Two things only measuring
  found: Markdown's hard-wrapped source newlines (real wrap points once HTML
  collapses them) and element boundaries ("…and `<strong>`Study mode`</strong>`").
  Separately the home page's three feature columns ran 7/7/4 lines; they now
  show each section's opening sentence, written to a matching length — 3 lines
  each, ending on the same pixel — while the sections keep their full length on
  the product page. **A caching trap worth remembering: a schema change to a
  content collection is not picked up by a plain `npm run build`;** `.astro/`
  and `node_modules/.astro/` both have to go.

- **STEP-0063 — The full-row rule** *(COMPLETE — merged, tagged `v0.45.0`,
  2026-08-01).* The "What it does" grid held 7 features and laid them 4 + 3.
  Measured at six widths, only 390px was ever full. `repeat(auto-fit, …)` cannot
  fix it — it sizes by width and never sees the item count — so `evenColumns()`
  picks the widest column count that divides the items evenly and `.grid-even`
  reads it. An eighth feature was added as asked, restating appearance options
  already in the approved prose rather than making a new claim. Full at all six
  widths. Also repaired two defects from the packets above, both found by
  re-measuring: `.identity > :first-child` nudging the text block on the
  icon-less policy, and the back link's WCAG tap-target padding offsetting its
  text.

- **STEP-0064 — Declare the satteri packages, and a gate that is actually met**
  *(COMPLETE — merged, internal, no tag, 2026-08-01).* `astro.config.mjs` and
  `src/lib/satteri-tie.ts` imported `@astrojs/markdown-satteri` and `satteri`
  while neither was in `package.json` — both resolved only as dependencies *of*
  astro, so any astro release dropping or renaming them breaks the build with no
  warning, and a variant of that failure stops the wrapping rule (STEP-0062)
  reaching Markdown silently. Both declared, plus the plain `npm audit fix`:
  production advisories 3 → 0, total 11 → 5, all remaining dev-only under
  `@lhci/cli`, which stays at 0.15.1 so the accessibility gate survives.
  `SECURITY.md`'s "npm audit clean at merge" could not be met without breaking
  that gate, so it was being ignored — rewritten to `npm audit --omit=dev`,
  which is true, enforceable, and the one that matters. Adding a dependency
  makes npm re-resolve, so astro moved 7.0.5 → 7.1.6 inside the existing range;
  kept deliberately and proved by rebuilding all 8 routes and comparing
  character by character — 16 changed chunks, two per page, every one of them
  astro's own `generator` meta string. Assets byte-identical.

- **STEP-0065 — A Content-Security-Policy, so edge injection breaks loudly**
  *(COMPLETE — merged, internal, no tag, 2026-08-01).* `SECURITY.md` stated the
  control "no third-party script embeds"; AUDIT-0009 found Cloudflare injecting
  a beacon into every **live** page against exactly that control, where nothing
  in this repository could see it. Astro's stable `security.csp` now emits the
  meta element with real sha256 hashes for every bundled script and style. The
  probe caught a defect the card would otherwise have shipped: the first run
  failed 4 of 8 routes on `style-src-attr`, and what was blocked is how the
  Spectrum identity works — `--hue` is a style attribute, so every product
  colour would have silently reverted to the achromatic default. The spec
  excludes style attributes from hash matching, so the fix is the narrowest
  allowance available, scoped to attributes alone and touching nothing about
  scripts. Proved with a control: the same injection **runs** with the policy
  stripped out and is refused with it in place. `frame-ancestors`, `report-uri`
  and report-only mode are unavailable in a meta element and GitHub Pages cannot
  set headers — recorded, with Cloudflare Transform Rules named as the owner's
  route to real ones.

- **STEP-0066 — Retire three stale claims in STATUS** *(COMPLETE — merged,
  internal, no tag, 2026-08-01).* STATUS is the first document every session
  reads, and three of its claims were false. The AUDIT-0009 blocker was still
  listed as the pending next action, but the beacon is gone from the live site
  (one `<script>`, JSON-LD, zero analytics matches). Follow-up #1 asked for a
  `ProductLead` extraction that STEP-0047 had already done. Follow-up #3 was
  moot rather than open — every in-content link on About and Support already
  sits in a class the global underline rule covers, so there was nothing to fix.
  #2 and #4 are real and stay. AUDIT-0009 and AUDIT-0010 recorded in the ledger;
  AUDIT-0009's run had never reached it.

- **STEP-0067 — The policy's legal prose belongs to the content** *(COMPLETE —
  merged, internal, no tag, 2026-08-01).* Five sections of `PolicyArticle.astro`
  held legal text as literal strings, some behind ternaries on `storedLocally` /
  `dataCollected`, so a product whose wording had to differ meant editing a
  component every product renders through. The wording moved to
  `src/lib/policy-text.ts` as pure functions of the policy's own facts, and
  `privacyPolicyEntrySchema` gained an optional `sections` object a content file
  can override. Optional on purpose: the defaults are correct for the common
  case, and five more required fields would mean every future product
  hand-writing legal prose it has no reason to change. The contact address is
  appended by the component rather than carried in the prose, so an override
  cannot drop the route Apple 5.1.1(i) requires. Proved by writing a real
  override into `sole-focus.md` and measuring both pages: one section, one
  policy, nothing else. Two incidental improvements — four sections now get the
  wrapping rule they were exempt from, and a space that JSX had been swallowing
  between "deletion requests —" and the support address is now present.

- **STEP-0068 — Assert what only the built output can prove** *(COMPLETE —
  merged, internal, no tag, 2026-08-01).* Every unit test here proved a pure
  function, leaving 14 components and 8 pages covered only by `astro build`,
  `astro check` and the deploy-time a11y gate — none of which notices a wrong
  canonical URL, malformed JSON-LD, a third-party script, a missing CSP, or the
  wrapping rule silently not reaching rendered Markdown. That last one is why
  the suite exists in this shape: STEP-0064 found the packages applying that
  rule were reachable only as transitive dependencies, so it could have stopped
  working with nothing going red. `tests/dist.test.ts` reads `dist/` directly —
  no component harness, no new dependency — behind its own config and its own
  `npm run test:dist`, so the sub-second unit loop never waits on a build. Every
  assertion was seen red against deliberately broken output first: a localhost
  canonical, malformed JSON-LD, a stripped CSP, an injected beacon, non-breaking
  spaces removed, and a deleted route. 8 tests; `npm test` unchanged at 96 in
  0.90 s.

- **STEP-0078 — The shared standalone-link rule finds its links again**
  *(COMPLETE — merged, internal, no tag, 2026-08-04).* `global.css` grants a
  24px minimum height to `.footer-links a, .back a, .links a, .products a,
  .elsewhere a` (STEP-0052). Nothing had used `.back` since the back link was
  renamed `.page-back`, so the rule matched nothing on the two product pages
  and the policy pages: their back links rendered **18px** tall. Worse,
  `.page-back` subtracts `--space-1` from its own `padding-top` *because* it
  expects this rule to add it, so those three routes sat **47px** from the
  header against every other route's 48 — a 1px break in the one distance
  STEP-0060 exists to keep identical. The "More apps" row at the foot of a
  product page was a bare `<ul>` with no class, the one standalone link row on
  the site outside the rule at all. Fixed by pointing the existing selectors at
  the class that exists and giving that row the shared `links` class, not by
  writing a second copy of the rule. Measured after: **0** standalone links
  under 24px on any of the 9 routes at 390px with a coarse pointer, back links
  18 → **32.8px**, page-top identical everywhere. Deliberately **not** recorded
  as an accessibility fix: measured against WCAG 2.2 SC 2.5.8 these links
  passed, through its spacing exception. It is a shared rule that lost its
  surface, and a dead selector that takes a whole surface with it while nothing
  goes red is what STEP-0080 exists to catch.

- **STEP-0077 — An app icon beside its name in the catalog**
  *(COMPLETE — merged, tagged `v0.48.0`, 2026-08-03).* The owner boxed the "Sole Focus" heading on `/apps/`
  and labelled it NAME — "I want icon and names in the apps/games page. Not
  just names." The product page and both policy pages already used the shared
  `.identity` lockup; `ProductBand` was the one surface that named a product
  without ever showing it, which made the catalog and the home page the two
  places a visitor met a product with no icon. Same lockup reused rather than a
  second one invented: `ProductAvatar` at 56px, the over-line kept above it so
  the icon aligns with the name rather than a 12px label, and the icon link
  marked `redundant` so it adds no keyboard stop. Verified from the rendered
  DOM at 1440px and 390px on both pages.

- **STEP-0076 — The two privacy cards read as one set**
  *(COMPLETE — merged, tagged `v0.48.0`, 2026-08-03).* The owner boxed the per-product policy
  block on `/privacy/` — "obviously has no harmony at all. Their heights are
  not equal." Measured at **96px against 66px** at 1440px, with different
  bottom edges. Two causes in one rule set: `.policy-link` was a flex row with
  `space-between`, so the date sat beside the name when it fitted and beneath
  it when it did not — one component, two designs, chosen by how long a product
  is called; and each card was only as tall as its own text while the `<li>`
  around it stretched. Both are now grids: name above date always, and the link
  fills its row. 96 / 96 at every width, sharing a bottom edge side by side. No
  fixed height, so a third product cannot reintroduce it.

- **STEP-0075 — The void above the gallery**
  *(COMPLETE — merged, tagged `v0.48.0`, 2026-08-03).* The owner boxed an empty band on
  `/apps/magic-notes/` and asked for the space to be reduced on the product
  pages. Measured at **144px**, against 80px below the gallery and 8–24px
  inside the header block: two rhythms stacked, the band contributing
  `--band-y-loose` and the gallery `padding-block` of its own. Both duplicates
  removed rather than a pixel value invented — the gallery keeps no padding of
  its own, and the band drops `loose` for the neutral step, because a gallery
  of the product just named is not a new argument. 144 → 72px, balanced against
  80px below. The two 120px loose breaks lower down are deliberately left.

- **STEP-0074 — The screenshot transcript goes**
  *(COMPLETE — merged, tagged `v0.48.0`, 2026-08-03).* The owner boxed the "▸ Screenshot
  transcript" toggle under the Magic Notes gallery and asked for it to go. It
  was added in STEP-0032 as a text alternative, so removing it was checked
  rather than assumed: it rendered nothing but each shot's `alt` string, and
  every gallery `<img>` still carries that exact string. Nothing a screen
  reader could reach was lost; a visible duplicate went. 36 lines of CSS only
  it used went with it. `shot.title` now renders nowhere but stays in the
  schema, because the content files author it.

- **STEP-0073 — The text the wrapping rule never reached**
  *(COMPLETE — merged, internal, in `v0.48.0`, 2026-08-03).* The rule has existed since STEP-0062 and
  most of the site bypassed it: `product.summary` rendered raw on three
  surfaces — the very copy the owner pointed at, breaking as "…a Pomodoro" with
  "timer" alone below — seven policy lists read straight from the content file,
  and every page's own lede written as literal JSX. Fixed where the content is
  READ rather than where it is rendered, so a fourth surface cannot forget.
  Named things now bind as units too, matched longest first, because "Pomodoro"
  is not a function word and the old rule guaranteed the break fell before
  "timer". Measured 156 → 0 untied pairs and 46 → 0 splittable names; three new
  dist assertions hold it, each seen red first.

- **STEP-0072 — The page checklist**
  *(COMPLETE — merged, internal, in `v0.48.0`, 2026-08-03).* The owner reported three defects in one
  sitting — text cut mid-phrase, two policy cards with no harmony, a large void
  on a product page — and ended each report with the same instruction: write
  this down as a checklist so it stops coming back. `docs/CHECKLIST.md` holds
  the rules in three groups, Text, Layout and Whitespace, each opening with the
  owner's own words, each rule naming the failure it catches and saying whether
  a machine or a person checks it. The owner chose a document **and** an
  automated check; this packet is the document, STEP-0073 the enforcement,
  because a check landing before the site passes it would put a deliberately red
  suite on `main`. Scope was measured rather than estimated: 925 non-breaking
  spaces already in the built output, 156 forward-pointing pairs still untied in
  runs long enough to wrap, 46 places a protected phrase can still split.

- **STEP-0071 — A policy lead with more than one paragraph**
  *(COMPLETE — merged and shipped as **v0.47.1**, 2026-08-03).* The owner asked
  for the app icon on the Magic Notes privacy page, as Sole Focus has, and for
  any inconsistency between the pages to be found and fixed. **The icon was
  already there** — `PolicyArticle` renders `ProductAvatar` from the product's
  own `icon`, so STEP-0070 put it on both pages in one pass; both were fetched
  live and compared before anything was edited, and nothing was changed for it.
  The comparison found one real defect instead: `.policy-lead :global(p)` set
  `margin: 0`, which is right for the one-paragraph lead every policy had until
  Magic Notes shipped a three-paragraph one, and wrong the moment there were
  three — they ran together into a single grey block at the top of the page.
  Fixed with `p + p` only, so a lone paragraph renders exactly as before and
  both edges of the block stay where they were. Everything else compared clean
  and is recorded on the card so it is not re-checked: identical section and
  chip sets, identical frontmatter fields, JSON-LD differing only by `offers`,
  and matching social-preview tags on all four pages.

- **STEP-0070 — The Magic Notes pages stop being placeholders**
  *(COMPLETE — merged and shipped as **v0.47.0**, 2026-08-03).* Versionable:
  user-facing content on two published pages. STEP-0069 built these pages thin
  on purpose — no icon, no screenshots, and a policy marked `draft` because it
  had been written from the app's documentation rather than read against its
  source. The app is being published, and the shipped build hard-codes both URLs
  (`NotebookSettingsView.swift:703-708`), so the one visitor who cannot be asked
  to come back later is a store reviewer following a link inside a submitted
  binary. **The imagery is the app's own**: six real captures of the running
  application supplied by the owner, and the shipped icon from the 2026-08-02
  batch — nothing generated, mocked up or imitated. Their chrome reads
  `v0.309.0`, predating the version bump, and no claim depends on the number
  shown. **The policy is now `reviewed`**, on source-level evidence: no
  networking API is referenced anywhere in the application, no analytics or
  advertising SDK is linked, `spotlightIndexingEnabled` defaults to false, and
  four `AppIntent` types are the only system surface. It also names a concrete
  deletion route — `~/Library/Application Support/IntelligentWorkingNotebook` —
  because Magic Notes has no in-app erase-all, unlike Sole Focus. **Still
  unclaimed:** price, store link, release date, maker's note. The "In
  development" badge stays, because the status vocabulary has no value for
  "finished and awaiting release" and `released` without a store link would
  render a badge the page cannot honour. STEP-0069's "no images" pin was seen
  red before its replacement was written. 104 unit tests (102 before; one pin
  removed, three written in its place), 10 dist tests, 10 routes unchanged.

- **STEP-0069 — Magic Notes gets its pages before it gets its release**
  *(COMPLETE — merged and shipped as **v0.46.0**, 2026-08-02).* Versionable
  rather than internal: `VERSION_CONTROL.md` puts generated route URLs inside
  the public contract, and this adds two. The site's second
  product. Magic Notes is a finished macOS notebook that answers arithmetic
  written as plain sentences; it is not released, and its store submission draft
  already quotes `https://metkapstudio.com/privacy/magic-notes/` as the privacy
  policy URL — a page that until now did not exist. Apple 5.1.1(i) requires it
  live at review time, and a URL inside a shipped build cannot be corrected
  afterwards, so the pages had to come first. Two content files and no code
  change: `status: in-development` with empty `storeLinks` already renders "Not
  yet available", and `ProductAvatar` already draws a monogram without an icon.
  **Nothing unverified is claimed** — no price (there is no purchase code in the
  app at all), no store link, no release date, no screenshot. Copy is taken from
  the owner-approved, fact-checked pack in the app's own repository rather than
  written here; no `makerNote`, which needs the maker's explicit approval of the
  exact words. The policy ships `reviewStatus: draft`, which is the honest state
  of a page not yet read against the shipped build. **The hue was the one real
  decision:** the Magic Notes icon is deliberately achromatic, and the app's
  first-run accent is a burnt orange two points from Sole Focus's, which would
  have made the catalogue read as one product twice — so the band takes
  `#B2BBC5`, the app's own Graphite accent as it renders in dark appearance.
  Both new dist assertions were seen red against deliberately broken output
  first. 102 unit tests (96 before; 6 added), 10 dist tests (8 before; 2 added),
  10 routes.

- **STEP-0058 — AVIF for the LCP screenshot** *(CLOSED 2026-08-01 — measured and
  **rejected**; nothing shipped).* Astro `<Picture formats={['avif','webp']}>`
  was built on the first gallery slide and measured against the current WebP at
  the same four widths and the same `quality={78}`. **AVIF came back larger at
  every width** — 720: 12,094 → 15,823 B (+31%); 1080: 20,582 → 25,440 B (+24%);
  1440: 28,614 → 34,412 B (+20%); 1920: 40,112 → 45,881 B (+14%). The field's
  20-30% saving is drawn from photographic content; these are UI screenshots —
  flat fills, hard edges, small rendered text — which WebP's encoder handles
  well, and a `quality` number is not comparable between codecs. The change was
  reverted before commit. **WebP-only stays; do not re-litigate without a new
  measurement.**

- **Considered and not taken.** Scroll snap events (`scrollsnapchange`) for the
  gallery's active-slide state: Chrome 129+ and Safari 18.2+, **Firefox has
  neither**, so the `IntersectionObserver` stays as a fallback and the change
  buys a second code path for behaviour nobody can tell apart. CSS carousels
  (`::scroll-marker`, `::scroll-button()`) would delete the site's last script
  and fit `ARCHITECTURE.md` exactly, but are explicitly not Baseline — a watch
  item, not work. `sibling-index()` for the stagger: same shape, less code,
  support not there yet.

## Review-0002 dispositions (external design review, 2026-07-17)

Source: `project-designer` design-library, review-0002 (30 ideas). Recorded so
future reviews and sessions do not re-litigate:

- **Adopted:** COMP-01/USER-02/USER-05/USER-04 → STEP-0031; AI-07 (screenshot
  transcript) → STEP-0032.
- **Deferred, trigger-armed:** COMP-02 + COMP-04 (+optional COMP-09 RSS) →
  STEP-0033 (release-notes/updates block; trigger = first app update or second
  product). Card exists; do not start before the trigger.
- **Taste-tier — round concluded (STEP-0034/0035, v0.33.0):** USER-03 fit
  statement shipped (`FitStatement.astro`) and COMP-05 maker note shipped
  (`MakerNote.astro`); USER-01 workflow strip and USER-06 gallery captions
  **declined**; USER-07 shorter reading path **closed** unless reopened. Still
  open from this thread: the **prose-preserving description refresh** — the
  icon-panel/card treatment was rendered and rejected live, so any retry stays
  prose-first and must be previewed before it is finalized.
- **Parked until catalog growth:** COMP-06 facets, COMP-08 compatibility
  notices, COMP-10 purpose labels, AI-10 availability states.
- **Declined:** AI-08 save-data mode (no field problem; 1.3 MB site), AI-01
  light theme (deliberate dark-premium brand; tokens keep it possible), AI-02
  shareable gallery anchors, AI-05 locale-readiness (no demand), AI-06
  contextual 404 (needs client JS, marginal), COMP-03 support-path split and
  USER-09 feedback mailto (nice-to-have; revisit with support volume), USER-08
  mobile hero screenshot (LCP/duplication tradeoff on a perf-lean site),
  USER-10 gallery chrome relabel (gallery is a liked, working surface).

## Backlog — current only

Not scheduled yet; promote one outcome to a frozen packet when selected.

- **Highest product value:** add another real owner-supplied product. This is
  blocked on the product existing; never publish placeholder proof.
- **Trigger-armed:** STEP-0033 updates/release-notes block, only after the first
  app update or second product.
- **Optional:** Terms/disclaimer page; per-page OG images; dependency refresh
  (Astro 7.1.1 and Vitest 4.1.10 were available on 2026-07-18).
- **Retired:** FAQ rich-result work. Google stopped showing FAQ rich results in
  May 2026, so `FAQPage` JSON-LD no longer justifies a dedicated SEO packet for
  this portfolio. Keep the visible product FAQ because it helps readers.
- **Parked until evidence:** View Transitions, light theme, press kit/devlog,
  catalog facets/labels, and Cloudflare dashboard tuning.

## Planning rules

Append-only Step identity/order. One active packet. Ad hoc fixes/audits/refactors
are normal packets and cannot bypass governance. Run a REFACTORING consolidation
pass when the rule-of-three hotspot trigger fires — not on a packet timer (that
cadence was retired with the rest on 2026-07-18).
