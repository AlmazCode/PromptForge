'use strict';

import { tasks } from './data.js';
import { taskStatus, masteryScore, rubric } from './logic.js';

export const routes = [
  { id: 'instructions', title: 'Clear instructions', goal: 'Specify the role, audience and response limits.', taskIds: ['t001', 't005', 't006', 't016'] },
  { id: 'data', title: 'Working with data', goal: 'Summarize, compare and extract facts.', taskIds: ['t012', 't002', 't007', 't008', 't014', 't015'] },
  { id: 'systems', title: 'Systems and workflows', goal: 'Describe workflows, requirements and exceptions.', taskIds: ['t004', 't013', 't010', 't009', 't003', 't011'] }
];

export const statusLabels = { available: 'Not started', active: 'Draft in progress', 'needs-work': 'Needs revision', mastered: 'Mastered' };

export function routeForTask(taskId) { return routes.find(route => route.taskIds.includes(taskId)); }

export function routeProgress(route, attempts, drafts = {}) {
  const steps = route.taskIds.map((id, index) => {
    const history = attempts.filter(attempt => attempt.taskId === id);
    const best = history.reduce((winner, attempt) => !winner || attempt.score > winner.score ? attempt : winner, null);
    return { task: tasks.find(task => task.id === id), index, status: taskStatus(id, attempts, drafts), best };
  });
  return { steps, mastered: steps.filter(step => step.status === 'mastered').length, checked: steps.filter(step => step.best).length, next: steps.find(step => step.status !== 'mastered') || null };
}

export function recommendTraining(attempts, drafts = {}, interest = '') {
  const recent = [...attempts].sort((a, b) => b.createdAt - a.createdAt)[0];
  const preferred = routeForTask(recent?.taskId) || routes.find(route => route.taskIds.some(id => tasks.find(task => task.id === id).category === interest)) || routes[0];
  const ordered = [preferred, ...routes.filter(route => route !== preferred)];
  // Resume unfinished drafts first, then the earliest unmastered step of the active route.
  for (const route of ordered) {
    const draft = routeProgress(route, attempts, drafts).steps.find(step => step.status !== 'mastered' && drafts[step.task.id]?.trim());
    if (draft) return { ...draft, route, reason: 'Continue your draft' };
  }
  for (const route of ordered) {
    const next = routeProgress(route, attempts, drafts).next;
    if (next) return { ...next, route, reason: next.best ? 'Revise this prompt to reach 8/10.' : 'Next exercise in this course' };
  }
  return null;
}

export function nextRouteTask(taskId, attempts) {
  const route = routeForTask(taskId);
  if (!route) return null;
  const { steps } = routeProgress(route, attempts);
  const index = route.taskIds.indexOf(taskId);
  return [...steps.slice(index + 1), ...steps.slice(0, index)].find(step => step.status !== 'mastered')?.task || null;
}

export function attemptTimeline(attempts, taskId) {
  return attempts.map((attempt, index) => ({ attempt, index })).filter(item => item.attempt.taskId === taskId)
    .sort((a, b) => a.attempt.createdAt - b.attempt.createdAt || b.index - a.index).map(item => item.attempt);
}

export function compareScores(before, after) {
  return { delta: Math.round((after.score - before.score) * 100) / 100,
    criteria: rubric.map(item => ({ ...item, before: before.criteria[item.id].score, after: after.criteria[item.id].score,
      delta: Math.round((after.criteria[item.id].score - before.criteria[item.id].score) * 100) / 100 })) };
}

// Token-level LCS preserves the original text, whitespace and Unicode on both sides.
// Prompts are capped at 2,000 characters by the task editor and server.
export function promptDiff(before, after) {
  const tokenize = value => value.match(/\s+|[\p{L}\p{N}_]+|[^\s\p{L}\p{N}_]/gu) || [];
  const a = tokenize(before); const b = tokenize(after); const width = b.length + 1;
  const lengths = new Uint16Array((a.length + 1) * width);
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) {
    lengths[i * width + j] = a[i] === b[j] ? lengths[(i + 1) * width + j + 1] + 1 : Math.max(lengths[(i + 1) * width + j], lengths[i * width + j + 1]);
  }
  const left = []; const right = [];
  const append = (list, value, changed) => {
    if (list.at(-1)?.changed === changed) list.at(-1).text += value;
    else list.push({ text: value, changed });
  };
  let i = 0; let j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) { append(left, a[i++], false); append(right, b[j++], false); }
    else if (i < a.length && (j === b.length || lengths[(i + 1) * width + j] >= lengths[i * width + j + 1])) append(left, a[i++], true);
    else append(right, b[j++], true);
  }
  return { before: left, after: right, identical: before === after };
}

export { masteryScore };
