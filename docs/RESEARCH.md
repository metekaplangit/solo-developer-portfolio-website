# Research

> **Purpose:** Domain, technology, and platform research that informs the roadmap.
> **Read when:** A stack/platform/deployment decision needs evidence.
> **Update when:** Major product, stack, platform, or deployment research changes.
> **Synchronize with:** TECH_STACK.md, DEPLOYMENT.md, ROADMAP.md.
> **Status:** Active.
> **Activation:** Standard profile.

## Stack research (2026-07-02)

See `TECH_STACK.md` for the full five-option comparison. Key verified facts:

- **Astro 7.0.5** is current stable (released Jun 2026; docs.astro.build). Rust
  compiler + Vite 8/Rolldown; needs Node ≥22.12; adds coding-agent support. An
  earlier search returned a stale March-2026 result (Astro 6.0.x); corrected.
- **Node 24** is Active LTS (nodejs.org).
- Alternatives (Eleventy 3.1.6, Next 16.2.7, SvelteKit 2.57, Hugo 0.158.0)
  compared; Astro chosen for typed Zod content contracts + AI fit.

## Deployment research (from project-idea/07 + official docs)

- **GitHub Pages:** custom domains via Pages settings + DNS; verify domain to
  reduce takeover; DNS up to 24h propagation; apex `A`/`ALIAS`, `www` `CNAME`;
  no wildcard DNS; ≤1 GB site; 10-min build; ~100 GB/mo + ~10 builds/hr soft
  limits; HTTPS supported; not for sensitive transactions.
  (docs.github.com/pages, accessed 2026-07-02.)
- **Cloudflare Registrar:** at-cost domains, WHOIS redaction, DNSSEC, anycast DNS.
  (developers.cloudflare.com/registrar, accessed 2026-07-02.)

## Sequencing lesson

Ship the smallest usable slice first: content model + shell (M1) before visual
polish (M2) before store-support pages (M3) before deployment proof (M4). Tests
and schema validation land with the content model, not after.

## Trust ratings

Official docs (Astro, GitHub, Cloudflare, Node) = authoritative. Blog posts that
surfaced version numbers = advisory; corroborated against official docs before
adoption.
