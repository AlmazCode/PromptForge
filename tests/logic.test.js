'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { tasks } from '../js/data.js';
import { exercises } from '../js/exercises.js';
import { rubric, weightedScore, progress, filterTasks, recommendTask, registrationErrors } from '../js/logic.js';
import { evaluatePrompt } from '../server/openai.js';

test('every linked exercise has its own complete content and usable filters', () => {
  assert.equal(tasks.length, 16); assert.equal(new Set(tasks.map(t => t.id)).size, 16);
  for (const task of tasks) { assert.ok(exercises[task.id].input); assert.ok(exercises[task.id].requirements.length >= 4); assert.ok(exercises[task.id].examples.length); }
  assert.deepEqual(filterTasks(tasks, { category: 'copywriting', difficulty: 'beginner', query: 'linkedin' }).map(t => t.id), ['t001']);
  assert.equal(filterTasks(tasks, { category: 'translation', difficulty: 'advanced' }).length, 0);
  assert.deepEqual(filterTasks(tasks, { status: 'active' }, [], { t003: 'A draft' }).map(t => t.id), ['t003']);
  assert.equal(recommendTask(tasks, tasks.slice(0, 15).map(t => ({ taskId: t.id }))).id, 't016');
});

test('scores use fixed weights; progress counts only the best result per exercise', () => {
  const values = [10, 8, 6, 10, 8, 9];
  assert.equal(weightedScore(Object.fromEntries(rubric.map((c, i) => [c.id, { score: values[i] }]))), 8.6);
  const summary = progress([{ taskId: 't001', score: 8 }, { taskId: 't001', score: 3 }, { taskId: 't002', score: 9 }]);
  assert.equal(summary.points, 17); assert.equal(summary.solved, 2); assert.equal(summary.attempts, 3);
  assert.equal(progress(Array.from({ length: 16 }, (_, i) => ({ taskId: String(i), score: 10 }))).tier, 'Grandmaster');
});

test('registration catches whitespace, password mismatch and combined field rules', () => {
  const errors = registrationErrors({ full_name: '  ', email: 'bad', password: 'short', password_confirm: 'other', interest_area: '', level: '', experience_years: '-1', birth_date: '2999-01-01' });
  for (const field of ['full_name','email','password','password_confirm','interest_area','level','experience_years','birth_date','accept_rules','accept_privacy']) assert.ok(errors[field]);
});

test('OpenAI adapter sends structured schema, extracts output and recalculates the score', async () => {
  const evaluation = { criteria: Object.fromEntries(rubric.map(c => [c.id, { score: 8, feedback: 'A specific suggestion.' }])), summary: 'Improve examples.' };
  const result = await evaluatePrompt({ task: tasks[0], exercise: exercises.t001, prompt: 'My prompt', locale: 'kk', apiKey: 'test-secret', model: 'test-model', fetcher: async (url, request) => {
    assert.equal(url, 'https://api.openai.com/v1/responses');
    const payload = JSON.parse(request.body);
    assert.equal(payload.store, false); assert.equal(payload.text.format.strict, true);
    assert.equal(payload.text.format.schema.properties.criteria.required.length, 6);
    assert.match(payload.instructions, /in Kazakh/);
    assert.equal(request.headers.Authorization, 'Bearer test-secret');
    return new Response(JSON.stringify({ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify(evaluation) }] }] }));
  } });
  assert.equal(result.score, 8);
});

test('OpenAI adapter rejects refusals, incomplete and malformed results', async () => {
  for (const body of [
    { status: 'incomplete', output: [] },
    { status: 'completed', output: [{ content: [{ type: 'refusal', refusal: 'No' }] }] },
    { status: 'completed', output: [{ content: [{ type: 'output_text', text: '{"criteria":{}}' }] }] }
  ]) await assert.rejects(evaluatePrompt({ task: tasks[0], exercise: exercises.t001, prompt: 'test', apiKey: 'test', model: 'test', fetcher: async () => new Response(JSON.stringify(body)) }));
});
