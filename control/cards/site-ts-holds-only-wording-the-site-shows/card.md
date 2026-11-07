# site.ts holds only wording the site shows

bump: patch
unrendered: a field nothing drew — `site.headline` was read by no page, so removing it changes no pixel; proved by the built-output suite and src/lib/site.test.ts

Plan 0021, card D. Closes issue 0029.

`src/lib/site.ts` declared `headline: 'Brilliant Products for All'` with a
comment calling it the home hero headline. Nothing read it: the home page's
headline has been different for months. Re-checked on 2026-11-07:
`grep -rn "\.headline" src` matched nothing.

The issue left the choice open: drop the field, or say in its comment that it
is unused. It goes. A field nobody renders, kept with a comment, is the same
trap one sentence further down. `lede`'s comment no longer leans on it and
gives its own reason for being platform neutral: the studio is cross-platform,
per the owner on 2026-07-18 and again on 2026-11-02.

The cheap test is `src/lib/site.test.ts`. It requires every field of `site` to
be read by some page, component or library file under `src/`, so the next
unused field fails rather than lingers. Seen red on the unfixed code (1 of 8:
`site.headline`), then green. `npm run headless` exit 0, 181 unit and 87
built-output tests.
