// What: inspect-project's measuring sweep — every built route at every size, page zoom and contrast setting, read as numbers (text that fits, overlap, alignment, spacing, sizes, pictures, tap size, contrast, line breaks, words) and pictured in tiles at the device's density.
// Run: npm run build, then node scripts/probe/inspect-probe.mjs <time|calibrate|sweep|words> [--lane=1/3] [--out=<dir>] [--only=<cell id>] [--fresh] [--gpu]   (uses the global `playwright` install; `words` spell-checks every string in dist/ with macOS's own checker)
// Settles: what on the built site's screens looks wrong right now — placed, sized, spaced or written unlike the site's own values, or under a WCAG 2.2 floor?
import { createServer } from 'node:http';
import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { execSync, execFileSync } from 'node:child_process';
import { extname, join } from 'node:path';
import sharp from 'sharp';

const require = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
const { chromium } = require('playwright');

const DIST = 'dist';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const ROUTES = [
  { path: '/', file: 'home' },
  { path: '/apps/', file: 'apps' },
  { path: '/apps/sole-focus/', file: 'sole-focus' },
  { path: '/apps/magic-notes/', file: 'magic-notes' },
  { path: '/apps/waypost-words/', file: 'waypost-words' },
  { path: '/about/', file: 'about' },
  { path: '/support/', file: 'support' },
  { path: '/privacy/', file: 'privacy-index' },
  { path: '/privacy/sole-focus/', file: 'privacy-sole-focus' },
  { path: '/privacy/magic-notes/', file: 'privacy-magic-notes' },
  { path: '/privacy/waypost-words/', file: 'privacy-waypost-words' },
  { path: '/404', file: 'not-found' },
  // The two moved addresses forward at once (meta refresh 0); read with the
  // refresh stripped by this server only, so the flash a visitor sees is measured.
  { path: '/apps/wander-words/', file: 'stub-apps-wander-words', stub: true },
  { path: '/privacy/wander-words/', file: 'stub-privacy-wander-words', stub: true },
];

// Phones: the site's own narrowest (320) and the commonest current iPhone (393 @3);
// the smallest iPad (744 @2); a small and a large desktop window.
const SIZES = [
  { name: '320', w: 320, h: 568, dpr: 2, touch: true },
  { name: '393', w: 393, h: 852, dpr: 3, touch: true },
  { name: '744', w: 744, h: 1133, dpr: 2, touch: true },
  { name: '1280', w: 1280, h: 800, dpr: 2, touch: false },
  { name: '1920', w: 1920, h: 1080, dpr: 1, touch: false },
];

/** Every cell of the matrix: route × size × zoom (1 or 2) × contrast (normal or more). */
function cells() {
  const out = [];
  for (const r of ROUTES) {
    for (const s of SIZES) {
      if (r.stub && !['393', '1280'].includes(s.name)) continue;
      out.push({ r, s, zoom: 1, theme: 'normal' });
      if (r.stub) continue;
      out.push({ r, s, zoom: 2, theme: 'normal' });
      out.push({ r, s, zoom: 1, theme: 'more' });
    }
  }
  for (const c of out) c.id = `${c.r.file}@${c.s.name}@z${c.zoom}@${c.theme}`;
  return out;
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.xml': 'application/xml', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon',
};

function serveDist() {
  const server = createServer((req, res) => {
    const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
    const cands = url.endsWith('/') ? [join(DIST, url, 'index.html')] : [join(DIST, url), join(DIST, url + '.html'), join(DIST, url, 'index.html')];
    const file = cands.find((p) => existsSync(p) && statSync(p).isFile());
    if (!file) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(readFileSync(join(DIST, '404.html')));
      return;
    }
    let body = readFileSync(file);
    if (req.headers['x-inspect-stub'] && extname(file) === '.html') {
      body = Buffer.from(body.toString().replace(/<meta http-equiv="refresh"[^>]*>/i, ''));
    }
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, base: `http://127.0.0.1:${server.address().port}` })));
}

const args = Object.fromEntries(process.argv.slice(3).map((a) => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const MODE = process.argv[2];
const OUT = args.out ?? 'inspect-out';
mkdirSync(join(OUT, 'readings'), { recursive: true });
mkdirSync(join(OUT, 'pictures'), { recursive: true });

async function launch() {
  const gpu = args.gpu ? ['--enable-gpu', '--use-angle=metal'] : [];
  return chromium.launch({ executablePath: CHROME, headless: true, args: ['--hide-scrollbars', ...gpu] });
}

const now = () => performance.now();

// ---------------------------------------------------------------------------
// The in-page readers. One function, run once the page has settled; returns
// plain numbers. Rects are in page (document) coordinates, CSS px.
// ---------------------------------------------------------------------------
function readPage(opts) {
  const sx = window.scrollX, sy = window.scrollY;
  const R = (r) => ({ x: Math.round((r.left + sx) * 10) / 10, y: Math.round((r.top + sy) * 10) / 10, w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10 });
  const vw = document.documentElement.clientWidth;
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const rgba = (c) => { ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = '#000'; ctx.fillStyle = c; ctx.fillRect(0, 0, 1, 1); const d = ctx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], Math.round((d[3] / 255) * 1000) / 1000]; };
  const pathOf = (el) => { const p = []; while (el && el !== document.body && p.length < 6) { let s = el.tagName.toLowerCase(); if (el.id) s += '#' + el.id; else if (el.classList.length) s += '.' + [...el.classList].slice(0, 2).join('.'); p.unshift(s); el = el.parentElement; } return p.join(' > '); };
  const shown = (el) => {
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.visibility === 'collapse' || parseFloat(cs.opacity) === 0) return false;
      if (cs.clip && cs.clip !== 'auto') return false;
      if (cs.clipPath && /inset\(50%|inset\(100%/.test(cs.clipPath)) return false;
      if (e.hasAttribute('hidden')) return false;
    }
    const r = el.getBoundingClientRect();
    // Parked off the window on purpose until focused (the skip link).
    if (r.right < -100 || r.left > document.documentElement.scrollWidth + 100) return false;
    return r.width > 1 && r.height > 1;
  };
  const opacityOf = (el) => { let o = 1; for (let e = el; e; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity); return o; };
  const clippers = (el) => { const out = []; for (let e = el; e && e !== document.documentElement; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') out.push({ e, cs }); } return out; };

  const out = { vw, docW: document.documentElement.scrollWidth, docH: document.documentElement.scrollHeight, rootFont: getComputedStyle(document.documentElement).fontSize, muted: getComputedStyle(document.documentElement).getPropertyValue('--muted').trim(), title: document.title };

  // --- Text pieces: every element with its own visible text ----------------
  const texts = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const byEl = new Map();
  for (let n = tw.nextNode(); n; n = tw.nextNode()) {
    if (!n.nodeValue.trim()) continue;
    const el = n.parentElement;
    if (!el || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(el.tagName)) continue;
    if (!byEl.has(el)) byEl.set(el, []);
    byEl.get(el).push(n);
  }
  let tid = 0;
  for (const [el, nodes] of byEl) {
    if (!shown(el)) continue;
    const cs = getComputedStyle(el);
    const rects = [];
    for (const n of nodes) { const rg = document.createRange(); rg.selectNodeContents(n); for (const r of rg.getClientRects()) if (r.width > 0.5 && r.height > 0.5) rects.push(r); }
    if (!rects.length) continue;
    const t = { id: tid++, el, path: pathOf(el), text: nodes.map((n) => n.nodeValue).join('').replace(/\s+/g, ' ').trim().slice(0, 140), rects: rects.map(R), fs: parseFloat(cs.fontSize), fw: parseInt(cs.fontWeight, 10), color: rgba(cs.color), op: opacityOf(el) };
    // Fits: each line box against every clipping ancestor and the window.
    const issues = [];
    for (const { e, cs: ccs } of clippers(el)) {
      const b = e.getBoundingClientRect();
      const bl = b.left + e.clientLeft, br = bl + e.clientWidth, bt = b.top + e.clientTop, bb = bt + e.clientHeight;
      const scroller = /auto|scroll/.test(ccs.overflowX + ccs.overflowY);
      for (const r of rects) {
        const dx = Math.max(bl - r.left, r.right - br), dy = Math.max(bt - r.top, r.bottom - bb);
        if (dx > 1 && /hidden|clip|auto|scroll/.test(ccs.overflowX)) issues.push({ kind: scroller ? 'past-scroller-edge' : 'clipped', axis: 'x', by: Math.round(dx * 10) / 10, at: pathOf(e) });
        if (dy > 1 && /hidden|clip|auto|scroll/.test(ccs.overflowY)) issues.push({ kind: scroller ? 'past-scroller-edge' : 'clipped', axis: 'y', by: Math.round(dy * 10) / 10, at: pathOf(e) });
      }
    }
    if (cs.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1) issues.push({ kind: 'ellipsis', by: el.scrollWidth - el.clientWidth });
    if (cs.webkitLineClamp && cs.webkitLineClamp !== 'none' && el.scrollHeight > el.clientHeight + 1) issues.push({ kind: 'line-clamp', by: el.scrollHeight - el.clientHeight });
    for (const r of rects) if (r.right > vw + 1 || r.left < -1) { issues.push({ kind: 'past-window', by: Math.round(Math.max(r.right - vw, -r.left) * 10) / 10 }); break; }
    // Dedupe.
    const seen = new Set();
    t.fit = issues.filter((i) => { const k = i.kind + i.axis + i.at; if (seen.has(k)) return false; seen.add(k); return true; });
    t.visRects = rects; // live, dropped before return
    texts.push(t);
  }

  // --- Lines and breaks, for blocks of prose and headings -------------------
  const BLOCKS = 'h1,h2,h3,h4,p,li,dd,dt,figcaption,blockquote,summary,.lede';
  const lines = [];
  for (const el of document.querySelectorAll(BLOCKS)) {
    if (!shown(el) || el.querySelector('p,li,h1,h2,h3,h4,ul,ol')) continue;
    const words = [];
    const w2 = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = w2.nextNode(); n; n = w2.nextNode()) {
      const re = /[^\s ]+/g; let m;
      while ((m = re.exec(n.nodeValue))) {
        const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length);
        const rs = [...rg.getClientRects()].filter((r) => r.width > 0.5);
        if (!rs.length) continue;
        const tops = new Set(rs.map((r) => Math.round(r.top)));
        words.push({ w: m[0], top: Math.round(rs[0].top), left: rs[0].left, right: rs[rs.length - 1].right, split: tops.size > 1 });
      }
    }
    if (words.length < 2) continue;
    const ls = [];
    for (const w of words) { const last = ls[ls.length - 1]; if (last && Math.abs(last.top - w.top) < 4) { last.words.push(w); last.right = Math.max(last.right, w.right); } else ls.push({ top: w.top, left: w.left, right: w.right, words: [w] }); }
    lines.push({ tag: el.tagName.toLowerCase(), path: pathOf(el), text: el.textContent.replace(/\s+/g, ' ').trim().slice(0, 90), n: ls.length, lines: ls.map((l) => ({ w: Math.round(l.right - l.left), words: l.words.length, end: l.words[l.words.length - 1].w, first: l.words[0].w })), split: words.filter((w) => w.split).map((w) => w.w), measure: Math.round(el.getBoundingClientRect().width) });
  }

  // --- Overlap: text against text, and controls against each other ----------
  const visible = (r, el) => { // a rect cut down to what its clipping ancestors let show
    let { left, top, right, bottom } = r;
    for (const { e } of clippers(el)) { const b = e.getBoundingClientRect(); left = Math.max(left, b.left); top = Math.max(top, b.top); right = Math.min(right, b.right); bottom = Math.min(bottom, b.bottom); }
    return right - left > 0.5 && bottom - top > 0.5 ? { left, top, right, bottom } : null;
  };
  const inter = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  const overlaps = [];
  // A range's rect is the font's whole content area, which tight display leading
  // pushes past the line box; the ink sits in the middle 0.7 of the font size.
  const ink = (r, fs) => { const cy = r.top + r.height / 2, h = Math.min(r.height, fs * 0.7) / 2; return { left: r.left, right: r.right, top: cy - h, bottom: cy + h }; };
  const tv = texts.map((t) => ({ t, rs: t.visRects.map((r) => visible(ink(r, t.fs), t.el)).filter(Boolean) }));
  for (let i = 0; i < tv.length; i++) for (let j = i + 1; j < tv.length; j++) {
    const a = tv[i], b = tv[j];
    if (a.t.el.contains(b.t.el) || b.t.el.contains(a.t.el)) continue;
    let area = 0; for (const ra of a.rs) for (const rb of b.rs) area += inter(ra, rb);
    // Line boxes of adjacent lines touch by a hair through leading; ink overlap needs more.
    if (area > 12) overlaps.push({ kind: 'text-text', a: a.t.path + ' “' + a.t.text.slice(0, 40) + '”', b: b.t.path + ' “' + b.t.text.slice(0, 40) + '”', area: Math.round(area) });
  }
  const CONTROL = 'a[href],button,[role=button],input,select,textarea,summary,[tabindex]:not([tabindex="-1"])';
  const controls = [...document.querySelectorAll(CONTROL)].filter(shown);
  const isScroller = (el) => { const cs = getComputedStyle(el); return /auto|scroll/.test(cs.overflowX + cs.overflowY) && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1); };
  const cv = controls.filter((el) => !isScroller(el)).map((el) => { const rs = [...el.getClientRects()].map((r) => visible(r, el)).filter(Boolean); return { el, rs }; }).filter((c) => c.rs.length);
  for (let i = 0; i < cv.length; i++) for (let j = i + 1; j < cv.length; j++) {
    const a = cv[i], b = cv[j];
    if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
    let area = 0; for (const ra of a.rs) for (const rb of b.rs) area += inter(ra, rb);
    if (area > 4) overlaps.push({ kind: 'control-control', a: pathOf(a.el), b: pathOf(b.el), area: Math.round(area) });
  }
  // Text sitting over a control it does not belong to.
  for (const { t, rs } of tv) for (const c of cv) {
    if (c.el.contains(t.el) || t.el.contains(c.el)) continue;
    let area = 0; for (const ra of rs) for (const rb of c.rs) area += inter(ra, rb);
    if (area > 12) overlaps.push({ kind: 'text-control', a: t.path + ' “' + t.text.slice(0, 40) + '”', b: pathOf(c.el), area: Math.round(area) });
  }

  // --- Tap size against SC 2.5.8 ---------------------------------------------
  const taps = [];
  const boxes = cv.map((c) => { const r = c.el.getBoundingClientRect(); return { el: c.el, r }; });
  for (const { el, r } of boxes) {
    const cs = getComputedStyle(el);
    const parentText = el.parentElement ? el.parentElement.textContent.replace(/\s+/g, ' ').trim() : '';
    const inline = cs.display === 'inline' && parentText.length > el.textContent.trim().length + 3;
    const small = r.width < 24 || r.height < 24;
    const rec = { path: pathOf(el), label: (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40), w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10, inline };
    if (small && !inline) {
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      let clash = null;
      for (const o of boxes) {
        if (o.el === el || o.el.contains(el) || el.contains(o.el)) continue;
        const nx = Math.max(o.r.left, Math.min(cx, o.r.right)), ny = Math.max(o.r.top, Math.min(cy, o.r.bottom));
        const oSmall = o.r.width < 24 || o.r.height < 24;
        const d = oSmall ? Math.hypot(cx - (o.r.left + o.r.width / 2), cy - (o.r.top + o.r.height / 2)) : Math.hypot(cx - nx, cy - ny);
        if (d < (oSmall ? 24 : 12)) { clash = pathOf(o.el); break; }
      }
      rec.floor = clash ? 'fails' : 'spacing-exception';
      rec.clash = clash;
      taps.push(rec);
    } else if (opts.touch && (r.width < 44 || r.height < 44) && !inline) { rec.floor = 'under-44-touch'; taps.push(rec); }
  }

  // --- Non-text controls without text: their own fill, for contrast ---------
  const marks = [];
  for (const el of document.querySelectorAll('.dot, .dots button, [class*="dot"], .gallery-arrow, button svg, a svg')) {
    if (!shown(el)) continue;
    const cs = getComputedStyle(el);
    const fill = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' ? cs.backgroundColor : (cs.fill && cs.fill !== 'none' ? cs.fill : cs.color);
    marks.push({ path: pathOf(el), rect: R(el.getBoundingClientRect()), color: rgba(fill) });
  }

  // --- Alignment and spacing among siblings ----------------------------------
  const align = [], spacing = [];
  const modeOf = (xs) => { const c = new Map(); for (const x of xs) { const k = Math.round(x); c.set(k, (c.get(k) || 0) + 1); } return [...c.entries()].sort((a, b) => b[1] - a[1])[0]; };
  for (const p of document.querySelectorAll('body *')) {
    const kids = [...p.children].filter((k) => !['SCRIPT', 'STYLE', 'TEMPLATE', 'BR'].includes(k.tagName) && shown(k) && getComputedStyle(k).position !== 'absolute' && getComputedStyle(k).position !== 'fixed');
    if (kids.length < 3) continue;
    const rs = kids.map((k) => k.getBoundingClientRect());
    const column = rs.every((r, i) => i === 0 || r.top >= rs[i - 1].bottom - 1);
    const row = rs.every((r, i) => i === 0 || r.left >= rs[i - 1].right - 1) && rs.every((r) => Math.abs(r.top - rs[0].top) < rs[0].height);
    const pcs = getComputedStyle(p);
    if (column) {
      const centred = pcs.textAlign === 'center' || pcs.alignItems === 'center';
      const xs = rs.map((r) => (centred ? r.left + r.width / 2 : r.left));
      const [m, cnt] = modeOf(xs);
      xs.forEach((x, i) => { const d = Math.abs(x - m); if (d >= 0.75 && d <= 3.5 && cnt >= 2) align.push({ parent: pathOf(p), child: pathOf(kids[i]), edge: centred ? 'centre' : 'left', off: Math.round((x - m) * 10) / 10, of: kids.length }); });
      const gaps = rs.slice(1).map((r, i) => r.top - rs[i].bottom);
      if (gaps.length >= 2) { const [gm, gc] = modeOf(gaps); gaps.forEach((g, i) => { const d = Math.abs(g - gm); if (d >= 1 && d <= 6 && gc >= 2) spacing.push({ parent: pathOf(p), between: [pathOf(kids[i]), pathOf(kids[i + 1])], gap: Math.round(g * 10) / 10, usual: gm, axis: 'y' }); }); }
    } else if (row) {
      const ys = rs.map((r) => r.top), hs = rs.map((r) => r.height), cy = rs.map((r) => r.top + r.height / 2);
      const sameH = hs.every((h) => Math.abs(h - hs[0]) < 0.75);
      const [m, cnt] = modeOf(pcs.alignItems === 'center' ? cy : ys);
      (pcs.alignItems === 'center' ? cy : ys).forEach((y, i) => { const d = Math.abs(y - m); if (d >= 0.75 && d <= 3.5 && cnt >= 2) align.push({ parent: pathOf(p), child: pathOf(kids[i]), edge: pcs.alignItems === 'center' ? 'centre-y' : 'top', off: Math.round((y - m) * 10) / 10, of: kids.length, sameH }); });
      const gaps = rs.slice(1).map((r, i) => r.left - rs[i].right);
      if (gaps.length >= 2) { const [gm, gc] = modeOf(gaps); gaps.forEach((g, i) => { const d = Math.abs(g - gm); if (d >= 1 && d <= 6 && gc >= 2) spacing.push({ parent: pathOf(p), between: [pathOf(kids[i]), pathOf(kids[i + 1])], gap: Math.round(g * 10) / 10, usual: gm, axis: 'x' }); }); }
    }
  }
  // Icon beside text in one row: centre against the text's line box.
  const iconText = [];
  for (const svg of document.querySelectorAll('svg, img')) {
    if (!shown(svg)) continue;
    const p = svg.parentElement; if (!p) continue;
    const pcs = getComputedStyle(p);
    if (!/flex/.test(pcs.display) || pcs.flexDirection.startsWith('column')) continue;
    const sib = [...p.childNodes].find((n) => n !== svg && (n.nodeType === 3 ? n.nodeValue.trim() : n.textContent && n.textContent.trim() && !n.querySelector?.('svg,img')));
    if (!sib) continue;
    const rg = document.createRange(); rg.selectNodeContents(sib); const tr = [...rg.getClientRects()].filter((r) => r.width > 0.5);
    if (tr.length !== 1) continue;
    const ir = svg.getBoundingClientRect();
    if (ir.height > tr[0].height * 3) continue; // a picture beside a line, not an icon in it
    const d = ir.top + ir.height / 2 - (tr[0].top + tr[0].height / 2);
    iconText.push({ path: pathOf(svg), text: (sib.textContent || '').trim().slice(0, 30), off: Math.round(d * 10) / 10, icon: Math.round(ir.height), line: Math.round(tr[0].height) });
  }

  // --- Same sizes: alike elements that differ by a little --------------------
  const groups = new Map();
  for (const el of document.querySelectorAll('main *, header *, footer *')) {
    if (!el.classList.length || !shown(el)) continue;
    const k = el.tagName + '.' + [...el.classList].sort().join('.');
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(el);
  }
  const sizes = [];
  for (const [k, els] of groups) {
    if (els.length < 2) continue;
    const rs = els.map((e) => e.getBoundingClientRect());
    for (const [dim, vals] of [['h', rs.map((r) => r.height)], ['w', rs.map((r) => r.width)]]) {
      const [m, cnt] = modeOf(vals);
      if (cnt < 2) continue;
      vals.forEach((v, i) => { const d = Math.abs(v - m); if (d >= 1 && d <= 4) sizes.push({ group: k, el: pathOf(els[i]), dim, v: Math.round(v * 10) / 10, usual: m, of: els.length }); });
    }
  }
  const buttons = [...document.querySelectorAll('.btn')].filter(shown).map((b) => ({ path: pathOf(b), cls: [...b.classList].join(' '), h: Math.round(b.getBoundingClientRect().height * 10) / 10, label: b.textContent.replace(/\s+/g, ' ').trim().slice(0, 30), set: pathOf(b.parentElement) }));

  // --- Pictures ---------------------------------------------------------------
  const images = [];
  for (const img of document.querySelectorAll('img')) {
    if (!shown(img) || !visible(img.getBoundingClientRect(), img)) continue;
    const r = img.getBoundingClientRect(), cs = getComputedStyle(img);
    const svg = /\.svg(\?|$)/.test(img.currentSrc);
    images.push({ path: pathOf(img), src: img.currentSrc.replace(location.origin, ''), complete: img.complete, nw: img.naturalWidth, nh: img.naturalHeight, w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10, fit: cs.objectFit, svg, sharpness: svg || !img.naturalWidth ? null : Math.round((img.naturalWidth / (r.width * devicePixelRatio)) * 100) / 100, stretch: img.naturalWidth && cs.objectFit === 'fill' ? Math.round(((r.width / r.height) / (img.naturalWidth / img.naturalHeight) - 1) * 1000) / 10 : null });
  }

  // --- Background by CSS, where the ancestors say it plainly -----------------
  for (const t of texts) {
    let bg = null, complex = false;
    const layers = [];
    for (let e = t.el; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage !== 'none') { complex = true; break; }
      const c = rgba(cs.backgroundColor);
      if (c[3] > 0) { layers.push(c); if (c[3] >= 1) break; }
    }
    if (!complex) {
      let base = [8, 9, 12];
      const lay = layers.reverse();
      let acc = lay.length && lay[0][3] >= 1 ? lay.shift().slice(0, 3) : base;
      for (const c of lay) acc = acc.map((v, i) => v * (1 - c[3]) + c[i] * c[3]);
      bg = acc.map(Math.round);
    }
    // Something drawn behind the text that is not an ancestor: a picture, a
    // positioned layer. Sample pixels instead of trusting the ancestors.
    for (const img of document.querySelectorAll('img, video, canvas')) { if (!shown(img)) continue; const ir = img.getBoundingClientRect(); if (t.visRects.some((r) => inter(r, ir) > 4)) { complex = true; break; } }
    t.cssBg = complex ? null : bg;
  }

  out.texts = texts.map(({ el, visRects, ...t }) => t);
  out.lines = lines; out.overlaps = overlaps; out.taps = taps; out.marks = marks; out.align = align; out.spacing = spacing; out.iconText = iconText; out.sizes = sizes; out.buttons = buttons; out.images = images;
  out.rail = (() => { const l = (s) => { const e = document.querySelector(s); return e && shown(e) ? Math.round(e.getBoundingClientRect().left) : null; }; return { brand: l('header a'), main: l('main h1') , prose: l('main p'), footer: l('footer a') }; })();
  out.attrs = [...document.querySelectorAll('[alt],[aria-label],[title],[placeholder]')].flatMap((e) => ['alt', 'aria-label', 'title', 'placeholder'].map((a) => e.getAttribute(a)).filter(Boolean));
  out.visibleText = texts.map((t) => t.text);
  return out;
}

// ---------------------------------------------------------------------------
// Pixels: the tiles a picture pass takes are also what contrast is read from.
// ---------------------------------------------------------------------------
const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100; };

// Window-sized pictures, scrolled. A full-page capture resizes the window and,
// under phone emulation, drops the coarse pointer for the rest of the page's
// life: the gallery dots fell from 44 to 28 px and everything below moved up
// 28 px, so pictures no longer matched the positions read before them.
async function tiles(page, cell, docH, dpr, dir) {
  const out = [];
  const { width: w, height: vh } = page.viewportSize();
  const head = await page.evaluate(() => { const h = document.querySelector('header'); return h ? Math.ceil(h.getBoundingClientRect().height) : 0; });
  const step = Math.max(200, vh - head);
  for (let y = 0, i = 0; ; i++) {
    const sy = await page.evaluate((t) => { scrollTo(0, t); return scrollY; }, y);
    await page.waitForTimeout(60);
    const png = await page.screenshot({ animations: 'disabled', caret: 'hide' });
    const img = sharp(png);
    const { data, info } = await img.clone().raw().toBuffer({ resolveWithObject: true });
    // The sticky header covers the top of every picture after the first.
    out.push({ y: sy + (sy ? head : 0), h: vh - (sy ? head : 0), top: sy, data, info });
    if (dir) await img.jpeg({ quality: 70 }).toFile(join(dir, `${cell.id}-t${i}.jpg`));
    if (sy + vh >= docH - 1 || i > 60) break;
    y = sy + step;
  }
  await page.evaluate(() => scrollTo(0, 0));
  return out;
}

function sampleBg(tl, rect, fg, dpr) {
  const t = tl.find((t) => rect.y >= t.y && rect.y + Math.min(rect.h, 40) <= t.y + t.h) || tl.find((t) => rect.y >= t.y && rect.y < t.y + t.h);
  if (!t) return null;
  const { data, info } = t; const ch = info.channels; const sc = 1;
  const x0 = Math.max(0, Math.floor(rect.x * dpr)), x1 = Math.min(info.width, Math.ceil((rect.x + rect.w) * dpr));
  const y0 = Math.max(0, Math.floor((rect.y - t.top) * dpr)), y1 = Math.min(info.height, Math.ceil((rect.y - t.top + rect.h) * dpr));
  const px = [];
  const step = Math.max(1, Math.floor(((x1 - x0) * (y1 - y0)) / 4000));
  for (let y = y0, k = 0; y < y1; y++) for (let x = x0; x < x1; x++, k++) { if (k % step) continue; const o = (y * info.width + x) * ch; px.push([data[o], data[o + 1], data[o + 2]]); }
  if (!px.length) return null;
  const dist = (p) => Math.hypot(p[0] - fg[0], p[1] - fg[1], p[2] - fg[2]);
  const far = px.map((p) => [p, dist(p)]).sort((a, b) => b[1] - a[1]);
  const maxD = far[0][1];
  const bgPx = far.filter(([, d]) => d >= maxD * 0.6).map(([p]) => p);
  const med = [0, 1, 2].map((i) => { const v = bgPx.map((p) => p[i]).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; });
  // The worst background a glyph meets: the bg pixel closest to the text colour.
  const near = bgPx.map((p) => [p, dist(p)]).sort((a, b) => a[1] - b[1]);
  const worst = near[Math.floor(near.length * 0.1)][0];
  void sc;
  return { med, worst };
}

// ---------------------------------------------------------------------------
async function settle(page) {
  // Walk the page so lazy pictures load, as a visitor's scroll would.
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight, step = innerHeight * 0.9;
    for (let y = 0; y < h; y += step) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
    scrollTo(0, 0);
    const vw = document.documentElement.clientWidth;
    await Promise.all([...document.images].filter((i) => { const r = i.getBoundingClientRect(); return r.right > 0 && r.left < vw; }).map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 4000); }))));
    await document.fonts.ready;
  });
  // Stable when two reads 150 ms apart agree on height and every box.
  let prev = '';
  for (let i = 0; i < 20; i++) {
    const sig = await page.evaluate(() => document.documentElement.scrollHeight + ':' + [...document.querySelectorAll('main *')].slice(0, 400).map((e) => { const r = e.getBoundingClientRect(); return (r.top | 0) + ',' + (r.width | 0); }).join(';'));
    if (sig === prev) return i;
    prev = sig;
    await page.waitForTimeout(150);
  }
  return -1;
}

const PLANT = () => {
  const out = {};
  const ps = [...document.querySelectorAll('main p')].filter((p) => p.getBoundingClientRect().height > 10);
  if (ps.length >= 2) { const d = ps[1].getBoundingClientRect().top - ps[0].getBoundingClientRect().top; ps[1].style.transform = `translateY(${-d}px)`; out.overlap = ps[1].textContent.trim().slice(0, 30); }
  const a = [...document.querySelectorAll('footer a')].find((x) => x.textContent.trim().length > 6);
  if (a) { const s = a.style; s.display = 'inline-block'; s.width = '22px'; s.overflow = 'hidden'; s.whiteSpace = 'nowrap'; s.verticalAlign = 'top'; out.cut = a.textContent.trim(); }
  const tw = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT);
  for (let n = tw.nextNode(); n; n = tw.nextNode()) { if (/\bemail\b/i.test(n.nodeValue)) { n.nodeValue = n.nodeValue.replace(/\bemail\b/i, 'emial'); out.typo = 'emial'; break; } }
  if (!out.typo) for (let n = (tw.currentNode = document.querySelector('main'), tw.nextNode()); n; n = tw.nextNode()) { const m = n.nodeValue.match(/\b[a-z]{6,}\b/); if (m) { n.nodeValue = n.nodeValue.replace(m[0], m[0].slice(0, 2) + m[0][3] + m[0][2] + m[0].slice(4)); out.typo = m[0].slice(0, 2) + m[0][3] + m[0][2] + m[0].slice(4); break; } }
  const c = document.createElement('div'); c.textContent = 'Contrast control text'; c.style.background = '#ffffff'; c.style.color = '#767676'; c.style.padding = '8px'; c.style.fontSize = '16px'; document.querySelector('main').prepend(c); out.contrast = '#767676 on #ffffff = 4.54';
  return out;
};

async function readCell(browser, base, cell, { pictures = true, plant = false, timing = null } = {}) {
  const t = {}; let t0 = now();
  const s = cell.s, z = cell.zoom;
  const ctx = await browser.newContext({
    viewport: { width: Math.round(s.w / z), height: Math.round(s.h / z) }, deviceScaleFactor: s.dpr * z,
    isMobile: s.touch, hasTouch: s.touch, reducedMotion: 'reduce', contrast: cell.theme === 'more' ? 'more' : 'no-preference',
    extraHTTPHeaders: cell.r.stub ? { 'x-inspect-stub': '1' } : {},
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  t.open = now() - t0; t0 = now();
  await page.goto(base + cell.r.path, { waitUntil: 'load', timeout: 60000 });
  t.reach = now() - t0; t0 = now();
  const rounds = await settle(page);
  t.settle = now() - t0; t0 = now();
  let planted = null;
  if (plant) { planted = await page.evaluate(PLANT); await page.waitForTimeout(100); }
  const data = await page.evaluate(readPage, { touch: s.touch });
  t.read = now() - t0; t0 = now();
  const picDpr = Math.min(s.dpr * z, 3);
  if (picDpr !== s.dpr * z) { /* pictures capped at 3x; readings are CSS px and unaffected */ }
  const tl = await tiles(page, cell, data.docH, s.dpr * z, pictures ? join(OUT, 'pictures') : null);
  t.pictures = now() - t0; t0 = now();
  // Contrast from pixels for every text piece; the CSS answer beside it as the control.
  const pairs = [];
  for (const tx of data.texts) {
    const fg = tx.color.slice(0, 3);
    const r0 = tx.rects[0];
    const smp = sampleBg(tl, r0, fg, s.dpr * z);
    if (!smp) continue;
    const a = tx.color[3] * tx.op;
    const fgOn = (bg) => fg.map((v, i) => Math.round(v * a + bg[i] * (1 - a)));
    const large = tx.fs >= 24 || (tx.fs >= 18.66 && tx.fw >= 700);
    pairs.push({ text: tx.text.slice(0, 50), path: tx.path, fs: tx.fs, fw: tx.fw, large, fg: tx.color, bgPx: smp.med, ratioPx: ratio(fgOn(smp.med), smp.med), ratioWorst: ratio(fgOn(smp.worst), smp.worst), bgCss: tx.cssBg, ratioCss: tx.cssBg ? ratio(fgOn(tx.cssBg), tx.cssBg) : null, rect: r0 });
  }
  // A mark is often drawn by a pseudo-element or a stroke, which no computed
  // colour names; read it from the pixels: the one farthest from the ground
  // around it, against that ground.
  const marks = data.marks.map((m) => {
    const ring = sampleBg(tl, { x: m.rect.x - 6, y: m.rect.y - 6, w: m.rect.w + 12, h: m.rect.h + 12 }, [255, 255, 255], s.dpr * z);
    if (!ring) return { ...m, ratio: null };
    const ink = sampleBg(tl, m.rect, ring.med, s.dpr * z);
    const mark = ink ? ink.worst && ink.med : null;
    return { ...m, bg: ring.med, mark, ratio: mark ? ratio(mark, ring.med) : null };
  });
  t.contrast = now() - t0; t0 = now();
  // State: every gallery and rail moved to its last picture.
  let galleryEnd = null;
  if (cell.zoom === 1 && cell.theme === 'normal') {
    const n = await page.evaluate(() => { const ts = [...document.querySelectorAll('[class*="track"]')].filter((e) => e.scrollWidth > e.clientWidth + 2); ts.forEach((e) => { e.style.scrollBehavior = 'auto'; e.scrollLeft = e.scrollWidth; }); return ts.length; });
    if (n) {
      await page.waitForTimeout(700);
      const d2 = await page.evaluate(readPage, { touch: s.touch });
      galleryEnd = { tracks: n, fit: d2.texts.filter((x) => x.fit.length).map((x) => ({ text: x.text, fit: x.fit, path: x.path })), overlaps: d2.overlaps, counters: d2.texts.filter((x) => /\d+\s*(of|\/|–)\s*\d+/.test(x.text)).map((x) => x.text) };
      if (pictures) {
        const tops = await page.evaluate(() => [...document.querySelectorAll('[class*="track"]')].filter((e) => e.scrollWidth > e.clientWidth + 2).map((e) => (e.closest('section') || e).getBoundingClientRect().top + scrollY - 80));
        for (const [i, y] of tops.entries()) { await page.evaluate((t) => scrollTo(0, t), y); await page.waitForTimeout(60); await page.screenshot({ path: join(OUT, 'pictures', `${cell.id}-gallery-end-${i}.jpg`), quality: 70, type: 'jpeg' }); }
      }
    }
  }
  t.state = now() - t0;
  await ctx.close();
  const rec = { id: cell.id, route: cell.r.path, size: s.name, zoom: z, theme: cell.theme, settleRounds: rounds, errors, planted, ...data, pairs, marks, galleryEnd, ms: Object.fromEntries(Object.entries(t).map(([k, v]) => [k, Math.round(v)])) };
  delete rec.texts; rec.textsFit = data.texts.filter((x) => x.fit.length).map((x) => ({ text: x.text, path: x.path, fit: x.fit, rect: x.rects[0] }));
  rec.textCount = data.texts.length;
  if (timing) timing.push(rec.ms);
  return rec;
}

// ---------------------------------------------------------------------------
function spell(words) {
  const uniq = [...new Set(words)].filter((w) => /^[\p{L}’'-]{2,}$/u.test(w));
  const js = `ObjC.import("AppKit"); var sc=$.NSSpellChecker.sharedSpellChecker; var ws=${JSON.stringify(uniq)}; var bad=[]; ws.forEach(function(w){ var r=sc.checkSpellingOfStringStartingAtLanguageWrapInSpellDocumentWithTagWordCount(w,0,"en_US",false,0,null); if(r.length>0 && r.location<w.length) bad.push(w); }); JSON.stringify(bad)`;
  return JSON.parse(execFileSync('osascript', ['-l', 'JavaScript', '-e', js]).toString());
}
const wordsOf = (s) => s.replace(/[“”"()\[\]{}.,:;!?…—–/·•|<>+=*#&@%$^~`]/g, ' ').split(/\s+/).map((w) => w.replace(/^['’-]+|['’-]+$/g, '')).filter(Boolean);

async function main() {
  const { server, base } = await serveDist();
  const all = cells();
  if (MODE === 'words') {
    // Every string in the build, hidden ones included: text, alt, labels, titles, descriptions.
    const files = [];
    const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (p.endsWith('.html')) files.push(p); } };
    walk(DIST);
    const strings = [];
    for (const f of files) {
      const h = readFileSync(f, 'utf8').replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ');
      for (const m of h.matchAll(/(?:alt|aria-label|title|content|placeholder)="([^"]+)"/g)) if (!/^(https?:|\/|#|width=|[\d.]+$|summary|website|en_|index)/.test(m[1])) strings.push([f, m[1]]);
      const body = h.replace(/<[^>]+>/g, '\n').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      for (const line of body.split('\n')) if (line.trim()) strings.push([f, line.trim()]);
    }
    const bad = spell(strings.flatMap(([, s]) => wordsOf(s)));
    const where = bad.map((w) => ({ word: w, files: [...new Set(strings.filter(([, s]) => wordsOf(s).includes(w)).map(([f]) => f))], sample: strings.find(([, s]) => wordsOf(s).includes(w))?.[1].slice(0, 120) }));
    const odd = strings.filter(([, s]) => /�|undefined|NaN|\bnull\b|\{\{|\}\}|  |\\n|&[a-z]+;/.test(s)).map(([f, s]) => ({ f, s: s.slice(0, 120) }));
    const apos = { straight: strings.filter(([, s]) => /\w'\w/.test(s)).length, curly: strings.filter(([, s]) => /\w’\w/.test(s)).length };
    writeFileSync(join(OUT, 'words.json'), JSON.stringify({ strings: strings.length, files: files.length, bad: where, odd, apos, all: [...new Set(strings.map(([, s]) => s))] }, null, 1));
    console.log(`words: ${strings.length} strings in ${files.length} files, ${bad.length} unknown to the checker, ${odd.length} odd, apostrophes ${JSON.stringify(apos)}`);
    server.close(); return;
  }
  let browser = await launch();
  const renderer = await (async () => { const c = await browser.newContext(); const p = await c.newPage(); const r = await p.evaluate(() => { const g = document.createElement('canvas').getContext('webgl'); const e = g && g.getExtension('WEBGL_debug_renderer_info'); return e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : 'no webgl'; }); await c.close(); return r; })();
  console.log('renderer:', renderer);

  if (MODE === 'time' || MODE === 'calibrate') {
    const pick = args.only ? all.filter((c) => c.id === args.only) : [all.find((c) => c.id === 'magic-notes@393@z1@normal')];
    for (const cell of pick) {
      const timing = [];
      const rec = await readCell(browser, base, cell, { pictures: true, plant: MODE === 'calibrate', timing });
      if (args.fresh) { await browser.close(); browser = await launch(); }
      const tag = MODE === 'calibrate' ? '-planted' : args.fresh ? '-fresh' : '';
      writeFileSync(join(OUT, `${MODE}-${cell.id}${tag}.json`), JSON.stringify(rec, null, 1));
      if (MODE === 'calibrate') {
        const typoSeen = rec.visibleText.some((s) => s.includes(rec.planted.typo));
        const sp = typoSeen ? spell(rec.visibleText.flatMap(wordsOf)) : [];
        const ctl = rec.pairs.find((p) => p.text.startsWith('Contrast control'));
        console.log(JSON.stringify({ planted: rec.planted, overlapCaught: rec.overlaps.filter((o) => o.kind === 'text-text' && (o.a + o.b).replace(/\s/g, " ").includes(rec.planted.overlap.replace(/\s/g, " ").slice(0, 20))).length, cutCaught: rec.textsFit.filter((x) => x.text.startsWith(rec.planted.cut.slice(0, 6)) && x.fit.some((f) => f.kind === 'clipped')).length, typoCaught: sp.includes(rec.planted.typo), spellOther: sp, contrastControl: ctl && { px: ctl.ratioPx, css: ctl.ratioCss } }));
      } else console.log(cell.id, JSON.stringify(rec.ms), 'texts', rec.textCount, 'pairs', rec.pairs.length);
    }
    await browser.close(); server.close(); return;
  }

  if (MODE === 'sweep') {
    const [li, ln] = (args.lane ?? '1/1').split('/').map(Number);
    // Spread by cost: tall routes at dense sizes first, dealt round-robin.
    const cost = (c) => (c.r.path.startsWith('/apps/') && !c.r.stub ? 3 : c.r.path === '/' ? 3 : 1) * c.s.dpr * c.zoom * (c.s.w < 800 ? 2 : 1);
    const mine = (args.only ? all.filter((c) => c.id === args.only) : all).sort((a, b) => cost(b) - cost(a) || a.id.localeCompare(b.id)).filter((_, i) => i % ln === li - 1);
    const done = new Set(readdirSync(join(OUT, 'readings')).map((f) => f.replace(/\.json$/, '')));
    let n = 0;
    for (const cell of mine) {
      n++;
      if (done.has(cell.id)) continue;
      let rec = null;
      for (let attempt = 1; attempt <= 2 && !rec; attempt++) {
        try { rec = await readCell(browser, base, cell); }
        catch (e) { console.log(`lane ${li} ${cell.id} FAULT attempt ${attempt}: ${String(e).split('\n')[0]}`); appendFileSync(join(OUT, 'faults.log'), `${cell.id} ${attempt} ${String(e).split('\n')[0]}\n`); try { await browser.close(); } catch {} browser = await launch(); }
      }
      if (!rec) { console.log(`lane ${li} STOP at ${cell.id}`); process.exitCode = 2; break; }
      writeFileSync(join(OUT, 'readings', `${cell.id}.json`), JSON.stringify(rec));
      console.log(`lane ${li} ${n}/${mine.length} ${cell.id} ${rec.ms.reach + rec.ms.settle + rec.ms.read + rec.ms.pictures + rec.ms.contrast + rec.ms.state}ms texts=${rec.textCount} fit=${rec.textsFit.length} overlaps=${rec.overlaps.length} errors=${rec.errors.length}`);
    }
    writeFileSync(join(OUT, `lane-${li}.done`), String(Date.now()));
    await browser.close(); server.close();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
