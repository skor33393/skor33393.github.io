# Search strategy and competitor observations

Research date: October 24, 2026. This is qualitative research of public search results and competitor pages. We do not have their Search Console, paid keyword tools, organic-traffic estimates or download attribution. The observations below describe visible acquisition tactics, not proven user growth.

## Public examples reviewed

| Example | Observable approach | Applied to Pelvic Gym |
|---|---|---|
| [Perifit pelvic-floor blog](https://perifit.co/blogs/pelvic-floor) | A substantial topic library addresses concrete symptoms, life stages and practical questions. | Expand into focused clusters around basics, symptoms, life stages and habits, with a dedicated page per distinct question. |
| [Perifit: peeing while running](https://perifit.co/blogs/pelvic-floor/peeing-while-running) | Search-like headings, practical subsections, a relevant product reference, source links and related articles place the commercial next step inside a broader answer. | A specific running guide, near-claim citations, useful summaries, relevant next reads and a context-sensitive download section. Do not copy their statistics, medical claims or exercise prescriptions. |
| [Elvie's pelvic-floor and Kegel guide](https://elvie.com/blogs/guides/everything-about-the-pelvic-floor-and-kegel-exercises) | An introductory guide connects anatomy, technique and more specific topics; authorship is visible. | A strong beginner hub, plain-language movement explanations and clear publisher identity. Do not invent clinician authorship or borrow the competitor's credentials. |
| [Squeezy women's article library](https://squeezyapp.com/women/womens-health-articles/) | Topics are organized into recognizable categories, including exercises, dysfunction, maternity and devices. | Navigable topic hubs rather than an undifferentiated feed. Category links are real crawlable URLs, not only client-side filters. |
| [Squeezy: how it works](https://squeezyapp.com/how-it-works/) | A concise explanation moves from product features toward App Store download links. | A brief app section and recognizable official App Store badges. Product copy stays within verified Pelvic Gym features. |

## Content approach

The journal answers readers' questions before presenting the app. The expanded library includes technique, dose, time to improvement, pregnancy, postpartum and surgical recovery, menopause, leakage, urgency, nocturia, bowel symptoms, relaxation, movement and training tools. Pages have separate purposes: for example, the urgency guide explains the symptom and assessment; bladder training explains the treatment distinction; the diary guide explains what to record; drinks guidance addresses daily habits.

The content is original. Competitor pages inform organization and the audience's vocabulary, not clinical authority. Medical claims use primary public-health, hospital, guideline or research sources. There are no fabricated case studies, ratings, before-and-after outcomes or claims that the app diagnoses muscle function.

Topic selection is based on public search-result relevance and clear fit with the app's audience. No search-volume or keyword-difficulty figures were obtained; none are claimed. A new health site should not expect to outrank established medical organizations simply because it has many articles. Expert review, real product experience, useful updates and earned links are worthwhile future investments.

## Technical implementation

- Static HTML delivers the complete text and links without JavaScript.
- Descriptive titles, unique meta descriptions, one H1 and stable trailing-slash canonical URLs.
- Article and BreadcrumbList JSON-LD on each article; CollectionPage/ItemList data for the journal and topic hubs.
- Sitemap at `/pelvic_gym/sitemap.xml`, referenced by the domain sitemap index and robots file.
- Crawlable category and related-article links; no orphan articles.
- Responsive layout, readable body text, visible keyboard focus, accessible search/filter controls and skip navigation.
- Optimized local images, explicit image dimensions, no web-font requests, no framework runtime and no tracker installed by default.
- Social-sharing metadata and a locally hosted share image.
- Official App Store badges with page/placement campaign labels; no claims that UTM labels alone track installs.

Do not add Review, rating, HowTo or FAQ rich-result claims that do not apply. The question-and-answer sections are useful content; they are not a promise of Google's enhanced search displays.

## After launch

Complete Search Console verification and submit the sitemap. Monitor which queries actually generate impressions and clicks, then improve the corresponding page rather than creating close duplicates. Link the site from the app's developer website field, appropriate social profiles and owned channels when those edits are requested. Recheck source advice when articles materially change, and preserve accurate publication/modification dates.

[Google's content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) emphasizes usefulness, trust and accurate authorship. [Search Essentials](https://developers.google.com/search/docs/essentials) describes discovery and presentation basics. Technical optimization supports discovery; it does not guarantee index inclusion, ranking or download growth.
