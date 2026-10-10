'use strict';

import { phrase, write, t, getLocale } from './i18n.js';
import { guideExample } from './locales/guide.js';

import { api } from './main.js';
import { $, element, text, message, hidden, formValues, showErrors, clearErrors, liveErrors } from './ui.js';
import { validEmail } from './logic.js';

export function init() {
  const snippets = [...document.querySelectorAll('table code')].map(node => ({ node, source: node.textContent.trim() }));
  function translateExamples() {
    for (const { node, source } of snippets) write(node, t(source), true);
    write(document.querySelector('.code-window pre code'), guideExample[getLocale()], true);
  }
  document.addEventListener('promptforge:language', translateExamples); translateExamples();
  const form = $('#feedback-form'); const submit = $('#feedback-submit'); const input = $('#fb-message');
  form.noValidate = true; submit.type = 'submit'; input.maxLength = 2000; $('#fb-name').maxLength = 80;
  $('#fb-date').min = new Date().toISOString().slice(0, 10);
  const counter = element('p', 'small text-body-secondary mt-1', phrase('{count} / 2000 characters', { count: 0 }), { id: 'feedback-counter' }); input.after(counter);
  function validate(values) {
    const errors = {};
    if (values.name.trim().length < 2 || values.name.trim().length > 80) errors.name = 'Use 2–80 characters.';
    if (!validEmail(values.email)) errors.email = 'Enter a valid email address.';
    if (!values.topic) errors.topic = 'Choose a subject.';
    if (!Number.isInteger(Number(values.priority)) || Number(values.priority) < 1 || Number(values.priority) > 5) errors.priority = 'Use a whole number from 1 to 5.';
    if (values.message.trim().length < 20 || values.message.length > 2000) errors.message = 'Write 20–2,000 characters.';
    if (values.topic === 'bug' && values.message.trim().length < 50) errors.message = 'Describe the bug and steps to reproduce it in at least 50 characters.';
    if (values.phone && !/^\+?[\d\s()-]{7,25}$/.test(values.phone)) errors.phone = 'Enter a valid phone number or leave it empty.';
    if (values.preferred_date && values.preferred_date < new Date().toISOString().slice(0, 10)) errors.preferred_date = 'Choose today or a future date.';
    return errors;
  }
  function update() { write(counter, phrase('{count} / 2000 characters', { count: input.value.length })); message($('#feedback-success')); message($('#feedback-error')); hidden($('#feedback-summary'), true); }
  liveErrors(form, validate, update); form.addEventListener('change', update);
  form.addEventListener('submit', async event => {
    event.preventDefault(); message($('#feedback-error')); message($('#feedback-success'));
    const values = formValues(form);
    if (!showErrors(form, validate(values))) return;
    submit.disabled = true;
    try {
      const result = await api('feedback', 'POST', values);
      text('#feedback-summary-subject', phrase('{topic} · priority {priority} · urgency {urgency}', { topic: phrase(result.summary.topic), priority: result.summary.priority, urgency: phrase(result.summary.urgency) }));
      text('#feedback-summary-message', phrase('{name} ({email}): {message}{date}', { name: result.summary.name, email: result.summary.email, message: result.summary.message, date: result.summary.preferred_date ? phrase(' · preferred date: {date}', { date: result.summary.preferred_date }) : '' }));
      hidden($('#feedback-summary'), false);
      message($('#feedback-success'), phrase('{notice} Reference: {reference}', { notice: phrase(result.notice), reference: result.id })); text('#feedback-status', 'Message saved.');
    } catch (error) { if (error.fields) showErrors(form, error.fields); message($('#feedback-error'), error.message, true); }
    finally { submit.disabled = false; }
  });
  form.addEventListener('reset', () => { queueMicrotask(() => { clearErrors(form); update(); text('#feedback-status', 'Form cleared.'); }); });
}
