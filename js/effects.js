'use strict';

import { $, duration } from './jquery-ui.js';
export function setupFaq() {
  $('#faq details').each(function () {
    const details = $(this);
    details.find('.faq-answer').hide();
    details.children('summary').attr('aria-expanded', 'false');
  });
  $('#faq').on('click', 'summary', function (event) {
    event.preventDefault();
    const summary = $(this);
    const details = summary.closest('details');
    const answer = summary.siblings('.faq-answer').stop(true, true);
    const opening = summary.attr('aria-expanded') !== 'true';
    summary.attr('aria-expanded', String(opening));
    if (opening) details.prop('open', true);
    answer.slideToggle(duration(), function () {
      details.prop('open', opening);
    });
  });
}
