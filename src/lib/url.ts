// Base-path-aware internal link helper. On a GitHub Pages project site the app
// is served under a sub-path (import.meta.env.BASE_URL), so root-absolute hrefs
// like "/apps/" must be prefixed. `joinBase` is pure (testable); `withBase`
// reads Astro's configured base. See docs/DEPLOYMENT.md.

/** Join a base and a root-absolute path without doubling or dropping slashes. */
export function joinBase(base: string, path: string): string {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  const p = path.startsWith('/') ? path : `/${path}`;
  // External URLs, mailto:, anchors, protocol-relative — leave untouched.
  if (/^([a-z]+:)?\/\//i.test(path) || path.startsWith('mailto:') || path.startsWith('#')) {
    return path;
  }
  const joined = `${b}${p}`;
  return joined === '' ? '/' : joined;
}

/** Prefix an internal path with the configured base URL. */
export function withBase(path: string): string {
  return joinBase(import.meta.env.BASE_URL, path);
}
