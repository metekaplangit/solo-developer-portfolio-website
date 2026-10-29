# Check plan 0011 landed, and fix what did not

bump: patch
unproven: browsers without cross-document view transitions or scroll timelines (Firefox; Safari before 26) — no Chrome 156 switch tried turns either feature off, and neither browser is on this machine, so the plain-load and stretching-dot fallbacks were read, not driven. Safari itself was not driven

The loop card for plan 0011, against its bar: does what was planned work the way it was supposed to, is any of it broken, does the project still stand up. Scope was exactly what cards A–E touched. It found nothing to fix, so this card changes no product file.

Driven (`probe.mjs`, built site, headless Chrome in shell mode, one fresh browser per hop): Home → Apps, Apps → Magic Notes and through its gallery, Magic Notes → back to Apps, Apps → About, at 1440 and at 390 on a touch phone, then all 4 again with reduced motion. Every settled screen is in `journey/` and was looked at whole.

- A, openings land and the old page leaves first: every hop leaves the old root in 160 ms; the arriving opening is fully visible once settled on every page, and at the moment the transition ends it is already at 0.99 opacity on product pages, so nothing pops when the travelling icon drops back into it.
- B, the icon travels: Apps → Magic Notes and back each carry only `icon-magic-notes` (420 ms); the other 2 products' icons leave with the page in 160 ms; Apps → About carries none and all 3 leave. Home → Apps carries the Magic Notes icon from its home band to its Apps band.
- C, the pill glides: 220 ms on every hop; at 390 arriving from Home, where Home's item is hidden, it fades in alone.
- D, marker and counter: after 2 arrow presses at 1440 and 390 the counter reads 3, the third dot is current and the marker sits 0 px from its centre; with reduced motion the same.
- E, the lean: the Apps band frame and button are pixel-identical on first visit and on coming back.
- Reduced motion: every hop runs a transition with no animations, ended in 8–16 ms, opening fully visible.
- Where the cards meet: on one product-page arrival the root (160 ms), the icon (420 ms), the pill (220 ms) and the held header and footer (250 ms) all run in a single transition, and the opening's landing is under way beneath them.

Proof was real: A's inline-script hash test, C's pill test and D's control-mark rule were each seen red during their own cards; B's no-name-twice test had not been, and was seen red here on a built Apps page given one icon name twice, then green on the rebuilt site (41 of 41). The scoped screen tests of every card passed at its close.

Left as lines, not fixed: the harness's Chrome detached on 6 of about 20 hops and each passed on retry (issue 0013, already filed); the phone nav row's comment says 4 items fit "from ~360px up" while 18 px hide at 360 — unchanged by this plan, measured the same on the live site.
