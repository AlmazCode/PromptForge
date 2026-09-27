# Bootstrap migration for index, tasks, and task

| Removed from these pages | Bootstrap replacement |
| --- | --- |
| `hero-layout`, `features-grid`, `how-layout`, `task-grid`, `task-layout` CSS grids | `.row`, `.col-12`, `.col-md-6`, `.col-lg-*`, `.col-xl-*` |
| `header-container` and checkbox navigation rules | `.navbar`, `.navbar-expand-lg`, `.collapse`, `.navbar-toggler` |
| Custom card, panel, and sidebar box styling | `.card`, `.card-header`, `.card-body`, `.p-3`, `.shadow-sm` |
| Custom button styling | `.btn`, `.btn-primary`, `.btn-outline-light`, `.btn-sm`, `.btn-lg` |
| Custom search and editor control styling | `.input-group`, `.form-control` |
| Custom layout spacing and alignment rules | `.g-3`, `.g-4`, `.gap-2`, `.mb-*`, `.py-*`, `.d-flex`, `.align-items-center` |

The three migrated pages no longer load `main.css`, `student-a.css`, or `student-c.css`. Those files remain for the team's other pages. `bootstrap-pages.css` is the small color and detail correction layer for the three migrated pages.
