# The deal states 3 checkable facts without repeating the opening

bump: patch
screen: @home

Plan 0008, card D: pick 5 of text-project 0002.

The 3 lines under "The deal" on the home page were long, 2 of 3 opened with
"Every product", and the third, "A real person reads support@…", said again
what the opening line already says ("made by one person who also answers your
email") and put a second copy of the support address on the page. They now
read:

- "Personal. Designed, built and supported by one person."
- "Documented. For every product, a dated privacy page."
- "Answered. I usually reply within 2–3 business days."

The reply time is the one the support page already states. The third line now
goes through `tie()` like the other 2, and the `SupportEmail` import it no
longer needs is gone. The comment above the band still reads true.

Measured in the built home page: 1 line each at 1920 and 1536 (54, 52 and 51
characters, down from 71, 65 and 55). At 414 each takes 2 lines (19/34, 30/21,
25/25) with no bad break; before, "Documented. Every product" stranded its
phrase start at 414. The home page has 0 bad breaks at the standard sizes.
