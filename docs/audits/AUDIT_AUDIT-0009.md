# Audit Checkpoint AUDIT-0009 — Smoothness

- **Trigger:** On-demand smoothness run (`/smooth-project`).
- **Reviewed range:** HEAD `cf515d8` (v0.44.10), local build and the live site at
  `https://metkapstudio.com/`.
- **Date:** 2026-08-01.
- **Impact bar:** a finding earns a Step Packet only if a real visitor would feel
  it. Everything below that is recorded here in one line and left alone.

## How this was measured

| Item | Detail |
|---|---|
| Surface | Headless Chrome 148 driven over CDP, 1440×900, DPR 1. No screen taken. |
| Build | `npm run build`, 8 routes, 793 ms. Clean tree, `main`, in sync with `origin`. |
| Instruments | Navigation Timing, Paint Timing, LCP, Layout Instability, Long Animation Frames, Event Timing, `performance.memory`, rAF frame deltas. |
| Passes | Local cold + warm, local throttled (Slow-4G profile, 4× CPU), and live cold + warm over the real network and Cloudflare. |
| Data volume | The real published content: 8 routes, 1 product, 5 gallery screenshots at 46 built variants, 1.8 MB `dist`. Stated because there is no larger volume to test — the catalog holds one product today. |
| Harness note | Headless Chrome detached its frame on roughly one launch in three on this machine, regardless of flags, and independently of view transitions (checked with `--disable-blink-features=ViewTransition`). Every measurement therefore retries up to three times. This is host instability, not a site defect. |

The Browser pane could not be used for timing: its tab reports
`visibilityState: hidden`, so it never paints and `requestAnimationFrame` never
fires. Its first-paint entry read 9584 ms — an artifact of the hidden tab, not
the site. All paint, frame and LCP numbers below come from headless Chrome.

## Budgets, set before measuring

| Area | Target | Source |
|---|---|---|
| LCP, cold | < 2.5 s | web.dev Core Web Vitals |
| INP / first feedback | < 200 ms, perception floor 100 ms | web.dev + perception thresholds |
| CLS | < 0.1 | web.dev Core Web Vitals |
| Cold load to usable | < 2 s | skill baseline |
| Page-to-page change | < 300 ms | skill baseline |
| Scroll worst frame | inside the display budget (16.7 ms) | skill baseline |
| Long animation frames | none > 50 ms after load | Chrome Long Animation Frames |
| Typing, heavy operations, drag | N/A | no text input, no search/filter/sort, nothing draggable |

Platform guidance was checked live rather than assumed: web.dev still states
2.5 s / 200 ms / 0.1 at the 75th percentile, and Chrome's Long Animation Frames
API defines a long frame at ≥ 50 ms. Where SEO blog summaries and web.dev
disagreed on nuance, web.dev was followed.

## The one table

Sorted worst first. Live numbers are cold, over the real network.

| Interaction | Measured | Budget | Gap | Cause |
|---|---|---|---|---|
| Support email present in served HTML | **absent** on the live site | present | fails | Cloudflare Email Obfuscation rewrites `support@metkapstudio.com` into `__cf_email__` + `/cdn-cgi/l/email-protection#…`, readable only after injected JS runs. The build ships the address as plain text twice. |
| Third-party JS on every page | **2 scripts, 2 extra origins** | 0, by the project's own rule | fails | Cloudflare injects `email-decode.min.js` and requests `static.cloudflareinsights.com/beacon.min.js`. Neither exists in `dist`. |
| Cold LCP, home (live) | 788 ms | 2500 ms | met, 3.2× headroom | TTFB 300–490 ms, then a round trip for two render-blocking stylesheets. |
| Cold LCP, about (live) | 736 ms | 2500 ms | met | same shape; LCP is the `H1`. |
| Cold LCP, privacy (live) | 676 ms | 2500 ms | met | same shape. |
| Cold LCP, product (live) | 620 ms | 2500 ms | met | LCP image starts with the CSS at 383 ms, done at 542 ms — correctly prioritised. |
| Cold LCP, catalog (live) | 600 ms | 2500 ms | met | LCP image, eager. |
| Cold LCP, support (live) | 592 ms | 2500 ms | met | same shape. |
| Scroll, worst frame (privacy) | 33.4 ms — 1 frame of 35 | 16.7 ms | 1 dropped frame | single frame; every other route held 60 fps end to end. |
| Page-to-page change | 96–123 ms | 300 ms | met | full static navigation, no SPA. |
| Warm load, all routes | FCP 128–164 ms | 1000 ms | met | stylesheets cached. |
| Gallery click handler | < 0.2 ms | 100 ms | met | 1.1 KB handler, `scrollTo` plus attribute writes, no layout thrash. |
| CLS, all six routes | 0.0000 | 0.1 | met | images carry dimensions; no late-injected content. |
| Long animation frames | 1 per load, `blockingDuration` 0 | none > 50 ms post-load | met | the initial style-and-layout frame, no scripts, never blocked input. |
| Memory over a session | **not measured** | returns near post-launch | unproven | the renderer died three times on the gallery-hammering path. Each page is a fresh document with 1.1 KB of JS, so cross-page growth is not structurally possible, but the claim is not proved. |

### The feel verdict

**Instant** on everything that could be timed. Cold loads land at 592–788 ms on
the real network with 3× headroom against LCP, warm loads at 128–164 ms,
navigation at ~110 ms, scroll at a steady 60 fps, CLS exactly zero on every
route, and no frame anywhere blocked input.

The picture is even. There is no screen that lags, no interaction that hitches,
and no heavy operation to wait on. This site ships 1.1 KB of its own JavaScript
and no web fonts, and it shows.

**The two findings above are not speed.** They were found only because this run
measured the live artifact rather than the local build, and they matter more than
any millisecond available here.

### TTFB breakdown, live cold (home, two samples)

| Phase | Sample 1 | Sample 2 |
|---|---|---|
| DNS | 1.1 ms | 0 ms |
| TCP connect (incl. TLS 69–70 ms) | 166.8 ms | 135.8 ms |
| Request → first byte | 129.1 ms | 188.8 ms |
| Response body | 0.4 ms | 0.4 ms |
| **TTFB** | **299.2 ms** | **408.9 ms** |

The document itself transfers in 0.4 ms. TTFB is connection setup plus edge
response, not the site's own work, and is not addressable from this codebase.

## Below the bar — recorded, not scheduled

- **Two render-blocking stylesheets cost a round trip.** `BaseLayout.css`
  (3785 B) and one page stylesheet (1682–2220 B) both block first paint and land
  at 482–704 ms; FCP follows immediately. Inlining them — Astro's
  `build.inlineStylesheets: 'always'`, since all three files exceed the 4096-byte
  auto threshold — would remove roughly 100–200 ms from a cold visit. On a
  ~700 ms load that stays inside "the user notices a brief wait" either way, and
  it would make warm navigation marginally worse by re-sending the CSS per page.
  Not worth a packet on its own; worth folding into any future load work.
- **`site.webmanifest` pulls `icon-192.png` (5.5 KB) on every page load**,
  finishing last at 825–1067 ms and extending `loadEventEnd`. Standard browser
  behaviour for a manifest; no user waits on it.
- **One dropped frame on `/privacy/sole-focus/`** (33.4 ms of 35 frames) and one
  33.3 ms frame on `/apps/`. Single frames, not a pattern.
- **Throttled runs do not slow loopback.** CDP network emulation left TTFB at
  3–7 ms against `localhost`, so the local throttled pass measured CPU cost only
  (FCP 568–616 ms at 4× CPU). The live pass is the honest network number and is
  what the table uses.

## Findings

| ID | Severity | Finding | Disposition |
|---|---|---|---|
| SMOOTH-0009-1 | High | The live site serves no support email address. Cloudflare Email Obfuscation replaces it with `__cf_email__` and a `/cdn-cgi/l/email-protection#…` link that only injected JavaScript decodes. The build ships it as plain text. | Proposed as a Step Packet. |
| SMOOTH-0009-2 | High | The live site loads third-party JavaScript from two extra origins on every page — `email-decode.min.js` and a request to `static.cloudflareinsights.com/beacon.min.js` — against the project's stated "no analytics, no third-party runtime services" boundary and its published no-tracking claims. Neither appears in `dist`. | Proposed as a Step Packet. |
| SMOOTH-0009-3 | Info | Every timed budget is met with headroom. No performance packet is proposed. | Recorded only. |
| SMOOTH-0009-4 | Info | Session memory growth is unproven — the measurement path crashed the renderer three times. | Recorded only. |

## Evidence

Raw measurement output and the harness scripts are in
`~/Documents/VibeCoding/Tests/solo-dev-portfolio-websiteTests/`
(`r-live-*.json`, `r-fast-*.json`, `r-slow-*.json`, `i-fast.json`,
`measure.mjs`, `interact.mjs`, `ttfb.mjs`). Scratch, not project files.
