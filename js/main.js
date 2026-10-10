'use strict';

import { $, $$, element, message, dateTime, hidden } from './ui.js';
import { setupI18n, translatePage, phrase, write } from './i18n.js';
import { renderAvatar } from './avatar.js';

export const app = { user: null, attempts: [], drafts: {}, quota: null, aiReady: false, demoBilling: false, model: '', serverTime: Date.now(), online: false };

export async function api(path, method = 'GET', body) {
  let response;
  try {
    const image = body instanceof Blob;
    response = await fetch(`/api/${path}`, { method, credentials: 'same-origin', headers: body === undefined ? {} : { 'Content-Type': image ? body.type : 'application/json' }, body: body === undefined ? undefined : image ? body : JSON.stringify(body) });
  } catch { throw new Error('Cannot connect to PromptForge. Check your connection and try again.'); }
  let result;
  try { result = await response.json(); } catch { throw new Error('The service is unavailable. Try again later.'); }
  if (!response.ok) throw Object.assign(new Error(result.message || 'The request failed.'), result, { status: response.status });
  return result;
}

export function setState(state) {
  Object.assign(app, state, { online: true });
  updateNavigation();
  document.dispatchEvent(new CustomEvent('promptforge:state'));
}

export async function refresh() { const state = await api('state'); setState(state); return state; }

function updateNavigation() {
  const login = $('#nav-login'); const register = $('#nav-register'); const account = $('#nav-profile');
  hidden(login, Boolean(app.user)); hidden(account, !app.user);
  hidden(register, Boolean(app.user));
  if (app.user) {
    renderAvatar($('#account-initial'), app.user);
  }
  if ($('#main-content').dataset.page === 'profile') $('#nav-profile')?.setAttribute('aria-current', 'page');
}

export function quotaLabel(quota = app.quota) {
  if (!quota) return 'Create a free account for 10 AI checks per 24 hours.';
  return quota.plan === 'pro' ? phrase('Pro · unlimited daily checks · active until {date}', { date: () => dateTime(quota.proUntil) })
    : phrase(quota.resetsAt ? 'Free · {remaining} of 10 checks left · resets {date}' : 'Free · {remaining} of 10 checks left · your 24-hour period starts with your first check', { remaining: quota.remaining, date: () => dateTime(quota.resetsAt) });
}

function setupMobileNav() {
  const toggle = $('#navigation-toggle'); const nav = $('#primary-nav');
  const header = $('#site-header'); const backdrop = $('#nav-backdrop');
  const mobile = matchMedia('(max-width: 1199px)');
  let open = false;
  function change(next, restoreFocus = false) {
    open = Boolean(next && mobile.matches);
    header.classList.toggle('nav-open', open); document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    nav.inert = mobile.matches && !open; backdrop.hidden = !open;
    if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => change(!open));
  backdrop.addEventListener('click', () => change(false, true));
  nav.addEventListener('click', event => { if (event.target.closest('a')) change(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && open) change(false, true);
    if (event.key === 'Tab' && open) {
      const focusable = [...header.querySelectorAll('a, button, summary, input, select')].filter(node => node.getClientRects().length && !node.disabled && node.tabIndex >= 0);
      const first = focusable[0]; const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  mobile.addEventListener('change', () => change(false)); change(false);
}

function setupDisclosures() {
  function revealHash() {
    const id = location.hash.slice(1); if (!id) return;
    const target = document.getElementById(id); if (!target) return;
    if (target.tagName === 'DIALOG') return;
    for (let node = target; node; node = node.parentElement) if (node.tagName === 'DETAILS') node.open = true;
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }
  window.addEventListener('hashchange', revealHash); revealHash();
}

async function start() {
  setupI18n();
  document.addEventListener('promptforge:language', updateNavigation);
  const status = element('div', 'is-hidden alert', '', { id: 'app-status', role: 'status' });
  $('#main-content').prepend(status);
  setupMobileNav();
  try { await refresh(); }
  catch (error) { message(status, error.message, true); }
  const pages = { index: 'home', tasks: 'catalog', 'task-template': 'task', register: 'auth', login: 'auth', profile: 'profile', 'my-solutions': 'solutions', progress: 'progress', leaderboard: 'leaderboard', 'how-it-works': 'guide' };
  const page = pages[$('#main-content').dataset.page];
  if (page) {
    try { const module = await import(`./${page}.js`); await module.init(); }
    catch { message(status, 'The page could not load. Reload it to try again.', true); }
  }
  translatePage();
  setupDisclosures();
  document.body.dataset.ready = 'true';
  // Reconcile limits/subscription across tabs and after an expired 24-hour period.
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh().catch(error => message(status, error.message, true)); });
  setInterval(() => {
    if (!document.hidden && app.online && ((app.quota?.resetsAt && Date.now() >= app.quota.resetsAt) || (app.quota?.proUntil && Date.now() >= app.quota.proUntil))) refresh().catch(() => {});
  }, 30000);
}

// The entry module's exports are initialized before page modules are loaded.
start();
