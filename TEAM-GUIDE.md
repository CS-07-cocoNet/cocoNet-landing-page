# cocoNet Team Guide

## Shared ownership rules
To reduce Git merge conflicts, one person should own `index.html` integration. Other team members can develop their section in separate files/branches, then the integration owner pastes each section into the matching placeholder.

### Suggested section ownership
- `overview` — project overview and problem summary
- `how-it-works` — workflow / how the system works
- `disease-detection` — detection feature and prototype explanation
- `farmer-stories` — validated interview findings and farmer insights
- `team` — team profiles and responsibilities
- `early-access` — contact or call-to-action (optional)

## What each member should send to the integration owner
1. One `<section id="...">...</section>` block only.
2. CSS with section-specific class names, for example `.overview-hero` or `.team-card`.
3. Any image assets and their relative paths.
4. A short note about any JavaScript the section requires.

## Navigation rule
The navigation link and section ID must match exactly:
- `href="#overview"` → `id="overview"`
- `href="#how-it-works"` → `id="how-it-works"`
- `href="#disease-detection"` → `id="disease-detection"`
- `href="#farmer-stories"` → `id="farmer-stories"`
- `href="#team"` → `id="team"`
- `href="#early-access"` → `id="early-access"`

## Before merging
- [ ] Check the console for errors.
- [ ] Test mobile menu and dark mode.
- [ ] Check for horizontal scrolling at 320px width.
- [ ] Check that every navigation/footer anchor reaches an existing ID.
- [ ] Confirm images have descriptive `alt` text.
- [ ] Confirm claims, statistics, and farmer quotes are sourced and accurate.
