# 0020 The website privacy policy calls the website "this product"

- Severity: low
- Reach: player
- Area: privacy pages
- Found by: hunt-project 0001
- Filed: 2026-10-29
- Tried by: —
- Closed by: v0.66.26, card the-website-s-privacy-policy-calls-the-website-a-website

## What happens
Under "What we collect", the studio website's own policy on `/privacy/` reads
"Nothing. This product doesn't collect personal data." Every other sentence on
that page calls it "this website". The sentence is a fixed string in
`src/components/PolicyArticle.astro:108`, shared by every policy, while the
rest of the page's wording comes from `policyFacts()`, which knows a website
from an app.

## How to see it
Open `/privacy/` and read the "What we collect" row.

## What should happen
The row names what the policy covers: "this website" on the website policy,
the app or game on a product policy.

## Evidence
- `dist/privacy/index.html` text: "What we collect Nothing. This product doesn't collect personal data." followed by "This website keeps nothing about you".
- assets/0020/01-privacy-index-1440-after.png — the row after the fix: "Nothing. This website doesn't collect personal data."
