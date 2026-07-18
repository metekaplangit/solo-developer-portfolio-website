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

_Nothing pending. Next packet undecided — see ROADMAP._

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
