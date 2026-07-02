# Discussion Checkpoint DISC-0003

- **Trigger:** Completion of feature step #9 (STEP-0009); Discussion cadence =
  every 3 feature steps.
- **Reviewed range:** STEP-0007 → STEP-0009 (v0.7.0 → v0.9.0), focus on the App
  Store review-readiness changes.
- **Date:** 2026-07-02.

## Persona reviews

**1. Content-model architect.** `privacyPolicyEntrySchema` now makes `retention`
**required** and adds optional `dataUse` / `hasAccounts` — a good forcing
function that maps 1:1 to Apple 5.1.1(i). Backward-compatible via defaults; the
three sample policies + both test helpers updated. No concerns.

**2. Accessibility / UX reviewer.** The policy renders as a labeled `dl` with
clear section headings, readable in the panel; contrast fine; no motion. Reviewer
can scan collect/use/third-party/retention/contact at a glance. No concerns.

**3. Security / privacy reviewer (primary).** Pages now explicitly cover: data
collected, uses, third-party **equal-protection** confirmation + a "no
third-party AI" statement, and **retention/deletion + how to request**. Support
email corrected to `support@metkapstudio.com`. Developer responsibilities and the
**not-legal-advice** caveat are documented in `SECURITY.md`. **Finding
DISC-0003-F1 (guidance, not a defect):** the Pixel Drift sample keeps
`reviewStatus: draft` while live — acceptable for placeholder content, but real
submissions should use `reviewed`/`published` and truthful content (already
covered by the SECURITY.md dev-responsibility note).

**4. Build / deploy engineer.** No new dependencies; still static/zero-cost. A
policy missing `retention` now fails `npm run build` (verified by test). The
`astro check` gate caught a stale test helper during this step — good, it did its
job. No concerns.

**5. Maintainability skeptic.** `PolicyArticle` grew but remains one cohesive
component. LEDGER-001 (monogram dup) and LEDGER-002 (a11y automation) remain
open, unrelated. No new debt.

## Dispositions

| ID | Finding | Disposition |
|---|---|---|
| DISC-0003-F1 | Sample policy `reviewStatus: draft` while live | **Guidance only** — covered by SECURITY.md dev-responsibilities; not blocking for placeholder content. |

No critical/security/release-blocking findings.

## Follow-ups

- Next Discussion after feature step #12. Audit + Markdown Consistency after #10.
