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

## Current deployment: custom domain (STEP-0008)

Live on **metkapstudio.com** (Cloudflare Registrar/DNS + GitHub Pages), root-served.

- **URL:** `https://metkapstudio.com/` (apex canonical; `www` redirects to apex).
- **Config:** `astro.config.mjs` `site: 'https://metkapstudio.com'`, `base: '/'`.
  `withBase()` (`src/lib/url.ts`) is a no-op at root but stays in the code so a
  future sub-path move needs no rewrite. `public/CNAME` = `metkapstudio.com`.
- **Workflow:** `.github/workflows/deploy.yml` — `withastro/action@v3` build +
  `actions/deploy-pages@v4`, on push to `main`. The `CNAME` file ships in the
  build artifact so Pages keeps the custom domain on each deploy.

### Cloudflare DNS (dashboard → metkapstudio.com → DNS → Records)

All records **DNS only (grey cloud / proxy OFF)** so GitHub can provision its
Let's Encrypt certificate and serve HTTPS directly (avoids redirect-loop/cert
issues). The proxy can be enabled later with SSL/TLS = Full (strict).

| Type | Name | Value |
|---|---|---|
| A | `@` | 185.199.108.153 |
| A | `@` | 185.199.109.153 |
| A | `@` | 185.199.110.153 |
| A | `@` | 185.199.111.153 |
| AAAA | `@` | 2606:50c0:8000::153 |
| AAAA | `@` | 2606:50c0:8001::153 |
| AAAA | `@` | 2606:50c0:8002::153 |
| AAAA | `@` | 2606:50c0:8003::153 |
| CNAME | `www` | metekaplangit.github.io |

No wildcard records (takeover risk). Enable **DNSSEC** (Cloudflare → DNS →
Settings). WHOIS redaction is on by default for Cloudflare Registrar.

### GitHub side

- Pages custom domain set to `metkapstudio.com` (`CNAME` file + `gh api … /pages`).
- **Enforce HTTPS** in Settings → Pages becomes available after the cert
  provisions (up to 24h); enable it then.
- **Recommended:** verify the domain (GitHub user Settings → Pages → Verify a
  domain) via the `_github-pages-challenge-metekaplangit` TXT record — prevents
  takeover.

### Support email — LIVE (2026-07-03)

`support@metkapstudio.com` **receives mail** via **Cloudflare Email Routing**
(free): a catch-all rule forwards `*@metkapstudio.com` to a verified Gmail
(`metekaplanwork@gmail.com`). Full email authentication is in place — **SPF +
DKIM + DMARC** (DMARC via Cloudflare DMARC Management, `p=none` monitoring).
Verified end-to-end: MX resolves to `route1/2/3.mx.cloudflare.net`; a test mail
delivered to the inbox after a one-time Gmail "Not spam".

> Setup gotcha (for future domains): Email Routing can get stuck "configured but
> Status: Disabled / DNS Not configured" (MX never written to the zone). Fix =
> Settings → **Delete & disable** (removes only mail records, not the site's
> A/CNAME) → re-run the **Onboard Domain** enable wizard, which writes the MX/TXT
> records cleanly. Reply-from support@ is not set up (replies go from the Gmail);
> add Gmail "Send mail as" later if wanted.

### Propagation / verification

DNS can take up to 24h. Confirmed live only when `https://metkapstudio.com/`
returns 200 over HTTPS and `www` redirects to the apex.

### Cloudflare proxy — edge caching & instant freshness (optional, free)

Speeds up the *served* experience (Cloudflare CDN + Brotli + HTTP/3) and
overrides GitHub Pages' `cache-control: max-age=600`, so published changes appear
fast/fresh. It does **not** speed up GitHub's Actions publish step (their infra).
Stays static / zero-cost (DNS/CDN only — no Workers/Pages).

**Order matters — SSL first, then proxy (else redirect loop):**

1. Cloudflare → **SSL/TLS → Overview → set encryption mode to `Full (strict)`**.
   (Never `Flexible`/`Off` with GitHub Pages — that loops.)
2. Cloudflare → **SSL/TLS → Edge Certificates → `Always Use HTTPS` = On**.
3. Cloudflare → **DNS → Records** → flip the apex `A` records **and** the `www`
   `CNAME` from grey cloud (DNS only) to **orange cloud (Proxied)**.
4. Optional tuning: a **Cache Rule** for `/_astro/*` (immutable, content-hashed)
   with a long edge TTL. HTML is not cached by Cloudflare by default, so updates
   stay fresh without a purge.

After enabling, Cloudflare provisions its Universal SSL cert (a few minutes); a
brief SSL warning right after is normal. Keep GitHub "Enforce HTTPS" on — it is
compatible with Cloudflare `Full (strict)`. Verify: `https://metkapstudio.com/`
loads with a padlock and `curl -sI` shows a `cf-cache-status`/`server: cloudflare`
header. If a loop/525/526 appears, re-check that SSL mode is `Full (strict)`.
**Status: DONE + verified 2026-07-02** — domain resolves to Cloudflare IPs
(`172.67…`/`104.21…`), `server: cloudflare` + `cf-ray` on HTTP/2 200, clean
`http→https` 301 (no loop), `cf-cache-status: DYNAMIC` (HTML fresh; assets
edge-cached). Live channel is now GitHub Pages **behind the Cloudflare proxy**.

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
