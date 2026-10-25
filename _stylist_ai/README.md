# Stylist AI journal

Production: https://bestme.mobi/stylist_ai/blog/

Run `python3 _stylist_ai/build.py` from the repository root. Article sources are individual JSON objects in `content/`; the current example documents required fields. Generated HTML stays in `stylist_ai/blog/` for GitHub Pages. Shared brand assets are reused from the existing landing page. Validate with `python3 _growth/validate.py` and `node _stylist_ai/test-analytics.cjs`.

The daily workflow is in `_growth/RUNBOOK.md`. New articles automatically appear newest first and enter the journal sitemap; the shared root sitemap retains Pelvic Gym. Publication, modification and source-check dates are explicit. Preserve the existing `/stylist_ai/` landing page and its campaign versions.

Analytics uses the existing Stylist AI web stream, public measurement ID `G-W5SLGWMJ48`, only after opt-in. Journal cookies use the `sj` prefix and `/stylist_ai/blog/` path; consent is separate from Pelvic Gym. Events are `app_store_click` and `article_read_75`, with article slug and CTA placement. Filter GA reports to paths beginning `/stylist_ai/blog/`. A store click is not an install; UTMs are descriptive labels, not validated Apple campaign attribution. Localhost QA never loads Google Analytics.

Public posts must not link or mention Reddit/Quora discussions; they are internal topic inspiration only. Keep original question URLs in `_growth/runs/`. Retain authoritative factual/clinical references. Create relevant original illustrations for new articles. Daily target: five distinct articles per app at 22:00 Asia/Dubai.

Optional `illustration` fields are `src`, `alt`, `width`, and `height`. The cover appears on the article, its card, and in social/Article metadata. New images are compressed WebP; generation prompts are recorded in `illustration-prompts.json`. Check `_growth/check_capacity.py` before adding images. At 800 MB projected working files or Git objects, omit further illustrations and continue text publication. Keep original PNG masters outside the repository.

Articles may specify a `related` array of existing article slugs. Use two genuinely useful next reads; the generator validates these links and displays their cards at the end.

Active advertising protection (2026-10-26): do not edit `stylist_ai/index.html`, `stylist_ai/landing/`, or shared landing assets. Changes here must stay inside the blog and its own assets.
