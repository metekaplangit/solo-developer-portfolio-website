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
    include: ['tests/**/*.test.ts'],
    // The geometry suite lives in the same folder but launches a browser per
    // route (STEP-0080). It has its own config and its own `npm run test:ui`;
    // without this line it would be dragged into a suite that runs in
    // milliseconds and is run constantly.
    exclude: ['tests/geometry.test.ts'],
    environment: 'node',
  },
});
