# AI Capability Search

> **Purpose:** AI-assistant capability discovery — skills/plugins/MCP/CLI research, adopted guidance, and recurring search history.
> **Read when:** Considering an AI tool/skill/MCP, or during scheduled audits.
> **Update when:** After initial research, each recurring search, or any AI capability change.
> **Synchronize with:** TECH_STACK.md, ARCHITECTURE.md, SECURITY.md, AI_WORKFLOW.md.
> **Status:** Active.
> **Activation:** Standard profile.

## Initial research (2026-07-02)

| Candidate | Source / trust | Status | Reason |
|---|---|---|---|
| Astro 7 coding-agent mode (agent detection, background dev server, JSON logs) | Official (astro.build/blog/astro-7) | **Adopted** | Native machine-readable feedback for Claude Code. Enable via `astro dev` when an agent is detected; no extra dependency. |
| `@astrojs/check` | Official | **Adopted** (dev) | Type + content-schema check for CI. `yaml` override applied for security. |
| Astro MCP / third-party MCP servers | Community | **Deferred** | No approved, maintained, security-reviewed server required for a static site yet. Revisit if content volume grows. |
| Cloudflare / GitHub MCP connectors | Vendor | **Deferred** | Not needed for MVP; `gh` CLI covers repo/remote operations. |

No AI skill, MCP server, plugin, or connector is installed for this project yet.
Claude Code runs against the repository directly.

## Adopted-guidance propagation map

| Adopted item | Propagated to |
|---|---|
| Astro 7 agent-friendly workflow | AI_WORKFLOW.md (startup + build feedback), TECH_STACK.md |
| `astro check` in CI | TESTING.md, DEPLOYMENT.md, `.github/workflows/ci.yml` |
| `yaml` security override | TECH_STACK.md, SECURITY.md |

## Calibration findings (2026-07-02)

Pre-first-step calibration adopted, as workflow (not product) changes:

| Item | Source / trust | Status | Reason |
|---|---|---|---|
| VS Code Astro + MDX extensions (`.vscode/extensions.json`) | Official (astro-build.astro-vscode) | **Adopted** (recommend-only) | Content-collection type hints; optional. |
| Local npm-cache permission workaround | Environment finding | **Adopted** (documented in AI_WORKFLOW.md) | Prevents `EACCES` install failures without sudo. |
| Astro 7 agent-mode + `npm run preview` runtime proof | Official | **Adopted** (documented in AI_WORKFLOW.md, TESTING.md) | Machine-readable gates + browser runtime evidence path. |

No new dependency, service, MCP, or paid tool was added. Product intent and stack
are unchanged.

## Recurring search

Run at scheduled audits (see `CHECKPOINTS.md`). Record query, source, result,
adoption/rejection, and follow-up. None run yet beyond initialization + calibration.
