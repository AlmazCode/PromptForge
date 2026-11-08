'use strict';

import { test, expect } from '@playwright/test';

async function open(page, path = '/') {
  await page.goto(path);
  await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('#app-status')).toBeHidden();
}

const prompt =
  'Act as an editor. Write a friendly summary for customers. Return a numbered list in at most 100 words. Example: One clear point.';
test('simple task saves a draft and a result without a login or quota', async ({ page }) => {
  await open(page, '/task.html?id=t001');
  await page.locator('#prompt-input').fill(prompt);
  await page.reload();
  await expect(page.locator('#prompt-input')).toHaveValue(prompt);
  await page.locator('#submit-btn').click();
  await expect(page.locator('#final-score')).toHaveText('10.00');
  await expect(page.locator('#prompt-success')).toContainText('Local demonstration');
  await open(page, '/my-solutions.html');
  await expect(page.locator('#solutions-body tr')).toHaveCount(1);
  await expect(page.locator('#solutions-body')).toContainText('LinkedIn');
  await page.locator('[data-action="review-attempt"]').click();
  await expect(page.locator('#prompt-input')).toHaveValue(prompt);
  await expect(page.locator('#final-score')).toHaveText('10.00');
});

test('catalogue filters generated cards and delegated buttons survive filtering', async ({
  page,
}) => {
  await open(page, '/tasks.html');
  await expect(page.locator('#task-grid article')).toHaveCount(16);
  await page.locator('#task-search').fill('linkedin');
  await expect(page.locator('#task-grid article')).toHaveCount(1);
  await page.locator('#catalog-difficulty').selectOption('advanced');
  await expect(page.locator('#catalog-empty')).toBeVisible();
  await page.locator('[data-action="clear-filters"]').first().click();
  await expect(page.locator('#task-grid article')).toHaveCount(16);
  await page.locator('#task-search').fill('sales');
  await page.locator('#task-grid button.exercise-start').first().click();
  await expect(page).toHaveURL(/task.html\?id=t\d{3}/);
});

test('registration shows field errors, toggles passwords and stores only profile fields', async ({
  page,
}) => {
  await open(page, '/register.html');
  await page.locator('#register-submit').click();
  await expect(page.locator('#register-name')).toBeFocused();
  await expect(page.locator('#register-name-error')).not.toBeEmpty();
  await page.locator('#register-name').fill('Study Student');
  await expect(page.locator('#register-name-error')).toBeEmpty();
  await page.locator('#register-email').fill('student@example.com');
  await page.locator('#register-password').fill('Example123!');
  await page.locator('#register-password-confirm').fill('Example123!');
  await page.locator('.password-toggle').first().click();
  await expect(page.locator('#register-password')).toHaveAttribute('type', 'text');
  await page.locator('#register-accept-rules').check();
  await page.locator('#register-accept-privacy').check();
  await page.locator('#register-submit').click();
  await expect(page.locator('#register-success')).toBeVisible();
  await expect(page.locator('#register-password')).toHaveValue('');
  const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }));
  expect(stored).not.toContain('Example123!');
  await open(page, '/profile.html');
  await expect(page.locator('#profile-name')).toHaveText('Study Student');
  await page.locator('#profile-logout').click();
  await expect(page.locator('#profile-name')).toHaveText('Guest');
});

test('feedback validates phone and email, resets and keeps user text literal', async ({ page }) => {
  await open(page, '/how-it-works.html#feedback');
  await page.locator('#fb-name').fill('<img src=x onerror=alert(1)>');
  await page.locator('#fb-email').fill('bad');
  await page.locator('#fb-phone').fill('-------');
  await page.locator('#fb-message').fill('A useful message about learning to write clear prompts.');
  await page.locator('#feedback-submit').click();
  await expect(page.locator('#fb-email-error')).not.toBeEmpty();
  await expect(page.locator('#fb-phone-error')).not.toBeEmpty();
  await page.locator('#fb-email').fill('student@example.com');
  await page.locator('#fb-phone').fill('+7 (701) 123-45-67');
  await expect(page.locator('#fb-email-error')).toBeEmpty();
  await expect(page.locator('#fb-phone-error')).toBeEmpty();
  await page.locator('#feedback-submit').click();
  await expect(page.locator('#feedback-success')).toBeVisible();
  await expect(page.locator('#feedback-summary')).toContainText('<img src=x onerror=alert(1)>');
  await expect(page.locator('#feedback-summary img')).toHaveCount(0);
  await expect(page.locator('#fb-name')).toHaveValue('');
  await page.locator('#fb-name').fill('Another student');
  await expect(page.locator('#feedback-success')).toBeHidden();
  await expect(page.locator('#feedback-summary')).toBeHidden();
});

test('history deletion updates the personal results table', async ({ page }) => {
  await open(page, '/task.html?id=t002');
  await page.locator('#prompt-input').fill(prompt);
  await page.locator('#submit-btn').click();
  await open(page, '/leaderboard.html');
  await expect(page.locator('#leaderboard-body')).toContainText('Quarterly sales');
  await open(page, '/my-solutions.html');
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('[data-action="delete-attempt"]').click();
  await expect(page.locator('#solutions-body')).toContainText('No attempts yet');
  await open(page, '/leaderboard.html');
  await expect(page.locator('#leaderboard-body')).toContainText('No attempts yet');
});

test('all nine pages have working content and no console errors at mobile and desktop sizes', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (entry) => {
    if (entry.type() === 'error') errors.push(entry.text());
  });
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      'index.html',
      'tasks.html',
      'task.html',
      'register.html',
      'login.html',
      'profile.html',
      'my-solutions.html',
      'leaderboard.html',
      'how-it-works.html',
    ]) {
      await open(page, '/' + path);
      await expect(page.locator('main h1')).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        path,
      ).toBe(true);
      await expect(
        page.locator('[data-language], #catalog-routes, #open-profile-settings'),
      ).toHaveCount(0);
    }
    await page.screenshot({ path: test.info().outputPath(`guide-${width}.png`), fullPage: true });
  }
  expect(errors).toEqual([]);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.locator('#navigation-toggle').click();
  await expect(page.locator('#navigation-toggle')).toHaveAttribute('aria-expanded', 'true');
});

test('FAQ keyboard controls and offline jQuery fallback work', async ({ page }) => {
  await page.route('https://code.jquery.com/**', (route) => route.abort('failed'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page, '/how-it-works.html');
  const summary = page.locator('#faq summary').first();
  await summary.click();
  await expect(page.locator('#faq details').first().locator('.faq-answer')).toBeVisible();
  await summary.press('Enter');
  await expect(page.locator('#faq details').first()).not.toHaveAttribute('open');
});

test('storage failure is reported without a success message', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('blocked');
    };
  });
  await open(page, '/login.html');
  await page.locator('#login-email').fill('student@example.com');
  await page.locator('#login-password').fill('Example123!');
  await page.locator('#login-submit').click();
  await expect(page.locator('#login-error')).toContainText('not saved');
  await expect(page.locator('#login-success')).toBeHidden();
});

test('review preserves legacy criterion scores instead of recomputing them', async ({ page }) => {
  await page.addInitScript(() => {
    const criteria = Object.fromEntries(
      ['role', 'format', 'length', 'examples', 'tone', 'clarity'].map((id) => [id, { score: 2 }]),
    );
    localStorage.setItem(
      'promptforge.frontend-demo.v1',
      JSON.stringify({
        profile: null,
        attempts: [
          {
            id: 'old-attempt',
            taskId: 't001',
            prompt: 'hello',
            score: 2,
            criteria,
            createdAt: 1700000000000,
          },
        ],
        drafts: {},
      }),
    );
  });
  await open(page, '/task.html?id=t001&attempt=old-attempt');
  await expect(page.locator('#final-score')).toHaveText('2.00');
  await expect(page.locator('#score-role')).toHaveText('2');
  await expect(page.locator('#score-format')).toHaveText('2');
});

test('draft save fails after prior success without keeping a false saved status', async ({
  page,
}) => {
  await open(page, '/task.html?id=t001');
  await page.locator('#prompt-input').fill('An initial draft');
  await expect(page.locator('#draft-status')).toHaveText('Draft saved in this browser.');
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error('blocked');
    };
  });
  await page.locator('#prompt-input').fill('An edited draft that cannot be saved');
  await expect(page.locator('#draft-status')).toContainText('not saved');
  await expect(page.locator('#app-status')).toBeVisible();
});

test('registration keeps unrelated errors and clears a corrected password confirmation', async ({ page }) => {
  await open(page, '/register.html');
  await page.locator('#register-submit').click();
  await page.locator('#register-name').fill('Final Student');
  await expect(page.locator('#register-name-error')).toBeEmpty();
  await expect(page.locator('#register-email-error')).not.toBeEmpty();
  await page.locator('#register-password').fill(' Practice!123 ');
  await page.locator('#register-password-confirm').fill(' Different!123 ');
  await page.locator('#register-submit').click();
  await expect(page.locator('#register-password-confirm-error')).not.toBeEmpty();
  await page.locator('#register-password').fill(' Different!123 ');
  await expect(page.locator('#register-password-confirm-error')).toBeEmpty();
  await expect(page.locator('#register-email-error')).not.toBeEmpty();
  await page.locator('#register-accept-rules').check();
  await expect(page.locator('#register-accept-rules-error')).toBeEmpty();
  await expect(page.locator('#register-accept-privacy-error')).not.toBeEmpty();
});

test('login waits for its handlers and provides a safe task continuation without storing passwords', async ({ page }) => {
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  await page.route('**/js/auth.js', async route => { await gate; await route.continue(); }, { times: 1 });
  await page.goto('/login.html?next=task.html%3Fid%3Dt002');
  await expect(page.locator('#login-submit')).toBeDisabled();
  await page.locator('#login-email').fill('student@example.com');
  await page.locator('#login-password').fill(' Practice!123 ');
  await page.locator('#login-form').evaluate(form => form.requestSubmit());
  expect(page.url()).not.toContain('password=');
  release();
  await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('#nav-register')).toHaveAttribute('href', 'register.html?next=task.html%3Fid%3Dt002');
  await page.locator('#login-submit').click();
  await expect(page.locator('#login-success a')).toHaveAttribute('href', 'task.html?id=t002');
  await expect(page.locator('#login-password')).toHaveValue('');
  expect(await page.evaluate(() => JSON.stringify({ ...localStorage }))).not.toContain('Practice!123');
  await open(page, '/profile.html');
  await expect(page.locator('#profile-average-score')).toHaveText('—');
  await page.locator('#profile-logout').click();
  await open(page, '/login.html?next=https%3A%2F%2Fexample.com');
  await page.locator('#login-email').fill('student@example.com');
  await page.locator('#login-password').fill('Practice!123');
  await page.locator('#login-submit').click();
  await expect(page.locator('#login-success a')).toHaveAttribute('href', 'profile.html');
});
