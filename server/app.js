'use strict';

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { randomBytes, randomUUID, createHash, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { tasks } from '../js/data.js';
import { exercises } from '../js/exercises.js';
import { registrationErrors, validEmail, passwordChecks, interestAreas, experienceLevels } from '../js/logic.js';
import { openStore, quotaFor, reserveAttempt, releaseAttempt, completeAttempt, DAY } from './store.js';
import { evaluatePrompt, validateEvaluation } from './openai.js';
import { readLeaderboard } from './leaderboard.js';
import { AVATAR_BYTES, validAvatar } from './avatar.js';

const scrypt = promisify(scryptCallback);
const hash = text => createHash('sha256').update(text).digest('hex');
const fail = (status, message, extras = {}) => Object.assign(new Error(message), { status, ...extras });
const json = (res, status, value) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(value)); };

async function readBody(req) {
  if (!req.headers['content-type']?.startsWith('application/json')) throw fail(415, 'Send JSON data.');
  let body = '';
  for await (const chunk of req) { body += chunk; if (Buffer.byteLength(body) > 20000) throw fail(413, 'The request is too large.'); }
  try { const value = JSON.parse(body); if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error(); return value; }
  catch { throw fail(400, 'Invalid JSON request.'); }
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, bio: user.bio, interest: user.interest, level: user.level, leaderboardVisible: Boolean(user.leaderboard_visible) };
}

export function createApp(options = {}) {
  const root = resolve(options.root || '.');
  const db = openStore(options.database || '.data/promptforge.sqlite');
  const clock = options.clock || Date.now;
  const apiKey = options.apiKey || '';
  const model = options.model || 'gpt-4.1-mini';
  const demoBilling = options.demoBilling === true;
  const secureCookie = options.secureCookie === true;
  const evaluator = options.evaluate || evaluatePrompt;
  const authHits = new Map();
  const credentialHits = new Map();
  const sessionCookie = token => `pf_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${7 * DAY / 1000}${secureCookie ? '; Secure' : ''}`;

  function getUser(req) {
    const token = (req.headers.cookie || '').split(';').map(item => item.trim()).find(item => item.startsWith('pf_session='))?.slice(11);
    if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
    return db.prepare('SELECT u.* FROM users u JOIN sessions s ON s.user_id = u.id WHERE s.token_hash = ? AND s.expires_at > ?').get(hash(token), clock()) || null;
  }
  function requireUser(req) { const user = getUser(req); if (!user) throw fail(401, 'Log in to save your progress and use your daily checks.'); return user; }
  function startSession(res, userId) {
    const token = randomBytes(32).toString('hex');
    db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(clock());
    db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(hash(token), userId, clock() + 7 * DAY);
    res.setHeader('Set-Cookie', sessionCookie(token));
  }
  function throttleAuth(req) {
    const now = clock();
    for (const [key, value] of authHits) if (value.until <= now) authHits.delete(key);
    const key = req.socket.remoteAddress || 'local';
    const bucket = authHits.get(key) || { count: 0, until: now + 10 * 60 * 1000 };
    bucket.count += 1; authHits.set(key, bucket);
    if (bucket.count > 30) throw fail(429, 'Too many account requests. Please try again in 10 minutes.');
  }
  async function confirmPassword(user, password) {
    const now = clock();
    for (const [id, bucket] of credentialHits) if (bucket.until <= now) credentialHits.delete(id);
    const bucket = credentialHits.get(user.id) || { count: 0, until: now + 10 * 60 * 1000 };
    bucket.count++; credentialHits.set(user.id, bucket);
    if (bucket.count > 10) throw fail(429, 'Too many password attempts. Try again in 10 minutes.');
    if (typeof password !== 'string' || !password || password.length > 128) throw fail(422, 'Enter your current password.', { fields: { current_password: 'Enter your current password.' } });
    const [salt, encoded] = user.password_hash.split(':');
    const actual = await scrypt(password, salt, 64);
    if (!timingSafeEqual(actual, Buffer.from(encoded, 'hex'))) throw fail(403, 'Your current password is incorrect.', { fields: { current_password: 'Your current password is incorrect.' } });
  }
  function changeCredentials(req, res, user, update) {
    db.exec('BEGIN IMMEDIATE');
    try {
      const current = getUser(req);
      if (!current || current.password_hash !== user.password_hash || current.email !== user.email) throw fail(409, 'Your account changed in another session. Reload the page.');
      update();
      db.prepare('DELETE FROM sessions WHERE user_id = ?').run(user.id);
      startSession(res, user.id);
      db.exec('COMMIT');
    } catch (error) { db.exec('ROLLBACK'); throw error; }
    return state(db.prepare('SELECT * FROM users WHERE id = ?').get(user.id));
  }
  function state(user) {
    const avatar = user ? db.prepare('SELECT revision FROM avatars WHERE user_id = ?').get(user.id) : null;
    return { user: user ? { ...publicUser(user), avatarUrl: avatar ? `/api/profile/avatar?v=${avatar.revision}` : null } : null, quota: user ? quotaFor(db, user, clock()) : null,
      attempts: user ? db.prepare('SELECT result FROM attempts WHERE user_id = ? ORDER BY created_at DESC, rowid DESC').all(user.id).map(row => JSON.parse(row.result)) : [],
      drafts: user ? Object.fromEntries(db.prepare('SELECT task_id,prompt FROM drafts WHERE user_id = ?').all(user.id).map(row => [row.task_id, row.prompt])) : {},
      aiReady: Boolean(apiKey), model, demoBilling, serverTime: clock() };
  }

  const server = createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'same-origin');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
    try {
      const url = new URL(req.url, 'http://localhost');
      const path = url.pathname;
      if (!path.startsWith('/api/')) {
        if (req.method !== 'GET' && req.method !== 'HEAD') throw fail(405, 'Method not allowed.');
        const relative = decodeURIComponent(path === '/' ? '/index.html' : path).slice(1);
        if (relative.split('/').some(segment => segment === '..' || segment === '.')) throw fail(404, 'Page not found.');
        if (!/^(?:[a-z-]+\.html|(?:js|styles|src|vendor|screenshots)\/[A-Za-z0-9_./-]+)$/.test(relative)) throw fail(404, 'Page not found.');
        const file = resolve(root, relative);
        if (!file.startsWith(root + sep)) throw fail(404, 'Page not found.');
        const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.txt': 'text/plain' }[extname(file)];
        if (!mime) throw fail(404, 'Page not found.');
        const data = await readFile(file).catch(() => { throw fail(404, 'Page not found.'); });
        res.writeHead(200, { 'Content-Type': `${mime}${['.html', '.js', '.css'].includes(extname(file)) ? '; charset=utf-8' : ''}`, 'Cache-Control': 'no-cache' });
        res.end(req.method === 'HEAD' ? undefined : data); return;
      }
      if (!['GET', 'HEAD'].includes(req.method)) {
        const origin = req.headers.origin;
        if ((origin && origin !== `http://${req.headers.host}` && origin !== `https://${req.headers.host}`) || req.headers['sec-fetch-site'] === 'cross-site') throw fail(403, 'Cross-site requests are not allowed.');
      }
      if (path === '/api/state' && req.method === 'GET') { json(res, 200, state(getUser(req))); return; }
      if (path === '/api/profile/avatar' && req.method === 'GET') {
        const user = requireUser(req);
        const avatar = db.prepare('SELECT data FROM avatars WHERE user_id = ?').get(user.id);
        if (!avatar) throw fail(404, 'No avatar has been uploaded.');
        res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'private, no-store' });
        res.end(avatar.data); return;
      }
      if (path === '/api/profile/avatar' && req.method === 'PUT') {
        const user = requireUser(req);
        if (req.headers['content-type'] !== 'image/jpeg') throw fail(415, 'Upload a JPEG thumbnail from the profile editor.');
        const chunks = []; let size = 0;
        for await (const chunk of req) {
          size += chunk.length;
          if (size > AVATAR_BYTES) throw fail(413, 'The avatar is too large. Choose another image.');
          chunks.push(chunk);
        }
        const data = Buffer.concat(chunks);
        if (!validAvatar(data)) throw fail(422, 'The avatar could not be read. Choose another image.');
        db.prepare('INSERT INTO avatars(user_id,data,revision) VALUES(?,?,?) ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, revision = excluded.revision')
          .run(user.id, data, randomUUID());
        json(res, 200, state(user)); return;
      }
      if (path === '/api/profile/avatar' && req.method === 'DELETE') {
        const user = requireUser(req); await readBody(req);
        db.prepare('DELETE FROM avatars WHERE user_id = ?').run(user.id);
        json(res, 200, state(user)); return;
      }
      if (path === '/api/leaderboard' && req.method === 'GET') {
        const rawOffset = url.searchParams.get('offset') || '0';
        if (!/^\d{1,7}$/.test(rawOffset)) throw fail(422, 'Choose a valid ranking page.');
        json(res, 200, { ...readLeaderboard(db, getUser(req)?.id, Number(rawOffset)), updatedAt: clock() }); return;
      }
      if (path === '/api/register' && req.method === 'POST') {
        throttleAuth(req);
        const body = await readBody(req);
        const errors = registrationErrors(body);
        if (body.leaderboard_visible !== undefined && ![true, false, 'on'].includes(body.leaderboard_visible)) errors.leaderboard_visible = 'Choose whether to join the leaderboard.';
        if (Object.keys(errors).length) throw fail(422, 'Please correct the highlighted fields.', { fields: errors });
        const email = body.email.trim().toLowerCase();
        if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(email)) throw fail(409, 'An account already uses this email.', { fields: { email: 'This email is already registered. Try logging in.' } });
        const salt = randomBytes(16).toString('hex');
        const passwordHash = `${salt}:${(await scrypt(body.password, salt, 64)).toString('hex')}`;
        const id = randomUUID();
        try {
          db.prepare('INSERT INTO users(id,email,name,password_hash,bio,interest,level,created_at,leaderboard_visible) VALUES(?,?,?,?,?,?,?,?,?)')
            .run(id, email, body.full_name.trim(), passwordHash, (body.bio || '').trim(), body.interest_area, body.level, clock(), body.leaderboard_visible === true || body.leaderboard_visible === 'on' ? 1 : 0);
        } catch (error) {
          if (String(error.message).includes('UNIQUE')) throw fail(409, 'This email is already registered.', { fields: { email: 'Try logging in instead.' } });
          throw error;
        }
        startSession(res, id);
        json(res, 201, state(db.prepare('SELECT * FROM users WHERE id = ?').get(id))); return;
      }
      if (path === '/api/login' && req.method === 'POST') {
        throttleAuth(req);
        const body = await readBody(req);
        if (!validEmail(body.email) || typeof body.password !== 'string' || body.password.length > 128) throw fail(422, 'Enter a valid email and password.');
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(body.email.trim().toLowerCase());
        const [salt, encoded] = (user?.password_hash || '00000000000000000000000000000000:' + '00'.repeat(64)).split(':');
        const actual = await scrypt(body.password, salt, 64);
        const latest = user ? db.prepare('SELECT password_hash,email FROM users WHERE id = ?').get(user.id) : null;
        if (!user || !timingSafeEqual(actual, Buffer.from(encoded, 'hex')) || latest?.password_hash !== user.password_hash || latest?.email !== user.email) throw fail(401, 'Email or password is incorrect.');
        startSession(res, user.id); json(res, 200, state(user)); return;
      }
      if (path === '/api/logout' && req.method === 'POST') {
        await readBody(req);
        const token = (req.headers.cookie || '').match(/(?:^|;\s*)pf_session=([a-f0-9]{64})(?:;|$)/)?.[1];
        if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hash(token));
        res.setHeader('Set-Cookie', 'pf_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
        json(res, 200, state(null)); return;
      }
      if (path === '/api/profile' && req.method === 'PATCH') {
        const user = requireUser(req); const body = await readBody(req);
        const name = body.name === undefined ? user.name : body.name;
        const bio = body.bio === undefined ? user.bio : body.bio;
        if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80 || typeof bio !== 'string' || bio.length > 1000) throw fail(422, 'Use a name of 2–80 characters and a bio up to 1,000 characters.');
        if (body.leaderboardVisible !== undefined && typeof body.leaderboardVisible !== 'boolean') throw fail(422, 'Choose whether to join the leaderboard.');
        if (body.interest !== undefined && !interestAreas.includes(body.interest)) throw fail(422, 'Choose a skill area.', { fields: { interest: 'Choose a skill area.' } });
        if (body.level !== undefined && !experienceLevels.includes(body.level)) throw fail(422, 'Choose your experience level.', { fields: { level: 'Choose your experience level.' } });
        db.prepare('UPDATE users SET name = ?, bio = ?, leaderboard_visible = ?, interest = ?, level = ? WHERE id = ?')
          .run(name.trim(), bio.trim(), body.leaderboardVisible === undefined ? user.leaderboard_visible : Number(body.leaderboardVisible), body.interest ?? user.interest, body.level ?? user.level, user.id);
        json(res, 200, state(db.prepare('SELECT * FROM users WHERE id = ?').get(user.id))); return;
      }
      if (path === '/api/account/email' && req.method === 'PATCH') {
        const user = requireUser(req); const body = await readBody(req);
        if (!validEmail(body.email)) throw fail(422, 'Enter a valid email address.', { fields: { email: 'Enter a valid email address.' } });
        const email = body.email.trim().toLowerCase();
        if (email === user.email) throw fail(422, 'Enter a different email address.', { fields: { email: 'Enter a different email address.' } });
        await confirmPassword(user, body.current_password);
        if (db.prepare('SELECT 1 FROM users WHERE email = ? AND id <> ?').get(email, user.id)) throw fail(409, 'This email is already registered.', { fields: { email: 'This email is already registered.' } });
        const result = changeCredentials(req, res, user, () => db.prepare('UPDATE users SET email = ? WHERE id = ?').run(email, user.id));
        json(res, 200, result); return;
      }
      if (path === '/api/account/password' && req.method === 'PATCH') {
        const user = requireUser(req); const body = await readBody(req); const fields = {};
        if (typeof body.new_password !== 'string' || !Object.values(passwordChecks(body.new_password)).every(Boolean)) fields.new_password = 'Use 8–128 characters, uppercase, lowercase, a digit and a special character.';
        if (body.new_password !== body.password_confirm) fields.password_confirm = 'Passwords must match exactly.';
        if (Object.keys(fields).length) throw fail(422, 'Please correct the highlighted fields.', { fields });
        await confirmPassword(user, body.current_password);
        if (body.new_password === body.current_password) throw fail(422, 'Choose a password different from your current password.', { fields: { new_password: 'Choose a password different from your current password.' } });
        const salt = randomBytes(16).toString('hex');
        const passwordHash = `${salt}:${(await scrypt(body.new_password, salt, 64)).toString('hex')}`;
        const result = changeCredentials(req, res, user, () => db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, user.id));
        json(res, 200, result); return;
      }
      if (path === '/api/account/sessions' && req.method === 'DELETE') {
        const user = requireUser(req); await readBody(req);
        const token = (req.headers.cookie || '').match(/(?:^|;\s*)pf_session=([a-f0-9]{64})(?:;|$)/)?.[1];
        const result = db.prepare('DELETE FROM sessions WHERE user_id = ? AND token_hash <> ? AND expires_at > ?').run(user.id, hash(token), clock());
        json(res, 200, { ended: result.changes }); return;
      }
      if (path.startsWith('/api/drafts/') && req.method === 'PUT') {
        const user = requireUser(req); const id = path.split('/').at(-1); const body = await readBody(req);
        const task = tasks.find(item => item.id === id);
        if (!task || typeof body.prompt !== 'string' || body.prompt.length > task.limit) throw fail(422, 'Invalid task or draft length.');
        if (!body.prompt.trim()) db.prepare('DELETE FROM drafts WHERE user_id = ? AND task_id = ?').run(user.id, id);
        else db.prepare('INSERT INTO drafts VALUES(?,?,?) ON CONFLICT(user_id,task_id) DO UPDATE SET prompt = excluded.prompt').run(user.id, id, body.prompt);
        json(res, 200, { saved: true }); return;
      }
      if (path === '/api/evaluate' && req.method === 'POST') {
        const user = requireUser(req); const body = await readBody(req);
        const task = tasks.find(item => item.id === body.taskId);
        if (!task || typeof body.prompt !== 'string' || !body.prompt.trim() || body.prompt.length > task.limit) throw fail(422, 'Choose a valid task and enter a nonblank prompt within its character limit.');
        if (typeof body.requestId !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(body.requestId)) throw fail(422, 'Invalid request reference.');
        const locale = body.locale ?? 'en';
        if (!['en', 'ru', 'kk'].includes(locale)) throw fail(422, 'Choose a supported feedback language.');
        // Read a prior response before checking AI configuration: retries must never charge again.
        const previous = db.prepare("SELECT result FROM submissions WHERE user_id = ? AND request_id = ? AND status = 'done'").get(user.id, body.requestId);
        if (previous) {
          const attempt = JSON.parse(previous.result);
          if (attempt.taskId !== task.id || attempt.prompt !== body.prompt) throw fail(409, 'This request reference belongs to another prompt. Start a new check.');
          json(res, 200, { attempt, quota: quotaFor(db, user, clock()) }); return;
        }
        if (!apiKey) throw fail(503, 'AI checks are not configured yet. The site owner must set OPENAI_API_KEY on the server. Your check was not charged.');
        const currentPlan = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
        const reservation = reserveAttempt(db, currentPlan, body.requestId, clock());
        if (reservation.cached) { json(res, 200, { attempt: reservation.cached, quota: quotaFor(db, user, clock()) }); return; }
        try {
          const evaluation = validateEvaluation(await evaluator({ task, exercise: exercises[task.id], prompt: body.prompt, locale, apiKey, model }));
          const attempt = { id: randomUUID(), taskId: task.id, prompt: body.prompt, locale, createdAt: clock(), model, ...evaluation };
          completeAttempt(db, user.id, body.requestId, attempt);
          const currentUser = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
          json(res, 201, { attempt, quota: quotaFor(db, currentUser, clock()) });
        } catch (error) {
          releaseAttempt(db, user.id, body.requestId);
          if (error.status) throw error;
          throw fail(502, 'The AI check failed. Try again; your check was not charged.');
        }
        return;
      }
      if (path.startsWith('/api/attempts/') && req.method === 'DELETE') {
        const user = requireUser(req); await readBody(req);
        const result = db.prepare('DELETE FROM attempts WHERE id = ? AND user_id = ?').run(path.split('/').at(-1), user.id);
        if (!result.changes) throw fail(404, 'Attempt not found.');
        json(res, 200, state(user)); return;
      }
      if (path === '/api/subscription/demo' && req.method === 'POST') {
        const user = requireUser(req); const body = await readBody(req);
        if (!demoBilling) throw fail(403, 'Test subscription activation is disabled on this server.');
        if (body.confirm !== true) throw fail(422, 'Confirm that this is a test subscription with no payment.');
        if (user.pro_until <= clock()) db.prepare('UPDATE users SET pro_until = ?, subscription_ref = ? WHERE id = ?')
          .run(clock() + 30 * DAY, `DEMO-${randomBytes(5).toString('hex').toUpperCase()}`, user.id);
        json(res, 200, state(db.prepare('SELECT * FROM users WHERE id = ?').get(user.id))); return;
      }
      if (path === '/api/subscription/demo' && req.method === 'DELETE') {
        const user = requireUser(req); await readBody(req);
        if (!demoBilling) throw fail(403, 'Test subscription management is disabled.');
        db.prepare('UPDATE users SET pro_until = 0, subscription_ref = NULL WHERE id = ?').run(user.id);
        json(res, 200, state(db.prepare('SELECT * FROM users WHERE id = ?').get(user.id))); return;
      }
      if (path === '/api/feedback' && req.method === 'POST') {
        const body = await readBody(req);
        const fields = {};
        if (typeof body.name !== 'string' || body.name.trim().length < 2 || body.name.trim().length > 80) fields.name = 'Enter your name (2–80 characters).';
        if (!validEmail(body.email)) fields.email = 'Enter a valid email.';
        if (!['bug', 'feature', 'task', 'other'].includes(body.topic)) fields.topic = 'Choose a subject.';
        if (!Number.isInteger(Number(body.priority)) || Number(body.priority) < 1 || Number(body.priority) > 5) fields.priority = 'Choose priority 1–5.';
        if (typeof body.message !== 'string' || body.message.trim().length < 20 || body.message.length > 2000) fields.message = 'Write 20–2,000 characters.';
        if (body.topic === 'bug' && typeof body.message === 'string' && body.message.trim().length < 50) fields.message = 'For a bug report, describe what happened and how to reproduce it (at least 50 characters).';
        if (body.phone && (typeof body.phone !== 'string' || !/^\+?[\d\s()-]{7,25}$/.test(body.phone))) fields.phone = 'Enter a valid phone number or leave it empty.';
        if (body.preferred_date && (!/^\d{4}-\d{2}-\d{2}$/.test(body.preferred_date) || !Number.isFinite(Date.parse(body.preferred_date)) || body.preferred_date < new Date(clock()).toISOString().slice(0, 10))) fields.preferred_date = 'Choose today or a future date.';
        if (Object.keys(fields).length) throw fail(422, 'Please correct the highlighted fields.', { fields });
        const id = randomUUID();
        const message = { name: body.name.trim(), email: body.email.trim(), topic: body.topic, priority: Number(body.priority), message: body.message.trim(), phone: body.phone || '', preferred_date: body.preferred_date || '', urgency: ['low','medium','high'].includes(body.urgency) ? body.urgency : 'medium', subscribe: body.subscribe === true || body.subscribe === 'on' };
        db.prepare('INSERT INTO feedback VALUES(?,?,?,?)').run(id, getUser(req)?.id || null, clock(), JSON.stringify(message));
        json(res, 201, { id, summary: message, notice: 'Saved to this site’s database. No email was sent; no callback or newsletter subscription was scheduled.' }); return;
      }
      throw fail(404, 'Endpoint not found.');
    } catch (error) {
      if (!res.headersSent) json(res, error.status || 500, { message: error.status ? error.message : 'An unexpected server error occurred. Please try again.', ...(error.fields ? { fields: error.fields } : {}), ...(error.code === 'LIMIT_REACHED' ? { code: error.code, quota: error.quota } : {}) });
      else res.end();
      // Never log credentials, prompts, upstream error bodies or request data.
      if (!error.status) console.error('PromptForge request failed:', error.name);
    }
  });
  return { server, db };
}
