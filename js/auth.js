'use strict';

import { phrase, write } from './i18n.js';
import { icon } from './icons.js';

import { tasks } from './data.js';
import { passwordChecks, registrationErrors, validEmail } from './logic.js';
import { app, api, setState } from './main.js';
import { $, element, text, hidden, message, formValues, showErrors, clearErrors, liveErrors } from './ui.js';

export function init() {
  const registration = $('#main-content').dataset.page === 'register';
  const prefix = registration ? 'register' : 'login';
  const form = $(`#${prefix}-form`); const submit = $(`#${prefix}-submit`);
  submit.type = 'submit'; form.noValidate = true;
  const checkboxes = form.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(field => { if (!document.getElementById(`${field.id}-error`)) {
    const output = element('div', 'invalid-feedback d-block', '', { id: `${field.id}-error` }); field.closest('label').after(output); field.setAttribute('aria-describedby', output.id);
  } });
  const nextParam = new URLSearchParams(location.search).get('next') || 'index.html';
  const next = /^(?:task\.html\?id=t\d{3}|profile\.html(?:#subscription)?|index\.html|tasks\.html|progress\.html|leaderboard\.html|my-solutions\.html)$/.test(nextParam) ? nextParam : 'index.html';
  if (!registration) $('#login-link-1')?.setAttribute('href', `register.html?next=${encodeURIComponent(next)}`);
  if (registration) $('#register-link-2').href = `login.html?next=${encodeURIComponent(next)}`;
  if (app.user) text(`#${prefix}-status`, phrase('You are signed in as {name}. You can open your profile or use a different account.', { name: app.user.name }));
  if (registration) {
    const select = $('#register-interest');
    select.replaceChildren(element('option', '', '— Select —', { value: '' }));
    [...new Set(tasks.map(task => task.category))].forEach(category => select.append(element('option', '', category.replaceAll('-', ' '), { value: category })));
    $('#register-about').maxLength = 1000; $('#register-name').maxLength = 80;
    $('#register-birthdate').max = new Date().toISOString().slice(0, 10);
    text('#register-password-help', '8–128 characters: uppercase and lowercase Latin letters, a digit and a symbol.');
  }
  const passwordFields = [...form.querySelectorAll('input[type="password"]')];
  for (const field of passwordFields) {
    field.maxLength = 128;
    field.setAttribute('data-password-field', '');
    const toggle = element('button', 'password-toggle', 'Show password', { type: 'button', 'aria-controls': field.id, 'aria-pressed': 'false' });
    toggle.addEventListener('click', () => { const show = field.type === 'password'; field.type = show ? 'text' : 'password'; write(toggle, show ? 'Hide password' : 'Show password'); toggle.setAttribute('aria-pressed', String(show)); });
    field.parentElement.append(toggle);
  }
  const list = element('ul', 'small list-unstyled mt-2 mb-0', '', { id: 'password-checklist', 'aria-label': 'Password requirements' });
  const labels = { length: '8–128 characters', upper: 'Uppercase Latin letter', lower: 'Lowercase Latin letter', digit: 'Digit', special: 'Special character' };
  const checks = {};
  if (registration) {
    for (const [key, label] of Object.entries(labels)) {
      checks[key] = element('li', 'password-requirement text-body-secondary');
      checks[key].append(icon('circle'), element('span', '', label), element('span', 'visually-hidden', 'Requirement not met'));
      list.append(checks[key]);
    }
    $('#register-password').parentElement.append(list);
  }
  function updateChecklist() {
    if (!registration) return;
    list.classList.toggle('is-hidden', !$('#register-password').value && document.activeElement !== $('#register-password'));
    const result = passwordChecks($('#register-password').value);
    for (const [key, ok] of Object.entries(result)) {
      checks[key].firstElementChild.replaceWith(icon(ok ? 'check' : 'circle'));
      write(checks[key].lastElementChild, ok ? 'Requirement met' : 'Requirement not met');
      checks[key].classList.toggle('text-success', ok);
      checks[key].classList.toggle('text-body-secondary', !ok);
    }
    const confirm = $('#register-password-confirm');
    if (confirm.value && confirm.value !== $('#register-password').value) {
      confirm.classList.add('is-invalid'); confirm.setAttribute('aria-invalid', 'true'); text('#register-password-confirm-error', 'Passwords must match exactly.');
    } else { confirm.classList.remove('is-invalid'); confirm.setAttribute('aria-invalid', 'false'); text('#register-password-confirm-error', ''); }
  }
  if (registration) {
    $('#register-password').addEventListener('focus', updateChecklist);
    $('#register-password').addEventListener('blur', updateChecklist);
    updateChecklist();
  }
  function validate(values) {
    if (registration) return registrationErrors(values);
    const errors = {};
    if (!validEmail(values.email)) errors.email = 'Enter a valid email address.';
    if (!values.password || values.password.length > 128) errors.password = 'Enter your password.';
    return errors;
  }
  liveErrors(form, validate, () => { message($(`#${prefix}-success`)); message($(`#${prefix}-error`)); updateChecklist(); });
  form.addEventListener('submit', async event => {
    event.preventDefault(); message($(`#${prefix}-success`)); message($(`#${prefix}-error`));
    const values = formValues(form);
    if (!showErrors(form, validate(values))) return;
    submit.disabled = true;
    write(submit, registration ? 'Creating account…' : 'Logging in…');
    try {
      const state = await api(prefix, 'POST', values); setState(state);
      passwordFields.forEach(field => { field.value = ''; field.type = 'password'; });
      form.querySelectorAll('[aria-controls]').forEach(button => { write(button, 'Show password'); button.setAttribute('aria-pressed', 'false'); });
      clearErrors(form); updateChecklist();
      message($(`#${prefix}-success`), registration ? phrase('Account created for {name}.', { name: state.user.name }) : phrase('Signed in as {name}.', { name: state.user.name }));
      const label = next.startsWith('task.html') ? 'Return to your task' : next.includes('#subscription') ? 'Manage subscription' : next === 'index.html' ? 'Start practising' : next === 'tasks.html' ? 'Browse exercises' : next === 'my-solutions.html' ? 'View attempt history' : next === 'progress.html' ? 'View progress' : next === 'leaderboard.html' ? 'View leaderboard' : 'Open profile';
      const link = element('a', 'btn btn-primary mt-3', label, { href: next });
      $(`#${prefix}-success`).append(link);
      form.classList.add('is-complete');
      text('.auth-panel h1', registration ? 'Account created' : 'Signed in');
      hidden($('.auth-panel .page-intro'), true);
      text(`#${prefix}-status`, '');
      link.focus();
    } catch (error) { if (error.fields) showErrors(form, error.fields); message($(`#${prefix}-error`), error.message, true); }
    finally { submit.disabled = false; write(submit, registration ? 'Register' : 'Log in'); }
  });
  form.addEventListener('reset', () => { queueMicrotask(() => { clearErrors(form); message($(`#${prefix}-error`)); message($(`#${prefix}-success`)); updateChecklist(); text(`#${prefix}-status`, 'Form cleared.'); }); });
}
