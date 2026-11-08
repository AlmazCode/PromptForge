'use strict';

import { $, element, showMessage } from './jquery-ui.js';
import { bindForm } from './forms.js';
import { profileErrors } from './validation.js';
import { loadData, saveProfile } from './storage.js';
import { setupPasswords } from './password.js';
export function init() {
  const registration = $('#main-content').attr('data-page') === 'register';
  const prefix = registration ? 'register' : 'login';
  const form = bindForm(
    `#${prefix}-form`,
    (values) => profileErrors(values, registration),
    (values) => {
      const previous = loadData().profile;
      const name = registration ? values.name : previous?.name || values.email.split('@')[0];
      saveProfile({ name, email: values.email });
      form.trigger('reset');
      form.find('[data-password-field]').attr('type', 'password');
      form.find('.password-toggle').text('Show password').attr('aria-pressed', 'false');
      $(document).trigger('profile:change');
      showMessage(
        `#${prefix}-success`,
        'Demo profile saved locally. No real account was created. Passwords were discarded.',
      ).append(
        element('a', 'btn btn-outline-light d-block mt-3', 'Open profile', {
          href: 'profile.html',
        }),
      );
    },
  );
  setupPasswords(form);
  form.on('reset', function () {
    form.find('[data-password-field]').attr('type', 'password');
    form.find('.password-toggle').text('Show password').attr('aria-pressed', 'false');
  });
}
