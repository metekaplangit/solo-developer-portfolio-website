// @ts-check
import { defineConfig } from 'astro/config';

// Zero-cost, fully static configuration.
// Guardrails (see docs/ARCHITECTURE.md, docs/DEPLOYMENT.md):
//   - output: 'static' ONLY. Do NOT add SSR adapters, server islands,
//     on-demand rendering, or live content collections. Nothing may run in
//     production; GitHub Pages serves the prebuilt `dist/` for free.
//   - No backend, database, serverless, Cloudflare Workers/Pages, or SaaS.
//
// Deployment target: GitHub Pages + Cloudflare-managed custom domain.
//   - Custom domain (apex/www): keep `base: '/'` and set `site` to the domain.
//   - Project page fallback (https://<user>.github.io/<repo>) instead: set
//     `base: '/solo-dev-portfolio-website'`. Documented in docs/DEPLOYMENT.md.
export default defineConfig({
  output: 'static',
  // TODO(STEP: deployment): replace with the real Cloudflare-managed domain.
  site: 'https://example.com',
  base: '/',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
