# Markdown Consistency

> **Purpose:** Cross-document synchronization checkpoint procedure and stale-instruction cleanup.
> **Read when:** A Markdown Consistency checkpoint is due (every 2 feature steps) or on demand.
> **Update when:** Cadence, format, ownership, or synchronization criteria change.
> **Synchronize with:** CHECKPOINTS.md, all core docs, root CLAUDE.md.
> **Status:** Active.
> **Activation:** Standard profile. First check due after feature step 2.

## Cadence

Every **2** completed feature Steps, plus on demand. Branch
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
