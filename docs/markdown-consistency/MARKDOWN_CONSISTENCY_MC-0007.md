# Markdown Consistency Checkpoint MC-0007

- **Trigger:** Completion of feature step #14 (STEP-0014); cadence = every 2
  feature steps.
- **Reviewed range:** STEP-0013 (v0.13.0) → STEP-0014 (v0.14.0).
- **Date:** 2026-07-02.

## Checklist results

| Check | Result | Notes |
|---|---|---|
| Step/tag/feature agreement | Pass | STATUS current STEP-0014, tag v0.14.0; CHANGELOG [0.14.0]; CHECKPOINTS feature count 14; ROADMAP STEP-0014 entry present. |
| Layout system documented | Pass | `--maxw-prose` is a design-system token in `global.css` with an inline comment; UI polish is CSS/token + component-scoped only. |
| Privacy scope wording consistent | Pass | Main privacy page titled "MetKap Studio Website Privacy Policy"; global policy `effectiveScope` + body scope the website and point apps to their own policies. No conflict with `SECURITY.md` / per-product policies (apps may collect data, each carries its own policy). |
| Apple-readiness note still accurate | Pass | Per-product policies unchanged; Apple 5.1.1(i) coverage intact. The clearer website/app split reduces reviewer confusion. |
| Checkpoint ledger | Pass | MC-0007 logged at step 14; Discussion + Audit due after step 15. |
| Canonical ownership / append-only | Pass | Historical reports untouched; single milestone headings; no duplicated versions. |

## Findings

**No drift requiring repair.** The polish pass (shared reading column, unified
product icon, separator fix) and the website-scoped privacy wording are
consistently reflected across code, content, and docs.

## Follow-ups

- Discussion + Audit after feature step #15.
