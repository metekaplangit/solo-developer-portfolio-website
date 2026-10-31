# 0028 Chrome refuses the support email link during quick presses

- Severity: low
- Reach: player
- Area: Apps & Games page, About page
- Found by: session (plan 0020, card A)
- Filed: 2026-10-31
- Tried by: —
- Closed by: —

Doubt: only the console line was seen; whether a visitor's press on the link
ever fails to open their mail app is not known. Reach is rounded up to
`player` because the storm only presses and clicks.

## What happens
Chrome logged "Not allowed to launch 'mailto:support@metkapstudio.com' because
a user gesture is required" twice in one chaos storm, once on `/apps/` and
once on `/about/`. Plan 0019's seed 1 storm reported 0 breaks, so this is new
since then, or new to Chrome for Testing.

## How to see it
Build, then `PUPPETEER_EXECUTABLE_PATH=<Playwright's Chrome for Testing> node scripts/probe/chaos-probe.mjs --block=storm --seed=1`, and read for `mailto`.

## What should happen
A press on the support email link opens the mail app, and Chrome logs nothing.

## Evidence
- Storm seed 1, Chrome for Testing 156, 2026-10-31, on v0.66.30 plus plan 0020's card A: `BREAK seed 1 step 874 on /apps/` and `BREAK seed 1 step 1049 on /about/`, both that console line.
