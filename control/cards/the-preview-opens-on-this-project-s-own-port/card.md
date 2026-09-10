# The preview opens on this project's own port

bump: patch

`.claude/launch.json` named port 4321, which is Astro's default and therefore
whichever project on this machine started first. This project's own port is
5757. The launch file now says 5757, its `url` says `http://127.0.0.1:5757`,
and `astro.config.mjs` carries `server.port: 5757` so both `astro dev` and
`astro preview` actually bind it.

The number lives in the config rather than on a command line on purpose. Passed
as a flag, only the one caller that remembered it would be right, and the launch
file is what decides where a browser is sent — a right port passed anywhere else
while the launch file still says something older opens the wrong page,
confidently. That is the failure this card exists to remove, so the config is
the single place the number appears for the server, and the launch file repeats
it only because it is a different tool reading a different file.

`strictPort` is set for both, and that is the half that matters more than the
number. Astro's default behaviour on a taken port is to slide quietly to the
next free one. That is how a session opens the port it expected, gets the
neighbouring project's site, tests it happily and reports green.

Both halves were proved by running, not by reading the config back:

- `astro preview` printed `Local http://localhost:5757/` and the page served
  there answered as this project — title `MetKap Studio`, generator
  `Astro v7.3.2`, one inline script and no third-party origin.
- `astro dev` bound 5757 as well.
- With 5757 deliberately occupied by another listener, `astro preview` exited
  **1** rather than moving to another port. The guard was seen doing its job
  before it was trusted.

Proved by Headless Suite Testing complete — `npm audit --omit=dev` clean,
0 errors from `astro check`, 114 unit tests, 22 built-output tests, exit 0 —
plus the three port checks above. No screen file changed and nothing a visitor
sees is different; this is where the machine listens, not what it serves.
