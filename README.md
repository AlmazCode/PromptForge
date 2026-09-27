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
  bootstrap-pages.css — brand corrections for index, tasks, and task

src/
  brand/            — original Prompt Forge SVG mark
  icon.png          — profile avatar icon (temp)
  icons/            — SVG icon sources and Lucide licence
```

## How to open

Open any `.html` file in a browser. No server needed.

## Dependencies

`index.html`, `tasks.html`, and `task.html` now use Bootstrap 5.3.8 from jsDelivr, followed by `styles/bootstrap-pages.css`. They need internet access for the CDN. The search, pagination, and prompt checking interfaces are static previews until a backend is connected. Bootstrap's bundle drives the collapsed navigation.

See `bootstrap-css-removal.md` for the CSS migration mapping and `AI_LOG.md` for assistance disclosure. The Bootstrap assignment's requirement to migrate all ten pages remains team work.

The visual concepts approved for Emil's three pages are in `design/emil-redesign/`. Their styling is implemented in `styles/emil-bootstrap.css`; Bootstrap still provides the responsive structure and interactive navigation.

Emil's pages use an original SVG brand mark and inline [Lucide](https://lucide.dev/) icon contours. The Lucide source sprite and ISC licence are in `src/icons/`. Inline SVG keeps the icons visible when HTML files are opened directly from disk.
