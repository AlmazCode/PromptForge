'use strict';

import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const account = () => ({ email: `settings-${crypto.randomUUID()}@example.com`, full_name: 'Settings Student', password: 'Practice!123', password_confirm: 'Practice!123', interest_area: 'copywriting', level: 'beginner', accept_rules: true, accept_privacy: true });
async function go(page, path) { await page.goto(path); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true'); await expect(page.locator('#app-status')).toBeHidden(); }

test('settings open over the profile, preserve drafts, validate account changes and revoke other sessions', async ({ page, browser }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  const user = account(); expect((await page.request.post('/api/register', { data: user })).ok()).toBeTruthy();
  const sibling = await browser.newContext({ baseURL: 'http://127.0.0.1:3101' });
  try {
    expect((await sibling.request.post('/api/login', { data: { email: user.email, password: user.password } })).ok()).toBeTruthy();
    await go(page, '/profile.html');
    await page.locator('#open-profile-settings').click(); await expect(page.locator('#profile-settings')).toBeVisible();
    await expect(page.locator('#settings-close')).toBeFocused();
    await page.locator('#edit-profile-name').fill('Updated learner');
    await page.locator('#settings-nav-account').click(); await page.locator('#settings-nav-profile').click();
    await expect(page.locator('#edit-profile-name')).toHaveValue('Updated learner');
    await page.keyboard.press('Escape'); await expect(page.locator('#settings-unsaved')).toBeVisible();
    await page.locator('#settings-keep-editing').click(); await expect(page.locator('#profile-settings')).toBeVisible();
    await page.locator('#profile-edit-form-interest').selectOption('translation');
    await page.locator('#profile-edit-form-level').selectOption('advanced');
    await page.locator('#profile-edit-form button[type="submit"]').click();
    await expect(page.locator('#profile-edit-form-status')).toHaveText('Your profile changes are saved.');
    await expect(page.locator('#profile-edit-form-status')).toBeInViewport();
    await page.locator('#settings-close').click(); await expect(page.locator('#profile-settings')).not.toBeVisible();
    await expect(page.locator('#open-profile-settings')).toBeFocused(); await expect(page.locator('#profile-name')).toHaveText('Updated learner');
    await page.locator('#open-profile-settings').click(); await page.locator('#settings-nav-account').click();
    const email = page.locator('#settings-email-form-email'); const current = page.locator('#settings-email-form-current_password');
    const nextEmail = `changed-${crypto.randomUUID()}@example.com`;
    await email.fill('bad'); await current.fill(user.password); await page.locator('#settings-email-form button[type="submit"]').click();
    await expect(email).toBeFocused(); await expect(page.locator('#settings-email-form-email-error')).toContainText('valid email');
    await email.fill(nextEmail); await current.fill('Wrong!123'); await page.locator('#settings-email-form button[type="submit"]').click();
    await expect(page.locator('#settings-email-form-current_password-error')).toHaveText('Your current password is incorrect.');
    await current.fill(user.password); await page.locator('#settings-email-form button[type="submit"]').click();
    await expect(page.locator('#settings-email-form-status')).toContainText('Your email is changed.');
    await expect(current).toHaveValue(''); expect((await (await sibling.request.get('/api/state')).json()).user).toBeNull();
    expect((await page.request.post('/api/login', { data: { email: user.email, password: user.password } })).status()).toBe(401);
    await page.locator('#settings-nav-security').click();
    const toggle = page.locator('[aria-controls="settings-password-form-current_password"]');
    await toggle.click(); await expect(page.locator('#settings-password-form-current_password')).toHaveAttribute('type', 'text');
    await toggle.click(); await expect(page.locator('#settings-password-form-current_password')).toHaveAttribute('type', 'password');
    await page.locator('#settings-password-form-current_password').fill(user.password);
    await page.locator('#settings-password-form-new_password').fill('NewPractice!456');
    await page.locator('#settings-password-form-password_confirm').fill('Mismatch!456');
    await page.locator('#settings-password-form button[type="submit"]').click();
    await expect(page.locator('#settings-password-form-password_confirm-error')).toHaveText('Passwords must match exactly.');
    await expect(page.locator('.settings-password-checklist img[src$="check.svg"]')).toHaveCount(5);
    await page.locator('#settings-password-form-password_confirm').fill('NewPractice!456');
    await page.locator('#settings-password-form button[type="submit"]').click();
    await expect(page.locator('#settings-password-form-status')).toContainText('Your password is changed.');
    await expect(page.locator('#settings-password-form-status')).toBeInViewport();
    await expect(page.locator('#settings-password-form-new_password')).toHaveValue('');
    await expect(page.locator('.settings-password-checklist img[src$="check.svg"]')).toHaveCount(0);
    expect((await sibling.request.post('/api/login', { data: { email: nextEmail, password: user.password } })).status()).toBe(401);
    expect((await sibling.request.post('/api/login', { data: { email: nextEmail, password: 'NewPractice!456' } })).ok()).toBeTruthy();
    await page.locator('#settings-end-sessions').click();
    await expect(page.locator('#settings-panel-security')).toContainText('Other sessions signed out: 1.');
    expect((await (await sibling.request.get('/api/state')).json()).user).toBeNull();
    await page.locator('#settings-nav-profile').click(); await page.locator('#edit-profile-bio').fill('Unsaved biography');
    await page.locator('#settings-close').click(); await page.locator('#settings-discard').click();
    await page.locator('#open-profile-settings').click(); await expect(page.locator('#edit-profile-bio')).toHaveValue('');
    await page.keyboard.press('Escape'); await expect(page.locator('#profile-settings')).not.toBeVisible();
    await page.locator('#open-profile-settings').click(); await page.goBack(); await expect(page.locator('#profile-settings')).not.toBeVisible();
    expect(errors).toEqual([]);
  } finally { await sibling.close(); }
});

test('light, dark and live system themes persist across pages and settings work in all languages and sizes', async ({ page, browser }) => {
  test.setTimeout(120000);
  const user = account(); expect((await page.request.post('/api/register', { data: user })).ok()).toBeTruthy();
  await page.emulateMedia({ colorScheme: 'dark' }); await go(page, '/profile.html#settings/appearance');
  await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
  await page.locator('#settings-theme-light').check(); await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'light');
  await page.locator('#settings-close').click(); await go(page, '/tasks.html');
  await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'light');
  await page.reload(); await expect(page.locator('html')).toHaveAttribute('data-theme-preference', 'light');
  const sibling = await page.context().newPage();
  try {
    await go(sibling, '/'); await go(page, '/profile.html#settings/appearance');
    await page.locator('#settings-theme-dark').check(); await expect(sibling.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
    await page.locator('#settings-theme-system').check(); await page.emulateMedia({ colorScheme: 'light' });
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'light');
    await page.emulateMedia({ colorScheme: 'dark' }); await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
    await mkdir('screenshots/settings', { recursive: true });
    for (const theme of ['dark', 'light']) {
      await page.locator('#settings-nav-appearance').click(); await page.locator(`#settings-theme-${theme}`).check();
      for (const locale of ['en', 'ru', 'kk']) {
        await page.locator('#settings-nav-appearance').click(); await page.locator('#settings-language').selectOption(locale);
        for (const section of ['profile', 'account', 'security', 'appearance', 'privacy']) {
          await page.locator(`#settings-nav-${section}`).click();
          for (const width of [320, 375, 768, 1440]) {
            await page.setViewportSize({ width, height: width < 768 ? 640 : 900 });
            expect(await page.locator('.settings-content').evaluate(node => node.scrollWidth <= node.clientWidth), `${theme}/${locale}/${section}/${width}`).toBeTruthy();
            await expect(page.locator('#settings-close'), `${theme}/${locale}/${section}/${width}`).toBeInViewport();
          }
          if (locale === 'ru') {
            await page.screenshot({ path: `screenshots/settings/${section}-${theme}-desktop.png` });
            await page.setViewportSize({ width: 375, height: 812 }); await page.screenshot({ path: `screenshots/settings/${section}-${theme}-phone.png` });
          }
        }
      }
    }
    await page.locator('#settings-close').click();
    const paths = ['/', '/tasks.html', '/task.html?id=t002', '/login.html', '/register.html', '/profile.html', '/my-solutions.html', '/progress.html', '/leaderboard.html', '/how-it-works.html'];
    for (const theme of ['light', 'dark']) {
      await page.evaluate(mode => window.promptforgeTheme.set(mode), theme);
      for (const path of paths) {
        await go(page, path); await expect(page.locator('html')).toHaveAttribute('data-bs-theme', theme);
        const color = await page.locator('body').evaluate(node => getComputedStyle(node).backgroundColor);
        expect(color).toBe(theme === 'light' ? 'rgb(247, 248, 250)' : 'rgb(20, 20, 22)');
      }
    }
    await go(page, '/profile.html#settings/appearance'); await page.setViewportSize({ width: 375, height: 480 });
    await page.locator('#settings-theme-system').check(); await expect(page.locator('#settings-close')).toBeInViewport();
    await page.keyboard.press('Escape'); await expect(page.locator('#profile-settings')).not.toBeVisible();
  } finally { await sibling.close(); }
});
