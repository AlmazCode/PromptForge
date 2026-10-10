'use strict';

import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

async function go(page, path) {
  await page.goto(path); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('#app-status')).toBeHidden();
}

test('avatar selection, preview, validation, retry, persistence and removal work without losing profile edits', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  const signup = { email: `avatar-${crypto.randomUUID()}@example.com`, full_name: 'Avatar Student', password: 'Practice!123', password_confirm: 'Practice!123', interest_area: 'copywriting', level: 'beginner', accept_rules: true, accept_privacy: true };
  expect((await page.request.post('/api/register', { data: signup })).ok()).toBeTruthy();
  await go(page, '/profile.html#profile-settings');
  await expect(page.locator('#account-initial')).toHaveText('A');
  const input = page.locator('#avatar-file');
  await page.locator('#edit-profile-name').fill('Unsaved profile name');
  await input.setInputFiles({ name: 'script.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg onload="alert(1)"/>') });
  await expect(page.locator('#avatar-file-error')).toHaveText('Choose a JPG, PNG or WebP image.');
  await expect(input).toBeFocused(); await expect(page.locator('#avatar-save')).toBeDisabled();
  await input.setInputFiles({ name: 'large.jpg', mimeType: 'image/jpeg', buffer: Buffer.alloc(5 * 1024 * 1024 + 1) });
  await expect(page.locator('#avatar-file-error')).toHaveText('Choose an image smaller than 5 MB.');
  await input.setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('not an image') });
  await expect(page.locator('#avatar-file-error')).toHaveText('This image could not be opened. Choose another file.');
  const source = await page.evaluate(() => {
    const canvas = document.createElement('canvas'); canvas.width = 600; canvas.height = 300;
    const context = canvas.getContext('2d');
    context.fillStyle = '#ff6410'; context.fillRect(0, 0, 600, 300);
    context.fillStyle = '#20252c'; context.fillRect(220, 40, 160, 220);
    return canvas.toDataURL('image/png').split(',')[1];
  });
  const photo = { name: 'my-avatar.png', mimeType: 'image/png', buffer: Buffer.from(source, 'base64') };
  await input.setInputFiles(photo); await expect(page.locator('#avatar-save')).toBeEnabled();
  await expect(page.locator('#avatar-preview img')).toHaveAttribute('src', /^data:image\/jpeg/);
  await expect(page.locator('#account-initial img')).toHaveCount(0);
  await page.locator('#avatar-cancel').click(); await expect(page.locator('#avatar-save')).toBeDisabled();
  await input.setInputFiles(photo); await expect(page.locator('#avatar-save')).toBeEnabled();
  await page.route('**/api/profile/avatar', route => route.request().method() === 'PUT' ? route.fulfill({ status: 503, json: { message: 'The service is unavailable. Try again later.' } }) : route.continue(), { times: 1 });
  await page.locator('#avatar-save').click(); await expect(page.locator('#avatar-status')).toHaveClass(/alert-danger/);
  await expect(page.locator('#avatar-save')).toBeEnabled();
  await page.locator('#avatar-save').click(); await expect(page.locator('#avatar-status')).toHaveText('Your avatar is saved.');
  await expect(page.locator('#edit-profile-name')).toHaveValue('Unsaved profile name');
  await expect(page.locator('#account-initial img')).toBeVisible();
  await expect(page.locator('.profile-hero .profile-avatar img')).toBeVisible();
  expect(await page.locator('#avatar-preview img').evaluate(image => image.naturalWidth)).toBe(256);
  const avatarUrl = (await (await page.request.get('/api/state')).json()).user.avatarUrl;
  await go(page, '/tasks.html'); await expect(page.locator('#account-initial img')).toHaveAttribute('src', avatarUrl);
  await page.route('**/api/profile/avatar?v=*', route => route.fulfill({ status: 503, body: '' }), { times: 1 });
  await page.reload(); await expect(page.locator('#account-initial')).toHaveText('A');
  await page.reload(); await expect(page.locator('#account-initial img')).toBeVisible();
  await go(page, '/profile.html#profile-settings');
  await mkdir('screenshots/avatars', { recursive: true });
  for (const locale of ['en', 'ru', 'kk']) {
    await page.locator('#settings-nav-appearance').click();
    await page.locator('#settings-language').selectOption(locale);
    await page.locator('#settings-nav-profile').click();
    for (const width of [320, 375, 768, 1200, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${locale} avatar at ${width}`).toBeTruthy();
    }
    await expect(page.locator('#avatar-remove')).toHaveText({ en: 'Remove avatar', ru: 'Удалить аватар', kk: 'Аватарды жою' }[locale]);
  }
  await page.locator('#settings-nav-appearance').click(); await page.locator('#settings-language').selectOption('ru');
  await page.locator('#settings-nav-profile').click(); await page.setViewportSize({ width: 375, height: 900 });
  await page.screenshot({ path: 'screenshots/avatars/profile-phone.png', fullPage: true });
  await page.locator('#avatar-remove').click(); await expect(page.locator('#avatar-remove')).toBeHidden();
  await expect(page.locator('.profile-hero .profile-avatar')).toHaveText('A');
  await go(page, '/tasks.html'); await expect(page.locator('#account-initial')).toHaveText('A');
  expect((await (await page.request.get('/api/state')).json()).quota.used).toBe(0);
  expect(errors).toEqual([]);
});
