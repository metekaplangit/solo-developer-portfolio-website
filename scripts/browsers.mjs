// Which browser every probe, picture and screen test runs: Playwright's own.
// Run nothing here; import `chromiumPath()` or `webkitPath()` from a tool.
// Settles: no tool in this project can start the owner's installed Chrome.
//
// Cold Turkey quits every Chrome on a profile without its extension within
// seconds, and the owner's own window goes with it (issue 0027). So the only
// browsers allowed are the ones Playwright downloads into its cache — Chrome for
// Testing, its headless shell, WebKit — and a tool that cannot find one refuses
// to start rather than falling back to anything installed.

import { existsSync, readdirSync } from 'node:fs';
import { homedir, platform } from 'node:os';
import { join } from 'node:path';

const INSTALL = 'Install one with: npx playwright install chromium webkit';

/** Where Playwright keeps its browsers on this machine. */
export function playwrightCache(env = process.env, os = platform(), home = homedir()) {
  if (env.PLAYWRIGHT_BROWSERS_PATH) return env.PLAYWRIGHT_BROWSERS_PATH;
  if (os === 'darwin') return join(home, 'Library', 'Caches', 'ms-playwright');
  if (os === 'win32') return join(home, 'AppData', 'Local', 'ms-playwright');
  return join(home, '.cache', 'ms-playwright');
}

/** True for a path inside a cache that only automation browsers live in. */
export function isAutomationBrowser(path, cache) {
  return path.startsWith(cache + '/') || /\/ms-playwright\//.test(path) || /\/\.cache\/puppeteer\//.test(path);
}

/** The newest `<prefix>-<revision>` folder, by revision number, never by name. */
export function newest(dirs, prefix) {
  const re = new RegExp(`^${prefix}-(\\d+)$`);
  return dirs
    .map((d) => [d, re.exec(d)])
    .filter(([, m]) => m)
    .sort((a, b) => Number(b[1][1]) - Number(a[1][1]))
    .map(([d]) => d)[0];
}

/** The executable inside one Chromium revision folder, for each platform. */
const CHROMIUM_INSIDE = [
  ['chromium', ['chrome-mac-arm64', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing']],
  ['chromium', ['chrome-mac', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing']],
  ['chromium', ['chrome-mac-arm64', 'Chromium.app', 'Contents', 'MacOS', 'Chromium']],
  ['chromium', ['chrome-mac', 'Chromium.app', 'Contents', 'MacOS', 'Chromium']],
  ['chromium', ['chrome-linux64', 'chrome']],
  ['chromium', ['chrome-linux', 'chrome']],
  ['chromium_headless_shell', ['chrome-headless-shell-mac-arm64', 'chrome-headless-shell']],
  ['chromium_headless_shell', ['chrome-headless-shell-mac-x64', 'chrome-headless-shell']],
  ['chromium_headless_shell', ['chrome-headless-shell-linux64', 'chrome-headless-shell']],
];

/**
 * Playwright's Chromium (Chrome for Testing), else its headless shell.
 * `PUPPETEER_EXECUTABLE_PATH` is honoured only when it points into an
 * automation cache; anything else — the installed Chrome above all — is refused.
 */
export function chromiumPath({ env = process.env, cache = playwrightCache(env), exists = existsSync, list = safeList } = {}) {
  const asked = env.PUPPETEER_EXECUTABLE_PATH;
  if (asked) {
    if (!isAutomationBrowser(asked, cache)) {
      throw new Error(`PUPPETEER_EXECUTABLE_PATH points outside Playwright's cache (${asked}). Only Playwright's own browsers run here (issue 0027). Unset it to use ${cache}.`);
    }
    if (!exists(asked)) throw new Error(`PUPPETEER_EXECUTABLE_PATH does not exist: ${asked}`);
    return asked;
  }
  const dirs = list(cache);
  for (const prefix of ['chromium', 'chromium_headless_shell']) {
    const dir = newest(dirs, prefix);
    if (!dir) continue;
    for (const [p, parts] of CHROMIUM_INSIDE) {
      if (p !== prefix) continue;
      const path = join(cache, dir, ...parts);
      if (exists(path)) return path;
    }
  }
  throw new Error(`No Playwright Chromium found in ${cache}. ${INSTALL}`);
}

/** Playwright's WebKit runner, newest revision. */
export function webkitPath({ env = process.env, cache = playwrightCache(env), exists = existsSync, list = safeList } = {}) {
  const dir = newest(list(cache), 'webkit');
  const path = dir && join(cache, dir, 'pw_run.sh');
  if (path && exists(path)) return path;
  throw new Error(`No Playwright WebKit found in ${cache}. ${INSTALL}`);
}

function safeList(dir) {
  try {
    return readdirSync(dir);
  } catch {
    return [];
  }
}
