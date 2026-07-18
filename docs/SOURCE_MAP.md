# Source Map

> **Purpose:** Help future AI sessions navigate the repo without loading every file.
> **Read when:** Locating where a rule, file, or command lives.
> **Update when:** Files, modules, commands, ownership, or boundaries change.
> **Synchronize with:** ARCHITECTURE.md, STATUS.md.
> **Status:** Active.

## Governance docs (canonical owners) — `docs/`

| Path | Owns | Read when |
|---|---|---|
| `docs/STATUS.md` | Live state + next action | Every session (first) |
| `docs/ROADMAP.md` | Step order, packets, Standard Workflow | Planning a step |
| `docs/CHECKPOINTS.md` | Checkpoint ledger | Before/after each packet |
| `docs/AI_WORKFLOW.md` | AI startup, compliance, injection defense | Session start |
| `docs/TECH_STACK.md` | Stack + versions + compatibility | Adding/upgrading deps |
| `docs/ARCHITECTURE.md` | Boundaries, dependency direction, zero-cost guardrails | Structural changes |
| `docs/DATA_STORAGE.md` | Content model + Zod schemas | Content/schema changes |
| `docs/UI_DESIGN.md` | Visual system + accessibility | UI work |
| `docs/TESTING.md` | Test commands + gates | Adding tests / Done |
| `docs/SECURITY.md` | Threat model, secrets, privacy | Deps/input/data |
| `docs/VERSION_CONTROL.md` | Branch/commit/tag/remote/rollback | Git operations |
| `docs/ISSUE_TRACKING.md` | Issue lifecycle | Filing/closing issues |
| `docs/DEPLOYMENT.md` | Pages + domain + HTTPS + limits | Deploy (M4) |
| `docs/REFACTORING.md` | Refactor cadence + hotspots | Before new packets |
| `docs/AUDIT.md` / `DISCUSSION.md` / `ENHANCEMENTS.md` / `MARKDOWN_CONSISTENCY.md` | Checkpoint procedures | When due |
| `docs/TOOL_CREATION.md` | Validator + tool registry | Adding scripts |
| `docs/RESEARCH.md` | Stack/platform research evidence | Decision needs proof |
| `docs/AI_SEARCH.md` | AI tool/skill/MCP discovery | Considering AI tooling |
| `docs/EXTERNAL_EDITOR.md` | Editor/content workflow | Content/editor files |

## Code & config

| Path | Owns |
|---|---|
| `astro.config.mjs` | Static config (`output: 'static'`) + site/base |
| `package.json` | Deps, scripts, `yaml` override |
| `src/content.config.ts` | Astro collection loaders/wiring |
| `src/content/schema.ts` | Zod product + policy contracts |
| `src/content/**` | Product + policy content (data layer) |
| `src/lib/**` | Pure domain helpers (tested) |
| `src/layouts/**` `src/components/**` `src/pages/**` | Presentation + routes |
| `src/styles/**` | Design tokens |
| `public/**` | Static assets (icons, screenshots, CNAME at M4) |
| `scripts/validate-governance.py` | Governance validator |
| `.github/workflows/**` | `deploy.yml` only — build + Lighthouse a11y gate + Pages publish |
| `.github/ISSUE_TEMPLATE/**` | Issue forms + security route |
| `docs/tasks/**` | Task Cards per Step |
| `docs/issues/LEDGER.md` | Pre-remote issue fallback |

## Key commands

`npm run dev` · `npm run build` · `npm run check` · `npm test` (STEP-0001+) ·
`python3 scripts/validate-governance.py`
