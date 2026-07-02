# Deployment

> **Purpose:** Build, GitHub Pages publishing, custom domain, HTTPS, limits, and deployed rollback.
> **Read when:** Setting up or changing deployment, domain, or DNS.
> **Update when:** Targets, channels, domain, gates, or recovery change.
> **Synchronize with:** VERSION_CONTROL.md, SECURITY.md, DATA_STORAGE.md, STATUS.md.
> **Status:** Active. Deployment execution is Milestone 4 (STEP later); notes seeded now.
> **Activation:** Standard profile. Live deploy = release-critical when M4 runs.

## Target

**GitHub Pages** (static) + **Cloudflare**-managed custom domain. **$0 recurring
except the domain.** No Workers/Pages/serverless. Cloudflare Pages is a
future-fallback only if GitHub Pages limits become a real blocker.

## Current deployment: GitHub Pages project site (STEP-0004, no domain yet)

Live since STEP-0004 for continuous preview; **custom domain deferred to a late
step**.

- **URL:** `https://metekaplangit.github.io/solo-developer-portfolio-website/`.
- **Config:** `astro.config.mjs` `site: 'https://metekaplangit.github.io'`,
  `base: '/solo-developer-portfolio-website'`. Internal links go through
  `withBase()` (`src/lib/url.ts`) so they resolve under the sub-path.
- **Workflow:** `.github/workflows/deploy.yml` — `withastro/action@v3` builds and
  uploads, `actions/deploy-pages@v4` deploys, on push to `main`. Least-privilege
  permissions (`pages: write`, `id-token: write`); `concurrency: pages`.
- **Pages source:** GitHub Actions (enabled via `gh api … /pages` build_type
  `workflow`).
- **`robots.txt` caveat:** on a project site it is served under the base path,
  so domain-root crawlers won't read it — acceptable for the temporary test
  deploy.

### Reverting to the custom domain (late step)

Set `site` to the real domain and `base` back to `/`; `withBase()` then becomes a
no-op. Add `public/CNAME`, configure Cloudflare DNS (apex `A`/`ALIAS`, `www`
`CNAME`; no wildcard), verify the domain in GitHub before adding, enforce HTTPS,
update `robots.txt` + sitemap URL. (Checklist below.)

## Build

- Command: `npm run build` → output dir: `dist/` (static).
- Publish via **GitHub Actions → Pages** (`.github/workflows/deploy.yml`, added at
  M4). Free on a public repo.
- Node 24 (`.nvmrc`); Astro 7 needs ≥22.12.

## Custom domain checklist (M4)

- Choose canonical domain (apex `example.com` vs `www`); decide redirect.
- **Verify the domain in GitHub before adding it** (reduces takeover risk).
- DNS at Cloudflare: apex `A`/`ALIAS` to GitHub Pages IPs; `www` `CNAME` to
  `<user>.github.io`. **No wildcard records.**
- Add `public/CNAME` with the custom domain (if using branch/Actions Pages).
- **Enforce HTTPS**; remove any mixed `http://` references; keep the domain short
  enough for certificate provisioning.
- Cloudflare: WHOIS redaction + DNSSEC where available.
- If no custom domain yet: project-page fallback needs `base:
  '/solo-developer-portfolio-website'` in `astro.config.mjs` (documented, not the
  default).

## GitHub Pages limits (respect)

Static only; ≤1 GB published site; 10-min build timeout; ~100 GB/mo soft
bandwidth; ~10 builds/hr soft. No large binaries/video in-repo — handle big
assets via a later explicit release strategy. Not for sensitive transactions.

## Deployment acceptance (M4)

Static build passes; local preview works (`npm run preview`); routes home /
catalog / product-detail / privacy / support-contact / about generated; Pages
command/path documented; custom-domain + HTTPS steps documented (verified or
`Blocked` with exact manual steps); rollback instructions exist.

## Deployed rollback

Re-deploy a previous good tag/commit via the Pages workflow; DNS changes revert
at Cloudflare. See `ROLLBACK_GUIDE.md`. Post-release smoke: load the public URL
over HTTPS and check the privacy/support routes.
