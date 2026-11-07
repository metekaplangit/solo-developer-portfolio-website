import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { chromiumPath, webkitPath, newest } from '../../scripts/browsers.mjs';

// Issue 0027: a tool that starts the owner's installed Chrome gets it quit by
// Cold Turkey, and the owner's own window with it. Every tool that drives a
// browser — under scripts/ and tests/ — must go through scripts/browsers.mjs.

const ROOTS = ['scripts', 'tests'];
const SKIP = /(^|\/)(retired|node_modules)(\/|$)/;

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (SKIP.test(path)) return [];
    if (statSync(path).isDirectory()) return files(path);
    return /\.(m?js|ts)$/.test(name) ? [path] : [];
  });
}

const tools = ROOTS.flatMap(files).filter((f) => f !== join('scripts', 'browsers.mjs'));
const INSTALLED = /\/Applications\/(Google Chrome|Chromium)[^/]*\.app|channel:\s*['"]chrome/;

describe('every tool runs only Playwright’s own browsers', () => {
  it('finds the tools it guards', () => {
    expect(tools.length).toBeGreaterThan(5);
  });

  it.each(tools)('%s never names an installed Chrome', (file) => {
    expect(readFileSync(file, 'utf8')).not.toMatch(INSTALLED);
  });

  // A tool that finds its own browser's processes by the Chrome name also
  // counts the owner's real Chrome — its helpers, its CPU — as its own.
  it.each(tools)('%s never picks out processes by the Chrome name', (file) => {
    expect(readFileSync(file, 'utf8')).not.toMatch(/\/Google Chrome\/\.test\(/);
  });

  it.each(tools.filter((f) => /executablePath/.test(readFileSync(f, 'utf8'))))(
    '%s takes its browser from scripts/browsers.mjs',
    (file) => {
      expect(readFileSync(file, 'utf8')).toMatch(/from ['"][./]+(scripts\/)?browsers\.mjs['"]/);
    },
  );
});

describe('chromiumPath', () => {
  const cache = '/c/ms-playwright';
  const mac = (dir: string) =>
    `${cache}/${dir}/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
  const shell = (dir: string) => `${cache}/${dir}/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
  const fake = (paths: string[], dirs: string[]) => ({
    env: {},
    cache,
    exists: (p: unknown) => paths.includes(String(p)),
    list: () => dirs,
  });

  it('refuses the installed Chrome and anything outside an automation cache', () => {
    for (const asked of [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/usr/bin/google-chrome',
    ]) {
      expect(() => chromiumPath({ ...fake([asked], []), env: { PUPPETEER_EXECUTABLE_PATH: asked } })).toThrow(/outside Playwright/);
    }
  });

  it('honours a path inside the cache', () => {
    const p = mac('chromium-1248');
    expect(chromiumPath({ ...fake([p], []), env: { PUPPETEER_EXECUTABLE_PATH: p } })).toBe(p);
  });

  it('refuses to start when the cache holds no Chromium', () => {
    expect(() => chromiumPath(fake([], ['webkit-2370']))).toThrow(/No Playwright Chromium/);
  });

  it('takes the newest revision by number, not by name', () => {
    const dirs = ['chromium-999', 'chromium-1248', 'chromium-1243'];
    expect(chromiumPath(fake(dirs.map(mac), dirs))).toBe(mac('chromium-1248'));
    expect(newest(['chromium-999', 'chromium-1000'], 'chromium')).toBe('chromium-1000');
  });

  it('falls back to the headless shell when the full Chromium is missing', () => {
    expect(chromiumPath(fake([shell('chromium_headless_shell-1248')], ['chromium_headless_shell-1248']))).toBe(
      shell('chromium_headless_shell-1248'),
    );
  });
});

describe('webkitPath', () => {
  it('takes the newest WebKit and refuses when there is none', () => {
    const dirs = ['webkit-2336', 'webkit-2370', 'webkit-999'];
    const opts = { env: {}, cache: '/c', exists: () => true, list: () => dirs };
    expect(webkitPath(opts)).toBe('/c/webkit-2370/pw_run.sh');
    expect(() => webkitPath({ ...opts, list: () => [] })).toThrow(/No Playwright WebKit/);
  });
});
