# External Editor & Content Workflow

> **Purpose:** External editor/tool integration, import-package contract, and synchronization rules.
> **Read when:** Before touching editor-managed or imported files, or adding a design/content tool.
> **Update when:** The tool, import contract/schema, integration, or sync rules change.
> **Synchronize with:** TECH_STACK.md, ARCHITECTURE.md, DATA_STORAGE.md, UI_DESIGN.md, AI_WORKFLOW.md.
> **Status:** Active (minimal).
> **Activation:** No dedicated design/import tool for MVP. A design-tool section activates only if a Step Packet adopts one.

## Decision (Stage 3, decision Q4)

**Editor + Claude Code only.** Content lives in typed files edited directly by
Claude Code / any text editor. No engine editor, map editor, sprite tool, or
design-import pipeline is used for the MVP. This is the lowest-risk, zero-cost
choice.

## Content authoring workflow

- Product and policy content is authored as typed files under `src/content/`
  (Astro content collections; Markdown/MDX/JSON/YAML) and validated by Zod
  schemas. See `DATA_STORAGE.md` for the schema owner.
- Images/screenshots/icons go under `public/` or `src/assets/` with alt text and
  provenance recorded per `02-pages-and-content-model.md` MediaAsset fields.
- Local preview: `npm run dev`. Build check: `npm run build` + `npm run check`.

## Future design-tool activation (N/A now)

If visual design work justifies a tool (e.g. Figma), it becomes its **own Step
Packet** and this file gains a versioned, tool-neutral import contract (open
formats only: JSON validated by schema, standard images, design tokens). Vendor
IDs/types would stay inside a boundary adapter and never become domain types.
**Trigger:** an approved Step Packet that introduces external design assets.
