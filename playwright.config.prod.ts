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
  // CI runners (e.g. GitHub Actions standard, 2 cores) thrash with 4 workers;
  // run sequentially there. Local dev gets 4× parallelism.
  workers: process.env.CI ? 1 : 4,
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
      // iPhone 14 device descriptor (viewport, UA, isMobile, hasTouch) but
      // forced onto Chromium so we don't require a WebKit install. Spreading
      // the descriptor keeps us in sync with Playwright's device database.
      name: 'mobile',
      use: {
        ...devices['iPhone 14'],
        browserName: 'chromium',
      },
      testMatch: ['prod-comprehensive.spec.ts'],
      grep: /@mobile/,
    },
  ],
});
