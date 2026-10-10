'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { openStore, quotaFor, reserveAttempt, completeAttempt } from '../server/store.js';
import { DatabaseSync } from 'node:sqlite';

test('existing databases gain private-by-default ranking participation without losing accounts', t => {
  const directory = mkdtempSync(join(tmpdir(), 'promptforge-migration-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const path = join(directory, 'old.sqlite');
  const old = new DatabaseSync(path);
  old.exec("CREATE TABLE users(id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, password_hash TEXT NOT NULL, bio TEXT NOT NULL DEFAULT '', interest TEXT NOT NULL, level TEXT NOT NULL, created_at INTEGER NOT NULL, pro_until INTEGER NOT NULL DEFAULT 0, subscription_ref TEXT)");
  old.prepare('INSERT INTO users(id,email,name,password_hash,interest,level,created_at) VALUES(?,?,?,?,?,?,?)').run('old-user','old@example.com','Existing account','test-hash','copywriting','beginner',1000);
  old.close();
  let migrated = openStore(path);
  assert.equal(migrated.prepare('SELECT leaderboard_visible FROM users').get().leaderboard_visible,0);
  assert.equal(migrated.prepare('SELECT name FROM users').get().name,'Existing account');
  assert.equal(migrated.prepare('SELECT COUNT(*) AS count FROM avatars').get().count,0);
  migrated.prepare('INSERT INTO avatars VALUES(?,?,?)').run('old-user',Buffer.from('saved thumbnail'),'revision');
  migrated.prepare('UPDATE users SET leaderboard_visible=1').run();migrated.close();
  migrated = openStore(path);
  assert.equal(migrated.prepare('SELECT leaderboard_visible FROM users').get().leaderboard_visible,1);
  assert.equal(Buffer.from(migrated.prepare('SELECT data FROM avatars').get().data).toString(),'saved thumbnail');
  migrated.close();
});

test('SQLite preserves completed history and quota while recovering an interrupted reservation', t => {
  const directory = mkdtempSync(join(tmpdir(), 'promptforge-test-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const path = join(directory, 'test.sqlite');
  let db = openStore(path);
  db.prepare('INSERT INTO users(id,email,name,password_hash,interest,level,created_at) VALUES(?,?,?,?,?,?,?)').run('user', 'test@example.com', 'Test', 'test-hash', 'copywriting', 'beginner', 1000);
  const user = db.prepare('SELECT * FROM users').get();
  reserveAttempt(db, user, 'done-request', 1000);
  completeAttempt(db, user.id, 'done-request', { id: 'attempt', taskId: 't001', score: 8, createdAt: 1001 });
  reserveAttempt(db, user, 'interrupted-request', 1002);
  assert.equal(quotaFor(db, user, 1003).used, 2); db.close();
  db = openStore(path);
  assert.equal(quotaFor(db, user, 1004).used, 1);
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM attempts').get().count, 1);
  assert.equal(db.prepare("SELECT COUNT(*) AS count FROM submissions WHERE status = 'pending'").get().count, 0);
  db.close();
});
