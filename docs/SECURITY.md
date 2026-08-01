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
- **Dependencies:** `npm audit --omit=dev` must be clean at merge — that is the
  gate, and it is the one that matters: nothing dev-only reaches a visitor.
  `package-lock.json` committed; `yaml` pinned via `overrides`
  (GHSA-48c2-rrv3-qjmp cleared). Review new deps for maintenance + license
  before adding.
- **Every package the build imports must be declared** in `package.json`, never
  reached transitively. `@astrojs/markdown-satteri` and `satteri` were imported
  by `astro.config.mjs` and `src/lib/satteri-tie.ts` while resolving only as
  dependencies *of* astro, so any astro release dropping them would have broken
  the build — and silently stopped applying the wrapping rule to Markdown
  (STEP-0064).
- **Accepted dev-only residue (2026-08-01, STEP-0064):** 5 advisories, all
  reached through `@lhci/cli` — `tmp` (GHSA-ph9p-34f9-6g65 high,
  GHSA-52f5-9888-hmc6 low) via `external-editor` → `inquirer`, and `uuid`
  (GHSA-w5hq-g745-h8pq moderate). Clearing them needs `npm audit fix --force`,
  which installs `@lhci/cli@0.1.0` and would take out the accessibility gate in
  `.github/workflows/deploy.yml` — a worse trade. None of it reaches `dist`, so
  none of it reaches a visitor; it runs only on this machine and on the deploy
  runner, against the project's own built output. Re-check when `@lhci/cli`
  next releases.
- **Content is trusted-authored** (developer-owned) but treated carefully:
  external store/social links carry explicit review status; no third-party
  script embeds; no copied brand/store assets without confirmed rights.
- **Content-Security-Policy (STEP-0065):** every built page carries one, via
  Astro's `security.csp` (`astro.config.mjs`), which emits real sha256 hashes
  for every bundled script and style — no `unsafe-inline` on scripts. This is
  what enforces "no third-party script embeds" rather than merely stating it:
  AUDIT-0009 found Cloudflare injecting a beacon into every **live** page at the
  edge, where nothing in this repository could see it. Proved by reproducing
  that injection against a built page — it runs with the policy stripped out and
  is refused with it in place.
  - **`style-src-attr 'unsafe-inline'` is deliberate.** `--hue` is set per band
    as a style attribute, which is how the Spectrum identity works; the spec
    excludes style attributes from hash matching. It is a separate directive and
    weakens nothing about scripts.
  - **Two limits, accepted.** GitHub Pages cannot set headers, so the policy is
    a `<meta http-equiv>`: `frame-ancestors` and `report-uri` are ignored inside
    one, and `Content-Security-Policy-Report-Only` cannot be used, so it ships
    enforcing or not at all. Real headers — HSTS, `referrer-policy`,
    `x-content-type-options`, a working `frame-ancestors` — are available
    through Cloudflare Transform Rules. That is a dashboard setting and belongs
    to the account holder, not to this repository.
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

## App Store review readiness (STEP-0009)

Privacy/support pages are structured to satisfy Apple App Review
([Guidelines](https://developer.apple.com/app-store/review/guidelines/) 5.1.1(i)
and 1.5). Each per-product privacy page explicitly states, as labeled sections:
what data is collected, **how it's used**, third-party sharing **with an
equal-protection confirmation** (and a "no third-party AI" statement), and a
**retention/deletion + how-to-request-deletion/revoke-consent** statement. The
`privacyPolicyEntrySchema` makes `retention` **required**, so an incomplete
policy fails the build. Support page shows a genuine, monitored contact email
with a response expectation.

**Developer responsibilities before submitting a real app (MUST):**

- Make each app's policy **truthful** to that app's *actual* data practices —
  the samples claim "no data collected"; a real app that collects anything must
  say exactly what, how, and why, or risk rejection and legal exposure.
- If an app has **user accounts**, set `hasAccounts: true` **and** provide
  in-app account deletion (Apple 5.1.1(v)).
- Ensure `support@metkapstudio.com` **actually receives mail** (Cloudflare Email
  Routing) — reviewers test the Support URL.
- Disclose any **third-party AI** data sharing and obtain explicit permission
  (2025 guideline update).
- **Get human/legal review** of real policy text. This site reduces common
  structural rejection causes; it does not guarantee approval or constitute
  legal advice.

## Release gate

No secrets; `npm audit --omit=dev` clean; every build-time import declared in
`package.json`; production output free of debug/verbose internals; HTTPS
enforced; no broken/misleading links on privacy/support pages.

## Sensitive reporting

Security issues use the private route in `.github/ISSUE_TEMPLATE/config.yml`;
public issues/changelogs stay sanitized. See `ISSUE_TRACKING.md`.
