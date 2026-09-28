# Bootstrap CSS consolidation

| Removed pattern | Current replacement |
| --- | --- |
| Multiple page-specific stylesheets | One shared `styles/site.css` after Bootstrap |
| Different header and navigation rules | Shared `.site-nav`, `.navbar`, `.navbar-expand-lg`, `.collapse`, `.navbar-toggler` |
| Conflicting button declarations | Bootstrap `.btn` variants with one shared project override |
| Separate custom layout systems | Bootstrap `.container`, `.row`, responsive `.col-*`, spacing and flex utilities |

Every page now loads Bootstrap 5.3.8 followed by `styles/site.css`. The previous `main.css`, `student-a.css`, `student-b.css`, `student-c.css`, `bootstrap-pages.css`, and `emil-bootstrap.css` files were removed after their required visual rules were consolidated.
