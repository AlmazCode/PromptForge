'use strict';

import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

async function go(page, path) {
  await page.goto(path);
  await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
}
async function completeRegistration(page) {
  await page.locator('#register-name').fill('First-time Student');
  await page.locator('#register-email').fill(`usability-${crypto.randomUUID()}@example.com`);
  await page.locator('#register-interest').selectOption('copywriting');
  await page.locator('#register-password').fill('Practice!123');
  await page.locator('#register-password-confirm').fill('Practice!123');
  await page.locator('#register-accept-rules').check();
  await page.locator('#register-accept-privacy').check();
  await page.locator('#register-submit').click();
  await expect(page.locator('#register-success')).toBeVisible();
}

test('first exercise keeps the guest draft through registration and makes the next action match the result', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await go(page, '/');
  await expect(page.locator('#home-first-exercise')).toBeInViewport();
  await page.locator('#home-first-exercise').click();
  await expect(page).toHaveURL(/task.html\?id=t001$/);
  await expect(page.locator('.source-disclosure')).toHaveJSProperty('open', true);
  await page.locator('.task-jump').click();
  await expect(page.locator('#prompt-guidance')).toBeInViewport();
  await expect(page.locator('#prompt-input')).toBeInViewport();
  const draft = 'TRAINING_FIXTURE_LOW\nWrite a LinkedIn post about SprintNote.';
  await page.locator('#prompt-input').fill(draft);
  await page.locator('#submit-btn').click();
  await expect(page).toHaveURL(/login.html\?next=task.html%3Fid%3Dt001$/);
  await page.locator('#login-link-1').click();
  await completeRegistration(page);
  await expect(page.locator('#register-name')).toBeHidden();
  await expect(page.locator('#register-success a')).toBeFocused();
  await expect(page.locator('#register-success a')).toHaveText('Return to your task');
  await page.locator('#register-success a').click();
  await expect(page.locator('#prompt-input')).toHaveValue(draft);
  await page.locator('#submit-btn').click();
  await expect(page.locator('#final-score')).toHaveText('4.80');
  await expect(page.locator('#revision-focus')).toContainText('Start with:');
  await expect(page.locator('.criterion-result.is-focus')).toHaveCount(1);
  await expect(page.locator('#retry-btn')).toHaveClass(/btn-primary/);
  await page.locator('#retry-btn').click();
  await expect(page.locator('#prompt-input')).toBeFocused();
  await page.locator('#prompt-input').fill('TRAINING_FIXTURE_HIGH\nAct as a B2B copywriter. Write a professional LinkedIn post for remote teams, under 120 words.');
  await page.locator('#submit-btn').click();
  await expect(page.locator('#final-score')).toHaveText('8.15');
  await expect(page.locator('.criterion-result.is-focus')).toHaveCount(0);
  await expect(page.locator('#next-task-btn')).toHaveClass(/btn-primary/);
  await expect(page.locator('#comparison-total')).toHaveText('Total change: +3.35');
  await expect(page.locator('#task-quota')).toContainText('8 of 10');
  await mkdir('screenshots/usability', { recursive: true });
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: 'screenshots/usability/first-result-phone.png', fullPage: true });
  await page.locator('#next-task-btn').click();
  await expect(page).toHaveURL(/task.html\?id=t005$/);
});

test('catalog starts within the first screen; empty pages, draft recovery and plan checkout provide usable actions', async ({ page }) => {
  for (const locale of ['en', 'ru', 'kk']) {
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await go(page, '/tasks.html');
      await page.locator(`[data-language="${locale}"]`).click();
      await expect(page.locator('#catalog-courses')).toHaveJSProperty('open', false);
      await expect(page.locator('#task-grid article').first().locator('.exercise-start')).toBeInViewport();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    }
  }
  await page.locator('[data-language="en"]').click();
  await go(page, '/my-solutions.html');
  await expect(page.locator('.history-controls')).toBeHidden();
  await expect(page.locator('#solutions-body')).toHaveText('Your saved attemptsLog in to view your results or start with a practice exercise.Log inTry the first exercise');
  await go(page, '/profile.html');
  await expect(page.locator('#subscription')).toBeHidden();
  await go(page, '/profile.html#subscription');
  await expect(page.locator('#subscription')).toBeVisible();
  await go(page, '/register.html'); await completeRegistration(page);
  await go(page, '/progress.html');
  await expect(page.locator('#progress-empty')).toBeVisible();
  await expect(page.locator('.progress-overview')).toBeHidden();
  await expect(page.locator('#progress-login')).toBeHidden();
  await page.locator('#progress-empty .btn-primary').click();
  await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  const draft = 'A draft I can resume from history.';
  await page.locator('#prompt-input').fill(draft); await page.locator('#prompt-input').blur();
  await expect(page.locator('#draft-status')).toContainText('saved to your account');
  await go(page, '/my-solutions.html');
  await expect(page.locator('#solutions-average-score')).toHaveText('—');
  await expect(page.locator('#solutions-drafts a')).toHaveCount(1);
  await page.locator('#solutions-drafts a').click();
  await expect(page.locator('#prompt-input')).toHaveValue(draft);
  await page.locator('#submit-btn').click(); await expect(page.locator('#final-score')).toHaveText('8.00');
  await go(page, '/my-solutions.html');
  await expect(page.locator('#solutions-drafts')).toBeHidden();
  await page.getByRole('searchbox', { name: 'Search attempts' }).fill('no-such-attempt');
  await page.getByRole('button', { name: 'Reset search', exact: true }).click();
  await expect(page.locator('#solutions-body tr')).toHaveCount(1);
  await expect(page.getByRole('searchbox', { name: 'Search attempts' })).toBeFocused();
  await go(page, '/profile.html#subscription');
  const setup = page.getByRole('button', { name: 'Set up test Pro' });
  await setup.click(); await expect(page.locator('.plan-cards')).toBeHidden();
  await page.locator('#subscription').getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.locator('.plan-cards')).toBeVisible(); await expect(setup).toBeFocused();
  await go(page, '/how-it-works.html#feedback');
  await expect(page.locator('#feedback')).toHaveJSProperty('open', true);
  await expect(page.locator('#fb-message')).toBeVisible();
});
