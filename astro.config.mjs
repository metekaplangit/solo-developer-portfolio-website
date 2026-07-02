// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
  // GitHub Pages *project site* (no custom domain yet). When the real
  // Cloudflare-managed domain lands (late step), set `site` to that domain and
  // `base` back to '/', and update public/robots.txt to match.
  site: 'https://metekaplangit.github.io',
  base: '/solo-developer-portfolio-website',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  // Build-time only; @astrojs/sitemap emits static XML (no runtime service).
  integrations: [sitemap()],
});
