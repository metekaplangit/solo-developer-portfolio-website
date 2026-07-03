# Discussion Checkpoint DISC-0007

- **Trigger:** Completion of feature step #21 (STEP-0021); Discussion cadence =
  every 3 feature steps.
- **Reviewed range:** STEP-0019 → STEP-0021 (v0.19.0 → v0.21.0) — premium craft,
  clickable icons, and the code-review remediation.
- **Date:** 2026-07-03.

## Persona reviews

**1. Accessibility reviewer (primary).** The redundant-link remediation is the
right pattern: the icon stays mouse-clickable but, where an adjacent link already
names the target (card title, spotlight name/CTA), it's `tabindex="-1"` +
`aria-hidden="true"` — removed from tab order and the AT tree, so no duplicate
keyboard stop or SR link. Crucially it's **verified against the Lighthouse a11y
gate in CI** (green), not assumed. The privacy-page icon — the *only* link to the
app there — correctly stays a primary, labelled link. No regression.

**2. Component architect.** De-duplicating via a dynamic `<Wrapper>` (`a` |
`Fragment`) removes the branch duplication the review flagged; the inner avatar is
authored once, so future image-attr changes can't diverge. `ProductAvatar` stays
the single identity component.

**3. UX reviewer.** The user's ask — clicking the icon opens the product — is
preserved for mouse/touch. The change only trims the redundant *assistive*
navigation, which improves the experience for keyboard/SR users without removing
anything visible.

**4. Build / deploy engineer.** Component + two callers; static; no new deps.
34 tests green; `astro check` clean; verified on PR before merge.

**5. Process skeptic.** The review itself ran single-threaded (no agent fan-out)
per the user's standing instruction; findings were still verified and are now
remediated + re-verified in CI. Healthy loop: review → fix → gate.

## Dispositions

No critical/security/release-blocking findings. The `/code-review` findings are
resolved and confirmed a11y-safe by the gate. No new debt introduced.

## Follow-ups

- Next Discussion after feature step #24. (Markdown Consistency after #22; Audit
  after #25; Enhancement ENH-0003 run alongside this — see its report.)
