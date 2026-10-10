'use strict';

import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

async function go(page, path) {
  await page.goto(path); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
}
async function register(page) {
  await go(page, '/register.html');
  await page.locator('#register-name').fill('Workshop Student');
  await page.locator('#register-email').fill(`training-${crypto.randomUUID()}@example.com`);
  await page.locator('#register-interest').selectOption('data-analysis');
  await page.locator('#register-password').fill('Practice!123');
  await page.locator('#register-password-confirm').fill('Practice!123');
  await page.locator('#register-accept-rules').check(); await page.locator('#register-accept-privacy').check();
  await page.locator('#register-submit').click(); await expect(page.locator('#register-success')).toBeVisible();
}
async function check(page, prompt, score) {
  await page.locator('#prompt-input').fill(prompt); await page.locator('#submit-btn').click();
  await expect(page.locator('#final-score')).toHaveText(score);
}
async function captureComparison(page, path) {
  // A component capture excludes the sticky page header, which can cover its heading.
  const header = page.locator('#site-header');
  await header.evaluate(node => { node.hidden = true; });
  try { await page.locator('#attempt-comparison').screenshot({ path }); }
  finally { await header.evaluate(node => { node.hidden = false; }); }
}

test('routes keep their order, combine with filters, survive language/reload and show guest drafts', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await go(page, '/tasks.html?route=data');
  await expect(page.locator('#task-grid article')).toHaveCount(6);
  await expect(page.locator('#task-grid article').first()).toHaveAttribute('data-task-id', 't012');
  await expect(page.locator('#catalog-routes [data-route="data"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#task-search').fill('sales'); await expect(page.locator('#task-grid article')).toHaveCount(2);
  await page.locator('#catalog-difficulty').selectOption('advanced'); await expect(page.locator('#catalog-empty')).toBeVisible();
  await page.locator('#catalog-empty-reset').click(); await expect(page.locator('#task-grid article')).toHaveCount(16);
  await expect(page).not.toHaveURL(/route=/);
  await page.locator('#catalog-routes [data-route="systems"]').click();
  await expect(page.locator('#catalog-routes [data-route="systems"]')).toBeFocused();
  await expect(page.locator('#task-grid article')).toHaveCount(6);
  await page.locator('[data-language="ru"]').click(); await page.reload();
  await expect(page.locator('#route-context')).toContainText('Системы и процессы');
  await expect(page.locator('#task-grid article').first()).toHaveAttribute('data-task-id', 't004');
  await page.locator('#catalog-all-routes').click(); await expect(page.locator('#task-grid article')).toHaveCount(16);
  await go(page, '/task.html?id=t005');
  await page.locator('#prompt-input').fill('Қазақша нобай\n<test>');
  await page.locator('#prompt-input').blur();
  await go(page, '/tasks.html?route=instructions');
  await expect(page.locator('[data-task-id="t005"] .practice-status')).toHaveText('Есть черновик');
  await page.locator('[data-language="kk"]').click();
  await expect(page.locator('[data-task-id="t005"] .practice-status')).toHaveText('Нобай бар');
  await page.locator('[data-task-id="t005"] .exercise-start').click();
  await expect(page.locator('#prompt-input')).toHaveValue('Қазақша нобай\n<test>');
  expect(errors).toEqual([]);
});

test('mastery, revision comparisons and recommendations persist and recalculate after best-attempt deletion', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  let evaluations = 0; page.on('request', request => { if (request.url().endsWith('/api/evaluate')) evaluations++; });
  await page.setViewportSize({ width: 1440, height: 900 }); await register(page);
  await go(page, '/task.html?id=t001');
  const first = 'TRAINING_FIXTURE_LOW\nВы — редактор. Write a short post.\n<img src=x onerror="window.__promptExecuted=1">';
  const second = 'TRAINING_FIXTURE_HIGH\nВы — редактор. Write a detailed post for remote teams, under 120 words.\n<img src=x onerror="window.__promptExecuted=1">';
  const third = 'TRAINING_FIXTURE_LOWER\nWrite a post.';
  await check(page, first, '4.80');
  await expect(page.locator('#task-route .practice-status')).toHaveText('Needs revision');
  await expect(page.locator('#attempt-comparison')).toBeHidden();
  await expect(page.getByText('Check a revised prompt to compare text and scores.', { exact: true })).toBeVisible();
  await check(page, second, '8.15');
  await expect(page.locator('#task-route .practice-status')).toHaveText('Mastered');
  await expect(page.locator('#comparison-total')).toHaveText('Total change: +3.35');
  await expect(page.locator('[data-delta="length"]')).toHaveText('-2.00');
  await expect(page.locator('[data-delta="role"]')).toHaveText('+5.00');
  await expect(page.locator('#attempt-comparison del')).not.toHaveCount(0);
  await expect(page.locator('#attempt-comparison ins')).not.toHaveCount(0);
  await expect(page.locator('.prompt-diff-text').first()).toHaveText(first);
  await expect(page.locator('.prompt-diff-text').last()).toHaveText(second);
  expect(await page.evaluate(() => window.__promptExecuted)).toBeUndefined();
  await expect(page.locator('#attempt-comparison img')).toHaveCount(0);
  const beforeId = await page.locator('#comparison-before').inputValue(); const bestId = await page.locator('#comparison-after').inputValue();
  await mkdir('screenshots/training', { recursive: true });
  await captureComparison(page, 'screenshots/training/comparison-desktop.png');
  await check(page, third, '6.00');
  await expect(page.locator('#task-route .practice-status')).toHaveText('Mastered');
  await expect(page.locator('#comparison-total')).toHaveText('Total change: -2.15');
  await page.locator('#comparison-before').selectOption(beforeId);
  await expect(page.locator('#comparison-total')).toHaveText('Total change: +1.20');
  await page.locator('#comparison-after').selectOption(bestId);
  await expect(page.locator('#comparison-total')).toHaveText('Total change: +3.35');
  for (const locale of ['ru', 'kk', 'en']) {
    await page.locator(`[data-language="${locale}"]`).click();
    await expect(page.locator('#comparison-before')).toHaveValue(beforeId);
    await expect(page.locator('#comparison-after')).toHaveValue(bestId);
    await expect(page.locator('.prompt-diff-text').last()).toHaveText(second);
    await expect(page.locator('#prompt-input')).toHaveValue(third);
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${locale} comparison at ${width}`).toBeTruthy();
    }
  }
  expect(evaluations).toBe(3); await expect(page.locator('#task-quota')).toContainText('7 of 10');
  await page.setViewportSize({ width: 390, height: 844 });
  await captureComparison(page, 'screenshots/training/comparison-phone.png');
  await page.reload(); await expect(page.locator('#comparison-total')).toHaveText('Total change: -2.15');
  await go(page, '/'); await expect(page.locator('#home-next-session')).toBeVisible();
  await expect(page.locator('main h1')).toHaveCount(1); await expect(page.locator('main h1')).toBeVisible();
  await expect(page.locator('#home-session-links .btn-primary')).toHaveAttribute('href', 'task.html?id=t005');
  await page.screenshot({ path: 'screenshots/training/workshop-phone.png', fullPage: true });
  await go(page, '/progress.html'); await expect(page.locator('#progress-mastery-summary')).toHaveText('1 mastered · 1 checked');
  await go(page, '/profile.html'); await expect(page.locator('#profile-solved-count')).toHaveText('1');
  await go(page, '/my-solutions.html');
  const bestRow = page.locator('#solutions-body tr').filter({ hasText: '8.15' });
  await bestRow.getByRole('button', { name: /Delete attempt/ }).click();
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.locator('#solutions-attempt-count')).toHaveText('Attempts: 2');
  await go(page, '/progress.html'); await expect(page.locator('#progress-mastery-summary')).toHaveText('0 mastered · 1 checked');
  await go(page, '/tasks.html?route=instructions');
  await page.locator('#catalog-status').selectOption('needs-work'); await expect(page.locator('#task-grid article')).toHaveCount(1);
  await page.locator('#clear-filters').click(); await page.locator('#catalog-status').selectOption('mastered'); await expect(page.locator('#catalog-empty')).toBeVisible();
  await go(page, '/task.html?id=t001');
  await expect(page.locator('#task-route .practice-status')).toHaveText('Needs revision');
  await expect(page.locator('#comparison-total')).toHaveText('Total change: +1.20');
  await expect(page.locator('#task-quota')).toContainText('7 of 10');
  expect(errors).toEqual([]);
});
