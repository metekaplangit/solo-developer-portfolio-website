# What a product does reads as a numbered, ruled list, not a wall of boxes

bump: minor
screen: @magic-notes
screen: @sole-focus
screen: @waypost-words

Card C of plan 0003, from pick 3 of retouch-project 0001. "What it does" was
twelve identical boxes of 15px muted text, the "endless identical feature cards"
DESIGN.md names as the thing to avoid, and the band a visitor reads to decide.

It is now a ruled list. The heading sits on a 15rem left rail at 64rem and up;
each claim is a 17px line in `--text` under a hairline, with a two-digit index in
the product's own hue. The column count still comes from `evenColumns()` on
`.grid-even`, now 3 at the widest rather than 4, so every column ends on one line.
One cue: a hairline above each claim, no fill.

Two wrapping fixes from the retouch critique came with it. `text-wrap: balance`
keeps a two- or three-line claim even ("by you rather / than by your region" was
the break). MDN, `text-wrap-style`, modified 2026-06-08: Baseline 2024, and
Chromium balances at most 6 lines, which every claim here is under. And a hyphen
between two letters is shown as U+2011, so "exchange- / rate" no longer splits;
the content files are unchanged.

That second fix turned one fast test red: T1 in `tests/dist.test.ts` read
"built‑in" as two words and flagged its "in" as a word left dangling at a line
end. The test already counts `-` as part of a word, so it now counts U+2011 the
same way, in both of its patterns. Seen red on this change before that edit,
green after; its own "proof the three checks above can fail" test still passes.

Proved by: Headless Suite Testing, complete and green; Scoped Suite Testing on
@magic-notes @sole-focus @waypost-words, 14 of 14; after pictures at 1440 and 390.

unproven: U+2011 in Safari with SF Pro — nothing found on it, and no Safari here
unproven: a real phone — the coarse-pointer pass is an emulated one
