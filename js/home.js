'use strict';

import { phrase, write } from './i18n.js';
import { tasks } from './data.js';
import { rubric } from './logic.js';
import { recommendTraining } from './training.js';
import { renderRoutes, practiceDrafts, statusBadge } from './training-ui.js';
import { app, quotaLabel } from './main.js';
import { $, element, text, hidden } from './ui.js';
import { mountGoals } from './motivation-ui.js';

export function init() {
  mountGoals($('.learning-routes'));
  const heading = $('.home-hero h1');
  text('#home-task-count', tasks.length);
  text('#home-category-count', new Set(tasks.map(task => task.category)).size);
  text('#home-criterion-count', rubric.length);
  function render() {
    write(heading, app.user ? 'Your practice' : 'Prompt writing practice');
    (app.user ? $('#home-workshop-heading') : $('.hero-copy')).prepend(heading);
    hidden($('#home-next-session'), !app.user); hidden($('.home-hero'), Boolean(app.user)); hidden($('#home-example'), Boolean(app.user));
    write($('#home-session-summary'), quotaLabel());
    const drafts = practiceDrafts(app);
    renderRoutes($('#home-routes'), app.attempts, drafts);
    const next = recommendTraining(app.attempts, drafts, app.user?.interest);
    const recommendation = $('#home-recommendation'); const links = $('#home-session-links');
    recommendation.replaceChildren(); links.replaceChildren();
    if (next) {
      recommendation.append(element('p', 'workshop-route-label', phrase('{route} · Step {number} of {total}', { route: phrase(next.route.title), number: next.index + 1, total: next.route.taskIds.length })),
        element('h2', '', next.task.title), element('p', 'text-secondary', next.reason), statusBadge(next.status));
      links.append(element('a', 'btn btn-primary', next.best || drafts[next.task.id]?.trim() ? 'Continue practising' : 'Start this exercise', { href: `task.html?id=${next.task.id}` }),
        element('a', 'text-link', 'View course', { href: `tasks.html?route=${next.route.id}#learning-routes` }));
    } else {
      recommendation.append(element('h2', '', 'All courses completed'), element('p', 'text-secondary', 'Revisit an exercise and try a different approach.'));
      links.append(element('a', 'btn btn-primary', 'Review your attempts', { href: 'my-solutions.html' }));
    }
  }
  document.addEventListener('promptforge:state', render); document.addEventListener('promptforge:language', render); render();
}
