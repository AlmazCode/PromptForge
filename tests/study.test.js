import test from 'node:test';
import assert from 'node:assert/strict';
import { tasks } from '../js/data.js';
import { evaluatePrompt, filterTasks, bestAttempts } from '../js/logic.js';
import { feedbackErrors, profileErrors } from '../js/validation.js';
import { loadData, writeData } from '../js/storage.js';

const strong =
  'Act as an editor. Write a friendly summary for customers. Return a numbered list in at most 100 words. Example: One clear point.';

test('six explicit cues produce a weighted ten without claiming an AI assessment', () => {
  assert.equal(evaluatePrompt(strong).score, 10);
  assert.equal(evaluatePrompt('hello').score, 0);
  assert.equal(evaluatePrompt('Act as an editor').score, 2);
});

test('catalogue combines filters and history determines checked status', () => {
  assert.deepEqual(
    filterTasks(tasks, { query: 'linkedin', difficulty: 'beginner' }).map((t) => t.id),
    ['t001'],
  );
  assert.equal(filterTasks(tasks, { category: 'translation', difficulty: 'advanced' }).length, 0);
  assert.equal(filterTasks(tasks, { status: 'solved' }, [{ taskId: 't002' }])[0].id, 't002');
  assert.equal(
    bestAttempts([
      { taskId: 't001', score: 8 },
      { taskId: 't001', score: 3 },
    ])[0].score,
    8,
  );
});

test('forms validate trimmed fields, phone digits and independent consent checkboxes', () => {
  const errors = feedbackErrors({ name: '  ', email: 'bad', phone: '-------', message: 'short' });
  assert.deepEqual(Object.keys(errors).sort(), ['email', 'message', 'name', 'phone']);
  assert.deepEqual(
    feedbackErrors({
      name: ' Student ',
      email: 'student@example.com',
      phone: '+7 (701) 123-45-67',
      message: 'A clear message about this exercise.',
    }),
    {},
  );
  const profile = profileErrors(
    {
      name: 'Student',
      email: 'student@example.com',
      password: '12345678',
      password_confirm: '12345678',
      accept_rules: 'on',
    },
    true,
  );
  assert.ok(profile.accept_privacy);
  assert.ok(!profile.accept_rules);
});

test('legacy local results are read and new writes keep only the study state', () => {
  const old = {
    active: true,
    profile: { name: 'Student', email: 'student@example.com', avatarUrl: 'old' },
    attempts: [],
    drafts: { t001: 'draft' },
    used: 10,
    proUntil: 123,
  };
  const values = new Map([['promptforge.frontend-demo.v1', JSON.stringify(old)]]);
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  const data = loadData(storage);
  assert.equal(data.drafts.t001, 'draft');
  assert.deepEqual(data.profile, { name: 'Student', email: 'student@example.com' });
  writeData(data, storage);
  assert.deepEqual(loadData(storage), data);
  assert.ok(values.has('promptforge.frontend-demo.v1'));
});

test('corrupt storage and write failure never claim a saved result', () => {
  assert.throws(() => loadData({ getItem: () => '{bad' }), /storage/i);
  assert.throws(
    () =>
      writeData(
        { profile: null, attempts: [], drafts: {} },
        {
          setItem: () => {
            throw new Error('blocked');
          },
        },
      ),
    /not saved/,
  );
});
