'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { tasks } from '../js/data.js';
import { rubric, progress, taskStatus, filterTasks } from '../js/logic.js';
import { routes, routeProgress, recommendTraining, nextRouteTask, attemptTimeline, promptDiff, compareScores } from '../js/training.js';

const attempt = (taskId, score, createdAt = 1, id = `${taskId}-${createdAt}`) => ({ taskId, score, createdAt, id,
  criteria: Object.fromEntries(rubric.map(item => [item.id, { score }])) });

test('learning routes cover all exercises once and start with approachable steps', () => {
  const ids = routes.flatMap(route => route.taskIds);
  assert.equal(new Set(ids).size, tasks.length);
  assert.deepEqual([...ids].sort(), tasks.map(task => task.id).sort());
  for (const route of routes) assert.notEqual(tasks.find(task => task.id === route.taskIds[0]).difficulty, 'advanced');
});

test('mastery is earned at eight, survives lower attempts, and recalculates after deletion', () => {
  const low = attempt('t001', 7.99); const high = attempt('t001', 8, 2); const later = attempt('t001', 2, 3);
  assert.equal(taskStatus('t001', [], {}), 'available');
  assert.equal(taskStatus('t001', [], { t001: 'draft' }), 'active');
  assert.equal(taskStatus('t001', [low], { t001: 'draft' }), 'needs-work');
  assert.equal(taskStatus('t001', [later, high, low]), 'mastered');
  assert.equal(progress([later, high, low]).mastered, 1);
  assert.equal(progress([later, low]).mastered, 0);
  assert.equal(progress([later, low]).checked, 1);
  assert.equal(taskStatus('t001', [later, low]), 'needs-work');
  assert.deepEqual(filterTasks(tasks, { status: 'mastered' }, [high]).map(task => task.id), ['t001']);
  assert.deepEqual(filterTasks(tasks, { status: 'needs-work' }, [low]).map(task => task.id), ['t001']);
  assert.equal(filterTasks(tasks, { status: 'solved' }, [low]).length, 1);
});

test('recommendations resume drafts, follow the active route and handle complete routes', () => {
  assert.equal(recommendTraining([], {}, 'data-analysis').task.id, 't012');
  const history = [attempt('t012', 8, 1), attempt('t002', 7, 2)];
  assert.equal(recommendTraining(history).task.id, 't002');
  assert.equal(recommendTraining(history, { t013: 'unfinished draft' }).task.id, 't013');
  assert.equal(routeProgress(routes[1], history).mastered, 1);
  assert.equal(nextRouteTask('t012', history).id, 't002');
  const finished = tasks.map(task => attempt(task.id, 8));
  assert.equal(recommendTraining(finished, { t001: 'old mastered draft' }), null);
  assert.equal(nextRouteTask('t001', finished), null);
  assert.equal(routeProgress(routes[0], finished).next, null);
  assert.equal(recommendTraining(finished.filter(item => item.taskId !== 't005')).task.id, 't005');
});

test('comparison orders only the chosen exercise and calculates positive, negative and unchanged criteria', () => {
  const before = attempt('t001', 4.8, 1, 'a'); const after = attempt('t001', 8.15, 2, 'b');
  before.criteria.role.score = 9; after.criteria.role.score = 7;
  after.criteria.tone.score = before.criteria.tone.score;
  const history = [after, attempt('t002', 10, 3), before];
  assert.deepEqual(attemptTimeline(history, 't001').map(item => item.id), ['a', 'b']);
  assert.deepEqual(attemptTimeline([attempt('t001', 8, 1, 'new'), before], 't001').map(item => item.id), ['a', 'new']);
  const result = compareScores(before, after);
  assert.equal(result.delta, 3.35); assert.equal(result.criteria.length, 6);
  assert.equal(result.criteria.find(item => item.id === 'role').delta, -2);
  assert.equal(result.criteria.find(item => item.id === 'tone').delta, 0);
  assert.equal(compareScores(after, before).delta, -3.35);
});

test('prompt differences preserve Unicode, whitespace and markup as literal text', () => {
  for (const [before, after] of [
    ['Вы — аналитик.\nҚысқа жауап.', 'Вы — аналитик.\nҚысқа әрі нақты жауап.'],
    ['  a\t🙂\n', '  b\t🙂\n'], ['', 'new'], ['old', ''], ['same\ntext', 'same\ntext'],
    ['<img src=x onerror=alert(1)>', '<script>alert(2)</script>'],
    ['! '.repeat(1000), '? '.repeat(1000)]
  ]) {
    const result = promptDiff(before, after);
    assert.equal(result.before.map(segment => segment.text).join(''), before);
    assert.equal(result.after.map(segment => segment.text).join(''), after);
    assert.equal(result.identical, before === after);
  }
  const changed = promptDiff('Write a short answer.', 'Write a detailed answer.');
  assert.equal(changed.before.filter(segment => segment.changed).map(segment => segment.text).join(''), 'short');
  assert.equal(changed.after.filter(segment => segment.changed).map(segment => segment.text).join(''), 'detailed');
});
