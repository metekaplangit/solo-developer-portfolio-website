# Markdown Consistency Checkpoint MC-OD-0012 (on-demand)

- **Trigger:** On-demand wrap-up request (user going out) — verify cross-doc
  synchronization and a clean, ready repo.
- **Reviewed range:** Since MC-OD-0011. The only intervening turn was **advisory**
  (a performance/efficiency health check) — no code or doc changes were made.
- **Date:** 2026-07-07.

## Checklist results

| Check | Result | Notes |
|---|---|---|
| No changes since MC-OD-0011 | Confirmed | HEAD is the MC-OD-0011 merge (`757d5e1`); the performance discussion produced no commits. Nothing new to reconcile. |
| Tag / release agreement | Pass | STATUS `product_tag: v0.26.1`, STATUS "Version control" latest tag **v0.26.1**, CHANGELOG top release `[0.26.1]` — all agree. `v0.26.1` on origin. |
| Current step / feature count | Pass | `current_step: STEP-0026`; feature Steps **26** in both STATUS and CHECKPOINTS. |
| Tag ↔ HEAD | Pass (documented) | `v0.26.1` tags the fix merge; post-release checkpoint docs sit just ahead (docs-only). STATUS `head:` note genericized to "HEAD carries post-release checkpoint docs" so it no longer needs per-run edits. |
| Due checkpoints | Pass | `due_checkpoints: none`. Next scheduled: Discussion after 27; Markdown Consistency + Enhancement after 28; Audit after 30. On-demand runs do not reset cadence. |
| Canonical ownership / no duplicated workflow | Pass | Current-tag value lives in STATUS + CHANGELOG; VERSION_CONTROL policy-only; autonomous-shipping rule stated once in AI_WORKFLOW.md. |
| Code/paths reality matches docs | Pass | Detail page renders the original prose sections + Highlights grid; live at https://metkapstudio.com/apps/sole-focus/ (HTTP 200). |
| CHANGELOG accuracy | Pass | `[Unreleased]` = "Nothing pending"; `[0.26.1]`/`[0.26.0]` intact; no released section rewritten. |
| Issue/blocker agreement | Pass | LEDGER-001/002 resolved; blockers none; no new issues. |
| Merge-critical gates | Pass | `npm run check` 0/0/0; `npm run build` 8 routes; `npm test` **36 passed**; validator **40/40**, exit 0. |
| Git hygiene | Pass | On `main`, 0 ahead / 0 behind `origin/main` (before this checkpoint commit); clean tree; no stray/unmerged branches; no stashes. |

## Findings

**No drift.** Nothing changed since MC-OD-0011, so all owners still agree at
**v0.26.1**. Only this checkpoint's own bookkeeping was updated (on-demand range
→ 0012; genericized the STATUS `head:` note to avoid per-run churn).

## Health-check findings (from the advisory turn — recorded as follow-ups)

Measured site health is **excellent**: 1.3 MB total (≈1.1 MB optimized webp),
**zero client JS bundles** (only a tiny inline gallery script), HTML 2–5 KB over
the wire (Brotli), full load ~0.23–0.29 s, a11y gate enforced ≥0.95. Remaining
low-effort levers (none are governance drift; promote to a Task Card when chosen):

- **Asset cache TTL:** fingerprinted `/_astro/*` assets are immutable but served
  `max-age=14400` (4 h) — could be cached ~1 year via a Cloudflare Cache Rule.
- **Security response headers:** live site ships no HSTS / `X-Content-Type-Options`
  / `Referrer-Policy` / CSP. Addable via Cloudflare Response-Header rules (not
  Workers); likely the one lever holding Lighthouse best-practices < 100.
- **CI housekeeping:** GitHub Actions still on deprecated Node 20 runners.
- **SEO/AEO:** add **FAQPage JSON-LD** on Sole Focus (a real FAQ already exists) —
  code-only, natural next feature packet.

## Follow-ups

- Product decisions still open (not blocking): the above health items; a
  **lighter-touch** description refresh (Format B was rejected — see prior
  reports); plus roadmap candidates (changelog block, Apple-submission checklist,
  Terms page, more products).
- Next scheduled checkpoints unchanged. Next feature packet undecided.
