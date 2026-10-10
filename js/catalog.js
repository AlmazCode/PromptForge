'use strict';

import { phrase, t, localizedTask, getLocale } from './i18n.js';
import { tasks } from './data.js';
import { filterTasks, taskStatus } from './logic.js';
import { routes, routeProgress } from './training.js';
import { renderRoutes, practiceDrafts, statusBadge } from './training-ui.js';
import { app } from './main.js';
import { $, $$, element, renderList, hidden, text } from './ui.js';

export function init() {
  const filters = { query: '', category: 'all', difficulty: 'all', model: 'all', status: 'all', sort: 'catalog' };
  const routeId = new URLSearchParams(location.search).get('route');
  let selectedRoute = routes.find(route => route.id === routeId) || null;
  $('#catalog-courses').open = Boolean(selectedRoute);
  let drafts = practiceDrafts(app);
  function card(task) {
    const status = taskStatus(task.id, app.attempts, drafts);
    const wrapper = element('article', 'exercise-card', '', { 'data-task-id': task.id });
    const header = element('div', 'exercise-card-top');
    const category = element('span', 'exercise-category');
    if (selectedRoute) category.append(element('span', 'exercise-step', String(selectedRoute.taskIds.indexOf(task.id) + 1).padStart(2, '0')), document.createTextNode(' '));
    category.append(element('span', '', task.category.replaceAll('-', ' ')));
    header.append(category, element('span', `exercise-difficulty text-${task.difficulty === 'beginner' ? 'success' : task.difficulty === 'advanced' ? 'danger' : 'warning'}`, task.difficulty));
    const title = element('h2'); title.append(element('a', '', task.title, { href: `task.html?id=${task.id}` }));
    const footer = element('div', 'exercise-card-footer');
    const state = element('span', 'exercise-state'); state.append(statusBadge(status));
    const best = app.attempts.filter(attempt => attempt.taskId === task.id).reduce((score, attempt) => Math.max(score, attempt.score), -1);
    if (best >= 0) state.append(element('span', 'exercise-best', phrase('Best: {score}/10', { score: best.toFixed(2) })));
    footer.append(state);
    footer.append(element('a', 'exercise-start', status === 'available' ? 'Start exercise' : 'Continue', { href: `task.html?id=${task.id}` }));
    wrapper.append(header, title, element('p', 'exercise-card-description', task.description), footer); return wrapper;
  }
  function render() {
    drafts = practiceDrafts(app);
    renderRoutes($('#catalog-routes'), app.attempts, drafts, { selected: selectedRoute?.id, onSelect: id => selectRoute(id) });
    $('#catalog-all-routes').setAttribute('aria-pressed', String(!selectedRoute));
    const context = $('#route-context'); context.replaceChildren(); hidden(context, !selectedRoute);
    if (selectedRoute) {
      const summary = routeProgress(selectedRoute, app.attempts, drafts);
      const copy = element('div'); copy.append(element('strong', '', selectedRoute.title), element('p', '', summary.next ? phrase('Next: {title}', { title: phrase(summary.next.task.title) }) : 'Course completed. Repeat an exercise or choose another course.'));
      context.append(copy);
      if (summary.next) context.append(element('a', 'btn btn-primary btn-sm', 'Continue course', { href: `task.html?id=${summary.next.task.id}` }));
    }
    const pool = selectedRoute ? tasks.filter(task => selectedRoute.taskIds.includes(task.id)) : tasks;
    const matches = filterTasks(pool.map(task => localizedTask(task)), { ...filters, locale: getLocale() }, app.attempts, drafts);
    if (selectedRoute && filters.sort === 'catalog') matches.sort((a, b) => selectedRoute.taskIds.indexOf(a.id) - selectedRoute.taskIds.indexOf(b.id));
    renderList($('#task-grid'), matches, card, '');
    hidden($('#catalog-empty'), matches.length > 0);
    hidden($('#clear-filters'), !selectedRoute && !filters.query.trim() && filters.category === 'all' && filters.difficulty === 'all' && filters.status === 'all' && filters.sort === 'catalog');
    text('#catalog-results-status', phrase('{count} of {total} exercises', { count: matches.length, total: pool.length }));
    text('#filters-summary', [selectedRoute ? t(selectedRoute.title) : '', filters.query.trim() ? t('Search: {query}', { query: filters.query.trim() }) : '', ...['category','status'].map(key => filters[key] === 'all' ? '' : t(({ 'needs-work': 'Needs revision', mastered: 'Mastered', active: 'Draft in progress', available: 'Not started', solved: 'Checked' })[filters[key]] || filters[key].replaceAll('-', ' ')))].filter(Boolean).join(' · '));
  }
  function selectRoute(id) {
    selectedRoute = routes.find(route => route.id === id) || null;
    const url = new URL(location.href); selectedRoute ? url.searchParams.set('route', selectedRoute.id) : url.searchParams.delete('route');
    history.replaceState(null, '', url); render();
  }
  $('#catalog-all-routes').addEventListener('click', () => selectRoute(''));
  $('#task-search').addEventListener('input', event => { filters.query = event.target.value; render(); });
  for (const key of ['category', 'difficulty', 'status', 'sort']) $(`#catalog-${key}`).addEventListener('change', event => { filters[key] = event.target.value; render(); });
  $$('[data-action="clear-filters"]').forEach(button => button.addEventListener('click', () => {
    Object.assign(filters, { query: '', category: 'all', difficulty: 'all', model: 'all', status: 'all', sort: 'catalog' });
    selectedRoute = null; const url = new URL(location.href); url.searchParams.delete('route'); history.replaceState(null, '', url);
    $('#task-search').value = '';
    for (const key of ['category', 'difficulty', 'status', 'sort']) $(`#catalog-${key}`).value = filters[key];
    render(); $('#task-search').focus();
  }));
  document.addEventListener('promptforge:state', render); document.addEventListener('promptforge:language', render); render();
}
