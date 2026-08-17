import { defineConfig } from 'vitest/config';

// The rendered-geometry suite (STEP-0080) — assertions about what the browser
// actually lays out, which needs a build first and a real engine to read.
//
// Its own config for the same reason `vitest.dist.config.ts` has one: vitest 4
// has no per-run include flag, and a second config states the separation where
// someone will see it. Kept out of BOTH `npm test` and `npm run test:dist` on
// purpose — this one launches a browser per route and takes tens of seconds,
// and a fast suite that waits on a browser stops being run.
export default defineConfig({
  test: {
    // `tests/screens/` is the folder `control/project.py` names as this
    // project's screen tests, and `.spec.ts` is the extension the control
    // globs for. Neither is a preference — see the header of the suite.
    include: ['tests/screens/*.spec.ts'],
    environment: 'node',
    // A browser per route, four viewports each, with retries for the frame
    // detach described in the suite header. The default 5s would fail on the
    // first route every time.
    testTimeout: 240_000,
    hookTimeout: 240_000,
  },
});
