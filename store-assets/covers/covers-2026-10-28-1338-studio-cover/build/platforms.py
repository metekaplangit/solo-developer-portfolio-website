# Lays the picked cover (front + background 21) out again for every platform's own shape and safe area.
# Run: node render-svg.cjs && python3 platforms.py   (writes ../<platform>/ files and ../master/)
# Settles: every platform gets the same cover, re-laid from its parts rather than cropped, with the
# lockup and the 3 tiles inside what that platform never covers or cuts off.
import math, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

from build import piece, rounded, HERE, FONT, BG_TOP, BG_BOTTOM, TEXT, SLATE, ORANGE
from backgrounds import card, fade

OUT = HERE.parent
# The phone screens with no yellow board and no big caption; each keeps its own height in the line,
# and Dune Reach (ww04) sits low so its gold button falls off the bottom edge.
KEYS = ['ww10', 'ww08', 'ww09', 'ww01', 'ww04', 'ww06', 'ww02']
DROP = {'ww10': 0.10, 'ww08': -0.08, 'ww09': 0.14, 'ww01': -0.04, 'ww04': 0.20, 'ww06': -0.10, 'ww02': 0.12}

# The front row, in units of u (the master's height): gem, gap, name, then the 3 tiles.
ROW_W = 1.476        # from the gem's left edge to the last tile's right edge
TILES_AT = 0.942     # where the first tile starts
FADE_AT, FADE_SPAN = 0.50, 0.533  # the screenshots fade in from here, over this distance
PHONES_AT = 0.56     # the first phone's centre


def phones(W, H, x0, ph, pivot_x):
    """The line of tall phone screens, tilted 9 degrees, first phone centred at x0, ph tall."""
    pad = round(ph)
    Wc, Hc = W + 2 * pad, H + 2 * pad
    line = Image.new('RGBA', (Wc, Hc), (0, 0, 0, 0))
    step = 0.2415 * ph
    i = 0
    while x0 + i * step < W + ph:
        k = KEYS[i % len(KEYS)]
        c, m = card(piece(k, round(ph)))
        cx = pad + x0 + i * step
        cy = Hc / 2 + DROP[k] / 0.92 * ph
        line.alpha_composite(c, (round(cx - c.width / 2), round(cy - c.height / 2)))
        i += 1
    line = line.rotate(-9, resample=Image.BICUBIC, center=(pad + pivot_x, Hc / 2))
    return line.crop((pad, pad, pad + W, pad + H))


def compose(W, H, out, safe=(0, 0, 1, 1), align=0.5, ph=None, quality=None):
    """safe: the box (fractions of W and H) the lockup and tiles must stay inside."""
    sx0, sy0, sx1, sy1 = safe[0] * W, safe[1] * H, safe[2] * W, safe[3] * H
    # 16:9 keeps the master's proportions; wider banners show small, so their front grows to fill the box.
    cap = H if W / H < 1.9 else float('inf')
    u = min(cap, (sx1 - sx0) * 0.94 / ROW_W, (sy1 - sy0) / 0.42)
    rx = sx0 + ((sx1 - sx0) - ROW_W * u) * align
    cy = (sy0 + sy1) / 2

    bg = Image.new('RGB', (W, H)); d = ImageDraw.Draw(bg)
    for y in range(H):
        t = y / (H - 1)
        d.line([(0, y), (W, y)], fill=tuple(round(a + (b - a) * t) for a, b in zip(BG_TOP, BG_BOTTOM)))
    bg = bg.convert('RGBA')

    ph = ph or H * 0.92
    x0 = rx + PHONES_AT * u
    lay = phones(W, H, x0, ph, x0 + 0.735 * ph)  # the master turns the line about this point
    fs = rx + FADE_AT * u
    bg.alpha_composite(fade(lay, W, H, start=fs / W, span=FADE_SPAN * u / W, edge=0.0, strength=0.42))

    # The 3 category tiles: games, apps, websites.
    s = round(u * 0.15); gap = round(s * 0.28)
    if safe[0] == 0 or align:  # a full-picture 16:9 keeps the master's row exactly
        tx0 = round(rx + TILES_AT * u)
    else:  # the text keeps the far left; the tiles stand on their own over the screenshots,
        # at the master's 73.5 percent across, pulled in only where the safe box ends sooner
        nf = ImageFont.truetype(FONT, round(u * 0.072)); nf.set_variation_by_name('Bold')
        text_end = rx + u * 0.18 + u * 0.03 + nf.getlength('MetKap Studio')
        tiles_w = 3 * s + 2 * gap
        tx0 = math.floor(max(text_end + 0.10 * u, min(0.735 * W, sx1 - tiles_w / 2) - tiles_w / 2))  # down, never past the edge
    ty0 = round(cy - s / 2)
    for i, k in enumerate(('games', 'apps', 'websites')):
        ic = Image.open(HERE / f'parts/cat-{k}.png').convert('RGBA').resize((s, s), Image.LANCZOS)
        sh = Image.new('RGBA', (2 * s, 2 * s), (0, 0, 0, 0))
        ImageDraw.Draw(sh).rounded_rectangle((s // 2, s // 2 + s // 14, s // 2 + s, s // 2 + s // 14 + s), round(s * 0.2237), fill=(0, 0, 0, 150))
        sh = sh.filter(ImageFilter.GaussianBlur(max(1, s // 8)))
        x = tx0 + i * (s + gap)
        bg.alpha_composite(sh, (x - s // 2, ty0 - s // 2))
        bg.alpha_composite(ic, (x, ty0))

    # The gem beside the studio name, and the site's headline under it.
    g = round(u * 0.18)
    gem = Image.open(HERE / 'parts/gem-mark.png').convert('RGBA').resize((g, g), Image.LANCZOS)
    gx, gy = math.ceil(rx), round(cy - g / 2)  # up, so it never rounds past the safe edge
    bg.alpha_composite(gem, (gx, gy))
    name = ImageFont.truetype(FONT, round(u * 0.072)); name.set_variation_by_name('Bold')
    tag = ImageFont.truetype(FONT, round(u * 0.034)); tag.set_variation_by_name('Semibold')
    td = ImageDraw.Draw(bg)
    tx = gx + g + round(u * 0.03)
    td.text((tx, cy - u * 0.012), 'MetKap Studio', font=name, fill=TEXT, anchor='ls')
    x = tx + round(u * 0.004)
    for words, colour in (('Small studio. ', TEXT), ('Serious ', SLATE), ('craft.', ORANGE)):
        td.text((x, cy + u * 0.058), words, font=tag, fill=colour, anchor='ls')
        x += td.textlength(words, font=tag)

    # Where the front landed, so the proof can check it against the safe box.
    box = (gx, min(gy, ty0), tx0 + 3 * s + 2 * gap, max(gy + g, ty0 + s, round(cy + u * 0.058 + u * 0.01)))
    rgb = bg.convert('RGB')
    Path(out).parent.mkdir(parents=True, exist_ok=True)
    if quality:
        rgb.save(out, quality=quality, optimize=True, progressive=True)
    else:
        rgb.save(out, optimize=True)
    return box


# The front always starts at the left of the safe box (align 0); 16:9 keeps the master's margin.
# platform, file, W, H, safe box, align, phone height (None = 0.92 H), JPEG quality (None = PNG)
TARGETS = [
    ('google-play', 'developer-header', 4096, 2304, (0, 0, 1, 1), 0.325, None, None),
    ('youtube', 'channel-banner', 2560, 1440, (507 / 2560, 508 / 1440, 2053 / 2560, 931 / 1440), 0, None, 92),
    ('facebook', 'page-cover', 1702, 630, (0.19, 0.10, 0.81, 0.84), 0, None, 92),
    # X, Bluesky and Mastodon put the profile photo over the bottom left, so the front sits above it.
    ('x', 'header', 1500, 500, (0.05, 0.10, 0.96, 0.64), 0, None, 90),
    ('bluesky', 'banner', 3000, 1000, (0.05, 0.10, 0.96, 0.64), 0, None, 88),
    ('mastodon', 'header', 1500, 500, (0.05, 0.10, 0.96, 0.64), 0, None, 90),
    # LinkedIn's logo covers the bottom left 2-13 percent, so the front starts just right of it.
    ('linkedin', 'page-cover', 1512, 256, (0.15, 0.08, 0.95, 0.92), 0, 256 * 1.3, 92),
    ('twitch', 'profile-banner', 1200, 480, (0.08, 0.08, 0.92, 0.92), 0, None, 92),
    ('reddit', 'banner', 1600, 480, (0.06, 0.10, 0.94, 0.90), 0, None, 90),
    ('discord', 'server-banner', 960, 540, (0.04, 0.14, 0.96, 0.96), 0.325, None, None),
    ('github', 'social-preview', 1280, 640, (0.06, 0.08, 0.94, 0.92), 0, None, 90),
    ('website', 'link-preview', 1200, 630, (0.06, 0.08, 0.94, 0.92), 0, None, None),
]


def name_of(t):
    p, use, W, H = t[:4]
    return OUT / p / f'metkap-studio-{p}-{use}-{W}x{H}.{"jpg" if t[7] else "png"}'


if __name__ == '__main__':
    import json
    only = sys.argv[1:]
    landed = {}
    for t in TARGETS:
        if only and t[0] not in only:
            continue
        box = compose(t[2], t[3], name_of(t), safe=t[4], align=t[5], ph=t[6], quality=t[7])
        landed[str(name_of(t).relative_to(OUT))] = {'front': box, 'safe': t[4]}
        print(t[0], t[2], t[3], 'front', box)
    (HERE / 'landed.json').write_text(json.dumps(landed, indent=1))  # read by prove.py
