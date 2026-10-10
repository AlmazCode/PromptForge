'use strict';

import { phrase } from './i18n.js';

import { tasks } from './data.js';
import { progress } from './logic.js';
import { renderRoutes, practiceDrafts } from './training-ui.js';
import { app } from './main.js';
import { $, element, text, renderList, cloneTemplate, fill, hidden } from './ui.js';
import { mountGoals } from './motivation-ui.js';

export function init() {
  mountGoals($('.learning-routes'));
  const empty = element('section', 'practice-empty is-hidden', '', { id: 'progress-empty', 'aria-labelledby': 'progress-empty-title' });
  empty.append(element('h2', '', 'Your progress starts with the first check', { id: 'progress-empty-title' }), element('p', '', 'Complete a short exercise to see your score, course progress and next step.'));
  const actions = element('div', 'hero-actions');
  actions.append(element('a', 'btn btn-primary', 'Try the first exercise', { href: 'task.html?id=t001' }), element('a', 'text-link', 'Log in to see saved progress', { href: 'login.html?next=progress.html', id: 'progress-login' }));
  empty.append(actions); $('.page-heading').after(empty);
  const bar = element('progress', 'w-100', '', { id: 'leaderboard-native-progress', max: 50, value: 0, 'aria-label': 'Progress to next level' });
  $('#leaderboard-progress').replaceWith(bar);
  function render() {
    const summary = progress(app.attempts); const target = summary.next?.min || 160;
    hidden(empty, summary.attempts > 0);
    hidden($('#progress-login'), Boolean(app.user));
    for (const section of document.querySelectorAll('main > .learning-routes, main > .progress-overview, main > .skill-tiers, main > .section-panel')) hidden(section, summary.attempts === 0);
    renderRoutes($('#progress-routes'), app.attempts, practiceDrafts(app));
    text('#progress-mastery-summary', phrase('{mastered} mastered · {checked} checked', { mastered: summary.mastered, checked: summary.checked }));
    text('#leaderboard-tier', summary.tier); text('#leaderboard-current-tier', summary.tier); text('#leaderboard-total-points', phrase('{points} pts', { points: summary.points.toFixed(2) }));
    text('#leaderboard-next-tier', summary.next ? phrase('{points} points to {tier}', { points: (target - summary.points).toFixed(2), tier: phrase(summary.next.name) }) : 'Highest level reached.');
    document.querySelectorAll('[data-tier]').forEach(node => node.classList.toggle('is-current', node.dataset.tier === summary.tier));
    hidden($('#progress-empty-action'), summary.best.length > 0);
    text('#leaderboard-progress-label', `${summary.points.toFixed(2)} / ${target}`); bar.max = target; bar.value = summary.points;
    renderList($('#leaderboard-body'), summary.best, (attempt, index) => {
      const row = cloneTemplate('#leaderboard-row-template'); fill(row, 'rank', index + 1);
      const cell = row.querySelector('[data-field="task-title"]');
      cell.append(element('a', 'link-warning', tasks.find(t => t.id === attempt.taskId)?.title || attempt.taskId, { href: `task.html?id=${attempt.taskId}&attempt=${attempt.id}` }));
      fill(row, 'score', `${attempt.score.toFixed(2)} / 10`); fill(row, 'attempt-count', phrase('Attempts: {count}', { count: app.attempts.filter(a => a.taskId === attempt.taskId).length })); return row;
    }, 'No checked exercises yet. Open the catalog to start.');
  }
  document.addEventListener('promptforge:state', render); render();
}
