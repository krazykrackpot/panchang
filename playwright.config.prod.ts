import { defineConfig, devices } from '@playwright/test';

// Production-target Playwright config.
// - NO local webServer (we hit the deployed site)
// - Longer navigation timeout to absorb cold ISR + CDN warmup
// - Two projects: Desktop Chrome + mobile iPhone for responsive checks
//
// Run: npx playwright test --config=playwright.config.prod.ts
export default defineConfig({
  testDir: './e2e',
  testMatch: ['post-deploy-smoke.spec.ts', 'prod-comprehensive.spec.ts'],
  fullyParallel: true,
  workers: 4,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 90000,
  expect: { timeout: 15000 },
  use: {
    baseURL: 'https://dekhopanchang.com',
    trace: 'on-first-retry',
    navigationTimeout: 45000,
    actionTimeout: 15000,
    ignoreHTTPSErrors: false,
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // iPhone 14 viewport on Chromium (no WebKit dependency)
      name: 'mobile',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        isMobile: false,
        hasTouch: true,
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      },
      testMatch: ['prod-comprehensive.spec.ts'],
      grep: /@mobile/,
    },
  ],
});
