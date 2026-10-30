#!/usr/bin/env python3
"""Check local-guide publishing requirements beyond the shared HTML validator."""
from pathlib import Path
from html.parser import HTMLParser
import json, re
ROOT=Path(__file__).resolve().parents[1]
ORIGIN='https://bestme.mobi'
BASE='/stylist_ai/blog/'
class Markup(HTMLParser):
    def __init__(self,text):
        super().__init__();self.tags=[];self.feed(text)
    def handle_starttag(self,tag,attrs):self.tags.append((tag,dict(attrs)))
articles=[json.loads(f.read_text()) for f in (ROOT/'_stylist_ai/content').glob('*.json')]
cities=[a for a in articles if a.get('kind')=='city']
assert sum(a['country'] in ['US','CA'] for a in cities)>=30
journal=(ROOT/'stylist_ai/blog/index.html').read_text()
for a in cities:
    path=BASE+a['slug']+'/'
    assert path not in journal, 'City leaked into regular journal: '+path
    text=(ROOT/path.lstrip('/')/'index.html').read_text()
    doc=Markup(text)
    assert ('html',{'lang':a['lang']}) in doc.tags
    assert text.index('class="city-product"')<text.index('<h1'),a['slug']
    assert '← Browse all city guides' not in text
    assert text.count('name="apple-itunes-app" content="app-id=6739435502"')==1
    assert 'noindex' not in text
    ctas=[attrs for tag,attrs in doc.tags if tag=='a' and 'data-app-cta' in attrs]
    assert len(ctas)==3 and all('id6739435502' in c['href'] for c in ctas)
    assert text.count('/stylist_ai/landing/v2/assets/app-store.svg')==3
    assert all(attrs.get('type')=='button' or 'data-tour' in str(attrs) for tag,attrs in doc.tags if tag=='button' and ('data-goal' in attrs))
    assert len(re.findall('data-tour-step=',text))==3
    assert 'data-local-editorial=' in text and 'id="local-options"' in text and 'id="compare"' in text
    assert a.get('editorial',{}).get('leadHtml'), 'Missing individually authored lead: '+a['slug']
    assert 'LocalBusiness' not in text and 'AggregateRating' not in text
    for alt in a.get('alternates',[]):
        target=next(x for x in cities if x['slug']==alt['slug'])
        assert any(x['slug']==a['slug'] for x in target['alternates'])
        assert f'hreflang="{alt["lang"]}" href="{ORIGIN}{BASE}{alt["slug"]}/"' in text
    for tag,attrs in doc.tags:
        if tag=='img' and 'srcset' in attrs:
            for src in attrs['srcset'].split(','):
                assert (ROOT/src.strip().split()[0].lstrip('/')).exists()
    assert 'data-consent-choice="denied"' in text and 'data-consent-choice="granted"' in text
assert '/color-analysis-near-you/' not in journal
print(f'PASS: {len(cities)} city guides; journal exclusion, image-first layout, official badges, Smart App Banner, reciprocal locales, sources and consent.')
