# Rollback Guide

> **Purpose:** Exact non-destructive commands for undoing or comparing work.
> **Read when:** You need to revert, branch from a known-good point, or compare versions.
> **Update when:** Git/rollback policy changes.
> **Synchronize with:** VERSION_CONTROL.md.
> **Status:** Active.

Never use `git reset --hard`, force-push, delete tags, or rewrite published
history unless the user explicitly authorizes that exact destructive action.

## Inspect recent history

```bash
git status --short --branch
git log --oneline --decorate --graph --max-count=20
git tag --sort=-version:refname | head -20
```

## Revert the last merged Step (already on main)

```bash
git switch main
git revert -m 1 <merge-commit-sha>
```

## Return to a previous version for new work

```bash
git switch -c recovery/from-<tag> <tag>
```

## Compare current work with a known version

```bash
git diff <tag>..HEAD
git log --oneline <tag>..HEAD
```

## Undo an unmerged feature branch (keep main untouched)

```bash
git switch main
git branch -D feature/<step-id>-<name>   # only if the branch was never merged/pushed as wanted
```

## Deployed rollback (M4, GitHub Pages)

Re-run the Pages deploy workflow against a previous good tag/commit; revert DNS
changes at Cloudflare if needed. See `DEPLOYMENT.md`.
