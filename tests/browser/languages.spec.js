'use strict';

import { test, expect } from '@playwright/test';

async function go(page, path) {
  await page.goto(path); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
}
async function language(page, code) {
  await page.locator(`[data-language="${code}"]`).click();
  await expect(page.locator('html')).toHaveAttribute('lang', code);
}
async function register(page) {
  await go(page, '/register.html');
  await page.locator('#register-name').fill('Master');
  await page.locator('#register-email').fill(`locale-${crypto.randomUUID()}@example.com`);
  await page.locator('#register-interest').selectOption('data-analysis');
  await page.locator('#register-password').fill('Practice!123');
  await expect(page.locator('#password-checklist img')).toHaveCount(5);
  await expect(page.locator('#password-checklist img[src$="/check.svg"]')).toHaveCount(5);
  await page.locator('#register-password-confirm').fill('Practice!123');
  await page.locator('#register-level-beginner').check();
  await page.locator('#register-accept-rules').check(); await page.locator('#register-accept-privacy').check();
  await page.locator('#register-submit').click();
  await expect(page.locator('#register-success')).toBeVisible();
}

test('switching persists between pages and reloads without resetting input, validation or draft', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await go(page, '/register.html');
  await page.locator('#register-submit').click();
  await language(page, 'ru'); await expect(page.locator('#register-name-error')).toContainText('Введите имя');
  await page.locator('#register-name').fill('Master');
  await expect(page.locator('#register-name-error')).toBeEmpty();
  await page.locator('#register-password').fill('Practice!123');
  await language(page, 'kk');
  await expect(page.locator('#register-name')).toHaveValue('Master');
  await expect(page.locator('#register-password')).toHaveValue('Practice!123');
  await expect(page.locator('#password-checklist .visually-hidden').first()).toHaveText('Орындалды');
  await expect(page.locator('#register-name-error')).toBeEmpty();
  await expect(page.locator('#register-submit')).toHaveText('Тіркелу');
  await language(page, 'en'); await expect(page.locator('#register-submit')).toHaveText('Register');
  await go(page, '/task.html?id=t002');
  const input = await page.locator('#task-input-data pre').textContent();
  await page.locator('#prompt-input').fill('Master {title} — мой черновик');
  await language(page, 'ru'); await expect(page.locator('#task-title')).toHaveText('Сводка продаж');
  await expect(page.locator('#task-input-data pre')).toHaveText(input);
  await expect(page.locator('#prompt-input')).toHaveValue('Master {title} — мой черновик');
  await expect(page.locator('#task-requirements')).toContainText('аналитика');
  await language(page, 'kk'); await expect(page.locator('#task-title')).toHaveText('Сатылымдар қорытындысы');
  await expect(page.locator('#prompt-input')).toHaveValue('Master {title} — мой черновик');
  await page.reload(); await expect(page.locator('html')).toHaveAttribute('lang', 'kk');
  await expect(page.locator('#prompt-input')).toHaveValue('Master {title} — мой черновик');
  await go(page, '/tasks.html'); await expect(page.locator('html')).toHaveAttribute('lang', 'kk');
  await page.locator('#task-search').fill('сатылым'); await expect(page.locator('#task-grid article')).toHaveCount(2);
  await page.locator('#clear-filters').click(); await expect(page.locator('#task-grid article')).toHaveCount(16);
  await language(page, 'en'); await expect(page.locator('#clear-filters')).toHaveText('Clear filters');
  expect(errors).toEqual([]);
});

test('selected language reaches AI requests; user content, history and checkout stay intact on switch', async ({ page }) => {
  await register(page);
  await language(page, 'ru');
  await expect(page.locator('#register-success a')).toHaveCount(1);
  await go(page, '/task.html?id=t006');
  await page.locator('#prompt-input').fill('Master');
  const request = page.waitForRequest(request => request.url().endsWith('/api/evaluate'));
  await page.locator('#submit-btn').click(); expect((await request).postDataJSON().locale).toBe('ru');
  await expect(page.locator('#final-score')).toHaveText('8.00');
  await expect(page.locator('#task-quota')).toContainText('9 из 10');
  await language(page, 'kk'); await expect(page.locator('#prompt-success')).toHaveText('Test fixture feedback. This is not a live AI result.');
  await expect(page.locator('#task-quota')).not.toContainText(/\bM\d{1,2}\b/);
  await expect(page.locator('#history-list')).toContainText('Master');
  await go(page, '/profile.html#subscription'); await expect(page.locator('#profile-name')).toHaveText('Master');
  await page.locator('#open-profile-settings').click();
  await page.locator('#edit-profile-bio').fill('Clear — unsaved bio');
  await page.locator('#settings-nav-appearance').click(); await page.locator('#settings-language').selectOption('en');
  await page.locator('#settings-nav-profile').click(); await expect(page.locator('#edit-profile-bio')).toHaveValue('Clear — unsaved bio');
  await page.locator('#settings-close').click(); await page.locator('#settings-discard').click();
  await page.getByRole('button', { name: 'Set up test Pro' }).click();
  await page.locator('#demo-agreement').check(); await language(page, 'ru'); await expect(page.locator('#demo-agreement')).toBeChecked();
  await page.locator('#subscription button[type="submit"]').click(); await expect(page.locator('#subscription')).toContainText('Тестовый Pro действует');
  await language(page, 'en'); await expect(page.locator('#subscription')).toContainText('Test Pro is active');
  await go(page, '/my-solutions.html'); await language(page, 'kk');
  await expect(page.locator('#solutions-body')).toContainText('Фитнес қосымшасының идеялары');
});

test('all languages fit all pages on phone, tablet and desktop without script errors', async ({ page }) => {
  test.setTimeout(120000);
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  for (const locale of ['ru', 'kk', 'en']) {
    await go(page, '/'); await language(page, locale);
    for (const width of [375, 768, 1024, 1200, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      let headerBaseline;
      for (const path of ['/', '/tasks.html', '/task.html?id=t003', '/register.html', '/login.html', '/profile.html', '/my-solutions.html', '/progress.html', '/leaderboard.html', '/how-it-works.html']) {
        await go(page, path); await expect(page.locator('#app-status')).toBeHidden();
        expect(await page.locator('.nav-links a').evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual([
          'tasks.html', 'my-solutions.html', 'progress.html', 'leaderboard.html', 'how-it-works.html'
        ]);
        const header = await page.evaluate(async () => {
          await document.fonts.ready;
          return [...document.querySelectorAll('.header-inner .brand, .header-inner a.nav-link, .nav-actions a, .language-switcher, #navigation-toggle')]
            .filter(node => node.getClientRects().length)
            .map(node => {
              const { x, y, width, height } = node.getBoundingClientRect();
              return { id: node.id || node.className, bounds: [x, y, width, height].map(value => Math.round(value * 100) / 100) };
            });
        });
        headerBaseline ??= header;
        expect(header, `${locale} ${path} header shifts at ${width}px`).toEqual(headerBaseline);
        for (let index = 1; index < header.length; index++) {
          const previous = header[index - 1].bounds;
          expect(header[index].bounds[0], `${locale} ${path} header overlaps at ${width}px`).toBeGreaterThanOrEqual(previous[0] + previous[2] - 0.1);
        }
        await expect(page.locator('html')).toHaveAttribute('lang', locale);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${locale} ${path} overflows at ${width}px`).toBeTruthy();
        await expect(page.locator(`[data-language="${locale}"]`)).toHaveAttribute('aria-pressed', 'true');
        if (locale !== 'en' && width === 1440) {
          const untranslated = await page.evaluate(async locale => {
            const { messages } = await import('/js/locales/messages.js');
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            const found = [];
            while (walker.nextNode()) {
              const node = walker.currentNode;
              if (node.parentElement.closest('script,style,svg,pre,code,textarea,[data-i18n-ignore]')) continue;
              const source = node.data.trim().replace(/\s+/g, ' ');
              const translation = messages[source]?.[locale === 'ru' ? 0 : 1];
              if (translation && translation !== source) found.push(source);
            }
            return found;
          }, locale);
          expect(untranslated, `${locale} ${path} has untranslated interface text`).toEqual([]);
        }
      }
    }
  }
  expect(errors).toEqual([]);
});

test('first visit uses supported browser language and manual choice overrides it', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'ru-RU' }); const page = await context.newPage();
  await go(page, '/tasks.html'); await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page.locator('#task-grid')).toContainText('Сводка продаж');
  await language(page, 'en'); await page.reload(); await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#clear-filters')).toHaveText('Clear filters');
  await context.close();
});
