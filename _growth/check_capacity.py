#!/usr/bin/env python3
"""Conservative repository payload estimate before adding daily illustrations."""
from pathlib import Path
import json, os, subprocess

ROOT = Path(__file__).resolve().parents[1]
PAGES_LIMIT = 1_000_000_000
IMAGE_STOP = 800_000_000  # Leave room for articles, build output and other sites.
total = 0
for parent, dirs, files in os.walk(ROOT):
    dirs[:] = [d for d in dirs if d not in {'.git', '__pycache__', 'node_modules', '_site'}]
    total += sum((Path(parent) / f).stat().st_size for f in files)
stats = dict(line.split(': ', 1) for line in subprocess.check_output(
    ['git', 'count-objects', '-v'], cwd=ROOT, text=True).splitlines())
objects = (int(stats['size']) + int(stats['size-pack'])) * 1024
print(json.dumps({
    'measurement': 'Working files excluding Git/runtime/build caches; includes source and research files normally excluded by Jekyll, so this overestimates the static payload. Git object storage is measured separately.',
    'working_file_bytes': total,
    'git_object_bytes': objects,
    'published_site_limit_bytes': PAGES_LIMIT,
    'illustration_stop_threshold_bytes': IMAGE_STOP,
    'can_add_illustrations': total < IMAGE_STOP and objects < IMAGE_STOP,
    'remaining_to_site_limit_bytes': max(0, PAGES_LIMIT - total),
    'reference': 'https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits'
}, indent=2))
