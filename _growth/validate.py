#!/usr/bin/env python3
"""Cross-journal validation for the daily publishing workflow."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
from datetime import date
import json,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self,text):
        super().__init__();self.h1=0;self.ids=[];self.links=[];self.title='';self.desc=[];self.canonical=[];self.schemas=[];self.active=None;self.buf='';self.images=[];self.feed(text)
    def handle_starttag(self,t,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if t=='h1':self.h1+=1
        if t=='title':self.active='title';self.buf=''
        if t=='meta' and a.get('name')=='description':self.desc.append(a.get('content',''))
        if t=='link' and a.get('rel')=='canonical':self.canonical.append(a['href'])
        if t=='a' and a.get('href'):self.links.append(a['href'])
        if t in ['img','script'] and a.get('src'):self.links.append(a['src'])
        if t=='link' and a.get('rel') in ['stylesheet','icon']:self.links.append(a['href'])
        if t=='img':self.images.append(a)
        if t=='script' and a.get('type')=='application/ld+json':self.active='schema';self.buf=''
    def handle_data(self,d):
        if self.active:self.buf+=d
    def handle_endtag(self,t):
        if t=='title':self.title=self.buf;self.active=None
        if t=='script' and self.active=='schema':self.schemas.append(json.loads(self.buf));self.active=None
errors=[]
def check(ok,message):
    if not ok:errors.append(message)
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
for section,app in [('pelvic_gym','6478076577'),('stylist_ai/blog','6739435502')]:
    pages={p:Page(p.read_text()) for p in (ROOT/section).rglob('*.html')}
    for path,p in pages.items():
        rel='/'+str(path.relative_to(ROOT)).replace('index.html','')
        check(p.h1==1,rel+': H1 count')
        check(0<len(p.title)<=85,rel+': title')
        check(len(p.desc)==1 and 100<=len(p.desc[0])<=175,rel+': description')
        check(p.canonical==['https://bestme.mobi'+rel],rel+': canonical')
        check(len(set(p.ids))==len(p.ids),rel+': duplicate IDs')
        check(bool(p.schemas),rel+': schema missing')
        for im in p.images:check(all(x in im for x in ['alt','width','height']),rel+': image attributes')
        for link in p.links:
            u=urlsplit(link)
            if u.netloc=='apps.apple.com':check('id'+app in u.path,rel+': wrong app destination')
            if u.scheme or u.netloc:continue
            target=ROOT/unquote(u.path.lstrip('/')) if u.path.startswith('/') else path.parent/unquote(u.path) if u.path else path
            if target.is_dir():target=target/'index.html'
            check(target.exists(),rel+': missing '+link)
            if target in pages and u.fragment:check(unquote(u.fragment) in pages[target].ids,rel+': missing anchor '+link)
    locs=[x.text for x in ET.parse(ROOT/section/'sitemap.xml').findall('.//s:loc',ns)]
    check(set(locs)=={'https://bestme.mobi/'+str(p.relative_to(ROOT)).replace('index.html','') for p in pages},section+': sitemap mismatch')
    check(len(locs)==len(set(locs)),section+': duplicate sitemap URL')
    print(f'{section}: checked {len(pages)} pages, links, metadata and sitemap')
for folder,base in [('_stylist_ai/content','stylist_ai/blog'),('_pelvic_gym/content','pelvic_gym/articles')]:
    articles=[]
    for f in (ROOT/folder).glob('*.json'):
        item=json.loads(f.read_text());articles.extend(item if isinstance(item,list) else [item])
    check(len({a['slug'] for a in articles})==len(articles),folder+': duplicate slug')
    for a in articles:
        p=Page((ROOT/base/a['slug']/'index.html').read_text())
        schemas=[s for s in p.schemas if s.get('@type')=='Article']
        check(len(schemas)==1,a['slug']+': Article schema')
        if schemas:
            published=a.get('datePublished','2026-10-24');modified=a.get('dateModified',published)
            date.fromisoformat(published);date.fromisoformat(modified)
            check(modified>=published,a['slug']+': modification predates publication')
            check(schemas[0]['datePublished'].startswith(published),a['slug']+': publication mismatch')
            check(schemas[0]['dateModified'].startswith(modified),a['slug']+': modification mismatch')
        check(bool(a['sources']),a['slug']+': missing sources')
locs=[x.text for x in ET.parse(ROOT/'sitemap.xml').findall('.//s:loc',ns)]
check('https://bestme.mobi/pelvic_gym/sitemap.xml' in locs and 'https://bestme.mobi/stylist_ai/blog/sitemap.xml' in locs,'Shared sitemap missing a journal')
check((ROOT/'CNAME').read_text().strip()=='bestme.mobi','Domain changed')
if errors:raise SystemExit('\n'.join(errors))
print('PASS: both journals, app destinations, date preservation, shared sitemap and domain')
