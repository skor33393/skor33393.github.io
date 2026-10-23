# Pelvic Gym journal

Production: https://bestme.mobi/pelvic_gym/

This is a static English-language resource library for Pelvic Gym for iPhone, App Store ID `6478076577`. It is deployed by the existing GitHub Pages repository `skor33393/skor33393.github.io` on `master`. Preserve the root `CNAME` (`bestme.mobi`), legal pages and other app content.

## Editing and validation

- `_pelvic_gym/content/*.json`: article source, metadata, FAQs, source citations and related links.
- `_pelvic_gym/build.py`: standard-library Python static generator and shared page templates.
- `pelvic_gym/assets/site.css`: responsive styles.
- `pelvic_gym/assets/site.js`: local article search/filter, print control, progress indicator, and consent-gated Analytics events.
- `pelvic_gym/assets/analytics.js`: Google tag loading, consent, withdrawal and URL minimization.
- `pelvic_gym/`: generated HTML and optimized production assets; commit these for GitHub Pages.
- `_pelvic_gym/`: source and maintenance documentation, excluded by GitHub Pages' standard Jekyll handling of underscore-prefixed directories.

Run:

```sh
python3 _pelvic_gym/build.py
python3 _pelvic_gym/tools/validate.py
node --check pelvic_gym/assets/site.js
node --check pelvic_gym/assets/analytics.js
node _pelvic_gym/tools/test-analytics.cjs
```

Build before committing content/template changes. Add new article slugs to `ORDER` in the generator. Keep categories consistent with `CATEGORIES`. Update publication/modification dates only for actual publication or material edits. The initial content date is October 24, 2026 (Dubai).

The validator checks generated page counts, internal links and anchors, canonical URLs, titles, descriptions, one H1, JSON-LD, image attributes, App Store destinations and sitemap consistency. Browser-check homepage search/filters, a representative long article, category pages and 390px layouts before publication.

## Deployment

Inspect changes and commit only production pages/assets, reusable tooling and source. Push the reviewed commit to the existing Pages publishing branch, `master`, without force-pushing. If the remote advanced, fetch and integrate its changes before pushing. Wait for the GitHub Pages deployment to complete, then verify live responses for all sitemap URLs and the new asset paths.

No credentials are stored in this repository. Use the already-configured `github-skor33393` SSH host alias. Do not add private API keys, access tokens, machine paths, temporary QA files or generated screenshots to commits.

## Editorial standards

Each article answers one distinct search intent and includes a short answer, useful next steps, primary-source citations, related reading and an appropriate app link. The publisher is the app developer; no clinical authorship or review is claimed. Pain, tension, postsurgical restrictions and emptying problems must not be presented as reasons to intensify strengthening. Distinguish emergency from routine care. Avoid fixed outcome guarantees and unverified app features.

App Store badges are Apple's official unaltered artwork. The lifestyle image is editorial artwork created for this journal; it is not an exercise demonstration or testimonial. The icon comes from the user's Pelvic Gym assets.

## Search and measurement

See [SEO strategy and competitor observations](SEO-STRATEGY.md) and [analytics options and activation](ANALYTICS.md). Google Analytics is configured for consenting visitors using the journal web stream in the existing Pelvic Gym property. See ANALYTICS.md for identifiers, consent behavior and reports. Search Console verification is separate and remains outstanding. App Store clicks must not be reported as installations.
