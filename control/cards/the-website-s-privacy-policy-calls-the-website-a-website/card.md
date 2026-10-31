# The website's privacy policy calls the website a website

bump: patch
screen: @privacy-index
screen: @privacy-sole-focus
screen: @privacy-waypost-words

Closes issue 0020.

Plan 0019, card B. Re-checked as filed: the built `/privacy/` read "What we
collect — Nothing. This product doesn't collect personal data." while the rest
of the page says "This website". The fault was wider than the issue said: the
sentence was one fixed string in `PolicyArticle.astro`, so all 4 policies
carried "This product" — the website's, Sole Focus's and Magic Notes's (which
call themselves "This app" everywhere else) and Waypost Words's (which says
"the game" and its own name).

The sentence now lives with the other generated policy wording, as
`collectedNothingText()` in `src/lib/policy-text.ts`, built from the subject
`policyFacts()` already works out — "This website" or "This app" — and a
policy can override it through a new optional `sections.collected`, the way
it can every other section. Waypost Words uses that to say "Nothing. Waypost
Words doesn't collect personal data.", matching its own children section. The
claim itself is unchanged on every page: each policy's `dataCollected` is
empty.

The cheap test is in the built-output suite ("every policy names what it
covers"): on every built page carrying a policy, no "this product", and the
"What we collect" row names the same subject as that policy's children
sentence. Seen red on the unfixed build with all 4 policies listed, green
after. A unit test pins `collectedNothingText()` for the website and a
product. `npm run headless` exit 0 (150 unit, 53 built-output). The first
after-picture run crashed the headless browser; the second took all 6.
