# Final Production Pass — validation record

Base: current `main` at `613054f437b0d29f768338ccd134ce61e8f450bd` (V13).

## Implemented

- Section sequence 01–14, retained anchors, manufacturing photographs at 07 and production capacity at 10.
- Rounded glass More menu; removed Close safely; keyboard wrap, Home/End, Escape, outside click and item selection.
- Balanced five-node commercial route and staged activation.
- Manufacturing loop: 500 ms movement + 500 ms dwell, hover continues, focus/drag/visibility/reduced-motion pauses.
- All seven supplied PNGs copied unchanged; original overview retained; no synthetic device frames.
- Nine app compositions, dedicated red side controls, 6-second timer, full-image contain sizing and inactive-slide inert state.
- Unified cool pearl, graphite, red, champagne and glass; Safari backdrop-filter prefixes.
- App and hero offscreen motion management; race-safe transition settlement.
- GitHub Pages workflow and pull-request build check; relative assets; generated dist and OS metadata excluded from Git.

## Completed browser checks

Chromium: 1920×1080, 1440×900, 1366×768, 1280×720, 1280×640,
768×1024, 390×844 and 320×568. All 14 sections and nine app slides passed
geometry checks; zero uncaught JavaScript errors and zero HTTP asset failures.
Menu keyboard/outside/item behavior, catalogue categories/swatches, four market tabs,
app navigation/drag/autoplay/loop/focus/reduced motion, manufacturing loop, terms
and email-draft form passed. Lifecycle checks passed hidden-tab pause/resume,
rapid reversal, captured drag release and offscreen 3D handling.

## Final refinements

- Content-led section heights; full-screen opening and contact closing composition.
- Uniform Montserrat heading scale for 02–13; matching larger 01/14 titles.
- Upper-right slide counter; simpler overlapping slide layers, no pointer tracking.
- White section 08 and cool pearl section 09 with a layered scroll entrance.
- Removed animated Distributor background; clean caption rows and restrained hero motifs.
- Enlarged manufacturing metrics and corrected heading width.
- Production film modal is a deliberate placeholder until an approved source is supplied.
- Contact form has a partnership desk, two-row fields and info@demiand.com.
- More level, less cropped initial 3D camera and softer shadow.
- Final right-aligned subtitles share the title's top edge; new approved subtitle copy at 03/12.

The full eight-viewport run preceded only the final subtitle alignment. That last
revision was built and checked separately with the focused heading/modal/layout suite.

## Remaining limitations

- Native Safari/WebKit was not run; only Chromium is installed in the available browser runtime.
- Contact prepares a mailto draft; there is no backend/CRM delivery.
- Catalogue uses one reference photograph per category; swatches do not swap product photos.
- Google Fonts and model-viewer depend on external services; original GLB is approximately 19 MB.
- No GitHub push or deployment was performed.

## Resume validation

Run `npm run dev`, then `npm run test:browser` and `npm run test:lifecycle`.
Use `PLAYWRIGHT_MODULE` for an existing shared Playwright installation and `QA_URL` for a custom port.
Screenshots/results default to `/tmp/demiand-final-qa`; they are not shipped with the site.
