# 0034 `.github/ISSUE_TEMPLATE/` keeps issue forms while issues are files in docs/issues

- Severity: low
- Reach: test-only
- Area: .github
- Found by: health-project 0004 (left alone by health-project 0005 and 0006 too)
- Filed: 2026-11-07
- Tried by: —
- Closed by: —

## What happens
`.github/ISSUE_TEMPLATE/` holds `bug.yml`, `problem.yml` and `config.yml`, from
the retired system. Known issues now live as files in `docs/issues/open/`.
A session can be sent two ways to record a problem. `docs/SOURCE_MAP.md`
still lists the forms.

## How to see it
`ls .github/ISSUE_TEMPLATE docs/issues/open`

## What should happen
One way to file an issue. Whether the forms go, or stay for outside reporters,
is the owner's call. Removal is never a health run's.

## Evidence
- The listing above on 2026-11-07; reported by health-project 0004, 0005 and 0006.
