# 0035 The package and repository still call the site a solo developer's portfolio

- Severity: low
- Reach: test-only
- Area: package.json, repository name
- Found by: health-project 0004 (left alone by health-project 0005 and 0006 too)
- Filed: 2026-11-07
- Tried by: —
- Closed by: —

## What happens
`package.json`:2 is `"name": "solo-dev-portfolio-website"`, the GitHub
repository is `solo-developer-portfolio-website`, and `astro.config.mjs`:25
names the old base path. The site is MetKap Studio's, which speaks as we and
never as one person (owner, 2026-11-02).

## How to see it
`grep -n '"name"' package.json`, and `git remote -v`.

## What should happen
The names say what the site is. Renaming a package or a repository breaks
paths and links, which a health run never does.

## Evidence
- The commands above on 2026-11-07; reported by health-project 0004, 0005 and 0006.
