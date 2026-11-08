'use strict';

export const $ = window.jQuery;
export const duration = (ms = 160) =>
  matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : ms;
export function element(tag, classes = '', text = '', attributes = {}) {
  return $(`<${tag}>`).attr(attributes).addClass(classes).text(text);
}

export function showMessage(target, text, error = false) {
  const node = $(target)
    .stop(true, true)
    .removeClass('is-hidden')
    .toggleClass('alert-danger', error)
    .toggleClass('alert-success', !error)
    .text(text)
    .hide();
  node.fadeIn(duration(), function () {
    $(this).removeAttr('style');
  });
  return node;
}

export function hideMessage(target) {
  const node = $(target).stop(true, true);
  if (node.hasClass('is-hidden')) return;
  node.fadeOut(duration(), function () {
    $(this).addClass('is-hidden').text('').removeAttr('style');
  });
}

export function pageError(error) {
  showMessage('#app-status', error.message, true);
}
