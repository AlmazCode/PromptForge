'use strict';

export const rubric = [
  { id: 'role', name: 'AI role', weight: 0.20 },
  { id: 'format', name: 'Response format', weight: 0.25 },
  { id: 'length', name: 'Response length', weight: 0.15 },
  { id: 'examples', name: 'Response examples', weight: 0.20 },
  { id: 'tone', name: 'Tone and style', weight: 0.10 },
  { id: 'clarity', name: 'Instruction clarity', weight: 0.10 }
];

export const masteryScore = 8;
export const skillTiers = [ { name: 'Newcomer', min: 0 }, { name: 'Practitioner', min: 50 }, { name: 'Master', min: 100 }, { name: 'Grandmaster', min: 150 } ];

export function weightedScore(criteria) {
  return Math.round(rubric.reduce((total, item) => total + criteria[item.id].score * item.weight, 0) * 100) / 100;
}

export function bestAttempts(attempts) {
  const best = new Map();
  for (const attempt of attempts) {
    if (!best.has(attempt.taskId) || attempt.score > best.get(attempt.taskId).score) best.set(attempt.taskId, attempt);
  }
  return [...best.values()].sort((a, b) => b.score - a.score || a.taskId.localeCompare(b.taskId));
}

export function progress(attempts) {
  const best = bestAttempts(attempts);
  const points = Math.round(best.reduce((total, item) => total + item.score, 0) * 100) / 100;
  const tiers = skillTiers;
  const tier = [...tiers].reverse().find(item => points >= item.min);
  const next = tiers.find(item => item.min > points);
  return { best, points, solved: best.length, checked: best.length, mastered: best.filter(item => item.score >= masteryScore).length, attempts: attempts.length, average: attempts.length ? attempts.reduce((n, a) => n + a.score, 0) / attempts.length : 0, tier: tier.name, next };
}

export function taskStatus(id, attempts, drafts) {
  const checked = attempts.filter(item => item.taskId === id);
  if (checked.some(item => item.score >= masteryScore)) return 'mastered';
  if (checked.length) return 'needs-work';
  return drafts[id]?.trim() ? 'active' : 'available';
}

export function filterTasks(tasks, filters, attempts = [], drafts = {}) {
  const query = (filters.query || '').trim().toLowerCase();
  const result = tasks.filter(task => (!query || `${task.title} ${task.description} ${task.category} ${task.tags.join(' ')} ${task.searchText || ''}`.toLowerCase().includes(query))
    && (!filters.category || filters.category === 'all' || task.category === filters.category)
    && (!filters.difficulty || filters.difficulty === 'all' || task.difficulty === filters.difficulty)
    && (!filters.status || filters.status === 'all' || (filters.status === 'solved' ? attempts.some(item => item.taskId === task.id) : taskStatus(task.id, attempts, drafts) === filters.status)));
  const levels = { beginner: 1, intermediate: 2, advanced: 3 };
  switch (filters.sort) {
    case 'title': result.sort((a, b) => a.title.localeCompare(b.title, filters.locale)); break;
    case 'difficulty-asc': result.sort((a, b) => levels[a.difficulty] - levels[b.difficulty]); break;
    case 'difficulty-desc': result.sort((a, b) => levels[b.difficulty] - levels[a.difficulty]); break;
    default: result.sort((a, b) => a.id.localeCompare(b.id));
  }
  return result;
}

export function recommendTask(tasks, attempts, excludeId = '') {
  const unfinished = tasks.filter(task => task.id !== excludeId && !attempts.some(attempt => attempt.taskId === task.id));
  const pool = unfinished.length ? unfinished : tasks.filter(task => task.id !== excludeId);
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
}

export function passwordChecks(password) {
  return { length: password.length >= 8 && password.length <= 128, upper: /[A-Z]/.test(password), lower: /[a-z]/.test(password), digit: /\d/.test(password), special: /[^A-Za-z0-9\s]/.test(password) };
}

export function validEmail(email) {
  return typeof email === 'string' && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const interestAreas = ['copywriting', 'data-analysis', 'code-generation', 'system-design', 'translation', 'summarization', 'brainstorming', 'extraction', 'role-play'];
export const experienceLevels = ['beginner', 'intermediate', 'advanced'];

export function registrationErrors(values) {
  const errors = {};
  if (typeof values.full_name !== 'string' || values.full_name.trim().length < 2 || values.full_name.trim().length > 80) errors.full_name = 'Enter a name between 2 and 80 characters.';
  if (!validEmail(values.email)) errors.email = 'Enter a valid email address.';
  if (typeof values.password !== 'string' || !Object.values(passwordChecks(values.password)).every(Boolean)) errors.password = 'Use 8–128 characters, uppercase, lowercase, a digit and a special character.';
  if (values.password !== values.password_confirm) errors.password_confirm = 'Passwords must match exactly.';
  if (!interestAreas.includes(values.interest_area)) errors.interest_area = 'Choose a skill area.';
  if (!experienceLevels.includes(values.level)) errors.level = 'Choose your experience level.';
  if (values.phone && (typeof values.phone !== 'string' || !/^\+?[\d\s()-]{7,25}$/.test(values.phone))) errors.phone = 'Enter a valid phone number or leave it empty.';
  if (values.experience_years !== '' && values.experience_years !== undefined && (!Number.isInteger(Number(values.experience_years)) || Number(values.experience_years) < 0 || Number(values.experience_years) > 100)) errors.experience_years = 'Use a whole number from 0 to 100.';
  if (values.birth_date && (typeof values.birth_date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(values.birth_date) || !Number.isFinite(Date.parse(values.birth_date)) || new Date(values.birth_date).toISOString().slice(0, 10) !== values.birth_date || values.birth_date > new Date().toISOString().slice(0, 10) || values.birth_date < '1900-01-01')) errors.birth_date = 'Choose a valid birth date between 1900 and today.';
  if (values.bio && (typeof values.bio !== 'string' || values.bio.length > 1000)) errors.bio = 'Keep your introduction under 1,000 characters.';
  if (values.accept_rules !== true && values.accept_rules !== 'on') errors.accept_rules = 'Accept the community guidelines.';
  if (values.accept_privacy !== true && values.accept_privacy !== 'on') errors.accept_privacy = 'Accept the privacy notice.';
  return errors;
}
