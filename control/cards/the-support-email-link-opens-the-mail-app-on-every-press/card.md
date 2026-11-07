# The support email link opens the mail app on every press

bump: patch

Plan 0021, card C. Closes issue 0028, as not reproduced.

The issue saw Chrome log "Not allowed to launch 'mailto:…' because a user
gesture is required" twice in one chaos storm on 2026-10-31. It was not seen
again on 2026-11-07, in 2 honest tries, both in Playwright's Chromium (Chrome
for Testing 1248) on v0.67.2.

1. The way a person would. `mailto-presses.mjs` in this folder pressed the
   support address with a real mouse on every page that shows one: About,
   Support, Privacy and a product's privacy page. It pressed once, twice 80ms
   apart, 5 times in a burst, and 3 times 1.5s apart. All 44 presses logged
   "Launched external handler", and 0 were refused. `/` and `/apps/` show no
   address, so the storm's `/apps/` reading was a step that started there and
   pressed the link on a page it had reached.
2. The steps as written. `node scripts/probe/chaos-probe.mjs --block=storm
   --seed=1` ran for 478s, exit 0, with 0 invariant breaks and no line naming
   mailto anywhere in its output.

Research: Chromium has a flood guard on external-protocol launches. It refuses
a later launch until there is a fresh user gesture, per the Microsoft Tech
Community thread and the Stack Overflow question cited in plan 0021. That fits
a burst of synthetic events in the old storm, and it never stops a person's own
press. Nothing in the site changed, and the storm's console check is
untouched: a refusal would still be read as a break.
