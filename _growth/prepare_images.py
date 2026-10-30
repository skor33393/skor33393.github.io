#!/usr/bin/env python3
"""Create compressed responsive variants of blog covers; run with Pillow available.

Only blog-owned illustration directories are touched. Originals are preserved.
"""
from pathlib import Path
from PIL import Image
ROOT = Path(__file__).resolve().parents[1]
count = 0
for folder in ['stylist_ai/blog/assets/illustrations', 'pelvic_gym/assets/illustrations']:
    for src in (ROOT / folder).glob('*.webp'):
        if src.stem.endswith(('-400', '-800')):
            continue
        with Image.open(src) as im:
            for width in (400, 800):
                if width >= im.width:
                    continue
                dest = src.with_name(f'{src.stem}-{width}.webp')
                if dest.exists() and dest.stat().st_mtime >= src.stat().st_mtime:
                    continue
                resized = im.resize((width, round(im.height * width / im.width)), Image.Resampling.LANCZOS)
                resized.save(dest, 'WEBP', quality=80, method=6)
                count += 1
print(f'Prepared {count} responsive cover variants.')
