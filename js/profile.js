'use strict';

import { phrase, write } from './i18n.js';

import { tasks } from './data.js';
import { progress, masteryScore } from './logic.js';
import { app, api, setState } from './main.js';
import { $, element, text, hidden, message, cloneTemplate, renderList, fill } from './ui.js';
import { subscriptionSection } from './subscription.js';
import { recommendTraining } from './training.js';
import { renderAvatar } from './avatar.js';
import { createSettings } from './settings.js';

export function init() {
  const logout = $('#profile-logout');
  logout.addEventListener('click', async () => {
    logout.disabled = true;
    try { await api('logout', 'POST', {}); location.assign('login.html'); }
    catch (error) { message($('#app-status'), error.message, true); logout.disabled = false; }
  });
  const subscription = subscriptionSection();
  $('#profile-plan-slot').append(subscription);
  const guest = $('#profile-guest');
  guest.replaceChildren(element('p', '', 'Create an account to keep your drafts and results.'), element('a', 'btn btn-primary', 'Create an account', { href: 'register.html?next=profile.html' }), element('a', 'text-link', 'Log in', { href: 'login.html?next=profile.html' }));
  $('#achievements > summary').append(element('span', 'count-badge', '', { id: 'achievement-count' }));
  const settings = createSettings();
  function render() {
    renderAvatar($('.profile-hero .profile-avatar'), app.user); settings.render();
    const summary = progress(app.attempts);
    const viewingPlans = location.hash === '#subscription';
    text('#profile-name', app.user?.name || (viewingPlans ? 'Compare plans' : 'Profile'), Boolean(app.user)); text('#profile-level', summary.tier);
    text('#profile-bio', app.user?.bio || '', true);
    hidden($('#profile-bio'), !app.user?.bio); hidden($('#profile-level'), !app.user);
    text('#profile-account-summary', app.user ? phrase('{email} · {interest}', { email: app.user.email, interest: phrase(app.user.interest.replaceAll('-', ' ')) }) : 'Log in to view your results and manage your plan.');
    hidden(guest, Boolean(app.user) || viewingPlans);
    hidden($('#profile-jumps'), !app.user);
    hidden($('.profile-plan-column'), !app.user && !viewingPlans);
    hidden($('.metrics-row'), !app.user); hidden($('.profile-main'), !app.user);
    $('.profile-content').classList.toggle('is-guest', !app.user);
    hidden($('.profile-hero > .btn'), !app.user);
    const next = recommendTraining(app.attempts, app.drafts, app.user?.interest);
    $('.profile-hero > .btn').href = next ? `task.html?id=${next.task.id}` : 'tasks.html';
    $('#profile-recent-empty a').href = next ? `task.html?id=${next.task.id}` : 'tasks.html';
    text('#profile-solved-count', summary.mastered); text('#profile-average-score', summary.attempts ? summary.average.toFixed(2) : '—'); text('#profile-attempt-count', summary.attempts); text('#profile-total-points', summary.points.toFixed(2));
    const unlocked = {
      'first-step': summary.attempts > 0,
      copywriter: app.attempts.some(a => a.score >= masteryScore && tasks.find(t => t.id === a.taskId)?.category === 'copywriting'),
      'data-master': app.attempts.some(a => a.score >= 9 && tasks.find(t => t.id === a.taskId)?.category === 'data-analysis')
    };
    for (const [key, active] of Object.entries(unlocked)) {
      const card = $(`#achievement-${key}`); card.classList.toggle('is-locked', !active); card.dataset.status = active ? 'unlocked' : 'locked';
      let state = card.querySelector('[data-achievement-state]');
      if (!state) { state = element('small', 'd-block mt-1', '', { 'data-achievement-state': '' }); card.querySelector('.d-flex.flex-column').append(state); }
      write(state, active ? 'Earned' : 'Not earned yet');
    }
    const count = Object.values(unlocked).filter(Boolean).length;
    text('#achievement-count', `${count}/3`);
    text('#achievements-status', phrase('Achievements earned: {count} of 3.', { count }));
    hidden($('#profile-recent-empty'), app.attempts.length > 0); hidden($('#profile-recent-list'), app.attempts.length === 0);
    renderList($('#profile-recent-list'), app.attempts.slice(0, 3), attempt => {
      const card = cloneTemplate('#profile-attempt-template'); fill(card, 'task-title', tasks.find(t => t.id === attempt.taskId)?.title || attempt.taskId); fill(card, 'score', `${attempt.score.toFixed(2)} / 10`);
      card.querySelector('[data-field="task-link"]').href = `task.html?id=${attempt.taskId}&attempt=${attempt.id}`; return card;
    }, 'No attempts yet.');
  }
  document.addEventListener('promptforge:state', render);
  window.addEventListener('hashchange', render); render();
  if (location.hash === '#subscription') subscription.scrollIntoView({ block: 'start' });
}
