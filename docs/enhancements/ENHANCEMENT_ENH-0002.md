# Enhancement Checkpoint ENH-0002

- **Trigger:** Completion of feature step #14 (STEP-0014); Enhancement cadence =
  every 7 feature steps. Due at #14; run here (surfaced by MC-OD-0005).
- **Reviewed range:** Whole product at v0.14.0.
- **Date:** 2026-07-02.

## Context

Since ENH-0001 (v0.7.0): custom domain + HTTPS, Apple-ready per-product privacy,
first real product (Sole Focus) with its current app icon, the Cloudflare proxy,
and a UI-polish pass (shared reading column, icon parity, website-scoped privacy).
The site is live, static, zero-cost, consistent, and reviewer-friendly. This
checkpoint re-triages the backlog and the polish candidates raised during
STEP-0014.

## Candidate enhancements

| # | Idea | Benefit | Risk / cost | Disposition |
|---|---|---|---|---|
| N1 | **Unify the product header** across detail + privacy (same lockup: icon + name/title, same container treatment) | Consistency; the same product reads identically everywhere | Small, CSS/markup only | **Accepted → next UI packet.** |
| N2 | **Vertical-rhythm pass** — standardize page-top spacing so every page's title sits at the same height (back-link pages currently start higher than PageHeader pages) | Polish; calmer cross-page feel | Small, spacing tokens only | **Accepted → next UI packet.** |
| N3 | **Home hero treatment** — bring the hero into the shared system or give it a deliberately grander, intentional layout | Stronger landing impression | Medium; art-directed, judge visually | **Roadmap candidate** (pairs with N1/N2). |
| E1 | **Real image-optimization pipeline** (`astro:assets` `<Image>`) for icons/screenshots | High — visual credibility once real art exists | Needs real screenshots; build-time only | **Roadmap packet** (carried from ENH-0001) — do when Sole Focus screenshots exist. |
| E2 | **Automated a11y / Lighthouse CI** (LEDGER-002) | Catches regressions the manual pass misses | Small CI addition; free | **Roadmap packet** (carried). |
| E3 | **Per-page OG images** | Better social link previews | Extra build step; stays static | **Roadmap (later).** |
| C1 | **Changelog / "Updates" block** on-site | Shows the product is alive; low effort | Small; content model already supports dates | **Roadmap candidate.** |
| O1 | **Cloudflare Email Routing** so `support@metkapstudio.com` receives mail | Required before Sole Focus ships (support URL must work) | User dashboard action; free | **Accepted → pre-launch task** (user-run; documented in DEPLOYMENT.md). |
| E7 | **Extract `ProductAvatar`/`monogram()` helper** (LEDGER-001) — icon lockup now duplicated in ProductCard + detail + privacy | Maintainability; DRY | Trivial refactor | **Accepted (rule-of-three now met)** → fold into the N1 header-unify packet. |
| E4/E5/E6 | View Transitions / light-theme toggle / press-kit | — | Adds JS or scope | **Parked** (unchanged from ENH-0001). |

## Original combination worth noting

- **One header lockup + one avatar component.** N1 + E7 together: extract a single
  `ProductAvatar` (icon-or-monogram) and one product-header lockup used by the
  card, the detail page, and the privacy page. Kills LEDGER-001, guarantees N1's
  consistency by construction, and gives one place to evolve the product identity.

## Dispositions summary

- **Accepted → next UI polish packet:** N1, N2, E7 (as one "unify product
  header + ProductAvatar" packet). N3 and C1 are strong follow-ups.
- **Pre-launch task (user-run):** O1 (email routing) before Sole Focus ships.
- **Carried on roadmap:** E1, E2, E3 (trigger-gated).
- **Parked:** E4, E5, E6.
- Nothing implemented in this checkpoint (append-only review). No security /
  license / complexity red flags. Static + zero-cost ethos preserved.

## Follow-ups

- Next Enhancement after feature step #21. Discussion + Audit after #15; Markdown
  Consistency after #16.
- LEDGER-001 is now ripe (third use); resolve inside the N1/E7 packet.
