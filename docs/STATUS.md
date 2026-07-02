# Status — Live Snapshot

> **Purpose:** Live project state and the exact next action. The single entry point.
> **Read when:** Every session, first.
> **Update when:** After every Step/checkpoint or any blocker/Git change (overwrite).
> **Synchronize with:** ROADMAP.md, CHECKPOINTS.md, VERSION_CONTROL.md, CHANGELOG.md, ISSUE_TRACKING.md.
> **Status:** Active.
> **Activation:** Standard profile + commercial/compliance overlay armed (privacy/store pages).

## Handoff (5 bullets)

- **State:** **STEP-0001 complete** — content model (Zod) + static shell + routes
  (home, Apps & Games, privacy global + per-product, support, about) merged to
  `main`, tagged **v0.8.0**. 33 tests green. **MC-0004** run (feature step #8).
- **Domain:** **metkapstudio.com is fully LIVE over HTTPS.** DNS propagated;
  cert **approved**; `https_enforced: true`; `https://` returns 200 with a valid
  cert; `http://`→`https://` 301; `www`→apex. Custom-domain step fully complete.
- **Next action:** pick the next packet — **changelog/updates block** (user asked
  about it), **a11y/Lighthouse CI** (LEDGER-002), **real image pipeline** (needs
  assets), or **real product content**. Optional (user, 2 min each): Cloudflare
  Email Routing for `support@metkapstudio.com`, DNSSEC.
- **Required reads:** `STATUS.md`, `ROADMAP.md`, `CHECKPOINTS.md`, `DEPLOYMENT.md`.
- **Required checks:** `npm run build`, `npm run check`, `npm test`,
  `python3 scripts/validate-governance.py`.
- **Blockers:** **metkapstudio.com live-HTTPS Blocked** pending Cloudflare DNS
  records + GitHub cert (up to 24h). Old github.io URL now redirects to the domain.

## Last completed Step Packet

- **STEP-0008 — Custom domain (metkapstudio.com)** — **DONE** (code/GitHub side),
  merged to `main`, tagged **v0.8.0**. Task Card: `docs/tasks/STEP-0008.md`.
- Delivered: root-served config (`site` metkapstudio.com, `base '/'`), `CNAME`,
  robots/sitemap domain, `support@metkapstudio.com`, Pages custom domain set.
  Live-HTTPS verification Blocked pending user DNS.
- (Prior: STEP-0007 theme rollout v0.7.0; STEP-0006 rebrand v0.6.0; … v0.1.0.)

## Next Step Packet (to freeze)

- **Not yet chosen.** After DNS is live: enable Enforce HTTPS + domain
  verification (small follow-up). Other candidates: **a11y/Lighthouse CI**
  (LEDGER-002); **real image pipeline** `astro:assets` (needs assets); **real
  product content**. See `ROADMAP.md` backlog. One outcome only.

## Machine-readable state

```yaml
schema_version: 1
profile: standard
active_overlays: [commercial-compliance-armed]
active_step: none
current_step: STEP-0008
next_step: undecided (post-DNS: enable HTTPS + verify; or new packet)
branch: main
head: regenerate-live (git rev-parse HEAD)
product_tag: v0.8.0
live_url: https://metkapstudio.com/ (live, HTTPS enforced)
brand: MetKap Studio
domain: metkapstudio.com (live; cert approved; https_enforced: true)
dirty: false
dirty_paths: []
remote_sync: origin (github.com/metekaplangit/solo-developer-portfolio-website)
due_checkpoints: none
blockers: none
required_reads: [STATUS.md, ROADMAP.md, CHECKPOINTS.md, UI_DESIGN.md, ARCHITECTURE.md]
required_checks: [npm run build, npm run check, npm test, scripts/validate-governance.py]
calibration: completed
updated_at: 2026-07-02
```

> The live Git block above is validator/observed-owned. Regenerate with
> `git status --porcelain --branch` and `git rev-parse HEAD`; live results
> override this prose.

## Governance validator

```
python3 scripts/validate-governance.py
```
Recorded here, in `AI_WORKFLOW.md`, and in `.github/workflows/ci.yml` (CI runs it).

## Profile & overlays

Standard profile. Commercial/compliance overlay **armed** (activates its controls
when privacy/store-support pages with real product/policy text are built — M3).
No escalation triggers observed. No maturity thresholds breached (baseline).

## Gate table (baseline)

| Gate | Result | Class | Evidence |
|---|---|---|---|
| Static build (`npm run build`) | Pass | Merge-critical | 11 routes + sitemap/robots/404/favicon, `output: "static"` |
| Type + content check (`npm run check`) | Pass | Merge-critical | 0 errors / 0 warnings / 0 hints |
| Unit tests (`npm test`) | Pass | Merge-critical | 33 passed (incl. `withBase`); run in CI |
| Dependency audit (`npm audit`) | Pass | Merge-critical | `found 0 vulnerabilities` |
| Governance validator | Pass | Merge-critical | 40/40, exit 0 |
| Runtime visual (home) | Pass | Manual-runtime | dark-premium theme; desktop + mobile screenshots; no console errors; no overflow |
| Deployment code/config (domain) | Pass | Merge-critical | build at root; CNAME/canonical/robots on metkapstudio.com; Pages cname set |
| Live domain HTTPS | Pass | Release-critical (channel) | cert approved; https 200 + valid TLS; http→https 301; enforce_https on; www→apex |

## Checkpoints

Completed **feature** steps: **8** (STEP-0001..0008). Checkpoints run: MC-0001(2),
DISC-0001(3), MC-0002(4), AUDIT-0001(5), MC-0003+DISC-0002(6), ENH-0001(7),
**MC-0004**(8), plus on-demand MC-OD-0001 + MC-OD-0002. Next: Discussion after
step **9**; Audit + Markdown Consistency after **10**. Calibration: completed
2026-07-02.

## Issues

- **LEDGER-001** (`type:technical-debt`, `priority:low`) — monogram logic
  duplicated (2 uses). Watch; extract on 3rd use. From DISC-0001.
- **LEDGER-002** (`type:accessibility`, `priority:low`) — no automated a11y /
  visual-regression check; UI verified manually. From AUDIT-0001. Advisory.

Neither is release-blocking. Fallback ledger: `docs/issues/LEDGER.md`.

## Compliance (Critical Operating Contract)

Followed: one frozen Step Packet (STEP-0001), risk-based tests shipped with the
code, all merge-critical gates Pass with evidence, non-destructive Git (merge
commit + tag), docs synchronized, validator passing. No deviations.

## Version control

Repo slug `solo-developer-portfolio-website` (local folder
`solo-dev-portfolio-website`). Latest product tag: **v0.8.0** (STEP-0008 merge
commit); prior v0.7.0..v0.1.0. Baseline (M0) internal-only. Remote: `origin`,
in sync. **Live channel:** GitHub Pages + custom domain **metkapstudio.com**
(HTTPS pending DNS).
