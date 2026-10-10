'use strict';

import { tasks } from './data.js';
import { routes, routeProgress, statusLabels } from './training.js';
import { phrase } from './i18n.js';
import { element } from './ui.js';

export function practiceDrafts(state) {
  const drafts = { ...state.drafts };
  if (!state.user) for (const task of tasks) {
    try { const saved = JSON.parse(localStorage.getItem(`pf-draft:guest:${task.id}`)); if (typeof saved?.prompt === 'string') drafts[task.id] = saved.prompt; } catch { /* Account data and editing still work without browser storage. */ }
  }
  return drafts;
}

export function renderRoutes(container, attempts, drafts, { selected = '', onSelect } = {}) {
  const focused = container.contains(document.activeElement) ? document.activeElement.dataset.route : null;
  const fragment = document.createDocumentFragment();
  for (const [index, route] of routes.entries()) {
    const summary = routeProgress(route, attempts, drafts);
    const card = element(onSelect ? 'button' : 'a', `learning-route${route.id === selected ? ' is-selected' : ''}`, '',
      onSelect ? { type: 'button', 'data-route': route.id, 'aria-pressed': route.id === selected } : { href: `tasks.html?route=${route.id}#learning-routes`, 'data-route': route.id });
    if (onSelect) card.addEventListener('click', () => onSelect(route.id));
    const heading = element('span', 'route-title'); heading.append(element('span', 'route-index', String(index + 1).padStart(2, '0')), element('strong', '', route.title));
    const markers = element('span', 'route-markers', '', { 'aria-hidden': 'true' });
    for (const step of summary.steps) markers.append(element('span', `route-marker is-${step.status}`));
    card.append(heading, element('span', 'route-goal', route.goal), markers,
      element('span', 'route-progress-label', phrase('{mastered} / {total} mastered', { mastered: summary.mastered, total: summary.steps.length })));
    fragment.append(card);
  }
  container.replaceChildren(fragment);
  if (focused) container.querySelector(`[data-route="${focused}"]`)?.focus({ preventScroll: true });
}

export function statusBadge(status) { return element('span', `practice-status is-${status}`, statusLabels[status]); }
