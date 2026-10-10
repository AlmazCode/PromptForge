'use strict';

import { tasks } from './data.js';
import { masteryScore, progress, skillTiers } from './logic.js';

// Personal calendar goals use the device's local days, independently of the rolling quota.
const dayNumber = value => {
  const date = new Date(value);
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000;
};
export function practiceGoals(attempts, now = Date.now()) {
  const valid = attempts.filter(attempt => tasks.some(task => task.id === attempt.taskId) && Number.isFinite(attempt.createdAt) && attempt.createdAt <= now);
  const today = dayNumber(now); const weekStart = today - (new Date(now).getDay() + 6) % 7;
  const days = new Set(valid.map(attempt => dayNumber(attempt.createdAt)));
  let cursor = days.has(today) ? today : today - 1; let streak = 0;
  while (days.has(cursor--)) streak++;
  const firstMastery = new Map();
  for (const attempt of valid.filter(attempt => attempt.score >= masteryScore)) {
    firstMastery.set(attempt.taskId, Math.min(firstMastery.get(attempt.taskId) ?? Infinity, dayNumber(attempt.createdAt)));
  }
  const masteredBefore = [...firstMastery.values()].filter(day => day < weekStart).length;
  const newMastery = [...firstMastery.values()].filter(day => day >= weekStart).length;
  const weeklyDays = [...days].filter(day => day >= weekStart).length;
  const weeklyTarget = Math.min(3, tasks.length - masteredBefore);
  const summary = progress(valid);
  return { streak, todayChecked: days.has(today), weeklyTarget: weeklyTarget || 3,
    weeklyCount: weeklyTarget ? newMastery : weeklyDays, weeklyMode: weeklyTarget ? 'mastery' : 'days', summary,
    levelStart: skillTiers.find(tier => tier.name === summary.tier).min };
}

export function earnedPoints(attempts, attempt) {
  const previousBest = attempts.filter(item => item.taskId === attempt.taskId && item.id !== attempt.id).reduce((best, item) => Math.max(best, item.score), 0);
  return Math.round(Math.max(0, attempt.score - previousBest) * 100) / 100;
}
