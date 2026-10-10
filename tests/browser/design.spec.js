'use strict';

import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const evidence = 'screenshots/redesign';
const pages = [['home', '/'], ['catalog', '/tasks.html'], ['task', '/task.html?id=t002'],
  ['login', '/login.html'], ['register', '/register.html'], ['profile', '/profile.html'],
  ['history', '/my-solutions.html'], ['progress', '/progress.html'], ['ranking', '/leaderboard.html'], ['guide', '/how-it-works.html']];

async function go(page, path) {
  await page.goto(path);
  await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('#app-status')).toBeHidden();
}

async function fits(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
}

// The screenshots are review artifacts; headings/overflow and behavior are the regression checks.
test('every redesigned page has a clear main heading and fits desktop and narrow phones in Russian', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem('pf-language', 'ru'));
  await mkdir(evidence, { recursive: true });
  for (const [name, path] of pages) {
    for (const [size, width] of [['desktop', 1440], ['phone', 390], ['narrow', 320]]) {
      await page.setViewportSize({ width, height: 900 }); await go(page, path);
      await expect(page.locator('main h1')).toHaveCount(1);
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
      await fits(page);
      if (size !== 'narrow') await page.screenshot({ path: `${evidence}/${name}-${size}.png`, fullPage: true });
    }
  }
  expect(errors).toEqual([]);
});

test('phone navigation supports keyboard, dismissal, links, language changes and desktop resizing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 }); await go(page, '/tasks.html');
  const toggle = page.locator('#navigation-toggle'); const nav = page.locator('#primary-nav');
  await expect(nav).toBeHidden(); await expect(nav).toHaveJSProperty('inert', true);
  await toggle.click(); await expect(nav).toBeVisible(); await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.locator('[data-language="ru"]').click(); await expect(nav).toBeVisible();
  await toggle.focus(); await page.keyboard.press('Tab'); await expect(page.locator('header .brand')).toBeFocused();
  await page.keyboard.press('Shift+Tab'); await expect(toggle).toBeFocused();
  await page.keyboard.press('Escape'); await expect(nav).toBeHidden(); await expect(toggle).toBeFocused();
  await toggle.click(); await page.mouse.click(10, 880); await expect(nav).toBeHidden();
  await toggle.click(); await page.locator('.nav-links a[href="my-solutions.html"]').click();
  await expect(page).toHaveURL(/my-solutions/); await expect(nav).toBeHidden();
  await toggle.click(); await page.setViewportSize({ width: 1440, height: 900 });
  await expect(nav).toBeVisible(); await expect(nav).toHaveJSProperty('inert', false);
  await expect(toggle).toBeHidden(); await expect(page.locator('body')).not.toHaveClass(/menu-open/);
  await page.setViewportSize({ width: 390, height: 480 });
  await expect(nav).toBeHidden(); await toggle.click();
  const bounds = await nav.boundingBox(); expect(bounds.y + bounds.height).toBeLessThanOrEqual(480);
  await page.setViewportSize({ width: 390, height: 900 });
  await page.screenshot({ path: `${evidence}/navigation-phone.png`, fullPage: true });
});

test('guest draft survives account creation, hidden invalid fields open, and populated pages work on phones', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 900 }); await go(page, '/task.html?id=t002');
  await expect(page.locator('.source-disclosure')).toHaveJSProperty('open', true);
  await page.locator('.task-jump').click(); await expect(page.locator('#prompt-input')).toBeInViewport();
  const draft = 'You are a data analyst. Summarize quarterly sales in five numbered items, at most 150 words. Use only the provided totals.';
  await page.locator('#prompt-input').fill(draft); await page.locator('#submit-btn').click();
  await expect(page).toHaveURL(/login\.html\?next=/); await page.locator('#login-link-1').click();
  await expect(page).toHaveURL(/register\.html\?next=/);
  await page.locator('#register-name').fill('Practice Student');
  await page.locator('#register-email').fill(`redesign-${crypto.randomUUID()}@example.com`);
  await page.locator('#register-interest').selectOption('data-analysis');
  await page.locator('#register-password').fill('Practice!123');
  await page.locator('#register-password-confirm').fill('Practice!123');
  await page.locator('#register-accept-rules').check(); await page.locator('#register-accept-privacy').check();
  const optional = page.locator('.optional-fields');
  await optional.locator('summary').click(); await page.locator('#register-tel').fill('abc');
  await optional.locator('summary').click(); await page.locator('#register-submit').click();
  await expect(optional).toHaveJSProperty('open', true); await expect(page.locator('#register-tel')).toBeFocused();
  await page.locator('#register-tel').fill('+7 777 123 45 67'); await page.locator('#register-submit').click();
  await expect(page.locator('#register-success')).toBeVisible();
  await page.locator('#register-success a').click(); await expect(page.locator('#prompt-input')).toHaveValue(draft);
  await expect(page.locator('#draft-status')).toContainText('saved to your account');
  await expect(page.locator('.task-resources')).toBeVisible();
  expect((await page.locator('.task-resources').boundingBox()).y).toBeGreaterThan((await page.locator('#prompt-form').boundingBox()).y);
  await page.locator('#submit-btn').click(); await expect(page.locator('#final-score')).toHaveText('8.00');
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: `${evidence}/task-result-phone.png`, fullPage: true });
  await go(page, '/my-solutions.html'); await expect(page.locator('#solutions-body tr')).toHaveCount(1);
  await expect(page.getByRole('rowheader', { name: 'Quarterly sales summary' })).toBeVisible();
  await fits(page); await page.screenshot({ path: `${evidence}/history-populated-phone.png`, fullPage: true });
  await page.locator('#solutions-body a').click(); await expect(page.locator('#final-score')).toHaveText('8.00');
  await go(page, '/progress.html'); await expect(page.locator('#leaderboard-body')).toContainText('Quarterly sales summary');
  await fits(page); await page.screenshot({ path: `${evidence}/progress-populated-phone.png`, fullPage: true });
  await go(page, '/profile.html'); await expect(page.locator('#profile-total-points')).toHaveText('8.00');
  await expect(page.locator('#profile-settings')).toHaveJSProperty('open', false);
  await fits(page); await page.screenshot({ path: `${evidence}/profile-populated-phone.png`, fullPage: true });
  await page.getByRole('button', { name: 'Set up test Pro' }).click();
  await page.locator('#demo-agreement').check(); await page.locator('[data-language="kk"]').click();
  await fits(page);
  await page.locator('#subscription').screenshot({ path: `${evidence}/checkout-phone-kz.png` });
  await page.locator('#navigation-toggle').click();
  await page.keyboard.press('Escape'); await expect(page.locator('#primary-nav')).toBeHidden();
  await expect(page.locator('#navigation-toggle')).toBeFocused();
  await go(page, '/tasks.html');
  await page.locator('#navigation-toggle').click();
  await page.locator('#nav-profile').click();
  await expect(page).toHaveURL(/profile.html$/);
  await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('#primary-nav')).toBeHidden();
  await expect(page.locator('#nav-profile')).toHaveAttribute('aria-current', 'page');
  await page.setViewportSize({ width: 1440, height: 900 }); await go(page, '/tasks.html');
  await page.locator('#nav-profile').focus(); await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/profile.html$/);
  await expect(page.locator('#profile-logout')).toBeVisible();
  await page.route('**/api/logout', route => route.fulfill({ status: 503, json: { message: 'The service is unavailable. Try again later.' } }), { times: 1 });
  await page.locator('#profile-logout').click();
  await expect(page.locator('#app-status')).toBeVisible();
  await expect(page.locator('#profile-logout')).toBeEnabled();
  expect((await page.request.get('/api/state')).ok()).toBeTruthy();
  await page.locator('#profile-logout').click();
  await expect(page).toHaveURL(/login.html$/);
  await expect(page.locator('#nav-profile')).toHaveClass(/is-hidden/);
  expect((await (await page.request.get('/api/state')).json()).user).toBeNull();
  expect(errors).toEqual([]);
});

test('direct privacy and rules links open their collapsed content', async ({ page }) => {
  await go(page, '/how-it-works.html#privacy-policy');
  await expect(page.locator('#privacy-policy')).toHaveJSProperty('open', true);
  await expect(page.locator('#community-guidelines')).toHaveJSProperty('open', false);
  await go(page, '/how-it-works.html#community-guidelines');
  await expect(page.locator('#community-guidelines')).toHaveJSProperty('open', true);
});
