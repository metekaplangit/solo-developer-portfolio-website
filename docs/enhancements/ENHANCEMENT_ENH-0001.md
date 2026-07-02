# Enhancement Checkpoint ENH-0001

- **Trigger:** Completion of feature step #7 (STEP-0007); Enhancement cadence =
  every 7 feature steps.
- **Reviewed range:** Whole product at v0.7.0.
- **Date:** 2026-07-02.

## Sources

- Design references from prior rival research (Awwwards developer/portfolio
  winners; Apple HIG design principles; IndieAppLab) — official + curated.
- Official Astro docs for candidate capabilities (assets/`<Image>`, OG image,
  View Transitions). Advisory community posts corroborated against official docs.

## Candidate enhancements

| # | Idea | Benefit | Risk / cost | Disposition |
|---|---|---|---|---|
| E1 | **Real image-optimization pipeline** (`astro:assets` `<Image>` for icons/screenshots) replacing placeholders | High — visual credibility; the single biggest quality lever once real art exists | Needs real assets; build-time only (stays static/zero-cost) | **Roadmap packet** — do when the user provides real screenshots/icons. |
| E2 | **Automated accessibility / Lighthouse CI** (axe/pa11y or Lighthouse) on built pages | Catches a11y/perf regressions the manual pass can miss | Small CI addition; still free | **Roadmap packet** (ties off LEDGER-002). |
| E3 | **Per-page OG images** (static or satori-generated at build) for richer social sharing | Medium — better link previews | Extra build step; keep static | **Roadmap candidate** (after the domain, alongside SEO polish). |
| E4 | **View Transitions** (`<ClientRouter>`) for smooth cross-page motion | Polish; progressive enhancement | Adds a little client JS; must respect reduced-motion; guard the static ethos | **Parked** — reconsider once content is real; not worth the JS yet. |
| E5 | **Light theme + toggle** | Choice for light-preference users | State + a bit of JS | **Parked** — user chose dark-first; revisit only on request. |
| E6 | **Press-kit / devlog** pages | Future product surface (from the project idea) | Content-heavy | **Roadmap (later)** — when there's real news/press need. |
| E7 | **Extract `monogram()` helper** (LEDGER-001) | Maintainability | Trivial | **Deferred to 3rd use** per rule-of-three. |

## Original combination worth noting

- **"Assets-ready content model":** when E1 lands, wire the existing `MediaAsset`
  schema fields (dimensions/alt/license) directly into `<Image>` so screenshots
  become optimized, responsive, and provenance-tracked from one source — the
  content model already carries everything `<Image>` needs. Low novelty, high
  leverage; sequence E1 to consume the schema rather than bolt on ad-hoc images.

## Dispositions summary

- **Accepted → roadmap:** E1, E2 (and E3 later). Added as future UI/hardening
  packets in `ROADMAP.md`.
- **Parked:** E4, E5, E6 (revisit on trigger/request).
- **Deferred:** E7 (rule-of-three).
- No idea is implemented in this step (STEP-0007 stays scoped to the theme
  rollout). No security/license/complexity red flags.

## Follow-ups

- Next Enhancement due after feature step #14. Markdown Consistency after step 8;
  Discussion after step 9; Audit after step 10.
