'use strict';

import { tasks } from './data.js';
import { loadData, deleteAttempt } from './storage.js';
import { $, element, pageError } from './jquery-ui.js';
export function init() {
  function render() {
    const { attempts } = loadData();
    const body = $('#solutions-body').empty();
    $('#solutions-attempt-count').text(`${attempts.length} attempts`);
    for (const attempt of attempts) {
      const task = tasks.find((item) => item.id === attempt.taskId);
      const actions = element('td');
      actions.append(
        element('a', 'btn btn-outline-light btn-sm me-2', 'Review', {
          href: `task.html?id=${attempt.taskId}&attempt=${attempt.id}`,
          'data-action': 'review-attempt',
        }),
        element('button', 'btn btn-outline-danger btn-sm', 'Delete', {
          type: 'button',
          'data-action': 'delete-attempt',
        }),
      );
      element('tr', '', '', { 'data-attempt-id': attempt.id })
        .append(
          element('td', '', task?.title || attempt.taskId),
          element('td', 'font-monospace', attempt.score.toFixed(2)),
          element('td', 'small', new Date(attempt.createdAt).toLocaleString()),
          actions,
        )
        .appendTo(body);
    }
    if (!attempts.length)
      body.append(
        element('tr').append(
          element('td', 'text-body-secondary', 'No attempts yet. Choose an exercise.', {
            colspan: 4,
          }),
        ),
      );
  }
  $('#solutions-body').on('click', '[data-action="delete-attempt"]', function () {
    if (!window.confirm('Delete this saved attempt?')) return;
    try {
      deleteAttempt($(this).closest('tr').attr('data-attempt-id'));
      render();
    } catch (error) {
      pageError(error);
    }
  });
  render();
}
