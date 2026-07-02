# Discussion Checkpoint DISC-0004

- **Trigger:** Completion of feature step #12 (STEP-0012); Discussion cadence =
  every 3 feature steps.
- **Reviewed range:** STEP-0010 → STEP-0012 (v0.10.0 → v0.12.0), focus on the
  privacy-page readability redesign.
- **Date:** 2026-07-02.

## Persona reviews

**1. Content-model architect.** Two optional fields added (`storedLocally[]`,
`permissions[]`), both defaulted — backward-compatible; `retention` narrowed to a
short deletion/how-to sentence. Content vs presentation stays cleanly split. No
concerns.

**2. Accessibility / UX reviewer (primary).** Big improvement: an at-a-glance chip
strip, then strictly separated `<section>`s each with a semantic `<h2>`, bullets,
and hairline dividers. Heading hierarchy is clean (h1 title → h2 sections),
helping both skimmers and screen-reader users. Redundant prose removed. Contrast
AA. This directly resolves the user's "too much to read / boring" complaint.

**3. Security / privacy reviewer.** Still fully covers Apple 5.1.1(i): what's
collected, how used (shown only when data is collected — accurate, less noise),
third-party equal-protection + no-third-party-AI, and retention/deletion + how to
request. The new Permissions section improves reviewer clarity. Content remains
truthful (no data collected). No concerns.

**4. Build / deploy engineer.** No new deps; static. Tests updated (helper +
defaults); `astro check` clean. No concerns.

**5. Maintainability skeptic.** `PolicyArticle` grew but stays one cohesive
component with clear section blocks. LEDGER-001 (avatar dup) and LEDGER-002 (a11y
automation) remain open, unrelated. No new debt.

## Dispositions

No critical/security/release-blocking findings. The decision to hide "How we use
it" when nothing is collected is an intentional clutter-reduction that stays
Apple-compliant (no collected data ⇒ no use to describe).

## Follow-ups

- LEDGER-002 (automated a11y check) would now also guard the new heading/section
  structure — still a good future packet.
- Next Discussion after feature step #15. Audit after #15; Markdown Consistency
  after #14.
