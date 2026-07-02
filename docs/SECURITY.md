# Security & Privacy

> **Purpose:** Threat model, secrets policy, dependency security, input handling, privacy, and production controls.
> **Read when:** Adding a dependency, external input, network destination, or any data handling.
> **Update when:** Flows, dependencies, platforms, data, or assumptions change.
> **Synchronize with:** DATA_STORAGE.md, DEPLOYMENT.md, TECH_STACK.md, ISSUE_TRACKING.md.
> **Status:** Active.
> **Activation:** Standard profile + commercial/compliance overlay armed for privacy/store pages.

## Attack surface (static site)

Minimal by design. There is **no backend, no database, no auth, no user input
processing, no cookies, no forms** in the MVP. The site is public static HTML.
The main risks are supply-chain (build dependencies), content integrity, domain
takeover, and accidental secret exposure.

## Controls

- **Secrets:** none in the repo or build output. `.env*` gitignored. No API keys,
  certificates, signing keys, or developer-account data (explicit product
  non-goal). Any detected secret → stop, remove, rotate, document.
- **Dependencies:** `npm audit` must be clean at merge; `package-lock.json`
  committed; `yaml` pinned via `overrides` (GHSA-48c2-rrv3-qjmp cleared). Review
  new deps for maintenance + license before adding.
- **Content is trusted-authored** (developer-owned) but treated carefully:
  external store/social links carry explicit review status; no third-party
  script embeds; no copied brand/store assets without confirmed rights.
- **Domain takeover avoidance (DEPLOYMENT):** verify the custom domain before
  adding it to Pages; no wildcard DNS; enforce HTTPS; remove mixed `http://`
  content.
- **CI trust:** pin third-party GitHub Actions; minimal `GITHUB_TOKEN`
  permissions; no secrets exposed to fork PRs.

## Baselines

Web risk review uses current OWASP web guidance as a checklist even though most
categories are N/A for a static site (no injection surface, no access control, no
sessions). Baseline name/version/date recorded when a security-relevant packet
runs. High-risk surfaces (if ever added) require independent review, not
AI self-attestation.

## Privacy

The MVP collects **no** user data. Privacy policy pages state this plainly and
must not overclaim. **Legal-language boundary:** AI may draft practical
privacy/support text but must flag legal uncertainty and recommend human review
before public release for anything touching real personal data, kids, health,
finance, ads, analytics, or third-party SDKs. This is **not legal advice.**

## Release gate

No secrets; `npm audit` clean; production output free of debug/verbose internals;
HTTPS enforced; no broken/misleading links on privacy/support pages.

## Sensitive reporting

Security issues use the private route in `.github/ISSUE_TEMPLATE/config.yml`;
public issues/changelogs stay sanitized. See `ISSUE_TRACKING.md`.
