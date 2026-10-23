# Pelvic Gym journal: Google Analytics

Configured October 24, 2026 for https://bestme.mobi/pelvic_gym/.

## Account and stream

- Analytics account: `187508736` (Default Account for Firebase).
- Existing Pelvic Gym property: `435583193` (`pelvic-gym-5adab`).
- Journal web stream: `16191980837` (Pelvic Gym Journal - bestme.mobi/pelvic_gym).
- Public Google tag measurement ID: `G-GYLTHF349T`.
- Firebase web app: `1:352949754468:web:122dc7cab4cbd7e80c9d71`.
- Existing iPhone stream: `7821919839`; unchanged by this integration.

[Open Google Analytics](https://analytics.google.com/analytics/web/#/a187508736p435583193/reports/intelligenthome) · [Web stream settings](https://analytics.google.com/analytics/web/#/a187508736p435583193/admin/streams/table/16191980837)

The existing personal Google Cloud sign-in could provision a web stream through Firebase Management. A new Analytics account, billing service, API secret, or Firebase SDK was not needed. The website remains on GitHub Pages and loads only the Google tag after consent. No credentials are committed.

## What is measured

| Event | Meaning | Parameters / reporting |
|---|---|---|
| `page_view` | A journal page viewed after analytics consent | Standard page path/title, referrer, acquisition and device fields |
| `app_store_click` | A click on an App Store badge | `article_slug`, `cta_placement`; marked as a key event, once per session, without a monetary value |
| `article_read_75` | About 75% of an article has entered the viewport | `article_slug`; once per page load after consent; a scroll indicator, not proof of reading |

Enhanced measurement is off for this web stream. Search terms, form interactions, automatic outbound clicks and duplicate scroll events are not enabled. Google may still collect normal automatic events such as session starts and user engagement.

The property also contains app traffic. In website reports or Explorations, use **Stream ID = 16191980837**, the journal stream name, or **Platform = web**. Do not report the property's combined app-plus-web user count as journal visitors.

## Where to look

1. **Realtime:** confirm visits and events from the last 30 minutes. Test activity is visible here too.
2. **Pages and screens:** compare page views and active users by page path or title, filtered to the journal stream.
3. **Traffic acquisition:** compare search, referrals and campaign sources for web sessions.
4. **Events / key events:** inspect `app_store_click` and its session key-event rate. Raw event counts include repeat clicks; the key event is counted once per session.
5. **Explorations:** use event name, page path, Article slug and CTA placement to compare article-to-store behavior. Custom dimensions and standard reports take time to populate and are not retroactive to their registration.

An App Store click is not an installation. Having both streams in one property does not automatically connect an anonymous website browser to a later iPhone installation. Real Apple campaign links are still needed for Apple's campaign attribution; generic UTM labels alone do not provide it.

## Consent and data minimization

`pelvic_gym/assets/analytics.js` implements basic consent mode. No Google tag loads and no analytics events are sent before opt-in or after a saved rejection. A footer **Privacy choices** button reopens the choice. Withdrawal disables tracking, removes journal cookies and reloads the page to unload the tag. A changed choice is respected in other open tabs.

- Choice stored for up to 180 days in `pelvic_journal_analytics_v1` in localStorage.
- Analytics cookies use the `pgj` prefix, `/pelvic_gym/` path, a 180-day expiration and no automatic lifetime extension.
- Advertising consent stays denied. Google Signals and advertising personalization are disabled in the journal tag.
- Page URLs omit query strings and fragments. External referrers are reduced to their origins. Three validated campaign labels (`utm_source`, `utm_medium`, `utm_campaign`) are passed separately.
- Article search text and arbitrary query parameters are never intentionally sent. Public page titles and paths still reveal the article topic; this is disclosed in the privacy notice.
- Localhost previews do not load the Google tag, even if the local consent button is clicked.
- Visitors who decline, block Analytics or disable JavaScript are not counted. Figures therefore describe measured visitors, not every person who opened the site.

The [website privacy notice](https://bestme.mobi/pelvic_gym/privacy/) describes collection, choices and contact details. Property-wide app settings were not changed.

## Maintenance and validation

Run `node _pelvic_gym/tools/test-analytics.cjs`, `node --check pelvic_gym/assets/analytics.js`, `node --check pelvic_gym/assets/site.js`, then rebuild and run the HTML validator. Browser-check decline, opt-in, a repeat visit, withdrawal, mobile layout, and a real page view plus App Store click in Realtime after deployment. Do not simulate installations or purchases to verify website events.

Future changes to tracking require matching privacy text. Keep the consent script before `site.js` in the shared template. Google Analytics measurement IDs are public identifiers; access tokens and API secrets must never be added to frontend code.

Search Console is separate and is not configured by this integration. Verify ownership there and submit https://bestme.mobi/pelvic_gym/sitemap.xml to inspect Google indexing and search queries.

References: [Google consent mode](https://developers.google.com/tag-platform/security/concepts/consent-mode), [tag configuration](https://developers.google.com/analytics/devguides/collection/ga4/reference/config), [event reporting](https://support.google.com/analytics/answer/9322688), [Apple campaign links](https://developer.apple.com/help/app-store-connect-analytics/acquisition/campaign-links).
