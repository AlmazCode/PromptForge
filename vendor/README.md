# Local interface assets

These assets let the site render without internet access, including the fallback for the jQuery CDN link.

- Bootstrap 5.3.8 CSS from `https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css`; MIT license in `bootstrap/LICENSE.txt`.
- jQuery 3.7.1 full minified build from `https://code.jquery.com/jquery-3.7.1.min.js`, unchanged, with its upstream license notice in the file header (MIT; `https://jquery.org/license/`). The full build includes the effects used by this assignment. SHA-256 integrity: `sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=`.
- The complete MIT license is in `jquery/LICENSE.txt`. `.gitattributes` prevents newline conversion of the jQuery build, preserving its integrity on Windows checkouts.
- Inter font weights 400–800 and Fira Code font weights 400–700, served by Google Fonts and stored locally in `fonts/`. `fonts/fonts.css` maps the nine font files to their font faces.
- Inter license copied from `https://github.com/rsms/inter/blob/master/LICENSE.txt`.
- Fira Code license copied from `https://github.com/tonsky/FiraCode/blob/master/LICENSE`.

The existing Lucide icons retain their license in `src/icons/LUCIDE-LICENSE.txt`. The Prompt Forge brand mark is the project's original SVG.
