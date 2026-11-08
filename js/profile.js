'use strict';

import { $, pageError } from './jquery-ui.js';
import { loadData, saveProfile } from './storage.js';
import { bestAttempts } from './logic.js';

export function init() {
  function render() {
    const { profile, attempts } = loadData();
    $('#profile-name').text(profile?.name || 'Guest');
    $('#profile-email').text(profile?.email || '');
    $('#profile-guest').toggleClass('is-hidden', Boolean(profile));
    $('#profile-logout').toggleClass('is-hidden', !profile);
    $('#profile-attempt-count').text(attempts.length);
    $('#profile-solved-count').text(bestAttempts(attempts).length);
    const average = attempts.length
      ? attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length
      : 0;
    $('#profile-average-score').text(average.toFixed(2));
  }
  $('#profile-logout').on('click', function () {
    try {
      saveProfile(null);
      $(document).trigger('profile:change');
      render();
    } catch (error) {
      pageError(error);
    }
  });
  render();
}
