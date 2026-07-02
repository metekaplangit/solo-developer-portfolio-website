# Discussion Checkpoint DISC-0001

- **Trigger:** Completion of feature step #3 (STEP-0003); Discussion cadence =
  every 3 feature steps.
- **Reviewed range:** STEP-0001 → STEP-0003 (v0.1.0 → v0.3.0).
- **Date:** 2026-07-02.

## Persona reviews

**1. Content-model architect.** Schemas live in `src/content/schema.ts`,
separate from `content.config.ts` and from Astro — good boundary; lib and tests
import them cleanly. Product facts are declared once and rendered everywhere from
the model. No concerns.

**2. Accessibility / UX reviewer.** Skip link, visible focus, semantic headings,
`aria-current`, alt text on media, reduced-motion, and a helpful 404 are all
present. Muted text contrast checked informally (~5.7:1 light, ~8:1 dark) —
passes AA for body text. No blocking issue; a formal automated a11y pass is
planned for the deployment/hardening arc.

**3. Security / privacy reviewer.** Fully static, no secrets, no runtime service,
no third-party embeds. External links use `rel="noopener"`. Privacy copy is
non-advisory and states no-collection plainly. `robots.txt` intentionally allows
all (public site). No concerns.

**4. Build / deploy engineer.** CI runs validator + check + build. **Finding
DISC-0001-F1:** the `npm test` step in `.github/workflows/ci.yml` was left
commented out even though the suite now exists — CI was not running tests.
Sitemap/robots use the `example.com` placeholder domain (**F3**, already tracked
in DEPLOYMENT for M4).

**5. Maintainability skeptic.** **Finding DISC-0001-F2 (watch):** the monogram
computation is duplicated in `ProductCard.astro` and `apps/[slug].astro`
(2 occurrences). Under the rule-of-three-at-two this is a watch item, not yet a
required extraction; a third use forces extracting a small helper. Grid styles
are lightly duplicated across `index`/`apps` pages — a candidate for the next
consolidation pass.

## Dispositions

| ID | Finding | Disposition |
|---|---|---|
| DISC-0001-F1 | CI not running `npm test` | **Fixed this step** — enabled the test step in `ci.yml`. |
| DISC-0001-F2 | Monogram logic duplicated (2 uses) | **Watch** — logged to `docs/issues/LEDGER.md`; extract on 3rd use per REFACTORING cadence. |
| DISC-0001-F3 | Placeholder domain in sitemap/robots | **Tracked** — DEPLOYMENT M4 checklist; not a defect pre-deploy. |

## Follow-ups

- Next Discussion due after feature step #6. Audit due after step #5. Markdown
  Consistency due after step #4.
