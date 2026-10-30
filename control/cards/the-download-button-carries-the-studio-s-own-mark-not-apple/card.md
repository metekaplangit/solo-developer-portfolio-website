# The Download button carries the studio's own mark, not Apple's logo

bump: patch
screen: @home
screen: @apps
screen: @sole-focus
screen: @magic-notes
screen: @waypost-words

Plan 0017, card B, from resolve-issues 0001. Closes issue 0004.

Every store button drew Apple's logo on its own beside its label, which Apple's
App Store marketing guidelines rule out ("Don't use the standalone Apple logo";
"Use only the badge artwork provided", developer.apple.com/app-store/marketing/guidelines,
read 2026-10-30). The site is the support and marketing address App Review opens.

`DownloadButton.astro` now draws the studio's own download mark, the one
art-project 0001 drew and measured: an arrow resting on a line, one stroked
path on the gallery chevrons' 20-unit grid with their round ends, 2.25 units
wide, at 1.1em. It shows on every store button, Apple store or not, so the
`isApple` branch went with the logo, and so did the hand nudge that held the
logo up to the label line. The button's accessible name, height and label are
unchanged. `DESIGN.md` §5 Download now names the studio's mark and why.

Proof: a new built-output test, "never draws Apple's logo, and every Download
button carries the studio's mark", reads every built page. It was red on the
unfixed build ("/: the Apple logo path"), and is green now. The fast checks
pass whole. Before and after pictures of the 5 pages that carry the button;
the Waypost Words hero button, cropped, is in
`docs/issues/assets/0004/02-download-button-studio-mark.png`.
