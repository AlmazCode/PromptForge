# JavaScript checklist

Source locations for the current implementation. Responsibility: project author. Scope deviations are disclosed in README.

| Requirement / feature | Source file |
| --- | --- |
| 16-object catalog with meaningful properties | [js/data.js](js/data.js) |
| Task-specific inputs, requirements and examples | [js/exercises.js](js/exercises.js) |
| Arithmetic and weighted calculation | [js/logic.js](js/logic.js) |
| Array traversal and best-result aggregation | [js/logic.js](js/logic.js) |
| Reusable function calling another; progress tiers | [js/logic.js](js/logic.js) |
| Filters, strict comparisons, logical operators and switch | [js/logic.js](js/logic.js) |
| Random recommendation helper; guided routes use ordered recommendations | [js/logic.js](js/logic.js), [js/training.js](js/training.js) |
| Learning routes, mastery and next-step recommendations | [js/training.js](js/training.js), [js/training-ui.js](js/training-ui.js) |
| Saved-attempt comparison and safe Unicode text differences | [js/comparison.js](js/comparison.js), [js/training.js](js/training.js) |
| Password regular expressions | [js/logic.js](js/logic.js) |
| Four-field/cross-field validation | [js/logic.js](js/logic.js) |
| DOM creation, textContent and attributes | [js/ui.js](js/ui.js) |
| classList and accessible messages | [js/ui.js](js/ui.js) |
| Reusable list renderer and empty states | [js/ui.js](js/ui.js) |
| Field errors and first-invalid focus | [js/ui.js](js/ui.js) |
| DOM removal and confirmation | [js/ui.js](js/ui.js) |
| Search/filter events | [js/catalog.js](js/catalog.js) |
| Task counters, autosave and history | [js/task.js](js/task.js) |
| submit event and AI-check flow | [js/task.js](js/task.js) |
| Authentication and Show/Hide Password | [js/auth.js](js/auth.js) |
| Local SVG icons and accessible password requirement states | [js/icons.js](js/icons.js), [js/auth.js](js/auth.js), [src/icons/](src/icons/) |
| Plan selection/review/confirmation | [js/subscription.js](js/subscription.js) |
| History sorting and confirmed removal | [js/solutions.js](js/solutions.js) |
| Community ranking, opt-in participation and pagination | [js/leaderboard.js](js/leaderboard.js), [server/leaderboard.js](server/leaderboard.js), [server/app.js](server/app.js) |
| Personal progress, streaks, weekly goals and real point gains | [js/progress.js](js/progress.js), [js/motivation.js](js/motivation.js), [js/motivation-ui.js](js/motivation-ui.js) |
| Profile/statistics/achievements | [js/profile.js](js/profile.js) |
| Full-screen settings, section navigation, drafts and keyboard closing | [js/settings.js](js/settings.js), [styles/site.css](styles/site.css) |
| Email/password changes, current-password validation and session revocation | [js/settings.js](js/settings.js), [server/app.js](server/app.js) |
| Light/dark/system theme, pre-paint application and tab synchronization | [js/theme.js](js/theme.js), [styles/site.css](styles/site.css) |
| Avatar preview, validation, upload/removal and persistent private photos | [js/avatar.js](js/avatar.js), [server/avatar.js](server/avatar.js), [server/app.js](server/app.js), [server/store.js](server/store.js) |
| Feedback validation/counter/summary | [js/guide.js](js/guide.js) |
| EN/RU/KZ, browser preference, saved language and accessible switch | [js/i18n.js](js/i18n.js) |
| Interface and exercise translations | [js/locales/messages.js](js/locales/messages.js), [js/locales/redesign.js](js/locales/redesign.js), [js/locales/tasks.js](js/locales/tasks.js), [js/locales/training.js](js/locales/training.js), [js/locales/usability.js](js/locales/usability.js), [js/locales/competition.js](js/locales/competition.js), [js/locales/settings.js](js/locales/settings.js) |
| Shared API client and sessions | [js/main.js](js/main.js) |
| Responsive navigation, keyboard/focus handling and disclosure links | [js/main.js](js/main.js) |
| Atomic reservations/concurrency guard | [server/store.js](server/store.js) |
| Failed-check refund | [server/store.js](server/store.js) |
| Server-only key and structured Responses API | [server/openai.js](server/openai.js) |
| Authentication/data/subscription enforcement | [server/app.js](server/app.js) |

Browser modules load through the deferred module script `js/main.js` on every page. The small classic script `js/theme.js` runs before styles to apply the saved appearance before paint. Sources use strict mode. Runtime code contains no jQuery, frontend framework, `var`, loose equality, inline handlers, `document.write`, `eval`, `innerHTML`, generated CSS rules or `element.style`.

Verification: 31 unit/integration tests; twenty-one browser scenarios, including EN/RU/KZ on all ten pages and preserved form/draft state. Training checks cover route selection/filtering, mastery boundaries/deletion, saved comparisons, text safety and allowance preservation. The redesign checks also cover mobile navigation, narrow/short screens, guest-draft migration, optional-field validation and direct disclosure links. First-visit checks cover direct exercise entry, authentication return/focus, revision/next-exercise actions, empty states, draft links, search recovery and checkout cancellation. Competition checks cover participation/privacy, shared places, pagination, calendar goals, point gains and migration of existing accounts. Avatar checks cover selection/cancellation, invalid images, retry, persistence, private access, fallbacks, removal, preserved profile edits and translated responsive UI. Settings checks cover full-screen navigation, unsaved edits, email/password validation, session invalidation, concurrent changes, throttling and theme persistence/system changes across pages, languages and screen sizes. Browser evidence uses a labeled AI fixture. The test suite does not use the local API key or exercise live OpenAI connectivity.

Submission work remaining: verify actual midterm baseline, agree documented scope/AI-policy deviations, retain actual commit history, and create reviewed milestone tags.
