# A product's icon travels with you between its band or tile and its page

bump: minor
screen: @home
screen: @apps
screen: @magic-notes
screen: @sole-focus
screen: @waypost-words
screen: @support
screen: @privacy-index
screen: @privacy-sole-focus
screen: @privacy-waypost-words
unproven: Safari's view-transition-class and :only-child handling were not driven; only Chrome was

Opening a product now carries its icon with you. The one icon that stands for a product on each page — its band on Home and Apps, its tile on Support and the privacy index, its product page header, its policy header — is named for a view transition (`ProductAvatar`'s new `travel` prop puts `view-transition-name: icon-<slug>` and `view-transition-class: product-icon` on it), so between two pages that both show it, the icon glides and resizes over 420 ms on the entrance curve while card A's page change happens around it. Going back sends it home; going on to the product's privacy policy carries it into the policy header.

Measuring it turned up 2 faults in the first version, both fixed here. The "more from the studio" tiles at the foot of a product page were named too, so every other product's icon on the page before flew off-screen to them; those tiles now pass `travels={false}`. And an icon with no partner on the next page (the other bands on Apps) faded on the group's 420 ms while the rest of the page was gone in 160; `::view-transition-old(*.product-icon):only-child` now leaves with the page and the `new` side simply appears.

Measured with the workshop probe (headless Chrome, shell mode, built site): Apps → Magic Notes, back to Apps, a Support tile → Sole Focus and Sole Focus → its privacy policy each run exactly one 420 ms icon group, the product's own, with every other icon leaving in 160 ms; Home → About runs none. A new built-output test refuses any page that names something twice for a view transition, which would silently cancel the whole transition. Firefox has no cross-document view transitions, so there it stays an ordinary load.
