'use strict';

import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

export default defineConfig({
  testDir: './tests/browser',
  timeout: 60000,
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:3101', channel: !process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE && existsSync('/opt/google/chrome/chrome') ? 'chrome' : undefined, launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {}, headless: true },
  webServer: { command: 'node tests/browser-server.js', url: 'http://127.0.0.1:3101/api/state', reuseExistingServer: false }
});
