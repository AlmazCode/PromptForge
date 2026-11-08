'use strict';
export const validEmail = (value) =>
  typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) && value.trim().length <= 254;
export const validPhone = (value) =>
  typeof value === 'string' && /^\+?[\d ()-]{7,25}$/.test(value.trim()) && /^\d{7,15}$/.test(value.replace(/\D/g, ''));

export function authDestination(value = '') {
  return /^(?:(?:index|tasks|profile|my-solutions|leaderboard|how-it-works)\.html|task\.html\?id=t\d{3})$/.test(value)
    ? value
    : 'profile.html';
}

export function profileErrors(values = {}, registration = false) {
  const errors = {};
  if (registration && (typeof values.name !== 'string' || values.name.trim().length < 2 || values.name.trim().length > 80))
    errors.name = 'Use 2–80 characters.';
  if (!validEmail(values.email)) errors.email = 'Enter a valid email address.';
  if (typeof values.password !== 'string' || values.password.length < 8 || values.password.length > 128)
    errors.password = 'Use 8–128 characters.';
  if (registration) {
    if (!values.password_confirm || values.password !== values.password_confirm)
      errors.password_confirm = 'Passwords must match.';
    if (values.accept_rules !== 'on' && values.accept_rules !== true) errors.accept_rules = 'Accept the practice rules.';
    if (values.accept_privacy !== 'on' && values.accept_privacy !== true) errors.accept_privacy = 'Accept the browser data notice.';
  }
  return errors;
}

export function feedbackErrors(values) {
  const errors = {};
  if (values.name.trim().length < 2 || values.name.trim().length > 80)
    errors.name = 'Use 2–80 characters.';
  if (!validEmail(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (values.phone && !validPhone(values.phone.trim()))
    errors.phone = 'Enter 7–15 digits, with optional +, spaces, parentheses or hyphens.';
  if (values.message.trim().length < 20 || values.message.length > 2000)
    errors.message = 'Write 20–2,000 characters.';
  return errors;
}
