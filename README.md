# PromptForge

Prompt engineering training platform. Static HTML + CSS site, team project (3 people).

## Structure

```
index.html          — landing page
colophon.html       — how the project is built
tasks.html          — task catalog
task.html           — single task template
register.html       — registration
login.html          — login
profile.html        — user profile
leaderboard.html    — rankings
my-solutions.html   — my solutions
how-it-works.html   — how evaluation works

styles/
  main.css          — shared styles
  student-a.css     — pages A (tasks, task)
  student-b.css     — pages B (register, login, profile)
  student-c.css     — shared workspace styles for the six non-Bootstrap pages that use them
  emil-bootstrap.css — visual system for Emil's Bootstrap pages

src/
  brand/            — original Prompt Forge SVG mark
  icon.png          — profile avatar icon (temp)
  icons/            — SVG icon sources and Lucide licence
```

## How to open

Open any `.html` file in a browser. No server needed.

## Dependencies

Emil's `leaderboard.html`, `my-solutions.html`, and `how-it-works.html` use Bootstrap 5.3.8 from jsDelivr, so they need internet access for the CDN. Other pages still use the existing project CSS. No build tools or custom JavaScript are needed for Emil's pages; Bootstrap's bundle drives their collapsed navigation.

See `bootstrap-css-removal.md` for the CSS migration mapping and `AI_LOG.md` for assistance disclosure. The Bootstrap assignment's requirement to migrate all ten pages remains team work.

The visual concepts approved for Emil's three pages are in `design/emil-redesign/`. Their styling is implemented in `styles/emil-bootstrap.css`; Bootstrap still provides the responsive structure and interactive navigation.

Emil's pages use an original SVG brand mark and inline [Lucide](https://lucide.dev/) icon contours. The Lucide source sprite and ISC licence are in `src/icons/`. Inline SVG keeps the icons visible when HTML files are opened directly from disk.
