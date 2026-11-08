import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { tasks } from '../js/data.js';
import { exercises } from '../js/exercises.js';

const files = (folder) =>
  readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const path = `${folder}/${entry.name}`;
    return entry.isDirectory() ? files(path) : [path];
  });

test('every exercise has an individual source, requirements and a hint', () => {
  assert.equal(tasks.length, 16);
  assert.equal(new Set(tasks.map((task) => task.id)).size, 16);
  for (const task of tasks) {
    assert.ok(exercises[task.id].input);
    assert.ok(exercises[task.id].requirements.length);
    assert.ok(exercises[task.id].hint);
  }
});

test('all active JavaScript files are small and their static imports exist', () => {
  for (const path of files('js').filter(
    (path) => path.endsWith('.js') && !path.includes('/archive/'),
  )) {
    const code = readFileSync(path, 'utf8');
    assert.ok(code.split('\n').length <= 200, `${path} should stay small enough to explain`);
    for (const match of code.matchAll(
      /(?:import|export)\s+[\s\S]*?\sfrom\s+['"](\.\.?\/[^'"]+)['"]/g,
    )) {
      assert.ok(existsSync(resolve(dirname(path), match[1])), `${path}: ${match[1]}`);
    }
  }
});

test('nine pages load pinned jQuery and the app without inline handlers or retired scripts', () => {
  const pages = [
    'index.html',
    'tasks.html',
    'task.html',
    'login.html',
    'register.html',
    'profile.html',
    'my-solutions.html',
    'leaderboard.html',
    'how-it-works.html',
  ];
  const integrity =
    'sha256-' +
    createHash('sha256').update(readFileSync('vendor/jquery/jquery-3.7.1.min.js')).digest('base64');
  for (const path of pages) {
    const html = readFileSync(path, 'utf8');
    assert.ok(html.includes(integrity), path);
    assert.ok(html.indexOf('code.jquery.com') < html.indexOf('src="js/main.js"'), path);
    assert.equal((html.match(/<script\b/g) || []).length, 2, path);
    assert.ok(!/\son(?:click|submit|change|input)=/i.test(html), path);
    assert.ok(!html.includes('old-js-version.js'), path);
    for (const match of html.matchAll(/(?:src|href)="((?:js|styles|vendor|src)\/[^"?#]+)"/g)) {
      assert.ok(existsSync(match[1]), `${path}: ${match[1]}`);
    }
  }
});
