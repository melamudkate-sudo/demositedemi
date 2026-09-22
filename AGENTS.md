# Canonical website

This is the only active website source. Make all subsequent website edits here.
Preserve existing marketing copy. Keep layout rules in their owning stylesheet;
replace old rules instead of stacking override files.

- `assets/css/design.css`: tokens, shared UI and baseline sections.
- `assets/css/feature-design.css`: hero, market tabs, SmartCook and global network.
- `assets/css/commercial-design.css`: categories, demand, quality and terms.
- `assets/css/navigation.css`: navigation and its responsive states.
- `assets/js/script.js`: interactions, motion and email draft form.
- `dist/`: tracked build output; regenerate with `npm run build`, never edit manually.
- Production: `melamudkate-sudo/demositedemi`, GitHub Pages from `main` at `/`.
- Thirteen top-level sections; Cooking Performance is 06, Ownership + After-Sales is 10.
- Keep the app story’s independent 01–09 pagination unchanged.

Run `npm run build` after changes. Test responsive composition, menu keyboard
behavior and all four launch-kit choices. Do not upload unrelated project sources,
reference screenshots, archives or credentials to this repository.
