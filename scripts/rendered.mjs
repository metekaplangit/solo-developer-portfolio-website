#!/usr/bin/env node
// The screen tier, as `control/loop.py` runs it.
//
//   node scripts/rendered.mjs @home @privacy-index
//
// The control appends one screen tag per argument — the ones the card named,
// plus the few it sweeps along from the ledger — and expects a non-zero exit
// when a screen is wrong.
//
// IT RUNS EVERY ROUTE WHATEVER IT IS GIVEN, and that is deliberate. One rule in
// the suite compares the page-title indent of every route against every other,
// so a run that loaded three of them could not check it at all. Loading all nine
// costs about a minute, which is the price of the tier and is paid only by a
// card that touched something a visitor can see.
//
// So the tags do not choose which pages load. They choose which screens the card
// is answerable for — the control refuses a tag no test title carries, records
// the ones it ran in `control/screens.json`, and requires pictures of them.
//
// The build is not run here: the control runs the fast checks first, and those
// start with `npm run build`, so `dist/` is fresh by the time this is reached.
// The suite refuses to run against a missing `dist/` rather than passing on air.

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const tags = process.argv.slice(2);

if (!existsSync('dist/index.html')) {
  console.error('dist/ is missing — run `npm run build` first (the control does this for you).');
  process.exit(1);
}

console.log(
  tags.length
    ? `Screens named: ${tags.join(' ')} — every route is loaded regardless, because one rule compares them against each other.`
    : 'No screens named — running every route.',
);

const done = spawnSync('npx', ['vitest', 'run', '--config', 'vitest.ui.config.ts'], {
  stdio: 'inherit',
  shell: false,
});

process.exit(done.status ?? 1);
