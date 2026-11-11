"""Curated next-step routes for regular journal readers; city guides stay separate."""
TOPICS = [
    dict(slug='photo-and-color-analysis', title='Make a clearer color comparison',
         description='Set up consistent photos, compare color depth and brightness, and choose a useful next step when seasonal color results disagree.',
         intro='Start with the evidence you are comparing. A useful photo setup comes before deciding between two seasonal labels.',
         steps=[('Understand what color analysis does', 'what-is-color-analysis'),
                ('Use celebrity outfits as inspiration', 'soft-summer-celebrity-inspiration'),
                ('Start with a repeatable photo', 'color-analysis-photo-lighting'),
                ('Separate depth from brightness', 'color-depth-vs-brightness'),
                ('Compare clear warm and cool colors', 'bright-spring-or-bright-winter'),
                ('Compare two muted directions', 'soft-summer-or-soft-autumn'),
                ('Explore neutral undertones', 'neutral-undertone-color-season'),
                ('Compare Summer and Winter', 'summer-or-winter-color-season'),
                ('Separate clear and muted warm colors', 'spring-or-autumn'),
                ('Choose the depth of a warm outfit', 'true-autumn-or-deep-autumn'),
                ('Compare two light pastel directions', 'light-spring-or-light-summer'),
                ('Compare pale and medium cool outfits', 'light-summer-or-true-summer')]),
    dict(slug='wear-and-shop-your-colors', title='Put your palette into an outfit',
         description='Build a wearable wardrobe palette, try color combinations with clothes you own, and make a practical decision before buying another garment.',
         intro='Keep the clothes that work for your life. Choose one outfit problem, then use color to help solve that specific problem.',
         steps=[('Choose a small wardrobe palette', 'build-a-wardrobe-color-palette'),
                ('Keep personal style at the office', 'personal-style-casual-office'),
                ('Choose shoes for a walking commute', 'comfortable-alternatives-to-sneakers'),
                ('Compare greens for a softer palette', 'soft-summer-green'),
                ('Care for dark denim', 'keep-dark-jeans-dark'),
                ('Choose a layer under a blouse', 'what-to-wear-under-blouses'),
                ('Try relaxed petite proportions', 'petite-oversized-outfit-proportions'),
                ('Build comfortable home outfits', 'comfortable-home-outfits-without-dresses'),
                ('Try combinations beyond the obvious', 'unexpected-outfit-color-combinations'),
                ('Use deeper colors in everyday outfits', 'deep-autumn-outfit-ideas'),
                ('Check a purchase before paying', 'buy-clothes-you-will-wear'),
                ('Choose a pink garment for your outfit', 'choose-pink-for-winter-palette'),
                ('Plan a sun-protective outfit', 'sun-protective-outfits'),
                ('Create an ethereal look with rich colors', 'ethereal-style-dark-color-palette'),
                ('Choose a light or dark cardigan', 'brown-or-cream-cardigan'),
                ('Find petite trousers with usable pockets', 'petite-trousers-real-pockets'),
                ('Track down a discontinued garment', 'find-discontinued-clothes'),
                ('Build an outfit around a navy skirt', 'navy-pleated-skirt-outfits'),
                ('Choose wedding-guest color and style', 'wedding-guest-dress-color'),
                ('Plan a work party outfit', 'work-holiday-party-no-dress-code')]),
    dict(slug='hair-jewelry-and-accessories', title='Choose the details around your face',
         description='Explore hair color, jewelry and accessories through practical comparisons that account for your current wardrobe, preferences and daily routine.',
         intro='You do not have to change everything together. Keep a familiar outfit and explore one detail at a time.',
         steps=[('Compare warm and cool hair directions', 'warm-or-cool-hair-color'),
                ('Think through blonde versus black', 'blonde-or-black-hair'),
                ('Work with your gray hair', 'gray-hair-wardrobe-colors'),
                ('Try an unusual hair color', 'choosing-unnatural-hair-color'),
                ('Compare gold and silver', 'gold-or-silver-jewelry'),
                ('Compare nude nail colors', 'choose-nude-nail-color'),
                ('Compare lipstick color and coverage', 'choose-lipstick-color'),
                ('Choose a practical hair accessory', 'choose-hair-accessories'),
                ('Compare shoes with a dress', 'choose-shoe-color-for-dress'),
                ('Try Light Spring makeup colors', 'light-spring-makeup-colors'),
                ('Choose Light Summer eyeshadow', 'light-summer-eyeshadow'),
                ('Choose one everyday eyeshadow', 'one-and-done-eyeshadow'),
                ('Compare glasses shape and color', 'choose-glasses-frame-color')])
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
