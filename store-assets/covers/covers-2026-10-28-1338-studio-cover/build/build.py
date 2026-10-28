# Draws the 16:9 cover over any of the 21 background options, for comparing them; platforms.py makes the real files.
# Run: node render-svg.cjs && python3 build.py [--variant N] [WIDTH HEIGHT OUT.png]   (default: option 21 into ../probe/)
# Settles: how a background option looks behind the finished front — the gem, the name and the 3 tiles.
import sys, math
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = Path(__file__).parent
REPO = HERE.parents[3]
SHOTS = REPO / 'src/assets'
FONT = '/System/Library/Fonts/SFNS.ttf'

BG_TOP, BG_BOTTOM = (0x24, 0x26, 0x2c), (0x15, 0x16, 0x1a)
TEXT = (0xf2, 0xf3, 0xf6)
SLATE = (0xb2, 0xbb, 0xc5)  # the grey of the site's second headline line
ORANGE = (0xff, 0x92, 0x45)  # the site's orange (--hue)

# Mac screenshots are store pictures with captions; keep only the app window.
WINDOWS = {
    'mn01': ('magic-notes/screenshots/01-words-in-answers-out.png', (486, 411, 2393, 1692)),
    'mn04': ('magic-notes/screenshots/04-inside-your-notebook.png', (330, 399, 2550, 1659)),
    'mn02': ('magic-notes/screenshots/02-a-notebook-that-counts.png', (330, 441, 2549, 1658)),
    'mn06': ('magic-notes/screenshots/06-what-time-is-it-there.png', (538, 442, 2345, 1660)),
    'sf01': ('sole-focus/screenshots/01-one-quiet-app.png', (1473, 444, 2476, 1354)),
    'sf04': ('sole-focus/screenshots/04-disappear-into-work.png', (270, 660, 2610, 1716)),
    'mn03': ('magic-notes/screenshots/03-themes-that-read-all-day.png', (520, 340, 2660, 1650)),
    'mn05': ('magic-notes/screenshots/05-change-one-line.png', (520, 360, 2600, 1670)),
    'sf02': ('sole-focus/screenshots/02-day-and-long-game.png', (1160, 230, 2810, 1760)),
    'sf03': ('sole-focus/screenshots/03-count-up-then-vanish.png', (1160, 360, 2800, 1660)),
    'sf05': ('sole-focus/screenshots/05-choose-your-theme.png', (1400, 490, 2780, 1500)),
}
# The website itself, as the screen tests last photographed it: the top 1429 x 893 of each page.
CARDS = REPO / 'control/cards'
_WEB_NEW = CARDS / 'the-studio-s-gem-logo-fills-its-tile-so-it-reads-clearly-in/after'
_WEB = CARDS / 'a-visitor-can-get-waypost-words-from-the-app-store-and-every/after'
PAGES = {
    'web-home': _WEB_NEW / 'home-1440.png', 'web-apps': _WEB_NEW / 'apps-1440.png',
    'web-about': _WEB / 'about-1440.png', 'web-ww': _WEB / 'waypost-words-1440.png',
    'web-mn': _WEB / 'magic-notes-1440.png', 'web-sf': _WEB / 'sole-focus-1440.png',
    'web-support': _WEB / 'support-1440.png', 'web-privacy': _WEB / 'privacy-index-1440.png',
}
PHONES = {k: f'waypost-words/screenshots/{v}.jpg' for k, v in {
    'ww01': '01-lightning-reveals-a-letter', 'ww04': '04-the-road-ahead',
    'ww06': '06-a-green-crossword', 'ww09': '09-rain-over-the-moor',
    'ww08': '08-places-on-the-road', 'ww10': '10-the-answer-lands',
    'ww02': '02-a-meteor-opens-a-square', 'ww03': '03-a-traveller-s-keepsakes',
    'ww05': '05-tracing-a-word', 'ww07': '07-a-surveyor-s-tools',
}.items()}

ROWS = [
    ['ww04', 'mn02', 'ww09', 'sf01', 'ww06', 'mn06'],
    ['mn01', 'ww01', 'mn04', 'ww08', 'sf04', 'ww10'],
    ['ww06', 'mn06', 'ww10', 'mn02', 'ww01', 'mn01'],
    ['sf01', 'ww09', 'mn04', 'ww04', 'mn02', 'ww08'],
    ['ww08', 'mn01', 'ww06', 'mn06', 'ww09', 'sf01'],
]

def rounded(im, r):
    m = Image.new('L', im.size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, im.width - 1, im.height - 1), r, fill=255)
    im = im.convert('RGBA'); im.putalpha(m); return im


def piece(key, h):
    if key in WINDOWS:
        f, box = WINDOWS[key]
        im = Image.open(SHOTS / f).convert('RGB').crop(box)
        r = 0.03
    elif key in PAGES:
        im = Image.open(PAGES[key]).convert('RGB')
        im = im.crop((0, 0, im.width, round(im.width * 0.625)))
        r = 0.03
    else:
        im = Image.open(SHOTS / PHONES[key]).convert('RGB')
        r = 0.09
    w = round(im.width * h / im.height)
    im = im.resize((w, h), Image.LANCZOS)
    return rounded(im, round(r * w if key in PHONES else r * h))


def build(W, H, out, variant=1):
    unit = H  # everything scales from the cover's height
    bg = Image.new('RGB', (W, H))
    d = ImageDraw.Draw(bg)
    for y in range(H):
        t = y / (H - 1)
        d.line([(0, y), (W, y)], fill=tuple(round(a + (b - a) * t) for a, b in zip(BG_TOP, BG_BOTTOM)))
    bg = bg.convert('RGBA')

    # The screenshot collage covers the right two thirds and fades out to the left and at the edges.
    from backgrounds import layer
    bg.alpha_composite(layer(variant, W, H))

    # What the studio makes, not which products: games, apps, websites.
    icons = [Image.open(HERE / f'parts/cat-{k}.png').convert('RGBA') for k in ('games', 'apps', 'websites')]
    s = round(unit * 0.15)
    gapi = round(s * 0.28)
    total = 3 * s + 2 * gapi
    x0 = round(W * 0.735 - total / 2)
    y0 = round(H * 0.5 - s / 2)
    for i, ic in enumerate(icons):
        ic = ic.resize((s, s), Image.BOX)
        if ic.getchannel('A').getextrema()[0] == 255:  # opaque square icon: give it the iOS corner
            ic = rounded(ic, round(s * 0.2237))
        sh = Image.new('RGBA', (2 * s, 2 * s), (0, 0, 0, 0))
        ImageDraw.Draw(sh).rounded_rectangle((s // 2, s // 2 + s // 14, s // 2 + s, s // 2 + s // 14 + s), round(s * 0.2237), fill=(0, 0, 0, 150))
        sh = sh.filter(ImageFilter.GaussianBlur(s // 8))
        x = x0 + i * (s + gapi)
        bg.alpha_composite(sh, (x - s // 2, y0 - s // 2))
        bg.alpha_composite(ic, (x, y0))

    # Left third: the gem beside the studio name, one line (the identity lockup).
    gem = Image.open(HERE / 'parts/gem-mark.png').convert('RGBA')
    g = round(unit * 0.18)
    gem = gem.resize((g, g), Image.BOX)
    name = ImageFont.truetype(FONT, round(unit * 0.072)); name.set_variation_by_name('Bold')
    tag = ImageFont.truetype(FONT, round(unit * 0.034)); tag.set_variation_by_name('Semibold')
    gx = round(W * 0.055)
    gy = round(H * 0.5 - g / 2)
    bg.alpha_composite(gem, (gx, gy))
    td = ImageDraw.Draw(bg)
    tx = gx + g + round(unit * 0.03)
    td.text((tx, H * 0.5 - unit * 0.012), 'MetKap Studio', font=name, fill=TEXT, anchor='ls')
    # The website's own headline, in its 2 tones, with "craft." in orange.
    ty = H * 0.5 + unit * 0.058
    x = tx + round(unit * 0.004)
    for words, colour in (('Small studio. ', TEXT), ('Serious ', SLATE), ('craft.', ORANGE)):
        td.text((x, ty), words, font=tag, fill=colour, anchor='ls')
        x += td.textlength(words, font=tag)

    bg.convert('RGB').save(out)
    print(out, W, H)


if __name__ == '__main__':
    args = sys.argv[1:]
    variant = 21
    if '--variant' in args:
        i = args.index('--variant'); variant = int(args[i + 1]); del args[i:i + 2]
    W, H = (int(args[0]), int(args[1])) if len(args) > 1 else (4096, 2304)
    out = args[2] if len(args) > 2 else str(HERE.parent / f'probe/cover-option-{variant}.png')
    Path(out).parent.mkdir(parents=True, exist_ok=True)
    build(W, H, out, variant)
