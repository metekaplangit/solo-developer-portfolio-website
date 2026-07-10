# Audit Checkpoint AUDIT-OD-0001 (on-demand)

- **Trigger:** User-requested full-scale system audit (consistency, integrity,
  zero drift, performance/workflow optimization). On-demand; does not reset the
  Audit cadence (next scheduled Audit after feature step #30).
- **Reviewed range:** AUDIT-0005 → HEAD (v0.25.0 → v0.26.1 + post-release
  checkpoint docs): the screenshot gallery (STEP-0026/v0.26.0), its a11y fixes,
  the scrollbar-gutter patch (v0.26.1), MC-0013, MC-OD-0009..0012, and the
  reverted Format B experiment.
- **Date:** 2026-07-07.

## Graded areas

| Area | Result | Notes |
|---|---|---|
| Correctness & traceability | Pass | STEP-0026 (retroactive Task Card) and v0.26.1 (compatible fix) each trace need → change → evidence → CHANGELOG → immutable tag. The Format B experiment was reverted uncommitted and is documented in MC-OD-0011 + memory, leaving zero residue (grep-verified). |
| Architecture & boundaries | Pass | Content collections remain the single source of truth; `ScreenshotShowcase` is a leaf component; the only client JS is its small inline progressive-enhancement script (no bundles). `scrollbar-gutter` fix is one CSS line at the token-owner layer. |
| Zero-cost / static guardrails | Pass | `output: 'static'` pinned; no SSR adapters, analytics, or third-party services in `package.json` (grep = 0); hosting remains GitHub Pages + Cloudflare free tier. |
| Tests & verification | Pass | 36 unit tests; build 8 routes; `astro check` 0/0/0; validator 40/40; Lighthouse a11y ≥0.95 enforced in both CI and deploy; gallery a11y regression was caught by the gate and fixed (axe-clean verified in-browser). |
| UI & accessibility | Pass | Gallery keyboard/swipe/counter accessible (focusable scroll region, clean list semantics); layout shift between pages eliminated (measured 5px → 0); reduced-motion honored throughout. |
| Security & privacy | Pass | `npm audit --omit=dev`: **0 vulnerabilities**; secrets scan over `src/ scripts/ .github/`: 0 hits; permissions in workflows least-privilege; no trackers. |
| Performance & efficiency | **Pass** | Measured: dist **1.3 MB** total (≈1.1 MB build-optimized WebP), **zero client JS bundles**, HTML 2–5 KB Brotli over the wire, full page load ~0.23–0.29 s via Cloudflare (HTTP/2, `content-encoding: br`). Nothing material left to optimize in the shipped payload. |
| Deployment & CI | **Pass (repaired)** | Finding F1 fixed this audit: all GitHub Actions bumped off deprecated-Node-20 majors — `checkout` v4→**v7**, `setup-node` v4→**v6**, `setup-python` v5→**v6**, `configure-pages` v5→**v6**, `upload-pages-artifact` v3→**v5**, `deploy-pages` v4→**v5** (latest majors verified live via `gh api .../releases/latest`). Also F2: `deploy-pages` `timeout` 1200000 → **600000** (the action's enforced max; the old value was clamped with a warning every run). Verified by the post-merge CI + deploy runs. |
| Dependencies & provenance | Pass | Pinned via committed lockfile; all media assets owned; dev-only `@lhci/cli` advisories never ship (prod audit clean). |
| Git & fresh-clone hygiene | Pass | Only `main`; 0 ahead/0 behind; no stashes/untracked; non-destructive history; immutable tags v0.1.0..v0.26.1 (v0.26.1 on origin); all work branches merged `--no-ff` then pruned. |
| Docs synchronization | Pass | STATUS/ROADMAP/CHECKPOINTS/CHANGELOG agree at v0.26.1 / feature step 26 (re-verified after MC-OD-0012); stale "20-min deploy timeout" note in STATUS repaired alongside F2. |
| AI followability | Pass | Resumable from STATUS alone: current step, tag, next-action candidates, standing autonomous-shipping rule (AI_WORKFLOW), and the Format B rejection are all on file without chat history. |

## Findings

| ID | Severity | Finding | Disposition |
|---|---|---|---|
| AUDIT-OD-0001-F1 | low | CI/deploy actions on majors that internally target deprecated Node 20 — GitHub force-runs them on Node 24 and warns on every run; the majors eventually hard-fail. | **Fixed this audit** — all six actions bumped to their latest majors (verified live); exercised by the post-merge CI + deploy runs. |
| AUDIT-OD-0001-F2 | info | `deploy-pages` `timeout: 1200000` exceeds the action's 600000 ms cap — clamped with a warning every deploy; STATUS described it as "20-min". | **Fixed this audit** — set to 600000 and corrected the STATUS note. |
| AUDIT-OD-0001-F3 | low | Fingerprinted immutable assets (`/_astro/*`) served with `cache-control: max-age=14400` (4 h) — repeat visitors re-validate assets that can never change. | **Owner action (Cloudflare dashboard)** — add a Cache Rule for `/_astro/*` with ~1-year edge/browser TTL. Config-only; outside the repo. |
| AUDIT-OD-0001-F4 | low | No security response headers on the live site (HSTS, `X-Content-Type-Options`, `Referrer-Policy`, CSP). GitHub Pages cannot set headers. | **Owner action (Cloudflare dashboard)** — Response-Header Transform Rules (free tier, not Workers; within the zero-cost guardrail). Likely the remaining Lighthouse best-practices gap. |
| AUDIT-OD-0001-F5 | info | Sole Focus FAQ not yet exposed as `FAQPage` JSON-LD (carried from AUDIT-0005-F3). | **Note** — top candidate next feature packet. |

No critical, security, data, or release-blocking findings; no merge-critical failure. Zero drift found.

## Follow-ups

- F3 + F4 are **user/dashboard actions** (Cloudflare Cache Rule + header rules) —
  the repo cannot ship them; revisit the live headers after they're applied.
- Next scheduled checkpoints unchanged: Discussion after feature step #27;
  Markdown Consistency + Enhancement after #28; Audit after #30.
- Highest-value next packets: `FAQPage` JSON-LD; lighter-touch description
  refresh (prose-preserving — Format B rejected); changelog/updates block; more
  products.
- AI_SEARCH refresh: no new AI capability changes to record this cycle.
