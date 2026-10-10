'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { practiceGoals, earnedPoints } from '../js/motivation.js';
import { tasks } from '../js/data.js';

const attempt = (taskId, date, score = 8, id = crypto.randomUUID()) => ({ taskId, createdAt: new Date(date).getTime(), score, id });

test('practice streak uses distinct local calendar days and survives until the next day ends', () => {
  const history = [attempt('t001', '2026-10-04T23:30:00'), attempt('t001', '2026-10-05T00:10:00'), attempt('t002', '2026-10-05T20:00:00')];
  assert.equal(practiceGoals(history, new Date('2026-10-05T22:00:00').getTime()).streak, 2);
  const tomorrow = practiceGoals(history, new Date('2026-10-06T21:00:00').getTime());
  assert.equal(tomorrow.streak, 2); assert.equal(tomorrow.todayChecked, false);
  assert.equal(practiceGoals(history, new Date('2026-10-07T00:01:00').getTime()).streak, 0);
  assert.equal(practiceGoals([attempt('t001', '2026-10-31T23:30:00')], new Date('2026-11-01T10:00:00').getTime()).streak, 1);
  assert.equal(practiceGoals([attempt('t001', '2026-10-08T12:00:00')], new Date('2026-10-07T12:00:00').getTime()).streak, 0);
});

test('weekly goals count first saved mastery, reset on Monday and adapt to the remaining exercises', () => {
  const now = new Date('2026-10-11T20:00:00').getTime(); // Sunday.
  const history = [attempt('t001','2026-10-04T12:00:00'), attempt('t001','2026-10-05T12:00:00',9), attempt('t002','2026-10-06T12:00:00',7.99), attempt('t002','2026-10-07T12:00:00'), attempt('t002','2026-10-08T12:00:00',9)];
  assert.equal(practiceGoals(history, now).weeklyCount, 1);
  assert.equal(practiceGoals(history.slice(1), now).weeklyCount, 2); // Deletion recomputes first saved mastery.
  assert.equal(practiceGoals(history, new Date('2026-10-12T00:01:00').getTime()).weeklyCount, 0);
  const nearlyDone = tasks.slice(0,15).map(task => attempt(task.id,'2026-10-04T12:00:00'));
  assert.equal(practiceGoals(nearlyDone, now).weeklyTarget, 1);
  const complete = [...nearlyDone, attempt('t016','2026-10-04T12:00:00')];
  assert.equal(practiceGoals(complete, now).weeklyMode, 'days');
  assert.equal(practiceGoals(complete, now).weeklyTarget, 3);
});

test('earned points reward improved personal bests, never repeated or lower scores', () => {
  const first = attempt('t001','2026-10-05T12:00:00',4.8);
  const improved = attempt('t001','2026-10-05T13:00:00',8.15);
  const lower = attempt('t001','2026-10-05T14:00:00',6);
  assert.equal(earnedPoints([first], first), 4.8);
  assert.equal(earnedPoints([first,improved], improved), 3.35);
  assert.equal(earnedPoints([first,improved,lower], lower), 0);
  assert.equal(earnedPoints([improved, { ...improved, id: 'duplicate' }], improved), 0);
});
