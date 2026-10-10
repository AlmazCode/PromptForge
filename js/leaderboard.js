'use strict';

import { phrase } from './i18n.js';
import { app, api, setState } from './main.js';
import { recommendTraining } from './training.js';
import { $, element, hidden, text, message } from './ui.js';

export async function init() {
  let data = null; let busy = false; let failed = false; let requestVersion = 0;
  const refresh = $('#ranking-refresh'); const more = $('#ranking-more');
  function practiceLink() {
    const next = recommendTraining(app.attempts, app.drafts, app.user?.interest);
    return element('a', 'btn btn-primary', app.attempts.length ? 'Continue practising' : 'Try the first exercise', { href: next ? `task.html?id=${next.task.id}` : 'tasks.html' });
  }
  function render() {
    const personal = $('#ranking-personal'); personal.replaceChildren();
    if (!app.user) {
      personal.append(element('h2', '', 'Join the ranking'), element('p', '', 'Save your results, track your place and work towards the next one.'));
      const actions = element('div', 'hero-actions');
      actions.append(element('a', 'btn btn-primary', 'Create an account', { href: 'register.html?next=leaderboard.html' }), element('a', 'text-link', 'Log in', { href: 'login.html?next=leaderboard.html' })); personal.append(actions);
    } else if (!app.user.leaderboardVisible) {
      personal.append(element('h2', '', 'Your results are private'), element('p', '', 'Join to publish your display name and aggregate results. Your prompts, feedback and email stay private.'));
      const join = element('button', 'btn btn-primary', 'Join leaderboard', { type: 'button', id: 'ranking-join' }); join.disabled = busy;
      join.addEventListener('click', async () => {
        join.disabled = true; message($('#ranking-error'));
        try { setState(await api('profile', 'PATCH', { leaderboardVisible: true })); }
        catch (error) { message($('#ranking-error'), error.message, true); join.disabled = false; }
      }); personal.append(join);
    } else if (!data?.viewer) {
      personal.append(element('h2', '', app.attempts.length ? 'Your place is being updated' : 'Your first result puts you on the board'), element('p', '', 'Check a prompt to record your result. A higher best score or a new exercise increases your total.'), practiceLink());
    } else {
      const top = element('div', 'ranking-place');
      top.append(element('span', '', 'Your place'), element('strong', '', `#${data.viewer.rank}`, { id: 'ranking-your-place' }), element('span', 'ranking-personal-points', phrase('{points} / 160 points', { points: data.viewer.points.toFixed(2) })));
      personal.append(top);
      personal.append(element('p', 'ranking-target', data.nextTarget ? phrase('{points} more points to reach place {rank}.', { points: data.nextTarget.gap.toFixed(2), rank: data.nextTarget.rank }) : 'You share the highest score. Keep improving your results.', { id: 'ranking-next-target' }));
      const actions = element('div', 'hero-actions'); actions.append(practiceLink(), element('a', 'text-link', 'Leaderboard settings', { href: 'profile.html#settings/privacy' })); personal.append(actions);
    }
    const body = $('#ranking-body'); body.replaceChildren();
    for (const participant of data?.rows || []) {
      const row = element('tr', participant.isYou ? 'is-you' : '');
      const place = element('td', 'ranking-position', `#${participant.rank}`);
      const name = element('th', 'ranking-name', '', { scope: 'row' });
      name.append(element('span', 'participant-name'));
      textNode(name.firstElementChild, participant.name);
      if (participant.isYou) name.append(element('span', 'ranking-you', 'You'));
      name.append(element('small', 'ranking-tier', participant.tier));
      name.append(element('small', 'ranking-mobile-stat', phrase('{count} / 16 mastered', { count: participant.mastered })));
      const points = element('td', 'ranking-points', participant.points.toFixed(2));
      points.append(element('small', '', '/ 160'));
      const mastered = element('td', 'ranking-mastered', phrase('{count} / 16 mastered', { count: participant.mastered }));
      row.append(place, name, points, mastered); body.append(row);
    }
    hidden($('#ranking-table'), !data?.rows.length);
    hidden($('#ranking-empty'), !data || data.total > 0);
    hidden(more, data?.nextOffset == null);
    text('#ranking-count', data ? phrase('Participants: {count}', { count: data.total }) : failed ? 'Ranking unavailable. Refresh to try again.' : 'Loading ranking…');
    refresh.disabled = busy; more.disabled = busy;
  }
  async function load(append = false) {
    const version = ++requestVersion;
    const offset = append ? data?.nextOffset : 0;
    if (offset == null) return;
    busy = true; failed = false; refresh.disabled = true; more.disabled = true; message($('#ranking-error'));
    try {
      const result = await api(`leaderboard?offset=${offset}`);
      if (version !== requestVersion) return;
      data = { ...result, rows: append ? [...data.rows, ...result.rows] : result.rows };
    } catch (error) {
      if (version === requestVersion) { failed = true; message($('#ranking-error'), error.message, true); }
    } finally {
      if (version === requestVersion) { busy = false; render(); }
    }
  }
  refresh.addEventListener('click', () => load()); more.addEventListener('click', () => load(true));
  document.addEventListener('promptforge:state', () => { render(); load(); });
  document.addEventListener('promptforge:language', render);
  render(); await load();
}

// Names are user content, so they must not be treated as translation keys.
function textNode(node, value) { node.textContent = value; node.setAttribute('data-i18n-ignore', ''); }
