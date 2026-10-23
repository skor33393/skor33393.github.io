#!/usr/bin/env python3
"""Validate published journal HTML, canonical metadata, structured data, and local links."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,re,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[2]
class Page(HTMLParser):
 def __init__(self,src):
  super().__init__();self.ids=[];self.links=[];self.images=[];self.h1=0;self.title='';self.desc=[];self.canonical=[];self.schemas=[];self.in_title=False;self.in_schema=False;self.buf='';self.tags=[];self.feed(src)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='h1':self.h1+=1
  if tag=='title':self.in_title=True
  if tag=='meta' and a.get('name')=='description':self.desc.append(a.get('content',''))
  if tag=='link' and a.get('rel')=='canonical':self.canonical.append(a.get('href',''))
  if tag=='a' and 'href' in a:self.links.append(a['href'])
  if tag in ['img','script','link']:
   source=a.get('src') or (a.get('href') if a.get('rel') in ['stylesheet','icon','apple-touch-icon'] else None)
   if source:self.links.append(source)
  if tag=='img':self.images.append(a)
  if tag=='script' and a.get('type')=='application/ld+json':self.in_schema=True;self.buf=''
 def handle_data(self,data):
  if self.in_title:self.title+=data
  if self.in_schema:self.buf+=data
 def handle_endtag(self,tag):
  if tag=='title':self.in_title=False
  if tag=='script' and self.in_schema:self.schemas.append(json.loads(self.buf));self.in_schema=False
pages={p:Page(p.read_text()) for p in (ROOT/'pelvic_gym').rglob('*.html')}
errors=[]
content=[a for f in (ROOT/'_pelvic_gym/content').glob('*.json') for a in json.loads(f.read_text())]
slugs={a['slug'] for a in content}
for a in content:
 if len(a['related'])!=3 or any(s not in slugs or s==a['slug'] for s in a['related']):errors.append(a['slug']+': invalid related reading')
 if not a['sources'] or not all(s['url'].startswith('https://') for s in a['sources']):errors.append(a['slug']+': invalid sources')
 if a['category'] not in ['Getting started','Everyday habits','Bladder & symptoms','Life stages']:errors.append(a['slug']+': unexpected category')
 if len(a['sections'])<4:errors.append(a['slug']+': article lacks substance')
 if a['cta'] not in ['routine','assessment']:errors.append(a['slug']+': unexpected CTA type')
for key in ['title','seoTitle','description']:
 if len({a[key] for a in content})!=len(content):errors.append('Duplicate article '+key)
for path,p in pages.items():
 rel='/'+str(path.relative_to(ROOT)).replace('index.html','')
 if p.h1!=1:errors.append(f'{rel}: {p.h1} H1s')
 if re.search(r'\bAI\b|AI-assisted|All 10 guides|10 considered',path.read_text()):errors.append(f'{rel}: prohibited editorial wording')
 if not p.title or len(p.title)>85:errors.append(f'{rel}: invalid title')
 if len(p.desc)!=1 or not 100<=len(p.desc[0])<=175:errors.append(f'{rel}: invalid description')
 if p.canonical!=['https://bestme.mobi'+rel]:errors.append(f'{rel}: wrong canonical {p.canonical}')
 if len(p.ids)!=len(set(p.ids)):errors.append(f'{rel}: duplicate IDs')
 if not p.schemas:errors.append(f'{rel}: missing structured data')
 for im in p.images:
  if 'alt' not in im or 'width' not in im or 'height' not in im:errors.append(f'{rel}: image missing alt/dimensions')
 for link in p.links:
  u=urlsplit(link)
  if u.scheme or u.netloc:continue
  target=ROOT/unquote(u.path.lstrip('/')) if u.path.startswith('/') else path.parent/unquote(u.path) if u.path else path
  if target.is_dir():target=target/'index.html'
  if not target.exists():errors.append(f'{rel}: missing {link}');continue
  if u.fragment and target in pages and unquote(u.fragment) not in pages[target].ids:errors.append(f'{rel}: missing anchor {link}')
expected_articles=sum(len(json.loads(p.read_text())) for p in (ROOT/'_pelvic_gym/content').glob('*.json'))
article_paths=[p for p in pages if '/articles/' in str(p)]
if len(article_paths)!=expected_articles:errors.append('Article page count does not match source')
for p in article_paths:
 schemas=pages[p].schemas
 if not any(s.get('@type')=='Article' for s in schemas):errors.append(f'{p}: missing Article schema')
 if not any(s.get('@type')=='BreadcrumbList' for s in schemas):errors.append(f'{p}: missing breadcrumbs')
 for link in pages[p].links:
  if 'apps.apple.com' in link and 'id6478076577' not in link:errors.append(f'{p}: wrong App Store app')
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
sitemap=ET.parse(ROOT/'pelvic_gym/sitemap.xml')
locs=[x.text for x in sitemap.findall('.//s:loc',ns)]
if len(locs)!=len(pages) or len(set(locs))!=len(pages):errors.append('Sitemap and page counts disagree')
for loc in locs:
 if not (ROOT/urlsplit(loc).path.lstrip('/')/'index.html').exists():errors.append('Missing sitemap URL '+loc)
ET.parse(ROOT/'sitemap.xml')
if (ROOT/'CNAME').read_text().strip()!='bestme.mobi':errors.append('Unexpected custom domain')
assets=sum(p.stat().st_size for p in (ROOT/'pelvic_gym/assets').iterdir())
print(f'Checked {len(pages)} pages, {len(article_paths)} articles, {len(locs)} sitemap URLs and {assets:,} bytes of shared assets.')
if errors:
 print('\n'.join(errors));raise SystemExit(1)
print('PASS: titles, descriptions, canonical URLs, JSON-LD, headings, image attributes, local URLs, anchors, sitemap and app destination.')
