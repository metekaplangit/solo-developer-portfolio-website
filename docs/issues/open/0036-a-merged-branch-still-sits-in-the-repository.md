# 0036 A merged local branch, polish/site-wide, still sits in the repository

- Severity: low
- Reach: test-only
- Area: Git
- Found by: health-project 0007
- Filed: 2026-11-08
- Tried by: —
- Closed by: —

## What happens
`polish/site-wide` has no commits that are not on `main`; its last commit is from
2026-10-28. In this project the branch is the active card, so a leftover branch can
read as work still open.

## How to see it
`git branch --merged main`

## What should happen
The branch is gone. Deleting a branch needs the owner's word, so a health run leaves it.

## Evidence
- `git log --oneline main..polish/site-wide` printed 0 commits on 2026-11-08.
