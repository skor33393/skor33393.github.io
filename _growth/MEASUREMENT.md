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


## Statistics with every scan and publication batch (2026-11-12)

The user requests a Google statistics check, durable history, charts and insights with **every scheduled SEO scan and every manual article-creation batch**. One fresh snapshot covers the articles created together; link the snapshot to all their URLs. Do not run ten identical analytics queries for one ten-article batch. An already-completed scheduled occurrence remains idempotent. This measurement step does not replace question research or publication.

**Browser requirement:** use an isolated, persistent Playwright analytics profile, normally headless. Never control the user's regular Chrome window, switch their tabs, attach to their daily browser, copy its cookies, or fall back to native browser controls. The user explicitly requested this on 2026-11-12. The private profile and scripts are under `../seo-analytics/`. If sign-in expires, record `authentication_required`, continue publication, and request a one-time manual sign-in in the separate analytics browser. Do not handle passwords or bypass Google challenges. Do not launch a visible browser during unattended runs.

Read `../seo-analytics/README.md`; run the private collector for the current run ID. Keep `snapshots/<run-id>/snapshot.json`, redacted evidence, dated charts and an HTML report outside the publishing repository. Append normalized observations to the private history and rebuild `../seo-analytics/index.html`. Never overwrite historical snapshots, invent missing dates, or put metrics, session files, exports or credentials in GitHub Pages. A retry must preserve earlier evidence and mark its observation time.

Collect, when authenticated access permits:

- Search Console for each app: actual date range/freshness, Web search type, property, country/device filters, clicks, impressions, CTR, average position, daily rows and leading page/query rows. Record index coverage when available without requesting indexing or re-running the fixed pilot checkpoint. Keep the existing Nov 7/Nov 14 checkpoint idempotency.
- GA4 for each saved, path-filtered **website** report: views, active users, Organic Search sessions/users/views where supported, article rows, engagement and `app_store_click`. Preserve separate Stylist blog versus ad landing scope and distinguish Pelvic articles from supporting website pages. The old built-in combined Organic Search/Video/Social/Shopping comparison must not be relabeled as Google-only traffic. Prefer `google / organic` where source/medium can be inspected, and keep its scope explicit.
- Actual displayed windows, report timezone when verified (otherwise null), observed-at timestamp, available/partial/processing/authentication-required/error status, filters and evidence paths. Unknown metrics stay null; only a visibly reported zero is zero.

Prefer two equal, fully reported 7-day periods; use 28 days when sufficient history exists. Do not compare partial days or calculate a growth percentage from differently sized cumulative windows. Historical cumulative snapshots may be charted as **reported cumulative totals**, with their period ends and observation dates explicit. Never interpolate missing visits. Keep metric units separate, label stale values, and show unavailable data as gaps. CTR changes use percentage points; a zero denominator has no meaningful percentage growth. Average position is query-mix dependent, not a universal rank.

Every actual scan's completion update must include a private chart/report link and 2–4 concise insights: what changed, reporting limits, promising queries/pages and one evidence-based next action. This is an explicit exception to the previous silence preference for unchanged metrics; say “no new reported clicks” when supported. A failed refresh still produces an access-status snapshot and a labeled last-known chart, never a false zero. Reporting failure must not stop normal content work. Store clicks are not installs and Search Console clicks are not unique people or guaranteed independent visitors.
