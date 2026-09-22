# Production corrections — 2026-09-22

Repository: `melamudkate-sudo/demositedemi`, branch `main`.
Starting commit: `464d4d9fa65600312e7b98014b475f5617f914c8`.

## Changes

1. Removed Commercial Model, its menu entry, dedicated styles and observer. Top-level chapters and menu now run 01–13; component numbering stays unchanged.
2. Replaced Cooking Performance photography with the four approved validation stages and 100+ proof point. Removed the carousel, clones, autoplay, associated CSS and `viewport-layout.js`.
3. Added the approved warranty and partner-support paragraphs. The <0.87% defect rate is explicitly labeled as internal statistics; ownership and support elements remain.
4. Consolidated entrance motion around the existing reveal observer and tokens, with chapter, copy and grouped-system patterns. Removed duplicate section animations and per-scroll reveal geometry scans. Preserved reduced motion, app controls/autoplay, catalogue, 3D, tabs and contact. Deferred app decoding until approach; the fixed-size Connected Ecosystem image uses native lazy loading. Corrected slide 09 spacing at 1600×900 without changing copy.
5. Added persistent content/motion and mobile-menu checks; added 1600×900 to the default browser suite and expanded refinement viewports. Fixed the More menu stacking order so primary-navigation CTA text cannot cover or intercept tablet/mobile chapter links.

## Validation

- `git diff --check`: PASS.
- `npm run check`: PASS after each correction; validates assets, anchors, interaction targets, syntax, thirteen chapter/menu pairs and independent app pagination.
- `npm run build`: PASS after each correction. Tracked `dist/` regenerated exclusively by the build script.
- `npm run test:browser`: PASS at 1366×768, 1440×900, 1600×900, 1920×1080, 768×1024, 390×844 and 320×568; also 1280×720 and 1280×640. All thirteen sections and nine app slides fit their bounds; no horizontal page overflow, uncaught JavaScript errors or HTTP asset failures.
- `npm run test:lifecycle`: PASS for hidden-tab pause/resume, rapid slide reversal, captured drag release and offscreen 3D rotation. Observed CLS below 0.006 across final local runs.
- `npm run test:refinements`: PASS for heading parity, compact desktop sections and video modal keyboard, backdrop, close and focus restoration.
- `npm run test:content-motion`: PASS; verifies chapter/menu correspondence, removed carousel hooks, cooking and warranty content, native scrolling, all chapter entrances, runtime reduced-motion switching, responsive menu keyboard focus and sequence layout at all seven requested sizes.
- Existing installed Playwright/Chromium runtime used; no dependencies installed.
- Desktop and narrow mobile screenshots of the edited sections inspected, plus catalogue, market, app, production, map, terms and contact views.

## Deployment and limits

GitHub Pages is configured to publish `/` from `main` (legacy branch deployment), verified through the GitHub API. Each correction is committed and pushed independently, and its remote SHA checked before proceeding. The final deployment is checked after the QA commit; its exact SHA and production verification are recorded in the task delivery report.

Safari/WebKit and real-device testing were not run. The production film remains the existing approved-source placeholder. The contact form prepares an email draft; no message was sent. Catalogue color swatches retain their existing behavior and reference photos. Fonts and the model-viewer component remain externally hosted.
