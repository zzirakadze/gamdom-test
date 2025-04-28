import { defineConfig } from '@playwright/test';
import { BASE_URL } from './src/config/env';

export default defineConfig({
  testDir: './src/tests',
  workers: 4,
  timeout: 30 * 1000,
  expect: {
    timeout: 120000
  },
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    baseURL: BASE_URL,
  },
});
