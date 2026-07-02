# Issue Tracking

> **Purpose:** Issue intake, classification, lifecycle, labels, and closure evidence.
> **Read when:** Filing, triaging, or closing an issue; at every step end.
> **Update when:** Host, forms, labels, severity, or closure rules change.
> **Synchronize with:** STATUS.md, ROADMAP.md, SECURITY.md, VERSION_CONTROL.md, CHANGELOG.md.
> **Status:** Active.
> **Activation:** Standard profile.

## Owner of record

**GitHub Issues** (once the remote exists) are the durable owner for actionable
bugs, regressions, security/accessibility/performance/dependency problems,
failed/blocked checks, debt, and docs defects. `STATUS.md` keeps only a compact
view. Until the remote is live, the fallback is `docs/issues/LEDGER.md`.

## Remote status

**Remote push planned immediately after baseline (user-authorized).** The
`docs/issues/LEDGER.md` fallback carries any pre-remote findings with an expiry
milestone; once GitHub Issues exist, ledger items are backfilled with issue IDs.
This project must not carry the fallback past its first maintained release.

## Forms

`.github/ISSUE_TEMPLATE/`: `bug.yml`, `problem.yml`, and `config.yml`
(blank issues disabled; a **private security route** for sensitive reports).

## Labels (starter set)

`type:bug`, `type:security`, `type:performance`, `type:accessibility`,
`type:data`, `type:dependency`, `type:docs`, `type:technical-debt`, `type:task`;
`priority:critical|high|medium|low`; `needs:triage`; `status:blocked`.

## Severity vs priority

Severity = impact; priority = urgency. Data loss, credential exposure, broken
release, or widespread core-page failure is **critical** by default. Critical,
security-critical, and release-blocking issues block the affected release.

## Lifecycle

discover → deduplicate → validate → classify → prioritize → milestone → link
branch/commit/PR → implement + regression → verify on `main` → close with
evidence. Reopen on recurrence or invalid closure. Close only with evidence.

## Cadence

Triage every credible finding at step end, release, audits, and Markdown
Consistency checks. Never invent an issue; never silently close a stale one.
