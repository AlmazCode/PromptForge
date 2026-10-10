'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createApp } from '../server/app.js';
import { rubric } from '../js/logic.js';
import { DAY } from '../server/store.js';
import { readFile } from 'node:fs/promises';

const verdict = () => ({ criteria: Object.fromEntries(rubric.map(c => [c.id, { score: 8, feedback: 'Add a concrete example.' }])), summary: 'A useful start.' });
const registration = email => ({ email, full_name: 'Test Student', password: 'Study!123', password_confirm: 'Study!123', interest_area: 'copywriting', level: 'beginner', accept_rules: true, accept_privacy: true, bio: '', experience_years: '' });

async function fixture(t, options = {}) {
  const app = createApp({ root: '.', database: ':memory:', apiKey: 'test-key', demoBilling: true, evaluate: async () => verdict(), ...options });
  await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${app.server.address().port}`;
  t.after(async () => { await new Promise(resolve => app.server.close(resolve)); app.db.close(); });
  async function request(path, method = 'GET', data, cookie = '', extraHeaders = {}) {
    const response = await fetch(base + path, { method, headers: { ...(data === undefined ? {} : { 'Content-Type': 'application/json' }), ...(cookie ? { Cookie: cookie } : {}), ...extraHeaders }, body: data === undefined ? undefined : Buffer.isBuffer(data) ? data : JSON.stringify(data) });
    const body = response.headers.get('content-type')?.includes('json') ? await response.json() : await response.text();
    return { status: response.status, body, cookie: response.headers.get('set-cookie')?.split(';')[0] };
  }
  const signup = await request('/api/register', 'POST', registration(`test-${randomUUID()}@example.com`));
  assert.equal(signup.status, 201);
  return { ...app, base, request, cookie: signup.cookie, user: signup.body.user };
}

test('avatars persist for their owner, replace cleanly and reject invalid or cross-site uploads', async t => {
  const f = await fixture(t);
  const image = await readFile(new URL('./fixtures/avatar.jpg', import.meta.url));
  const upload = (data, cookie = f.cookie, headers = {}) => f.request('/api/profile/avatar', 'PUT', data, cookie, { 'Content-Type': 'image/jpeg', ...headers });
  assert.equal((await upload(image, '')).status, 401);
  assert.equal((await upload(image, f.cookie, { Origin: 'https://evil.example' })).status, 403);
  assert.equal((await upload(Buffer.from('<svg onload="alert(1)"/>'), f.cookie, { 'Content-Type': 'image/svg+xml' })).status, 415);
  assert.equal((await upload(Buffer.from('<svg onload="alert(1)"/>'))).status, 422);
  assert.equal((await upload(image.subarray(0, image.length - 10))).status, 422);
  assert.equal((await upload(Buffer.alloc(101 * 1024))).status, 413);
  const first = await upload(image);
  assert.equal(first.status, 200); assert.match(first.body.user.avatarUrl, /^\/api\/profile\/avatar\?v=/);
  assert.equal(first.body.quota.used, 0);
  const response = await fetch(f.base + first.body.user.avatarUrl, { headers: { Cookie: f.cookie } });
  assert.equal(response.headers.get('content-type'), 'image/jpeg');
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), image);
  assert.equal((await f.request('/api/profile/avatar')).status, 401);
  const other = await f.request('/api/register', 'POST', registration(`avatar-${randomUUID()}@example.com`));
  assert.equal((await f.request(first.body.user.avatarUrl, 'GET', undefined, other.cookie)).status, 404);
  const edit = await f.request('/api/profile', 'PATCH', { name: 'New name' }, f.cookie);
  assert.equal(edit.body.user.avatarUrl, first.body.user.avatarUrl);
  const second = await upload(image);
  assert.notEqual(second.body.user.avatarUrl, first.body.user.avatarUrl);
  const deleted = await f.request('/api/profile/avatar', 'DELETE', {}, f.cookie);
  assert.equal(deleted.body.user.avatarUrl, null);
  assert.equal((await f.request('/api/profile/avatar', 'GET', undefined, f.cookie)).status, 404);
  assert.equal((await f.request('/api/state', 'GET', undefined, other.cookie)).body.user.avatarUrl, null);
});

test('feedback locale is validated before charging and preserved with saved attempts', async t => {
  const seen = [];
  const f = await fixture(t, { evaluate: async ({ locale }) => { seen.push(locale); return verdict(); } });
  const payload = { taskId: 't001', prompt: 'Write a short post.', requestId: randomUUID(), locale: 'fr' };
  assert.equal((await f.request('/api/evaluate', 'POST', payload, f.cookie)).status, 422);
  assert.equal((await f.request('/api/state', 'GET', undefined, f.cookie)).body.quota.used, 0);
  for (const locale of ['en', 'ru', 'kk']) {
    const result = await f.request('/api/evaluate', 'POST', { ...payload, requestId: randomUUID(), locale }, f.cookie);
    assert.equal(result.status, 201); assert.equal(result.body.attempt.locale, locale);
  }
  assert.deepEqual(seen, ['en', 'ru', 'kk']);
  const state = await f.request('/api/state', 'GET', undefined, f.cookie);
  assert.deepEqual(state.body.attempts.map(a => a.locale).sort(), ['en', 'kk', 'ru']);
});

test('email and password changes verify credentials, rotate sessions and preserve private practice data', async t => {
  const f = await fixture(t); const originalEmail = f.user.email;
  const login = (email, password) => f.request('/api/login', 'POST', { email, password });
  const sibling = await login(originalEmail, 'Study!123');
  const other = await f.request('/api/register', 'POST', registration(`unrelated-${randomUUID()}@example.com`));
  await f.request('/api/drafts/t001', 'PUT', { prompt: 'Keep my saved practice draft.' }, f.cookie);
  const change = { current_password: 'Study!123', new_password: 'NewStudy!456', password_confirm: 'NewStudy!456' };
  assert.equal((await f.request('/api/account/password', 'PATCH', change)).status, 401);
  assert.equal((await f.request('/api/account/password', 'PATCH', change, f.cookie, { Origin: 'https://evil.example' })).status, 403);
  assert.equal((await f.request('/api/account/password', 'PATCH', { ...change, current_password: 'Wrong!123' }, f.cookie)).status, 403);
  assert.equal((await f.request('/api/account/password', 'PATCH', { ...change, new_password: 'weak' }, f.cookie)).status, 422);
  assert.equal((await f.request('/api/account/password', 'PATCH', { ...change, password_confirm: 'Mismatch!123' }, f.cookie)).status, 422);
  assert.equal((await f.request('/api/account/password', 'PATCH', { ...change, new_password: 'Study!123', password_confirm: 'Study!123' }, f.cookie)).status, 422);
  const changed = await f.request('/api/account/password', 'PATCH', change, f.cookie);
  assert.equal(changed.status, 200); assert.ok(changed.cookie); assert.notEqual(changed.cookie, f.cookie);
  assert.equal((await f.request('/api/state', 'GET', undefined, f.cookie)).body.user, null);
  assert.equal((await f.request('/api/state', 'GET', undefined, sibling.cookie)).body.user, null);
  assert.equal((await f.request('/api/state', 'GET', undefined, other.cookie)).body.user.id, other.body.user.id);
  assert.equal(changed.body.drafts.t001, 'Keep my saved practice draft.'); assert.equal(changed.body.quota.used, 0);
  assert.equal((await login(originalEmail, 'Study!123')).status, 401);
  const current = await login(originalEmail, 'NewStudy!456'); assert.equal(current.status, 200);
  assert.equal((await f.request('/api/account/email', 'PATCH', { email: 'bad', current_password: 'NewStudy!456' }, current.cookie)).status, 422);
  assert.equal((await f.request('/api/account/email', 'PATCH', { email: other.body.user.email, current_password: 'NewStudy!456' }, current.cookie)).status, 409);
  const newEmail = `changed-${randomUUID()}@example.com`;
  assert.equal((await f.request('/api/account/email', 'PATCH', { email: newEmail, current_password: 'Wrong!123' }, current.cookie)).status, 403);
  const email = await f.request('/api/account/email', 'PATCH', { email: newEmail.toUpperCase(), current_password: 'NewStudy!456' }, current.cookie);
  assert.equal(email.status, 200); assert.equal(email.body.user.email, newEmail);
  assert.equal((await f.request('/api/state', 'GET', undefined, current.cookie)).body.user, null);
  assert.equal((await f.request('/api/state', 'GET', undefined, changed.cookie)).body.user, null);
  assert.equal((await login(originalEmail, 'NewStudy!456')).status, 401);
  assert.equal((await login(newEmail, 'NewStudy!456')).status, 200);
  assert.equal(email.body.drafts.t001, 'Keep my saved practice draft.');
  const row = f.db.prepare('SELECT password_hash FROM users WHERE id = ?').get(f.user.id);
  assert.ok(!row.password_hash.includes('NewStudy!456')); assert.ok(!JSON.stringify(email.body).includes('NewStudy!456'));
  const ended = await f.request('/api/account/sessions', 'DELETE', {}, email.cookie);
  assert.equal(ended.status, 200); assert.equal(ended.body.ended, 1);
  assert.equal((await f.request('/api/state', 'GET', undefined, email.cookie)).body.user.id, f.user.id);
  assert.equal((await f.request('/api/account/sessions', 'DELETE', {}, email.cookie)).body.ended, 0);
  const profile = await f.request('/api/profile', 'PATCH', { interest: 'translation', level: 'advanced' }, email.cookie);
  assert.equal(profile.body.user.interest, 'translation'); assert.equal(profile.body.user.level, 'advanced');
  assert.equal((await f.request('/api/profile', 'PATCH', { interest: 'invented' }, email.cookie)).status, 422);
  assert.equal((await f.request('/api/profile', 'PATCH', { level: 'invented' }, email.cookie)).status, 422);
});

test('concurrent credential changes cannot revive sessions or overwrite newer credentials', async t => {
  const f = await fixture(t);
  const changes = ['ConcurrentOne!123', 'ConcurrentTwo!123'].map(password => ({ current_password: 'Study!123', new_password: password, password_confirm: password }));
  const results = await Promise.all(changes.map(data => f.request('/api/account/password', 'PATCH', data, f.cookie)));
  assert.deepEqual(results.map(result => result.status).sort(), [200, 409]);
  const winner = results.findIndex(result => result.status === 200);
  assert.equal((await f.request('/api/login', 'POST', { email: f.user.email, password: changes[winner].new_password })).status, 200);
  assert.equal((await f.request('/api/login', 'POST', { email: f.user.email, password: changes[1 - winner].new_password })).status, 401);
  assert.equal((await f.request('/api/state', 'GET', undefined, f.cookie)).body.user, null);
});

test('credential retries are limited per account and become available after the cooldown', async t => {
  let now = Date.UTC(2026, 9, 10, 12); const f = await fixture(t, { clock: () => now });
  const payload = { email: `updated-${randomUUID()}@example.com`, current_password: 'Wrong!123' };
  for (let index = 0; index < 10; index++) assert.equal((await f.request('/api/account/email', 'PATCH', payload, f.cookie)).status, 403);
  assert.equal((await f.request('/api/account/email', 'PATCH', payload, f.cookie)).status, 429);
  now += 10 * 60 * 1000;
  assert.equal((await f.request('/api/account/email', 'PATCH', { ...payload, current_password: 'Study!123' }, f.cookie)).status, 200);
});

test('Free grants ten checks, rejects eleven, and resets exactly 24 hours after first use', async t => {
  let now = Date.UTC(2026, 9, 10, 12);
  const f = await fixture(t, { clock: () => now });
  const payload = () => ({ taskId: 't001', prompt: 'A valid nonblank instruction.', requestId: randomUUID() });
  assert.equal((await f.request('/api/state', 'GET', undefined, f.cookie)).body.quota.resetsAt, null);
  const first = payload();
  for (let i = 0; i < 10; i += 1) {
    const result = await f.request('/api/evaluate', 'POST', i === 0 ? first : payload(), f.cookie);
    assert.equal(result.status, 201); assert.equal(result.body.quota.remaining, 9 - i); assert.equal(result.body.quota.resetsAt, now + DAY);
  }
  const replay = await f.request('/api/evaluate', 'POST', first, f.cookie);
  assert.equal(replay.status, 200); assert.equal(replay.body.quota.remaining, 0);
  assert.equal((await f.request('/api/evaluate', 'POST', { ...first, prompt: 'Changed input with old key' }, f.cookie)).status, 409);
  assert.equal((await f.request('/api/evaluate', 'POST', payload(), f.cookie)).status, 429);
  now += DAY - 1;
  assert.equal((await f.request('/api/evaluate', 'POST', payload(), f.cookie)).status, 429);
  now += 1;
  const reset = await f.request('/api/evaluate', 'POST', payload(), f.cookie);
  assert.equal(reset.status, 201); assert.equal(reset.body.quota.remaining, 9); assert.equal(reset.body.quota.resetsAt, now + DAY);
});

test('failed AI checks and malformed scores release reservations without consuming quota', async t => {
  let calls = 0;
  const f = await fixture(t, { evaluate: async () => { calls += 1; if (calls === 1) throw new Error('upstream secret must not leak'); return { criteria: {} }; } });
  for (let i = 0; i < 2; i += 1) {
    const result = await f.request('/api/evaluate', 'POST', { taskId: 't002', prompt: 'My instruction', requestId: randomUUID() }, f.cookie);
    assert.equal(result.status, 502); assert.ok(!JSON.stringify(result.body).includes('upstream secret'));
    const state = await f.request('/api/state', 'GET', undefined, f.cookie);
    assert.equal(state.body.quota.remaining, 10); assert.equal(state.body.quota.resetsAt, null); assert.equal(state.body.attempts.length, 0);
  }
});

test('concurrent requests cannot double-spend or bypass the last free check', async t => {
  let complete;
  const f = await fixture(t, { evaluate: () => new Promise(resolve => { complete = resolve; }) });
  const first = f.request('/api/evaluate', 'POST', { taskId: 't001', prompt: 'First', requestId: randomUUID() }, f.cookie);
  while (!complete) await new Promise(resolve => setTimeout(resolve, 5));
  const second = await f.request('/api/evaluate', 'POST', { taskId: 't001', prompt: 'Second', requestId: randomUUID() }, f.cookie);
  assert.equal(second.status, 409);
  complete(verdict()); assert.equal((await first).status, 201);
  assert.equal((await f.request('/api/state', 'GET', undefined, f.cookie)).body.quota.used, 1);
});

test('test Pro removes daily cap, activation is idempotent, expiry and downgrade preserve usage', async t => {
  let now = Date.UTC(2026, 9, 10);
  const f = await fixture(t, { clock: () => now });
  assert.equal((await f.request('/api/subscription/demo', 'POST', {}, f.cookie)).status, 422);
  const pro = await f.request('/api/subscription/demo', 'POST', { confirm: true }, f.cookie);
  assert.equal(pro.body.quota.plan, 'pro'); assert.equal(pro.body.quota.remaining, null);
  const again = await f.request('/api/subscription/demo', 'POST', { confirm: true }, f.cookie);
  assert.equal(again.body.quota.proUntil, pro.body.quota.proUntil); assert.equal(again.body.quota.reference, pro.body.quota.reference);
  for (let i = 0; i < 12; i += 1) assert.equal((await f.request('/api/evaluate', 'POST', { taskId: 't003', prompt: 'Check this', requestId: randomUUID() }, f.cookie)).status, 201);
  const free = await f.request('/api/subscription/demo', 'DELETE', {}, f.cookie);
  assert.equal(free.body.quota.plan, 'free'); assert.equal(free.body.quota.remaining, 0);
  assert.equal((await f.request('/api/evaluate', 'POST', { taskId: 't003', prompt: 'Again', requestId: randomUUID() }, f.cookie)).status, 429);
  await f.request('/api/subscription/demo', 'POST', { confirm: true }, f.cookie);
  now += 30 * DAY;
  assert.equal((await f.request('/api/state', 'GET', undefined, f.cookie)).body.user, null); // Session expired too.
  const email = f.db.prepare('SELECT email FROM users WHERE id=?').get(f.user.id).email;
  const login = await f.request('/api/login', 'POST', { email, password: 'Study!123' });
  assert.equal(login.body.quota.plan, 'free');
});

test('history is user-owned; deletion does not refund usage; secrets are never served', async t => {
  const f = await fixture(t);
  const submission = await f.request('/api/evaluate', 'POST', { taskId: 't002', prompt: '<img src=x onerror=alert(1)>', requestId: randomUUID() }, f.cookie);
  const other = await f.request('/api/register', 'POST', registration('other@example.com'));
  assert.equal((await f.request('/api/state', 'GET', undefined, other.cookie)).body.attempts.length, 0);
  assert.equal((await f.request(`/api/attempts/${submission.body.attempt.id}`, 'DELETE', {}, other.cookie)).status, 404);
  const deletion = await f.request(`/api/attempts/${submission.body.attempt.id}`, 'DELETE', {}, f.cookie);
  assert.equal(deletion.body.attempts.length, 0); assert.equal(deletion.body.quota.used, 1);
  for (const path of ['/.env', '/.data/promptforge.sqlite', '/server/app.js', '/package.json', '/js/../../server/app.js', '/js/..%2fserver/app.js']) assert.equal((await f.request(path)).status, 404);
  const state = JSON.stringify((await f.request('/api/state', 'GET', undefined, f.cookie)).body);
  assert.ok(!state.includes('password')); assert.ok(!state.includes('test-key'));
  assert.equal((await f.request('/api/profile', 'PATCH', { name: 'Hijack', bio: '' }, f.cookie, { Origin: 'https://evil.example' })).status, 403);
  const logout = await f.request('/api/logout', 'POST', {}, f.cookie); assert.equal(logout.body.user, null);
  assert.equal((await f.request('/api/evaluate', 'POST', {}, f.cookie)).status, 401);
});

test('missing API configuration and disabled billing fail clearly without charging', async t => {
  const f = await fixture(t, { apiKey: '', demoBilling: false });
  assert.equal((await f.request('/api/evaluate', 'POST', { taskId: 't001', prompt: 'Draft', requestId: randomUUID() }, f.cookie)).status, 503);
  assert.equal((await f.request('/api/subscription/demo', 'POST', { confirm: true }, f.cookie)).status, 403);
  assert.equal((await f.request('/api/state', 'GET', undefined, f.cookie)).body.quota.used, 0);
});

test('passwords are hashed, login and profile edits work, feedback validates related fields', async t => {
  const f = await fixture(t);
  const row = f.db.prepare('SELECT * FROM users WHERE id = ?').get(f.user.id);
  assert.ok(!row.password_hash.includes('Study!123')); assert.match(row.password_hash, /^[a-f0-9]+:[a-f0-9]+$/);
  assert.equal((await f.request('/api/login', 'POST', { email: row.email, password: 'Wrong!123' })).status, 401);
  const login = await f.request('/api/login', 'POST', { email: row.email, password: 'Study!123' });
  assert.equal(login.status, 200); assert.ok(login.cookie);
  const edit = await f.request('/api/profile', 'PATCH', { name: 'Updated Student', bio: '<script>inert text</script>' }, login.cookie);
  assert.equal(edit.body.user.name, 'Updated Student'); assert.equal(edit.body.user.bio, '<script>inert text</script>');
  const invalid = await f.request('/api/feedback', 'POST', { name: 'Student', email: 'student@example.com', topic: 'bug', priority: 3, message: 'Too short for a bug.' });
  assert.equal(invalid.status, 422); assert.ok(invalid.body.fields.message);
  const saved = await f.request('/api/feedback', 'POST', { name: 'Student', email: 'student@example.com', topic: 'bug', priority: 3, message: 'The filter reset button did not work after I searched for a translation task.' }, login.cookie);
  assert.equal(saved.status, 201); assert.match(saved.body.notice, /No email was sent/);
});

test('public ranking uses opted-in best totals, shared places and private viewer targets without exposing account data', async t => {
  const f = await fixture(t, { evaluate: async ({ prompt }) => ({ criteria: Object.fromEntries(rubric.map(item => [item.id, { score: Number(prompt), feedback: 'Private evaluation text.' }])), summary: 'Private summary.' }) });
  const second = await f.request('/api/register', 'POST', { ...registration(`second-${randomUUID()}@example.com`), full_name: 'Second', leaderboard_visible: true });
  const third = await f.request('/api/register', 'POST', { ...registration(`third-${randomUUID()}@example.com`), full_name: 'Third', leaderboard_visible: true });
  const check = (cookie, taskId, score) => f.request('/api/evaluate','POST',{ taskId, prompt: String(score), requestId: randomUUID() },cookie);
  await check(f.cookie,'t001',8);
  assert.equal((await f.request('/api/leaderboard')).body.total,0);
  await f.request('/api/profile','PATCH',{ leaderboardVisible:true },f.cookie);
  await check(f.cookie,'t002',8);
  await check(second.cookie,'t001',8); await check(second.cookie,'t002',8);
  const thirdResult = await check(third.cookie,'t001',5);
  await check(f.cookie,'t001',4); await check(f.cookie,'t001',8);
  await f.request('/api/subscription/demo','POST',{confirm:true},second.cookie);
  const ranking = (await f.request('/api/leaderboard','GET',undefined,third.cookie)).body;
  assert.deepEqual(ranking.rows.map(row=>row.rank),[1,1,3]);
  assert.deepEqual(ranking.rows.map(row=>row.points),[16,16,5]);
  assert.equal(ranking.viewer.name,'Third'); assert.equal(ranking.viewer.isYou,true);
  assert.deepEqual(ranking.nextTarget,{rank:1,points:16,gap:11});
  assert.equal(ranking.rows[0].mastered,2);
  for (const row of ranking.rows) assert.deepEqual(Object.keys(row).sort(),['checked','isYou','mastered','name','points','rank','tier'].sort());
  const guest = (await f.request('/api/leaderboard')).body;
  assert.equal(guest.viewer,null); assert.equal(guest.nextTarget,null);
  assert.ok(guest.rows.every(row=>!row.isYou));
  assert.ok(!JSON.stringify(guest).includes('Private'));
  assert.equal((await f.request('/api/leaderboard?offset=-1')).status,422);
  assert.equal((await f.request('/api/profile','PATCH',{leaderboardVisible:'true'},f.cookie)).status,422);
  await f.request('/api/profile','PATCH',{name:'Renamed'},f.cookie);
  assert.ok((await f.request('/api/leaderboard')).body.rows.some(row=>row.name==='Renamed'));
  await f.request('/api/attempts/'+thirdResult.body.attempt.id,'DELETE',{},third.cookie);
  assert.equal((await f.request('/api/leaderboard')).body.total,2);
  await f.request('/api/profile','PATCH',{leaderboardVisible:false},second.cookie);
  assert.equal((await f.request('/api/leaderboard')).body.total,1);
  assert.equal((await f.request('/api/state','GET',undefined,second.cookie)).body.attempts.length,2);
});

test('ranking pages remain globally ranked and include the viewer outside the first page', async t => {
  const f=await fixture(t);
  for(let index=0;index<28;index++) {
    const id=`rank-user-${index}`;
    f.db.prepare('INSERT INTO users(id,email,name,password_hash,interest,level,created_at,leaderboard_visible) VALUES(?,?,?,?,?,?,?,1)').run(id,`${index}@example.com`,`Participant ${index}`,'test-hash','copywriting','beginner',index);
    f.db.prepare('INSERT INTO attempts VALUES(?,?,?,?,?)').run(`rank-attempt-${index}`,id,'t001',100,JSON.stringify({score:9}));
  }
  await f.request('/api/profile','PATCH',{leaderboardVisible:true},f.cookie);
  await f.request('/api/evaluate','POST',{taskId:'t001',prompt:'First',requestId:randomUUID()},f.cookie);
  const first=(await f.request('/api/leaderboard','GET',undefined,f.cookie)).body;
  assert.equal(first.rows.length,25);assert.equal(first.total,29);assert.equal(first.nextOffset,25);
  assert.equal(first.viewer.rank,29);assert.equal(first.viewer.points,8);
  const last=(await f.request('/api/leaderboard?offset=25','GET',undefined,f.cookie)).body;
  assert.equal(last.rows.length,4);assert.equal(last.nextOffset,null);
  assert.equal(last.rows.at(-1).isYou,true);assert.equal(last.rows.at(-1).rank,29);
});
