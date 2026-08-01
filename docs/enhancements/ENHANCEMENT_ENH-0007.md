# ENH-0007 — Logic and algorithm review against the field

> **Purpose:** Hold this project's own computation against the best known approach
> for each job, with sources. Findings only — no code was changed while comparing.
> **Run:** 2026-08-01, whole project, no area named.
> **Impact bar:** a finding earns a place only if the owner would feel it, pay for
> it, lose data to it, or be stopped by it. Everything below that bar is one line.

## Scope and method

Static Astro 7 site, `output: 'static'`, no runtime. Logic here means the ideas
the code carries out — the animation update rule, the carousel state derivation,
the image ladder, the Markdown section parser, the ordering rules. Structure,
naming, tests and hygiene are out of scope by design (that is `evaluate-project`).

Five clusters were found and researched in ranked order.

---

## Finding 1 — The two reveal hotfixes were fixes for the measuring instrument

**Score: 45/100.** Behind — the approach is standard, the diagnosis that reshaped
it was not.

### What the project does today

`src/styles/global.css:743-816`. Scroll-reveal built on a native view progress
timeline, guarded by `@media (prefers-reduced-motion: no-preference)` and
`@supports (animation-timeline: view())`. Since 2026-08-01 it carries two
defensive decisions taken within four minutes of each other:

- `ea63f49` (v0.44.8) deleted `opacity` from the keyframes entirely.
- `9cc6f90` (v0.44.9) changed `animation-fill-mode` from `both` to `none`.

Both cite the same evidence, quoted from `ea63f49`:

> "on the live site five elements on the home page sat at opacity 0 with the
> timeline's progress stuck at 0 at every scroll position — top, scrolled to the
> element, and at the bottom of the document."

### What the field says

A view progress timeline is **inactive when the scroll axis has no scrollbar**.
MDN, `animation-timeline: view()`:

> "If the chosen axis does not contain a scrollbar, then the animation timeline
> will be inactive (zero progress)."

The CSS Scroll-Driven Animations draft states the same rule for the subject and
its nearest ancestor scroll container. An inactive timeline sits at progress 0 —
so with `animation-fill-mode: both` the element holds the `from` keyframe
permanently. That is exactly the symptom the commit describes, and it is what an
inactive timeline is *supposed* to do.

Every source found recommends `animation-fill-mode: both` for view timelines,
because without it the element snaps to its un-animated state outside the range.
None of them treats `none` as the remedy for a stuck timeline.

### The evidence that the timeline was inactive in the probe, not in a browser

Probed the live site today with the same class of tool (headless pane, same
origin). Result:

| Reading | Value |
| --- | --- |
| `innerHeight` | **0** |
| `document.scrollHeight` | 9344 |
| `CSS.supports('animation-timeline','view()')` | true |
| `.reveal` count with a `ViewTimeline` attached | 5 |
| `timeline.currentTime` on all five | **null** (unresolved) |
| `scrollTo(0, n)` for six different `n` | `scrollY` stayed **0** every time |

A viewport of height 0 has no block-axis scrollbar, so by the rule above every
`ViewTimeline` on the page is inactive and reports progress 0 — and `scrollTo`
does nothing, which makes "at every scroll position" a reading taken once and
reported three times. Five elements is also exactly the count in the commit.

This does not prove nobody ever saw a blank area. It does show that the stated
evidence reproduces today as an artefact of the probe, in a pane where the page
cannot scroll at all.

### What it cost

- The opacity fade is gone from the reveal. That was a design decision, reversed
  by a measurement.
- `fill-mode: none` has an unexamined consequence. Outside its range the
  animation contributes nothing, so the element renders at `translateY(0)` — its
  final position. At `entry 5%` the animation becomes active at progress 0 and
  the element **jumps down 22px**, then rises. The reveal is now a drop-then-rise
  rather than a rise. This follows from the fill-mode rule alone; it needs no
  browser to establish.

### The upgrade

Restore `animation-fill-mode: both`. It is safe now for the reason v0.44.8
created and then did not use: with no `opacity` in the keyframes, holding the
`from` state can only ever offset an element by 22px, never hide it. Then
re-introduce the fade deliberately if it is still wanted, and re-measure in a
viewport that actually has a height before trusting any future reading.

### Sources

- [MDN — `animation-timeline: view()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline/view) — official; the inactive-timeline rule quoted above. Read in full.
- [CSS Scroll-Driven Animations Module Level 1 (CSSWG draft)](https://drafts.csswg.org/scroll-animations-1/) — spec; inactive when the nearest ancestor scroll container has no scrollable overflow.
- [MDN — `animation-timeline`](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline) — official; unsupported browsers ignore the property, so the fallback is the un-animated element.
- [Codrops — A Practical Introduction to Scroll-Driven Animations](https://tympanus.net/codrops/2024/01/17/a-practical-introduction-to-scroll-driven-animations-with-css-scroll-and-view/) — write-up; `@supports` as the progressive-enhancement guard.
- [Ryan Mulligan — Starting Exploration of Scroll-driven Animations](https://ryanmulligan.dev/blog/scroll-driven-animations/) — practitioner write-up; recommends `fill-mode: both` for view timelines.
- [CSS-Tricks — `view()` almanac entry](https://css-tricks.com/almanac/functions/v/view/) — reference; range phases and what a zero-progress timeline means.
- [WebKit — A guide to scroll-driven animations with just CSS](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/) — official; read, and notably **silent** on fill-mode, so it settles nothing here. Recorded because it was checked.

**Where sources and judgement disagreed:** every source says use `fill: both`;
this project's own live measurement said `both` hides content. I followed the
sources, because the measurement reproduces as a zero-height-viewport artefact
and the sources describe the spec.

---

## Finding 2 — The gallery derives its own state from an observer the platform now supersedes

**Score: 62/100.** Works, and a better-established approach exists.

### What the project does today

`src/components/ScreenshotShowcase.astro:341-412`. A CSS scroll-snap track with a
progressive-enhancement script on top: arrows, dots, keyboard, and a counter. The
active slide is derived with an `IntersectionObserver` at `threshold: 0.6`,
rooted on the track.

### What the field does

Two platform features now cover this directly:

- **Scroll snap events.** `scrollsnapchanging` and `scrollsnapchange` fire when
  the snap target changes, giving the active slide exactly rather than inferring
  it from an overlap ratio. Chrome 129+.
- **CSS carousels.** `::scroll-button()` and `::scroll-marker` /
  `::scroll-marker-group` generate the arrows and the dot rail as browser-owned,
  focusable, stateful controls with no script at all. Chrome 135+, Edge; Firefox
  and Safari in progress.

The second is a strong fit for this project specifically, because
`docs/ARCHITECTURE.md` guards that nothing runs in production — CSS carousels
would delete the one remaining script on the site.

### What it would buy, and what it costs

Buys: exact active-slide state instead of a 0.6 threshold that can leave the
counter stale mid-swipe, and a path to zero JavaScript on the whole site.

Costs: **`::scroll-marker` is explicitly not Baseline** — the sources say it is
not production-ready without a fallback. So the honest version of this is the
snap-events swap now (small, contained, degrades to the observer) and the CSS
carousel left as a watch item, not a rewrite.

### Sources

- [Chrome for Developers — Carousels with CSS](https://developer.chrome.com/blog/carousels-with-css) — official; what the pseudo-elements generate and how they behave.
- [CSS-Tricks — CSS Carousels](https://css-tricks.com/css-carousels/) — reference walkthrough of the same primitives.
- [SitePoint — Scroll-Driven CSS in 2026: Building Carousels Without JavaScript](https://www.sitepoint.com/scrolldriven-css-in-2026-building-carousels-without-javascript/) — write-up; states plainly this is not Baseline and needs a fallback.
- [modern.css — Build a CSS-only carousel](https://modern-css.com/articles/build-a-css-only-carousel/) — implementation walkthrough (read for approach only).
- [Jo Mändle — Native CSS carousels](https://www.jomaendle.com/blog/css-carousel) — practitioner account including the accessibility behaviour of generated markers.
- [Giorgiosaud — CSS Carousels 2026](https://www.giorgiosaud.io/notebook/css-carousels-2026) — corroborates the Chrome 135 support line.

*Research depth: adequate for the recommendation, thin on the snap-events half —
the carousel sources dominated the results.*

---

## Finding 3 — The four stagger rules are a hand-rolled `sibling-index()`

**Score: 70/100.** Sound, with a named replacement that is not yet safe here.

`src/styles/global.css:787-795` shifts `animation-range` in four hardcoded
`:nth-child(n of .reveal)` steps to stagger a group. The field's name for this is
now `sibling-index()`, which expresses the same thing as one calculation and does
not cap at four. Reported support in 2026 is Chrome/Edge with Firefox and Safari
varying, so it is a note rather than a change: the current rule is correct, and
the `of .reveal` selector — which the code arrived at by measurement — is the
right call regardless.

Sources: [LogRocket — Native CSS stagger animations with `sibling-index()`](https://blog.logrocket.com/native-css-stagger-sibling-index/), [CSS-Tricks — Spiral Scrollytelling in CSS With `sibling-index()`](https://css-tricks.com/spiral-scrollytelling-in-css-with-sibling-index/), [nerdy.dev — 4 CSS features every front-end developer should know in 2026](https://nerdy.dev/4-css-features-every-front-end-developer-should-know-in-2026).

---

## Finding 4 — Images ship WebP only, where the format ladder is the known win

**Score: 68/100.** Works; a standard approach would measurably beat it.

Every `<Image>` on the site pins `format="webp"`, `quality={78}`
(`ScreenshotShowcase.astro:41-52`, `index.astro:125-133`). Astro's `<Picture>`
with `formats={['avif','webp']}` emits a `<picture>` whose sources let the
browser take the smallest format it supports, with WebP as the fallback. The
reported saving is 20-30% over WebP at comparable quality, paid for in build
time.

Measured here: `dist/_astro` is 1.4 MB, the largest single screenshot variant is
90.6 KB, and the home LCP candidate is in the 40-65 KB band. So the realistic
saving on the LCP image is roughly 10-20 KB.

That is real but small on a static site already this light, and it is the one
finding here whose gain the owner may not feel. It is recorded, and it is ranked
below the two above deliberately.

Sources: [Astro Docs — Images](https://docs.astro.build/en/guides/images/) (official), [Astro Docs — Image and Assets API reference](https://docs.astro.build/en/reference/modules/astro-assets/) (official), [Astro issue #8866 — Picture component generates unused images](https://github.com/withastro/astro/issues/8866) (the cost side: build output growth), [PageSpeedFix — Astro image optimization](https://www.pagespeedfix.com/blog/astro-image-optimization/), [eastondev — Astro image optimization guide](https://eastondev.com/blog/en/posts/dev/20251203-astro-image-optimization-guide/).

---

## Already at the state of the art — leave these alone

- **`src/lib/format.ts`** — one module-scope `Intl.DateTimeFormat`, reused. That
  is the documented way to avoid re-constructing a formatter per call, and the
  guard on `NaN` dates is correct.
- **`src/lib/products.ts`** — a rank map plus `localeCompare` tie-break, and a
  non-mutating `[...products].sort()`. Correct and idiomatic at this size.
- **`src/lib/screenshots.ts`** — `import.meta.glob({ eager: true })` into a `Map`
  keyed by filename. Build-time only, O(1) lookup; this is what Astro documents.
- **`src/lib/url.ts`** — `joinBase` handles the doubling/dropping cases and
  passes external, `mailto:` and anchor hrefs through untouched.
- **The view-transition setup** (`global.css:818-853`) — cross-document
  `@view-transition` with named `site-header` / `site-footer` groups and a full
  reduced-motion opt-out. This is the current recommended shape and it costs no
  script.

## Below the bar — recorded, not proposed as work

- `src/lib/prose.ts` splits Markdown bodies on `\n## ` by hand. A fenced code
  block containing a `##` line would be read as a heading. The content is
  owner-authored prose with no code fences, so the failure cannot currently
  occur. *Research on this one was thin — no searches were spent on it.*
- `package.json` declares `"version": "0.0.0"` while the product ships tags up to
  `v0.44.9`. Intentional (tags are the source of truth), but it means no tool can
  read the version from the manifest.

## Overall

The logic is **broadly current**. This is a small static site and most of its
computation is correctly-chosen standard library work; the site's own animation
and image code sits on native platform features rather than libraries, which is
the right instinct. The single biggest win is Finding 1 — not a better
algorithm, but undoing two changes made on the strength of a probe that could not
scroll.
