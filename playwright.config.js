'use strict';

import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

export default defineConfig({
  testDir: './tests/browser',
  testMatch: 'frontend.spec.js',
  outputDir: '/tmp/promptforge-frontend-tests',
  timeout: 60000,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:3101',
    channel:
      !process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE && existsSync('/opt/google/chrome/chrome')
        ? 'chrome'
        : undefined,
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : {},
    headless: true,
  },
  webServer: {
    command: 'python3 -m http.server 3101 --bind 127.0.0.1',
    url: 'http://127.0.0.1:3101',
    reuseExistingServer: false,
    stdout: 'ignore',
    stderr: 'ignore',
  },
});
