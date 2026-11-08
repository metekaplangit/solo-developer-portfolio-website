# Measures every platform file: its pixel size, no alpha, its file size against the platform's limit,
# that the lockup and tiles landed inside the platform's safe box, and that they are crisp: rebuilt
# losslessly, the text and tiles must match a PNG exactly and a JPEG to within 16 shades.
# Run: python3 platforms.py && python3 prove.py   (exits 1 on any failure)
# Settles: whether every file can be uploaded as it is, without anything important being cut off.
import json, sys, tempfile
import numpy as np
from PIL import Image
from platforms import TARGETS, BACKGROUND_STEP, name_of, OUT, HERE, compose, plain_background

JPEG_MAX_ERR = 16  # shades; q88 at 4:2:0 measured 65 and visibly smudged the text


def errors(t, f, box):
    """Largest per-pixel difference from a lossless rebuild: in the text and tiles, the whole picture, the plain gradient."""
    ref = tempfile.mktemp(suffix='.png')
    compose(t[2], t[3], ref, safe=t[4], align=t[5], quality=None)
    x0, y0, x1, y1 = box
    r = np.asarray(Image.open(ref).convert('RGB'), int)
    d = np.abs(np.asarray(Image.open(f).convert('RGB'), int) - r)
    return int(d[y0:y1, x0:x1].max()), int(d.max()), int(d[plain_background(r)].max())

# The largest file each platform takes, in bytes; None where no source this run gave one.
# Google Play: Play Console refused 2.64 MB with "File size must be 2 MB or smaller" on 2026-11-08.
LIMIT = {'google-play': 2e6, 'youtube': 6e6, 'facebook': None, 'x': 2e6, 'bluesky': 1e6, 'mastodon': 2e6,
         'linkedin': 3e6, 'twitch': 10e6, 'reddit': 5e5, 'discord': None, 'github': 1e6, 'website': None}

if __name__ == '__main__':
    landed = json.loads((HERE / 'landed.json').read_text())
    bad = 0
    for t in TARGETS:
        f = name_of(t); rel = str(f.relative_to(OUT))
        im = Image.open(f); W, H = im.size
        size = f.stat().st_size
        x0, y0, x1, y1 = landed[rel]['front']; s = landed[rel]['safe']
        checks = {
            'size': (W, H) == (t[2], t[3]),
            'no alpha': im.mode == 'RGB',
            'file size': LIMIT[t[0]] is None or size <= LIMIT[t[0]],
            'front inside safe box': x0 >= s[0] * W and y0 >= s[1] * H and x1 <= s[2] * W and y1 <= s[3] * H,
        }
        err, whole, plain = errors(t, f, (x0, y0, x1, y1))
        checks['front crisp'] = err <= (JPEG_MAX_ERR if t[6] else 0)
        if not t[6]:  # a PNG moves no pixel, or at most half its background step, and never the plain gradient
            checks['background within its step'] = whole <= BACKGROUND_STEP.get(t[0], 1) // 2
            checks['plain gradient exact, no banding'] = plain == 0
        ok = all(checks.values()); bad += not ok
        lim = f'{LIMIT[t[0]] / 1e6:g} MB' if LIMIT[t[0]] else 'none found'
        print(f"{'PASS' if ok else 'FAIL'}  {rel:62} {W}x{H} {im.mode} {size / 1e3:7.0f} KB (limit {lim}) front err {err} whole err {whole} plain err {plain}",
              '' if ok else [k for k, v in checks.items() if not v])
    sys.exit(1 if bad else 0)
