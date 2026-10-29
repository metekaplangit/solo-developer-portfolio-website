# The home headline's "craft." is the studio's orange, as on the covers

bump: patch
screen: @home
screen: @increased-contrast

The home headline now reads like the studio's social covers: "Small studio." in white, "Serious" in grey, and "craft." in orange `#ff9245`, the exact value the cover build uses (`store-assets/covers/covers-2026-10-28-1338-studio-cover/build/build.py`, `ORANGE`). The owner asked for it as a special touch, so it is fixed: it no longer follows whichever product the hero features, as the rest of "Serious craft." still does.

That is a deliberate exception to Spectrum's rule that the studio has no colour of its own. It lives in one token, `--craft` in `global.css`, used only by `.craft` on the home page, and is written into DESIGN.md §1 with the owner's date so a later pass does not "fix" it back.

Measured on the built home page in Chrome: "craft." computes to rgb(255, 146, 69) at 1440 and 390 and with Increase contrast on; "Serious" stays rgb(178, 187, 197) and the first line white; the headline's height is unchanged (215 px at 1440, 84 px at 390). The orange on the near-black stage is well above 3:1 for text this size. Picture of the 1440 hero in this workshop.
