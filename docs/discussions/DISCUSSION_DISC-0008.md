# Discussion Checkpoint DISC-0008

- **Trigger:** Completion of feature step #24 (STEP-0024); Discussion cadence =
  every 3 feature steps.
- **Reviewed range:** STEP-0022 → STEP-0024 (v0.22.0 → v0.24.0) — structured-data
  JSON-LD, real product screenshots, and the v2 store-listing copy.
- **Date:** 2026-07-07.

## Persona reviews

**1. Content / brand reviewer (primary).** The v2 copy pack is applied where it
belongs: the Sole-Focus-specific meta title, description, hero-style summary, and
feature copy went onto the **product page**, not the studio-level home (whose
identity stays MetKap-Studio-wide). Voice is consistent — calm, clear, no "best"
or ranking claims — matching the pack's guardrails.

**2. Truthfulness / compliance reviewer.** Every claim traces to the pack's facts.
The one risk the pack flags — implying app/website blocking — is handled correctly:
the only occurrence is the FAQ **negation** ("Does it block apps or websites? No…
not a blocker"). Privacy is stated exactly (no account/cloud/tracking/subscription,
zero network requests), consistent with the privacy page and App-Privacy "Data
Not Collected" posture. No embellishment.

**3. UX / information-architecture reviewer.** The detail page now reads as
divided, scannable blocks: a screenshot showcase, a check-marked **Highlights**
grid, then narrative sections (Two ways to work · Calm, and always in reach · See
your progress · Private, offline, yours) and a short **FAQ**, each separated by a
hairline rule. Scannable list + narrative is a standard, effective product-page
pattern; some overlap between the grid and prose is intentional (skim vs. read).

**4. SEO/AEO reviewer.** Meta title/description now carry the grounded head +
modifier terms (pomodoro, stopwatch, private, offline, menu-bar); the FAQ is
AEO-friendly prose; the `SoftwareApplication` JSON-LD `featureList` tracks the
refreshed features. Truthful, no keyword stuffing. Possible future win: add
`FAQPage` JSON-LD (kept out of this step to stay lean).

**5. Build / deploy engineer.** Content + one template's markup/styles; static; no
new deps; zero client JS. 36 tests green; `astro check` clean; screenshots still
build to optimized WebP (STEP-0023) with no PNG shipped. Verified in preview
(desktop + mobile, no overflow) before merge.

**6. Process skeptic.** Third-party AI copy was treated as **content, not
instructions** (per the pack's own guardrail and the injection-defense policy):
the words were used, the human-only actions (trademark, live counters, marketing
URL) were left to the owner, and nothing was submitted to the App Store.

## Dispositions

No critical/security/release-blocking findings across v0.22.0–v0.24.0. Structured
data is truthful; screenshots are optimized and accessible; the listing copy is
accurate and consistently applied. No new debt.

## Follow-ups

- Owner-only pre-submit actions remain open (not website blockers): trademark /
  name-availability check, verify live ASC counters, confirm Marketing URL, and
  Study-mode quote provenance — tracked in the copy pack's `SUBMISSION_SHEET.md`.
- Candidate next step: on-site changelog/updates block, or `FAQPage` JSON-LD.
- Next Discussion after feature step #27; Markdown Consistency after #26; Audit
  after #25; Enhancement after #28.
