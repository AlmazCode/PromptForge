'use strict';

import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export const DAY = 24 * 60 * 60 * 1000;
export const FREE_LIMIT = 10;

export function openStore(path) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(path);
  db.exec(`
    PRAGMA journal_mode=WAL;
    PRAGMA foreign_keys=ON;
    PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
      password_hash TEXT NOT NULL, bio TEXT NOT NULL DEFAULT '', interest TEXT NOT NULL,
      level TEXT NOT NULL, created_at INTEGER NOT NULL, pro_until INTEGER NOT NULL DEFAULT 0,
      subscription_ref TEXT
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS avatars (
      user_id TEXT PRIMARY KEY REFERENCES users(id), data BLOB NOT NULL, revision TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS usage (
      user_id TEXT PRIMARY KEY REFERENCES users(id), period_start INTEGER NOT NULL, used INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS submissions (
      user_id TEXT NOT NULL REFERENCES users(id), request_id TEXT NOT NULL, status TEXT NOT NULL,
      period_start INTEGER NOT NULL, result TEXT, PRIMARY KEY(user_id, request_id)
    );
    CREATE TABLE IF NOT EXISTS attempts (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), task_id TEXT NOT NULL,
      created_at INTEGER NOT NULL, result TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS drafts (
      user_id TEXT NOT NULL REFERENCES users(id), task_id TEXT NOT NULL, prompt TEXT NOT NULL,
      PRIMARY KEY(user_id, task_id)
    );
    CREATE TABLE IF NOT EXISTS feedback (
      id TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id), created_at INTEGER NOT NULL, message TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS attempts_user ON attempts(user_id, created_at);
  `);
  // Existing accounts stay private until their owner chooses to join the ranking.
  if (!db.prepare('PRAGMA table_info(users)').all().some(column => column.name === 'leaderboard_visible')) {
    db.exec('ALTER TABLE users ADD COLUMN leaderboard_visible INTEGER NOT NULL DEFAULT 0 CHECK(leaderboard_visible IN (0,1))');
  }
  // An interrupted process must release reservations that never produced a saved result.
  db.exec(`BEGIN IMMEDIATE;
    UPDATE usage SET used = MAX(0, used - (SELECT COUNT(*) FROM submissions s
      WHERE s.user_id = usage.user_id AND s.period_start = usage.period_start AND s.status = 'pending'));
    DELETE FROM submissions WHERE status = 'pending';
    DELETE FROM usage WHERE used = 0;
    COMMIT;`);
  return db;
}

export function quotaFor(db, user, now) {
  const row = db.prepare('SELECT * FROM usage WHERE user_id = ?').get(user.id);
  const active = row && now < row.period_start + DAY;
  const pro = user.pro_until > now;
  const used = active ? row.used : 0;
  return { plan: pro ? 'pro' : 'free', limit: pro ? null : FREE_LIMIT, used,
    remaining: pro ? null : Math.max(0, FREE_LIMIT - used), resetsAt: active ? row.period_start + DAY : null,
    proUntil: pro ? user.pro_until : null, reference: user.subscription_ref };
}

export function reserveAttempt(db, user, requestId, now) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const previous = db.prepare('SELECT * FROM submissions WHERE user_id = ? AND request_id = ?').get(user.id, requestId);
    if (previous?.status === 'done') { db.exec('COMMIT'); return { cached: JSON.parse(previous.result) }; }
    if (db.prepare("SELECT 1 FROM submissions WHERE user_id = ? AND status = 'pending'").get(user.id)) {
      throw Object.assign(new Error('A check is already running. Please wait for its result.'), { status: 409 });
    }
    const quota = quotaFor(db, user, now);
    if (quota.plan === 'free' && quota.remaining === 0) {
      throw Object.assign(new Error('You have used all 10 checks in this 24-hour period. Wait for the reset or try Pro.'), { status: 429, code: 'LIMIT_REACHED', quota });
    }
    const periodStart = quota.resetsAt ? quota.resetsAt - DAY : now;
    db.prepare(`INSERT INTO usage(user_id, period_start, used) VALUES (?, ?, 1)
      ON CONFLICT(user_id) DO UPDATE SET period_start = excluded.period_start,
      used = CASE WHEN usage.period_start = excluded.period_start THEN usage.used + 1 ELSE 1 END`).run(user.id, periodStart);
    db.prepare("INSERT INTO submissions(user_id, request_id, status, period_start) VALUES (?, ?, 'pending', ?)").run(user.id, requestId, periodStart);
    db.exec('COMMIT');
    return { periodStart };
  } catch (error) { db.exec('ROLLBACK'); throw error; }
}

export function releaseAttempt(db, userId, requestId) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const row = db.prepare("SELECT * FROM submissions WHERE user_id = ? AND request_id = ? AND status = 'pending'").get(userId, requestId);
    if (row) {
      db.prepare('UPDATE usage SET used = MAX(0, used - 1) WHERE user_id = ? AND period_start = ?').run(userId, row.period_start);
      db.prepare('DELETE FROM usage WHERE user_id = ? AND used = 0').run(userId);
      db.prepare('DELETE FROM submissions WHERE user_id = ? AND request_id = ?').run(userId, requestId);
    }
    db.exec('COMMIT');
  } catch (error) { db.exec('ROLLBACK'); throw error; }
}

export function completeAttempt(db, userId, requestId, result) {
  db.exec('BEGIN IMMEDIATE');
  try {
    db.prepare('INSERT INTO attempts(id,user_id,task_id,created_at,result) VALUES(?,?,?,?,?)')
      .run(result.id, userId, result.taskId, result.createdAt, JSON.stringify(result));
    db.prepare("UPDATE submissions SET status = 'done', result = ? WHERE user_id = ? AND request_id = ?")
      .run(JSON.stringify(result), userId, requestId);
    db.exec('COMMIT');
  } catch (error) { db.exec('ROLLBACK'); throw error; }
}
