'use strict';

import { $, element } from './jquery-ui.js';
export function setupPasswords(form) {
  form.on('click', '.password-toggle', function () {
    const button = $(this);
    const input = button.siblings('[data-password-field]');
    const visible = input.attr('type') === 'password';
    input.attr('type', visible ? 'text' : 'password');
    button.text(visible ? 'Hide password' : 'Show password').attr('aria-pressed', String(visible));
  });
  form
    .find('input[type="password"]')
    .attr('maxlength', 128)
    .each(function () {
      const input = $(this).attr('data-password-field', '');
      element('button', 'password-toggle btn btn-outline-light btn-sm mt-2', 'Show password', {
        type: 'button',
        'aria-controls': input.attr('id'),
        'aria-pressed': 'false',
      }).appendTo(input.parent());
    });
}
