# Tool Creation

> **Purpose:** Standalone development tools, the governance validator, tool registry, and verification.
> **Read when:** Adding/updating a script or check under `scripts/` or `tools/`.
> **Update when:** A tool or governed threshold changes.
> **Synchronize with:** TESTING.md, ARCHITECTURE.md, STATUS.md, AI_WORKFLOW.md.
> **Status:** Active.
> **Activation:** Standard profile.

## Governance validator (primary tool)

`scripts/validate-governance.py` is the **single** repeatable governance gate for
the Stage-3 document contract. Extend it rather than adding disconnected scripts.
It checks required docs, the active Step + Task Card (evidence method + proof
classification), STATUS machine-state keys, live Git state (clean default branch,
branch-aware), remote-recorded-or-Blocked, CI + handoff integrity, and due
checkpoints. Command recorded in `STATUS.md`, `AI_WORKFLOW.md`, and CI.

Manual governance is only a bootstrap fallback; missing validator automation
becomes merge-critical by the first maintained release / 10 versioned packets.
The validator is already installed, so we are ahead of that line.

## Registry

| Tool | Purpose | Path | Command | State |
|---|---|---|---|---|
| Governance validator | Enforce doc/Git/step/checkpoint integrity | `scripts/validate-governance.py` | `python3 scripts/validate-governance.py` | Active |

## Planned tools (not yet built — triggers)

- **Content schema tests** (Vitest): valid/invalid/hostile content fixtures.
  *Trigger:* STEP-0001 (added with the content model).
- **Static-only fitness check:** grep `astro.config.mjs` + `package.json` for
  forbidden SSR adapters / server output / forbidden deps. *Trigger:* first time
  a dependency PR risks the zero-cost guardrail; wire into CI.
- **Link / accessibility checks:** on built pages. *Trigger:* M2/M3 user pages.

## Rules

Tools live under `scripts/` or `tools/`, separate from product code. Deterministic
or seed-controlled; each is functionally tested. No secrets; validate paths/input;
document network use (the validator makes **no** network calls).
