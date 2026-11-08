'use strict';

import { $, showMessage } from './jquery-ui.js';
import { bindForm } from './forms.js';
import { feedbackErrors } from './validation.js';
import { setupFaq } from './effects.js';
export function init() {
  setupFaq();
  $('#feedback-counter').html('<span data-count>0</span> / 2000 characters');
  const counter = () =>
    $('#feedback-counter').find('[data-count]').text($('#fb-message').val().length);
  const form = bindForm('#feedback-form', feedbackErrors, (values) => {
    form.trigger('reset');
    $('#feedback-summary')
      .text(`${values.name} (${values.email}): ${values.message}`)
      .removeClass('is-hidden');
    showMessage(
      '#feedback-success',
      'Validation passed. This is a demonstration; no message was sent.',
    );
  });
  form.on('input change', function () {
    counter();
    $('#feedback-summary').addClass('is-hidden');
  });
  form.on('reset', function () {
    $('#feedback-summary').addClass('is-hidden');
    queueMicrotask(counter);
  });
}
