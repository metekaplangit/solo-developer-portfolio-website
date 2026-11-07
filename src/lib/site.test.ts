import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { site } from './site';

// Issue 0029: `site.headline` was read nowhere while its comment called it the
// home headline, so a session trusting the comment edited a string no visitor
// sees. Every field of `site` must be read by something the build renders.

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sources(path);
    return /\.(astro|ts|mjs)$/.test(name) && !/\.test\.ts$/.test(name) && path !== join('src', 'lib', 'site.ts')
      ? [path]
      : [];
  });
}

const code = sources('src').map((f) => readFileSync(f, 'utf8')).join('\n');

describe('site.ts holds only wording the site shows', () => {
  it.each(Object.keys(site))('site.%s is read by the site', (key) => {
    expect(code).toMatch(new RegExp(`\\bsite\\.${key}\\b`));
  });
});
