'use strict';

import { phrase, write, writeAttribute, getLocale, localizedExercise } from './i18n.js';

import { tasks } from './data.js';
import { exercises } from './exercises.js';
import { rubric, taskStatus } from './logic.js';
import { routeForTask, routeProgress, nextRouteTask, masteryScore } from './training.js';
import { statusBadge } from './training-ui.js';
import { createComparison } from './comparison.js';
import { earnedPoints } from './motivation.js';
import { app, api, setState, quotaLabel } from './main.js';
import { $, element, text, hidden, message, renderList, cloneTemplate, fill, dateTime, showErrors, clearErrors } from './ui.js';

export function init() {
  const params = new URLSearchParams(location.search);
  const task = tasks.find(item => item.id === (params.get('id') || 't002'));
  if (!task) {
    const panel = element('section', 'container py-5');
    panel.append(element('h1', 'h3', 'Exercise not found'), element('p', '', 'This exercise link is invalid. Choose one from the catalog.'), element('a', 'btn btn-primary', 'Browse exercises', { href: 'tasks.html' }));
    $('#main-content').replaceChildren(panel); return;
  }
  $('#main-content').dataset.taskId = task.id;
  $('#prompt-task-id').value = task.id;
  const form = $('#prompt-form'); const input = $('#prompt-input'); const submit = $('#submit-btn');
  const comparison = createComparison($('#attempt-comparison'), task.id, () => app.attempts);
  const comparisonHint = element('p', 'mastery-note', 'Check a revised prompt to compare text and scores.');
  $('#results-panel').append(comparisonHint);
  input.maxLength = task.limit;
  submit.type = 'submit'; form.noValidate = true;
  const quotaPanel = element('div', 'task-quota');
  const quotaText = element('p', '', '', { id: 'task-quota', role: 'status' });
  const planLink = element('a', 'is-hidden', 'Your plan', { id: 'task-plan-link', href: 'profile.html#subscription' });
  quotaPanel.append(quotaText, planLink); $('#task-quota-slot').append(quotaPanel);
  const draftStatus = $('#draft-status');
  const source = $('.source-disclosure');
  source.open = true;
  let busy = false; let timer; let saveChain = Promise.resolve(); let retryRequest = null;
  const localKey = `pf-draft:${app.user?.id || 'guest'}:${task.id}`;
  let backup = null;
  try { backup = JSON.parse(localStorage.getItem(localKey)); } catch { /* Browser storage can be unavailable. */ }
  if (app.user && !backup && !app.drafts[task.id]) {
    try {
      const guestKey = `pf-draft:guest:${task.id}`;
      const guest = JSON.parse(localStorage.getItem(guestKey));
      if (guest?.prompt?.trim()) {
        backup = { prompt: guest.prompt, dirty: true };
        localStorage.setItem(localKey, JSON.stringify(backup)); localStorage.removeItem(guestKey);
      }
    } catch { /* A restricted browser can still use the account draft. */ }
  }
  input.value = input.value || (backup?.dirty ? backup.prompt : (app.drafts[task.id] || backup?.prompt || ''));
  const requestedAttempt = app.attempts.find(item => item.id === params.get('attempt') && item.taskId === task.id);
  if (params.get('attempt') && !requestedAttempt) message($('#prompt-error'), 'This attempt is unavailable. It may have been deleted, or belong to another account.', true);
  if (requestedAttempt) input.value = requestedAttempt.prompt;

  function keepBackup(prompt, dirty) {
    try { localStorage.setItem(localKey, JSON.stringify({ prompt, dirty })); return true; } catch { return false; }
  }
  function saveDraft() {
    clearTimeout(timer);
    const prompt = input.value;
    const locallySaved = keepBackup(prompt, true);
    app.drafts[task.id] = prompt;
    renderRoute();
    if (!app.user) { write(draftStatus, locallySaved ? 'Draft saved in this browser. Log in to save it to your account.' : 'Draft is only in this tab; browser storage is unavailable.'); return Promise.resolve(); }
    saveChain = saveChain.catch(() => {}).then(async () => {
      try {
        await api(`drafts/${task.id}`, 'PUT', { prompt });
        if (input.value === prompt) { keepBackup(prompt, false); write(draftStatus, 'Draft saved to your account.'); }
      } catch (error) { write(draftStatus, phrase('{saveState} {error}', { saveState: phrase(locallySaved ? 'Draft kept in this browser.' : 'Draft remains only in this tab.'), error: phrase(error.message) })); }
    });
    return saveChain;
  }
  function updateCounters() {
    text('#char-count', `${input.value.length} / ${task.limit}`);
    text('#token-estimate', phrase('≈{count} (rough estimate)', { count: Math.ceil(input.value.length / 4) }));
  }
  function renderHistory() {
    const history = app.attempts.filter(attempt => attempt.taskId === task.id);
    text('#task-attempt-count', history.length); hidden($('#history-empty'), history.length > 0); hidden($('#history-list'), history.length === 0);
    renderList($('#history-list'), history, attempt => {
      const row = cloneTemplate('#attempt-template');
      fill(row, 'score', `${attempt.score.toFixed(2)} / 10`); fill(row, 'date', dateTime(attempt.createdAt));
      fill(row, 'prompt', attempt.prompt); fill(row, 'feedback', attempt.summary);
      const review = element('button', 'btn btn-outline-light btn-sm', 'Open attempt', { type: 'button' });
      review.addEventListener('click', () => { input.value = attempt.prompt; updateCounters(); showResult(attempt); saveDraft(); input.focus(); });
      row.append(review); return row;
    }, 'No attempts yet.', 'li');
    comparison.render(); hidden(comparisonHint, history.length > 1);
  }
  function renderRoute() {
    const route = routeForTask(task.id); const panel = $('#task-route');
    if (!route) { hidden(panel, true); return; }
    const drafts = { ...app.drafts, [task.id]: input.value };
    const summary = routeProgress(route, app.attempts, drafts);
    const status = taskStatus(task.id, app.attempts, drafts);
    panel.replaceChildren(element('a', '', route.title, { href: `tasks.html?route=${route.id}#learning-routes` }),
      element('span', '', phrase('Step {number} of {total}', { number: route.taskIds.indexOf(task.id) + 1, total: route.taskIds.length })));
    if (status !== 'available') panel.append(statusBadge(status));
    if (summary.mastered) panel.append(element('span', 'task-route-mastery', phrase('{mastered} / {total} mastered', { mastered: summary.mastered, total: summary.steps.length })));
    const next = nextRouteTask(task.id, app.attempts);
    const link = $('#next-task-btn');
    link.href = next ? `task.html?id=${next.id}` : `tasks.html?route=${route.id}#learning-routes`;
    write(link, next ? phrase('Next: {title}', { title: phrase(next.title) }) : 'Back to course');
  }
  function updateQuota() {
    write(quotaText, quotaLabel());
    hidden(planLink, !(app.user && app.quota?.plan === 'free' && app.quota.remaining === 0));
    submit.disabled = busy || Boolean(app.user && app.quota?.plan === 'free' && app.quota.remaining === 0);
    write(submit, busy ? 'Checking…' : !app.user ? 'Log in to check' : submit.disabled ? 'Daily limit reached' : 'Check prompt');
    if (!app.aiReady && app.online) quotaText.append(element('span', 'd-block mt-2 text-warning', 'Prompt checks are temporarily unavailable.'));
  }
  function showResult(attempt, fresh = false) {
    hidden($('#results-panel'), false); text('#final-score', attempt.score.toFixed(2)); text('#score-total', attempt.score.toFixed(2));
    text('#prompt-status', phrase('Checked {date}', { date: () => dateTime(attempt.createdAt) }));
    for (const criterion of rubric) {
      const item = attempt.criteria[criterion.id];
      text(`#score-${criterion.id}`, item.score.toFixed(1)); text(`#feedback-${criterion.id}`, item.feedback, true);
    }
    const weakest = [...rubric].sort((a, b) => attempt.criteria[a.id].score - attempt.criteria[b.id].score)[0];
    const needsRevision = attempt.score < masteryScore;
    hidden($('#result-earned-points'), !fresh);
    if (fresh) {
      const gained = earnedPoints(app.attempts, attempt);
      text('#result-earned-points', gained > 0 ? phrase('Personal best: +{points} points to your total.', { points: gained.toFixed(2) }) : 'Your best saved score still counts. Try improving one criterion.');
    }
    text('#revision-focus', needsRevision ? phrase('Start with: {criterion}', { criterion: phrase(weakest.name) }) : 'You can move to the next exercise or try another version.');
    for (const criterion of rubric) $(`#criterion-${criterion.id}`).classList.toggle('is-focus', needsRevision && criterion.id === weakest.id);
    message($('#prompt-success'), attempt.summary, false, true);
    text('#result-mastery', attempt.score >= masteryScore ? '8/10 or higher. Exercise mastered.' : 'Below 8/10. Revise your prompt using the feedback.');
    $('#retry-btn').className = `btn ${attempt.score >= masteryScore ? 'btn-secondary' : 'btn-primary'}`;
    $('#next-task-btn').className = `btn ${attempt.score >= masteryScore ? 'btn-primary' : 'btn-quiet'}`;
    comparison.render(attempt.id);
  }
  input.addEventListener('input', () => {
    clearErrors(form); message($('#prompt-error')); message($('#prompt-success'));
    if (!busy) text('#prompt-status', 'Draft changed. Check it to get an updated evaluation.');
    hidden($('#results-panel'), true); retryRequest = null; updateCounters();
    const saved = keepBackup(input.value, true); write(draftStatus, saved ? 'Draft saved in this browser; syncing…' : 'Draft changed; saving…');
    clearTimeout(timer); timer = setTimeout(saveDraft, 600);
  });
  input.addEventListener('blur', saveDraft);
  form.addEventListener('reset', () => { clearTimeout(timer); queueMicrotask(() => { input.value = ''; clearErrors(form); message($('#prompt-error')); message($('#prompt-success')); hidden($('#results-panel'), true); text('#prompt-status', 'Draft cleared. Previous attempts remain in your history.'); retryRequest = null; updateCounters(); saveDraft(); }); });
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (busy) return;
    message($('#prompt-error')); message($('#prompt-success')); clearErrors(form);
    if (!input.value.trim() || input.value.length > task.limit) { showErrors(form, { prompt: 'Enter a nonblank prompt within the character limit.' }); return; }
    if (!app.user) {
      await saveDraft();
      location.assign(`login.html?next=${encodeURIComponent(`task.html?id=${task.id}`)}`);
      return;
    }
    const prompt = input.value;
    retryRequest ||= { prompt, id: crypto.randomUUID() };
    busy = true; input.readOnly = true; $('#reset-btn').disabled = true;
    hidden($('#prompt-loading'), false); hidden($('#results-panel'), true); updateQuota();
    await saveDraft();
    try {
      const result = await api('evaluate', 'POST', { taskId: task.id, prompt, requestId: retryRequest.id, locale: getLocale() });
      setState({ attempts: [result.attempt, ...app.attempts.filter(item => item.id !== result.attempt.id)], quota: result.quota });
      showResult(result.attempt, true); retryRequest = null;
      $('#results-panel').scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    } catch (error) {
      if (error.quota) setState({ quota: error.quota });
      if (error.status === 409) retryRequest = null;
      message($('#prompt-error'), error.message, true); text('#prompt-status', 'No new result. Your draft is preserved.');
    } finally { busy = false; input.readOnly = false; $('#reset-btn').disabled = false; hidden($('#prompt-loading'), true); updateQuota(); }
  });
  $('#retry-btn').addEventListener('click', () => { hidden($('#results-panel'), true); message($('#prompt-success')); text('#prompt-status', 'Revise your prompt, then check it again. Each successful new check uses one attempt.'); input.focus(); });
  $('#result-title').after(element('p', 'mastery-note', '', { id: 'result-mastery' }));
  $('.results-breakdown').before(element('p', 'revision-focus', '', { id: 'revision-focus' }));
  $('#result-mastery').after(element('p', 'result-earned-points is-hidden', '', { id: 'result-earned-points', role: 'status' }));
  $('#results-panel .result-actions').append(element('a', 'text-link', 'View leaderboard', { href: 'leaderboard.html' }));
  const references = element('details', 'disclosure');
  references.append(element('summary', 'fw-semibold', 'Example prompts'));
  $('#results-panel').append(references);
  function renderContent() {
    const exercise = localizedExercise(task.id, exercises[task.id]);
    write(document.querySelector('title'), phrase('{title} — PromptForge', { title: phrase(task.title) }));
    text('#task-title', task.title); text('#task-breadcrumb', task.title); text('#task-number', `#${task.id.slice(1)}`);
    text('#task-description', task.description); text('#task-difficulty', task.difficulty); text('#task-category', task.category.replaceAll('-', ' '));
    $('#task-difficulty').className = `task-difficulty text-${task.difficulty === 'beginner' ? 'success' : task.difficulty === 'advanced' ? 'danger' : 'warning'}`;
    renderList($('#task-requirements'), exercise.requirements, requirement => element('li', '', requirement), 'No extra requirements.', 'li');
    const data = element('pre', 'terminal-block mw-100 overflow-x-auto rounded p-3 small', '', { tabindex: 0, 'aria-label': 'Source data' });
    const code = element('code'); write(code, exercise.input, true); data.append(code);
    $('#task-input-data').replaceChildren(data, element('p', 'small text-secondary', 'Source examples are in English. You can write your prompt in English, Russian or Kazakh.'));
    $('#hint-panel .card-body').replaceChildren(element('p', 'mb-0', exercise.hint));
    text('#task-character-limit', task.limit); text('#prompt-limit', task.limit); text('#task-model', phrase('Evaluator: {model}', { model: app.model || 'OpenAI' }));
    writeAttribute(input, 'placeholder', 'For example: Act as a [role]. Use the source data to [task]. Return [format] in [length].');
    references.replaceChildren(element('summary', 'fw-semibold', 'Example prompts'));
    exercise.examples.forEach(example => { const quote = element('blockquote', 'small text-body-secondary border-start ps-3 mt-3 text-break'); write(quote, example, true); references.append(quote); });
  }
  document.addEventListener('promptforge:language', () => { renderContent(); updateQuota(); updateCounters(); renderHistory(); renderRoute(); });
  renderContent();
  document.addEventListener('promptforge:state', () => { updateQuota(); renderHistory(); renderRoute(); });
  updateCounters(); updateQuota(); renderHistory(); renderRoute();
  if (requestedAttempt) showResult(requestedAttempt);
  if (backup?.dirty && app.user) saveDraft();
}
