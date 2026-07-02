# CLAUDE.md

Short AI handoff for Claude Code. **Do not** duplicate the full governance system
here — read the canonical docs.

## Start every session by reading, in order

1. [`docs/STATUS.md`](docs/STATUS.md) — live state + exact next action.
2. [`docs/ROADMAP.md`](docs/ROADMAP.md) — ordered Step Packets + the one Standard Workflow.
3. [`docs/CHECKPOINTS.md`](docs/CHECKPOINTS.md) — due/completed checkpoints.
4. [`docs/AI_WORKFLOW.md`](docs/AI_WORKFLOW.md) — startup, compliance, injection defense.
5. [`docs/SOURCE_MAP.md`](docs/SOURCE_MAP.md) — where things live.

Then read the current step's owner docs (linked from STATUS).

## Non-negotiables

- Work **one frozen Step Packet at a time**; never combine independent outcomes;
  stop at acceptance.
- **Zero-cost / static-only:** Astro `output: 'static'`; no backend, database,
  serverless, Cloudflare Workers/Pages, analytics, or third-party services
  (see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)).
- Non-destructive Git: branch, merge commits, no history rewrite/force-push.
- Verify version/compat claims from official sources; never false-green a check.

## Before every merge/tag

```
npm run build && npm run check && python3 scripts/validate-governance.py
```

Live command results override docs. Any contradiction is `Needs Repair`.
