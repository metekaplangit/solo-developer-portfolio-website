# The about page reads as one picture

bump: patch
screen: @about

Plan 0007, card C, from retouch-project 0002 part 5. Closes issue 0009.

The about page opened on a headline and lede hugging the left with the right
half empty (first-screen largest empty region 22.7% at 1440, weight 12.3% of
the width left of centre), then 4 identical lifted cards for the values, then a
contact panel washed in Sole Focus's orange and a row of mono links outside it.

Now the hero and the principles share one grid — the 15rem label rail, the
gutter, two equal columns. The headline spans the rail and the first column, the
introduction sits in the right column, "How I build" sits on the rail, and the
4 principles are a numbered, ruled `ol` in 2 columns (`role="list"` kept). The
contact panel is plain `.panel`, with the email, Apps & Games and Privacy links
inside it in the site's sans. The studio's person's name is joined with a
non-breaking space so it never splits across lines.

Issue 0009 closes here: no studio page draws an accent panel any more. A new
built-output test says a page that draws `.panel-accent` must set a product's
`--hue` inline; it went red on `/about/` before this change (Support had
already lost its accent in card B) and is green now.

Measured on the built site at 1440: first-screen largest empty 7.7%, weight
−2.5% off centre, right content edge 111 px (173 before), page height 1139. At
390 everything stacks in reading order with no sideways scroll. Both pictures
were looked at whole.
