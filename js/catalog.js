'use strict';

import { tasks } from './data.js';
import { filterTasks } from './logic.js';
import { loadData } from './storage.js';
import { $, element } from './jquery-ui.js';
export function init() {
  function render() {
    const filters = { query: $('#task-search').val() };
    for (const key of ['category', 'difficulty', 'status', 'sort'])
      filters[key] = $(`#catalog-${key}`).val();
    const matches = filterTasks(tasks, filters, loadData().attempts);
    const grid = $('#task-grid').empty();
    for (const task of matches) {
      const color = { beginner: 'success', intermediate: 'warning', advanced: 'danger' }[
        task.difficulty
      ];
      const card = element('article', 'col', '', { 'data-task-id': task.id });
      const body = element('div', 'border-top h-100 py-3 d-flex flex-column');
      body.append(
        element('p', `small text-${color}`, task.difficulty),
        element('h2', 'h5', task.title),
        element('p', 'text-body-secondary flex-grow-1', task.description),
        element('p', 'small text-body-secondary', task.tags.join(' · ')),
        element(
          'button',
          'exercise-start btn btn-outline-light align-self-start',
          'Start exercise',
          { type: 'button' },
        ),
      );
      card.append(body).attr('aria-label', task.title).appendTo(grid);
    }
    $('#catalog-results-status').text(`${matches.length} of ${tasks.length} exercises`);
    $('#catalog-empty').toggleClass('is-hidden', matches.length > 0);
  }
  $('#task-search').on('input', render);
  $('select[id^="catalog-"]').on('change', render);
  $('[data-action="clear-filters"]').on('click', function () {
    $('#task-search').val('');
    for (const key of ['category', 'difficulty', 'status']) $(`#catalog-${key}`).val('all');
    $('#catalog-sort').val('catalog');
    render();
  });
  $('#task-grid').on('click', '.exercise-start', function () {
    const id = $(this).closest('[data-task-id]').attr('data-task-id');
    location.assign(`task.html?id=${id}`);
  });
  render();
}
