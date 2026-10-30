#!/usr/bin/env python3
"""Verify deployed journal pages and illustration assets against local output."""
from pathlib import Path
from urllib.request import Request,urlopen
from urllib.parse import urlsplit
from concurrent.futures import ThreadPoolExecutor
import xml.etree.ElementTree as ET
import json,re
ROOT=Path(__file__).resolve().parents[1]
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
urls=['https://bestme.mobi/','https://bestme.mobi/stylist_ai/','https://bestme.mobi/robots.txt','https://bestme.mobi/sitemap.xml','https://bestme.mobi/main-sitemap.xml']
for section in ['pelvic_gym','stylist_ai/blog']:
    urls.append('https://bestme.mobi/'+section+'/sitemap.xml')
    urls.extend(x.text for x in ET.parse(ROOT/section/'sitemap.xml').findall('.//s:loc',ns))
urls.append('https://bestme.mobi/stylist_ai/blog/assets/site.css')
urls.append('https://bestme.mobi/pelvic_gym/assets/site.css')
for app in ['stylist_ai','pelvic_gym']:
    for source in (ROOT/('_'+app)/'content').glob('*.json'):
        articles=json.loads(source.read_text())
        for article in articles if isinstance(articles,list) else [articles]:
            cover=article.get('illustration')
            if cover:urls.append('https://bestme.mobi'+cover['src'])
for asset in (ROOT/'stylist_ai/blog/assets/city-guides').glob('*'):
    if asset.is_file():urls.append('https://bestme.mobi/'+str(asset.relative_to(ROOT)))
urls=list(dict.fromkeys(urls))
def check(url):
    assert urlsplit(url).hostname=='bestme.mobi'
    path=ROOT/urlsplit(url).path.lstrip('/')
    if path.is_dir():path=path/'index.html'
    expected=path.read_bytes()
    try:
        with urlopen(Request(url,headers={'User-Agent':'BestMe-publication-verifier','Cache-Control':'no-cache'}),timeout=20) as r:
            actual=r.read();status=r.status
        # GitHub Pages can normalize trailing newlines; otherwise require actual deployed output.
        matches=actual.strip()==expected.strip() if path.suffix in {'.html','.xml','.txt'} else actual==expected
        ok=status==200 and matches
        return {'url':url,'status':status,'matches_published_source':ok}
    except Exception as err:return {'url':url,'status':'error','error':type(err).__name__,'matches_published_source':False}
with ThreadPoolExecutor(max_workers=5) as pool:results=list(pool.map(check,urls))
failed=[x for x in results if not x['matches_published_source']]
print(json.dumps({'checked':len(results),'passed':len(results)-len(failed),'failed':failed},indent=2))
if failed:raise SystemExit(1)
