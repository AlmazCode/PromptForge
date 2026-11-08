'use strict';

import { tasks } from './data.js';
import { bestAttempts } from './logic.js';
import { loadData } from './storage.js';
import { $, element } from './jquery-ui.js';
export function init() {
  const best = bestAttempts(loadData().attempts);
  const body = $('#leaderboard-body').empty();
  const total = best.reduce((sum, attempt) => sum + attempt.score, 0);
  $('#leaderboard-total-points').text(total.toFixed(2));
  for (const attempt of best) {
    const task = tasks.find((item) => item.id === attempt.taskId);
    element('tr')
      .append(
        element('td', '', task?.title || attempt.taskId),
        element('td', 'font-monospace', attempt.score.toFixed(2)),
        element('td').append(
          element('a', 'link-body-emphasis', 'Practise', {
            href: `task.html?id=${attempt.taskId}`,
          }),
        ),
      )
      .appendTo(body);
  }
  if (!best.length)
    body.append(
      element('tr').append(
        element('td', 'text-body-secondary', 'No attempts yet.', { colspan: 3 }),
      ),
    );
}
