# The page checklist

> **Purpose:** The rules every page on this site must satisfy, and the rules every
> newly added item must satisfy before it ships.
> **Read when:** Adding or changing anything a visitor sees — copy, a component, a
> section, a card, a page.
> **Update when:** A new class of defect is found on the live site.
> **Synchronize with:** DESIGN.md, UI_DESIGN.md, `tests/dist.test.ts`.
> **Status:** Active.
> **Activation:** Standard profile.

Written because the owner reported the same class of defect three times in one
sitting — text cut in the middle, two cards with no harmony, a large void in a
page — and each report ended with the same instruction: put this in a checklist
so it stops coming back.

## How this file is used

- **Before shipping any visible change**, walk the rules below that touch it.
- **The rules apply to new items and to what is already there.** A rule that
  only guarded new work would leave the site failing its own checklist.
- **Some rules are machine-checked and some are read by a person.** Each rule
  says which, and no rule is described as enforced when it is not.

Machine-checked rules live in `tests/dist.test.ts` and run against the built
output with `npm run test:dist`. They fail the packet, not a report someone has
to remember to read.

## T — Text

> The owner's words: *"In every page, the text still got cut in the middle, it
> breaks the user experience and text writing standards. No text, sentence,
> etc. should be cut in the middle."*

**T1 — A line never ends on a word that points forward.** Articles,
conjunctions, prepositions, auxiliaries and possessives all promise a word that
has not arrived; a line ending on one throws the reader onto the next line for
a word that carries nothing. Bind the pair with a non-breaking space.
*Machine-checked.*

**T2 — A named thing never splits across two lines.** A product name, a store
name, a compound term the reader holds as one word — "Sole Focus", "Mac App
Store", "Pomodoro timer", "count-up stopwatch". The pair reads as one thing, so
it wraps as one thing. *Machine-checked.*

**T3 — CSS is not the mechanism, and must not be trusted as one.** `text-wrap:
pretty` is applied site-wide and is worth having, but Chromium — which is what
the owner reads the site in — only adjusts the **last four lines** of a
paragraph, so it cannot fix a break in the middle of a long one. WebKit
evaluates the whole paragraph; Chromium does not. Both are correct per spec.
The mechanism is the non-breaking space; `pretty` is the polish on top.
*Read by a person.* (Source: [WebKit, *Better typography with text-wrap
pretty*](https://webkit.org/blog/16547/better-typography-with-text-wrap-pretty/).)

**T4 — A bound pair never overflows the narrowest column.** A non-breaking
space removes a wrap opportunity, so an over-long unbreakable run overflows at
320px — trading a defect the owner dislikes for one the site never accepts.
Pairs are capped at 22 characters. *Machine-checked.*

**T5 — Headings balance rather than bind.** `text-wrap: balance` distributes a
heading's lines evenly, which solves the same problem better for two or three
words. Do not tie heading text. *Read by a person.*

## L — Layout

> The owner's words: *"New items shall be meaningfully written, positioned,
> sized, scaled, aligned and laid out around its environment elements."*

**L1 — Items in a set share a shape.** Cards, tiles and rows that sit side by
side share their height, their top edge and their bottom edge. One card taller
than its neighbour reads as a mistake, never as emphasis. *Machine-checked for
markup parity; the rendered heights are read by a person.*

**L2 — Items in a set share a treatment.** A field shown on one card is shown
on all of them, in the same position, or on none. Two cards where one puts its
date on its own line and the other puts it inline are two designs, not one set.
*Machine-checked for markup parity.*

**L3 — A new item is placed against what surrounds it.** Its width follows the
column it sits in, its type follows the scale already on the page, and its
alignment follows the grid — never a value picked to make one element look
right on its own. *Read by a person.*

**L4 — Nothing is sized by a number that means nothing.** A measurement exists
because it comes from the type scale, the spacing scale or the grid. A stray
`37px` is a rule that was never written down. *Read by a person.*

## W — Whitespace

> The owner's words: *"When you add new things, there should be balanced empty
> areas, not like this large voids in the page."*

**W1 — No gap larger than the rhythm the page already keeps.** The space
between two blocks comes from the section spacing scale. A gap wider than the
largest step is a void, and a reader crossing it thinks something failed to
load. *Read by a person.*

**W2 — Empty space belongs to something.** Space above a block is that block's
space, set on the block. Space that belongs to nothing survives every later
edit, because nobody knows what it was for. *Read by a person.*

**W3 — Space scales with the viewport.** A gap fixed in pixels is right at one
width and wrong at every other. Use the fluid steps. *Read by a person.*

**W4 — Removing an element removes its space.** A void is most often the
margin of something that is no longer there, or of something hidden at this
breakpoint. When an element goes, its spacing goes with it. *Read by a person.*

## What is machine-checked, exactly

| Rule | Checked by | Fails when |
| --- | --- | --- |
| T1 | `tests/dist.test.ts` | a forward-pointing word is followed by an ordinary space in a wrappable run |
| T2 | `tests/dist.test.ts` | a protected phrase appears with an ordinary space inside it |
| T4 | `src/lib/typography.test.ts` | a bound pair exceeds 22 characters |
| L1, L2 | `tests/dist.test.ts` | two cards in one set emit a different element set |

Everything else on this page is read by a person, and is written to be read in
under a minute.

## Scope

A "wrappable run" is a stretch of visible text with no element boundary in it,
60 characters or longer. Shorter runs — a chip, a nav item, a button — have no
second line to fall to, so a rule about line endings cannot apply to them.
