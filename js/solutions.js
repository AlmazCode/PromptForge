'use strict';

import { phrase, t, write } from './i18n.js';

import { tasks } from './data.js';
import { progress, rubric, masteryScore } from './logic.js';
import { app, api, setState } from './main.js';
import { $, element, text, hidden, renderList, cloneTemplate, fill, dateTime, confirmation, message } from './ui.js';

export function init() {
  const controls = element('div', 'history-controls');
  const search = element('input', 'form-control', '', { type: 'search', placeholder: 'Search attempts…', 'aria-label': 'Search attempts' });
  const sort = element('select', 'form-select', '', { 'aria-label': 'Sort attempts' });
  for (const [value, label] of [['newest','Newest first'], ['score','Highest score'], ['lowest','Lowest score']]) sort.append(element('option', '', label, { value }));
  const reset = element('button', 'btn btn-outline-light btn-sm', 'Reset', { type: 'button' });
  const status = element('div', 'alert is-hidden mt-3');
  const confirm = element('div');
  const draftsSection = element('section', 'section-panel is-hidden', '', { id: 'solutions-drafts', 'aria-labelledby': 'solutions-drafts-title' });
  draftsSection.append(element('h2', '', 'Unsubmitted drafts', { id: 'solutions-drafts-title' }));
  const draftsList = element('ul', 'draft-list'); draftsSection.append(draftsList); $('#solutions-history').before(draftsSection);
  controls.append(search, sort, reset); $('#solutions-controls-slot').append(controls); $('#solutions-table').parentElement.after(confirm, status);
  function render() {
    const summary = progress(app.attempts);
    text('#solutions-attempt-count', phrase('Attempts: {count}', { count: summary.attempts })); text('#solutions-solved-count', summary.solved); text('#solutions-average-score', summary.attempts ? summary.average.toFixed(2) : '—');
    text('#solutions-best-score', app.attempts.length ? Math.max(...app.attempts.map(a => a.score)).toFixed(2) : '—');
    const drafts = Object.entries(app.drafts).filter(([id, draft]) => draft.trim() && !app.attempts.some(a => a.taskId === id));
    text('#solutions-active-count', drafts.length);
    hidden(draftsSection, !app.user || !drafts.length);
    renderList(draftsList, drafts, ([id]) => {
      const row = element('li'); row.append(element('a', 'text-link', tasks.find(task => task.id === id)?.title || id, { href: `task.html?id=${id}` }), element('span', 'practice-status', 'Draft in progress')); return row;
    }, '', 'li');
    hidden($('#solutions-tips'), app.attempts.length === 0);
    hidden($('.metrics-row'), !app.user);
    hidden(controls, !app.attempts.length);
    hidden($('.page-heading > a'), !app.attempts.length);
    hidden($('#solutions-history .section-heading'), !app.attempts.length);
    hidden($('#solutions-table thead'), !app.attempts.length);
    hidden($('#solutions-record-count'), !app.attempts.length);
    const query = search.value.trim().toLowerCase();
    const matches = app.attempts.filter(attempt => `${t(tasks.find(t => t.id === attempt.taskId)?.title)} ${attempt.prompt}`.toLowerCase().includes(query));
    matches.sort((a, b) => sort.value === 'score' ? b.score - a.score : sort.value === 'lowest' ? a.score - b.score : b.createdAt - a.createdAt);
    text('#solutions-record-count', phrase('Shown: {count} of {total}', { count: matches.length, total: app.attempts.length }));
    renderList($('#solutions-body'), matches, attempt => {
      const row = cloneTemplate('#solution-row-template'); fill(row, 'task-title', tasks.find(t => t.id === attempt.taskId)?.title || attempt.taskId);
      fill(row, 'date', dateTime(attempt.createdAt)); fill(row, 'score', `${attempt.score.toFixed(2)} / 10`); fill(row, 'status', attempt.score >= masteryScore ? '8/10 or higher' : 'Needs revision');
      const link = row.querySelector('[data-field="task-link"]'); link.href = `task.html?id=${attempt.taskId}&attempt=${attempt.id}`; write(link, app.attempts.filter(item => item.taskId === attempt.taskId).length > 1 ? 'Compare attempts' : 'Open attempt');
      const remove = element('button', 'btn btn-outline-danger btn-sm ms-2', 'Delete', { type: 'button', 'aria-label': phrase('Delete attempt for {title}', { title: phrase(tasks.find(t => t.id === attempt.taskId)?.title) }) });
      remove.addEventListener('click', () => {
        confirm.replaceChildren();
        confirmation(confirm, 'Delete this attempt? Progress and achievements will be recalculated. This does not restore a daily check.', async () => {
          setState(await api(`attempts/${attempt.id}`, 'DELETE', {})); message(status, 'Attempt deleted. Your progress has been recalculated.');
        }, () => remove.focus());
      }); row.lastElementChild.append(remove); return row;
    }, '');
    if (!matches.length) {
      const empty = $('#solutions-body td');
      const filtered = app.attempts.length > 0;
      empty.replaceChildren(element('h2', '', filtered ? 'No matching attempts' : app.user ? 'No attempts yet' : 'Your saved attempts'), element('p', '', filtered ? 'Try another search or reset the filters.' : app.user ? 'Check a prompt to save your first result here.' : 'Log in to view your results or start with a practice exercise.'));
      const action = element('div', 'empty-action');
      if (filtered) {
        const clear = element('button', 'btn btn-secondary', 'Reset search', { type: 'button' }); clear.addEventListener('click', () => reset.click()); action.append(clear);
      } else {
        action.append(element('a', 'btn btn-primary', app.user ? 'Try the first exercise' : 'Log in', { href: app.user ? 'task.html?id=t001' : 'login.html?next=my-solutions.html' }));
        if (!app.user) action.append(element('a', 'text-link', 'Try the first exercise', { href: 'task.html?id=t001' }));
      }
      empty.append(action);
    }
    const latestByTask = new Map();
    app.attempts.forEach(attempt => { if (!latestByTask.has(attempt.taskId)) latestByTask.set(attempt.taskId, attempt); });
    const tips = [...latestByTask.values()].filter(attempt => !app.attempts.some(item => item.taskId === attempt.taskId && item.score >= masteryScore)).slice(0, 3);
    hidden($('#solutions-tips'), tips.length === 0);
    hidden($('#solutions-tips-empty'), tips.length > 0); hidden($('#solutions-tips-list'), tips.length === 0); text('#solutions-tip-count', tips.length);
    renderList($('#solutions-tips-list'), tips, attempt => {
      const row = cloneTemplate('#solution-tip-template'); const weakest = [...rubric].sort((a, b) => attempt.criteria[a.id].score - attempt.criteria[b.id].score)[0];
      fill(row, 'task-title', tasks.find(t => t.id === attempt.taskId)?.title || attempt.taskId); fill(row, 'feedback', `${t(weakest.name)}: ${attempt.criteria[weakest.id].feedback}`);
      row.querySelector('[data-field="task-link"]').href = `task.html?id=${attempt.taskId}&attempt=${attempt.id}`; return row;
    }, 'No revision suggestions yet.');
  }
  search.addEventListener('input', render); sort.addEventListener('change', render);
  reset.addEventListener('click', () => { search.value = ''; sort.value = 'newest'; render(); search.focus(); });
  document.addEventListener('promptforge:state', render); document.addEventListener('promptforge:language', render); render();
}
