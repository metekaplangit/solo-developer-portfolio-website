# UI Design

> **Purpose:** Visual system, accessibility, layout, interaction, and UI quality standards.
> **Read when:** Building or changing any page/component or design token.
> **Update when:** UI patterns, tokens, accessibility, layout, or asset rules change.
> **Synchronize with:** ARCHITECTURE.md, TESTING.md, AUDIT.md.
> **Status:** Active.
> **Activation:** Standard profile.

## Direction

**Premium minimal.** Clean typography, generous whitespace, restrained color,
high-quality product cards, strong screenshot presentation, subtle motion only
where it improves clarity. Trustworthy, not flashy. Suits both apps and games;
must not read as a generic SaaS landing page.

## First viewport must communicate

Who the developer is, what they build, one or more featured products, and where
to find apps / support / privacy / contact. Do not hide the product showcase
behind a vague marketing hero.

## Key patterns

- **Product card:** icon/screenshot, name, type, platform badges, short summary,
  status, store/detail links, privacy/support links where appropriate.
- **Product detail:** identity → visual preview → value summary → features →
  platforms/store links → privacy/support links → status notes → related.
- **Privacy/support pages:** obvious title, product selector or per-product
  route, last-updated date, direct contact path, no clutter, no hidden legal
  text, no marketing copy.

## Accessibility (target: WCAG 2.2 AA)

Semantic headings, visible focus states, full keyboard navigation, sufficient
contrast, meaningful link text, alt text on all product media,
`prefers-reduced-motion` respected wherever motion exists, responsive layouts
with no horizontal overflow, large tap targets on mobile. Accessibility checks
are merge-critical for user-facing pages (see `TESTING.md`).

## Design tokens

Spacing, type scale, color, focus/hover/pressed/disabled states live in
`src/styles/` as CSS custom properties — one source, no scattered magic values.
Extract a component when a second cross-cutting concern appears (rule-of-three).

## Visual assets

Use real product screenshots when available; otherwise honest placeholders that
make clear a product is unreleased. **Do not** use copied store badges, platform
marks, or brand assets unless usage rights are confirmed (see `SECURITY.md`
provenance and `DATA_STORAGE.md` MediaAsset license field).
