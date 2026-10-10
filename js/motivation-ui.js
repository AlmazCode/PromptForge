'use strict';

import { phrase } from './i18n.js';
import { app } from './main.js';
import { practiceGoals } from './motivation.js';
import { element, hidden } from './ui.js';

export function mountGoals(before) {
  const section = element('section', 'practice-goals is-hidden', '', { id: 'practice-goals', 'aria-labelledby': 'practice-goals-title' });
  const heading = element('header', 'section-heading');
  heading.append(element('h2', '', 'Training goals', { id: 'practice-goals-title' }), element('a', 'text-link', 'View leaderboard', { href: 'leaderboard.html' }));
  const grid = element('div', 'goals-grid'); section.append(heading, grid); before.before(section);
  function goal(title, metric, description, value, max) {
    const card = element('article', 'training-goal');
    card.append(element('h3', '', title), element('strong', 'goal-value', metric), element('p', '', description));
    if (max) card.append(element('progress', '', '', { max, value: Math.min(value, max), 'aria-label': title }));
    return card;
  }
  function render() {
    hidden(section, !app.user);
    if (!app.user) return;
    const goals = practiceGoals(app.attempts); grid.replaceChildren();
    grid.append(goal('Days in a row', goals.streak, goals.todayChecked ? 'Today’s practice is recorded.' : goals.streak ? 'One check today continues your streak.' : 'Start with one check today.'));
    grid.append(goal('Weekly goal', `${Math.min(goals.weeklyCount, goals.weeklyTarget)} / ${goals.weeklyTarget}`, goals.weeklyCount >= goals.weeklyTarget ? 'Weekly goal reached.' : goals.weeklyMode === 'mastery' ? 'Master new exercises at 8/10 or higher.' : 'Practise on three different days this week.', goals.weeklyCount, goals.weeklyTarget));
    const next = goals.summary.next;
    grid.append(goal('Next level', next ? phrase('{points} pts', { points: (next.min - goals.summary.points).toFixed(2) }) : phrase(goals.summary.tier), next ? phrase('To {tier}', { tier: phrase(next.name) }) : 'All levels reached.', goals.summary.points - goals.levelStart, next ? next.min - goals.levelStart : 0));
  }
  document.addEventListener('promptforge:state', render); document.addEventListener('promptforge:language', render); render();
  return section;
}
