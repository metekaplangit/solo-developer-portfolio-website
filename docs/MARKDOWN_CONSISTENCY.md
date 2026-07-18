# Markdown Consistency

> **Purpose:** Cross-document synchronization checkpoint procedure and stale-instruction cleanup.
> **Read when:** Running a Markdown Consistency checkpoint.
> **Update when:** Format, ownership, or synchronization criteria change.
> **Synchronize with:** CHECKPOINTS.md, all core docs, root CLAUDE.md.
> **Status:** Active.
> **Activation:** Standard profile. Run on demand.

## When to run

On demand — when docs feel drifted, or after a run of related packets. There is
no step-count schedule (cadence retired 2026-07-18; see ROADMAP.md). Branch
`markdown-consistency/<id>`; report
`docs/markdown-consistency/MARKDOWN_CONSISTENCY_<id>.md`.

## Checklist

Read all root handoffs + core docs, latest reports, tree/manifests/configs, tool
registry, test commands, tags, issues, and Git state. Verify:

- Canonical ownership + links; **no duplicated normative workflow** (link, don't
  copy).
- Current Step/tag/branch/checkpoint agreement across STATUS ↔ ROADMAP ↔
  CHECKPOINTS ↔ VERSION_CONTROL ↔ CHANGELOG.
- Issue/priority/milestone/blocker agreement.
- AI/editor/startup agreement (CLAUDE.md ↔ AI_WORKFLOW.md).
- Code/storage/security/test/deployment/UI reality matches the docs (paths,
  commands, versions current).
- Append-only history preserved; required reads/gates concise.

Directly repair clear drift and synchronize affected owners. Add new Markdown only
for workflow/integration/report traceability; otherwise update the owner. Never
rewrite completed reports or releases.

## Machine-checked invariants (since AUDIT-OD-0001)

The validator (`scripts/validate-governance.py`) now cross-checks the drift
classes this checkpoint repeatedly hand-repaired: STATUS `product_tag` ↔ latest
git tag, STATUS ↔ CHECKPOINTS feature-step counters, and CHANGELOG top release ↔
product tag. Checkpoint **history** (scheduled + on-demand) is owned solely by
the CHECKPOINTS ledger — STATUS and the "Due now" block intentionally do not
repeat it, so wrap-ups add only a ledger row + report (no range/counter prose to
bump). A wrap-up run is therefore: verify gates + validator, reconcile anything
the validator can't see, ledger row, report, branch → merge → push.
