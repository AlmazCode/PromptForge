'use strict';
export const storageKey = 'promptforge.study.v1';
const legacyKey = 'promptforge.frontend-demo.v1';
const emptyData = () => ({ profile: null, attempts: [], drafts: {} });

export function loadData(storage = localStorage) {
  try {
    const raw = storage.getItem(storageKey) ?? storage.getItem(legacyKey);
    if (raw === null) return emptyData();
    const data = JSON.parse(raw);
    if (
      !data ||
      !Array.isArray(data.attempts) ||
      !data.drafts ||
      typeof data.drafts !== 'object' ||
      Array.isArray(data.drafts)
    )
      throw new Error('Invalid data');
    if (
      data.attempts.some(
        (item) =>
          !item ||
          typeof item.id !== 'string' ||
          typeof item.taskId !== 'string' ||
          typeof item.prompt !== 'string' ||
          !Number.isFinite(item.score) ||
          !Number.isFinite(item.createdAt),
      )
    )
      throw new Error('Invalid attempt');
    const profile =
      data.active !== false && data.profile
        ? { name: String(data.profile.name), email: String(data.profile.email) }
        : null;
    return { profile, attempts: data.attempts, drafts: data.drafts };
  } catch {
    throw new Error(
      'Browser storage cannot be read. Check permissions or clear damaged site data.',
    );
  }
}

export function writeData(data, storage = localStorage) {
  try {
    storage.setItem(storageKey, JSON.stringify(data));
  } catch {
    throw new Error('Browser storage is unavailable. Changes were not saved.');
  }
}

export function saveProfile(profile) {
  const data = loadData();
  data.profile = profile ? { name: profile.name, email: profile.email } : null;
  writeData(data);
}

export function saveDraft(taskId, prompt) {
  const data = loadData();
  data.drafts[taskId] = prompt;
  writeData(data);
}

export function saveAttempt(taskId, prompt, result) {
  const data = loadData();
  const attempt = {
    id: crypto.randomUUID(),
    taskId,
    prompt,
    score: result.score,
    criteria: result.criteria.map(({ id, score }) => ({ id, score })),
    createdAt: Date.now(),
  };
  data.attempts.unshift(attempt);
  writeData(data);
  return attempt;
}

export function deleteAttempt(id) {
  const data = loadData();
  data.attempts = data.attempts.filter((item) => item.id !== id);
  writeData(data);
}
