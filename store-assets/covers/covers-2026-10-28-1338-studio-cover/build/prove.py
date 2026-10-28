# Measures every platform file: its pixel size, no alpha, its file size against the platform's limit,
# and that the lockup and tiles landed inside the platform's safe box.
# Run: python3 platforms.py && python3 prove.py   (exits 1 on any failure)
# Settles: whether every file can be uploaded as it is, without anything important being cut off.
import json, sys
from PIL import Image
from platforms import TARGETS, name_of, OUT, HERE

# The largest file each platform takes, in bytes; None where no source this run gave one.
LIMIT = {'google-play': None, 'youtube': 6e6, 'facebook': None, 'x': 2e6, 'bluesky': 1e6, 'mastodon': 2e6,
         'linkedin': 3e6, 'twitch': 10e6, 'reddit': 5e5, 'discord': None, 'github': 1e6, 'website': None}

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
    ok = all(checks.values()); bad += not ok
    lim = f'{LIMIT[t[0]] / 1e6:g} MB' if LIMIT[t[0]] else 'none found'
    print(f"{'PASS' if ok else 'FAIL'}  {rel:62} {W}x{H} {im.mode} {size / 1e3:7.0f} KB (limit {lim})",
          '' if ok else [k for k, v in checks.items() if not v])
sys.exit(1 if bad else 0)
