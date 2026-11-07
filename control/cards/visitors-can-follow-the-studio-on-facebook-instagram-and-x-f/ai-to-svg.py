# Reads the vector drawing out of an Illustrator file saved with PDF compatibility, unchanged, as one SVG.
# Run: python3 -I ai-to-svg.py <file.ai> <out.svg>   (add --dump to print the raw page drawing first)
# Settles: whether Facebook's official secondary logo can ship as a vector, with no redrawing.
import re, sys, zlib

src, out = sys.argv[1], sys.argv[2]
data = open(src, 'rb').read()

objs = {}
for m in re.finditer(rb'(\d+) 0 obj(.*?)endobj', data, re.S):
    objs[int(m.group(1))] = m.group(2)

def stream(body):
    # Read by /Length: Illustrator ends lines with a bare \r, so the bytes before
    # `endstream` cannot be trusted to be a newline.
    m = re.search(rb'stream(\r\n|\n|\r)', body)
    size = int(re.search(rb'/Length\s+(\d+)', body).group(1))
    raw = body[m.end():m.end() + size]
    return zlib.decompress(raw) if b'/FlateDecode' in body else raw

page = next(b for b in objs.values() if re.search(rb'/Type\s*/Page\b', b))
box = [float(x) for x in re.search(rb'/MediaBox\s*\[([^\]]+)\]', page).group(1).split()]
refs = re.search(rb'/Contents\s*(\[[^\]]*\]|\d+ 0 R)', page).group(1)
content = b''.join(stream(objs[int(n)]) for n in re.findall(rb'(\d+) 0 R', refs))
if '--dump' in sys.argv:
    print(box)
    print(content.decode('latin-1')[:3000])

# Path operators only. Illustrator writes fills as m/l/c/v/y/h + f/f*, with cm for transforms.
tokens = re.findall(rb'[-+]?\d*\.?\d+|[A-Za-z*\'"]+|\[|\]', content)
stack, ctm, saved, d, paths, nums = [], [1, 0, 0, 1, 0, 0], [], [], [], []
cur = None

def mul(a, b):
    return [a[0]*b[0]+a[1]*b[2], a[0]*b[1]+a[1]*b[3], a[2]*b[0]+a[3]*b[2], a[2]*b[1]+a[3]*b[3],
            a[4]*b[0]+a[5]*b[2]+b[4], a[4]*b[1]+a[5]*b[3]+b[5]]

def pt(x, y):
    X = ctm[0]*x + ctm[2]*y + ctm[4]
    Y = ctm[1]*x + ctm[3]*y + ctm[5]
    return f'{X - box[0]:.3f} {box[3] - Y:.3f}'

for t in tokens:
    try:
        nums.append(float(t)); continue
    except ValueError:
        pass
    op = t.decode()
    n = nums; nums = []
    if op == 'q': saved.append(ctm[:])
    elif op == 'Q': ctm = saved.pop() if saved else ctm
    elif op == 'cm': ctm = mul(n[-6:], ctm)
    elif op == 'm': d.append('M' + pt(*n[-2:])); cur = n[-2:]
    elif op == 'l': d.append('L' + pt(*n[-2:])); cur = n[-2:]
    elif op == 'c': d.append('C' + ' '.join(pt(n[-6+i], n[-5+i]) for i in (0, 2, 4))); cur = n[-2:]
    elif op == 'v': d.append('C' + ' '.join([pt(*cur), pt(n[-4], n[-3]), pt(n[-2], n[-1])])); cur = n[-2:]
    elif op == 'y': d.append('C' + ' '.join([pt(n[-4], n[-3]), pt(n[-2], n[-1]), pt(n[-2], n[-1])])); cur = n[-2:]
    elif op == 're':
        x, y, w, h = n[-4:]
        d.append(f'M{pt(x, y)}L{pt(x+w, y)}L{pt(x+w, y+h)}L{pt(x, y+h)}Z')
    elif op == 'h': d.append('Z')
    elif op in ('f', 'F', 'f*', 'B', 'B*', 'b', 'b*'):
        if d: paths.append((''.join(d), 'evenodd' if '*' in op else 'nonzero'))
        d = []
    elif op in ('n', 'S', 's', 'W', 'W*'):
        if op != 'W' and op != 'W*': d = []

# The ArtBox is the artwork's own frame inside the page; the official PNG is cut to it.
art = re.search(rb'/ArtBox\s*\[([^\]]+)\]', page)
x0, y0, x1, y1 = [float(v) for v in art.group(1).split()] if art else box
w, h = x1 - x0, y1 - y0
body = ''.join(f'<path fill="#fff" fill-rule="{r}" d="{p}"/>' for p, r in paths)
open(out, 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0 - box[0]:g} {box[3] - y1:g} {w:g} {h:g}">{body}</svg>\n')
print('paths', len(paths), 'box', w, h)
