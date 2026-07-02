# Version Control

> **Purpose:** Step ID / commit / release distinctions, branches, merges, tags, SemVer, rollback, and remote policy.
> **Read when:** Branching, committing, merging, tagging, or handling the remote.
> **Update when:** Git, branch, version, release, remote, or rollback policy changes.
> **Synchronize with:** STATUS.md, ROADMAP.md, DEPLOYMENT.md, ISSUE_TRACKING.md, CHANGELOG.md.
> **Status:** Active.
> **Activation:** Standard profile.

## Identities (keep distinct)

- **Step ID** (`STEP-0001`) = a unit of work.
- **Commit SHA** = history.
- **SemVer tag** (`v0.1.0`) = public compatibility contract. The baseline scaffold
  is **not** a product release.

## Repository

- Repo slug: **`solo-developer-portfolio-website`** (kebab-case). Local folder:
  `solo-dev-portfolio-website` (the kickoff package occupies the canonical slug
  folder). Product display name is separate.
- Default branch: `main`. Non-destructive history only.

## Branching & merges

- After baseline, branch from current `main`:
  `feature/<step-id>-<name>`, `fix/<issue-id>-<name>`, `audit/<checkpoint-id>`,
  `discussion/<id>`, `enhancement/<id>`, `markdown-consistency/<id>`,
  `tool/<name>`, `calibration/pre-first-step`.
- Preserve branch history with **merge commits**. No squash/rebase that erases
  history. **Never** rewrite published `main`, force-push, move/delete tags, or
  discard user work.

## Remote

**Decision (2026-07-02): create/connect + push a GitHub remote immediately after
the clean baseline commit** (user-authorized). Repo slug
`solo-developer-portfolio-website`, public (required for free GitHub Pages).
Until the push completes, remote sync is recorded as pending. Once pushed,
`remote_sync` in `STATUS.md` reflects the real state. Protect `main` where
supported; require checks; restrict force-push/deletion.

*(If the remote had been declined, a synchronized local-only/Blocked state would
be recorded here and in STATUS, DEPLOYMENT, ISSUE_TRACKING, and the issue
ledger.)*

## SemVer (pre-1.0: `0.MINOR.PATCH`)

- Public contract covered: generated route URLs (privacy/support stability),
  content schema shape, static build output.
- **Versionable:** completed user-facing feature; compatible fix; product-
  affecting dependency/toolchain upgrade; compatibility change.
- **Internal-only (no product tag):** unchanged-behavior refactor, audit,
  discussion, docs, research, planning, this initialization.
- Structural invariant: one packet → one branch → one merge commit → at most one
  product tag. Tag the protected-branch merge commit for versionable packets only.

## Rollback

See `ROLLBACK_GUIDE.md` for exact commands (`git revert -m 1`, branch-from-tag,
`git diff <tag>..HEAD`). Roll back only with `git revert` or a branch from a tag.
