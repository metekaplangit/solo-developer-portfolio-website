# Measures every platform file: its pixel size, no alpha, its file size against the platform's limit,
# that the lockup and tiles landed inside the platform's safe box, and that they are crisp: rebuilt
# losslessly, the text and tiles must match a PNG exactly and a JPEG to within 16 shades.
# Run: python3 platforms.py && python3 prove.py   (exits 1 on any failure)
# Settles: whether every file can be uploaded as it is, without anything important being cut off.
import json, sys, tempfile
import numpy as np
from PIL import Image
from platforms import TARGETS, name_of, OUT, HERE, compose

JPEG_MAX_ERR = 16  # shades; q88 at 4:2:0 measured 65 and visibly smudged the text


def front_error(t, f, box):
    """Largest per-pixel difference, inside the text and tiles, between the file and a lossless rebuild."""
    ref = tempfile.mktemp(suffix='.png')
    compose(t[2], t[3], ref, safe=t[4], align=t[5], quality=None)
    x0, y0, x1, y1 = box
    a = np.asarray(Image.open(f).convert('RGB'), int)[y0:y1, x0:x1]
    b = np.asarray(Image.open(ref).convert('RGB'), int)[y0:y1, x0:x1]
    return int(np.abs(a - b).max())

# The largest file each platform takes, in bytes; None where no source this run gave one.
LIMIT = {'google-play': None, 'youtube': 6e6, 'facebook': None, 'x': 2e6, 'bluesky': 1e6, 'mastodon': 2e6,
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
        err = front_error(t, f, (x0, y0, x1, y1))
        checks['front crisp'] = err <= (JPEG_MAX_ERR if t[6] else 0)
        ok = all(checks.values()); bad += not ok
        lim = f'{LIMIT[t[0]] / 1e6:g} MB' if LIMIT[t[0]] else 'none found'
        print(f"{'PASS' if ok else 'FAIL'}  {rel:62} {W}x{H} {im.mode} {size / 1e3:7.0f} KB (limit {lim}) front err {err}",
              '' if ok else [k for k, v in checks.items() if not v])
    sys.exit(1 if bad else 0)
