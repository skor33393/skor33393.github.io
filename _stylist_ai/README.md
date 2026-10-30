# Stylist AI journal

Production: https://bestme.mobi/stylist_ai/blog/

Run `python3 _stylist_ai/build.py` from the repository root. Article sources are individual JSON objects in `content/`; the current example documents required fields. Generated HTML stays in `stylist_ai/blog/` for GitHub Pages. Shared brand assets are reused from the existing landing page. Validate with `python3 _growth/validate.py` and `node _stylist_ai/test-analytics.cjs`.

The daily workflow is in `_growth/RUNBOOK.md`. New articles automatically appear newest first and enter the journal sitemap; the shared root sitemap retains Pelvic Gym. Publication, modification and source-check dates are explicit. Preserve the existing `/stylist_ai/` landing page and its campaign versions.

Analytics uses the existing Stylist AI web stream, public measurement ID `G-W5SLGWMJ48`, only after opt-in. Journal cookies use the `sj` prefix and `/stylist_ai/blog/` path; consent is separate from Pelvic Gym. Events are `app_store_click` and `article_read_75`, with article slug and CTA placement. Filter GA reports to paths beginning `/stylist_ai/blog/`. A store click is not an install; UTMs are descriptive labels, not validated Apple campaign attribution. Localhost QA never loads Google Analytics.

Public posts must not link or mention Reddit/Quora discussions; they are internal topic inspiration only. Keep original question URLs in `_growth/runs/`. Retain authoritative factual/clinical references. Create relevant original illustrations for new articles. Daily target: five distinct articles per app at 22:00 Asia/Dubai.

Optional `illustration` fields are `src`, `alt`, `width`, and `height`. The cover appears on the article, its card, and in social/Article metadata. New images are compressed WebP; generation prompts are recorded in `illustration-prompts.json`. Check `_growth/check_capacity.py` before adding images. At 800 MB projected working files or Git objects, omit further illustrations and continue text publication. Keep original PNG masters outside the repository.

Articles may specify a `related` array of existing article slugs. Use two genuinely useful next reads; the generator validates these links and displays their cards at the end.

Active advertising protection (2026-10-26): do not edit `stylist_ai/index.html`, `stylist_ai/landing/`, or shared landing assets. Changes here must stay inside the blog and its own assets.

## Local city guides (2026-10-30)

Thirty US/Canada guides plus Singapore (English and Simplified Chinese), Seoul (Korean), and Tokyo (Japanese) use `kind: city` content and `city_pages.py`. They remain indexable and in the sitemap, but must not appear in the regular journal cards, homepage, navigation or its ItemList. The city directory is linked only within the city-guide collection. This follows the user's explicit preference; do not add a promotional city-directory panel to the journal.

Lead with the generated "Find your best colors" visual, then Apple's official unmodified App Store badge, then the article title and introductory app flow. The entire leading banner (image, whitespace, badge and caption) is one accessible App Store link to the correct country storefront, retaining the `city_hero` consent-gated click event; do not nest links inside it. Do not restore the top "Browse all city guides" link or add a "Color Passport" screen heading. The interactive introduction previews the app; it does not analyze a visitor's photo or transmit their selection. Preserve the native Safari Smart App Banner (`app-id=6739435502`) on every page. Its visible presentation is controlled by Safari.

Use the American campaign model for US/Canada guides and the Asian campaign model for Singapore (both languages), Korea and Japan, per the user’s 2026-10-30 correction. The images are generated with Higgsfield Nano Banana 2.1 and compressed in blog-only `assets/city-guides/`. Masters and full research are outside the publication checkout in `../seo-city-guides/2026-10-30/`. Do not commit masters. Keep source dates, appointment locations, currencies, per-person versus total prices and availability limitations accurate. Never present us as a local studio or invent ratings, keyword volume or a guaranteed position. Hreflang connects equivalent translations only (the two Singapore versions); distinct cities are not translations.

Run `python3 _stylist_ai/test-city-guides.py` in addition to the normal validators after changes. This checks journal exclusion, leading visual, Apple badge, Smart App Banner, locale relationships and consent controls. Keep localized page copy and visuals in the same language. Ordinary daily article targets are unchanged.
