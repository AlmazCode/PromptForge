'use strict';

import { tasks } from './data.js';
import { exercises } from './exercises.js';
import { evaluatePrompt } from './logic.js';
import { loadData, saveDraft, saveAttempt } from './storage.js';
import { $, element, showMessage, hideMessage, pageError } from './jquery-ui.js';
export function init() {
  const params = new URLSearchParams(location.search);
  const task = tasks.find((item) => item.id === (params.get('id') || 't002'));
  if (!task) {
    $('#main-content')
      .empty()
      .append(
        element('h1', 'h3', 'Exercise not found'),
        element('a', 'btn btn-primary', 'Browse exercises', { href: 'tasks.html' }),
      );
    return;
  }
  const exercise = exercises[task.id];
  const input = $('#prompt-input').attr('maxlength', task.limit);
  $('#task-title').text(task.title);
  $('#task-description').text(task.description);
  $('#task-number').text(`#${task.id.slice(1)}`);
  $('#task-category').text(task.category.replaceAll('-', ' '));
  $('#task-difficulty').text(task.difficulty);
  $('#task-input-data').text(exercise.input);
  $('#task-hint').text(exercise.hint);
  $('#task-requirements')
    .empty()
    .append(exercise.requirements.map((text) => element('li', '', text)[0]));
  const data = loadData();
  const saved = data.attempts.find(
    (attempt) => attempt.id === params.get('attempt') && attempt.taskId === task.id,
  );
  input.val(saved?.prompt || data.drafts[task.id] || '');
  const counter = () => $('#char-count').text(`${input.val().length} / ${task.limit}`);
  function showResult(result, score = result.score) {
    $('#final-score').text(score.toFixed(2));
    for (const item of result.criteria) {
      $(`#score-${item.id}`).text(item.score);
      $(`#feedback-${item.id}`).text(
        item.feedback ||
          (item.score === 10
            ? 'Instruction cue found.'
            : 'Add this instruction cue to your prompt.'),
      );
    }
    $('#results-panel').removeClass('is-hidden');
    showMessage('#prompt-success', 'Local demonstration: keyword cues only, not an AI assessment.');
  }
  input.on('input', function () {
    counter();
    hideMessage('#prompt-success');
    hideMessage('#prompt-error');
    $('#results-panel').addClass('is-hidden');
    try {
      saveDraft(task.id, $(this).val());
      $('#draft-status').text('Draft saved in this browser.');
    } catch (error) {
      $('#draft-status').text('Draft not saved. Keep this tab open and retry.');
      pageError(error);
    }
  });
  $('#prompt-form')
    .prop('noValidate', true)
    .on('submit', function (event) {
      event.preventDefault();
      const prompt = input.val();
      if (!prompt.trim() || prompt.length > task.limit) {
        showMessage('#prompt-error', `Enter a prompt of 1–${task.limit} characters.`, true);
        return;
      }
      try {
        const result = evaluatePrompt(prompt);
        saveAttempt(task.id, prompt, result);
        showResult(result);
      } catch (error) {
        showMessage('#prompt-error', error.message, true);
      }
    })
    .on('reset', function () {
      queueMicrotask(() => {
        counter();
        hideMessage('#prompt-success');
        hideMessage('#prompt-error');
        $('#results-panel').addClass('is-hidden');
        try {
          saveDraft(task.id, '');
          $('#draft-status').text('Empty draft saved in this browser.');
        } catch (error) {
          $('#draft-status').text('Draft reset was not saved.');
          pageError(error);
        }
      });
    });
  counter();
  if (saved) {
    const result = evaluatePrompt(saved.prompt);
    result.criteria = result.criteria.map((item) => {
      const stored = Array.isArray(saved.criteria)
        ? saved.criteria.find((criterion) => criterion.id === item.id)
        : saved.criteria?.[item.id];
      return stored ? { ...item, ...stored, id: item.id } : item;
    });
    showResult(result, saved.score);
  }
}
