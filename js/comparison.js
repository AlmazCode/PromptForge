'use strict';

import { attemptTimeline, compareScores, promptDiff } from './training.js';
import { phrase, write } from './i18n.js';
import { element, hidden, dateTime } from './ui.js';

export const signedDelta = value => `${value > 0 ? '+' : ''}${value.toFixed(2)}`;
const deltaClass = value => value > 0 ? 'delta-up' : value < 0 ? 'delta-down' : 'delta-flat';

export function createComparison(container, taskId, getAttempts) {
  const heading = element('header', 'section-heading');
  const total = element('span', 'comparison-total', '', { id: 'comparison-total', role: 'status' });
  heading.append(element('h2', '', 'Compare saved attempts', { id: 'attempt-comparison-title' }), total);
  const controls = element('div', 'comparison-controls');
  const before = element('select', 'form-select', '', { id: 'comparison-before' });
  const after = element('select', 'form-select', '', { id: 'comparison-after' });
  for (const [field, label] of [[before, 'Earlier attempt'], [after, 'Later attempt']]) {
    const group = element('div'); group.append(element('label', 'form-label', label, { for: field.id }), field); controls.append(group);
  }
  const table = element('table', 'comparison-scores', '', { 'aria-label': 'Criterion changes between saved attempts' });
  const head = element('thead'); const row = element('tr');
  for (const label of ['Criterion', 'Earlier', 'Later', 'Change']) row.append(element('th', '', label, { scope: 'col' }));
  head.append(row); const body = element('tbody'); const foot = element('tfoot'); table.append(head, body, foot);
  const diff = element('details', 'disclosure prompt-diff', '', { open: '' });
  diff.append(element('summary', '', 'Prompt changes'));
  const legend = element('p', 'diff-legend'); legend.append(element('span', 'diff-removed', 'Removed'), element('span', 'diff-added', 'Added'));
  const identical = element('p', 'mastery-note is-hidden', 'Identical prompt text. Scores can vary between AI checks.');
  const columns = element('div', 'prompt-diff-grid');
  const left = element('pre', 'prompt-diff-text', '', { tabindex: 0, 'aria-label': 'Earlier prompt with removals marked' });
  const right = element('pre', 'prompt-diff-text', '', { tabindex: 0, 'aria-label': 'Later prompt with additions marked' });
  for (const [output, label] of [[left, 'Earlier'], [right, 'Later']]) {
    const column = element('div'); column.append(element('h3', '', label), output); columns.append(column);
  }
  diff.append(legend, identical, columns);
  container.append(heading, controls, table, diff, element('p', 'mastery-note', 'Comparison uses saved results and does not consume an AI check.'));
  let beforeId; let afterId;
  function render(preferredId) {
    const timeline = attemptTimeline(getAttempts(), taskId);
    hidden(container, timeline.length < 2);
    if (timeline.length < 2) { beforeId = null; afterId = null; return; }
    const requested = timeline.findIndex(attempt => attempt.id === preferredId);
    if (requested > 0) { afterId = preferredId; beforeId = timeline[requested - 1].id; }
    else if (requested === 0) { beforeId = preferredId; afterId = timeline.at(-1).id; }
    let afterIndex = timeline.findIndex(attempt => attempt.id === afterId);
    if (afterIndex < 1) { afterIndex = timeline.length - 1; afterId = timeline[afterIndex].id; }
    if (!timeline.slice(0, afterIndex).some(attempt => attempt.id === beforeId)) beforeId = timeline[afterIndex - 1].id;
    const option = (attempt, index) => element('option', '', phrase('Attempt {number} · {score}/10 · {date}', { number: index + 1, date: () => dateTime(attempt.createdAt), score: attempt.score.toFixed(2) }), { value: attempt.id });
    before.replaceChildren(...timeline.slice(0, afterIndex).map(option));
    after.replaceChildren(...timeline.slice(1).map((attempt, index) => option(attempt, index + 1)));
    before.value = beforeId; after.value = afterId;
    const first = timeline.find(attempt => attempt.id === beforeId); const last = timeline[afterIndex];
    const comparison = compareScores(first, last);
    total.className = `comparison-total ${deltaClass(comparison.delta)}`;
    write(total, phrase('Total change: {delta}', { delta: signedDelta(comparison.delta) }));
    body.replaceChildren(...comparison.criteria.map(criterion => {
      const row = element('tr', '', '', { 'data-criterion': criterion.id });
      row.append(element('th', '', criterion.name, { scope: 'row' }), element('td', '', criterion.before.toFixed(1)), element('td', '', criterion.after.toFixed(1)),
        element('td', deltaClass(criterion.delta), signedDelta(criterion.delta), { 'data-delta': criterion.id }));
      return row;
    }));
    const overall = element('tr'); overall.append(element('th', '', 'Overall score', { scope: 'row' }), element('td', '', first.score.toFixed(2)), element('td', '', last.score.toFixed(2)), element('td', deltaClass(comparison.delta), signedDelta(comparison.delta)));
    foot.replaceChildren(overall);
    const changes = promptDiff(first.prompt, last.prompt);
    hidden(identical, !changes.identical); hidden(legend, changes.identical);
    for (const [output, segments, tag] of [[left, changes.before, 'del'], [right, changes.after, 'ins']]) {
      output.replaceChildren(...segments.map(segment => {
        const node = element(segment.changed ? tag : 'span'); write(node, segment.text, true); return node;
      }));
    }
  }
  before.addEventListener('change', () => { beforeId = before.value; render(); });
  after.addEventListener('change', () => { afterId = after.value; render(); });
  return { render };
}
