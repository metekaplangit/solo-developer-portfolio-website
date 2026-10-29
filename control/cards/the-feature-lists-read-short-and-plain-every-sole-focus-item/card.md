# The feature lists read short and plain, every Sole Focus item on 1 line

bump: patch
screen: @sole-focus
screen: @magic-notes

Card E of plan 0010, pick 2 of text-project 0003. The Sole Focus feature grid
mixed 1-line and 2-line items, used dashes and leaned on words like
"distraction-free"; 7 Magic Notes items were noun piles ("Unlimited undo,
sheet timelines, guarded restore"). The 8 Sole Focus items are now short plain
phrases, each matching what the story below says, and the erase item left the
grid because "Yours to erase" already says it in full. The YAML comment naming
STEP-0063 stays above the last item, reworded. The 7 Magic Notes items say what
a person does ("Name a value, total a section, ask about lines above").

Measured on the built site after clearing `.astro` and `node_modules/.astro`
(issue 0008), at 1920, 1536 and 414: all 8 Sole Focus items take 1 line, all 12
Magic Notes items take 2 lines, 0 bad breaks in either grid. Counts stay 8 and
12. "Pomodoro timer" stays tied (`dist.test.ts`). `npm run headless` passed
(exit 0, 130 and 38 tests); both pages photographed before and after.
