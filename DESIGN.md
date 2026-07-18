---
name: MetKap Studio
description: Dark-premium, Apple-minimal studio site — a quiet instrument, not a storefront.
colors:
  bg: "#16171b"
  surface: "#1e2025"
  surface-2: "#24262c"
  surface-hover: "#282a31"
  text: "#f4f5f7"
  text-strong: "#ffffff"
  muted: "#9ea3ad"
  faint: "#8b909a"
  accent: "#7f8dff"
  accent-hover: "#9aa6ff"
  accent-contrast: "#0e0f13"
  accent-soft: "#7f8dff24"
  border: "#ffffff17"
  border-strong: "#ffffff26"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 4.75rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 650
    lineHeight: 1.1
    letterSpacing: "-0.022em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 650
    lineHeight: 1.1
    letterSpacing: "-0.022em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  sm: "8px"
  md: "14px"
  lg: "20px"
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

**Creative North Star: "The Quiet Instrument"**

This system behaves like a well-made instrument rather than a shopfront. An
instrument is machined to a tolerance, tells you the truth, and does not
congratulate itself — which is exactly the impression a one-person studio needs
to leave on an audience that inspects craft before it trusts anyone. The site is
the argument for the software: if the page is calm, fast, and precise, the app
probably is too.

The surface is graphite — never pure black, never washed grey — lit by a single
periwinkle signal that appears only where something can be acted on. Nothing
gradients, nothing glows for decoration, nothing shouts. Density is low and
deliberate: one idea per band of the page, generous vertical air between bands,
and a wide measure so content never reads as a cramped column squeezed between
dead margins.

It explicitly rejects the **generic SaaS landing page** — gradient hero, one giant
metric, endless identical feature cards, a "trusted by" logo wall. That template
is the thing this audience scrolls past. Restraint here is not timidity; it is
the brand's actual position, and every visual decision has to survive the
question *would a careful person do this?*

**Key Characteristics:**
- Graphite dark surface with exactly one accent hue
- System typeface only; no webfont is ever downloaded
- One separation cue at a time — a hairline *or* a lift, never both
- Wide measure, generous air, image-forward product moments
- Motion that settles rather than bounces, always reduced-motion safe

## 2. Colors: The Graphite-and-Signal Palette

A near-monochrome graphite field carrying a single chromatic voice. There is one
accent and no secondary or tertiary role — the restraint is the identity, so
inventing more roles would break it.

### Primary
- **Signal Periwinkle** (`#7f8dff`): The only chromatic voice in the system. It
  marks the one thing a visitor can act on — the download button, the current nav
  item, links in prose, the active gallery dot, focus rings. Its scarcity is what
  makes it read as a signal instead of decoration.
- **Signal Periwinkle Raised** (`#9aa6ff`): Hover state only. Slightly lighter so
  the surface appears to come toward the pointer.
- **Signal Wash** (`#7f8dff24`): A 14%-alpha tint for accent-tinted chips, the
  active nav pill, and icon tiles. Never used for text.

### Neutral
- **Graphite Base** (`#16171b`): The page ground. Deliberately not pure black —
  black on an OLED Mac display reads as a hole, graphite reads as a material.
- **Raised Graphite** (`#1e2025`): Cards, panels, the product header block. One
  step of light above the ground.
- **Lifted Graphite** (`#24262c`): Chips, badges, secondary-button hover — the
  second step, used for small elements resting on a card.
- **Near-White** (`#f4f5f7`): Body text. Not `#ffffff`, so long prose doesn't
  vibrate against the dark ground.
- **Full White** (`#ffffff`): Headings and the strongest emphasis only.
- **Muted Slate** (`#9ea3ad`): Supporting prose, summaries, descriptions.
- **Faint Slate** (`#8b909a`): The quietest tier — metadata, trust lines,
  timestamps. Verified at **4.5:1** on the base ground; it is the floor, and
  nothing lighter is permitted for text.

### Named Rules

**The One Voice Rule.** Signal Periwinkle covers no more than ~10% of any screen.
If a second thing on the page is competing for the accent, one of them is not
actually the next action.

**The Never-Black Rule.** The ground is graphite (`#16171b`), never `#000`. Pure
black on Apple displays reads as an absence; the whole system loses its material
quality.

**The Contrast Floor Rule.** `#8b909a` on `#16171b` is the lightest text
permitted anywhere. Prohibited: lighter greys "for elegance". This floor exists
because it was previously breached (`#71757e` at 3.9:1) and had to be repaired.

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
- **Display** (700, `clamp(2.75rem, 7vw, 4.75rem)`, 1.1, `-0.03em`): The studio
  name on the home hero. One per page, maximum.
- **Headline** (650, `2rem`, 1.1, `-0.022em`): Page and section titles.
- **Title** (650, `1.5rem`, 1.1): Card names, panel headings, sub-sections.
- **Body** (400, `1.0625rem`, 1.65): All prose. The 17px base matches Apple's own
  body size. Measure is capped at the reading column (`43rem`, ~82ch).
- **Label** (600, `0.8125rem`): Badges, chips, buttons, metadata.

### Named Rules

**The No-Webfont Rule.** No font file is ever downloaded. The system stack is the
typeface. This is a performance *and* an honesty decision: a privacy-first site
that phones out to a font CDN would contradict itself.

**The Balanced-Heading Rule.** `text-wrap: balance` on h1–h3, `text-wrap: pretty`
on prose. Headings never leave one orphan word alone on a line.

## 4. Elevation

The system is **near-flat and tonally layered**. Depth comes primarily from
stepping the surface lighter (`bg` → `surface` → `surface-2`), not from stacking
shadows. Shadows exist, but they are ambient — they lift a panel off the ground a
few millimetres; they never simulate a dramatic drop.

### Shadow Vocabulary
- **`--shadow-sm`** (`0 1px 2px rgba(0,0,0,0.4)`): Barely-there seat for the
  product header block.
- **`--shadow-md`** (`0 8px 24px -8px rgba(0,0,0,0.55)`): The default lift for
  cards, panels, and the screenshot frame.
- **`--shadow-lg`** (`0 20px 48px -16px rgba(0,0,0,0.6)`): Reserved for elements
  that float *over* content — gallery arrows, the featured spotlight.

### Named Rules

**The Single-Cue Rule.** A surface is separated from its background by *one*
device: an elevated tone with a soft shadow, **or** a hairline border — never
both. Stacking a border onto a shadowed card is the fastest way to make this
system look cheap.

**The Hairline Rule.** Borders are `rgba(255,255,255,0.09)` — a hairline, not a
line. If a border is visible as a distinct grey stroke, it is too strong.

## 5. Components

### Buttons
- **Shape:** Fully rounded pill (`999px`).
- **Height:** Every button is exactly `3rem`. No exceptions.
- **Primary:** Signal Periwinkle fill, near-black text (`#0e0f13`), with an inset
  top highlight (`inset 0 1px 0 rgba(255,255,255,0.18)`) that reads as a lit edge.
- **Secondary:** Transparent with a `border-strong` hairline and body-coloured
  text. On hover it fills to Lifted Graphite.
- **Download:** The primary button plus the Apple mark and a wider label; the same
  `3rem` height as everything else.
- **Hover / Focus:** Primary lifts `-1px` with an accent glow; secondary fills.
  Focus is always a visible 2px accent ring, never removed.

**The One Height Rule.** All buttons share one height; emphasis comes from fill,
width, and the mark — never from a taller box. A group of buttons must read as a
set.

### Cards / Panels
- **Corner Style:** `20px` (`--radius-lg`) for panels and cards; `14px` for
  smaller blocks; `8px` for chips.
- **Background:** A subtle vertical gradient from `surface` to `surface-2`, which
  reads as light falling from above rather than a flat fill.
- **Shadow Strategy:** `--shadow-md`, per the Single-Cue Rule (no border).
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
- Controls are glass circles over the image; the dot marks are `11px` but sit in
  `44px` hit areas.
- A native `<details>` transcript below lists every screenshot as text.

### Facts Line (signature component)
- A single quiet middot-separated row of decision facts beneath the download
  button (price, requirement, privacy stance). It breaks **only between facts**,
  never mid-phrase.

## 6. Do's and Don'ts

### Do:
- **Do** keep Signal Periwinkle (`#7f8dff`) under ~10% of any screen; it marks the
  next action and nothing else.
- **Do** give every button the same `3rem` height and let fill and width carry
  emphasis.
- **Do** separate a surface with a tone-and-shadow lift **or** a hairline —
  exactly one.
- **Do** keep body text at `#f4f5f7` and never let any text go lighter than
  `#8b909a` on the graphite ground.
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
- **Don't** use pure black (`#000`) as a surface, or a colored `border-left`
  greater than 1px as a stripe, or gradient text (`background-clip: text`).
- **Don't** stack a border on top of a shadowed card.
- **Don't** add decorative glassmorphism; blur is reserved for the sticky header
  and gallery controls where content genuinely passes beneath.
- **Don't** put a tiny uppercase tracked eyebrow above every section — a single
  deliberate kicker is voice, one per section is scaffolding.
- **Don't** ship motion without a `prefers-reduced-motion` alternative, and never
  gate content visibility on a scroll-triggered class.
