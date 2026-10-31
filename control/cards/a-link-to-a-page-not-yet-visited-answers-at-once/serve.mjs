// Serves dist/ with a fixed network delay on every request and GitHub Pages' 600 s cache, so a page change can be timed as a visitor meets it.
// Run: node control/cards/a-link-to-a-page-not-yet-visited-answers-at-once/serve.mjs [port] [delayMs]   (defaults: any free port, 250 ms)
// Answers: does a first visit to a page wait on the network, and does prefetch take that wait away?
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const port = Number(process.argv[2] ?? 0);
const delay = Number(process.argv[3] ?? 250);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.json': 'application/json', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json' };
const log = [];

const server = createServer(async (req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p === '/__log') { res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify(log)); }
  log.push({ t: Date.now(), path: p, purpose: req.headers['sec-purpose'] || req.headers.purpose || '' });
  await new Promise((r) => setTimeout(r, delay));
  let f = join(process.cwd(), 'dist', p.endsWith('/') ? p + 'index.html' : p);
  let status = 200;
  let body;
  try { body = await readFile(f); } catch {
    try { body = await readFile(join(process.cwd(), 'dist', p, 'index.html')); f = 'x.html'; } catch { body = await readFile(join(process.cwd(), 'dist', '404.html')); f = 'x.html'; status = 404; }
  }
  res.writeHead(status, { 'content-type': TYPES[extname(f)] || 'application/octet-stream', 'cache-control': 'max-age=600' });
  res.end(body);
});
server.listen(port, '127.0.0.1', () => console.log(`http://127.0.0.1:${server.address().port}`));
