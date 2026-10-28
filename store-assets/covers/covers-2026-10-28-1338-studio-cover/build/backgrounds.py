# The 21 screenshot backgrounds the cover was tried on, each returned as a faded W x H layer; 21 was picked.
# Run: python3 build.py --variant N   (or python3 backgrounds.py FIRST LAST NAME to draw a range side by side)
# Settles: which arrangement of the real screenshots sits behind the cover's front.
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

from build import piece, ROWS, WINDOWS, PHONES, PAGES, HERE

NAMES = {
    1: 'Tilted wall', 2: 'Steep wall', 3: 'Straight grid', 4: 'Perspective wall', 5: 'Columns',
    6: 'Isometric floor', 7: 'Fanned stack', 8: 'Phones in front', 9: 'Depth blur', 10: 'Indigo duotone',
    11: 'Only the dark pictures', 12: 'Black and white', 13: 'Soft focus', 14: 'Spotlight', 15: 'One kind per row',
    16: 'Big tilted wall', 17: 'One of each', 18: 'One big page', 19: 'Big straight rows', 20: 'Tall phones', 21: 'Tall phones, tilted',
}


def fade(layer, W, H, start=0.38, span=0.30, edge=0.10, strength=0.58):
    xs = np.clip((np.arange(W) / W - start) / span, 0, 1)
    ys = np.arange(H)
    ys = np.clip(np.minimum(ys, H - ys) / (H * edge), 0, 1) if edge else np.ones(H)
    f = strength * np.outer(ys * ys * (3 - 2 * ys), xs * xs * (3 - 2 * xs))
    a = np.asarray(layer.getchannel('A'), dtype=float) * f
    layer.putalpha(Image.fromarray(a.round().astype(np.uint8)))
    return layer


def flat_wall(rh, gap, rows=ROWS, stagger=True, keys=None):
    rows = [[piece(k, rh) for k in r if keys is None or k in keys] for r in rows]
    width = max(sum(p.width for p in r) + gap * (len(r) - 1) for r in rows)
    canvas = Image.new('RGBA', (width + rh, len(rows) * rh + (len(rows) - 1) * gap), (0, 0, 0, 0))
    for i, r in enumerate(rows):
        x = (i % 2) * rh // 2 if stagger else 0
        for p in r:
            canvas.alpha_composite(p, (x, i * (rh + gap))); x += p.width + gap
    return canvas


def mixed_rows(n_rows, per_row, keep=None, by_kind=False):
    """Every phone, Mac and website picture, each group dealt in its own shuffled cycle, so
    neighbours differ and every picture comes round before any repeats. keep filters the
    pictures; by_kind gives each row one kind (phones, Macs, website) instead of mixing."""
    import random
    rng = random.Random(7)
    groups = [list(PHONES), [k for k in WINDOWS if k != 'sf04'], list(PAGES)]  # sf04's giant digits shout
    groups = [[k for k in g if keep is None or keep(k)] for g in groups]
    for g in groups:
        rng.shuffle(g)
    if by_kind:
        cursor = [0, 0, 0]; rows = []
        for r in range(n_rows):
            g = (1, 0, 2)[r % 3]; n = per_row * (3 if g == 0 else 1)  # phones are narrow, so a phone row holds more
            rows.append([groups[g][(cursor[g] + i) % len(groups[g])] for i in range(n)]); cursor[g] += n
        return rows
    deck = [groups[i % 3][(i // 3) % len(groups[i % 3])] for i in range(n_rows * per_row)]
    return [deck[r * per_row:(r + 1) * per_row] for r in range(n_rows)]


def is_dark(key):
    """True when a picture is mostly dark, so it sits quietly on the cover's ground."""
    p = piece(key, 120).convert('L')
    return np.asarray(p, float).mean() < 70


def small_wall(W, H, rows, stagger=True):
    wl = flat_wall(round(H * 0.125), round(H * 0.012), rows, stagger=stagger).rotate(-9, resample=Image.BICUBIC, expand=True)
    lay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    lay.alpha_composite(wl, (round(W * 0.28), round((H - wl.height) / 2)))
    return lay


def place(W, H, im, height, x, y_centre=0.5):
    s = height / im.height
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    layer.alpha_composite(im, (round(x), round(H * y_centre - im.height / 2)))
    return layer


def perspective(im, dst, size):
    """Warp im so its 4 corners land on dst (tl, tr, br, bl) inside a canvas of size."""
    w, h = im.size
    src = [(0, 0), (w, 0), (w, h), (0, h)]
    A, b = [], []
    for (x, y), (X, Y) in zip(dst, src):
        A.append([x, y, 1, 0, 0, 0, -X * x, -X * y]); b.append(X)
        A.append([0, 0, 0, x, y, 1, -Y * x, -Y * y]); b.append(Y)
    c = np.linalg.solve(np.array(A, float), np.array(b, float))
    return im.transform(size, Image.PERSPECTIVE, tuple(c), Image.BICUBIC)


def duotone(im, dark=(0x15, 0x16, 0x1a), light=(0xaa, 0xb4, 0xff)):
    a = im.getchannel('A')
    g = ImageOps.colorize(ImageOps.autocontrast(im.convert('L')), dark, light).convert('RGBA')
    g.putalpha(a)
    return g


def card(p, lift=0.06):
    """A picture with a soft shadow under it, so overlapping pictures read as separate sheets."""
    m = round(p.height * 0.12)
    out = Image.new('RGBA', (p.width + 2 * m, p.height + 2 * m), (0, 0, 0, 0))
    sh = Image.new('RGBA', out.size, (0, 0, 0, 0))
    sh.alpha_composite(Image.new('RGBA', p.size, (0, 0, 0, 190)), (m, m + round(p.height * lift * 0.5)))
    out.alpha_composite(sh.filter(ImageFilter.GaussianBlur(m // 3)))
    out.alpha_composite(p, (m, m))
    return out, m


def big_layer(W, H, items):
    """items: (key, height as a share of H, centre x as a share of W, centre y as a share of H)."""
    lay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    for k, h, cx, cy in items:
        c, m = card(piece(k, round(H * h)))
        lay.alpha_composite(c, (round(W * cx - c.width / 2), round(H * cy - c.height / 2)))
    return lay


def layer(v, W, H):
    u = H
    dark = lambda k: is_dark(k) or k in PHONES
    if v == 16:  # the picked wall, but each picture about 2.5 times bigger, so far fewer of them
        rows = mixed_rows(5, 7, keep=dark)
        wl = flat_wall(round(H * 0.30), round(H * 0.028), rows).rotate(-9, resample=Image.BICUBIC, expand=True)
        lay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        lay.alpha_composite(wl, (round(W * 0.30), round((H - wl.height) / 2)))
        return fade(lay, W, H, strength=0.42)
    if v == 17:  # one of each thing the studio makes: a website, a Mac app, a phone game
        return fade(big_layer(W, H, [('web-apps', 0.62, 0.80, 0.25), ('mn02', 0.50, 0.66, 0.80), ('ww04', 0.86, 0.95, 0.66)]),
                    W, H, start=0.36, edge=0.03, strength=0.50)
    if v == 18:  # one big picture only: the Waypost Words page of the website, straight on
        return fade(big_layer(W, H, [('web-ww', 1.02, 0.74, 0.5)]), W, H, start=0.38, edge=0.04, strength=0.40)
    if v == 19:  # 2 straight rows of big dark pictures, no tilt
        rows = [['web-apps', 'mn01', 'ww08', 'web-sf'], ['ww04', 'sf02', 'web-about', 'mn06']]
        wl = flat_wall(round(H * 0.44), round(H * 0.04), rows)
        lay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        lay.alpha_composite(wl, (round(W * 0.33), round((H - wl.height) / 2)))
        return fade(lay, W, H, strength=0.42, edge=0.04)
    if v == 20:  # tall phone screens standing in a line, each at its own height
        keys = ['ww04', 'ww08', 'ww09', 'ww01', 'ww10', 'ww06']
        items = [(k, 0.92, 0.40 + i * 0.125, 0.5 + (0.10, -0.08, 0.14, -0.04, 0.08, -0.10)[i]) for i, k in enumerate(keys)]
        return fade(big_layer(W, H, items), W, H, start=0.34, edge=0.0, strength=0.42)
    if v == 21:  # option 20's tall phones, the whole line tilted 9 degrees like the wall in 16
        keys = ['ww10', 'ww08', 'ww09', 'ww01', 'ww04', 'ww06', 'ww02', 'ww10']  # no yellow board, no big caption
        Wc, Hc = round(W * 1.5), round(H * 1.5)
        line = Image.new('RGBA', (Wc, Hc), (0, 0, 0, 0))
        for i, k in enumerate(keys):
            c, m = card(piece(k, round(H * 0.92)))
            cx = W * 0.62 + i * W * 0.125
            cy = Hc / 2 + H * (0.10, -0.08, 0.14, -0.04, 0.20, -0.10, 0.12, -0.06)[i]  # the 5th sits low so its gold button falls off the edge
            line.alpha_composite(c, (round(cx - c.width / 2), round(cy - c.height / 2)))
        line = line.rotate(-9, resample=Image.BICUBIC, center=(W * 0.75 + W * 0.25, Hc / 2))
        lay = line.crop((round(W * 0.25), round((Hc - H) / 2), round(W * 0.25) + W, round((Hc - H) / 2) + H))
        return fade(lay, W, H, start=0.34, edge=0.0, strength=0.42)
    if v == 1:  # the picked wall: every screenshot and website page, small, tilted 9 degrees, faint
        return fade(small_wall(W, H, mixed_rows(12, 14)), W, H, strength=0.42)
    if v == 11:  # calmer: only the dark pictures, a little fainter
        return fade(small_wall(W, H, mixed_rows(12, 14, keep=is_dark)), W, H, strength=0.36)
    if v == 12:  # black and white: the colour noise goes, the texture stays
        lay = small_wall(W, H, mixed_rows(12, 14))
        a = lay.getchannel('A'); lay = lay.convert('L').convert('RGBA'); lay.putalpha(a)
        return fade(lay, W, H, strength=0.40)
    if v == 13:  # soft focus: details stop competing, colours stay
        lay = small_wall(W, H, mixed_rows(12, 14)).filter(ImageFilter.GaussianBlur(H * 0.0022))
        return fade(lay, W, H, strength=0.48)
    if v == 14:  # spotlight: the wall only shows in a soft oval behind the 3 tiles
        lay = small_wall(W, H, mixed_rows(12, 14))
        X, Y = np.meshgrid(np.arange(W), np.arange(H))
        d = np.sqrt(((X - W * 0.735) / (W * 0.36)) ** 2 + ((Y - H * 0.5) / (H * 0.62)) ** 2)
        spot = np.clip(1.25 - d, 0, 1)
        a = np.asarray(lay.getchannel('A'), float) * spot * spot * (3 - 2 * spot)
        lay.putalpha(Image.fromarray(a.round().astype(np.uint8)))
        return fade(lay, W, H, start=0.30, strength=0.55, edge=0)
    if v == 15:  # order: each row one kind, so the eye reads stripes, not noise
        return fade(small_wall(W, H, mixed_rows(12, 9, by_kind=True), stagger=False), W, H, strength=0.42)
    if v == 2:  # smaller tiles, steeper
        rows = ROWS + ROWS[:2]
        wl = flat_wall(round(u * 0.30), round(u * 0.03), rows).rotate(-22, resample=Image.BICUBIC, expand=True)
        return fade(place(W, H, wl, H * 1.9, W * 0.22), W, H)
    if v == 3:  # straight, calm, no tilt
        wl = flat_wall(round(u * 0.30), round(u * 0.03), ROWS[:4])
        return fade(place(W, H, wl, H * 1.12, W * 0.33), W, H, edge=0.08)
    if v == 4:  # a wall seen at an angle, receding to the left
        wl = flat_wall(round(u * 0.36), round(u * 0.03), ROWS[:4])
        wl = wl.crop((0, 0, min(wl.width, round(wl.height * 2.2)), wl.height))
        dst = [(W * 0.34, H * 0.18), (W * 1.04, -H * 0.22), (W * 1.04, H * 1.22), (W * 0.34, H * 0.82)]
        return fade(perspective(wl, dst, (W, H)), W, H, start=0.36, edge=0.05)
    if v == 5:  # vertical columns, each set at its own height
        col_w = round(W * 0.15); gap = round(u * 0.03)
        lay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        order = [k for r in ROWS for k in r]
        for c in range(6):
            x = round(W * 0.30 + c * (col_w + gap))
            y = -round(H * (0.15 + 0.22 * ((c * 37) % 5) / 5))
            i = c * 3
            while y < H:
                k = order[i % len(order)]; i += 1
                p = piece(k, 1000); p = p.resize((col_w, round(p.height * col_w / p.width)), Image.LANCZOS)
                if y > -p.height:
                    lay.alpha_composite(p, (x, y))
                y += p.height + gap
        return fade(lay, W, H, edge=0.06)
    if v == 6:  # the wall laid flat like a floor, seen from above at an angle
        wl = flat_wall(round(u * 0.34), round(u * 0.03), ROWS)
        wl = wl.rotate(45, resample=Image.BICUBIC, expand=True)
        wl = wl.resize((wl.width, round(wl.height * 0.58)), Image.LANCZOS)
        return fade(place(W, H, wl, H * 1.5, W * 0.18), W, H, edge=0.06)
    if v == 7:  # a few big screenshots fanned like cards
        lay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        cards = [('mn04', -16, 0.60, 0.40), ('ww09', -8, 0.67, 0.56), ('mn02', 0, 0.76, 0.46),
                 ('ww06', 8, 0.86, 0.56), ('mn01', 15, 0.95, 0.42)]
        for k, ang, cx, cy in cards:
            h = H * (0.78 if k in PHONES else 0.46)
            p = piece(k, round(h))
            sh = Image.new('RGBA', (p.width + 200, p.height + 200), (0, 0, 0, 0))
            sh.alpha_composite(Image.new('RGBA', p.size, (0, 0, 0, 170)), (100, 130))
            sh = sh.filter(ImageFilter.GaussianBlur(40))
            fan = Image.new("RGBA", sh.size, (0, 0, 0, 0)); fan.alpha_composite(sh); fan.alpha_composite(p, (100, 100))
            fan = fan.rotate(-ang, resample=Image.BICUBIC, expand=True)
            lay.alpha_composite(fan, (round(W * cx - fan.width / 2), round(H * cy - fan.height / 2)))
        return fade(lay, W, H, start=0.36, edge=0.04, strength=0.62)
    if v == 8:  # Mac windows blurred behind, sharp phones in front
        back = flat_wall(round(u * 0.36), round(u * 0.03), ROWS[:3], keys=set(WINDOWS)).filter(ImageFilter.GaussianBlur(10))
        lay = fade(place(W, H, back, H * 1.2, W * 0.30), W, H, strength=0.42)
        front = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        for i, k in enumerate(['ww06', 'ww09', 'ww04', 'ww01', 'ww10', 'ww08']):
            p = piece(k, round(H * 0.62))
            front.alpha_composite(p, (round(W * 0.40 + i * W * 0.105), round(H * (0.26 + 0.10 * ((i * 3) % 4) / 3 - 0.05))))
        lay.alpha_composite(fade(front, W, H, edge=0.05, strength=0.70))
        return lay
    if v == 9:  # the tilted wall, going out of focus to the left instead of only fading
        sharp = layer(1, W, H)
        a = sharp.getchannel('A')
        base = place(W, H, flat_wall(round(u * 0.42), round(u * 0.035)).rotate(-9, resample=Image.BICUBIC, expand=True), H * 1.45, W * 0.30)
        blurred = base.filter(ImageFilter.GaussianBlur(H * 0.012))
        m = np.clip((np.arange(W) / W - 0.45) / 0.35, 0, 1)
        mask = Image.fromarray(np.tile((m * 255).astype(np.uint8), (H, 1)))
        mix = Image.composite(base, blurred, mask)
        out = fade(mix, W, H, start=0.30, span=0.28, strength=0.62)
        return out
    if v == 10:  # every screenshot turned into the gem's indigo, one colour family
        rh = round(u * 0.42); gap = round(u * 0.035)
        rows = [[duotone(piece(k, rh)) for k in r] for r in ROWS]
        width = max(sum(p.width for p in r) + gap * (len(r) - 1) for r in rows)
        wl = Image.new('RGBA', (width + rh, len(rows) * rh + (len(rows) - 1) * gap), (0, 0, 0, 0))
        for i, r in enumerate(rows):
            x = (i % 2) * rh // 2
            for p in r:
                wl.alpha_composite(p, (x, i * (rh + gap))); x += p.width + gap
        wl = wl.rotate(10, resample=Image.BICUBIC, expand=True)
        return fade(place(W, H, wl, H * 1.5, W * 0.30), W, H, strength=0.66)
    raise ValueError(v)


if __name__ == '__main__':
    # python3 backgrounds.py [first last sheet-name]   default: 1 10 backgrounds-sheet
    from PIL import ImageFont
    import build
    first, last = (int(sys.argv[1]), int(sys.argv[2])) if len(sys.argv) > 2 else (1, 10)
    name = sys.argv[3] if len(sys.argv) > 3 else 'backgrounds-sheet'
    out = HERE.parent / 'probe'
    tiles = []
    for v in range(first, last + 1):
        f = out / f'background-{v:02d}.png'
        build.build(2048, 1152, str(f), variant=v)
        tiles.append((v, Image.open(f)))
    W, H = 960, 540; pad, lab = 36, 64
    rows = (len(tiles) + 1) // 2
    sheet = Image.new('RGB', (pad + 2 * (W + pad), pad + rows * (H + lab + pad)), (240, 240, 243))
    d = ImageDraw.Draw(sheet); font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 40)
    for i, (v, im) in enumerate(tiles):
        r, c = divmod(i, 2); x = pad + c * (W + pad); y = pad + r * (H + lab + pad)
        sheet.paste(im.resize((W, H), Image.LANCZOS), (x, y))
        d.text((x, y + H + 12), f'{v}  {NAMES[v]}', fill=(20, 20, 24), font=font)
    sheet.save(out / f'{name}.png')
    print('sheet', sheet.size)
