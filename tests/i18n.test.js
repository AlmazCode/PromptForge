'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { tasks } from '../js/data.js';
import { exercises } from '../js/exercises.js';
import { messages } from '../js/locales/messages.js';
import { normalizeLocale, t, phrase, localizedTask, localizedExercise, localeTag } from '../js/i18n.js';
import { filterTasks } from '../js/logic.js';

test('language codes, regional browser preferences and nested phrases resolve consistently', () => {
  assert.equal(normalizeLocale('RU-ru'), 'ru'); assert.equal(normalizeLocale('kk-KZ'), 'kk');
  assert.equal(normalizeLocale('KZ'), 'kk'); assert.equal(normalizeLocale('fr-FR'), 'en');
  assert.equal(localeTag('kk'), 'kk-KZ');
  assert.equal(t(phrase('Try: {title}', { title: phrase(tasks[1].title) }), {}, 'ru'), 'Попробовать: Сводка продаж');
  assert.equal(t('Search: {query}', { query: '<img src=x> {title}' }, 'ru'), 'Поиск: <img src=x> {title}');
  assert.equal(t('User text with no dictionary key', {}, 'kk'), 'User text with no dictionary key');
});

test('translations preserve placeholders and cover all exercise content without changing practice inputs', () => {
  const placeholders = value => [...value.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map(match => match[1]).sort();
  for (const [source, translated] of Object.entries(messages)) {
    assert.equal(translated.length, 2);
    for (const value of translated) { assert.ok(value.trim(), source); assert.deepEqual(placeholders(value), placeholders(source), source); }
  }
  for (const locale of ['ru', 'kk']) for (const task of tasks) {
    const translated = localizedTask(task, locale); const exercise = localizedExercise(task.id, exercises[task.id], locale);
    assert.notEqual(translated.title, task.title); assert.notEqual(translated.description, task.description);
    assert.equal(translated.category, task.category); assert.equal(translated.limit, task.limit);
    assert.equal(exercise.input, exercises[task.id].input);
    assert.equal(exercise.requirements.length, exercises[task.id].requirements.length);
    assert.equal(exercise.examples.length, exercises[task.id].examples.length); assert.notEqual(exercise.hint, exercises[task.id].hint);
  }
  assert.equal(filterTasks(tasks.map(task => localizedTask(task, 'ru')), { query: 'Сводка продаж' })[0].id, 't002');
  assert.equal(filterTasks(tasks.map(task => localizedTask(task, 'kk')), { query: 'LinkedIn' })[0].id, 't001');
});
