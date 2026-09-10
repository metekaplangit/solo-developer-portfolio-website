# The refusal names the project you are standing in, not a dot

bump: patch
control: the refusal shipped in control 20 does not name one of the two projects it is telling apart

Control 20's `update` guard was driven for real straight after it shipped, and it
refused exactly as intended — but said this:

    you are standing in ., not in Elsewhere

`where` is relative to this project, so this project's own root comes out as ".",
which is the one place the guard fires from most often. A message whose whole job
is telling two projects apart named only one of them.

The root is now said by name. A subfolder keeps its relative path, which is the
more useful of the two when that is where you actually are.

Worth recording why this was not caught: control 20's tests for the guard assert
on "standing in" and "update .", both of which the broken message contains. They
were red against 19 and green against 20 and never saw the defect. What found it
was running the command once and reading the line, which is the whole argument
for driving a thing rather than trusting its suite. The new test holds the
project's own name, so the dot cannot come back.

The behind-notice `start` gained in control 20 was driven the same way in the same
sitting, with a copy claiming version 99 placed where the search would find it. It
printed both lines correctly, including a path that runs. That scratch copy and the
trial card were removed afterwards; nothing outside this project was touched.

Nothing a visitor to the website can see has changed. `CONTROL_VERSION` goes to 21,
and it is not pushed anywhere.
