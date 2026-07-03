# Discussion Checkpoint DISC-0006

- **Trigger:** Completion of feature step #18 (STEP-0018); Discussion cadence =
  every 3 feature steps.
- **Reviewed range:** STEP-0016 → STEP-0018 (v0.16.0 → v0.18.0) — appeal/motion,
  the accessibility gate, and the privacy-policy completeness additions.
- **Date:** 2026-07-03.

## Persona reviews

**1. Privacy / compliance reviewer (primary).** The four added sections (Security,
Children's privacy, Your rights, Changes) close our clearest gaps versus Apple
5.1.1 and rival policies (Flexibits). Crucially, every line stays **truthful** to
the collects-nothing reality — "Your rights" says there's nothing to retrieve
because we hold nothing; "Security" reframes local-first as the strength it is. No
overclaiming, no fabricated commitments. Apple's policy-content bar is met/exceeded.

**2. Accessibility reviewer.** New content is plain `<section><h2>` + `<p>` blocks
in the same semantic pattern; the Lighthouse CI a11y gate (STEP-0017) now guards
this automatically. No regressions.

**3. Content-model architect.** Sections derive from existing fields (`productId`,
`storedLocally`, `collectsData`, `hasAccounts`) — no schema change, and any future
product gets the same completeness for free. `subject` ("This website"/"This app")
keeps the shared component correct across policy types.

**4. Build / deploy engineer.** Component-only; static; no new deps. 34 tests green;
build 8 routes. The deploy now runs the a11y gate before publish.

**5. Honesty skeptic.** Checked the derived copy on both policies: site-wide and
Sole Focus both read accurately. The one thing the *policy* can't fix is
operational — `support@metkapstudio.com` must actually receive mail (email routing)
before Sole Focus is submitted; flagged, not a website defect.

## Dispositions

No critical/security/release-blocking findings. **Non-website follow-ups (not
blockers for the site, but for a Sole Focus submission):** enable Cloudflare Email
Routing; set App Store Connect App-Privacy labels to "Data Not Collected"; confirm
the app's `PrivacyInfo.xcprivacy` privacy manifest. Optional: a Terms/disclaimer
page (not required by Apple for a free, no-data app).

## Follow-ups

- Next Discussion after feature step #21. (Audit after #20; Markdown Consistency
  after #20; Enhancement after #21.)
