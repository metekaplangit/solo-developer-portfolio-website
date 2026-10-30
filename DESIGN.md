---
name: MetKap Studio
description: Spectrum — a near-black stage, neutral studio chrome, and colour supplied by the product rather than by the site.
colors:
  bg: "#08090c"
  bg-2: "#0f1015"
  surface: "#16181d"
  surface-2: "#1e2027"
  surface-hover: "#262931"
  text: "#f2f3f6"
  text-strong: "#ffffff"
  muted: "#a2a7b3"
  faint: "#8b909c"
  accent: "#ffffff"
  accent-hover: "#ffffff"
  accent-contrast: "#08090c"
  accent-soft: "#ffffff1a"
  hue: "#ff9245"
  hue-contrast: "#1c0d02"
  border: "#ffffff17"
  border-strong: "#ffffff2e"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 4.75rem)"
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.036em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.024em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "normal"
rounded:
  sm: "10px"
  md: "18px"
  lg: "24px"
  pill: "999px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.25rem"
  "6": "1.5rem"
  "8": "2rem"
  "10": "2.5rem"
  "12": "3rem"
  "16": "4rem"
  "20": "5rem"
  "24": "6rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-contrast}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1.35rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.accent-contrast}"
  button-secondary:
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1.35rem"
    height: "3rem"
  button-secondary-hover:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text-strong}"
  button-download:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-contrast}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1.6rem"
    height: "3rem"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
  badge:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.6rem"
  badge-accent:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-hover}"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.6rem"
---

# Design System: MetKap Studio

## 1. Overview

**Creative North Star: "Spectrum"**

The site is a dark stage, and the software is what is lit on it. The studio's own
chrome — header, footer, buttons, focus rings — is deliberately colourless; the
only colour on any page belongs to a product and is confined to that product's
band. One app, one voice, one band. A catalogue of five apps therefore reads as
five distinct things rather than as five rows of the same template, and the site
never competes with the thing it is selling.

One deliberate exception (owner, 2026-10-29): "craft." at the end of the home
headline is always orange `#ff9245` (`--craft`), the same as on the studio's
social covers. It is a signature on one word, not an accent — nothing else in the
chrome takes it.

That is the change from the previous system, which lit the whole site with a
single periwinkle accent. The accent was restrained and correct, and it was also
the most common indie-dark treatment on the web — the audience reads it as a
template before it reads anything else. Colour that comes from the product cannot
be mistaken for a theme someone downloaded.

The stage is near-black rather than graphite: full-bleed poster bands need a
ground dark enough to disappear behind an image. It stops short of the point
where white text starts to halate.

It still explicitly rejects the **generic SaaS landing page** — gradient hero, one
giant metric, endless identical feature cards, a "trusted by" logo wall. That
template is the thing this audience scrolls past, and restraint about *claims*
is not the same as restraint about *presence*: the site may be bold, it may
never be loud about things it cannot prove.

**Key Characteristics:**
- Near-black stage, achromatic chrome, one hue per product band
- System typeface only; no webfont is ever downloaded
- One separation cue at a time — a hairline *or* a lift, never both
- Full-bleed bands, poster-scale display type, image-forward product moments
- Motion that settles rather than bounces, always reduced-motion safe

## 2. Colors: The Stage and the Product Voice

An achromatic stage carrying no colour of its own, plus one hue per product,
authored in that product's content file (`hue`, resolved by `productHue()` in
`src/lib/products.ts`).

### Studio chrome — achromatic
- **Full White** (`#ffffff`): the chrome signal. Focus rings, the current nav
  pill, the neutral action fill, headings. This is `--accent`; the token name is
  kept so every component keeps working, but it no longer carries a hue.
- **Chrome Wash** (`#ffffff1a`): the active nav pill and other 10% tints.
- **Near-White** (`#f2f3f6`): body text. Not `#ffffff`, so long prose does not
  vibrate against a near-black ground.
- **Muted Slate** (`#a2a7b3`): supporting prose, summaries, descriptions.
- **Faint Slate** (`#8b909c`): the quietest tier — metadata, trust lines,
  timestamps. Measured **6.23:1** on the ground.

### Stage
- **Stage** (`#08090c`): the page ground.
- **Band** (`#0f1015`): the ground a product band sits on before its hue wash.
- **Surface** (`#16181d`) / **Lifted** (`#1e2027`) / **Hover** (`#262931`): cards,
  panels, chips. Stage to hover climbs in even OKLCH lightness steps — 0.140,
  0.174, 0.209, 0.245, 0.280 — on one blue-grey hue (268°).

### Product voice
- **`--hue`**: the product's own colour, re-declared per band. Sole Focus is
  `#ff9245`, taken from its own icon. Measured **8.96:1** on the stage.
- **`--hue-contrast`**: label colour on a hue-filled button, derived from the
  product's own hue taken down to near-black — `oklch(from var(--hue) 0.22
  calc(c * 0.6) h)`. Sole Focus `#390400` (7.93:1), Waypost Words `#1e152c`
  (9.25:1), Magic Notes `#171b1f` (8.91:1). Browsers without relative colour
  keep the fixed `#1c0d02`.
- **`--hue-soft` / `--hue-wash`**: `color-mix(in oklab, …)` tints for band
  washes. Never used for text.

### Named Rules

**The One Voice Per Band Rule.** *(Replaces the One Voice Rule, 2026-07-31.)*
The site itself has no colour. Every hue on a page belongs to a product and is
confined to that product's band, where `--hue` has been re-declared from that
product's own field. Referencing `--hue` outside a band a product owns is the
bug this rule exists to name.

**The Page-Top Rule.** *(Added 2026-08-01, STEP-0060.)* Every page begins the
same distance below the header: `--page-top`, and nothing else. Before it there
were four different answers across seven pages (170 / 96 / 49 / 32px), so
arriving anywhere felt like arriving somewhere else. `--band-y-lg` still exists
and is unchanged, for bands further down that open a new movement — it is no
longer the page-top value.

**The Identity Lockup Rule.** *(Added 2026-08-01, STEP-0061.)* Wherever a
product's icon appears beside its name, it is one unit on one line: icon left,
name and its supporting text right (`.identity`). Never the icon on its own row
with the name below it. This replaces the stacked heads of 2026-07-31, which
existed so a product `h1` would start on the shared rail; it no longer does, and
that was a deliberate trade made on the owner's instruction.

**The Near-Black Floor Rule.** *(Replaces the Never-Black Rule, 2026-07-31.)*
The ground is `#08090c` and nothing on the site goes below linear value ~5,
which is where white-on-black halation and OLED black crush begin — the real
reason the old rule existed. The floor moved down, not away: dark enough for a
full-bleed band to read as a poster, light enough to stay a material rather than
a hole.

**The Contrast Floor Rule.** *(Unchanged in intent, recomputed.)* `#8b909c` on
`#08090c` is the lightest text permitted anywhere. Prohibited: lighter greys
"for elegance". This floor exists because it was previously breached (`#71757e`
at 3.9:1) and had to be repaired. Every pair in this section was recomputed when
the palette changed; the lowest is 5.33:1 — `--faint` on the lit top of a fit
cell (measured 2026-10-28, after the even ramp and the One Light Rule).

## 3. Typography

**Display / Body Font:** the native system stack — `-apple-system`,
`BlinkMacSystemFont`, `SF Pro Display` / `SF Pro Text`, falling back through
`system-ui`.
**Mono Font:** `ui-monospace`, `SF Mono`, `Menlo` — reserved for code only, never
as decoration.

**Character:** One family, carried entirely by weight and size contrast. On a Mac
site for Mac software, the operating system's own typeface is not a fallback —
it is the correct choice: it renders natively, costs nothing to load, and makes
the page feel like part of the platform rather than a visitor to it. A downloaded
display face would be the first thing that felt bolted on.

### Hierarchy
- **Display** (700, `clamp(2.75rem, 7vw, 4.75rem)`, 0.96, `-0.04em`): The studio
  name on the home hero. One per page, maximum.
- **Headline** (600, `2rem`, 1.12): Page and section titles.
- **Title** (600, `1.5rem`, 1.12): Card names, panel headings, sub-sections.
- **Body** (400, `1.0625rem`, 1.6): All prose. The 17px base matches Apple's own
  body size. Measure is capped at the reading column (`43rem`, ~82ch).
- **Label** (600, `0.8125rem`, 1.35): Badges, chips, buttons, metadata. Uppercase
  labels track at `--track-caps` (`0.08em`).

**The Type Role Rule.** *(Added 2026-10-28, style-project 0001.)* Weight, leading
and tracking come from tokens in `global.css`, never typed per component: three
weights (`--weight-text` 400, `--weight-strong` 600, `--weight-display` 700), one
leading per role (`--leading-display` 0.96, `--leading-heading` 1.12,
`--leading-ui` 1.35, `--leading-body` 1.6; buttons 1.2), and tracking from size —
`--track-optical` is 0 at body size and tightens to `-0.04em` from 40px.

### Named Rules

**The No-Webfont Rule.** No font file is ever downloaded. The system stack is the
typeface. This is a performance *and* an honesty decision: a privacy-first site
that phones out to a font CDN would contradict itself.

**The Balanced-Heading Rule.** `text-wrap: balance` on h1–h3, `text-wrap: pretty`
on prose. Headings never leave one orphan word alone on a line.

**The Wrapping Rule.** *(Added 2026-08-01, STEP-0062.)* No line of body text
ends on a word that points forward — an article, a conjunction, a preposition,
an auxiliary. The short word is bound to the word after it with a non-breaking
space, by `tie()` in `src/lib/typography.ts`, which reaches Markdown through a
Sätteri hast plugin and content prose through one `.transform()` in the schema.

CSS does not solve this and was already tried: `text-wrap: pretty` was in place
site-wide while 22 paragraphs across the eight routes still broke this way,
because `pretty` only rescues a paragraph's LAST line. Never "fix" a stray
break by adding a CSS property — measure first, then tie the words.

Headings are excluded on purpose: they get `balance`, and a heading that is one
bound unit cannot balance.

## 4. Elevation

The system is **near-flat and tonally layered**. Depth comes primarily from
stepping the surface lighter (`bg` → `surface` → `surface-2`), not from stacking
shadows. Shadows exist, but they are ambient — they lift a panel off the ground a
few millimetres; they never simulate a dramatic drop.

### Shadow Vocabulary
The values live in `src/styles/global.css`; these are the roles.
- **`--shadow-sm`**: Barely-there seat for the
  product header block.
- **`--shadow-md`**: The default lift for
  cards, panels, and the screenshot frame.
- **`--shadow-lg`**: Reserved for elements
  that float *over* content — the featured spotlight. The gallery arrows carry
  none since 2026-10-28: their glass and strong hairline separate them.

**The One Light Rule.** *(Added 2026-10-28, style-project 0001.)* Light falls
from above, so every lifted surface is brighter at its top: `--surface-fill`
runs from `surface-2` at the top to `surface` at the bottom, and its top edge
catches the light (`--edge-light`, a 1px inset at 10% white). Surfaces lift in
three heights, each the edge plus a shadow — `--lift-1` (card, tile, fit cell,
resting on the stage), `--lift-2` (a panel leading its band), `--lift-3`
(answering the pointer, edge at 14%). The edge is the tone catching the light,
not a hairline, so a lift is still one cue. Image frames keep their own ring
and shadow: they hold pictures, not surfaces.

### Named Rules

**The Full-Row Rule.** *(Added 2026-08-01, STEP-0063.)* A grid that IS the
composition never ends on a short row. `repeat(auto-fit, …)` cannot promise
this — it picks a column count from the available width and never sees how many
items follow — so `.grid-even` takes its count from the items instead, via
`evenColumns()` in `src/lib/grid.ts`: the widest column count that divides them
evenly. `.card-grid` keeps `auto-fit` and stays correct where the cards are a
list that happens to wrap rather than a shape the reader is meant to see.

**The Single-Cue Rule.** A surface is separated from its background by *one*
device: an elevated tone with a soft shadow, **or** a hairline border — never
both. Stacking a border onto a shadowed card is the fastest way to make this
system look cheap.

**The Hairline Rule.** Borders are `rgba(255,255,255,0.09)` — a hairline, not a
line. If a border is visible as a distinct grey stroke, it is too strong.

**The Increased Contrast Rule.** *(Added 2026-10-28, style-project 0001.)* When a
visitor's Mac or iPhone asks for more contrast (`prefers-contrast: more`), every
quiet value has a stronger version, set once at the end of `global.css`: text
`#fff`, muted `#d0d3da`, faint `#babec8`, hairlines 32% and 56%, accent-soft
20%. Lifted surfaces swap their lift for a 1px ring — the shadow becomes the
border, so a surface still takes one cue under the Single-Cue Rule. The header,
glass chips and gallery arrows go solid, with no blur. Link underlines go to full
strength. Without the setting, nothing changes. `@increased-contrast` holds it.

## 5. Components

### Buttons
- **Shape:** Fully rounded pill (`999px`).
- **Heights:** three, and no others — `.btn-sm` `2.25rem` (chrome), `.btn`
  `2.75rem` (page actions), `.btn-lg` `3.25rem` (the one hero action on a poster
  band).
- **Primary (`.btn-primary`):** white fill, stage-coloured text. This is the
  *neutral* action and is legal anywhere.
- **Product (`.btn-hue`):** `--hue` fill, `--hue-contrast` text. Legal **only**
  inside a band that product owns.
- **Secondary:** transparent with a `border-strong` hairline and body-coloured
  text; fills to Lifted on hover.
- **Download:** primary or product tone (`tone` prop) plus the studio's download mark (never
  Apple's logo — Apple's marketing guidelines rule the standalone logo out), at
  `.btn-lg` in a hero and `.btn-sm` in a card.
- **Hover / Focus:** lifts `-1px` with a glow matching its own fill. Focus is
  always a visible 2px white ring, never removed.

**The One Height Per Set Rule.** *(Replaces the One Height Rule, 2026-07-31.)*
Every button within one group is the same height, and the site has exactly three
heights. Emphasis comes from fill, width, and the mark — never from a taller box
inside a set. A one-off height on a single button is the failure this names.

### Cards / Panels
- **Corner Style:** `24px` (`--radius-lg`) for panels and for tiles that hold an
  icon, so the outer corner nests round the icon's; `18px` (`--radius`) for
  cards and smaller blocks; `10px` (`--radius-sm`) for small controls; pills
  for chips.
- **Icon Corner:** an app icon never takes a `--radius-*` step. It takes
  `--radius-icon` (`22.37%` of its own size), the proportion Apple's icon masks
  use, so one icon is the same shape at 28, 48 and 56px. The brand mark too.
- **Background:** `--surface-fill`, a subtle vertical gradient from `surface-2`
  at the top to `surface`, lit from above like its shadow (the One Light Rule).
- **Shadow Strategy:** `--lift-2` for panels, `--lift-1` for cards and tiles,
  `--lift-3` on hover, per the Single-Cue Rule (no border).
- **Internal Padding:** `1.5rem`, scaling up with `clamp()` on large panels.

### Badges / Chips
- **Style:** Pill, Lifted Graphite fill, label typography, `0.25rem 0.6rem`.
- **Accent variant:** Signal Wash background with Periwinkle Raised text — used
  for the product-type badge only.

### Navigation
- **Style:** Sticky, translucent (`72%` of the ground) with a `16px` backdrop
  blur, over a hairline bottom border.
- **States:** Muted by default; the current page is a Signal Wash pill with white
  text. On narrow screens the links become a single horizontally scrollable row
  with a right-edge fade — never a wrapped multi-row block.

### Screenshot Gallery (signature component)
- One large frame at a time (`72rem` max, `2880/1800` ratio), CSS scroll-snap so
  swipe and trackpad work with no JavaScript; arrows, dots, a live counter, and
  keyboard control are layered on as progressive enhancement.
- Controls are glass circles over the image: 48px arrows in the `.chip-glass`
  recipe with the strong hairline and a 20-unit chevron. The dot marks are `7px`,
  the current one a `22 × 7px` pill in the product hue, in `28px` hit areas
  (`44px` on touch).
- A native `<details>` transcript below lists every screenshot as text.

### Facts Line (signature component)
- A single quiet middot-separated row of decision facts beneath the download
  button (price, requirement, privacy stance). It breaks **only between facts**,
  never mid-phrase.

## 6. Do's and Don'ts

### Do:
- **Do** keep every hue inside the band of the product that owns it; the studio's
  own chrome stays achromatic.
- **Do** give every button in a group the same height, from the set of three, and
  let fill and width carry emphasis.
- **Do** separate a surface with a tone-and-shadow lift **or** a hairline —
  exactly one.
- **Do** keep body text at `--text` and never let any text go fainter than
  `--faint` on the ground (the Contrast Floor Rule).
- **Do** let real product screenshots carry the product sections; they are the
  strongest asset the site has.
- **Do** state price, system requirement, and privacy stance as literal,
  checkable facts near the download.

### Don't:
- **Don't** build anything resembling a **generic SaaS landing page** — no
  gradient hero, no one giant metric, no endless identical feature cards, no
  "trusted by" logo wall. This is the studio's named anti-reference.
- **Don't** fabricate proof. No invented reviews, ratings, testimonials, or logos,
  ever. There is currently **no** social proof; absence is stated honestly rather
  than implied.
- **Don't** download a webfont. The system stack is the typeface.
- **Don't** take any surface below linear value ~5 (the Near-Black Floor), or use
  a colored `border-left` greater than 1px as a stripe, or gradient text
  (`background-clip: text`).
- **Don't** give the studio itself a colour, or reference `--hue` outside a band
  a product owns.
- **Don't** stack a border on top of a shadowed card.
- **Don't** add decorative glassmorphism; blur is reserved for the sticky header
  and gallery controls where content genuinely passes beneath.
- **Don't** let a line of prose end on "a", "and", "the", "of", "has" — see the
  Wrapping Rule. And don't reach for a CSS property to fix it; the property is
  already there.
- **Don't** leave a hole in the last row of a composed grid — see the Full-Row
  Rule.
- **Don't** put a back link, or any other repeated navigational link, anywhere
  but the one place its category lives on every page — see `.page-back`.
- **Don't** put a tiny uppercase tracked eyebrow above every section — a single
  deliberate kicker is voice, one per section is scaffolding.
- **Don't** ship motion without a `prefers-reduced-motion` alternative, and never
  gate content visibility on a scroll-triggered class.
