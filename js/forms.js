'use strict';

import { $, hideMessage, showMessage } from './jquery-ui.js';
export function formValues(form) {
  const values = {};
  $(form)
    .find('[name]:not(:disabled)')
    .each(function () {
      const field = $(this);
      if (field.is(':checkbox') && !field.prop('checked')) return;
      const name = field.attr('name');
      values[name] = name.includes('password') ? field.val() : field.val().trim();
    });
  return values;
}

function clearField(field) {
  field.removeClass('is-invalid').attr('aria-invalid', 'false');
  field.closest('.form-field').find('.invalid-feedback').removeClass('d-block').text('');
}

export function showErrors(form, errors) {
  form.find('[name]').each(function () {
    const field = $(this);
    clearField(field);
    const error = errors[field.attr('name')];
    if (error) {
      field.addClass('is-invalid').attr('aria-invalid', 'true');
      field.closest('.form-field').find('.invalid-feedback').addClass('d-block').text(error);
    }
  });
  form.find('.is-invalid').first().trigger('focus');
}

export function bindForm(selector, validate, onValid) {
  const form = $(selector).prop('noValidate', true);
  const prefix = form.attr('id').replace('-form', '');
  form.on('submit', function (event) {
    event.preventDefault();
    hideMessage(`#${prefix}-success`);
    hideMessage(`#${prefix}-error`);
    const values = formValues(form);
    const errors = validate(values);
    showErrors(form, errors);
    if (Object.keys(errors).length) return;
    try {
      onValid(values, form);
    } catch (error) {
      showMessage(`#${prefix}-error`, error.message, true);
    }
  });
  form.on('input change', '[name]', function () {
    const field = $(this);
    if (!validate(formValues(form))[field.attr('name')]) clearField(field);
    hideMessage(`#${prefix}-success`);
    hideMessage(`#${prefix}-error`);
  });
  form.on('reset', function () {
    form.find('[name]').each(function () {
      clearField($(this));
    });
    hideMessage(`#${prefix}-success`);
    hideMessage(`#${prefix}-error`);
  });
  return form;
}
