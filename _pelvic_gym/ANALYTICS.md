# Analytics options for Pelvic Gym

Prepared October 24, 2026. No analytics service is installed or collecting visitor data on this journal yet. The owner requested recommendations and confirmed there is no existing account. GitHub repository traffic is not GitHub Pages visitor analytics.

## Recommended setup

Use **Google Search Console plus Plausible** for a simple view of discovery, reading and App Store clicks. Use **Google Search Console plus GA4** if avoiding a paid analytics subscription matters more than simplicity. Use **Cloudflare Web Analytics** if the main need is page views and site performance, with fewer conversion-analysis features.

| Service | What it answers | Cost model / tradeoff | Needed to connect |
|---|---|---|---|
| Google Search Console | Which Google searches show the pages? Impressions, clicks, CTR, indexing and average position | Free; does not count all website visits or app installs | Owner verification for the domain or URL prefix |
| Plausible | Visitors, page views, referrers, top pages and app-click conversions in a compact dashboard | Paid hosted service; cookieless analytics; pricing depends on usage/plan | Account, site record for bestme.mobi and its supplied script |
| Google Analytics 4 | Page views, users, acquisition, engagement and custom events/funnels | Standard service is free; more configuration and consent/privacy handling | Account/property, web data stream, measurement ID and consent setup |
| Cloudflare Web Analytics | Page views, visits, referrers and performance | Available on all plans; a simpler option for traffic/performance rather than the article-to-app funnel | Web Analytics site record and beacon token; no hosting migration required |
| App Store Connect campaign links | Downloads and subsequent app outcomes attributed by Apple to campaign links | Existing developer account; minimum reporting thresholds apply | Official campaign links generated for this app in App Store Connect |

Sources: [Search Console performance](https://support.google.com/webmasters/answer/7576553?hl=en), [Plausible](https://plausible.io/), [Plausible outbound clicks](https://plausible.io/docs/outbound-link-click-tracking), [GA4 setup](https://support.google.com/analytics/answer/9304153), [GA4 outbound clicks](https://support.google.com/analytics/answer/13566436?hl=en), [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/), [Cloudflare setup outside its proxy](https://developers.cloudflare.com/web-analytics/get-started/), [Apple campaign links](https://developer.apple.com/help/app-store-connect-analytics/acquisition/campaign-links).

## Practical dashboard

Keep these as separate measurements:

1. **Google visibility:** impressions and clicks, grouped by search query and landing page in Search Console.
2. **Reading:** visitors/page views by article, referral source and device in the website analytics tool.
3. **Intent to download:** unique visitors or sessions with `app_store_click`, grouped by article and CTA placement.
4. **Actual acquisition:** App Store campaign downloads, then trials/subscriptions in the app analytics systems where supported.

For a page conversion rate, divide visitors who clicked an app CTA by visitors to that page over the same period. Do not divide all repeat click events by unique visitors and label that a visitor conversion rate. A page view is not a unique person, and an outbound click is not an installation.

The site currently has UTM labels on app links for readable campaign context. Generic UTM parameters alone do **not** establish App Store install attribution. Obtain real Apple campaign links, including Apple's provider and campaign parameters, before promising article-level install reporting. Keep traffic thresholds and reporting delays in mind.

## Search Console setup

1. Add `https://bestme.mobi/pelvic_gym/` as a URL-prefix property, or add the whole `bestme.mobi` domain property if domain-wide reporting is preferred.
2. Complete ownership verification with the method Google supplies (HTML file/tag for URL prefix, or DNS for a domain property). Do not invent a verification token.
3. Submit `https://bestme.mobi/pelvic_gym/sitemap.xml`.
4. Inspect the homepage, one category page and representative articles using URL Inspection; request indexing where appropriate.
5. Review index coverage and impressions after Google has crawled. A sitemap, valid markup and an indexing request do not guarantee indexing or rankings.

## Activation notes

The script in `pelvic_gym/assets/site.js` dispatches local `pelvic:analytics` browser events for `app_store_click` with `page` and `placement`, and `article_read_75` when 75% of the article's height has passed into view. The latter is a scroll indicator, not proof that someone read or understood the article. Events are not stored or transmitted while no provider exists.

### Plausible

Add the exact current site-specific snippet supplied by the Plausible dashboard to `page_shell()` in `build.py`, before the journal script. Keep its queue initialization. The existing hook forwards events through `window.plausible` when available. Create custom event goals `app_store_click` and, if useful, `article_read_75`. Use `page` and `placement` as event properties with a plan supporting those features. Outbound link measurement may also be enabled in Plausible, but do not add the automatic outbound event to the custom CTA event and report the sum as conversions: they describe the same click.

### GA4

Create a web stream and use Google's supplied tag, with analytics consent configured for the audience and only the required measurement enabled. The existing hook forwards custom events only when `window.pelvicAnalyticsConsent === true` and `gtag` is available. The consent manager must set and revoke that flag along with the tag's consent state. Do not simply set it to true on page load. Register `page` and `placement` as event-scoped custom dimensions; mark `app_store_click` as a key event. Auto-collected outbound clicks and the custom CTA event should not be double-counted. Avoid advertising audiences or sending personal health details, form inputs or user symptom histories.

### Cloudflare

Use the beacon script and token from its dashboard in the common template. This works with GitHub Pages via manual installation. Do not assume the current custom-event hooks are reported by Cloudflare; choose it for page and performance measurement.

For every provider: update the website privacy page before deployment, inspect consent behavior where applicable, verify one page view and one CTA click in the service, check that the app navigation still works, and exclude developer/test traffic from the main reporting view where the provider supports it. Only then describe analytics as active.
