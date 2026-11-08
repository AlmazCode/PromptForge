'use strict';
export const rubric = [
  { id: 'role', name: 'AI role', weight: 0.2, pattern: /act as|you are|role\b/i },
  {
    id: 'format',
    name: 'Response format',
    weight: 0.25,
    pattern: /list|table|json|format|markdown/i,
  },
  {
    id: 'length',
    name: 'Response length',
    weight: 0.15,
    pattern: /\d+\s*(words?|characters?|sentences?|points?|items?)/i,
  },
  { id: 'examples', name: 'Response examples', weight: 0.2, pattern: /example|e\.g\.|sample/i },
  {
    id: 'tone',
    name: 'Tone and style',
    weight: 0.1,
    pattern: /tone|style|friendly|professional|concise/i,
  },
  {
    id: 'clarity',
    name: 'Instruction clarity',
    weight: 0.1,
    pattern: /write|create|summarize|analyse|analyze|translate|extract|define/i,
  },
];
export function evaluatePrompt(prompt) {
  const criteria = rubric.map((item) => ({ ...item, score: item.pattern.test(prompt) ? 10 : 0 }));
  const score = criteria.reduce((sum, item) => sum + item.score * item.weight, 0);
  return { score: Math.round(score * 100) / 100, criteria };
}

export function filterTasks(tasks, filters, attempts = []) {
  const query = (filters.query || '').trim().toLowerCase();
  const result = tasks.filter((task) => {
    const text = `${task.title} ${task.description} ${task.tags.join(' ')}`.toLowerCase();
    const checked = attempts.some((attempt) => attempt.taskId === task.id);
    return (
      text.includes(query) &&
      (!filters.category || filters.category === 'all' || task.category === filters.category) &&
      (!filters.difficulty ||
        filters.difficulty === 'all' ||
        task.difficulty === filters.difficulty) &&
      (!filters.status ||
        filters.status === 'all' ||
        (filters.status === 'solved' ? checked : !checked))
    );
  });
  const levels = { beginner: 1, intermediate: 2, advanced: 3 };
  if (filters.sort === 'title') result.sort((a, b) => a.title.localeCompare(b.title));
  if (filters.sort === 'difficulty-asc')
    result.sort((a, b) => levels[a.difficulty] - levels[b.difficulty]);
  if (filters.sort === 'difficulty-desc')
    result.sort((a, b) => levels[b.difficulty] - levels[a.difficulty]);
  return result;
}

export function bestAttempts(attempts) {
  const best = new Map();
  for (const attempt of attempts) {
    if (!best.has(attempt.taskId) || attempt.score > best.get(attempt.taskId).score)
      best.set(attempt.taskId, attempt);
  }
  return [...best.values()].sort((a, b) => b.score - a.score);
}
