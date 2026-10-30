"""Curated next-step routes for regular journal readers; city guides stay separate."""
TOPICS = [
    dict(slug='photo-and-color-analysis', title='Make a clearer color comparison',
         description='Set up consistent photos, compare color depth and brightness, and choose a useful next step when seasonal color results disagree.',
         intro='Start with the evidence you are comparing. A useful photo setup comes before deciding between two seasonal labels.',
         steps=[('Start with a repeatable photo', 'color-analysis-photo-lighting'),
                ('Separate depth from brightness', 'color-depth-vs-brightness'),
                ('Compare two muted directions', 'soft-summer-or-soft-autumn'),
                ('Explore neutral undertones', 'neutral-undertone-color-season'),
                ('Compare Summer and Winter', 'summer-or-winter-color-season')]),
    dict(slug='wear-and-shop-your-colors', title='Put your palette into an outfit',
         description='Build a wearable wardrobe palette, try color combinations with clothes you own, and make a practical decision before buying another garment.',
         intro='Keep the clothes that work for your life. Choose one outfit problem, then use color to help solve that specific problem.',
         steps=[('Choose a small wardrobe palette', 'build-a-wardrobe-color-palette'),
                ('Try combinations beyond the obvious', 'unexpected-outfit-color-combinations'),
                ('Use deeper colors in everyday outfits', 'deep-autumn-outfit-ideas'),
                ('Check a purchase before paying', 'buy-clothes-you-will-wear'),
                ('Plan a sun-protective outfit', 'sun-protective-outfits')]),
    dict(slug='hair-jewelry-and-accessories', title='Choose the details around your face',
         description='Explore hair color, jewelry and accessories through practical comparisons that account for your current wardrobe, preferences and daily routine.',
         intro='You do not have to change everything together. Keep a familiar outfit and explore one detail at a time.',
         steps=[('Compare warm and cool hair directions', 'warm-or-cool-hair-color'),
                ('Think through blonde versus black', 'blonde-or-black-hair'),
                ('Work with your gray hair', 'gray-hair-wardrobe-colors'),
                ('Try an unusual hair color', 'choosing-unnatural-hair-color'),
                ('Compare gold and silver', 'gold-or-silver-jewelry'),
                ('Choose a practical hair accessory', 'choose-hair-accessories')])
]

def build(b):
    for t in TOPICS:
        path=b.BASE+'/topics/'+t['slug']+'/'
        items=''.join(f'<li><p class="eyebrow">{b.e(label)}</p><h2><a href="{b.url(b.BY_SLUG[slug])}">{b.e(b.BY_SLUG[slug]["title"])}</a></h2><p>{b.e(b.BY_SLUG[slug]["excerpt"])}</p></li>' for label,slug in t['steps'])
        body=f'<main id="main" class="wrap prose"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="{b.BASE}/">Journal</a><span>/</span><span>Reading paths</span></nav><h1>{b.e(t["title"])}</h1><p>{b.e(t["intro"])}</p><ol class="reading-path">{items}</ol>{b.badge(t["slug"],"topic_end")}</main>'
        schema=[{'@context':'https://schema.org','@type':'CollectionPage','name':t['title'],'url':b.ORIGIN+path,'hasPart':[{'@type':'Article','name':b.BY_SLUG[slug]['title'],'url':b.ORIGIN+b.url(b.BY_SLUG[slug])} for _,slug in t['steps']]}]
        b.save(path+'index.html',b.shell(t['title']+' | Stylist AI',t['description'],path,body,t['slug'],schema))

def navigation(b):
    return '<section class="wrap topic-paths" aria-labelledby="paths-heading"><h2 id="paths-heading">Find your next step</h2><div>'+''.join(f'<a href="{b.BASE}/topics/{t["slug"]}/"><strong>{b.e(t["title"])}</strong><span>{b.e(t["intro"])}</span></a>' for t in TOPICS)+'</div></section>'
