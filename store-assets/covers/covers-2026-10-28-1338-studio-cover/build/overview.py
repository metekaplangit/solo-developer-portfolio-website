# Lays every platform file side by side on one light page, each labelled with its platform and size.
# Run: python3 platforms.py && python3 overview.py   (writes ../all-sizes.png)
# Settles: whether the set reads as one cover everywhere, at a glance.
from PIL import Image, ImageDraw, ImageFont
from platforms import TARGETS, name_of, OUT

f = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 26)
cells = []
for t in TARGETS:
    im = Image.open(name_of(t)).convert('RGB'); W, H = im.size
    cells.append((f'{t[0]}  {W} x {H}', im.resize((900, round(H * 900 / W)), Image.LANCZOS)))
cols, pad, lab = 2, 24, 40
rows = [cells[i:i + cols] for i in range(0, len(cells), cols)]
sheet = Image.new('RGB', (pad + cols * (900 + pad), sum(max(c[1].height for c in r) + lab + pad for r in rows) + pad), (240, 240, 243))
d = ImageDraw.Draw(sheet); y = pad
for r in rows:
    for i, (label, im) in enumerate(r):
        x = pad + i * (900 + pad); sheet.paste(im, (x, y)); d.text((x, y + im.height + 6), label, fill=(20, 20, 24), font=f)
    y += max(c[1].height for c in r) + lab + pad
sheet.save(OUT / 'all-sizes.png', optimize=True)
print(sheet.size)
