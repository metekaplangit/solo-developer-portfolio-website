# Discussion Checkpoint DISC-0009

- **Trigger:** Completion of feature step #27 (STEP-0027); Discussion cadence =
  every 3 feature steps (prior: DISC-0008 at #24).
- **Reviewed range:** STEP-0025 → STEP-0027 (v0.25.0 → v0.27.0): centered layout
  aftermath, screenshot gallery (v0.26.0) + scrollbar-gutter fix (v0.26.1), and
  the **release pass** — Sole Focus live on the Mac App Store.
- **Date:** 2026-07-15.

## Review

**Correctness of the release pass.** The store URL was verified against the live
App Store listing *before* being wired in ("Sole Focus: Pomodoro Timer", seller
Mete Kaplan, Mac, Free, Productivity — matches our product identity exactly).
`status: released`, `releaseDate`, the store link, and the price all live in the
one content file; every surface (detail button, catalog card, badges, home
"shipped" counter, JSON-LD) derives from it — no duplicated release state
anywhere. Two new content tests pin the released status and the exact URL, so a
regression or accidental edit fails CI.

**Truthfulness (commercial/compliance overlay).** The `offers` JSON-LD emits
only for released products with a declared price and an actionable store link;
price "0" was verified against the listing, `aggregateRating` remains
deliberately un-emitted (no data). The removed "coming soon" line and the new
"Free on the Mac App Store — no in-app purchases, no subscription" line are both
accurate per the listing. External store link carries `rel="noopener"`.

**Process.** Card-first this time (Task Card frozen before edits), one outcome,
gates green (build 8 / check 0/0/0 / **38 tests** / validator 43/43 incl. the
sync checks now guarding tag↔docs agreement). Deploy goes through the a11y gate
as usual. No scope creep: FAQ JSON-LD explicitly deferred.

**Gallery/scrollbar retrospective (carried from v0.26.x).** Both shipped clean;
the a11y gate correctly caught the carousel's original violations — the gate is
earning its keep as the release-blocking control.

## Findings

| ID | Severity | Finding | Disposition |
|---|---|---|---|
| DISC-0009-F1 | info | The App Store listing is now a second public source of truth (name, price) that the site must not contradict; a price or name change there would silently stale the site's `offers`/copy. | **Note** — owner habit: mention listing changes; content tests pin the current values so any update is deliberate. |
| DISC-0009-F2 | low | The FAQ on the product page is still not exposed as `FAQPage` JSON-LD — now the only missing rich-result surface (carried from AUDIT-0005-F3). | **Recommend as next packet** (STEP-0028 candidate). |

No blocking findings.

## Follow-ups

- Next scheduled: **Markdown Consistency + Enhancement after feature step 28**;
  **Audit after 30**.
- Recommended next packet: **FAQPage JSON-LD** (small, code-only, completes the
  structured-data story the release pass started).
