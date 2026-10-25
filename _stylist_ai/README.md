# Stylist AI journal

Production: https://bestme.mobi/stylist_ai/blog/

Run `python3 _stylist_ai/build.py` from the repository root. Article sources are individual JSON objects in `content/`; the current example documents required fields. Generated HTML stays in `stylist_ai/blog/` for GitHub Pages. Shared brand assets are reused from the existing landing page. Validate with `python3 _growth/validate.py` and `node _stylist_ai/test-analytics.cjs`.

The daily workflow is in `_growth/RUNBOOK.md`. New articles automatically appear newest first and enter the journal sitemap; the shared root sitemap retains Pelvic Gym. Publication, modification and source-check dates are explicit. Preserve the existing `/stylist_ai/` landing page and its campaign versions.

Analytics uses the existing Stylist AI web stream, public measurement ID `G-W5SLGWMJ48`, only after opt-in. Journal cookies use the `sj` prefix and `/stylist_ai/blog/` path; consent is separate from Pelvic Gym. Events are `app_store_click` and `article_read_75`, with article slug and CTA placement. Filter GA reports to paths beginning `/stylist_ai/blog/`. A store click is not an install; UTMs are descriptive labels, not validated Apple campaign attribution. Localhost QA never loads Google Analytics.
