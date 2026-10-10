'use strict';

import { phrase, write } from './i18n.js';
import { app, api, setState, quotaLabel } from './main.js';
import { element, message, dateTime, confirmation } from './ui.js';

export function subscriptionSection() {
  const section = element('section', 'surface plan-section', '', { id: 'subscription', 'aria-labelledby': 'subscription-title' });
  section.append(element('h2', '', 'Your plan', { id: 'subscription-title' }), element('p', 'plan-intro', 'Both plans include all exercises and saved results. Pro removes the daily check limit.'));
  const usage = element('p', 'plan-usage', '', { role: 'status' });
  const cards = element('div', 'plan-cards'); const checkout = element('div');
  const outcome = element('div', 'alert plan-outcome is-hidden');
  section.append(usage, cards, checkout, outcome);
  let renderedPlan;
  function render() {
    write(usage, quotaLabel()); cards.replaceChildren();
    if (renderedPlan !== app.quota?.plan) { checkout.replaceChildren(); cards.hidden = false; }
    renderedPlan = app.quota?.plan;
    for (const plan of ['free', 'pro']) {
      const current = app.quota?.plan === plan;
      const card = element('article', `plan-card${current ? ' is-current' : ''}`);
      const title = element('div', 'plan-name-row'); title.append(element('h3', '', plan === 'free' ? 'Free' : 'Pro'));
      if (current) title.append(element('span', 'plan-current-label', 'Current plan'));
      card.append(title, element('p', 'plan-price', plan === 'free' ? '10 checks per 24 hours' : 'Unlimited checks'));
      const list = element('ul', 'plan-features');
      (plan === 'free' ? ['All 16 exercises, saved history and progress', 'Resets 24 hours after the first successful check.'] : ['Free test access for 30 days', 'No payment details. No automatic renewal.']).forEach(item => list.append(element('li', '', item)));
      card.append(list);
      if (!current && !app.user) card.append(element('a', plan === 'free' ? 'btn btn-secondary' : 'text-link', plan === 'free' ? 'Create a free account' : 'Log in to try Pro', { href: plan === 'free' ? 'register.html?next=profile.html%23subscription' : 'login.html?next=profile.html%23subscription' }));
      else if (!current && plan === 'pro') {
        const button = element('button', 'btn btn-primary', 'Set up test Pro', { type: 'button' });
        button.disabled = !app.demoBilling;
        if (!app.demoBilling) card.append(element('p', 'small text-warning', 'Test Pro is currently unavailable.'));
        button.addEventListener('click', showCheckout); card.append(button);
      } else if (!current && app.user) {
        const button = element('button', 'btn btn-secondary', 'Return to Free', { type: 'button' }); button.disabled = !app.demoBilling;
        button.addEventListener('click', () => {
          checkout.replaceChildren();
          confirmation(checkout, 'End test Pro now? Your history remains. Free usage continues in the same 24-hour period; ending Pro does not reset the counter.', async () => {
            setState(await api('subscription/demo', 'DELETE', {})); message(outcome, 'Test Pro ended. Your Free plan is active.');
          }, () => button.focus());
        }); card.append(button);
      }
      cards.append(card);
    }
  }
  function showCheckout() {
    message(outcome); checkout.replaceChildren(); cards.hidden = true;
    const form = element('form', 'plan-checkout', '', { 'aria-labelledby': 'checkout-title' });
    form.append(element('h3', '', 'Test Pro subscription', { id: 'checkout-title' }), element('p', 'text-secondary', 'Pro · 30 days · no daily check limit'), element('p', 'checkout-total', 'No payment required'), element('p', 'small text-secondary', 'No payment details. No automatic renewal.'));
    const label = element('label');
    const agree = element('input', 'form-check-input', '', { type: 'checkbox', required: '', id: 'demo-agreement' });
    label.append(agree, element('span', '', 'I agree to activate test Pro for 30 days at no charge.'));
    const error = element('p', 'small text-danger is-hidden', '', { role: 'alert', id: 'demo-agreement-error' });
    agree.setAttribute('aria-describedby', error.id);
    const submit = element('button', 'btn btn-primary', 'Activate test Pro', { type: 'submit' });
    const cancel = element('button', 'btn btn-quiet', 'Cancel', { type: 'button' });
    cancel.addEventListener('click', () => { checkout.replaceChildren(); cards.hidden = false; cards.querySelector('button')?.focus(); });
    form.noValidate = true;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!agree.checked) { write(error, 'Confirm the test subscription before continuing.'); error.classList.remove('is-hidden'); agree.setAttribute('aria-invalid', 'true'); agree.focus(); return; }
      submit.disabled = true; cancel.disabled = true;
      try {
        const state = await api('subscription/demo', 'POST', { confirm: true }); setState(state);
        message(outcome, phrase('Test Pro is active until {date}. Activation ID: {reference}. No payment was taken.', { date: () => dateTime(state.quota.proUntil), reference: state.quota.reference }));
        outcome.tabIndex = -1; outcome.focus();
      } catch (failure) { message(outcome, failure.message, true); submit.disabled = false; cancel.disabled = false; }
    });
    agree.addEventListener('change', () => { error.classList.add('is-hidden'); agree.setAttribute('aria-invalid', 'false'); });
    form.append(label, error, submit, cancel); checkout.append(form); agree.focus();
  }
  document.addEventListener('promptforge:state', render); render(); return section;
}
