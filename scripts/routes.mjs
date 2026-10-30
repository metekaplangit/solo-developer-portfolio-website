// Every page the site publishes — the one list every check reads.
//
// The screen suite, the capture script and the live tier each used to write the
// routes out by hand, and by evaluate-project 0001 all three disagreed with the
// build and with each other: the screen suite and the captures had no
// `/privacy/magic-notes/`, and the live tier had neither Waypost Words page —
// the two the game links to and App Review opens. A page left off a list is a
// page nothing checks, and nothing says so.
//
// `tests/dist.test.ts` ("lists every page the build makes") holds this table
// against the HTML files in `dist/`, so a new product's pages fail the fast
// checks until they are added here. The two old Wander Words addresses are not
// pages but forwards, and are checked there on their own.
//
// Plain `.mjs` so the node scripts can import it as it is; the TypeScript suites
// read its types from the JSDoc below.
//
// No two tags may share a name: the control matches a card's tag against the
// words of a test title, and the capture script against the tags here.

/**
 * @typedef {object} Route
 * @property {string} path  The address, as a visitor types it.
 * @property {string} tag   The screen a card names, carried by one `test()` title.
 * @property {string} name  How a test title reads it.
 * @property {string} file  The picture's file name in a card's workshop.
 */

/** @type {readonly Route[]} In the order a reader would meet them. */
export const ROUTES = Object.freeze([
  { path: '/', tag: '@home', name: 'the home page', file: 'home' },
  { path: '/apps/', tag: '@apps', name: 'the catalog', file: 'apps' },
  { path: '/apps/sole-focus/', tag: '@sole-focus', name: "Sole Focus's product page", file: 'sole-focus' },
  { path: '/apps/magic-notes/', tag: '@magic-notes', name: "Magic Notes's product page", file: 'magic-notes' },
  { path: '/apps/waypost-words/', tag: '@waypost-words', name: "Waypost Words's product page", file: 'waypost-words' },
  { path: '/about/', tag: '@about', name: 'the about page', file: 'about' },
  { path: '/support/', tag: '@support', name: 'the support page', file: 'support' },
  { path: '/privacy/', tag: '@privacy-index', name: 'the privacy index', file: 'privacy-index' },
  { path: '/privacy/sole-focus/', tag: '@privacy-sole-focus', name: "Sole Focus's privacy policy", file: 'privacy-sole-focus' },
  { path: '/privacy/magic-notes/', tag: '@privacy-magic-notes', name: "Magic Notes's privacy policy", file: 'privacy-magic-notes' },
  { path: '/privacy/waypost-words/', tag: '@privacy-waypost-words', name: "Waypost Words's privacy policy", file: 'privacy-waypost-words' },
  { path: '/404', tag: '@not-found', name: 'the not-found page', file: 'not-found' },
]);

/**
 * The file in `dist/` a route is built to: `/apps/` is `apps/index.html`,
 * `/404` is `404.html`.
 * @param {string} path
 * @returns {string}
 */
export function builtFile(path) {
  return path.endsWith('/') ? `${path.slice(1)}index.html` : `${path.slice(1)}.html`;
}
