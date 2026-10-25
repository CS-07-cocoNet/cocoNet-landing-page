# cocoNet Guided Landing Page Template

A responsive HTML/CSS/JavaScript starter with the shared navigation, dark mode, and footer. The main content area contains commented section examples so the team knows exactly where to add work.

## Files
- `index.html` — navigation, commented section insertion points, footer.
- `style.css` — global color tokens, typography, responsive rules, shared section helpers, footer.
- `script.js` — mobile navigation, light/dark theme, current copyright year.
- `TEAM-GUIDE.md` — collaboration rules and section ownership checklist.

## Run it
Open `index.html` in a browser, or open the folder in VS Code and run it with Live Server. No framework or build step is required.

## Add a section
1. Open `index.html`.
2. Find the matching `SECTION START` comment inside `<main id="main-content">`.
3. Uncomment the example `<section>` block (remove the opening `<!--` and closing `-->` around that example only).
4. Replace the example text with your real content.
5. Keep the section `id` exactly the same as its navigation link.
6. Add section-specific CSS at the bottom of `style.css` under `TEAM SECTION STYLES`.

Example:
```html
<section id="overview" class="content-section">
  <div class="section-container">
    <p class="section-eyebrow">ABOUT COCONET</p>
    <h1>Project overview</h1>
    <p>Introduce the problem and intended users.</p>
  </div>
</section>
```

## Important
- Do not add a second `<html>`, `<head>`, `<body>`, header, or footer when contributing a section.
- Team members should contribute only their `<section>...</section>` markup and any uniquely named CSS classes.
- Keep all section IDs unique.
- Every `href="#something"` should point to a real element with `id="something"` or be replaced with a real URL.
- Replace placeholder footer links before submission.
- Avoid fixed widths such as `width: 1200px`; use responsive max-widths and grid/flex.
- Test the page at 320px, 360px, 390px, 768px, 1024px, and 1440px.
