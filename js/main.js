'use strict';

import { jqueryReady } from './jquery-runtime.js';
import { loadData } from './storage.js';
async function start() {
  const authForm = document.querySelector('#login-form, #register-form');
  const holdSubmit = (event) => event.preventDefault();
  authForm?.addEventListener('submit', holdSubmit);
  const authSubmit = authForm?.querySelector('[type="submit"]');
  if (authSubmit) authSubmit.disabled = true;
  await jqueryReady();
  const { $ } = await import('./jquery-ui.js');
  const pages = {
    tasks: 'catalog',
    task: 'task',
    register: 'auth',
    login: 'auth',
    profile: 'profile',
    'my-solutions': 'solutions',
    leaderboard: 'leaderboard',
    'how-it-works': 'guide',
  };
  function updateNavigation() {
    const profile = loadData().profile;
    $('#nav-login, #nav-register').toggleClass('is-hidden', Boolean(profile));
    $('#nav-profile').text(profile?.name || 'Profile');
  }
  function closeNavigation() {
    $('#primary-nav').removeClass('d-flex').addClass('d-none');
    $('#navigation-toggle').attr('aria-expanded', 'false');
    $('#nav-backdrop').prop('hidden', true);
  }
  $('#navigation-toggle').on('click', function () {
    const open = $(this).attr('aria-expanded') !== 'true';
    $(this).attr('aria-expanded', String(open));
    $('#primary-nav').toggleClass('d-none', !open).toggleClass('d-flex', open);
    $('#nav-backdrop').prop('hidden', !open);
  });
  $('#nav-backdrop').on('click', closeNavigation);
  $('#primary-nav').on('click', 'a', closeNavigation);
  $(document).on('keydown', (event) => {
    if (event.key === 'Escape') closeNavigation();
  });
  $(window).on('resize', closeNavigation);
  $(document).on('profile:change', updateNavigation);
  updateNavigation();
  const moduleName = pages[$('#main-content').attr('data-page')];
  if (moduleName) (await import(`./${moduleName}.js`)).init();
  $('body').attr('data-ready', 'true');
  authForm?.removeEventListener('submit', holdSubmit);
  if (authSubmit) authSubmit.disabled = false;
}
start().catch((error) => {
  const status = document.getElementById('app-status');
  status.textContent = error.message;
  status.classList.remove('is-hidden');
  document.body.dataset.ready = 'true';
});
