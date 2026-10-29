import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  
  use: {
    baseURL: process.env.UI_BASE_URL || 'https://practicesoftwaretesting.com',
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    testIdAttribute: 'data-test', // Practice Software Testing uses data-test="..." attributes!
  },

  projects: [
    {
      name: 'api-tests',
      testDir: './tests/api',
      use: {
        baseURL: process.env.API_BASE_URL || 'https://api.practicesoftwaretesting.com',
      },
    },
    {
      name: 'chromium-ui-and-hybrid',
      testDir: './tests',
      testIgnore: ['**/tests/api/**'],
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});