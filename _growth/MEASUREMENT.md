# Search and blog measurement

Setup verified on 2026-10-26 (Asia/Dubai). The root `https://bestme.mobi/` Search Console URL-prefix property is verified with a Google-provided HTML meta tag on the separate BestMe homepage. Preserve that tag. Child properties for `/stylist_ai/blog/` and `/pelvic_gym/` are verified through the parent. Do not change active Stylist AI ad landing pages or their shared assets.

Google successfully processed the shared sitemap index and both blog sitemaps. Initial discovered counts: Stylist AI 14 URLs; Pelvic Gym 38 URLs. Discovered sitemap URLs are not indexed URLs. Both blog homepages were initially unknown to Google's index; one indexing request for each was accepted into Google's crawl queue. Do not repeatedly submit the same URL. New articles enter the existing sitemap through the generators.

Dedicated saved GA4 reports are named `Stylist AI Blog — Visitors & Articles` and `Pelvic Gym Blog — Visitors & Articles`. Each filters Page path and screen class to its blog path prefix. They retain the standard report and exclude mobile app screens; the Stylist report also excludes advertising landing pages. Their direct links and the initial analytics baseline are in the local sibling `../seo-analytics/` folder, outside this public publishing repository.

## Reading progress

- Search Console Performance: clicks, impressions, CTR and average position, segmented by page and query. Use the appropriate blog property. Average position is an impression-weighted aggregate, not one universal rank. Keep country, device, search type and date window comparable. Query rows can omit anonymized queries; do not sum them as a replacement for site totals.
- Search Console Indexing: inspect excluded pages and crawl problems. A live HTTP 200, valid sitemap and an accepted indexing request do not prove indexing.
- GA4 saved blog report: views, active users, engagement and event counts over time, with article-level rows. The properties also contain mobile app data; never use the unfiltered property homepage as blog performance.
- `app_store_click` is a tracked website click, not an app install. Select that event in the report where available. Do not treat scrolling as proof of reading or promise Apple install attribution from UTMs.
- Analytics only measures consenting, unblocked clients. Initial figures may include development/QA visits. Missing or processing data is not a zero audience. The first baseline is too early to judge growth.
- For comparison, use two equal fully reported periods (initially 7 days, then 28 days). Record the actual displayed date range, property timezone, filter, observation time and data freshness. Mark unknown values null. Keep private exports and visitor metrics outside this public repository.

## Improving useful search coverage

Once Search Console has usable data, use actual queries and landing-page performance alongside fresh question research. Improve a relevant existing guide before creating another article with the same intent. Check whether low CTR comes from an unclear or mismatched title before changing it; consider query mix and position. Preserve honest dates and authoritative health sources. Never invent search volumes, reviews, clinical credentials, backlink outreach or guaranteed ranking gains.

The normal workflow remains five distinct useful articles per app at 22:00 Asia/Dubai, with fewer when there is insufficient original value. Preserve compressed illustrations, descriptive image text, crawlable internal links and sitemap inclusion. Stylist articles should specify two relevant `related` slugs when suitable. Do not add unrelated links solely for SEO.
