'use strict';

import { $, element, showMessage } from './jquery-ui.js';
import { bindForm } from './forms.js';
import { authDestination, profileErrors } from './validation.js';
import { loadData, saveProfile } from './storage.js';
import { setupPasswords } from './password.js';
export function init() {
  const registration = $('#main-content').attr('data-page') === 'register';
  const prefix = registration ? 'register' : 'login';
  const next = authDestination(new URLSearchParams(location.search).get('next'));
  const continuation = next.startsWith('task.html') ? 'Return to your task' : next === 'profile.html' ? 'Open profile' : 'Continue';
  const otherPage = registration ? 'login.html' : 'register.html';
  $(`#nav-${registration ? 'login' : 'register'}`).attr('href', `${otherPage}?next=${encodeURIComponent(next)}`);
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
        element('a', 'btn btn-outline-light d-block mt-3', continuation, {
          href: next,
        }),
      );
    },
  );
  if (registration) $('#register-name').attr('maxlength', 80);
  $(`#${prefix}-email`).attr('maxlength', 254);
  setupPasswords(form);
  form.on('reset', function () {
    form.find('[data-password-field]').attr('type', 'password');
    form.find('.password-toggle').text('Show password').attr('aria-pressed', 'false');
  });
}
