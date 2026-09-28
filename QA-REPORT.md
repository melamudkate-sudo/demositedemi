# Marketing support — 2026-09-28

## Catalog follow-up — uniform cards

At the user's request, removed the recommended-launch badges, Entry/Core/etc.
tiers, reference prices, added specifications/commercial roles and the header's
value ladder. Removed their data/render branches and dedicated CSS rather than
hiding them. All eight air-fryer models remain, including DK-2100, with the same
image/name/color structure and image size as the previous final three cards.
Coffee-maker and blender content, existing reference photos and navigation remain.

`qa-catalog.cjs`: PASS at 1366×768, 1440×900, 1920×1080, 390×844 and 320×568.
Checks all 13 models across three categories, equal card/image dimensions,
absence of removed content, arrows, End-key navigation, all color choices
including the four-option blender, back navigation and no page overflow or JS
errors. First/last desktop cards and mobile composition visually inspected.
Build and Pages-ready folder refreshed after the change.

## Marketing implementation

Repository: `melamudkate-sudo/demositedemi`, branch `distributor-content-update`.
Started from current `main` at `f29e278ea57365d2dab5d470abd3c8bc8d7bf9c0`.

- Added one marketing-support chapter after Proven Market Demand. Existing chapters
  now run 01–14; the app keeps its independent nine-slide pagination.
- Brand slide figures: 11B+ annual views, 192K+ content assets, 2K+ creator
  collaborations, 21M+ annual post clicks. No invented reporting year.
- Exactly four explicitly requested video placeholders, in 9:16 Reels format.
  Per-video views/likes match the user's September 28 figures. No external embeds
  or unapproved videos were added. Artwork comes from existing site assets.
- Arrow, pagination, keyboard and touch controls; fixed frame geometry, transition
  cancellation and reduced-motion support. Future video files use local paths.
- Every build refreshes the local GitHub-ready export as well as tracked `dist/`.
  Export contains all 36 runtime files, verified byte-for-byte against `dist/`.

## Current verification

- `npm run build` and `git diff --check`: PASS.
- Browser regression suite: PASS at 1366×768, 1440×900, 1920×1080, 1280×640 and
  390×844. Catalogue, market tabs, all app slides, navigation and terms pass;
  no JavaScript errors or failed HTTP assets.
- Marketing suite: PASS at those sizes plus 768×1024 and 320×568. All four
  supplied metric pairs match; the frame stays 9:16 and section height does not
  change when navigating. Desktop section heights: 665, 724, 724 and 566px
  respectively, all within the viewport minus the navigation bar.
- The same marketing checks pass on `/dist/`, exercising repository-subpath
  relative asset URLs as used by GitHub Pages.
- Heading/refinement suite: PASS, including typography parity and production
  dialog keyboard, dismissal and focus restoration.
- Content/motion suite: PASS at seven desktop/tablet/mobile sizes, including
  all 14 menu entries, section entrances and runtime reduced motion.
- Desktop and mobile screenshots inspected, including all four card states.
- Follow-up composition refinement: widened the copy column, reduced the actual
  gap to the Reels card and added hero-inspired horizontal lines, a perspective
  grid and warm ambient glow. Re-ran all seven marketing viewport checks; heights,
  9:16 ratio and stable controls remain unchanged, with no horizontal overflow.

Real video playback and Safari were not tested; approved video files are still
pending by request. The existing four launch-kit choices are not present in this
current main implementation, so no unrelated launch-kit controls were added.
The form remains an email-draft workflow. Main and the live Pages deployment were
not modified for this update; the recoverable work is on the working branch.

---

# Production corrections — 2026-09-22 (previous baseline)

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
