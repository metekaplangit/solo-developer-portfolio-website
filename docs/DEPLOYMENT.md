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
