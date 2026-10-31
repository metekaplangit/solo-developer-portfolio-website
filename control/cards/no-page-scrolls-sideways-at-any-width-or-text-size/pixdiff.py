# What it does: compares before/ and after/ pictures pixel by pixel and prints where they differ.
# Run: python3 control/cards/<slug>/pixdiff.py <dirA> <dirB>
# Settles: whether a change moved anything at the standard widths.
import sys, os
from PIL import Image, ImageChops
a, b = sys.argv[1], sys.argv[2]
for n in sorted(os.listdir(a)):
    if not n.endswith('.png'): continue
    x, y = Image.open(os.path.join(a, n)).convert('RGB'), Image.open(os.path.join(b, n)).convert('RGB')
    if x.size != y.size: print(f'{n}: size {x.size} -> {y.size}'); continue
    # Differences of a few shades are image-decoding noise (measured: 1 of 255 between
    # two shots of one build); anything over 8 is a real change.
    box = ImageChops.difference(x, y).convert('L').point(lambda v: 255 if v > 8 else 0).getbbox()
    print(f'{n}: {"same" if box is None else f"differs in {box}"}')
