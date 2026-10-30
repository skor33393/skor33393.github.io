#!/usr/bin/env python3
"""Check shared-copy regressions in authored city content, excluding common UI."""
import json, re, html, itertools, collections
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def plain(value):
    return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>',' ',value))).strip()
articles=[json.loads(p.read_text()) for p in (ROOT/'_stylist_ai/content').glob('*.json')]
cities=[a for a in articles if a.get('kind')=='city']
paragraphs=collections.defaultdict(set)
sentences=collections.defaultdict(set)
rows=[]; shingles={}
for a in cities:
    ed=a['editorial']
    content=ed['leadHtml']+' '+''.join(s['html'] for s in a['sections'])
    for p in re.findall(r'<p[^>]*>(.*?)</p>',content,re.S):
        normalized=plain(p).casefold()
        if len(normalized)>100:paragraphs[normalized].add(a['slug'])
        for sentence in re.split(r'(?<=[.!?])\s+',normalized):
            if len(sentence.split())>=15:sentences[sentence].add(a['slug'])
    tokens=re.findall(r"[\w’-]+",plain(content).casefold())
    shingles[a['slug']]={tuple(tokens[i:i+5]) for i in range(len(tokens)-4)}
    rows.append({'slug':a['slug'],'language':a['lang'],'layout':ed['layout'],'word_tokens':len(tokens),'text_characters':len(plain(content))})
duplicates=[{'text':p,'slugs':sorted(s)} for p,s in paragraphs.items() if len(s)>1]
repeated_sentences=[{'text':p,'slugs':sorted(s)} for p,s in sentences.items() if len(s)>1]
pairs=[]
for a,b in itertools.combinations(cities,2):
    if not(a['lang'].startswith('en') and b['lang'].startswith('en')):continue
    x=shingles[a['slug']];y=shingles[b['slug']]
    pairs.append({'a':a['slug'],'b':b['slug'],'five_word_overlap':round(len(x&y)/len(x|y),4)})
assert len({a['title'] for a in cities})==len(cities)
assert len({a['editorial']['leadHtml'] for a in cities})==len(cities)
assert not duplicates,duplicates
assert not repeated_sentences,repeated_sentences
print(json.dumps({'articles':len(cities),'unique_editorial_formats':len({a['editorial']['layout'] for a in cities}),'duplicate_body_paragraphs':duplicates,'repeated_body_sentences_15_words_or_more':repeated_sentences,'highest_english_five_word_overlap':sorted(pairs,key=lambda x:x['five_word_overlap'],reverse=True)[:5],'pages':rows,'scope':'Authored lead and article sections only. Common navigation, product banner, onboarding controls, source disclosure and store badges are excluded. This checks copy repetition, not Google policy compliance or ranking.'},ensure_ascii=False,indent=2))
