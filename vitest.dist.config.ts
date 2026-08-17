import { defineConfig } from 'vitest/config';

// The build-output suite (STEP-0068) — assertions against `dist/`, which needs a
// build first. Its own config rather than a `--include` flag: vitest 4 has no
// such CLI option, and a second config states the separation where someone will
// actually see it.
//
// Kept out of `npm test` on purpose. That suite runs in milliseconds and gets
// run constantly; making it wait on a build is how a fast suite stops being run.
export default defineConfig({
  test: {
    // The screen suite lives under `tests/screens/` and is named `*.spec.ts`,
    // so this pattern cannot reach it. It used to need an explicit `exclude`
    // when both suites were `*.test.ts` in one folder; the extension does that
    // job now, and one rule is better than two that must agree.
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
