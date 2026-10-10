'use strict';

import { element, hidden, message, showErrors, clearErrors } from './ui.js';

export function renderAvatar(container, user) {
  if (!container) return;
  const source = user?.avatarUrl || '';
  const initial = user ? Array.from(user.name.trim())[0]?.toUpperCase() || 'P' : '';
  const key = `${source}|${initial}`;
  if (container.dataset.avatar === key) return;
  container.dataset.avatar = key;
  container.setAttribute('data-i18n-ignore', '');
  const fallback = () => {
    if (user) container.textContent = initial;
    else container.replaceChildren(element('img', 'avatar-image avatar-placeholder', '', { src: 'src/brand/promptforge-mark.svg', alt: '' }));
  };
  if (!source) { fallback(); return; }
  const image = element('img', 'avatar-image', '', { src: source, alt: '', decoding: 'async' });
  image.addEventListener('error', () => { if (container.contains(image)) fallback(); }, { once: true });
  container.replaceChildren(image);
}

export async function prepareAvatar(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose a JPG, PNG or WebP image.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Choose an image smaller than 5 MB.');
  let bitmap;
  try { bitmap = await createImageBitmap(file); }
  catch { throw new Error('This image could not be opened. Choose another file.'); }
  try {
    if (bitmap.width * bitmap.height > 40_000_000) throw new Error('Choose an image no larger than 40 megapixels.');
    const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 256;
    const context = canvas.getContext('2d');
    context.fillStyle = '#1d1f22'; context.fillRect(0, 0, 256, 256);
    const edge = Math.min(bitmap.width, bitmap.height);
    context.drawImage(bitmap, (bitmap.width - edge) / 2, (bitmap.height - edge) / 2, edge, edge, 0, 0, 256, 256);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', .88));
    if (!blob || blob.size > 100 * 1024) throw new Error('The avatar is too large. Choose another image.');
    const preview = await new Promise((resolve, reject) => {
      const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(blob);
    });
    return { blob, preview };
  } finally { bitmap.close(); }
}

export function avatarEditor({ getUser, save, remove, onSaved }) {
  const node = element('form', 'avatar-editor', '', { id: 'avatar-form', novalidate: '' });
  node.append(element('h3', '', 'Profile photo'));
  const row = element('div', 'avatar-editor-row');
  const preview = element('div', 'avatar-preview profile-avatar', '', { id: 'avatar-preview', 'aria-hidden': 'true' });
  const fields = element('div', 'avatar-editor-fields');
  const label = element('label', 'form-label', 'Choose an image', { for: 'avatar-file' });
  const input = element('input', 'form-control', '', { type: 'file', accept: 'image/jpeg,image/png,image/webp', id: 'avatar-file', name: 'avatar', 'aria-describedby': 'avatar-help avatar-file-error', 'aria-invalid': 'false' });
  fields.append(label, input, element('div', 'invalid-feedback', '', { id: 'avatar-file-error' }),
    element('p', 'form-text', 'JPG, PNG or WebP, up to 5 MB. The centre is cropped to a square. The saved photo contains no original file metadata.', { id: 'avatar-help' }));
  row.append(preview, fields); node.append(row);
  const actions = element('div', 'avatar-actions');
  const submit = element('button', 'btn btn-secondary', 'Save avatar', { type: 'submit', id: 'avatar-save' });
  const cancel = element('button', 'btn btn-quiet', 'Cancel', { type: 'button', id: 'avatar-cancel' });
  const deletion = element('button', 'btn btn-quiet', 'Remove avatar', { type: 'button', id: 'avatar-remove' });
  const status = element('div', 'alert is-hidden mt-3', '', { id: 'avatar-status' });
  actions.append(submit, cancel, deletion); node.append(actions, status);
  let pending = null; let busy = false; let processing = false; let selection = 0;
  function render() {
    if (!pending && !processing) renderAvatar(preview, getUser());
    submit.disabled = busy || processing || !pending;
    cancel.disabled = busy; hidden(cancel, !pending && !processing);
    deletion.disabled = busy || processing; hidden(deletion, !getUser()?.avatarUrl);
    input.disabled = busy;
  }
  input.addEventListener('change', async () => {
    const file = input.files[0]; if (!file) return;
    const selected = ++selection;
    pending = null; processing = true; clearErrors(node); message(status, 'Preparing avatar…'); render();
    try {
      const prepared = await prepareAvatar(file);
      if (selected !== selection) return;
      pending = prepared.blob;
      renderAvatar(preview, { ...getUser(), avatarUrl: prepared.preview });
      message(status, 'Preview ready. Save the avatar to use it on your account.');
    } catch (error) {
      if (selected !== selection) return;
      showErrors(node, { avatar: error.message }); message(status);
    } finally { if (selected === selection) { processing = false; render(); } }
  });
  cancel.addEventListener('click', () => {
    selection++; pending = null; processing = false; input.value = ''; clearErrors(node); message(status); render();
  });
  node.addEventListener('submit', async event => {
    event.preventDefault(); if (!pending || busy || processing) return;
    busy = true; render(); message(status, 'Saving avatar…');
    try {
      const state = await save(pending); pending = null; input.value = ''; onSaved(state); message(status, 'Your avatar is saved.');
    } catch (error) { message(status, error.message, true); }
    finally { busy = false; render(); }
  });
  deletion.addEventListener('click', async () => {
    if (busy || processing) return;
    busy = true; render(); message(status);
    try {
      const state = await remove(); pending = null; input.value = ''; clearErrors(node); onSaved(state); message(status, 'Your avatar is removed.');
    } catch (error) { message(status, error.message, true); }
    finally { busy = false; render(); }
  });
  render(); return { node, render, isDirty: () => Boolean(pending || processing), isBusy: () => busy,
    discard: () => { if (!busy) { selection++; pending = null; processing = false; input.value = ''; clearErrors(node); message(status); render(); } }
  };
}
