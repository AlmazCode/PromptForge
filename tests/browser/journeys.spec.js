'use strict';

import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

async function go(page, path) {
  await page.goto(path);
  await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
}

async function register(page) {
  await go(page, '/register.html');
  await page.locator('#register-name').fill('Practice Student');
  await page.locator('#register-email').fill(`browser-${crypto.randomUUID()}@example.com`);
  await page.locator('#register-interest').selectOption('data-analysis');
  await page.locator('#register-password').fill('Practice!123');
  await page.locator('#register-password-confirm').fill('Practice!123');
  await page.locator('#register-level-beginner').check();
  await page.locator('#register-accept-rules').check(); await page.locator('#register-accept-privacy').check();
  await page.locator('#register-submit').click();
  await expect(page.locator('#register-success')).toContainText('Account created');
}

test('catalog controls combine, report empty results and reset; all pages load without script errors', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await go(page, '/tasks.html');
  await expect(page.locator('#task-grid article')).toHaveCount(16);
  await page.locator('#task-search').fill('linkedin');
  await expect(page.locator('#task-grid article')).toHaveCount(1);
  await page.locator('#catalog-difficulty').selectOption('advanced');
  await expect(page.locator('#catalog-empty')).toBeVisible();
  await page.locator('#catalog-empty-reset').click();
  await expect(page.locator('#task-grid article')).toHaveCount(16);
  for (const path of ['/', '/task.html?id=t006', '/register.html', '/login.html', '/profile.html', '/progress.html', '/leaderboard.html', '/my-solutions.html', '/how-it-works.html']) {
    await go(page, path); await expect(page.locator('#app-status')).toBeHidden();
  }
  await go(page, '/task.html?id=missing'); await expect(page.getByRole('heading', { name: 'Exercise not found' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('registration validates fields and passwords; AI results, history and subscription complete a full journey', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await go(page, '/register.html'); await page.locator('#register-submit').click();
  await expect(page.locator('#register-name')).toBeFocused(); await expect(page.locator('#register-name-error')).toContainText('name');
  await page.locator('#register-password').fill('Practice!123');
  await page.getByRole('button', { name: 'Show password', exact: true }).first().click();
  await expect(page.locator('#register-password')).toHaveAttribute('type', 'text');
  await page.locator('#register-password-confirm').fill('Different!123');
  await expect(page.locator('#register-password-confirm-error')).toContainText('match exactly');
  await register(page);
  await expect(page.locator('#register-password')).toHaveValue('');
  await go(page, '/task.html?id=t006');
  await expect(page.locator('#nav-register')).toHaveClass(/is-hidden/);
  await expect(page.locator('#task-plan-link')).toBeHidden();
  await expect(page.locator('#task-input-data')).toContainText('adults working from home');
  await page.locator('#submit-btn').click(); await expect(page.locator('#prompt-input')).toBeFocused();
  await page.locator('#prompt-input').fill('You are a product strategist. Give ten fitness ideas under 60 words each. Example: movement breaks. Be practical.');
  await page.locator('#submit-btn').click(); await expect(page.locator('#final-score')).toHaveText('8.00');
  await expect(page.locator('#task-quota')).toContainText('9 of 10');
  await expect(page.locator('#task-plan-link')).toBeHidden();
  await mkdir('screenshots/js', { recursive: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'screenshots/js/task-test-result-desktop.png', fullPage: true });
  await page.reload(); await expect(page.locator('#task-attempt-count')).toHaveText('1');
  await expect(page.locator('#prompt-input')).toHaveValue(/product strategist/);
  await go(page, '/profile.html#subscription');
  await expect(page.locator('#profile-total-points')).toHaveText('8.00');
  await page.getByRole('button', { name: 'Set up test Pro' }).click();
  await page.getByRole('button', { name: 'Activate test Pro' }).click();
  await expect(page.locator('#demo-agreement')).toBeFocused();
  await page.locator('#demo-agreement').check(); await page.getByRole('button', { name: 'Activate test Pro' }).click();
  await expect(page.locator('#subscription')).toContainText('Test Pro is active');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'screenshots/js/profile-test-pro-desktop.png', fullPage: true });
  await page.reload(); await expect(page.locator('#subscription')).toContainText('Pro · unlimited');
  await go(page, '/progress.html'); await expect(page.locator('#leaderboard-body')).toContainText('Fitness app ideas');
  await go(page, '/my-solutions.html'); await page.getByRole('button', { name: 'Delete attempt for Fitness app ideas' }).click();
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.locator('#solutions-attempt-count')).toHaveText('Attempts: 0');
  await go(page, '/profile.html'); await expect(page.locator('#profile-total-points')).toHaveText('0.00');
  await page.getByRole('button', { name: 'Return to Free' }).click(); await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.locator('#subscription')).toContainText('9 of 10');
  expect(errors).toEqual([]);
});

test('limit blocks check eleven; Pro unblocks it; an AI failure preserves the draft and allowance', async ({ page }) => {
  await register(page); await go(page, '/task.html?id=t001');
  await expect(page.locator('#task-plan-link')).toBeHidden();
  await page.locator('#prompt-input').fill('You are a marketer. Write a concise LinkedIn post.');
  await page.route('**/api/evaluate', async route => { await route.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ message: 'AI unavailable; your check was not charged.' }) }); }, { times: 1 });
  await page.locator('#submit-btn').click(); await expect(page.locator('#prompt-error')).toContainText('not charged');
  await expect(page.locator('#task-quota')).toContainText('10 of 10'); await expect(page.locator('#prompt-input')).toHaveValue('You are a marketer. Write a concise LinkedIn post.');
  for (let i = 0; i < 10; i += 1) {
    await page.locator('#submit-btn').click(); await expect(page.locator('#task-attempt-count')).toHaveText(String(i + 1));
  }
  await expect(page.locator('#submit-btn')).toBeDisabled(); await expect(page.locator('#task-quota')).toContainText('0 of 10');
  await expect(page.locator('#task-plan-link')).toBeVisible();
  await expect(page.locator('#task-plan-link')).toHaveText('Your plan');
  await page.locator('#task-plan-link').click(); await expect(page).toHaveURL(/profile.html#subscription$/);
  await page.getByRole('button', { name: 'Set up test Pro' }).click();
  await page.locator('#demo-agreement').check(); await page.getByRole('button', { name: 'Activate test Pro' }).click();
  await expect(page.locator('#subscription')).toContainText('Test Pro is active');
  await go(page, '/task.html?id=t001');
  await expect(page.locator('#task-plan-link')).toBeHidden();
  await expect(page.locator('#nav-register')).toHaveClass(/is-hidden/);
  await page.locator('#submit-btn').click(); await expect(page.locator('#task-attempt-count')).toHaveText('11');
});

test('feedback is validated and saved, user text is inert, generated UI fits mobile and tablet', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await register(page); await go(page, '/how-it-works.html#feedback');
  await page.locator('#feedback-submit').click(); await expect(page.locator('#fb-name')).toBeFocused();
  await page.locator('#fb-name').fill('Student'); await page.locator('#fb-email').fill('student@example.com'); await page.locator('#fb-topic').selectOption('bug');
  await page.locator('#fb-message').fill('<img src=x onerror=alert(1)> The task button did not work after I selected a filter.');
  await page.locator('#feedback-submit').click(); await expect(page.locator('#feedback-success')).toContainText('No email was sent');
  await expect(page.locator('#feedback-summary img')).toHaveCount(0);
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/tasks.html', '/task.html?id=t002', '/profile.html#subscription', '/my-solutions.html', '/progress.html', '/leaderboard.html', '/register.html', '/login.html', '/how-it-works.html', '/']) {
      await go(page, path); await expect(page.locator('#app-status')).toBeHidden();
      await expect(page.locator('#nav-register')).toHaveClass(/is-hidden/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${path} overflows at ${width}px`).toBeTruthy();
      if (width === 375 && path === '/profile.html#subscription') await page.screenshot({ path: 'screenshots/js/profile-phone.png', fullPage: true });
    }
  }
  expect(errors).toEqual([]);
});
