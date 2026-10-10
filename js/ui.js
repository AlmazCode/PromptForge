'use strict';

import { write, getLocale, localeTag, writeAttribute, translatePage } from './i18n.js';

export const $ = selector => document.querySelector(selector);
export const $$ = selector => [...document.querySelectorAll(selector)];

export function element(tag, classes = '', text = '', attributes = {}) {
  const node = document.createElement(tag);
  if (classes) node.className = classes;
  if (text !== '') write(node, text);
  for (const [name, value] of Object.entries(attributes)) writeAttribute(node, name, value);
  return node;
}

export function text(selector, value, raw = false) { write($(selector), value, raw); }
export function hidden(node, hide) { if (node) node.classList.toggle('is-hidden', hide); }

export function message(node, value = '', error = false, raw = false) {
  if (!node) return;
  write(node, value, raw);
  node.classList.toggle('is-hidden', !value);
  node.classList.toggle('alert-danger', error);
  node.classList.toggle('alert-success', !error);
  node.classList.toggle('is-error', error);
  node.classList.toggle('is-success', !error);
  node.setAttribute('role', error ? 'alert' : 'status');
}

// Cards, rows, history records and tips share the same replacement/empty-state flow.
export function renderList(container, items, renderItem, emptyText, emptyTag = 'p') {
  const fragment = document.createDocumentFragment();
  if (items.length) items.forEach((item, index) => fragment.append(renderItem(item, index)));
  else if (container.tagName === 'TBODY') {
    const row = element('tr');
    row.append(element('td', 'text-body-secondary p-3', emptyText, { colspan: container.closest('table').querySelectorAll('thead th').length || 4 }));
    fragment.append(row);
  } else fragment.append(element(emptyTag, 'text-body-secondary p-3', emptyText));
  container.replaceChildren(fragment);
  return items.length;
}

export function cloneTemplate(selector) {
  const fragment = $(selector).content.cloneNode(true);
  fragment.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
  translatePage(fragment);
  return fragment.firstElementChild;
}

export function fill(node, field, value) {
  const target = node.querySelector(`[data-field="${field}"]`);
  if (target) write(target, value, ['prompt', 'feedback'].includes(field));
  return target;
}

export function dateTime(value) {
  // Some browsers lack Kazakh month names and display codes such as "M10".
  const options = getLocale() === 'kk'
    ? { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }
    : { dateStyle: 'medium', timeStyle: 'short' };
  return new Intl.DateTimeFormat(localeTag(), options).format(new Date(value));
}

export function formValues(form) {
  return Object.fromEntries(new FormData(form));
}

export function clearErrors(form) {
  form.querySelectorAll('.is-invalid, .is-valid, .is-error').forEach(node => node.classList.remove('is-invalid', 'is-valid', 'is-error'));
  form.querySelectorAll('[aria-invalid]').forEach(node => node.setAttribute('aria-invalid', 'false'));
  form.querySelectorAll('.invalid-feedback').forEach(node => write(node, ''));
}

export function showErrors(form, errors, focus = true) {
  clearErrors(form);
  let first = null;
  for (const [name, error] of Object.entries(errors)) {
    const field = form.querySelector(`[name="${name}"]`);
    if (!field) continue;
    for (let parent = field.parentElement; parent && parent !== form; parent = parent.parentElement) {
      if (parent.tagName === 'DETAILS') parent.open = true;
    }
    first ||= field;
    field.classList.add('is-invalid'); field.setAttribute('aria-invalid', 'true');
    let output = document.getElementById(`${field.id}-error`);
    if (!output) {
      output = element('div', 'invalid-feedback d-block', '', { id: `${field.id}-error` });
      field.closest('label') ? field.closest('label').after(output) : field.after(output);
      field.setAttribute('aria-describedby', `${field.getAttribute('aria-describedby') || ''} ${output.id}`.trim());
    }
    write(output, error);
  }
  if (focus) first?.focus();
  return Object.keys(errors).length === 0;
}

export function liveErrors(form, validate, onChange = () => {}) {
  form.addEventListener('input', event => {
    const field = event.target;
    if (field.classList.contains('is-invalid')) {
      const errors = validate(formValues(form));
      const previous = [...form.querySelectorAll('.is-invalid')].map(node => node.name);
      const relevant = Object.fromEntries(Object.entries(errors).filter(([name]) => previous.includes(name)));
      showErrors(form, relevant, false);
    }
    onChange();
  });
}

export function confirmation(container, question, onConfirm, onCancel = () => {}) {
  const panel = element('div', 'border rounded p-3 mt-3', '', { role: 'group', 'aria-label': question });
  panel.append(element('p', 'small', question));
  const yes = element('button', 'btn btn-danger btn-sm me-2', 'Confirm', { type: 'button' });
  const no = element('button', 'btn btn-outline-light btn-sm', 'Cancel', { type: 'button' });
  yes.addEventListener('click', async () => {
    yes.disabled = true; no.disabled = true;
    try { await onConfirm(); panel.remove(); }
    catch (error) { panel.append(element('p', 'text-danger small mt-2', error.message, { role: 'alert' })); yes.disabled = false; no.disabled = false; }
  });
  no.addEventListener('click', () => { panel.remove(); onCancel(); });
  panel.append(yes, no); container.append(panel); no.focus();
  return panel;
}
