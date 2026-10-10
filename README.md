# PromptForge

A prompt-writing trainer with 16 original exercises, real accounts, OpenAI feedback, saved history, progress and a test subscription flow. The ten-page interface uses Bootstrap foundations and a shared responsive theme; browser functionality uses plain JavaScript modules. The Node.js server uses built-in HTTP, crypto and SQLite APIs, with no runtime npm dependencies.

## Run locally

Requires Node.js 24 or newer.

1. Copy `.env.example` to `.env` if you have not configured the server yet.
2. Set `OPENAI_API_KEY` in `.env` locally. Never put the key in browser JavaScript, HTML, URLs or Git.
3. Run `npm start` and open `http://127.0.0.1:3000`.
4. Create an account and choose an exercise.

`OPENAI_MODEL` defaults to `gpt-4.1-mini`; it can be changed to an available Responses API model supporting structured outputs. Restart after changing `.env`. Missing or invalid keys produce an explicit error; the app never substitutes invented AI scores. Registration, catalog browsing and test subscription management work without a key.

Opening HTML files directly or using a static-only server does not provide account, grading or subscription APIs. No npm installation is needed to run the app. `npm ci` installs development-only browser-test tooling.

## Interface and navigation

All ten pages share light and charcoal themes with the original PromptForge orange (`#FF6410`) for primary actions. Links and active controls use a lighter orange (`#FF914F`) in dark mode and a deeper orange (`#B94305`) in light mode. Subtle warm gradients balance the brand color with consistent spacing, typography and controls. The header links exercises, history, personal progress, the community leaderboard and the guide. The header’s Profile link opens the profile directly, without a submenu. Logout and plan settings live in the profile; the editor offers a plan link only when Free checks are exhausted. Below 1200 px, navigation opens as a dismissible sheet with keyboard focus containment, Escape support and a scrolling layout for short screens. EN/RU/KZ stays accessible in the header.

- Guests can open the first beginner exercise directly from home, alongside learning routes and a concrete before/after prompt. The introductory copy explains drafting, checking and the account requirement. Signed-in users see their workshop: allowance, an unfinished draft or next unmastered exercise, and route progress.
- Catalog starts with search and four labeled filters. Three courses are available in an optional disclosure; a route URL opens it automatically. Route selection combines with other filters; reset appears when needed and restores the whole catalog. Descriptions remain readable in full on phones.
- Tasks place the brief next to the editor on desktop and above it on phones. Source data is open on both layouts, wraps and supports keyboard scrolling. The editor explains that the assessment grades the prompt rather than executing the requested task. A phone shortcut includes this guidance. Feedback highlights the weakest criterion below 8/10 and prioritizes revision; a mastered result prioritizes the next exercise. Two saved attempts unlock comparison of scores and prompt changes.
- Authentication uses a focused, centered form; extra profile information is optional and collapsed. Validation opens hidden invalid fields. A guest check saves the draft and opens login with a registration option. Successful authentication replaces the form with one focused continuation action and preserves the task return target. Registration policy links open separately to preserve entered data.
- Profile separates personal progress, recent results, achievements and the plan comparison, with section shortcuts. Settings open as a full-screen dialog above the profile, with separate profile, account, security, appearance and privacy sections. Guests see account actions; the explicit plan link opens comparison without empty personal statistics. Checkout replaces the plan choices until completed or cancelled.
- Saved attempts and best results use tables on desktop and compact readable rows on phones. History offers direct links to unsubmitted drafts and a reset action for unmatched searches. History and progress explain how to begin before the first result; absent average/best scores use a dash. Personal progress remains separate from the community leaderboard.
- Guide keeps the process, criteria, worked example and FAQ together. Feedback is an optional disclosure with a short primary form and extra details. Feedback/privacy/rules expand automatically when linked directly.

Headings name each page's function. Content sections use spacing and dividers; enclosing cards group the task/editor workspace and plan choices. Decorative preview windows, marketing sidebars and repeated eyebrow labels have been removed. Main explanatory text uses 15–16 px type and relaxed line spacing; secondary labels are at least 13 px. Phone inputs use 16 px text and essential action buttons have at least 44 px height.

## Practice and scoring

The catalog and task workspace share `js/data.js` and `js/exercises.js`. Search, category, difficulty, status and sorting work together. Every exercise has its own input, requirements, hint and reference prompt. Invalid exercise links show a recovery path.

The server sends the exercise and submitted prompt to OpenAI's Responses API using a strict JSON schema. The model evaluates the instruction rather than executing it. Six scores and concrete feedback are validated on the server; JavaScript calculates the total. AI evaluation is approximate, can vary, and does not verify the output of executing the submitted instruction.

Weights: role 0.20, format 0.25, length 0.15, examples 0.20, tone 0.10, clarity 0.10. The illustrative worked example remains `10×0.20 + 8×0.25 + 6×0.15 + 10×0.20 + 8×0.10 + 9×0.10 = 8.60`.

A **checked** exercise has at least one saved successful evaluation. A **mastered** exercise has a best saved score of at least **8/10**. Statuses distinguish not started, draft in progress, needs revision and mastered. A later lower score preserves mastery; deleting the qualifying attempt can remove it. The mastery target is a learning guide based on approximate AI assessment.

Rank progress sums the best score per exercise, including scores below the mastery target, maximum 160. Tiers: Newcomer `[0,50)`, Practitioner `[50,100)`, Master `[100,150)`, Grandmaster `[150,160]`. The profile counts mastered exercises; history counts checked exercises; personal progress shows both. Deleting history recalculates progress and achievements. The first-step achievement requires a saved attempt; the copywriter achievement requires a mastered copywriting exercise.

## Routes and revision workshop

`js/training.js` defines three curated routes covering all 16 exercises exactly once:

- **Clear instructions:** role, audience and useful limits; four exercises.
- **Reliable data:** factual accuracy and structured answers; six exercises.
- **Systems and workflows:** constraints, handoffs and edge cases; six exercises.

Any step remains open. The suggested order appears when a route is selected and sorting is set to Recommended order. Home recommendations resume unfinished drafts first, then choose the earliest unmastered step in the most recently practised route (or the account's interest area for a first visit). Completing a route leads to another unfinished route; completing all routes offers review. Guest draft indicators use existing browser backups; account progress uses account-owned saved attempts. No new database schema or separate completion flags are needed.

`js/comparison.js` compares any earlier/later pair of saved attempts for the current exercise. It shows signed changes for the overall weighted score and all six criteria, including regressions, and uses a Unicode-aware token diff to mark removed/added text. Dates and attempt labels are localized; prompt text stays verbatim and is rendered with textContent. Language changes preserve comparison selection and editor content. Reopening an attempt selects a relevant comparison; deletion rebuilds the valid comparison choices. Identical text is explicitly identified because AI scores can vary.

Comparisons use saved data, make no evaluator request and consume no check. New evaluations continue to use one allowance unit. Runtime evaluation still assesses the instruction itself; executing prompts against scenario/test inputs is a future feature.

## Community leaderboard and motivation

`leaderboard.html` shows real participants through `GET /api/leaderboard`, 25 per page. Points sum the best saved score for each exercise, maximum 160. Repeating an exercise increases the total only when it improves the personal best; Free and Pro use the same rules. Equal totals share a competition rank (1, 1, 3). The current participant is highlighted and their place is returned even outside the loaded page. The next target is the difference to the nearest strictly higher total; reaching that total earns a shared place. Refresh updates other participants' results.

Participation is voluntary. The registration checkbox is optional and unchecked; existing accounts remain private after the automatic SQLite migration. Users can join directly from the leaderboard or change participation in Profile → Settings → Privacy. Only the display name, tier, aggregate points and counts are public. Email, biography, prompts, individual feedback and subscription status are excluded. Renaming, deleting results and leaving immediately affect the next ranking response; leaving keeps private progress and history.

`js/motivation.js` calculates a practice streak from distinct local calendar days with saved successful checks. Multiple checks in a day count once; yesterday's streak remains available to continue today. A missed whole day breaks it. Weekly goals start on Monday and count exercises first mastered in saved history during that week, up to three or the remaining unmastered count at the start of the week. Repeating prior mastery does not advance the goal. Once all exercises were mastered before the week, the goal becomes practice on three different days. Calendar goals use the device's local time zone; quota retains its independent rolling 24-hour period.

Home and personal progress show streak, weekly goal and points remaining to the next level. New task results report only the actual gain over the previous best; lower/repeated scores retain the prior best and add no points. Goals and rewards do not make extra evaluator calls or grant quota. Deletion recalculates these displays from remaining saved attempts.

## Interface languages

The header provides **EN / RU / KZ** on every page, including mobile. On a first visit the interface uses a supported browser language, otherwise English. An explicit choice is saved in browser storage, follows navigation/reloads and synchronizes between open tabs. The Kazakh HTML/Intl locale is `kk` / `kk-KZ`; the visible button uses KZ.

Switching languages updates interface text, page titles, accessible labels, placeholders, dates, validation messages, plans and all 16 exercises without reloading or resetting forms, drafts, search filters or checkout acknowledgement. Names, biographies, entered prompts and saved model feedback remain as written. Original practice inputs (CSV, code, source documents) remain unchanged; requirements, hints, reference prompts and guide examples are translated.

New AI checks request feedback in the language selected when submitting. That language is validated on the server and saved with the attempt. Changing the interface does not re-evaluate or translate earlier feedback and consumes no check. The rubric and limits are identical across languages.

Translation resources are in `js/locales/`; shared translation, language selection and DOM bindings are in `js/i18n.js`.

## Profile settings and appearance

Profile → Settings opens a full-screen native dialog while keeping the profile underneath. Its sidebar becomes a horizontally scrolling section menu on phones. Keyboard focus stays inside; Back to profile, Escape and browser Back close it. Unsaved profile, account, privacy or avatar edits require a choice to keep editing or discard. Switching sections or languages preserves entered values. Saving and validation report their actual result next to the relevant form.

- **Profile:** avatar, display name, biography, practice interest and experience level.
- **Account:** email change confirmed with the current password. The new address replaces the login immediately; this prototype does not send verification email.
- **Security:** current/new/confirmed password with requirement feedback and visibility controls; sign out all other active sessions.
- **Appearance:** light, dark or system theme and EN/RU/KZ language. Changes apply immediately and are saved on this device.
- **Privacy:** voluntary leaderboard participation, separate from profile editing.

`js/theme.js` applies the saved preference before styles load on all ten pages. The initial preference is System, which follows device appearance changes live. Theme choices synchronize across open tabs. Light mode includes its own text, input, table, status-message and button palettes. The theme and language preferences are device-local; account/profile changes are stored on the server.

Email/password changes validate the current password on the server, atomically rotate the current session and invalidate every other session. Concurrent credential changes cannot reuse an obsolete session or password. Confirmation attempts are limited to ten per account per ten-minute period. Changing credentials retains history, drafts, quota, subscription and avatar.

## Free and test Pro

- Free includes **10 successful checks in a 24-hour period**, starting with the first successful check. Once it expires, the next check starts a fresh period. This is not a midnight reset or a sliding count over the preceding 24 hours.
- The server reserves a check before calling OpenAI, then releases it on failure, refusal, incomplete output or invalid scores. If the first check fails, the unused period is removed.
- Only one check per account runs at a time. Request references make retries idempotent; a reference reused with changed input is rejected.
- Deleting an attempt, clearing browser storage, logging out or changing browsers does **not** refund checks. Usage belongs to the account in SQLite.
- Pro has **no daily check limit** and lasts **30 days**. This is a test subscription: no payment method, charge or automatic renewal. A review/acknowledgement flow returns an activation reference.
- Test activation requires `ENABLE_DEMO_BILLING=true`. Disable it on a public service where visitors must not grant themselves Pro. Real billing/payment-provider verification is not implemented.
- Repeated activation does not extend an active plan. Ending test Pro immediately returns to Free; expiry also returns to Free. Successful Pro checks remain in the period's usage, so downgrading cannot reset the free allowance.

Comparison and checkout live in **Profile → Your plan** (`profile.html#subscription`). Signed-in headers have no Pro promotion button. The task editor shows balance/reset time; a neutral plan link appears only when Free checks are exhausted. Home focuses on the next exercise and training goals. Both plans have the same exercises and rubric.

## Accounts, data and privacy

SQLite is stored in `.data/promptforge.sqlite`, configurable with `DATABASE_PATH`. Accounts, hashed passwords, sessions, attempts, drafts, usage, subscriptions and messages survive restart. Passwords use per-account salts and scrypt. Raw passwords are not stored in browser storage, URLs, logs or database records. Sessions use HttpOnly, SameSite cookies.

The key is server-only. Public routes do not expose `.env`, database files or server source. Mutation endpoints reject cross-site browser requests. Account endpoints are rate-limited. Use HTTPS and `COOKIE_SECURE=true` when hosting publicly.

Drafts are backed up per account/task in browser storage and synced to the account. The editor reports actual save state if storage or networking is unavailable. Prompts and exercise context are sent to OpenAI with `store:false`; do not include confidential information. Feedback is stored on this server, not emailed, and does not schedule callbacks or newsletter subscriptions.

This is a single-server prototype. Email verification, password recovery, real billing, multi-process database startup recovery, production abuse prevention and deployment are not included. The server recovers unfinished quota reservations when its single process restarts.

## Functionality Plan

Responsible student: project author. Replace this label with the actual name for submission.

| Page | Visitor goal | Implemented function | Expected result | Responsible student |
| --- | --- | --- | --- | --- |
| Home | Choose a next action | Resume/recommend exercise; plan link | Open a relevant task or plan settings | Project author |
| Tasks | Find an exercise | Combined search/filter/sort, generated cards/count/reset/empty state | Open the selected task | Project author |
| Task | Improve a prompt | Per-ID content, autosave, counters, AI evaluation, weighted result, retry/history | Saved attempt with feedback | Project author |
| Register/Login | Access personal practice | Field validation, password checklist/confirmation/show-hide, server sessions | Errors or signed-in confirmation | Project author |
| Profile | Track/edit progress | Shared metrics, achievements, recent attempts and full-screen settings with avatar preview/upload/removal | Consistent progress and saved profile/photo | Project author |
| Profile settings | Manage account and appearance | Email/password changes, session revocation, profile/privacy forms, light/dark/system theme | Validated account changes and saved preferences | Project author |
| Profile plans | Choose Free/test Pro | Comparison, review, acknowledgement, activation/expiry/end | Server-owned entitlement and reference, no charge | Project author |
| My Solutions | Manage attempts | Search, sorting, review links, confirmed deletion, revision tips | Resume or remove an attempt | Project author |
| Progress | Understand personal progress | Best attempts, total, tier, streak and weekly goal | Clear next training target | Project author |
| Leaderboard | Compete with other participants | Opt-in global ranking, shared places, personal row and next-place gap | Real placement from best saved scores | Project author |
| Guide | Send a useful question | Field/combined validation, character count, summary/persistence | Saved message reference with accurate delivery notice | Project author |
| Shared | Continue across visits | API client, sessions, persistence, server quota, EN/RU/KZ and light/dark/system theme | Same account/usage/data and preferred language/appearance everywhere | Project author |

## Interface copy and icons

The English, Russian and Kazakh interfaces use consistent names for exercises, courses, saved attempts and levels. Action labels describe what happens; status messages state the result or the next step. Catalog descriptions match the actual supplied input, including the meeting and contract excerpts. AI feedback is user-visible generated content, so its exact wording still depends on the evaluation response.

Functional icons are original local SVGs in `src/icons/`, with the small dynamic helper in `js/icons.js`. They accompany text labels; password requirement states also have screen-reader text. Scores use numbers without decorative checkmarks. The orange brand mark is an original SVG feather on an anvil. No icon CDN or external asset dependency is added.

Editorial references: [GOV.UK interface writing](https://www.gov.uk/service-manual/design/writing-for-user-interfaces), [GOV.UK action labels](https://design-system.service.gov.uk/components/button/), [Nielsen Norman Group icon usability](https://www.nngroup.com/articles/icon-usability/). [Wikipedia’s signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) provides contextual examples, not a reliable authorship test or a universal list of forbidden words.

## Validation and evidence

```sh
npm test
npm ci
npm run test:browser
```

`npm test` runs 31 unit/integration tests covering exercise data, weights/progress, validation, OpenAI parsing/refusals/incomplete responses, quota/reset, concurrency/idempotency, refunds, Pro activation/downgrade/expiry, user isolation, protected files, login/profile/feedback, SQLite restart recovery, translation coverage/placeholders, localized search and feedback language validation. Route tests additionally cover complete catalog coverage, mastery boundaries/deletion, recommendations, chronological comparison and Unicode/whitespace-preserving differences. Competition tests also cover ranking privacy, shared places, pagination/viewer targets, participation/name/deletion changes, existing-database migration, local calendar boundaries, weekly mastery and best-score gains. Avatar tests also cover authenticated binary uploads, MIME/header/size rejection, account isolation, replacement, deletion and storage across database reopening. Account-settings tests cover email/password validation, current-password confirmation, concurrent credential changes, session rotation/revocation, retained account data and confirmation throttling. HTTP integration tests open temporary loopback ports.

Twenty-one browser scenarios use an isolated in-memory server with a clearly labeled deterministic evaluator in `tests/browser-server.js`. This fixture never runs in `npm start`. They cover every page, filters/reset, passwords, saved drafts, results/history/progress, checkout, check eleven, failed AI requests, inert user text and no viewport overflow. Language scenarios additionally cover switching/persistence, browser preferences, preserved form data and drafts, untranslated interface text, AI request language and all ten pages in EN/RU/KZ at 375/768/1024/1440 px. Redesign scenarios add Russian layouts down to 320 px, mobile keyboard navigation and dismissal, desktop resizing and short screens, disclosure/hash links, hidden-field validation, guest-draft migration and populated mobile history/progress/checkout. Training scenarios cover route/filter links and guest drafts, mastery across three differently scored attempts, positive/negative score differences, safe text rendering, comparison selection across languages at 320/375/768/1440 px, unchanged quota while comparing, workshop recommendations and deletion of the best result. Competition scenarios cover real multi-account placement, opt-in/out, goals/rewards, private text, paginated loading/retry and EN/RU/KZ layouts at 320/375/768/1200/1280/1440 px. First-visit scenarios additionally cover home-to-first-exercise navigation, visible editor guidance, post-registration focus/return, direct profile access on desktop/phone, logout and failed-logout recovery, result-dependent actions, first-screen catalog access, empty states, draft recovery from history, unmatched-search recovery and checkout cancellation/focus.

Settings scenarios additionally cover full-screen navigation, keyboard closing, unsaved-change protection, preserved edits, real email/password changes and other-session revocation. Appearance checks cover live system changes, persistence and tab synchronization, both themes across ten pages, and all five settings sections in EN/RU/KZ at 320/375/768/1440 px.

Playwright uses installed Google Chrome on this machine. Elsewhere install Chromium with `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. Playwright is a development dependency only.

Evidence is in `screenshots/redesign/` (all ten pages on desktop/phone, mobile navigation and populated states), `screenshots/training/` (revision comparisons and workshop), `screenshots/competition/` (community ranking and personal goals), `screenshots/usability/` (first-visit audit and result flow), `screenshots/avatars/` (profile photo editing on phones), `screenshots/settings/` (settings sections and all-page light/dark audit) and `screenshots/js/` (functional journeys). These show test-fixture feedback, not a live AI result. Tests never read the local API key or call real OpenAI; live API connectivity was not exercised by these checks.

Profile → Settings → Profile includes avatar selection, preview, cancellation, upload and removal. JPG, PNG and WebP inputs up to 5 MB are decoded in the browser, centre-cropped to 256×256 and re-encoded as JPEG without original metadata. The server accepts bounded JPEG thumbnails up to 100 KiB, checks their headers/dimensions, and stores one thumbnail per account in SQLite. The authenticated image endpoint uses private/no-store responses. Photos appear only in the owner’s profile, settings and header; they are excluded from public ranking. Initials replace missing or failed photos. Uploading a photo does not consume AI checks or overwrite unsaved profile text. The avatar UI supports EN/RU/KZ.

## Assignment scope and submission

The user requested a working service with server-owned limits and explicitly relaxed the HTML/CSS freeze. This implementation rebuilds the original nine HTML pages, the shared theme and navigation, while preserving their JavaScript/API workflows and language support. It also extends the original front-end-only scope: real accounts/database replace its authentication demonstration. Agree these deviations with the assessor; this README does not claim strict compliance with those restrictions.

The original personal progress view now lives at `progress.html`; `leaderboard.html` is the community ranking. This deliberately adds one page to the original nine-page map. No duplicate task pages, unrelated cart, booking flow or public reviews are added. Feedback is a private message flow.

See `JS-CHECKLIST.md` for source locations. No historical commits/dates or milestone tags were fabricated. Verify the actual midterm baseline and create assignment tags at reviewed milestones. Commit/day requirements and individual defense remain the student's responsibility.

OpenAI references: [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create), [Structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [API authentication](https://developers.openai.com/api/reference/overview).
