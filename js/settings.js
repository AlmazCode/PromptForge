'use strict';

import { app, api, setState } from './main.js';
import { element, hidden, message, showErrors, clearErrors } from './ui.js';
import { write, phrase, getLocale, setLocale, languages } from './i18n.js';
import { passwordChecks, validEmail, interestAreas, experienceLevels } from './logic.js';
import { avatarEditor, renderAvatar } from './avatar.js';
import { icon } from './icons.js';

export function createSettings() {
  const dialog = element('dialog', 'settings-screen', '', { id: 'profile-settings', 'aria-labelledby': 'settings-title' });
  const topbar = element('header', 'settings-topbar');
  const back = element('button', 'btn btn-quiet settings-back', '', { id: 'settings-close', type: 'button' });
  back.append(icon('arrow-left'), element('span', '', 'Back to profile'));
  topbar.append(element('h2', '', 'Settings', { id: 'settings-title' }), back);
  const layout = element('div', 'settings-layout');
  const sidebar = element('aside', 'settings-sidebar');
  const identity = element('div', 'settings-identity');
  const portrait = element('div', 'account-avatar', '', { 'aria-hidden': 'true' });
  const displayName = element('span'); identity.append(portrait, displayName);
  const navigation = element('nav', 'settings-navigation', '', { 'aria-label': 'Settings sections' });
  const content = element('div', 'settings-content');
  const panels = {}; const buttons = {}; const forms = [];
  let saving = 0; let active = 'profile'; let returnHash = ''; let closing = false;
  for (const [key, label] of [['profile', 'Profile'], ['account', 'Account'], ['security', 'Security'], ['appearance', 'Appearance'], ['privacy', 'Privacy']]) {
    const button = element('button', 'settings-nav-button', label, { type: 'button', id: `settings-nav-${key}`, 'aria-controls': `settings-panel-${key}` });
    const panel = element('section', 'settings-panel', '', { id: `settings-panel-${key}`, 'aria-labelledby': `settings-heading-${key}` });
    panel.append(element('h3', 'settings-panel-heading', label, { id: `settings-heading-${key}` }));
    button.addEventListener('click', () => selectPanel(key, true));
    buttons[key] = button; panels[key] = panel; navigation.append(button); content.append(panel);
  }
  sidebar.append(identity, navigation); layout.append(sidebar, content);
  const notice = element('div', 'alert is-hidden settings-notice');
  const guard = element('div', 'settings-leave is-hidden', '', { role: 'alert', id: 'settings-unsaved' });
  guard.append(element('p', '', 'You have unsaved changes. Discard them and close settings?'));
  const keep = element('button', 'btn btn-secondary', 'Keep editing', { type: 'button', id: 'settings-keep-editing' });
  const discard = element('button', 'btn btn-quiet', 'Discard changes', { type: 'button', id: 'settings-discard' });
  const guardActions = element('div', 'settings-actions'); guardActions.append(keep, discard); guard.append(guardActions);
  dialog.append(topbar, layout, notice, guard); document.body.append(dialog);
  const avatar = avatarEditor({ getUser: () => app.user, save: image => api('profile/avatar', 'PUT', image), remove: () => api('profile/avatar', 'DELETE', {}), onSaved: setState });
  panels.profile.append(avatar.node);

  function makeForm(panel, { id, title, intro, fields, button, initial, validate, save, success }) {
    const form = element('form', 'settings-form', '', { id, novalidate: '' });
    if (title) form.append(element('h4', '', title));
    if (intro) form.append(element('p', 'settings-description', intro));
    const inputs = {}; const passwordToggles = [];
    for (const field of fields) {
      const fieldId = field.id || `${id}-${field.name}`;
      const group = element('div', 'form-field');
      const input = element(field.type === 'textarea' ? 'textarea' : field.options ? 'select' : 'input', field.type === 'checkbox' ? 'form-check-input' : field.options ? 'form-select' : 'form-control', '', {
        id: fieldId, name: field.name, 'aria-invalid': 'false', 'aria-describedby': `${fieldId}-error`
      });
      if (!field.options && field.type !== 'textarea') input.type = field.type || 'text';
      if (field.autocomplete) input.autocomplete = field.autocomplete;
      if (field.maxlength) input.maxLength = field.maxlength;
      if (field.type === 'textarea') input.rows = 4;
      if (field.options) for (const [value, label] of field.options) input.append(element('option', '', label, { value }));
      if (field.type === 'checkbox') {
        const label = element('label', 'ranking-choice', '', { for: fieldId }); label.append(input, element('span', '', field.label)); group.append(label);
      } else {
        group.append(element('label', 'form-label', field.label, { for: fieldId }), input);
      }
      if (field.type === 'password') {
        const toggle = element('button', 'btn btn-quiet password-toggle', 'Show password', { type: 'button', 'aria-controls': fieldId, 'aria-pressed': 'false' });
        toggle.addEventListener('click', () => { const shown = input.type === 'password'; input.type = shown ? 'text' : 'password'; toggle.setAttribute('aria-pressed', String(shown)); write(toggle, shown ? 'Hide password' : 'Show password'); });
        group.append(toggle); passwordToggles.push([input, toggle]);
      }
      group.append(element('div', 'invalid-feedback', '', { id: `${fieldId}-error` }));
      if (field.help) group.append(element('p', 'form-text', field.help));
      inputs[field.name] = input; form.append(group);
    }
    const submit = element('button', 'btn btn-primary', button, { type: 'submit' });
    const status = element('div', 'alert is-hidden mt-3', '', { id: `${id}-status` });
    form.append(submit, status); panel.append(form);
    const values = () => Object.fromEntries(Object.entries(inputs).map(([key, input]) => [key, input.type === 'checkbox' ? input.checked : input.value]));
    let baseline = '{}';
    const record = { form, inputs, status, dirty: () => JSON.stringify(values()) !== baseline,
      sync(force = false) {
        if (!force && (record.dirty() || form.contains(document.activeElement))) return;
        const defaults = initial(app.user);
        for (const [key, input] of Object.entries(inputs)) {
          if (input.type === 'checkbox') input.checked = Boolean(defaults[key]); else input.value = defaults[key] ?? '';
        }
        for (const [input, toggle] of passwordToggles) { input.type = 'password'; toggle.setAttribute('aria-pressed', 'false'); write(toggle, 'Show password'); }
        baseline = JSON.stringify(values()); record.afterSync?.();
      }
    };
    record.sync(true); forms.push(record);
    form.addEventListener('input', () => { clearErrors(form); message(status); hidden(guard, true); });
    form.addEventListener('change', () => { clearErrors(form); message(status); hidden(guard, true); });
    form.addEventListener('submit', async event => {
      event.preventDefault(); const data = values();
      if (!showErrors(form, validate(data))) return;
      saving++; back.disabled = true; submit.disabled = true;
      Object.values(inputs).forEach(input => { input.disabled = true; });
      message(status, 'Saving changes…');
      try {
        const state = await save(data); setState(state); record.sync(true); message(status, success); hidden(guard, true);
        if (dialog.open && !panel.hidden) status.scrollIntoView({ block: 'nearest' });
      } catch (error) { if (error.fields) showErrors(form, error.fields, false); message(status, error.message, true); }
      finally {
        saving--; back.disabled = false; submit.disabled = false;
        Object.values(inputs).forEach(input => { input.disabled = false; });
        form.querySelector('[aria-invalid="true"]')?.focus();
      }
    });
    return record;
  }

  makeForm(panels.profile, {
    id: 'profile-edit-form', title: 'Personal details',
    fields: [
      { name: 'name', id: 'edit-profile-name', label: 'Display name', maxlength: 80, autocomplete: 'nickname' },
      { name: 'bio', id: 'edit-profile-bio', label: 'About you', type: 'textarea', maxlength: 1000 },
      { name: 'interest', label: 'Skill area', options: interestAreas.map(value => [value, value.replaceAll('-', ' ')]) },
      { name: 'level', label: 'Experience level', options: experienceLevels.map(value => [value, value[0].toUpperCase() + value.slice(1)]) }
    ],
    button: 'Save profile', initial: user => ({ name: user?.name, bio: user?.bio, interest: user?.interest, level: user?.level }),
    validate: data => {
      const errors = {};
      if (data.name.trim().length < 2 || data.name.trim().length > 80) errors.name = 'Use 2–80 characters.';
      if (data.bio.length > 1000) errors.bio = 'Use at most 1,000 characters.';
      if (!interestAreas.includes(data.interest)) errors.interest = 'Choose a skill area.';
      if (!experienceLevels.includes(data.level)) errors.level = 'Choose your experience level.';
      return errors;
    }, save: data => api('profile', 'PATCH', data), success: 'Your profile changes are saved.'
  });
  makeForm(panels.account, {
    id: 'settings-email-form', title: 'Email address', intro: 'Your email is used to sign in. Confirm the change with your current password.',
    fields: [{ name: 'email', label: 'New email address', type: 'email', autocomplete: 'email', maxlength: 254 }, { name: 'current_password', label: 'Current password', type: 'password', autocomplete: 'current-password', maxlength: 128 }],
    button: 'Change email', initial: user => ({ email: user?.email, current_password: '' }),
    validate: data => {
      const errors = {};
      if (!validEmail(data.email)) errors.email = 'Enter a valid email address.';
      else if (data.email.trim().toLowerCase() === app.user?.email) errors.email = 'Enter a different email address.';
      if (!data.current_password) errors.current_password = 'Enter your current password.';
      return errors;
    }, save: data => api('account/email', 'PATCH', data), success: 'Your email is changed. Use the new address to sign in. Other sessions have ended.'
  });
  const password = makeForm(panels.security, {
    id: 'settings-password-form', title: 'Change password', intro: 'Use a unique password. After a change, other sessions are signed out.',
    fields: [
      { name: 'current_password', label: 'Current password', type: 'password', autocomplete: 'current-password', maxlength: 128 },
      { name: 'new_password', label: 'New password', type: 'password', autocomplete: 'new-password', maxlength: 128 },
      { name: 'password_confirm', label: 'Confirm new password', type: 'password', autocomplete: 'new-password', maxlength: 128 }
    ], button: 'Change password', initial: () => ({ current_password: '', new_password: '', password_confirm: '' }),
    validate: data => {
      const errors = {};
      if (!data.current_password) errors.current_password = 'Enter your current password.';
      if (!Object.values(passwordChecks(data.new_password)).every(Boolean)) errors.new_password = 'Use 8–128 characters, uppercase, lowercase, a digit and a special character.';
      else if (data.new_password === data.current_password) errors.new_password = 'Choose a password different from your current password.';
      if (data.password_confirm !== data.new_password) errors.password_confirm = 'Passwords must match exactly.';
      return errors;
    }, save: data => api('account/password', 'PATCH', data), success: 'Your password is changed. Other sessions have ended.'
  });
  const checklist = element('ul', 'settings-password-checklist list-unstyled', '', { 'aria-label': 'Password requirements' });
  const requirements = {};
  for (const [key, label] of Object.entries({ length: '8–128 characters', upper: 'Uppercase Latin letter', lower: 'Lowercase Latin letter', digit: 'Digit', special: 'Special character' })) {
    const item = element('li', 'password-requirement'); item.append(icon('circle'), element('span', '', label), element('span', 'visually-hidden', 'Requirement not met')); requirements[key] = item; checklist.append(item);
  }
  password.form.querySelector('[aria-controls="settings-password-form-new_password"]').after(checklist);
  function updateChecklist() {
    for (const [key, valid] of Object.entries(passwordChecks(password.inputs.new_password.value))) {
      requirements[key].firstChild.replaceWith(icon(valid ? 'check' : 'circle')); requirements[key].classList.toggle('text-success', valid); write(requirements[key].lastChild, valid ? 'Requirement met' : 'Requirement not met');
    }
  }
  password.form.addEventListener('input', updateChecklist);
  password.afterSync = updateChecklist;
  const sessions = element('section', 'settings-session-section');
  const endSessions = element('button', 'btn btn-secondary', 'Sign out other sessions', { type: 'button', id: 'settings-end-sessions' });
  const sessionStatus = element('div', 'alert is-hidden mt-3');
  sessions.append(element('h4', '', 'Other sessions'), element('p', 'settings-description', 'Keep this session and sign out your account on other browsers and devices.'), endSessions, sessionStatus); panels.security.append(sessions);
  endSessions.addEventListener('click', async () => {
    saving++; back.disabled = true; endSessions.disabled = true;
    try { const result = await api('account/sessions', 'DELETE', {}); message(sessionStatus, result.ended ? phrase('Other sessions signed out: {count}.', { count: result.ended }) : 'There are no other active sessions.'); }
    catch (error) { message(sessionStatus, error.message, true); }
    finally { saving--; back.disabled = false; endSessions.disabled = false; }
  });

  panels.appearance.append(element('p', 'settings-description', 'Choose how PromptForge looks on this device. Changes apply immediately.'));
  const themeGroup = element('fieldset', 'settings-theme-group'); themeGroup.append(element('legend', 'form-label', 'Theme'));
  const themes = {};
  for (const [mode, label, detail] of [['light', 'Light', 'Light surfaces and dark text'], ['dark', 'Dark', 'Dark surfaces and light text'], ['system', 'System', 'Follow your device appearance']]) {
    const option = element('label', `settings-theme-option theme-sample-${mode}`);
    const radio = element('input', 'form-check-input', '', { type: 'radio', name: 'theme', value: mode, id: `settings-theme-${mode}` });
    const sample = element('span', 'theme-sample', '', { 'aria-hidden': 'true' }); sample.append(element('span'), element('span'), element('span'));
    const title = element('span', 'theme-option-title'); title.append(radio, element('span', '', label));
    option.append(sample, title, element('small', '', detail)); themeGroup.append(option); themes[mode] = radio;
    radio.addEventListener('change', () => { if (radio.checked) window.promptforgeTheme.set(mode); });
  }
  panels.appearance.append(themeGroup);
  const localeGroup = element('div', 'form-field settings-language');
  const locale = element('select', 'form-select', '', { id: 'settings-language' });
  for (const language of languages) locale.append(element('option', '', language.name, { value: language.code, lang: language.code }));
  locale.addEventListener('change', () => setLocale(locale.value));
  localeGroup.append(element('label', 'form-label', 'Interface language', { for: 'settings-language' }), locale); panels.appearance.append(localeGroup);

  makeForm(panels.privacy, {
    id: 'settings-privacy-form', title: 'Leaderboard participation', intro: 'Only your display name, level and aggregate scores are public. Your prompts and email stay private.',
    fields: [{ name: 'leaderboardVisible', id: 'profile-ranking-visible', label: 'Show my name and results in the leaderboard', type: 'checkbox' }],
    button: 'Save privacy settings', initial: user => ({ leaderboardVisible: user?.leaderboardVisible }), validate: () => ({}),
    save: data => api('profile', 'PATCH', data), success: 'Your privacy settings are saved.'
  });

  function selectPanel(key, updateUrl = false) {
    if (!panels[key]) key = 'profile'; const changed = active !== key; active = key;
    for (const name of Object.keys(panels)) {
      panels[name].hidden = name !== key;
      if (name === key) buttons[name].setAttribute('aria-current', 'page'); else buttons[name].removeAttribute('aria-current');
    }
    if (changed) content.scrollTop = 0;
    if (updateUrl) history.replaceState(null, '', `#settings/${key}`);
    revealSection();
  }
  function revealSection() { if (dialog.open) buttons[active].scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
  function preferences() { themes[window.promptforgeTheme.get()].checked = true; locale.value = getLocale(); }
  function dirty() { return avatar.isDirty() || forms.some(form => form.dirty()); }
  function reset() { forms.forEach(form => { form.sync(true); clearErrors(form.form); message(form.status); }); avatar.discard(); updateChecklist(); content.scrollTop = 0; hidden(guard, true); message(notice); }
  function close() {
    closing = true; reset(); dialog.close(); document.body.classList.remove('settings-open');
    history.replaceState(null, '', `${location.pathname}${location.search}${returnHash}`);
    document.querySelector('#open-profile-settings')?.focus({ preventScroll: true }); closing = false;
  }
  function requestClose() {
    if (saving || avatar.isBusy()) { message(notice, 'Wait for the current change to finish.'); return; }
    if (dirty()) { hidden(guard, false); keep.focus(); return; } close();
  }
  function route() {
    if (closing) return;
    const match = location.hash.match(/^#settings\/(profile|account|security|appearance|privacy)$/);
    const legacy = location.hash === '#profile-settings';
    if ((match || legacy) && app.user) {
      selectPanel(match?.[1] || 'profile');
      if (!dialog.open) { document.body.classList.add('settings-open'); dialog.showModal(); revealSection(); }
    } else if (dialog.open) {
      if (dirty() || saving || avatar.isBusy()) { history.replaceState(null, '', `#settings/${active}`); requestClose(); }
      else { reset(); dialog.close(); document.body.classList.remove('settings-open'); }
    }
  }
  document.querySelector('#open-profile-settings').addEventListener('click', event => {
    event.preventDefault();
    if (!app.user) return;
    if (!dialog.open) returnHash = location.hash;
    if (location.hash !== '#settings/profile') history.pushState(null, '', '#settings/profile');
    selectPanel('profile');
    if (!dialog.open) { document.body.classList.add('settings-open'); dialog.showModal(); revealSection(); }
  });
  back.addEventListener('click', requestClose);
  dialog.addEventListener('cancel', event => { event.preventDefault(); requestClose(); });
  keep.addEventListener('click', () => { hidden(guard, true); message(notice); buttons[active].focus(); });
  discard.addEventListener('click', () => { if (saving || avatar.isBusy()) requestClose(); else close(); });
  window.addEventListener('hashchange', route);
  window.addEventListener('resize', revealSection);
  document.addEventListener('promptforge:theme', preferences);
  document.addEventListener('promptforge:language', preferences);
  function render() {
    if (!app.user && dialog.open) { reset(); dialog.close(); document.body.classList.remove('settings-open'); }
    write(displayName, app.user?.name || '', true); renderAvatar(portrait, app.user);
    forms.forEach(form => form.sync()); avatar.render(); preferences(); updateChecklist(); route();
  }
  render(); return { render };
}
