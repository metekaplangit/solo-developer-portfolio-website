import { defineConfig } from 'vitest/config';

// Two suites, deliberately separate.
//
// `npm test` is the fast loop — pure modules under `src`, milliseconds, no build
// required. `npm run test:dist` asserts against the BUILT output and therefore
// needs a build first (STEP-0068). Folding the second into the first would make
// every unit-test run wait on a build, which is how a fast suite stops being run.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
