# Changelog

> **Purpose:** Human-readable version history (Keep a Changelog style).
> **Read when:** Cutting a release or reviewing history.
> **Update when:** During versionable packets (finalize Unreleased before tagging).
> **Synchronize with:** VERSION_CONTROL.md, ROADMAP.md, STATUS.md.
> **Status:** Active.
> **Activation:** Standard profile.

All notable, user-relevant changes are documented here. Versioning follows
Semantic Versioning (pre-1.0 `0.MINOR.PATCH`). Internal-only work (docs,
checkpoints, refactors, this initialization) is traceable via Step IDs and
commits and does **not** consume a product version.

## [Unreleased]

### Fixed

- **The support address stays in one piece on a phone.** At narrow widths
  `support@metkapstudio.com` was wrapping between `.co` and `m`, so the one
  thing the support page exists to hand over looked like a typo. The address now
  scales to fit its panel on a single line from 320px up; it is unchanged from
  about 476px on.
- **Privacy page titles no longer eat the first screen on a phone.** The heading
  was fixed at 44px, which ran "MetKap Studio Website Privacy Policy" to three
  lines and 139px of header at 390px. It now scales down on narrow screens
  (two lines, 59px), bringing the at-a-glance chips and the summary up with it.
  Desktop is unchanged.

## [0.39.1] — 2026-07-18

### Changed

- **The "Why this exists" note on the home page is much quieter.** It's now
  three small, identical boxes — same width and same height at every screen
  size — drawn with a thin outline and no fill, so the Sole Focus panel above
  it clearly stays the centre of attention. The heading dropped from a large
  title to a small quiet label.

## [0.39.0] — 2026-07-18

Consistency pass (STEP-0042).

### Changed

- **The privacy policies read as documents again.** Each section is now one
  full-width row with its heading on the left and the details on the right,
  using bullet points — instead of a grid of boxes in three columns with
  visibly different heights. Applied to the site policy and every per-product
  policy.
- **All the boxes are the same now.** Cards on About, Support, the product page
  and the policies were four separate implementations of the same thing, with
  four different paddings, two corner radii and two heading sizes. They are one
  component now, and cards in a row are always the same height.
- **The privacy page's opening paragraph matches the rest of the site.** It was
  brighter than the equivalent paragraph on every other page.
- **The home page reads more connected.** The gap between the hero and the
  Sole Focus panel was too large for two things that belong together, and the
  maker's note now fills its box instead of leaving half of it empty.

### Internal

- Shared `.card` / `.card-grid` / `.row-stack` in `global.css`; page files now
  override only the grid track floor. `align-items: start` — the cause of the
  ragged heights — is removed and documented as never-again. Verified: 64
  geometry checks (8 routes × 320–1440px) with 0 overflow, **0 ragged rows**,
  and 0 axe-core violations across 8 routes. Lands the card-grid consolidation
  deferred in STEP-0041.

## [0.38.0] — 2026-07-18

Layout rhythm and composition (STEP-0041).

### Changed

- **The spacing now means something.** Every gap between sections used to be
  the same size on every page, so the layout couldn't tell you what belonged
  with what. Related sections now sit closer together and new ideas get real
  room — the product page's rhythm went from five identical gaps to a varied
  one.
- **The long description no longer has an empty half.** On wide screens the
  maker's note now runs alongside the description instead of in front of it,
  filling roughly 400px of column that sat permanently empty beside the longest
  block of text on the site. On narrower screens it reads first, as before.
- **The "Released / Last updated" details line up properly.** Each label now
  sits above its own value instead of alternating across four columns.
- **Small alignment and spacing corrections** — the screenshot transcript now
  starts on the same left edge as everything else; the privacy policy list no
  longer stretches one entry across the full width with its date stranded far
  away; the About headline uses more of its line.

### Fixed

- **A page-width bug that hadn't happened yet.** The product page could scroll
  sideways on a small phone if a product's name were one long word. Sole
  Focus's name happens to break into two short words, which hid it — the next
  product would have triggered it. Verified fixed by testing with a longer name.
- **No more empty space below the footer** on short pages like the 404 page,
  where a tall window left over a thousand pixels of blank background beneath it.

### Internal

- Three band-rhythm tokens (`--band-y-tight` / `--band-y` / `--band-y-loose`)
  applied per relationship, not uniformly. Run via `/impeccable layout` with two
  isolated assessments; the layout-scoped detector returned **0 findings**,
  which is the documented blind spot — uniform spacing passes every rule.
  Verified: 72 geometry checks (8 routes × 320–1440px) with 0 overflow, 0
  axe-core violations across 8 routes. Two findings deferred as deliberate
  exceptions — see `docs/tasks/STEP-0041.md`.

## [0.37.1] — 2026-07-18

Design-critique follow-ups (STEP-0040).

### Fixed

- **Every menu item is visible on a phone again.** On narrow screens two
  destinations — including **About** — sat off-screen behind an invisible
  sideways scroll. "Home" now steps aside at phone width (the logo already
  takes you home), leaving the rest on one visible row with no change to header
  height.
- **No more stray dot at the end of a line.** When the facts line under the
  download button wrapped onto two or three rows, a separator could be left
  dangling at the end of a row.
- **The maker's note reads the same everywhere.** The home page and the Sole
  Focus page were rendering the identical words in two different styles. They
  now share one treatment, the home version gets a real heading, and the
  reply-time promise sits on its own line instead of trailing the signature.

### Changed

- Only one filled accent button per page now, so it's always obvious which
  action the page is actually recommending.
- Slightly crisper featured screenshot on high-resolution Macs, and less image
  data downloaded on mid-size windows.

### Internal

- Critique snapshot 25/40 (trend 24 → 25). Owner elected to keep the headline
  and the App Store lead image; both recorded in
  `.impeccable/critique/ignore.md`. The lead image's alt-text gap is
  deliberately **not** ignored and stays open. Verified: 64 geometry checks
  (320–1440 × 8 routes) with 0 overflow, 0 axe-core violations across 8 routes.

## [0.37.0] — 2026-07-18

Shorter buttons, a platform-neutral name, and the last pages brought into line
(STEP-0039).

### Changed

- **Download buttons are short now.** Every download button just says
  "Download", except the one in the home hero, which says "Mac App Store".
  Screen readers still hear the full "Download Sole Focus on the Mac App
  Store", so nothing was lost for anyone relying on them.
- **The studio name on the home page is "Brilliant Products for All."** The
  site no longer describes the studio itself as Mac-only — individual products
  still state exactly which platform and version they need.
- **Support, Privacy and the 404 page now match the rest of the site.** These
  were the last pages still on the old narrow-column layout with their own
  spacing. Support is now a headline, a contact panel with the address, and
  "what to include" cards; the privacy policies are laid out as readable panels
  instead of one long divided column; and the 404 page sits on the same left
  edge as everything else.

### Internal

- `DownloadButton` gains a documented `label` override with a note on WCAG
  2.5.3 (any override must remain a substring of the accessible name).
  `PolicyArticle` sections became a panel grid; policy chips dropped their
  stacked border+fill for a single cue. `PRODUCT.md` positioning made
  platform-neutral so the docs and the site agree. Verified: 56 geometry checks
  across 8 routes × 7 widths — 0 overflow, 0 misaligned headings; 0 axe-core
  violations across all 8 routes.

## [0.36.0] — 2026-07-18

Full-site redesign — "Graphite Refined" (STEP-0038).

### Changed

- **The whole site breathes now.** Every page is rebuilt as a stack of bands —
  one idea per band, with real space between them — instead of dense text
  packed into a narrow column. This was the long-standing "too much text
  cramped up into spaces" complaint, fixed at the system level so it applies
  everywhere rather than page by page.
- **Everything lines up.** The studio name in the header, every page heading,
  every panel edge and the footer now share one left edge from top to bottom.
  Previously the home hero sat ~150px inboard of everything below it, and the
  Support and Privacy titles up to 232px inboard on a wide screen.
- **The product page is no longer a single squeezed column.** Sole Focus now
  gets an open header, a full-width gallery, a "What it does" grid, its
  description at a comfortable reading width, and a closing download panel.
- **The home page ends on a human note.** The maker's own words (the same ones
  already on the product page) now close the page, where it used to end on a
  copyright line.
- **The home download button says what it downloads** — "Download Sole Focus —
  free" instead of an unlabelled store button, with the price, system
  requirement and privacy facts directly beneath it.
- **About is a real page**, with four commitments laid out two-by-two and a
  contact panel, rather than a bulleted list in a narrow column.

### Fixed

- The maker's note no longer uses a coloured left stripe (a banned treatment
  that the project's own design rules prohibit).
- The home hero's entrance animation could leave the download button invisible
  in any context where animations don't run — a headless renderer, a
  background tab, a print preview. It now animates movement only, so the
  content is always visible.

### Internal

- Band rhythm tokens + `.band` / `.panel` / `.shot-frame` primitives in
  `global.css`; bands own vertical rhythm only, the horizontal rail comes from
  `main.container`. Verified: 0 horizontal overflow across 56 page/width
  combinations (390–1440px), 0 axe-core violations across all 7 routes, gates
  green. Two elements of the source mockup were deliberately not adopted — see
  `docs/tasks/STEP-0038.md`.

## [0.35.1] — 2026-07-18

### Fixed

- **The featured screenshot is big again, and the page no longer scrolls
  sideways on tablets.** A change in 0.35.0 accidentally made the facts line
  (Free · macOS 10.15 · Works offline) refuse to wrap, which squeezed the
  featured screenshot down to a sliver on desktop and pushed the page wider
  than the screen on iPads and large phones. The facts now wrap between facts
  as intended, and the image is back to full size.

## [0.35.0] — 2026-07-17

Alignment & polish pass (STEP-0037).

### Changed

- **Buttons line up.** Every button now shares one height, so groups like the
  featured panel's actions read as a considered set instead of mismatched sizes
  (the download button leads through its colour and Apple mark, not a taller
  box). Applies across the whole site.
- **Cleaner featured text.** The featured product's text column is wider, so the
  summary wraps in tidy lines and the "made by" line fits on one row.
- **No more mid-phrase wraps.** The facts line under the download button now
  breaks only between facts (e.g. "macOS 10.15 or later" stays together), never
  in the middle of a phrase.

### Internal

- Shared `.btn` gains one `min-height`; `DownloadButton`/`FactsLine` aligned to
  it; dead spotlight-highlights CSS removed. Verified no horizontal overflow on
  all 7 routes at 390 + 1280. **MC-0018 + DISC-0012** (due at feature step 36)
  run alongside.

## [0.34.0] — 2026-07-17

Wider, image-forward redesign (STEP-0036).

### Changed

- **The site is wider and less cramped.** On big screens the pages used to sit
  in a narrow centre column with large empty margins; the layout now uses much
  more of the width (shell 68→78rem, reading columns a touch wider), so nothing
  feels boxed-in.
- **The featured product leads with its screenshot.** The home "Featured" panel
  is now image-forward: the Sole Focus screenshot is the dominant element, the
  text beside it is trimmed (the repeated bullet highlights were removed), and
  the panel has more breathing room.
- **Bigger product screenshots.** The gallery on each product page breaks out
  wider (to 72rem) so the app imagery is more prominent.

### Internal

- Presentation-only: two width tokens + home layout + gallery max-width (with a
  matched responsive `sizes` hint so no oversized image is fetched). No product
  data, copy, or client JS changed. Verified no horizontal overflow at 1440 /
  960 / 390. **AUDIT-0007 + ENH-0005** (due at feature step 35) run alongside.

## [0.33.0] — 2026-07-17

Taste-round picks T2 + T5 (STEP-0034 + STEP-0035, user-approved copy).

### Added

- **"For you if / Not for you if."** Two honest cells at the top of the product
  details help visitors self-select: who the app serves, and what it
  deliberately doesn't do (no blocking, no team tracking, no sync).
- **A maker's note.** The description now opens with two short first-person
  paragraphs on why Sole Focus exists and what it refuses to become — signed
  by the maker.

### Fixed

- The facts line under the download button could push the page sideways at some
  window widths (it refused to wrap). Facts now wrap naturally; no horizontal
  overflow at any tested width.

## [0.32.0] — 2026-07-17

Screenshot transcript (STEP-0032, design-review adoption).

### Added

- **Read the screenshots as text.** A "Screenshot transcript" disclosure below
  the gallery lists all five screenshots as titled text descriptions — for
  anyone who can't or won't operate the carousel. Built with the native browser
  disclosure element (works without JavaScript) and sourced from the same
  descriptions that power the images' alt text.

## [0.31.0] — 2026-07-17

First-glance facts (STEP-0031, design-review adoption).

### Added

- **Everything you need to know before downloading, in one glance.** A quiet
  facts line now sits right under the download button on the product page and
  home spotlight: "Free — no in-app purchases, no subscription · macOS 10.15 or
  later · Works offline — no account, no cloud, no tracking". The home spotlight
  also gained the maker/support line the product page already had. All facts
  come from the product content file and restate already-verified claims.

## [0.30.0] — 2026-07-17

Purchase-decision information beside the download button (STEP-0030).

### Added

- **"Requires macOS 10.15 or later"** now sits right under the download button —
  verified against the live App Store listing, so buyers know compatibility
  before they leave.
- **A quiet trust line:** "Made by Mete Kaplan · direct support, usually replies
  in 2–3 business days", linking the About and Support pages. Every claim is
  sourced from those pages.

### Fixed

- **Platform badges now say "macOS"** instead of the internal token "macos", on
  the product page and catalog — labels come from one shared map also used by
  the structured data, so they can never drift apart.

## [0.29.0] — 2026-07-17

Small-screen usability (STEP-0029, adopting external design review findings).

### Changed

- **The phone header no longer eats a third of the screen.** On narrow screens
  the five navigation links used to wrap into extra rows (~146px of header
  before any content). The brand now stays on one row and the links sit in a
  single swipeable row with a soft fade hinting there's more — measured 146px →
  94px at 390px wide. No JavaScript involved.
- **Easier tapping.** Navigation links and the screenshot-gallery dots now have
  comfortable touch areas (≥44px on touch screens) while keeping their exact
  visual size.

## [0.28.0] — 2026-07-15

Top-of-page download buttons (STEP-0028).

### Added

- **The download button is now impossible to miss.** A polished "Download on the
  Mac App Store" button (Apple mark, accent style) now sits at the top of every
  relevant page: the home hero (leading action), the home spotlight, the product
  page header, and the catalog card. Previously the only download link sat at
  the bottom of the product page; that "Get it" section remains too.

### Internal

- One reusable `DownloadButton.astro` renders a product's first available store
  link (md/sm sizes); data-driven from the content file, renders nothing for
  unreleased products, accessible name includes the product.

## [0.27.0] — 2026-07-15

Sole Focus is live on the Mac App Store (STEP-0027).

### Added

- **Download button.** The Sole Focus page's "Get it" section now links to the
  real Mac App Store listing (verified against the live store page: "Sole Focus:
  Pomodoro Timer", seller Mete Kaplan, free). The catalog card shows the store
  link too.
- **`offers` structured data.** Released products with a declared price and an
  actionable store link now emit a truthful `offers` block (price 0 USD, InStock,
  store URL) in the SoftwareApplication JSON-LD — the deferred "release pass",
  making the page eligible for richer search results. Ratings remain deliberately
  un-emitted (no data).

### Changed

- **Status flipped to Released** across the site (detail badge, catalog, home
  "shipped" counter) — all driven from the one product content file. The
  "currently in development — coming soon" line is gone; release date recorded
  (2026-07-15).

## [0.26.1] — 2026-07-07

### Fixed

- **No more sideways jump when moving between pages.** The logo and site title (and
  all centered content) used to shift a few pixels left/right when you navigated
  from a page that scrolls to one that doesn't, because the vertical scrollbar
  appearing/disappearing changed the usable width. The scrollbar's space is now
  always reserved (`scrollbar-gutter: stable`), so the layout holds a constant
  width and the header stays put. CSS-only; invisible where scrollbars overlay
  (default macOS).

## [0.26.0] — 2026-07-07

Swipeable product screenshot gallery (STEP-0026).

### Changed

- **App screenshots are now a swipeable gallery instead of a long stack.** On each
  app page (e.g. Sole Focus) the screenshots no longer stack vertically — you see
  one large screenshot at a time and move between them with left/right arrows, a
  row of dots, swipe, or the keyboard. The image size is unchanged; the section
  stays compact no matter how many screenshots a product has, so the description
  and highlights below it are reachable without a long scroll. Larger, higher-
  contrast arrow buttons and dots, styled with the site's accent color.

### Internal

- `ScreenshotShowcase.astro` rebuilt on a CSS scroll-snap track (native swipe /
  trackpad works with zero JS); a small progressive-enhancement script wires the
  arrows, dots, keyboard, live counter, and end-state disabling. Honors
  `prefers-reduced-motion`. Still CSS-first, no third-party libraries.
- Accessibility: the scroll track is a focusable region with clean list
  semantics and arrow-key navigation; verified axe-clean in-browser so the
  Lighthouse a11y gate (≥0.95) stays green.

## [0.25.0] — 2026-07-07

Centered, balanced layout across the whole site (STEP-0025).

### Changed

- **Content is now centered, not pushed to the left.** Every page's reading
  column — the home hero, page headers, about, support, privacy, and the app
  pages — now sits centered in the window with even margins on both sides,
  instead of hugging the left edge with empty space on the right. Card grids
  center their cards under the centered heading, so one product or many always
  looks balanced. Long paragraphs stay left-aligned for comfortable reading.

### Internal

- One shared convention (`margin-inline: auto` on reading columns, documented at
  the `--maxw-prose` token) applied system-wide; grids use `auto-fit` + a capped
  column width + centered tracks. CSS-only; zero client JS. Verified centered
  with no horizontal overflow at desktop and mobile. Full-system integrity audit
  (AUDIT-0005) run alongside — all areas pass.

## [0.24.0] — 2026-07-07

Refreshed Sole Focus copy from the v2 store-listing pack (STEP-0024).

### Changed

- **Clearer, more appealing Sole Focus page.** New summary, sharper feature
  highlights, and a description now split into scannable sections — Two ways to
  work, Calm and always in reach, See your progress, Private offline yours — plus
  a short FAQ. The page reads as tidy, divided blocks instead of one block of text.
- **Better search wording.** The page's title and description now lead with the
  terms people actually search (Pomodoro, stopwatch, private, offline, menu-bar),
  grounded in real competitor/keyword research. Every claim stays truthful — no
  account, no subscription, no tracking, and it is not an app blocker.

### Internal

- Copy applied from the reviewed v2 copy pack to the single Sole Focus content
  file, so it flows consistently to the home spotlight, the product card, and the
  `SoftwareApplication` structured data. Detail-page prose gained section-heading
  styling. Owner-only pre-submit actions (trademark, live counters, marketing URL)
  remain open in the pack's submission sheet.

## [0.23.0] — 2026-07-07

Real Sole Focus screenshots (STEP-0023).

### Added

- **The real app, front and centre.** Five finished product screenshots now lead
  the site: a full-width showcase gallery on the Sole Focus page, and the lead
  shot featured big in the homepage spotlight. Each is shown as its complete,
  designed scene.

### Internal

- Screenshots are optimized at **build time** via `astro:assets` — the five
  2880×1800 source images (14 MB) become ~900 KB of responsive WebP, and no
  original PNG ships. A new `ScreenshotShowcase` component + a `resolveScreenshot`
  helper drive it from the product's content, so the content stays the source of
  truth. Still **zero client JavaScript**. Two content tests guard that every
  screenshot has alt text and a real asset file.

## [0.22.0] — 2026-07-03

Structured data for search & answer engines (STEP-0022).

### Added

- **Search-engine structured data (JSON-LD).** Every page now carries Schema.org
  metadata so Google, Bing, and AI answer engines can understand the site: the
  home page describes the studio (`Organization`) and the site (`WebSite`), the
  Apps & Games page lists the catalog (`ItemList`) with breadcrumbs, and each
  product page describes the app or game (`SoftwareApplication` / `VideoGame`)
  with its platform, features, and breadcrumbs. This can enable richer search
  results without changing anything you see on the page.

### Internal

- New `src/lib/schema.ts` builders + an injection-safe `JsonLd.astro` component,
  wired through an optional `schema` prop on `BaseLayout`. The graphs are kept
  **truthful** — no prices, offers, or star ratings are asserted for an app that
  hasn't shipped. Ships **zero client JavaScript** (JSON-LD is inert data).

## [0.21.0] — 2026-07-03

Code-review remediation (STEP-0021).

### Changed

- **Cleaner clickable icons.** The product icon stays clickable, but where its
  link duplicates an adjacent one (a card's title, the spotlight's name/button),
  it no longer adds a redundant tab stop or repeated screen-reader link — better
  for keyboard and assistive-tech users. The privacy page's icon (the only link
  to the app there) stays fully labelled.

### Internal

- De-duplicated the `ProductAvatar` markup (the icon is authored once and wrapped
  in a link only when needed), so the linked and unlinked forms can't drift.

## [0.20.0] — 2026-07-03

Clickable product icons (STEP-0020).

### Added

- A product's **icon is now a link to that product** everywhere it appears — the
  home spotlight, the app cards, and the per-product privacy page — so clicking
  the icon opens the item, just like the title does. The icon gets a subtle
  hover-lift and press, and an accessible "Open <product>" label.

### Notes

- On a product's own detail page the icon is intentionally not a link (you're
  already there).

## [0.19.0] — 2026-07-03

Premium craft polish (STEP-0019) — the small details that make a site feel
high-end, informed by studying Linear and micro-interaction best practices.

### Added

- **Tactile buttons** — a subtle press-down when clicked, a crafted top-edge
  highlight, and a soft glow on hover.
- **Animated link underlines** in reading areas — they slide in on hover instead
  of snapping.
- **Refined cards** — a faint edge that brightens as the card lifts on hover.
- **Finishing touches** — accent-tinted text selection, a subtle on-theme
  scrollbar, and smooth scrolling.
- Scroll-reveal motion now applies consistently on the about, support, and
  privacy pages too.

### Changed

- **Typographic precision** — headlines now balance their line breaks (no lonely
  orphan words), body copy avoids short orphan lines, and dates use even
  tabular figures.

### Notes

- All of it is CSS-only (no JavaScript), respects `prefers-reduced-motion`, and
  stays within the static / zero-cost / accessible constraints.

## [0.18.0] — 2026-07-03

More complete privacy policies (STEP-0018), informed by researching a rival
policy (Flexibits) and Apple's Guideline 5.1.1 rejection criteria.

### Added

- Every privacy policy now includes four standard sections it was missing:
  **How your data is protected** (frames local-first as the strength it is),
  **Children's privacy**, **Your rights**, and **Changes to this policy**.
- Wording adapts automatically: "This website" for the site-wide policy vs "This
  app" for a product policy, and local-storage vs no-storage phrasing.

### Notes

- All text stays truthful to the collects-nothing reality (e.g. "Your rights"
  states there's nothing to retrieve because nothing is held).
- **Before submitting Sole Focus** (operational, not website): enable Cloudflare
  Email Routing so `support@metkapstudio.com` receives mail; set App Store
  Connect App-Privacy labels to "Data Not Collected"; confirm the app's
  `PrivacyInfo.xcprivacy` privacy manifest.

## [0.17.0] — 2026-07-03

Automated accessibility gate in CI (STEP-0017).

### Added

- **Lighthouse CI accessibility gate.** Every push, PR, and deploy now runs
  Lighthouse against the built pages and **fails on accessibility regressions**
  (contrast, alt text, labels, heading order, etc.). Performance / SEO /
  best-practices are reported as warnings so normal CI-runner variance never
  blocks a deploy. Free, static, no third-party service. Resolves the long-open
  a11y-automation gap (LEDGER-002).

### Fixed

- The governance validator failed inside GitHub Actions' detached-HEAD checkout;
  it now recovers the branch name from the CI environment, so the CI governance
  check passes.

### Internal

- Dev-only `@lhci/cli` dependency; nothing new ships to the site (production
  `npm audit --omit=dev` is clean).

## [0.16.0] — 2026-07-03

More appealing, dynamic home + app pages (STEP-0016), informed by studying how
top App Store / Mac App Store creators build their sites.

### Added

- **Featured product spotlight** on the home page — the lead app now gets a rich
  panel (large icon, status, an emotional one-line pitch, real feature highlights,
  and View / Privacy actions) instead of a small card.
- **Feature grid** on the app page — the feature list is now a scannable grid of
  check-marked cards.
- **Tasteful scroll-reveal motion** — sections and cards gently fade + rise into
  view as you scroll. Pure CSS (`animation-timeline`), no JavaScript; disabled for
  `prefers-reduced-motion` and gracefully absent where unsupported (content always
  visible).

### Notes

- Kept honest: no fabricated App Store badges, press logos, testimonials, user
  counts, or screenshots (Sole Focus is unreleased). Device mockups / real
  screenshots remain queued until the app ships.

## [0.15.0] — 2026-07-03

Research-driven UI polish + accessibility fix (STEP-0015).

### Added

- **`ProductAvatar` component** — one shared icon-or-monogram lockup used by the
  home/catalog cards, the app detail header, and the privacy header, so the same
  product looks identical everywhere.

### Fixed

- **Accessibility:** the `--faint` text colour failed WCAG AA (3.9:1 on the
  background); darkened the background relationship so it now clears **4.5:1**
  everywhere (footer, meta lines, captions).

### Changed

- **Readability:** tightened the shared reading column (`--maxw-prose` 44→40rem)
  to sit inside the ~45–90-character comfortable range (Butterick).
- **Cleaner cards:** elevated cards (home/catalog, app detail header) drop the
  stacked border and rely on one separation cue — an elevated surface + shadow
  (Refactoring UI).
- Removed the duplicated monogram logic from ProductCard and the detail page
  (now centralised in `ProductAvatar`) — resolves the LEDGER-001 tech-debt item.

## [0.14.0] — 2026-07-02

UI polish pass + clearer website privacy scope (STEP-0014).

### Changed

- **Consistent layout across pages.** Introduced a shared `--maxw-prose` reading
  column; every content page (about, support, privacy, app detail, page headers,
  404) now uses the exact same measure, so text and edges line up page to page.
- **Unified the product icon.** The app icon is now presented identically on a
  product's detail page and its privacy page (same size, radius, shadow).
- **Main privacy page is now explicitly the *website* policy** — retitled
  "MetKap Studio Website Privacy Policy", states up front that the apps and games
  are separate (and some collect data), and lists their own policies under an
  "App & game privacy policies" section. Prevents confusing the website's
  "collects nothing" statement with the apps.

### Fixed

- The app detail footer separator rendered as `·Support` (no space); now
  `Privacy policy · Support`.

## [0.13.0] — 2026-07-02

Product app icon on privacy pages + current Sole Focus icon (STEP-0013).

### Added

- Each per-product privacy page now shows the **app's icon** beside the title,
  as a rounded app tile with a soft shadow. The site-wide policy shows none.

### Changed

- Replaced the Sole Focus icon with the **current** one shipped in the app
  (orange-rimmed clock, dark center, sepia tile), sourced from the app's own
  SVG export so it stays crisp at any size. Home card and privacy header share
  the single source.

## [0.12.0] — 2026-07-02

Privacy pages redesigned for readability (STEP-0012).

### Changed

- Privacy pages are now **easy to scan**: an "at a glance" chip strip (data /
  account / third-party status), a one-line summary, then **strictly separated
  sections** — each with its own headline, bullets, and divider.
- The long retention paragraph is split into a **"Stored only on your device"**
  bullet list plus a short deletion line, and a **Permissions** section.
- Policy content trimmed to remove the redundant prose narrative.

### Added

- `storedLocally[]` and `permissions[]` fields on the privacy content model.

### Notes

- Full Apple Guideline 5.1.1(i) coverage preserved. UI/content/schema only;
  still fully static.

## [0.11.0] — 2026-07-02

MetKap Studio brand logo — the "Studio Gem" (STEP-0011).

### Added

- Studio **favicon + PWA icon set** and `site.webmanifest` (`public/`): SVG +
  16/32/48 favicons, apple-touch-icon, 192/512 + maskable PWA icons.
- **OG/social image** (`og-image.png`) + `og:image`/`twitter:image` head tags.
- Visible **logo mark** in the nav next to "MetKap Studio".

### Changed

- Replaced the placeholder "MK" favicon with the Studio Gem across tab, home
  screen, and social previews.

### Notes

- Installed from the user's icon-generator export v0001 per its `web/AGENTS.md`
  (export unmodified). Provenance recorded in `UI_DESIGN.md`. Still fully static.

## [0.10.0] — 2026-07-02

First real product: **Sole Focus** (STEP-0010).

### Added

- **Sole Focus** product page — a calm, local-first Pomodoro + stopwatch focus
  app for macOS (in development), with real features and its **real app icon**.
- Sole Focus **privacy policy**, accurate to the app: collects nothing, fully
  offline/local-first, with the retention/deletion statement.
- Product cards and detail pages now render a product's **real icon** when
  present (falling back to the initials monogram).

### Removed

- The three placeholder demo products (Aurora Notes, Pixel Drift, Tempo Timer)
  and their per-product policies, so the live site shows only the real product.

### Notes

- Learned from the read-only `../PromodoApp/` codebase (unmodified). Sole Focus
  store link + screenshots to follow once it's published. Still fully static.

## [0.9.0] — 2026-07-02

App Store review readiness for privacy/support pages (STEP-0009).

### Changed

- **Privacy pages** now present Apple Guideline 5.1.1(i) as clear labeled
  sections: what data is collected, **how it's used**, third-party sharing with
  an **equal-protection** confirmation (and a "no third-party AI" statement), and
  a **retention/deletion + how-to-request** statement.
- Privacy content model now **requires** a `retention` statement (plus optional
  `dataUse`, `hasAccounts`) — an incomplete policy fails the build.
- Support page shows a monitored-inbox **response expectation** (Guideline 1.5).
- Corrected the contact email in policy content to `support@metkapstudio.com`.

### Added

- `SECURITY.md` "App Store review readiness" section with developer
  responsibilities and a clear **not-legal-advice** caveat.

### Notes

- Reduces common *structural* rejection causes; does **not** guarantee approval.
  Real apps must keep policies truthful, enable the support mailbox, and add
  in-app account deletion where accounts exist. Still fully static.

## [0.8.0] — 2026-07-02

Custom domain metkapstudio.com (STEP-0008).

### Changed

- Site now targets **metkapstudio.com** at the root: `astro.config` `site` +
  `base: '/'`, `public/CNAME`, `robots.txt`/sitemap on the domain, and
  `support@metkapstudio.com`. `withBase()` is a no-op at root (kept for safety).
- GitHub Pages custom domain set to metkapstudio.com.

### Notes

- **Live HTTPS on the domain is pending user-side Cloudflare DNS + GitHub
  certificate provisioning** (up to 24h) — records and steps in `DEPLOYMENT.md`.
  Enforce HTTPS + domain verification + Cloudflare Email Routing are the
  post-DNS follow-ups. Still fully static.

## [0.7.0] — 2026-07-02

Dark-premium theme rolled across the remaining pages (STEP-0007).

### Changed

- New shared **`PageHeader`** component; consistent headers/spacing on catalog,
  support, and about.
- **Product detail** page polished: elevated header panel, gradient screenshot
  frames, store links as primary/secondary **buttons**, refined metadata.
- **Privacy** policy pages: data-facts now in a subtle bordered panel.
- **Support** page: email is a primary button; two-column guidance.
- The whole site now matches the home page's dark-premium quality.

### Notes

- UI-only — no product/data/logic changes. Enhancement checkpoint ENH-0001
  accepted a real-image pipeline and a11y/Lighthouse CI to the backlog.

## [0.6.0] — 2026-07-02

Rebrand to MetKap Studio (STEP-0006).

### Changed

- The site brand is now **MetKap Studio** — wordmark, page titles, hero, footer,
  and SEO/OpenGraph. Centralized in `src/lib/site.ts` (new `person` field keeps
  the studio brand distinct from the developer's name).
- About page attributes the studio to Mete Kaplan; tagline/description use the
  studio voice.

### Notes

- Future domain **metkapstudio.com** is deferred to the custom-domain step (set
  `site`/`base`/`CNAME`/robots + `support@metkapstudio.com` there). Support email
  stays a placeholder until then. Content-only; no data/logic changes.

## [0.5.0] — 2026-07-02

Dark-premium Apple-minimal design system + home (STEP-0005).

### Changed

- New **"light dark" design system**: elevated graphite surfaces (not black),
  SF Pro type scale, restrained periwinkle accent, hairline borders + soft
  shadows, spacing rhythm, and motion tokens — all in `src/styles/global.css`.
- **Shell** reflects it: translucent sticky header, refined nav pills, footer,
  and badges; new primary/secondary button styles.
- **Home page** redesigned: cinematic hero with accent glow, display type, CTA
  buttons; refined featured grid; elevated product cards with tasteful hover.
- Site is now dark-first (`color-scheme: dark`, theme-color). Other pages inherit
  the new tokens; bespoke per-page polish follows in later steps.

### Notes

- UI-only — no product/data/logic changes. Motion respects
  `prefers-reduced-motion`; contrast meets WCAG AA. Audit AUDIT-0001 (all Pass).

## [0.4.0] — 2026-07-02

Live on GitHub Pages (STEP-0004).

### Added

- Continuous deployment to a **GitHub Pages project site**
  (`https://metekaplangit.github.io/solo-developer-portfolio-website/`) via
  `.github/workflows/deploy.yml` (Actions → Pages, least-privilege).
- `withBase()` link helper (`src/lib/url.ts`) so all internal links resolve under
  the project sub-path; 5 unit tests.

### Changed

- `astro.config.mjs` now targets the Pages project site (`base` + `site`); all
  internal links routed through `withBase()`.
- `robots.txt` sitemap URL points at the project site.

### Notes

- **Custom domain deferred to the end of the project** (user decision). Reverting
  is a documented late step (`site`→domain, `base`→`/`). Still fully static.

## [0.3.0] — 2026-07-02

Core site-completeness essentials (STEP-0003).

### Added

- Custom **404** page linking back to the main sections.
- **`robots.txt`** allowing crawlers and referencing the sitemap.
- Auto-generated **sitemap** (`/sitemap-index.xml`) via `@astrojs/sitemap`
  (build-time only; static XML; MIT).
- **Favicon** (inline SVG) linked from every page.

### Changed

- CI now runs the unit-test suite (`npm test`) as a merge gate (was previously
  not wired) — from Discussion checkpoint DISC-0001.

### Notes

- Sitemap/robots use a placeholder domain until the custom domain is live (M4).
- Still fully static; `@astrojs/sitemap` adds no runtime service. `npm audit`
  clean.

## [0.2.0] — 2026-07-02

Reusable product-detail page pattern (STEP-0002).

### Added

- Per-product detail page at `/apps/<slug>/`, generated for every product,
  rendering identity, platforms, summary, long description, features, store
  links, screenshot placeholders (with alt text), release/updated metadata, and
  canonical privacy + support links.
- "More apps/games" related-products section (same type, self excluded) via a
  new `relatedProducts` helper.
- Home and catalog product cards now link to the detail page.
- Per-product SEO/OpenGraph title + description on detail pages.

### Notes

- Screenshots remain honest placeholders; a real image-optimization pipeline is
  a later packet. Still fully static, no backend or third-party services.

## [0.1.0] — 2026-07-02

First usable slice: the content model and static shell (STEP-0001).

### Added

- Typed content model with Zod validation: **Product, StoreLink,
  PrivacyPolicyEntry, MediaAsset** (`src/content/schema.ts`). Invalid content
  fails the build.
- Astro content collections for products and privacy policies with sample
  content (Aurora Notes, Pixel Drift, Tempo Timer).
- Static shell: base layout, primary nav, footer, and design tokens with light/
  dark support, a skip link, and reduced-motion handling.
- Routes rendering from content: home (featured), Apps & Games catalog, privacy
  overview + per-product privacy routes (`/privacy/<product>/`), support, about.
- Pure, unit-tested domain helpers (`src/lib/`) and a **Vitest** suite
  (25 tests). Basic SEO/OpenGraph metadata per page.

### Notes

- Fully static (`output: 'static'`), no backend or third-party services.
- Project initialized (Milestone 0) on Astro 7.0.5 as an internal baseline
  (no tag); this is the first tagged product version.

---

Released versions are reverse-chronological and append-only.
